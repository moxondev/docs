"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { MethodChip } from "@/components/try/Form";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CATEGORIES } from "@/data/catalogue";
import type { Lang, Version } from "@/types/content";
import type { PlaygroundEntry } from "@/types/try";

export interface PickerProps {
    version: Version;
    entries: PlaygroundEntry[];
    value: string | null;
    onSelect: (slug: string) => void;
}

export interface PickerGroup {
    id: string;
    title: string;
    entries: PlaygroundEntry[];
}

/**
 * Groups the operations of the Playground by the categories of the catalogue, in display order;
 * operations without a category come first, ungrouped.
 *
 * @param entries - Operations with try true of the version, each with its page slug and name
 * @param lang - Picks the English or French title of each category
 * @returns One group per non-empty category, each in the order of the entries
 */
export function groupEntries(entries: PlaygroundEntry[], lang: Lang): PickerGroup[] {
    const groups: PickerGroup[] = [];
    const loose = entries.filter((entry) => !entry.category);
    if (loose.length > 0) groups.push({ id: "other", title: "", entries: loose });
    for (const category of CATEGORIES) {
        const inside = entries.filter((entry) => entry.category === category.id);
        if (inside.length > 0) {
            groups.push({ id: category.id, title: category.title[lang], entries: inside });
        }
    }
    return groups;
}

/**
 * Ranks an entry against the filter text of the picker: a plain, case-insensitive substring match
 * (the fuzzy matching of cmdk finds "avat" in "chat/private"), with the entries whose name starts
 * with the text first.
 *
 * @param value - Searchable text of the entry: name, method, path and slug
 * @param search - Text typed in the filter field
 * @returns 1 when the name starts with the text, 0.5 when the text appears elsewhere, 0 to hide
 */
export function scoreEntry(value: string, search: string): number {
    const text = value.toLowerCase();
    const needle = search.trim().toLowerCase();
    if (needle === "" || text.startsWith(needle)) return 1;
    return text.includes(needle) ? 0.5 : 0;
}

/**
 * Searchable endpoint picker of the Playground: a combobox button that opens a popover with a
 * filter field and the operations grouped by category. The filter matches the name, the method
 * and the path, so "post", "/hash" and "has" all find Hash.
 *
 * @param version - Version whose operations are listed; printed before the path of the selected one
 * @param entries - Operations with try true of that version, each with its page slug and name
 * @param value - Slug of the selected entry, null when none is selected
 * @param onSelect - Called with the slug of the entry the reader picks
 */
export function Picker({ version, entries, value, onSelect }: PickerProps) {
    const t = useTranslations("playground");
    const lang = useLocale() as Lang;
    const [open, setOpen] = useState(false);
    const groups = useMemo(() => groupEntries(entries, lang), [entries, lang]);
    const selected = entries.find((entry) => entry.slug === value) ?? null;
    const category = CATEGORIES.find((item) => item.id === selected?.category)?.title[lang];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label={t("selectEndpoint")}
                    className="h-11 w-full max-w-md justify-start gap-2.5 rounded-box px-3 text-[15px]"
                >
                    {selected ? (
                        <>
                            <span className="font-medium text-ink">{selected.name}</span>
                            <MethodChip method={selected.op.method} className="wide:hidden" />
                            <span className="truncate font-mono text-xs text-muted wide:hidden">
                                {`/${version}${selected.op.path}`}
                            </span>
                            {category ? (
                                <span className="truncate text-xs text-muted max-wide:hidden">
                                    {category}
                                </span>
                            ) : null}
                        </>
                    ) : (
                        <span className="text-faint">{t("selectEndpoint")}</span>
                    )}
                    <ChevronDown aria-hidden="true" className="ml-auto size-4 text-muted" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                aria-label={t("selectEndpoint")}
                className="w-(--radix-popover-trigger-width) min-w-72 rounded-box border-line bg-surface p-0 shadow-palette"
            >
                <Command filter={scoreEntry}>
                    <CommandInput placeholder={t("search")} aria-label={t("search")} />
                    <CommandList className="max-h-80">
                        <CommandEmpty>{t("noResults")}</CommandEmpty>
                        {groups.map((group) => (
                            <CommandGroup key={group.id} heading={group.title || undefined}>
                                {group.entries.map((entry) => (
                                    <CommandItem
                                        key={entry.slug}
                                        value={`${entry.name} ${entry.op.method} ${entry.op.path} ${entry.slug}`}
                                        onSelect={() => {
                                            onSelect(entry.slug);
                                            setOpen(false);
                                        }}
                                        data-checked={entry.slug === value || undefined}
                                        className="gap-2.5 text-ink max-desk:min-h-11 data-[checked=true]:font-medium data-[selected=true]:bg-chip data-[selected=true]:text-ink"
                                    >
                                        <span>{entry.name}</span>
                                        <span className="ml-auto flex items-center gap-2">
                                            <MethodChip method={entry.op.method} />
                                            <span className="font-mono text-xs text-muted">
                                                {entry.op.path}
                                            </span>
                                        </span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
