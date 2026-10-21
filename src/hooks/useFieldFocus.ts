import { type RefObject, useEffect, useRef } from "react";

import type { FieldFocus } from "@/hooks/useRequest";

/**
 * Moves the focus to the control of a parameter inside a form, found by the data-param attribute
 * of its Control. A segmented control receives the focus on its first option.
 *
 * @param root - Form element, or null before it is mounted
 * @param name - Name of the parameter whose control takes the focus
 * @returns True when a control was found and focused
 */
export function focusField(
    root: Pick<HTMLElement, "querySelectorAll"> | null,
    name: string,
): boolean {
    if (root === null) return false;
    const field = Array.from(root.querySelectorAll<HTMLElement>("[data-param]")).find(
        (element) => element.getAttribute("data-param") === name,
    );
    const control = field?.querySelector<HTMLElement>("input, select, textarea");
    control?.focus();
    return control !== undefined && control !== null;
}

/**
 * Tells whether a focus request of the state machine is still to be served: it exists and it is
 * not the one a form already served, or found waiting when it mounted.
 *
 * @param focus - Focus request of the state machine, null before the first one
 * @param served - Request the form already served, or saw at its mount
 * @returns True when the form should move the focus now
 */
export function isPending(focus: FieldFocus | null, served: FieldFocus | null): boolean {
    return focus !== null && focus !== served;
}

/**
 * Focuses the flagged field of a Try form each time the state machine asks for it. A request
 * already there when the form mounted is not served again: the phone sheet remounts its form on
 * each opening, which must not pull the focus to a field flagged earlier.
 *
 * @param focus - Focus request of the state machine, null before the first one
 * @returns Ref to put on the form element
 */
export function useFieldFocus(focus: FieldFocus | null): RefObject<HTMLFormElement | null> {
    const form = useRef<HTMLFormElement>(null);
    const served = useRef(focus);

    useEffect(() => {
        if (!isPending(focus, served.current)) return;
        served.current = focus;
        if (focus !== null) focusField(form.current, focus.name);
    }, [focus]);

    return form;
}
