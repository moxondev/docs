import { pick } from "@/lib/inline";
import type { Lang, Lx } from "@/types/content";

export interface ValueGroup {
    label: string;
    name: string | null;
    items: string[];
    primary: boolean;
}

// How many families are shown before the "Show more" button when no family holds a featured value
const FIRST_FAMILIES = 3;

// How many hidden family names the "Show more" button spells out
const NAMED_FAMILIES = 3;

/**
 * Finds the short name of a family of values from its label: the first word of the label that
 * the values themselves contain ("RSA Methods:" is RSA because RSA-MD5 holds it), so the name is
 * neither translated nor guessed. A label that shares no word with its values has no short name.
 *
 * @param label - Label of the group in the page language, trailing colon allowed
 * @param items - Values of the group
 * @returns The word as the label writes it, or null when no word of the label occurs in a value
 */
export function familyName(label: string, items: readonly string[]): string | null {
    const words = label.replace(/[\s:]+$/, "").split(/\s+/);
    const found = words.find(
        (word) =>
            word.length > 2 &&
            items.some((item) => item.toLowerCase().includes(word.toLowerCase())),
    );
    return found ?? null;
}

/**
 * Prepares the families of a Values block for the language: the label, the short name, the
 * values, and whether the family is shown before the expand button. The primary families are
 * those that hold a value featured by the page parameters, or the first ones when none does.
 *
 * @param groups - Groups of the block, each with a label per language
 * @param lang - Language that picks the label of each group
 * @param featured - Values that the parameters of the page feature, case-insensitive
 * @returns The families in the order of the block
 */
export function valueGroups(
    groups: readonly { label: Lx<string>; items: readonly string[] }[],
    lang: Lang,
    featured: readonly string[],
): ValueGroup[] {
    const wanted = new Set(featured.map((value) => value.toLowerCase()));
    const hit = groups.map((group) => group.items.some((item) => wanted.has(item.toLowerCase())));
    const anyHit = hit.some(Boolean);
    return groups.map((group, index) => {
        const label = pick(group.label, lang);
        return {
            label,
            name: familyName(label, group.items),
            items: [...group.items],
            primary: anyHit ? hit[index] : index < FIRST_FAMILIES,
        };
    });
}

/**
 * Spells out the families behind the expand button: the distinct short names of the hidden
 * families that have one, in order, at most NAMED_FAMILIES of them.
 *
 * @param groups - Families of the block
 * @returns The names, empty when every family is shown or none has a short name
 */
export function hiddenNames(groups: readonly ValueGroup[]): string[] {
    const names: string[] = [];
    for (const group of groups) {
        if (group.primary || group.name === null || names.includes(group.name)) continue;
        names.push(group.name);
        if (names.length === NAMED_FAMILIES) break;
    }
    return names;
}

/**
 * Keeps the values that contain a query, family by family; a family with no match disappears.
 *
 * @param groups - Families of the block
 * @param query - Text typed in the filter, compared without case and without surrounding spaces
 * @returns The families with their matching values only; every family whole for an empty query
 */
export function filterGroups(groups: readonly ValueGroup[], query: string): ValueGroup[] {
    const needle = query.trim().toLowerCase();
    if (needle === "") return [...groups];
    return groups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.toLowerCase().includes(needle)),
        }))
        .filter((group) => group.items.length > 0);
}
