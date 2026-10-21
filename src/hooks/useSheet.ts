import { createStore, useStore } from "@/hooks/useStore";

export interface SheetHandle {
    open: boolean;
    openSheet: () => void;
    closeSheet: () => void;
    setOpen: (open: boolean) => void;
}

// Open state of the phone Try sheet, shared by the Bar that opens it and the Sheet itself
export const sheetStore = createStore<boolean>(false);

// Element that had the focus when the sheet opened, which gets it back on close
let opener: HTMLElement | null = null;

/**
 * Opens the phone Try sheet and remembers the focused element (the Bar button, or the header
 * action) so that closing the sheet can give the focus back to it.
 */
export function openSheet(): void {
    // Drawer content has no trigger element, so the dialog primitive has nothing to restore
    const active = typeof document === "undefined" ? null : document.activeElement;
    opener = active && active !== document.body ? (active as HTMLElement) : null;
    sheetStore.set(true);
}

/**
 * Gives the focus back to the element that opened the sheet, when it is still in the page.
 */
export function restoreOpener(): void {
    if (opener?.isConnected) opener.focus();
    opener = null;
}

/**
 * Closes the phone Try sheet.
 */
export function closeSheet(): void {
    sheetStore.set(false);
}

/**
 * Follows the open state asked by the drawer primitive (onOpenChange).
 *
 * @param open - New state: true when the primitive opens the drawer, false when it dismisses it
 */
export function setSheetOpen(open: boolean): void {
    sheetStore.set(open);
}

/**
 * Gives the open state of the phone Try sheet and its actions, shared by the Bar and the Sheet
 * of a page. The static HTML renders it closed.
 *
 * @returns Whether the sheet is open and the module actions (stable)
 */
export function useSheet(): SheetHandle {
    const open = useStore(sheetStore);
    return { open, openSheet, closeSheet, setOpen: setSheetOpen };
}
