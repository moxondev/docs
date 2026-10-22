"use client";

import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Category } from "@/components/home/Category";
import { usePhone } from "@/components/home/phone";
import { countEntries, filterCategories, type HomeCategory } from "@/components/home/query";

export interface CatalogueProps {
    categories: HomeCategory[];
}

// Category that the phone accordion opens first (Security), the one the hero sample belongs to
const FIRST_OPEN = "security";

/**
 * Catalogue of the home page: the title with the number of endpoints, the filter field, the
 * "Jump to" row and the categories with their entries. Typing in the filter keeps the matching
 * entries and the result count is read aloud; on a phone the categories fold into an accordion.
 *
 * @param categories - Categories of the latest version in display order, entries alphabetical
 */
export function Catalogue({ categories }: CatalogueProps) {
    const t = useTranslations("catalogue");
    const aria = useTranslations("aria");
    const phone = usePhone();
    const [query, setQuery] = useState("");
    const [opened, setOpened] = useState<readonly string[]>([FIRST_OPEN]);
    const filtering = query.trim() !== "";
    const shown = filterCategories(categories, query);
    const found = countEntries(shown);

    const toggle = (id: string) => {
        setOpened((current) =>
            current.includes(id) ? current.filter((other) => other !== id) : [...current, id],
        );
    };

    return (
        <section
            id="catalogue"
            aria-labelledby="catalogue-title"
            className="scroll-mt-3 pb-2 home:pb-6"
        >
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 pb-3.5 home:pb-5">
                <div>
                    <h2
                        id="catalogue-title"
                        className="text-2xl/[1.15] font-semibold tracking-[-0.02em] text-ink home:text-[28px]/[1.15]"
                    >
                        {t("title")}
                        <span className="ml-1 font-mono text-base font-normal tracking-normal text-faint">
                            {countEntries(categories)}
                        </span>
                    </h2>
                    <p className="mt-2 text-sm/[1.55] text-muted home:text-[16px]/[1.55]">
                        {t("intro", { count: categories.length })}
                    </p>
                </div>
                <label className="flex h-11 w-full items-center gap-2 rounded-box border border-field bg-control px-2.5 focus-within:border-focus-line focus-within:ring-3 focus-within:ring-focus-ring home:h-8 home:w-55 home:rounded-field">
                    <SearchIcon aria-hidden="true" className="size-3.5 shrink-0 text-faint" />
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        aria-label={aria("filterEndpoints")}
                        placeholder={t("filter")}
                        className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-faint"
                    />
                </label>
            </div>
            <p role="status" className="sr-only">
                {filtering ? t("matches", { count: found }) : ""}
            </p>
            <nav
                aria-label={aria("categories")}
                className="hidden flex-wrap items-center gap-x-5 gap-y-2 pb-5.5 text-sm home:flex"
            >
                <span className="text-faint">{t("jump")}</span>
                {shown.map((category) => (
                    <a key={category.id} href={`#${category.anchor}`} className="prose-link">
                        {category.title}
                        <span className="ml-1.25 font-mono text-xs text-faint">
                            {category.entries.length}
                        </span>
                    </a>
                ))}
            </nav>
            {shown.length === 0 ? (
                <p className="border-t border-line-soft py-8 text-sm text-muted">
                    {t("empty", { query: query.trim() })}
                </p>
            ) : (
                shown.map((category) => (
                    <Category
                        key={category.id}
                        category={category}
                        open={filtering || opened.includes(category.id)}
                        phone={phone}
                        onToggle={() => toggle(category.id)}
                    />
                ))
            )}
        </section>
    );
}
