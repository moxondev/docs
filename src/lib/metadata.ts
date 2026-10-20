import type { Metadata, Viewport } from "next";

import { SITE } from "@/data/site";
import { THEME_COLORS } from "@/data/theme";
import { LOCALE_TAGS, localePath } from "@/i18n/routing";
import { pick, plain } from "@/lib/inline";
import { absoluteUrl, alternates } from "@/lib/routes";
import type { Lang, Page } from "@/types/content";

export interface MetaText {
    siteName: string;
    template: string;
}

export interface MetaPage {
    title: string;
    description: string;
    path: string;
    absolute?: boolean;
}

export interface Crumb {
    name: string;
    path: string;
}

export type JsonLd = Record<string, unknown>;

// Longest meta description; a longer lead is cut at a word
export const DESCRIPTION_MAX = 160;

// Browser chrome color per color scheme, synced at run time by the theme control
export const VIEWPORT: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
        { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
    ],
    interactiveWidget: "resizes-content",
    colorScheme: "light dark",
};

/**
 * Writes a locale the way Open Graph wants it.
 *
 * @param lang - Language whose region tag (LOCALE_TAGS) is written
 * @returns "en_US" or "fr_FR"
 */
function ogLocale(lang: Lang): string {
    return LOCALE_TAGS[lang].replace("-", "_");
}

/**
 * Cuts a description at a word so that it fits the meta description length, ending with an
 * ellipsis when something was cut.
 *
 * @param text - Plain text; whitespace runs are collapsed first
 * @param max - Longest result, ellipsis included
 * @returns The text, unchanged when it already fits
 */
export function truncate(text: string, max = DESCRIPTION_MAX): string {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max - 1);
    const space = cut.lastIndexOf(" ");
    const head = (space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, "");
    return `${head}${String.fromCodePoint(0x2026)}`;
}

/**
 * Picks the meta description of a documentation page: the plain lead of the page, else the
 * catalogue summary of its endpoint, else the per-kind sentence of the meta messages.
 *
 * @param page - Page whose lead is read
 * @param lang - Language whose value of the lead is read
 * @param fallback - Per-kind sentence (meta.kinds.<kind>), already formatted
 * @param summary - Catalogue summary of the endpoint, when the page belongs to one
 * @returns The description, at most DESCRIPTION_MAX characters
 */
export function metaDescription(
    page: Page,
    lang: Lang,
    fallback: string,
    summary?: string,
): string {
    const lead = page.lead ? plain(pick(page.lead, lang)).trim() : "";
    return truncate(lead || summary || fallback);
}

/**
 * Builds the metadata shared by every page of a root layout: base URL, title template, default
 * title and description, icons, manifest and the defaults of the social cards.
 *
 * @param lang - Language of the root layout
 * @param text - Site name and title template ("%s - moxon") from the meta messages
 * @param home - Title and description of the home of that language, the defaults
 * @returns Metadata for the generateMetadata of the root layout
 */
export function rootMetadata(
    lang: Lang,
    text: MetaText,
    home: { title: string; description: string },
): Metadata {
    return {
        metadataBase: new URL(SITE.url),
        title: { default: home.title, template: text.template },
        description: home.description,
        applicationName: text.siteName,
        icons: {
            icon: [
                { url: "/favicon.svg", type: "image/svg+xml" },
                { url: "/favicon.ico", sizes: "48x48" },
            ],
            apple: "/apple-touch-icon.png",
        },
        manifest: "/site.webmanifest",
        openGraph: {
            siteName: text.siteName,
            locale: ogLocale(lang),
            type: "website",
        },
        twitter: { card: "summary", site: SITE.twitter },
    };
}

/**
 * Builds the metadata of one page: title, description, canonical URL, hreflang alternates with
 * x-default (English), Open Graph and Twitter cards. Next replaces the openGraph and twitter
 * objects of the layout instead of merging them, so they are complete here.
 *
 * @param lang - Language of the page, for og:locale (the other language is the alternate locale)
 * @param page - Title (the template adds the site name unless absolute), description and path of
 * the page in its language
 * @param text - Site name and title template from the meta messages
 * @returns Metadata for generateMetadata
 */
export function buildMetadata(lang: Lang, page: MetaPage, text: MetaText): Metadata {
    const links = alternates(page.path);
    const full = page.absolute ? page.title : text.template.replace("%s", page.title);
    const other: Lang = lang === "en" ? "fr" : "en";
    return {
        title: page.absolute ? { absolute: page.title } : page.title,
        description: page.description,
        alternates: {
            canonical: page.path,
            languages: { en: links.en, fr: links.fr, "x-default": links.en },
        },
        openGraph: {
            title: full,
            description: page.description,
            url: page.path,
            siteName: text.siteName,
            locale: ogLocale(lang),
            alternateLocale: [ogLocale(other)],
            type: "website",
        },
        twitter: {
            card: "summary",
            site: SITE.twitter,
            title: full,
            description: page.description,
        },
    };
}

/**
 * Builds the WebSite structured data of a home page.
 *
 * @param lang - Language of the home, which gives its URL and inLanguage
 * @param name - Site name as shown in search results
 * @param description - Meta description of the home, the site described in that language
 * @returns The JSON-LD object, to serialize with jsonLdText
 */
export function websiteJsonLd(lang: Lang, name: string, description: string): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name,
        url: absoluteUrl(localePath(lang)),
        description,
        inLanguage: LOCALE_TAGS[lang],
        author: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
    };
}

/**
 * Builds the BreadcrumbList structured data of an endpoint page.
 *
 * @param crumbs - Names and site paths from the home down to the page itself
 * @returns The JSON-LD object, positions from 1
 */
export function breadcrumbJsonLd(crumbs: readonly Crumb[]): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: absoluteUrl(crumb.path),
        })),
    };
}

/**
 * Serializes structured data for a script element: every "<" is escaped, so the text of a
 * page can never close the element.
 *
 * @param data - JSON-LD object from websiteJsonLd or breadcrumbJsonLd
 * @returns The JSON text to put inside script type="application/ld+json"
 */
export function jsonLdText(data: JsonLd): string {
    return JSON.stringify(data).replace(/</g, `${"\\"}u003c`);
}
