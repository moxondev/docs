"use client";

import { lazy, Suspense, useEffect, useState } from "react";

import { orFallback, whenIdle } from "@/components/try/prefetch";
import { useRequest } from "@/hooks/useRequest";
import { closeSheet, useSheet } from "@/hooks/useSheet";
import type { SheetProps } from "@/types/try";

/**
 * Renders nothing in place of the drawer when its chunk cannot be loaded, and puts the shared state
 * back to closed, so that the Bar does not claim an open sheet.
 */
function SheetUnavailable() {
    useEffect(() => closeSheet(), []);

    return null;
}

/**
 * Loads the drawer, its form and its output, since vaul alone weighs more than the rest of the Try
 * code. The same loader serves the idle prefetch and the lazy component, so both ask for the very
 * same chunk.
 *
 * @returns The module of the drawer, or of its stand-in when the chunk cannot be fetched
 */
const loadSheetPanel = orFallback(
    () => import("@/components/try/SheetPanel").then((m) => m.SheetPanel),
    SheetUnavailable,
);

/**
 * Phone sheet of the operation, loaded on demand.
 *
 * @param version - Documentation version, which is also the API version of the request
 * @param op - Operation of the sheet, with try true
 * @param name - Endpoint name read in the dialog label ("Try the Hash endpoint")
 * @param handle - State machine of the form, owned by the Sheet so that closing keeps it
 */
const SheetPanel = lazy(loadSheetPanel);

// Viewport in which the sheet exists: below the desk breakpoint of globals.css, where the Bar shows
const PHONE_QUERY = "(max-width: 59.99rem)";

/**
 * Wiring of the phone Try sheet of an operation: it owns the request state, so that closing the
 * sheet keeps the form and the answer, loads the drawer on first opening or on phone idle time, and
 * closes the sheet when the viewport grows or the page changes.
 *
 * @param version - Documentation version, which is also the API version of the request
 * @param op - Operation of the sheet, with try true
 * @param name - Endpoint name read in the dialog label ("Try the Hash endpoint")
 */
export function SheetBody({ version, op, name }: SheetProps) {
    const { open } = useSheet();
    const handle = useRequest(version, op);
    const [wanted, setWanted] = useState(open);

    if (open && !wanted) setWanted(true);

    useEffect(() => {
        const query = window.matchMedia(PHONE_QUERY);
        const onChange = () => {
            if (!query.matches) closeSheet();
        };
        query.addEventListener("change", onChange);
        const cancel = query.matches ? whenIdle(() => void loadSheetPanel()) : () => {};
        return () => {
            cancel();
            query.removeEventListener("change", onChange);
            closeSheet();
        };
    }, []);

    return wanted ? (
        <Suspense fallback={null}>
            <SheetPanel version={version} op={op} name={name} handle={handle} />
        </Suspense>
    ) : null;
}
