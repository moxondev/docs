import { useSyncExternalStore } from "react";

/**
 * Subscribes to nothing: being hydrated never changes once true.
 *
 * @returns A no-op unsubscribe function
 */
function subscribe(): () => void {
    return () => {};
}

/**
 * Gives the snapshot of the browser, which renders after hydration.
 *
 * @returns True
 */
function getSnapshot(): boolean {
    return true;
}

/**
 * Gives the snapshot of the server render and of hydration.
 *
 * @returns False
 */
function getServerSnapshot(): boolean {
    return false;
}

/**
 * Tells whether the component renders in the browser after hydration, for markup that depends on
 * browser-only state (the resolved theme of next-themes), without a mounted flag set in an effect.
 *
 * @returns False during the server render and hydration, true afterwards
 */
export function useHydrated(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
