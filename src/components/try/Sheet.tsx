"use client";

import { useTranslations } from "next-intl";

import type { SheetProps } from "@/types/try";

/**
 * Placeholder of the phone "Try it" sheet until the real dialog exists: a closed sheet shows
 * nothing, so the stub is a hidden element labelled like the future dialog.
 *
 * @param version - Documentation version of the operation, kept as a mark on the placeholder
 * @param op - Operation the sheet will try; its id marks the placeholder
 * @param name - Endpoint name read in the dialog label ("Try the Hash endpoint")
 */
export function Sheet({ version, op, name }: SheetProps) {
    const aria = useTranslations("aria");

    return (
        <div
            hidden
            data-stub="sheet"
            data-version={version}
            data-op={op.id}
            aria-label={aria("trySheet", { name })}
        />
    );
}
