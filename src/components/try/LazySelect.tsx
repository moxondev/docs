"use client";

import { lazy, Suspense } from "react";

import type { SelectProps } from "@/components/try/Select";
import { cn } from "@/lib/utils";

/**
 * The list of the field as its own chunk.
 */
const Select = lazy(() => import("@/components/try/Select").then((m) => ({ default: m.Select })));

/**
 * Empty field shown in place of the list while its chunk is fetched, at the height of the field
 * so the form does not jump.
 *
 * @param touch - True in the phone sheet: 44 px high
 * @param bench - True in the Playground: 44 px high below the desktop layout
 */
function SelectFrame({ touch, bench }: Pick<SelectProps, "touch" | "bench">) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "h-9 rounded-field border border-field bg-control",
                touch && "h-11 rounded-box",
                bench && "max-desk:h-11 max-desk:rounded-box",
            )}
        />
    );
}

/**
 * The list of a long enum, loaded after hydration instead of with the page, so that Radix Select
 * and the drawer stay out of the first load (React.lazy, not next/dynamic, which would preload it).
 *
 * @param props - Parameter, value, flags and callback of the field, as the Select takes them
 */
export function LazySelect(props: SelectProps) {
    return (
        <Suspense fallback={<SelectFrame touch={props.touch} bench={props.bench} />}>
            <Select {...props} />
        </Suspense>
    );
}
