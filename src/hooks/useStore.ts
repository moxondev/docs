import { useSyncExternalStore } from "react";

export interface Store<T> {
    get: () => T;
    getInitial: () => T;
    set: (next: T | ((current: T) => T)) => void;
    subscribe: (listener: () => void) => () => void;
}

/**
 * Creates a small external store: one immutable value, replaced as a whole, and the listeners
 * to notify. React reads it through useStore, so a change re-renders only its readers.
 *
 * @param initial - First value, also the snapshot of the server render and of hydration
 * @returns The store; set ignores a value identical (Object.is) to the current one
 */
export function createStore<T>(initial: T): Store<T> {
    let value = initial;
    const listeners = new Set<() => void>();

    return {
        get: () => value,
        getInitial: () => initial,
        set: (next) => {
            const resolved = typeof next === "function" ? (next as (current: T) => T)(value) : next;
            if (Object.is(resolved, value)) return;
            value = resolved;
            for (const listener of [...listeners]) listener();
        },
        subscribe: (listener) => {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
    };
}

/**
 * Reads an external store and re-renders when it changes. The server render and hydration
 * read the initial value, so a store written in the browser never causes a mismatch.
 *
 * @param store - Store from createStore, usually a module-level singleton
 * @returns The current value
 */
export function useStore<T>(store: Store<T>): T {
    return useSyncExternalStore(store.subscribe, store.get, store.getInitial);
}
