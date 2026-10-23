import { useEffect } from "react";

// Name of the CSS variable on the root: the height of the on-screen keyboard, 0 when it is closed
export const KEYBOARD_INSET = "--keyboard-inset";

/**
 * Gives the height of the on-screen keyboard that the layout does not already make room for. A
 * browser that resizes the layout with the keyboard (Chrome on Android) reports 0, one that only
 * shrinks the visual viewport (Safari on iOS) reports the keyboard.
 *
 * @param innerHeight - Height of the layout viewport
 * @param viewportHeight - Height of the visual viewport
 * @param offsetTop - Distance between the top of the layout viewport and the visual one
 * @returns The height in px, never negative
 */
export function keyboardInset(innerHeight: number, viewportHeight: number, offsetTop: number) {
    return Math.max(0, Math.round(innerHeight - viewportHeight - offsetTop));
}

/**
 * Publishes the keyboard height as --keyboard-inset on the root while a bottom sheet is open, so
 * that the sheet lifts above the keyboard through CSS alone and keeps the height of its content.
 *
 * @param active - True while the sheet is open
 */
export function useKeyboardInset(active: boolean): void {
    useEffect(() => {
        const viewport = window.visualViewport;
        if (!active || !viewport) return;
        const root = document.documentElement;
        const update = () => {
            const inset = keyboardInset(window.innerHeight, viewport.height, viewport.offsetTop);
            root.style.setProperty(KEYBOARD_INSET, `${inset}px`);
        };
        update();
        viewport.addEventListener("resize", update);
        viewport.addEventListener("scroll", update);
        return () => {
            viewport.removeEventListener("resize", update);
            viewport.removeEventListener("scroll", update);
            root.style.removeProperty(KEYBOARD_INSET);
        };
    }, [active]);
}
