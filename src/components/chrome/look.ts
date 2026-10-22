import type { FocusEvent, KeyboardEvent, PointerEvent } from "react";

/**
 * Look of the version trigger of the full header, shared by its plain markup and its dropdown
 * trigger: one button around the wordmark, the version and the chevron. The negative left margin
 * equals the left padding, so the wordmark stays where a bare logo sits and the chip surrounds it.
 */
export const VERSIONS_TRIGGER =
    "group -ml-2.5 flex shrink-0 cursor-pointer items-center gap-2 rounded-row px-2.5 py-1 hover:bg-chip aria-expanded:bg-chip";

/**
 * Marker of the latest version in the version lists: the word on the yellow highlighter, the same
 * ground as the page status marker, since the one entry it points at is the one to read.
 */
export const LATEST_MARK =
    "inline-flex shrink-0 items-center rounded-tag bg-mark px-1.75 py-0.75 text-[12.5px]/none font-medium whitespace-nowrap text-mark-ink";

/**
 * Look of the language trigger of the desktop headers, shared by its plain markup and its dropdown
 * trigger: the quiet button of the tools group, with the soft chip on hover and while the menu is
 * open. The keyboard focus is the global outline.
 */
export const LANGUAGE_TRIGGER =
    "flex h-8.5 shrink-0 cursor-pointer items-center gap-1.5 rounded-field px-2.25 text-[14px] font-medium text-muted hover:bg-chip hover:text-ink aria-expanded:bg-chip aria-expanded:text-ink";

/**
 * Look of the theme trigger of the desktop headers, shared by its plain markup and its dropdown
 * trigger: the quiet icon button of the tools group, with the soft chip on hover and while the
 * menu is open. The keyboard focus is the global outline.
 */
export const THEME_TRIGGER =
    "flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-field text-muted hover:bg-chip hover:text-ink aria-expanded:bg-chip aria-expanded:text-ink";

/**
 * Panel of a dropdown menu of the chrome: the white sheet with the soft border and shadow. The
 * "menu-root" class carries the pointer modality marker (see MENU_MODALITY); the width is the
 * caller's.
 */
export const MENU_PANEL =
    "menu-root rounded-(--radius-box) border-line bg-surface p-1 shadow-panel";

/**
 * Look of a row of a menu: the soft highlight of the chrome, a fill that follows the hover and the
 * arrows, and an inset ring for the keyboard focus. The ring is off while the pointer drives the
 * menu: the primitive focuses the hovered row, and after a key press that would draw the ring.
 */
export const MENU_ROW =
    "cursor-pointer gap-2 rounded-row px-2.5 text-ink transition-colors duration-150 focus:bg-chip focus-visible:outline-none [.menu-root:not([data-pointer])_&]:focus-visible:ring-1 [.menu-root:not([data-pointer])_&]:focus-visible:ring-focus-line [.menu-root:not([data-pointer])_&]:focus-visible:ring-inset";

// Small heading of a group of rows, in the quiet voice of the chrome
export const MENU_HEADING = "px-2.5 pt-2 pb-1 text-[13px] font-medium text-faint";

/**
 * Marks the panel of a menu while the pointer drives it, and clears the mark at the next key, so
 * that the ring of a row only shows for the keyboard.
 */
export const MENU_MODALITY = {
    onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        event.currentTarget.dataset.pointer = "";
    },
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
        delete event.currentTarget.dataset.pointer;
    },
};

/**
 * Keeps the tooltip of a trigger for the keyboard: a focus that is not a keyboard focus does not
 * open it, since a menu gives the focus back by script after a click and the tooltip would pop up
 * under a pointer that is elsewhere. It default-prevents the focus event before the tooltip's own.
 *
 * @param event - Focus event of the trigger, whose focus-visible state tells keyboard from pointer
 */
export function tipOnKeyFocus(event: FocusEvent<HTMLElement>): void {
    if (!event.currentTarget.matches(":focus-visible")) event.preventDefault();
}
