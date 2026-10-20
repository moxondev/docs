import { LATEST, type VersionDef, type VersionStatus } from "@/data/versions";
import { localePath } from "@/i18n/routing";
import { CATALOGUE_ANCHOR } from "@/lib/nav";
import { hasPage, href, INDEX } from "@/lib/routes";
import type { Lang, Version } from "@/types/content";
import type { Nav } from "@/types/nav";

export type MenuRow = "documentation" | "playground" | "changelog" | "pricing";

export type BannerKind = "previous" | "legacy" | "retired";

// Banner message group of each version status; the latest version has no banner
const BANNER_KINDS: Record<VersionStatus, BannerKind | null> = {
    latest: null,
    previous: "previous",
    legacy: "legacy",
    retired: "retired",
};

/**
 * Gives the address of a tools page (Playground, Changelog, Pricing): in the version being read
 * when it has that page, else in the latest version, since an old version may lack the page.
 *
 * @param nav - Navigation index, the list of existing pages
 * @param lang - Picks the path prefix of the link (none for English, /fr for French)
 * @param version - Version being read, undefined outside the documentation
 * @param slug - Page id of the tools page
 * @returns The site path of the page
 */
export function toolTarget(
    nav: Nav,
    lang: Lang,
    version: Version | undefined,
    slug: string,
): string {
    const target = version && hasPage(nav, version, slug) ? version : LATEST;
    return href(lang, target, slug);
}

/**
 * Gives the address of the documentation row of the phone menu: the home of the version being
 * read, the home of the latest version outside the documentation.
 *
 * @param lang - Picks the path prefix of the link (none for English, /fr for French)
 * @param version - Version being read, undefined outside the documentation
 * @returns The site path of the version home
 */
export function docsTarget(lang: Lang, version: Version | undefined): string {
    return href(lang, version ?? LATEST, INDEX);
}

/**
 * Gives the address of the catalogue row of the phone menu: the catalogue of the home page.
 *
 * @param lang - Picks the home path that carries the catalogue fragment ("/" for English, "/fr/"
 *   for French)
 * @returns The home path of that language with the catalogue fragment
 */
export function catalogueTarget(lang: Lang): string {
    return `${localePath(lang)}#${CATALOGUE_ANCHOR}`;
}

/**
 * Tells which link row of the phone menu is the page being read, the one marked as current.
 *
 * @param version - Version being read, undefined outside the documentation
 * @param slug - Page id being read; "playground", "pricing" and "changelog" (with its release
 *   pages) have their own row, any other id belongs to the documentation row
 * @returns The current row, or null when no row matches
 */
export function currentRow(version: Version | undefined, slug: string | undefined): MenuRow | null {
    if (!version) return null;
    if (slug === "playground" || slug === "pricing") return slug;
    if (slug === "changelog" || slug?.startsWith("changelog/")) return "changelog";
    return "documentation";
}

/**
 * Picks the kind of banner a version carries.
 *
 * @param def - Version of the catalog, whose status is read
 * @returns The message group of the banner, null for the latest version
 */
export function bannerKind(def: VersionDef): BannerKind | null {
    return BANNER_KINDS[def.status];
}

/**
 * Tells whether the page being read shows the site footer: every page but the endpoint pages,
 * which end with their own edit and report links. The home and the other pages outside the
 * documentation always show it.
 *
 * @param nav - Navigation index, the list of existing pages
 * @param version - Version being read, undefined outside the documentation
 * @param slug - Page id being read
 * @returns False for an endpoint page of the index, true otherwise
 */
export function showsFooter(
    nav: Nav,
    version: Version | undefined,
    slug: string | undefined,
): boolean {
    if (!version || slug === undefined || !hasPage(nav, version, slug)) return true;
    return nav[version][slug].kind !== "endpoint";
}
