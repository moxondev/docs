import { useSyncExternalStore } from "react";

import type { Shortcut } from "@/data/shortcuts";

export type KeyWord =
    "ctrl" | "cmd" | "alt" | "option" | "shift" | "enter" | "escape" | "up" | "down";

export interface KeyNames {
    mod: "ctrl" | "cmd";
    alt: "alt" | "option";
}

export type KeyLabel = { word: KeyWord } | { text: string };

// Modifier names on Apple platforms, as keys of messages common.keys (never a glyph)
export const APPLE_KEYS: KeyNames = { mod: "cmd", alt: "option" };

// Modifier names everywhere else, also those of the static HTML
export const OTHER_KEYS: KeyNames = { mod: "ctrl", alt: "alt" };

// Named keys of the shortcut catalog, printed as a word of messages common.keys
const NAMED_KEYS: Readonly<Record<string, KeyWord>> = {
    Enter: "enter",
    Escape: "escape",
    ArrowUp: "up",
    ArrowDown: "down",
};

/**
 * Picks the modifier names of a platform.
 *
 * @param platform - Platform string of the browser (userAgentData.platform, navigator.platform
 * or the user agent), compared case-insensitively
 * @returns APPLE_KEYS for macOS and iOS, OTHER_KEYS otherwise
 */
export function platformKeys(platform: string): KeyNames {
    return /mac|iphone|ipad|ipod/i.test(platform) ? APPLE_KEYS : OTHER_KEYS;
}

/**
 * Lists the keys to print for a shortcut hint, modifiers first: words for the modifiers and the
 * named keys, the character itself (upper case for a letter) for the others.
 *
 * @param shortcut - Definition from the shortcut catalog (src/data/shortcuts.ts)
 * @param keys - Modifier names of the platform, from useModKey
 * @returns The labels in reading order, for example ctrl then "K"
 */
export function shortcutLabels(shortcut: Shortcut, keys: KeyNames): KeyLabel[] {
    const labels: KeyLabel[] = [];
    if (shortcut.mod) labels.push({ word: keys.mod });
    if (shortcut.alt) labels.push({ word: keys.alt });
    const named = Object.hasOwn(NAMED_KEYS, shortcut.key) ? NAMED_KEYS[shortcut.key] : undefined;
    labels.push(named ? { word: named } : { text: shortcut.key.toUpperCase() });
    return labels;
}

/**
 * Subscribes to nothing: the platform never changes during a visit.
 *
 * @returns A no-op unsubscribe function
 */
function subscribe(): () => void {
    return () => {};
}

/**
 * Reads the platform of the browser, through the user agent client hints when they exist.
 *
 * @returns APPLE_KEYS or OTHER_KEYS, constants, so the snapshot is stable
 */
function getSnapshot(): KeyNames {
    const hints = (navigator as Navigator & { userAgentData?: { platform?: string } })
        .userAgentData;
    return platformKeys(hints?.platform || navigator.platform || navigator.userAgent);
}

/**
 * Gives the snapshot of the static HTML, rendered for the most common platform.
 *
 * @returns OTHER_KEYS (Ctrl, Alt)
 */
function getServerSnapshot(): KeyNames {
    return OTHER_KEYS;
}

/**
 * Gives the names of the modifier keys of the current platform, for keyboard hints written as
 * words ("Ctrl K", "Cmd K"). The static HTML says Ctrl and Alt.
 *
 * @returns The keys of messages common.keys for the shortcut modifier and for Alt
 */
export function useModKey(): KeyNames {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
