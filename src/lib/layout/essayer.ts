// Fields of the Try panel that the Try action focuses, in document order
export const TRY_FIELDS = "input, select, textarea";

export type EssayerOutcome = "sheet" | "field" | "none";

export interface FocusTarget {
    focus: (options?: { preventScroll?: boolean }) => void;
}

export interface FieldSearch {
    querySelector: (selector: string) => FocusTarget | null;
}

export interface EssayerEnv {
    desktop: boolean;
    root: FieldSearch | null;
    openSheet: () => void;
    later: (run: () => void) => void;
}

/**
 * Finds the first field of the Try panel, the one the keyboard lands on after the Try action.
 *
 * @param root - The element with the id of the Try panel, null when the page has none
 * @returns The first input, select or textarea of the panel, null when there is none
 */
export function firstField(root: FieldSearch | null): FocusTarget | null {
    return root ? root.querySelector(TRY_FIELDS) : null;
}

/**
 * Runs the Try action of the slim header. On a phone it opens the Try sheet, since the panel is
 * not in the page; on a desktop the action is the link to the panel, and this focuses its first
 * field once the browser has followed it, without a second scroll.
 *
 * @param env - Whether the desktop layout is in use, the Try panel element, the action that opens
 *   the phone sheet and the scheduler that runs a callback after the link scroll started
 * @returns "sheet" when the sheet opened (the link must not be followed), "field" when the first
 *   field is scheduled for the focus, "none" when the panel has no field to focus
 */
export function essayer(env: EssayerEnv): EssayerOutcome {
    if (!env.desktop) {
        env.openSheet();
        return "sheet";
    }
    const field = firstField(env.root);
    if (!field) return "none";
    env.later(() => field.focus({ preventScroll: true }));
    return "field";
}
