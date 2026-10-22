import { useSyncExternalStore } from "react";

/**
 * Media query of the home phone layout: the viewports below the home breakpoint of globals.css,
 * where the catalogue is an accordion.
 */
const PHONE = "(width < 47.5625rem)";

/**
 * Subscribes to the changes of the phone media query.
 *
 * @param listener - Called when the viewport crosses the breakpoint
 * @returns The function that removes the listener
 */
function subscribe(listener: () => void): () => void {
    const query = window.matchMedia(PHONE);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
}

/**
 * Reads the media query in the browser.
 *
 * @returns True when the viewport is below the home breakpoint
 */
function snapshot(): boolean {
    return window.matchMedia(PHONE).matches;
}

/**
 * Gives the value of the server render and of hydration: the wide layout, where every category
 * is open and its title is a plain heading. The classes that fold the categories on a phone are
 * media variants, so a phone shows the right layout before the hook switches.
 *
 * @returns False
 */
function serverSnapshot(): boolean {
    return false;
}

/**
 * Tells whether the home shows its phone layout, where the title of a category becomes the
 * button of an accordion. It follows the viewport once hydrated.
 *
 * @returns True below the home breakpoint
 */
export function usePhone(): boolean {
    return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
