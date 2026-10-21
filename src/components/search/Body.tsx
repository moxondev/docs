import { useTranslations } from "next-intl";
import { type KeyboardEvent, useMemo, useRef, useState } from "react";

import { catalogueTarget, toolTarget } from "@/components/chrome/targets";
import { useDesk } from "@/components/search/desk";
import {
    type ActivateMode,
    buildSections,
    type Choice,
    type Entry,
    type FilterMethod,
    flatEntries,
    type LinkEntry,
    pickValue,
    withMethod,
} from "@/components/search/entries";
import { Field, Filters } from "@/components/search/Field";
import { Hints } from "@/components/search/Hints";
import { queryWords } from "@/components/search/marks";
import { Preview } from "@/components/search/Preview";
import { Results } from "@/components/search/Results";
import { Tips } from "@/components/search/Tips";
import { Button } from "@/components/ui/button";
import { Command, CommandList } from "@/components/ui/command";
import { CATALOGUE, CATEGORIES } from "@/data/catalogue";
import { KINDS } from "@/data/kinds";
import { NAV } from "@/data/nav";
import { useSearch } from "@/hooks/useSearch";
import { matches, SHORTCUT } from "@/hooks/useShortcuts";
import { isListed } from "@/lib/nav";
import { playgroundHref } from "@/lib/search";
import type { Lang, Version } from "@/types/content";
import type { SearchDoc } from "@/types/search";

export interface BodyProps {
    lang: Lang;
    version: Version;
    seed: string;
    onGo: (href: string, flash: boolean) => void;
    onClose: () => void;
}

export interface ActivateContext {
    open: (doc: SearchDoc) => string;
    setQuery: (text: string) => void;
    onGo: (href: string, flash: boolean) => void;
}

export interface NoResultProps {
    query: string;
    version: Version;
}

export interface StatusLineProps {
    failed: boolean;
    onRetry: () => void;
}

// List value with no row selected: cmdk picks the first row on an empty one, so it matches none
const NO_ROW = "none:selected";

/**
 * Builds the rows of the "other options" group: the catalogue of the home page and the Playground
 * of the version being read (the latest one when that version has none).
 *
 * @param lang - Picks the path prefix of both links (none for English, /fr for French)
 * @param version - Version whose Playground to open
 * @returns The two link rows
 */
function linkEntries(lang: Lang, version: Version): LinkEntry[] {
    return [
        { kind: "catalogue", value: "other:catalogue", href: catalogueTarget(lang) },
        {
            kind: "playground",
            value: "other:playground",
            href: toolTarget(KINDS, lang, version, "playground"),
        },
    ];
}

/**
 * Carries out the opening of a row. A document is saved among the recent results, then opened as
 * the mode says; a suggestion fills the field and a link goes to its address.
 *
 * @param entry - Row to carry out; a suggestion or a link ignores mode
 * @param mode - "open" in the page, "tab" in a new tab, "playground" in the Playground
 * @param context - Actions of the palette: saving a recent result, setting the query, navigating
 */
function run(entry: Entry, mode: ActivateMode, context: ActivateContext): void {
    if (entry.kind === "suggest") {
        context.setQuery(entry.text);
        return;
    }
    if (entry.kind !== "doc") {
        context.onGo(entry.href, false);
        return;
    }
    const href = context.open(entry.doc);
    if (mode === "tab") {
        window.open(href, "_blank", "noopener");
        return;
    }
    if (mode === "playground") {
        const target = playgroundHref(entry.doc, NAV);
        if (target) context.onGo(target, false);
        return;
    }
    context.onGo(href, true);
}

/**
 * Header of the "no result" state: the title with the typed text, and the hint that names the
 * version the search covers.
 *
 * @param query - Text typed in the field, printed in the title
 * @param version - Version whose index is searched
 */
function NoResult({ query, version }: NoResultProps) {
    const t = useTranslations("search");

    return (
        <div role="status" className="flex flex-col gap-1.5 px-4.5 pt-5.5 pb-3.5 max-desk:px-5">
            <p className="text-[16px] font-semibold text-ink wrap-anywhere">
                {t("none.title", { query })}
            </p>
            <p className="text-sm/[1.55] text-text">{t("none.hint", { version })}</p>
        </div>
    );
}

/**
 * Line shown instead of the list while the index loads, or when it could not be loaded, with a
 * button to try again.
 *
 * @param failed - True when the index failed to load
 * @param onRetry - Loads the index again
 */
function StatusLine({ failed, onRetry }: StatusLineProps) {
    const t = useTranslations("search");
    const common = useTranslations("common");

    if (!failed) {
        return (
            <p role="status" className="px-4.5 py-6 text-sm text-faint max-desk:px-5">
                {t("loading")}
            </p>
        );
    }
    return (
        <div role="alert" className="flex flex-col items-start gap-3 px-2.5 py-6 max-desk:px-5">
            <p className="text-sm text-text">{t("failed")}</p>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                {common("error.retry")}
            </Button>
        </div>
    );
}

