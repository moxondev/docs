import { useShortcuts } from "@/hooks/useShortcuts";
import { createStore, useStore } from "@/hooks/useStore";

export interface PaletteState {
    open: boolean;
    seed: string;
    session: number;
}

export interface Palette extends PaletteState {
    openPalette: (seed?: string) => void;
    closePalette: () => void;
    toggle: () => void;
    setOpen: (open: boolean) => void;
}

// Palette before its first opening, also the state of the server render
export const PALETTE_CLOSED: PaletteState = { open: false, seed: "", session: 0 };

// Open state shared by Searchbar, the phone Menu, the shortcuts and the Palette
export const paletteStore = createStore<PaletteState>(PALETTE_CLOSED);

/**
 * Opens the palette. Each opening is a new session (the palette keys its content on it, so the
 * query starts from the seed); opening it again while open only restarts it with a new seed.
 *
 * @param seed - Query typed in the field on opening, empty by default
 */
export function openPalette(seed = ""): void {
    paletteStore.set((state) =>
        state.open && seed === "" ? state : { open: true, seed, session: state.session + 1 },
    );
}

/**
 * Closes the palette; the session and its seed are kept until the next opening.
 */
export function closePalette(): void {
    paletteStore.set((state) => (state.open ? { ...state, open: false } : state));
}

/**
 * Opens the palette when closed, closes it when open (Ctrl or Cmd+K).
 */
export function togglePalette(): void {
    if (paletteStore.get().open) closePalette();
    else openPalette();
}

/**
 * Follows the open state asked by the dialog primitive (onOpenChange of the palette Dialog).
 *
 * @param open - Wanted state; true opens a new session without a seed
 */
export function setPaletteOpen(open: boolean): void {
    if (open) openPalette();
    else closePalette();
}

/**
 * Gives the open state of the search palette and its actions, the same for every component.
 *
 * @returns Whether it is open, the seed query and the session of the current opening, and the
 * actions (the module functions, stable)
 */
export function usePalette(): Palette {
    const state = useStore(paletteStore);
    return {
        ...state,
        openPalette,
        closePalette,
        toggle: togglePalette,
        setOpen: setPaletteOpen,
    };
}

/**
 * Binds the search shortcuts to the palette: Ctrl or Cmd+K toggles it everywhere, "/" opens it
 * outside text fields. Call it once, from a component mounted on every page.
 */
export function usePaletteShortcuts(): void {
    useShortcuts({ search: togglePalette, searchSlash: () => openPalette() });
}
