"use client";

import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useId, useState } from "react";

import { filterGroups, hiddenNames, type ValueGroup } from "@/components/doc/groups";
import { cn } from "@/lib/utils";

export interface ValuesProps {
    head: ReactNode;
    description: string;
    example: string;
    groups: readonly ValueGroup[];
}

/**
 * List of the available values of a parameter, for the hash methods: the section heading with a
 * filter on its right, then a framed table with one row of chips per family. Only the primary
 * families show until a button spells out the others; typing in the filter searches every one.
 *
 * @param head - The section heading, drawn by the server page, which the filter sits beside
 * @param description - Title of the block, read to assistive technology as the filter description
 * @param example - Example value in the placeholder of the filter ("sha3")
 * @param groups - Families of values, each with its label, short name, values and primary flag
 */
export function Values({ head, description, example, groups }: ValuesProps) {
    const t = useTranslations("endpoint");
    const aria = useTranslations("aria");
    const describedBy = useId();
    const [query, setQuery] = useState("");
    const [expanded, setExpanded] = useState(false);
    const filtering = query.trim() !== "";
    const hidden = groups.filter((group) => !group.primary);
    const hiddenCount = hidden.reduce((sum, group) => sum + group.items.length, 0);
    const names = hiddenNames(groups);
    const shown = filtering ? filterGroups(groups, query) : groups;

    return (
        <div className="flex flex-col gap-3.5">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                {head}
                <label className="flex h-11 w-full items-center gap-2 rounded-field border border-field bg-control px-2.5 focus-within:border-focus-line focus-within:ring-3 focus-within:ring-focus-ring home:h-8 home:w-55">
                    <SearchIcon aria-hidden="true" className="size-3.5 shrink-0 text-faint" />
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        aria-label={aria("filterValues")}
                        aria-describedby={describedBy}
                        placeholder={t("values.filter", { example })}
                        className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-faint"
                    />
                </label>
            </div>
            <p id={describedBy} className="sr-only">
                {description}
            </p>
            <div className="overflow-hidden rounded-table border border-line">
                {shown.length === 0 ? (
                    <p role="status" className="px-4 py-3.5 text-[13px] text-muted">
                        {t("values.empty", { query: query.trim() })}
                    </p>
                ) : (
                    <ul>
                        {shown.map((group) => (
                            <li
                                key={group.label}
                                className={cn(
                                    "flex flex-wrap gap-x-4 gap-y-2.5 border-b border-line-soft px-4 py-3.5 last:border-b-0",
                                    !filtering && !expanded && !group.primary && "hidden",
                                )}
                            >
                                <span className="w-full pt-0.5 text-[13px] font-medium text-text desk:w-40">
                                    {group.label}
                                </span>
                                <ul className="flex flex-[1_1_18.75rem] flex-wrap gap-1.5 font-mono text-xs">
                                    {group.items.map((item) => (
                                        <li
                                            key={item}
                                            className="rounded-chip bg-chip px-1.75 py-0.5 text-ink"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
                {filtering || hidden.length === 0 ? null : (
                    <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setExpanded(!expanded)}
                        className="-mt-px flex h-11 w-full items-center justify-center gap-1.5 border-t border-line-soft bg-soft text-[13px] text-ink desk:h-10.5"
                    >
                        <span className="prose-link">
                            {expanded
                                ? t("values.less")
                                : names.length > 0
                                  ? t("values.more", {
                                        families: names.join(", "),
                                        count: hiddenCount,
                                    })
                                  : t("values.all", { count: hiddenCount })}
                        </span>
                        <ChevronDownIcon
                            aria-hidden="true"
                            className={cn("size-3.5", expanded && "rotate-180")}
                        />
                    </button>
                )}
            </div>
        </div>
    );
}
