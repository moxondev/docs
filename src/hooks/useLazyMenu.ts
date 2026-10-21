import {
    type ComponentType,
    type FocusEvent,
    type RefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

// True while the last input of the reader was a key, false once a pointer press came after it
let keyboardInput = false;

// True once the document listeners that tell the two apart are installed
let tracking = false;

/**
 * Installs, once per page, the document listeners that remember whether the last input was a key
 * or a pointer press. A menu that opens before its chunk has arrived cannot see the key that
 * opened it, since the primitive mounts afterwards; this is what it reads instead.
 */
function trackInput() {
    if (tracking) return;
    tracking = true;
    document.addEventListener("keydown", () => (keyboardInput = true), true);
    document.addEventListener("pointerdown", () => (keyboardInput = false), true);
}

export interface LazyMenu<P extends object> {
    plain: RefObject<HTMLButtonElement | null>;
    Menu: ComponentType<P> | null;
    focus: boolean;
    want: () => void;
}

/**
 * Loads the chunk of a dropdown menu once the reader shows interest in its trigger, so that the
 * dropdown primitive stays out of the first load. A chunk that arrives while a pointer is pressed
 * on the plain trigger waits for the release, or the click would be lost.
 *
 * @param load - Fetches the chunk and resolves to the menu component; a module-level function, so
 *   that the dynamic import stays a split point
 * @param open - Whether the menu is open: an open menu needs its chunk at once, before any pointer
 *   or focus
 * @returns The ref for the plain trigger, the menu component (null until its chunk has arrived),
 *   whether the new trigger must take the focus, and the call that asks for the chunk
 */
export function useLazyMenu<P extends object>(
    load: () => Promise<ComponentType<P>>,
    open: boolean,
): LazyMenu<P> {
    const plain = useRef<HTMLButtonElement>(null);
    const [wanted, setWanted] = useState(false);
    const [Menu, setMenu] = useState<ComponentType<P> | null>(null);
    const [focus, setFocus] = useState(false);

    // State, not a ref, so a render already scheduled by the arrival of the chunk sees the press
    const [pressed, setPressed] = useState(false);
    const want = useCallback(() => setWanted(true), []);

    useEffect(trackInput, []);

    useEffect(() => {
        const button = plain.current;
        if (!button) return;
        const release = () => {
            document.removeEventListener("pointerup", release);
            document.removeEventListener("pointercancel", release);
            window.setTimeout(() => setPressed(false), 0);
        };
        const press = () => {
            setPressed(true);
            document.addEventListener("pointerup", release);
            document.addEventListener("pointercancel", release);
        };
        button.addEventListener("pointerdown", press);
        return () => button.removeEventListener("pointerdown", press);
    }, [Menu]);

    useEffect(() => {
        if (Menu || (!wanted && !open)) return;
        let live = true;
        load().then(
            (component) => {
                if (!live) return;
                setFocus(document.activeElement === plain.current);
                setMenu(() => component);
            },
            () => {
                // A chunk that failed to load is asked for again at the next interest of the reader
                if (live) setWanted(false);
            },
        );
        return () => {
            live = false;
        };
    }, [load, wanted, open, Menu]);

    return { plain, Menu: pressed && !open ? null : Menu, focus, want };
}

/**
 * Gives the first row of a menu the focus when the menu was opened by the keyboard before its
 * chunk had arrived, as the primitive does for its own trigger. The primitive mounts after the
 * key and focuses the panel instead; this reacts to that first focus, once.
 *
 * @param open - Whether the menu is open at its first render: true when it mounted because it was
 *   asked to open
 * @returns The handler for the onFocus prop of the menu panel
 */
export function useEntryFocus(open: boolean): (event: FocusEvent<HTMLElement>) => void {
    const cold = useRef(open);

    return useCallback((event: FocusEvent<HTMLElement>) => {
        if (!cold.current || event.target !== event.currentTarget) return;
        cold.current = false;
        if (!keyboardInput) return;
        event.currentTarget
            .querySelector<HTMLElement>('[role^="menuitem"]:not([data-disabled])')
            ?.focus({ preventScroll: true });
    }, []);
}
