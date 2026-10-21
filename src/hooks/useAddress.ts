import { useSyncExternalStore } from "react";

import { type AppLocale, routing } from "@/i18n/routing";
import { parsePath } from "@/lib/routes";

/**
 * Subscribes to nothing: the 404 document never navigates.
 *
 * @returns A no-op unsubscribe function
 */
function subscribe(): () => void {
    return () => {};
}

/**
 * Gives the address in the bar, which the prerendered 404 cannot know (it is one file for every
 * unknown address).
 *
 * @returns The pathname of the current location
 */
function getPath(): string {
    return window.location.pathname;
}

/**
 * Gives the path of the server HTML and of hydration: none, so that the page first shows the
 * English 404 and the visitor's language and redirect are settled once the address is known.
 *
 * @returns An empty string
 */
function getServerPath(): string {
    return "";
}

/**
 * Reads the language of an address, English without a prefix and French under /fr/.
 *
 * @param path - Pathname of the address, empty before the address is known
 * @returns The default locale for an empty path, else the locale of its first segment
 */
export function addressLocale(path: string): AppLocale {
    return path ? parsePath(path).lang : routing.defaultLocale;
}

/**
 * Reads the address in the bar of the browser, for the one document that cannot know it at build
 * time, the 404 of the static export.
 *
 * @returns An empty string during the server render and hydration, the pathname afterwards
 */
export function useAddressPath(): string {
    return useSyncExternalStore(subscribe, getPath, getServerPath);
}
