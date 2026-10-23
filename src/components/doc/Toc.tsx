"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";

import { useActiveSection } from "@/hooks/useActiveSection";
import { usePullStretch } from "@/hooks/usePullStretch";
import type { TocEntry } from "@/lib/nav";
import { cn } from "@/lib/utils";

export interface TocProps {
    entries: readonly TocEntry[];
}

/**
 * "On this page" list of a documentation page: inline underlined links on a desktop, a row of
 * pills on a phone that scrolls sideways and stretches, up to a limit, when pulled. The section in
 * view is tracked while scrolling, and the first pill counts as in view before any heading.
 *
 * @param entries - Level 2 and 3 sections of the page, each with its id, title and short label
 */
export function Toc({ entries }: TocProps) {
    const t = useTranslations("endpoint");
    const aria = useTranslations("aria");
    const active = useActiveSection(entries.map((entry) => entry.id));
    const pill = active ?? entries[0]?.id;
    const row = useRef<HTMLUListElement>(null);

    usePullStretch(row);

    return (
        <nav
            aria-label={aria("toc")}
            className="flex flex-col gap-2 desk:flex-row desk:items-baseline desk:gap-4"
        >
            <span className="sr-only desk:not-sr-only desk:shrink-0 desk:text-[14px] desk:whitespace-nowrap desk:text-faint">
                {t("toc")}
            </span>
            <ul
                ref={row}
                className="scroll-none -mx-5 flex touch-pan-x gap-1.5 overflow-x-auto px-5 py-1 text-[14px] desk:mx-0 desk:min-w-0 desk:flex-1 desk:flex-wrap desk:gap-x-4 desk:gap-y-1.5 desk:touch-auto desk:overflow-visible desk:p-0"
            >
                {entries.map((entry) => (
                    <li key={entry.id} className="shrink-0">
                        <a
                            href={`#${entry.id}`}
                            aria-current={active === entry.id ? "location" : undefined}
                            className={cn(
                                "relative inline-flex h-9 items-center rounded-full border border-field px-2.75 whitespace-nowrap text-text after:absolute after:inset-x-0 after:-inset-y-[5px] desk:h-auto desk:rounded-none desk:border-0 desk:px-0 desk:text-ink desk:underline desk:decoration-hl-line desk:decoration-2 desk:underline-offset-4 desk:after:hidden desk:hover:decoration-ink",
                                pill === entry.id &&
                                    "border-pill-on-line bg-pill-on text-pill-on-ink desk:border-0 desk:bg-transparent desk:text-ink",
                                active === entry.id && "desk:font-semibold desk:decoration-ink",
                            )}
                        >
                            {entry.label ? t(`sections.${entry.label}`) : entry.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
