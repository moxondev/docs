import { docKey, type SearchCounts } from "@/lib/search";
import type { Method } from "@/types/content";
import type { SearchDoc, SearchGroup, SearchGroupId } from "@/types/search";

export type ActivateMode = "open" | "tab" | "playground";

export interface DocEntry {
    kind: "doc";
    value: string;
    doc: SearchDoc;
}

export interface SuggestEntry {
    kind: "suggest";
    value: string;
    text: string;
    total: number;
    counts: SearchCounts;
}

export interface LinkEntry {
    kind: "catalogue" | "playground";
    value: string;
    href: string;
}

export type Entry = DocEntry | SuggestEntry | LinkEntry;

export type SectionId = SearchGroupId | "didYouMean" | "other";

export interface Section {
    id: SectionId;
    entries: Entry[];
}

export interface Choice {
    query: string;
    value: string;
}

export interface Suggestion {
    text: string;
    total: number;
    counts: SearchCounts;
}

export type FilterMethod = Extract<Method, "get" | "post">;

// Any method prefix at the start of a query, the one a chip of the phone filter replaces
const PREFIX = /^\s*(?:get|post|put|patch|delete):\s*/i;

/**
 * Wraps a search document as a row of the list.
 *
 * @param doc - Search document to wrap, whose key becomes the cmdk value
 * @returns The row of kind "doc", holding the document and its key as the cmdk value
 */
export function docEntry(doc: SearchDoc): DocEntry {
    return { kind: "doc", value: docKey(doc), doc };
}

/**
 * Arranges what the palette lists: the groups of the search, or after a query that found nothing
 * the corrected query, when there is one, then the other ways in.
 *
 * @param groups - Groups of the search view, in display order
 * @param suggestion - Corrected query of the search view, null when there is none
 * @param hasQuery - Whether the field holds something
 * @param links - The "other options" rows, built by the palette for its version and language
 * @returns The sections to print, none empty
 */
export function buildSections(
    groups: readonly SearchGroup[],
    suggestion: Suggestion | null,
    hasQuery: boolean,
    links: readonly LinkEntry[],
): Section[] {
    if (groups.length > 0) {
        return groups.map((group) => ({ id: group.id, entries: group.docs.map(docEntry) }));
    }
    if (!hasQuery) return [];

    const sections: Section[] = [];
    if (suggestion) {
        sections.push({
            id: "didYouMean",
            entries: [{ kind: "suggest", value: `suggest:${suggestion.text}`, ...suggestion }],
        });
    }
    if (links.length > 0) sections.push({ id: "other", entries: [...links] });
    return sections;
}

/**
 * Lists the rows of the sections in display order, the order the arrow keys walk.
 *
 * @param sections - Sections in display order, whose entries are concatenated
 * @returns Every entry, flat
 */
export function flatEntries(sections: readonly Section[]): Entry[] {
    return sections.flatMap((section) => section.entries);
}

/**
 * Tells which row is selected: the one the reader chose (hover, arrows) for this very query when
 * it is still listed, else the first row on desktop, none on a phone.
 *
 * @param values - cmdk values of the rows, in display order
 * @param choice - Last choice of the reader, with the query it was made for
 * @param query - Current text of the field, which a stale choice is compared with
 * @param autoSelect - Whether the first row is selected by default
 * @returns The value of the selected row, empty when no row is selected
 */
export function pickValue(
    values: readonly string[],
    choice: Choice | null,
    query: string,
    autoSelect: boolean,
): string {
    if (choice && choice.query === query && values.includes(choice.value)) return choice.value;
    return autoSelect && values.length > 0 ? values[0] : "";
}

/**
 * Writes the method prefix of a filter chip into the query, replacing the one that is there.
 *
 * @param query - Text of the field; a method prefix already there is replaced
 * @param method - "get" or "post" to filter, null to remove the filter
 * @returns The new text, for example "post: hash"
 */
export function withMethod(query: string, method: FilterMethod | null): string {
    const rest = query.replace(PREFIX, "");
    return method ? `${method}: ${rest}` : rest;
}

/**
 * Lists the kinds of results with their count, for "6 results: 2 endpoints, 2 parameters".
 *
 * @param counts - Results per group
 * @returns The group ids that have at least one result, in display order
 */
export function countedKinds(counts: SearchCounts): (keyof SearchCounts)[] {
    const order: (keyof SearchCounts)[] = ["endpoints", "params", "errors", "pages"];
    return order.filter((id) => counts[id] > 0);
}
