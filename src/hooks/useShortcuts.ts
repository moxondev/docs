import { useCallback, useEffect, useEffectEvent } from "react";

import { type Shortcut, type ShortcutId, SHORTCUTS } from "@/data/shortcuts";
import { type KeyLabel, shortcutLabels, useModKey } from "@/hooks/useModKey";
import { usePreference } from "@/hooks/usePreference";

export type ShortcutHandlers = Partial<Record<ShortcutId, () => void>>;

export type KeyPress = Pick<
    KeyboardEvent,
    "key" | "code" | "altKey" | "ctrlKey" | "metaKey" | "shiftKey"
>;

export type Overlay = "none" | "menu" | "dialog";

export interface KeyContext {
    editable: boolean;
    overlay: Overlay;
    singleKeys: boolean;
}

export interface FieldLike {
    tagName?: string;
    type?: string;
    isContentEditable?: boolean;
}

// Stored as "off" when the reader turns single-key shortcuts off (WCAG 2.1.4)
export const SINGLE_KEYS_KEY = "moxon-single-keys";

/**
 * Every shortcut of the catalog by id, for the widgets that match their own keys (Try form,
 * palette) and for the hints.
 */
export const SHORTCUT = Object.fromEntries(SHORTCUTS.map((s) => [s.id, s])) as Record<
    ShortcutId,
    Shortcut
>;

// Input types that hold no typed text: a letter pressed on them is not a character
const NON_TEXT_INPUTS: ReadonlySet<string> = new Set([
    "button",
    "checkbox",
    "color",
    "file",
    "image",
    "radio",
    "range",
    "reset",
    "submit",
]);

/**
 * Tells whether an element is a single-line text input, where Enter submits.
 *
 * @param target - Event target, read structurally (tag name and type), null outside an element
 * @returns True for an input element whose type takes typed text
 */
export function isTextInput(target: FieldLike | EventTarget | null): boolean {
    if (!target || typeof target !== "object") return false;
    const field = target as FieldLike;
    if (field.tagName?.toUpperCase() !== "INPUT") return false;
    return !NON_TEXT_INPUTS.has((field.type ?? "text").toLowerCase());
}

/**
 * Tells whether keyboard input currently goes to a field that types characters: text inputs,
 * textareas, selects (letters jump to an option) and editable content.
 *
 * @param target - Event target, read structurally, null outside an element
 * @returns True when a key press may produce text or pick an option
 */
export function isEditable(target: FieldLike | EventTarget | null): boolean {
    if (!target || typeof target !== "object") return false;
    const field = target as FieldLike;
    if (field.isContentEditable) return true;
    const tag = field.tagName?.toUpperCase();
    return tag === "TEXTAREA" || tag === "SELECT" || isTextInput(target);
}

/**
 * Matches a key press against a shortcut definition, Ctrl and Cmd counting as the same modifier.
 * The physical key is compared when the catalog gives a code (Option+L types another character on
 * macOS) or the layout produces no Latin letter, else the character.
 *
 * @param press - Key event, native or React; only the key, the code and the modifiers are read
 * @param shortcut - Definition from the shortcut catalog
 * @returns True when the press triggers the shortcut
 */
export function matches(press: KeyPress, shortcut: Shortcut): boolean {
    if ((press.ctrlKey || press.metaKey) !== Boolean(shortcut.mod)) return false;
    if (press.altKey !== Boolean(shortcut.alt)) return false;
    const letter = /^[a-z]$/i.test(shortcut.key);
    if (letter && press.shiftKey) return false;
    if (shortcut.code) return press.code === shortcut.code;
    if (letter && !/^[a-z]$/i.test(press.key)) {
        return press.code === `Key${shortcut.key.toUpperCase()}`;
    }
    return press.key.toLowerCase() === shortcut.key.toLowerCase();
}

/**
 * Finds the shortcut a key press triggers among those a component handles; the passive ones
 * belong to a focused widget and are never bound globally.
 *
 * @param press - Key event, only the key, the code and the modifiers are read
 * @param handlers - Actions of the component, keyed by shortcut id
 * @returns The first matching catalog entry that has a handler, or null
 */
export function findShortcut(press: KeyPress, handlers: ShortcutHandlers): Shortcut | null {
    for (const shortcut of SHORTCUTS) {
        if (shortcut.passive || !handlers[shortcut.id]) continue;
        if (matches(press, shortcut)) return shortcut;
    }
    return null;
}

/**
 * Tells whether a matched shortcut may fire in the current context. Ctrl or Cmd shortcuts fire
 * everywhere, the others only outside text fields and, for single keys, outside overlays and
 * while the reader keeps them on.
 *
 * @param shortcut - Matched definition from the shortcut catalog
 * @param context - Focus target kind, open overlay and the single-key preference
 * @returns True when the handler should run
 */
export function allowed(shortcut: Shortcut, context: KeyContext): boolean {
    if (shortcut.mod) return true;
    if (context.editable) return false;

    // An Alt shortcut still fires over a menu (Alt+V closes the version menu), not over a dialog
    if (shortcut.alt) return context.overlay !== "dialog";
    return context.singleKeys && context.overlay === "none";
}

/**
 * Tells which kind of overlay is open: Radix dialogs, popovers, sheets and the palette carry
 * role dialog, the dropdown menus role menu.
 *
 * @returns The kind of the open overlay, a dialog winning over a menu
 */
function openOverlay(): Overlay {
    if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return "dialog";
    return document.querySelector('[role="menu"]') ? "menu" : "none";
}

/**
 * Reads and sets the reader's choice about single-key shortcuts (the "/" key), shown in the
 * shortcuts help (messages shortcuts.singleKeys).
 *
 * @returns True while single keys are on (the default), and the setter
 */
export function useSingleKeys(): [boolean, (on: boolean) => void] {
    const [stored, setStored] = usePreference(SINGLE_KEYS_KEY);
    const setOn = useCallback((on: boolean) => setStored(on ? null : "off"), [setStored]);
    return [stored !== "off", setOn];
}

/**
 * Binds the global keyboard shortcuts of the catalog that have a handler; several components
 * can each bind their own subset (the Header, usePaletteShortcuts).
 * The rules of allowed() decide where each one fires; a handled press is default-prevented.
 *
 * @param handlers - Action for each shortcut this component owns; passive ids are ignored
 */
export function useShortcuts(handlers: ShortcutHandlers): void {
    const [singleKeys] = useSingleKeys();

    const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
        if (event.defaultPrevented || event.isComposing) return;
        const shortcut = findShortcut(event, handlers);
        if (!shortcut) return;
        const context = { editable: isEditable(event.target), overlay: openOverlay(), singleKeys };
        if (!allowed(shortcut, context)) return;
        event.preventDefault();
        handlers[shortcut.id]?.();
    });

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);
}

/**
 * Gives the labels of the keys of one shortcut for the current platform, for a kbd hint.
 *
 * @param id - Shortcut of the catalog
 * @returns Words of messages common.keys and literal characters, modifiers first
 */
export function useShortcutLabels(id: ShortcutId): KeyLabel[] {
    return shortcutLabels(SHORTCUT[id], useModKey());
}
