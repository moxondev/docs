import {
    ChevronRightIcon,
    CornerDownLeftIcon,
    FileTextIcon,
    FlaskConicalIcon,
    LayoutGridIcon,
    type LucideIcon,
    SearchIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { MouseEvent, ReactNode } from "react";

import { Method } from "@/components/doc/Method";
import { Status } from "@/components/doc/Status";
import {
    type ActivateMode,
    countedKinds,
    type DocEntry,
    type Entry,
    type LinkEntry,
    type Section,
    type SuggestEntry,
} from "@/components/search/entries";
import { Marked } from "@/components/search/Marked";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import type { SearchIndex } from "@/lib/search";

export interface ResultsProps {
    sections: Section[];
    words: string[];
    index: SearchIndex;
    catalogue: { endpoints: number; categories: number };
    onActivate: (entry: Entry, mode: ActivateMode) => void;
}

export interface RowProps {
    entry: Entry;
    mark: ReactNode;
    first: ReactNode;
    second: ReactNode;
    onActivate: (entry: Entry, mode: ActivateMode) => void;
}

export interface DocRowProps {
    entry: DocEntry;
    words: string[];
    index: SearchIndex;
    onActivate: (entry: Entry, mode: ActivateMode) => void;
}

export interface IconMarkProps {
    icon: LucideIcon;
}

export interface SuggestRowProps {
    entry: SuggestEntry;
    onActivate: (entry: Entry, mode: ActivateMode) => void;
}

export interface LinkRowProps {
    entry: LinkEntry;
    catalogue: { endpoints: number; categories: number };
    onActivate: (entry: Entry, mode: ActivateMode) => void;
}

// Heading of a group: faint, the first one closer to the top of the list
const GROUP =
    "p-0 text-ink [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-3.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-faint max-desk:[&_[cmdk-group-heading]]:px-5 first:[&_[cmdk-group-heading]]:pt-2";

// Method chips of a result stacked in the mark column when a family has two methods
const CHIPS = "flex-col items-center gap-0.5";

/**
 * Opens a result in a new tab when the row is clicked with Ctrl or Cmd held, and leaves every
 * other click to the list, which opens it in the page.
 *
 * @param event - Click event, captured before the list handles it
 * @param entry - Row that was clicked
 * @param onActivate - Opens a row
 */
function modifierClick(
    event: MouseEvent<HTMLElement>,
    entry: Entry,
    onActivate: (entry: Entry, mode: ActivateMode) => void,
): void {
    if (!event.metaKey && !event.ctrlKey) return;
    event.preventDefault();
    event.stopPropagation();
    onActivate(entry, "tab");
}

/**
 * Frame of one row of the list: the mark column, two lines of text and, on the selected row of a
 * desktop, the enter icon. The selected row has the yellow ground and the hover moves it.
 *
 * @param entry - Row, whose value is the cmdk value
 * @param mark - Content of the mark column: method chips, a status code or an icon
 * @param first - First line, the name
 * @param second - Second line, the description
 * @param onActivate - Opens the row, on Enter, on a click and on a Ctrl or Cmd click
 */
function Row({ entry, mark, first, second, onActivate }: RowProps) {
    return (
        <CommandItem
            value={entry.value}
            onSelect={() => onActivate(entry, "open")}
            onClickCapture={(event) => modifierClick(event, entry, onActivate)}
            className="group/row min-h-13.5 items-center gap-3 rounded-cta px-2.5 py-2 text-ink data-[selected=true]:bg-active data-[selected=true]:text-ink max-desk:min-h-13 max-desk:rounded-none max-desk:px-5"
        >
            <span className="flex w-12 shrink-0 items-center justify-center">{mark}</span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.75">
                <span className="flex min-w-0 items-baseline gap-2 text-sm/[1.25] font-medium max-desk:text-[16px]/[1.25] [&_b]:font-bold">
                    {first}
                </span>
                <span className="truncate text-[14px]/[1.3] font-normal text-muted [&_b]:font-[650]">
                    {second}
                </span>
            </span>
            <CornerDownLeftIcon
                aria-hidden="true"
                className="hidden size-3.75 shrink-0 text-ink desk:group-data-[selected=true]/row:block"
            />
        </CommandItem>
    );
}

/**
 * Icon mark of a row that has no method: a page, a section, a suggestion or a link.
 *
 * @param icon - Lucide icon, drawn in the muted colour
 */
function IconMark({ icon: Glyph }: IconMarkProps) {
    return <Glyph aria-hidden="true" className="size-4 text-muted" />;
}

/**
 * Row of a search document, whose mark, name and description depend on its kind. Typed words are
 * bold, and an endpoint or page that has a status shows its pictogram after the name.
 *
 * @param entry - Row of a document
 * @param words - Folded words of the query, for the bold matches
 * @param index - Index of the version, which gives the title of the page of a row
 * @param onActivate - Opens the row
 */
function DocRow({ entry, words, index, onActivate }: DocRowProps) {
    const t = useTranslations("search");
    const { doc } = entry;
    const page = index.byKey.get(`${doc.u}#`)?.t ?? "";
    const named = doc.k === "param" || doc.k === "field" || doc.k === "error";

    let second = doc.d ?? "";
    if (doc.k === "param" || doc.k === "field") {
        const values = doc.k === "param" && doc.n ? t("rows.values", { count: doc.n }) : "";
        const detail = [doc.d, values].filter(Boolean).join(", ");
        second = detail ? t("rows.param", { page, description: detail }) : page;
    } else if (doc.k === "error") second = t("rows.error", { page });
    else if (doc.k === "section") second = t("rows.section", { page });

    let mark: ReactNode = <IconMark icon={FileTextIcon} />;
    if (doc.k === "error") {
        mark = <span className="font-mono text-xs font-semibold text-status">{doc.n}</span>;
    } else if (doc.m?.length) mark = <Method methods={doc.m} variant="tag" className={CHIPS} />;
    else if (doc.u.endsWith("/playground/")) mark = <IconMark icon={FlaskConicalIcon} />;

    const title = (
        <span className={named ? "truncate font-mono text-[14px]" : "truncate"}>
            <Marked text={doc.t} words={words} />
        </span>
    );
    const status = doc.s ? (
        <Status
            status={doc.s}
            titled={false}
            className="size-4 self-center rounded-tag -translate-y-px"
        />
    ) : null;

    let first: ReactNode = (
        <>
            {title}
            {status}
        </>
    );
    if (doc.k === "endpoint") {
        first = (
            <>
                {title}
                {status}
                <span className="truncate font-mono text-xs font-normal text-muted">
                    <Marked text={doc.r ?? ""} words={words} />
                </span>
            </>
        );
    } else if (doc.k === "section") {
        first = (
            <>
                <span className="truncate">{page}</span>
                <ChevronRightIcon
                    aria-hidden="true"
                    className="size-3.5 shrink-0 self-center text-faint"
                />
                {title}
            </>
        );
    }

    return (
        <Row
            entry={entry}
            mark={mark}
            first={first}
            second={<Marked text={second} words={words} />}
            onActivate={onActivate}
        />
    );
}

/**
 * Row that offers the corrected query ("Did you mean"): the new text and what it would find.
 *
 * @param entry - Row of the suggestion
 * @param onActivate - Puts the suggested text in the field
 */
function SuggestRow({ entry, onActivate }: SuggestRowProps) {
    const t = useTranslations("search");
    const details = countedKinds(entry.counts)
        .map((id) => t(`kinds.${id}`, { count: entry.counts[id] }))
        .join(", ");

    return (
        <Row
            entry={entry}
            mark={<IconMark icon={SearchIcon} />}
            first={<span className="truncate">{entry.text}</span>}
            second={t("none.summary", { results: t("count", { count: entry.total }), details })}
            onActivate={onActivate}
        />
    );
}

/**
 * Row of the "other options" group: browse the catalogue, open the Playground.
 *
 * @param entry - Row of the link
 * @param catalogue - Number of endpoints and categories of the catalogue, for its hint
 * @param onActivate - Goes to the link
 */
function LinkRow({ entry, catalogue, onActivate }: LinkRowProps) {
    const t = useTranslations("search");
    const grid = entry.kind === "catalogue";

    return (
        <Row
            entry={entry}
            mark={<IconMark icon={grid ? LayoutGridIcon : FlaskConicalIcon} />}
            first={
                <span className="truncate">{t(grid ? "other.catalogue" : "other.playground")}</span>
            }
            second={
                grid
                    ? t("other.catalogueHint", {
                          count: catalogue.endpoints,
                          categories: catalogue.categories,
                      })
                    : t("other.playgroundHint")
            }
            onActivate={onActivate}
        />
    );
}

/**
 * Groups of the list of the palette. Every row is a cmdk item whose value is its key, so cmdk only
 * handles the keyboard, the selection and the ARIA of the list while MiniSearch keeps the ranking.
 *
 * @param sections - Groups to print, none empty
 * @param words - Folded words of the query, for the bold matches
 * @param index - Index of the version, which gives the page titles
 * @param catalogue - Number of endpoints and categories, for the hint of the catalogue row
 * @param onActivate - Opens a row: in the page, in a new tab or in the Playground
 */
export function Results({ sections, words, index, catalogue, onActivate }: ResultsProps) {
    const t = useTranslations("search");

    return (
        <>
            {sections.map((section) => (
                <CommandGroup
                    key={section.id}
                    heading={t(`groups.${section.id}`)}
                    className={GROUP}
                >
                    {section.entries.map((entry) => {
                        if (entry.kind === "doc") {
                            return (
                                <DocRow
                                    key={entry.value}
                                    entry={entry}
                                    words={words}
                                    index={index}
                                    onActivate={onActivate}
                                />
                            );
                        }
                        if (entry.kind === "suggest") {
                            return (
                                <SuggestRow
                                    key={entry.value}
                                    entry={entry}
                                    onActivate={onActivate}
                                />
                            );
                        }
                        return (
                            <LinkRow
                                key={entry.value}
                                entry={entry}
                                catalogue={catalogue}
                                onActivate={onActivate}
                            />
                        );
                    })}
                </CommandGroup>
            ))}
        </>
    );
}
