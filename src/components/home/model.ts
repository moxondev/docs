import type { HomeCategory } from "@/components/home/query";
import { CATEGORIES } from "@/data/catalogue";
import { catalogueEntry, sidebar } from "@/lib/nav";
import type { Lang, Version } from "@/types/content";
import type { Nav } from "@/types/nav";

export { countEntries, filterCategories, fold } from "@/components/home/query";
export type { HomeCategory, HomeEntry } from "@/components/home/query";

/**
 * Builds the catalogue of the home page from the navigation index: the categories in display order
 * with their entries alphabetical inside, each with its description, its route and the methods of
 * its whole family. Nothing is typed here, so what the version does not list is absent.
 *
 * @param nav - Navigation index, the pages that exist per version
 * @param version - Version whose catalogue is shown, the latest one
 * @param lang - Language of the names, descriptions and paths
 * @returns The non-empty categories with their entries
 */
export function homeCatalogue(nav: Nav, version: Version, lang: Lang): HomeCategory[] {
    return sidebar(nav, version, lang).catalogue.map((category) => ({
        id: category.id,
        anchor: category.anchor,
        title: category.title,
        summary: CATEGORIES.find((def) => def.id === category.id)?.summary[lang] ?? "",
        entries: category.items.map((item) => ({
            slug: item.slug,
            name: item.title,
            tagline: catalogueEntry(item.slug)?.tagline[lang] ?? "",
            route: `/${item.slug}`,
            href: item.href,
            methods: item.methods,
            ...(item.status ? { status: item.status } : {}),
        })),
    }));
}
