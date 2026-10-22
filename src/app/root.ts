import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CATALOGUE } from "@/data/catalogue";
import { NAV } from "@/data/nav";
import { LATEST } from "@/data/versions";
import { localePath } from "@/i18n/routing";
import {
    breadcrumbJsonLd,
    buildMetadata,
    type JsonLd,
    type MetaText,
    rootMetadata,
    websiteJsonLd,
} from "@/lib/metadata";
import { isListed } from "@/lib/nav";
import { type DocParams, resolveDoc } from "@/lib/pages";
import { href } from "@/lib/routes";
import { pageTrail } from "@/lib/trail";
import type { Lang } from "@/types/content";

type MetaTranslate = Awaited<ReturnType<typeof getTranslations<"meta">>>;

/**
 * Counts the endpoints that the latest version lists, the figure of the home lead and of the
 * default meta description (computed from the catalogue, never typed).
 *
 * @returns The number of catalogue entries listed in the latest version
 */
export function listedCount(): number {
    return CATALOGUE.filter((entry) => isListed(entry, LATEST)).length;
}

/**
 * Reads the site-wide words of the meta messages that every metadata builder needs.
 *
 * @param t - Translator of the meta namespace of a language
 * @returns The site name and the title template
 */
function metaText(t: MetaTranslate): MetaText {
    return { siteName: t("siteName"), template: t("template") };
}

/**
 * Builds the metadata that every page of a root layout inherits: base URL, title template,
 * default title and description of the home, icons, manifest and social card defaults.
 *
 * @param lang - Language of the root layout, which picks the meta messages
 * @returns The base URL, title template, icons and social card defaults
 */
export async function layoutMetadata(lang: Lang): Promise<Metadata> {
    const t = await getTranslations({ locale: lang, namespace: "meta" });
    return rootMetadata(lang, metaText(t), {
        title: t("home.title"),
        description: t("home.description", { count: listedCount() }),
    });
}

/**
 * Builds the metadata of a home page: its own title (no site suffix, the title already names the
 * site), the description with the computed endpoint count, the canonical URL, the hreflang
 * alternates with x-default and the social cards, complete since Next replaces the layout ones.
 *
 * @param lang - Picks the meta messages and the canonical path of the home
 * @returns The metadata for the generateMetadata of the home route
 */
export async function homeMetadata(lang: Lang): Promise<Metadata> {
    const t = await getTranslations({ locale: lang, namespace: "meta" });
    return buildMetadata(
        lang,
        {
            title: t("home.title"),
            description: t("home.description", { count: listedCount() }),
            path: localePath(lang),
            absolute: true,
        },
        metaText(t),
    );
}

/**
 * Builds the WebSite structured data of a home page.
 *
 * @param lang - Picks the site name, the description and the URL of the home in the structured data
 * @returns The JSON-LD object, with the site name and the description of that language
 */
export async function homeJsonLd(lang: Lang): Promise<JsonLd> {
    const t = await getTranslations({ locale: lang, namespace: "meta" });
    return websiteJsonLd(lang, t("siteName"), t("home.description", { count: listedCount() }));
}

/**
 * Builds the BreadcrumbList structured data of an endpoint page: the site, the parent entry of a
 * sub-page and the page. The catalogue and the category are fragments of the home, not documents
 * of their own, so they stay in the visible breadcrumb only.
 *
 * @param lang - Picks the site name, the group labels and the URLs of the trail
 * @param params - Route params of Next, resolved to the page
 * @returns The JSON-LD object, or null for any page that is not an endpoint (or an unknown route)
 */
export async function docJsonLd(lang: Lang, params: Promise<DocParams>): Promise<JsonLd | null> {
    const doc = await resolveDoc(params);
    if (!doc || doc.page.kind !== "endpoint") return null;
    const meta = await getTranslations({ locale: lang, namespace: "meta" });
    const crumbs = await getTranslations({ locale: lang, namespace: "crumbs" });
    const trail = pageTrail(
        NAV,
        doc.version,
        doc.id,
        lang,
        { home: meta("siteName"), group: (key) => crumbs(key) },
        href(lang, doc.version, doc.id),
    );
    const documents = trail.filter((crumb) => !crumb.path.includes("#"));
    return documents.length > 0 ? breadcrumbJsonLd(documents) : null;
}
