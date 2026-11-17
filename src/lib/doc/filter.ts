import type { NavCategory, NavLink } from "@/lib/nav";

/**
 * Tells whether a sidebar entry answers the filter: its name or its route contains the query, or
 * one of its sub-pages does.
 *
 * @param link - Entry of a category, with its sub-pages as children
 * @param needle - Query, already trimmed and lower-cased, without a leading slash
 * @returns True when the name, the route ("/hash") or a child matches
 */
function matches(link: NavLink, needle: string): boolean {
    return (
        link.title.toLowerCase().includes(needle) ||
        link.slug.toLowerCase().includes(needle) ||
        link.children.some((child) => matches(child, needle))
    );
}

/**
 * Shortens the name of a sub-page under its parent: "Chat Clear" under "Chat" reads "Clear",
 * since the nesting already says the family. Only a leading name is dropped, ignoring case, as a
 * trailing one would leave a dangling word in French; a name equal to the parent's is kept whole.
 *
 * @param parent - Name of the entry that lists the sub-page
 * @param child - Name of the sub-page
 * @returns The name without the parent's name and the space next to it
 */
export function childLabel(parent: string, child: string): string {
    const name = parent.toLowerCase();
    const lower = child.toLowerCase();
    if (lower.startsWith(`${name} `) && child.trim().length > name.length) {
        return child.slice(name.length + 1);
    }
    return child;
}

/**
 * Filters the catalogue of the sidebar by name and route: a category keeps the entries that
 * match and disappears when none does.
 *
 * @param categories - Categories of the sidebar, each with its entries
 * @param query - Text typed in the filter; blank keeps everything
 * @returns The categories with the matching entries only, counts left as they are
 */
export function filterCatalogue(categories: readonly NavCategory[], query: string): NavCategory[] {
    const needle = query.trim().replace(/^\/+/, "").toLowerCase();
    if (needle === "") return [...categories];
    return categories
        .map((category) => ({
            ...category,
            items: category.items.filter((item) => matches(item, needle)),
        }))
        .filter((category) => category.items.length > 0);
}

/**
 * Finds the category that holds a page, directly or as the sub-page of one of its entries.
 *
 * @param categories - Categories of the sidebar
 * @param slug - Page id being read
 * @returns The category id, or undefined for a page outside the catalogue
 */
export function categoryOf(categories: readonly NavCategory[], slug: string): string | undefined {
    return categories.find((category) =>
        category.items.some(
            (item) => item.slug === slug || item.children.some((child) => child.slug === slug),
        ),
    )?.id;
}
