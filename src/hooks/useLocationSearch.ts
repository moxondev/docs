import { useSyncExternalStore } from "react";

// Event sent after setQueryParam, since the History API never announces its own writes
export const LOCATION_EVENT = "moxon:location";

/**
 * Gives the Navigation API of the browser, whose currententrychange event also fires for the
 * pushState and replaceState calls of the App Router (a Link or router.push to the same page).
 *
 * @returns window.navigation, or undefined in a browser without the Navigation API
 */
function browserNavigation(): EventTarget | undefined {
    return (window as Window & { navigation?: EventTarget }).navigation;
}

/**
 * Subscribes to back and forward moves, to the history writes of the App Router (through the
 * Navigation API when the browser has it) and to the query writes of this module.
 *
 * @param onChange - Called whenever the query string may have changed
 * @returns The unsubscribe function
 */
function subscribe(onChange: () => void): () => void {
    const navigation = browserNavigation();

    // The App Router writes the address from an insertion effect, where React forbids updates
    const onEntry = () => queueMicrotask(onChange);
    window.addEventListener("popstate", onChange);
    window.addEventListener(LOCATION_EVENT, onChange);
    navigation?.addEventListener("currententrychange", onEntry);
    return () => {
        window.removeEventListener("popstate", onChange);
        window.removeEventListener(LOCATION_EVENT, onChange);
        navigation?.removeEventListener("currententrychange", onEntry);
    };
}

/**
 * Reads the current query string.
 *
 * @returns window.location.search, "" when empty
 */
function getSnapshot(): string {
    return window.location.search;
}

/**
 * Gives the snapshot of the static export, which has no query string at build time.
 *
 * @returns An empty query string
 */
function getServerSnapshot(): string {
    return "";
}

/**
 * Reads one parameter of a query string.
 *
 * @param search - Query string, with or without its leading "?"
 * @param name - Parameter name, case-sensitive
 * @returns The first value, or null when the parameter is absent
 */
export function queryParam(search: string, name: string): string | null {
    return new URLSearchParams(search).get(name);
}

/**
 * Sets or removes one parameter of a query string, keeping the others in their order.
 *
 * @param search - Query string, with or without its leading "?"
 * @param name - Parameter name, case-sensitive
 * @param value - New value; null removes the parameter
 * @returns The new query string with its "?", or "" when nothing is left
 */
export function withQueryParam(search: string, name: string, value: string | null): string {
    const params = new URLSearchParams(search);
    if (value === null) params.delete(name);
    else params.set(name, value);
    const out = params.toString();
    return out ? `?${out}` : "";
}

/**
 * Reads the current query string, kept in sync with back and forward, the App Router navigations
 * and setQueryParam. The static HTML renders with an empty one and hydration picks up the real
 * value, so a shared link (?endpoint=hash) needs no Suspense boundary.
 *
 * @returns The query string, starting with "?" when not empty
 */
export function useLocationSearch(): string {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Reads one parameter of the current query string, for the Playground preset (?endpoint=<slug>).
 *
 * @param name - Parameter name, case-sensitive
 * @returns Its value, null when absent and during the server render
 */
export function useQueryParam(name: string): string | null {
    return queryParam(useLocationSearch(), name);
}

/**
 * Replaces one parameter of the address without a navigation (the Playground picker), through
 * the History API that the App Router follows, then tells the readers of useLocationSearch.
 *
 * @param name - Parameter name, case-sensitive
 * @param value - New value; null removes the parameter
 */
export function setQueryParam(name: string, value: string | null): void {
    const { pathname, search, hash } = window.location;
    window.history.replaceState(
        null,
        "",
        `${pathname}${withQueryParam(search, name, value)}${hash}`,
    );
    window.dispatchEvent(new Event(LOCATION_EVENT));
}
