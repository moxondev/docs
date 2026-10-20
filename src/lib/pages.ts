import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PAGES } from "@/data/pages/registry";
import { LATEST } from "@/data/versions";
import { pick, plain } from "@/lib/inline";
import { buildMetadata, metaDescription } from "@/lib/metadata";
import { catalogueEntry } from "@/lib/nav";
import { href, INDEX, isVersion } from "@/lib/routes";
import type { Lang, Page, Version } from "@/types/content";

export interface DocParams {
    version: string;
    slug?: string[];
}

export interface DocProps {
    params: Promise<DocParams>;
}

export interface DocRoute {
    version: Version;
    slug: string[];
}

export interface Doc {
    version: Version;
    id: string;
    page: Page;
}

export type MetaTranslate = (key: string, values?: Record<string, string>) => string;

/**
 * Gives the page id of the optional catch-all segment of a documentation route.
 *
 * @param slug - Segments after the version, absent or empty for the version home
 * @returns "index" for the home, else the segments joined with "/" ("captcha/verify")
 */
export function pageId(slug: readonly string[] | undefined): string {
    return slug?.length ? slug.join("/") : INDEX;
}

/**
 * Gives the catch-all segments of a page id, the inverse of pageId.
 *
 * @param id - Page id; "index" is the version home
 * @returns The segments, empty for the home
 */
export function slugOf(id: string): string[] {
    return id === INDEX ? [] : id.split("/");
}

/**
 * Lists the static params of every documentation route, read from the generated registry (the
 * published versions only, cheap, never scans the disk). Both languages have the same pages, so
 * the English and the French trees use the same list.
 *
 * @returns One { version, slug } per page; the version home has an empty slug
 */
export function docParams(): DocRoute[] {
    return (Object.keys(PAGES) as Version[]).flatMap((version) =>
        Object.keys(PAGES[version]).map((id) => ({ version, slug: slugOf(id) })),
    );
}

/**
 * Loads one page module through the registry.
 *
 * @param version - First route segment, any string (an unknown version gives null)
 * @param id - Page id; a name that is not an own key of the registry (such as "constructor")
 * gives null
 * @returns The page, or null when the version or the page does not exist
 */
export async function getPage(version: string, id: string): Promise<Page | null> {
    if (!isVersion(version) || !Object.hasOwn(PAGES[version], id)) return null;
    return PAGES[version][id]();
}

/**
 * Loads every page of a version, for the search index, the Markdown exports and the scripts.
 *
 * @param version - Published version; an unpublished one gives an empty list
 * @returns The pages in registry order (page ids sorted)
 */
export async function loadPages(version: Version): Promise<Page[]> {
    return Promise.all(Object.values(PAGES[version]).map((load) => load()));
}

/**
 * Resolves the params of a documentation route to its page.
 *
 * @param params - Route params promise of Next (version and optional slug segments)
 * @returns The version, the page id and the page, or null for an unknown route (the page then
 * calls notFound)
 */
export async function resolveDoc(params: Promise<DocParams>): Promise<Doc | null> {
    const { version, slug } = await params;
    const id = pageId(slug);
    const page = await getPage(version, id);
    return page && isVersion(version) ? { version, id, page } : null;
}

/**
 * Gives the title of a documentation page for the tab and the social cards: the page title on
 * the latest version, "Hash, v5" on the others, whose titles are otherwise the same.
 *
 * @param version - Version of the page, printed in the title only when it is not the latest
 * @param title - Plain title of the page in its language
 * @param t - Translator of the meta messages (meta.versioned)
 * @returns The title, before the "%s - moxon" template
 */
export function docTitle(version: Version, title: string, t: MetaTranslate): string {
    return version === LATEST ? title : t("versioned", { title, version });
}

/**
 * Builds the metadata of a documentation page: title, description chain (lead, catalogue
 * summary of an endpoint page, per-kind sentence), canonical path and alternates.
 *
 * @param lang - Picks the page title and the description, and prefixes the canonical path
 * @param doc - Version, id and module of the page
 * @param t - Translator of the meta namespace of that language
 * @returns The metadata of generateMetadata
 */
export function pageMetadata(lang: Lang, doc: Doc, t: MetaTranslate): Metadata {
    const { version, id, page } = doc;
    const title = plain(pick(page.title, lang));
    const heading =
        page.kind === "release"
            ? t("releaseTitle", { release: page.release?.version ?? title })
            : title;
    const entry = catalogueEntry(id);
    const fallback = t(`kinds.${page.kind}`, {
        version,
        title,
        name: entry?.name ?? title,
        release: page.release?.version ?? "",
    });
    const summary = entry?.slug === id ? entry.summary[lang] : undefined;
    return buildMetadata(
        lang,
        {
            title: docTitle(version, heading, t),
            description: metaDescription(page, lang, fallback, summary),
            path: href(lang, version, id),
        },
        { siteName: t("siteName"), template: t("template") },
    );
}

/**
 * Builds the metadata of a documentation route for its generateMetadata.
 *
 * @param locale - Language of the route tree
 * @param props - Route props of Next, whose params name the page
 * @returns The page metadata, or an empty object for an unknown route
 */
export async function docMetadata(locale: Lang, props: DocProps): Promise<Metadata> {
    const doc = await resolveDoc(props.params);
    if (!doc) return {};
    const t = await getTranslations({ locale, namespace: "meta" });
    return pageMetadata(locale, doc, (key, values) => t(key, values));
}
