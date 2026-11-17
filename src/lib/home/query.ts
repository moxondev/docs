import type { CategoryId } from "@/data/catalogue";
import type { Method, PageStatus } from "@/types/content";

export interface HomeEntry {
    slug: string;
    name: string;
    tagline: string;
    route: string;
    href: string;
    methods: Method[];
    status?: PageStatus;
}

export interface HomeCategory {
    id: CategoryId;
    anchor: string;
    title: string;
    summary: string;
    entries: HomeEntry[];
}

/**
 * Counts the entries of a list of categories, the figure printed next to the catalogue title.
 *
 * @param categories - Categories as shown, filtered or not
 * @returns The number of entries over every category
 */
export function countEntries(categories: readonly HomeCategory[]): number {
    return categories.reduce((sum, category) => sum + category.entries.length, 0);
}

/**
 * Folds a text for the filter: lower case, accents removed, so that a query typed without accents
 * still finds a name or a description that has them.
 *
 * @param text - Text to compare, such as an entry name, a route, a tagline or the typed query
 * @returns The text in lower case without accents
 */
export function fold(text: string): string {
    return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/**
 * Filters the catalogue by what the reader types: an entry stays when its name, its route or its
 * short description contains the query (accents and case ignored, a leading slash allowed), and a
 * category without entry left disappears.
 *
 * @param categories - Categories to filter, in display order; the input is not modified
 * @param query - Text of the filter field; blank keeps everything
 * @returns The categories with the matching entries only
 */
export function filterCategories(
    categories: readonly HomeCategory[],
    query: string,
): HomeCategory[] {
    const needle = fold(query.trim().replace(/^\/+/, ""));
    if (needle === "") return [...categories];
    return categories
        .map((category) => ({
            ...category,
            entries: category.entries.filter((entry) =>
                fold(`${entry.name} ${entry.route} ${entry.tagline}`).includes(needle),
            ),
        }))
        .filter((category) => category.entries.length > 0);
}