/**
 * Content of the open palette: the field, the method filter, the list of results and, on desktop,
 * the preview or the tips and the key hints. cmdk runs with filtering off, so MiniSearch keeps the
 * ranking, and the selection is controlled so that a phone selects no row until the reader moves.
 *
 * @param lang - Language of the index searched, from the path of the page
 * @param version - Version whose index is searched, the one being viewed
 * @param seed - Text the field starts with
 * @param onGo - Navigates to a path and closes the palette; true asks to flash the target
 * @param onClose - Called by the Cancel button of the phone field, to close without navigating
 */
export function Body({ lang, version, seed, onGo, onClose }: BodyProps) {
    const aria = useTranslations("aria");
    const desk = useDesk();
    const view = useSearch({ version, lang, active: true, seed, autoSelect: desk });
    const [choice, setChoice] = useState<Choice | null>(null);
    const [refused, setRefused] = useState(0);
    const moved = useRef(false);

    const hasQuery = view.query.trim() !== "";
    const ready = view.status === "ready";
    const links = useMemo(() => linkEntries(lang, version), [lang, version]);
    const catalogue = useMemo(
        () => ({
            endpoints: CATALOGUE.filter((entry) => isListed(entry, version)).length,
            categories: CATEGORIES.length,
        }),
        [version],
    );
    const sections = useMemo(
        () => buildSections(view.groups, view.suggestion, hasQuery, links),
        [view.groups, view.suggestion, hasQuery, links],
    );
    const entries = useMemo(() => flatEntries(sections), [sections]);
    const picked = pickValue(
        entries.map((entry) => entry.value),
        choice,
        view.query,
        desk,
    );
    const selected = entries.find((entry) => entry.value === picked) ?? null;
    const words = useMemo(() => queryWords(view.parsed.text), [view.parsed.text]);
    const method: FilterMethod | null =
        view.parsed.method === "post" || view.parsed.method === "get" ? view.parsed.method : null;
    const count = ready && hasQuery && view.total > 0 ? view.total : null;
    const context: ActivateContext = { open: view.open, setQuery: view.setQuery, onGo };

    const onActivate = (entry: Entry, mode: ActivateMode) => run(entry, mode, context);
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key.startsWith("Arrow") || event.key === "Home" || event.key === "End") {
            moved.current = true;
        }
        if (event.key === "Enter" && matches(event, SHORTCUT.playground)) {
            event.preventDefault();
            if (selected) run(selected, "playground", context);
        }
    };
    const onValueChange = (value: string) => {
        if (!desk && !moved.current) {
            setRefused((count) => count + 1);
            return;
        }
        setChoice({ query: view.query, value });
    };

    return (
        <Command
            shouldFilter={false}
            vimBindings={false}
            loop
            label={aria("searchDialog")}
            value={picked || `${NO_ROW}:${view.query}:${refused}`}
            onValueChange={onValueChange}
            onKeyDown={onKeyDown}
            className="min-h-0 flex-1 rounded-none bg-surface text-ink"
        >
            <Field
                query={view.query}
                onQuery={view.setQuery}
                count={count}
                onClear={() => view.setQuery("")}
                onCancel={onClose}
            />
            <Filters
                method={method}
                count={count}
                onMethod={(next) => view.setQuery(withMethod(view.query, next))}
            />
            <div className="flex min-h-0 flex-1 desk:h-[min(30.75rem,calc(100dvh-12.75rem))] desk:flex-none">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col desk:flex-none desk:basis-140">
                    {ready && view.index ? (
                        <>
                            {hasQuery && view.total === 0 ? (
                                <NoResult query={view.query.trim()} version={version} />
                            ) : null}
                            <CommandList
                                label={aria("searchResults")}
                                className="max-h-none min-h-0 flex-1 scroll-py-2 px-2 pt-1.5 pb-2.5 max-desk:px-0"
                            >
                                <Results
                                    sections={sections}
                                    words={words}
                                    index={view.index}
                                    catalogue={catalogue}
                                    onActivate={onActivate}
                                />
                            </CommandList>
                        </>
                    ) : (
                        <StatusLine failed={view.status === "error"} onRetry={view.retry} />
                    )}
                </div>
                <aside
                    aria-label={aria("searchPreview")}
                    className="hidden min-w-0 flex-1 flex-col border-l border-line-soft bg-side px-6 pt-5.5 pb-2 desk:flex"
                >
                    {selected?.kind === "doc" && view.index ? (
                        <Preview
                            entry={selected}
                            index={view.index}
                            lang={lang}
                            onActivate={onActivate}
                        />
                    ) : (
                        <Tips />
                    )}
                </aside>
            </div>
            <Hints />
        </Command>
    );
}
