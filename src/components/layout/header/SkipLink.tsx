"use client";

import { useTranslations } from "next-intl";

export interface SkipLinkProps {
    target: string;
}

/**
 * Skip link, the first stop of the keyboard: invisible until it has the focus, then a yellow button
 * at the top left that jumps to the main content. It reads its words from the client messages so
 * that the 404, which changes language after hydration, says them in the right one.
 *
 * @param target - Id of the main landmark the link points at
 */
export function SkipLink({ target }: SkipLinkProps) {
    const aria = useTranslations("aria");

    return (
        <a
            href={`#${target}`}
            className="sr-only rounded-cta bg-hl print:hidden text-sm font-medium text-on-hl focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:px-4 focus:py-2"
        >
            {aria("skip")}
        </a>
    );
}
