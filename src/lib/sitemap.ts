import type { MetadataRoute } from "next";

import { VERSIONS } from "@/data/versions";
import { localePath, routing } from "@/i18n/routing";
import { absoluteUrl, href } from "@/lib/routes";
import type { Lang } from "@/types/content";
import type { Nav } from "@/types/nav";

// Languages of the site, English first: the x-default alternate is the English URL
const LANGS: readonly Lang[] = routing.locales;

/**
 * Gives the absolute URL of a page in every language.
 *
 * @param path - Site path of the page in a language
 * @returns One absolute URL per language
 */
function urlsOf(path: (lang: Lang) => string): Record<Lang, string> {
    return { en: absoluteUrl(path("en")), fr: absoluteUrl(path("fr")) };
}

/**
 * Builds one sitemap entry per language of a page, each with the hreflang alternates of the
 * same page and, when known, its update date.
 *
 * @param urls - Absolute URL of the page in each language
 * @param modified - ISO date of the last update of the page, undefined when unknown
 * @returns The entries of the page, in language order
 */
function pageEntries(urls: Record<Lang, string>, modified?: string): MetadataRoute.Sitemap {
    const languages = { en: urls.en, fr: urls.fr, "x-default": urls.en };
    return LANGS.map((lang) => ({
        url: urls[lang],
        lastModified: modified,
        alternates: { languages },
    }));
}

/**
 * Finds the most recent update date of the latest version, the date of the home pages.
 *
 * @param nav - Navigation index, whose pages carry their update date
 * @returns The latest ISO date among the pages of the latest version, undefined when none has one
 */
function latestUpdate(nav: Nav): string | undefined {
    const dates = Object.values(nav[VERSIONS[0].id] ?? {}).flatMap((page) =>
        page.updated ? [page.updated] : [],
    );
    return dates.sort().at(-1);
}

/**
 * Lists the pages of the sitemap: the two homes, then every documentation page of every version
 * in both languages. Legacy URLs are not listed, they are redirect files.
 *
 * @param nav - Navigation index of the published pages (the generated NAV module)
 * @returns The entries in a stable order: homes, then versions newest first, pages by id
 */
export function sitemapEntries(nav: Nav): MetadataRoute.Sitemap {
    const entries = pageEntries(
        urlsOf((lang) => localePath(lang)),
        latestUpdate(nav),
    );
    for (const { id: version } of VERSIONS) {
        for (const [id, page] of Object.entries(nav[version] ?? {})) {
            entries.push(
                ...pageEntries(
                    urlsOf((lang) => href(lang, version, id)),
                    page.updated,
                ),
            );
        }
    }
    return entries;
}
