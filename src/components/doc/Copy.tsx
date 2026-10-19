"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";

export interface CopyProps {
    text: string;
    className?: string;
}

/**
 * Copy button of a code block: its icon becomes a check for a moment after the copy, and the
 * result is announced to screen readers through a polite live region.
 *
 * @param text - Code to put on the clipboard, verbatim
 * @param className - Extra classes for the button, for its place on the panel; a position class
 *   replaces the relative one
 */
export function Copy({ text, className }: CopyProps) {
    const aria = useTranslations("aria");
    const common = useTranslations("common");
    const { status, copy } = useCopy();
    const Glyph = status === "copied" ? CheckIcon : CopyIcon;

    return (
        <>
            <button
                type="button"
                aria-label={aria("copyCode")}
                onClick={() => void copy(text)}
                className={cn(
                    "inline-flex size-7 items-center justify-center rounded-row border border-code-btn text-code-icon hover:text-code-sel",
                    className,
                )}
            >
                <Glyph aria-hidden="true" className="size-3.25" />
            </button>
            <span role="status" className="sr-only">
                {status === "copied"
                    ? common("copied")
                    : status === "failed"
                      ? common("copyFailed")
                      : ""}
            </span>
        </>
    );
}
