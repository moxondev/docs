import { useSyncExternalStore } from "react";

// Media query of the desktop layout, the desk breakpoint of globals.css
const DESKTOP = "(min-width: 60rem)";

/**
 * Subscribes to the changes of the desktop media query.
 *
 * @param listener - Called when the viewport crosses the breakpoint
 * @returns The function that removes the listener
 */
function subscribe(listener: () => void): () => void {
    const query = window.matchMedia(DESKTOP);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
}

/**
 * Reads the media query in the browser.
 *
 * @returns True when the viewport reaches the desk breakpoint
 */
function snapshot(): boolean {
    return window.matchMedia(DESKTOP).matches;
}

/**
 * Gives the value of the server render, which the palette never gets (it mounts in the browser).
 *
 * @returns True, the desktop layout
 */
function serverSnapshot(): boolean {
    return true;
}

/**
 * Tells whether the palette shows its desktop layout (list with a preview beside it) or the full
 * screen phone one, which has no preview and no selected row until the reader moves.
 *
 * @returns True from the desk breakpoint, following the viewport
 */
export function useDesk(): boolean {
    return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
