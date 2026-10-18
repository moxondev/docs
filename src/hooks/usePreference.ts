import { useCallback, useSyncExternalStore } from "react";

export interface PreferenceStorage {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
}

// Event sent to this tab after a write; other tabs receive the native storage event
export const PREFERENCE_EVENT = "moxon:preference";

/**
 * Writes that localStorage refused (private mode, blocked site data, full quota), kept for the
 * visit; null records a removal.
 */
const MEMORY = new Map<string, string | null>();

/**
 * Gives the browser storage; reading the property itself throws when site data is blocked.
 *
 * @returns window.localStorage
 */
function browserStorage(): PreferenceStorage {
    return window.localStorage;
}

/**
 * Reads a preference: the last write of this visit that storage refused, else the stored value.
 *
 * @param key - Storage key, a moxon-* key such as moxon-code-lang or moxon-recent
 * @param storage - Storage getter, the browser's by default (tests inject one); may throw
 * @returns The stored string, or null when nothing is saved or storage is unreadable
 */
export function readPreference(
    key: string,
    storage: () => PreferenceStorage = browserStorage,
): string | null {
    if (MEMORY.has(key)) return MEMORY.get(key) ?? null;
    try {
        return storage().getItem(key);
    } catch {
        return null;
    }
}

/**
 * Saves or removes a preference and tells the readers of this tab. When storage throws, the
 * value lives in memory until the page is left.
 *
 * @param key - Storage key, a moxon-* key such as moxon-code-lang or moxon-recent
 * @param value - New value; null removes the key
 * @param storage - Storage getter, the browser's by default (tests inject one); may throw
 */
export function writePreference(
    key: string,
    value: string | null,
    storage: () => PreferenceStorage = browserStorage,
): void {
    try {
        const target = storage();
        if (value === null) target.removeItem(key);
        else target.setItem(key, value);
        MEMORY.delete(key);
    } catch {
        MEMORY.set(key, value);
    }
    if (typeof window !== "undefined") window.dispatchEvent(new Event(PREFERENCE_EVENT));
}

/**
 * Subscribes to preference changes from this tab and from other tabs.
 *
 * @param onChange - Called whenever any stored preference may have changed
 * @returns The unsubscribe function
 */
function subscribe(onChange: () => void): () => void {
    window.addEventListener("storage", onChange);
    window.addEventListener(PREFERENCE_EVENT, onChange);
    return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(PREFERENCE_EVENT, onChange);
    };
}

/**
 * Gives the snapshot of the server render, which never sees stored preferences.
 *
 * @returns Null, which callers read as an unset preference
 */
function getServerSnapshot(): string | null {
    return null;
}

/**
 * Reads and writes a per-browser preference kept in localStorage, shared by every component that
 * reads the same key and synced across tabs. The static HTML and hydration see null.
 *
 * @param key - Storage key, a moxon-* key such as moxon-code-lang or moxon-recent
 * @returns The stored value (null when unset and during the server render) and its setter,
 * which removes the key when given null
 */
export function usePreference(key: string): [string | null, (value: string | null) => void] {
    const value = useSyncExternalStore(subscribe, () => readPreference(key), getServerSnapshot);
    const setValue = useCallback((next: string | null) => writePreference(key, next), [key]);
    return [value, setValue];
}
