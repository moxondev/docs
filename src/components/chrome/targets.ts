import { THEME_CHOICES, type ThemeChoice } from "@/data/theme";
import { LATEST, type VersionDef, VERSIONS, type VersionStatus } from "@/data/versions";
import { type AppLocale, localePath } from "@/i18n/routing";
import { CATALOGUE_ANCHOR } from "@/lib/anchors";
import { releaseNumber, releasePages } from "@/lib/releases";
import { hasPage, href, INDEX, type PageIndex, parsePath, versionTarget } from "@/lib/routes";
import type { Lang, PageKind, Version } from "@/types/content";

export type MenuRow = "documentation" | "playground" | "changelog" | "pricing";

export interface VersionEntry {
    id: Version;
    label: string;
    href: string;
    latest: boolean;
    current: boolean;
    status: VersionStatus;
    served: boolean;
}

export interface VersionGroups {
    active: VersionEntry[];
    archived: VersionEntry[];
}

export interface ReleaseLink {
    label: string;
    href: string;
}

export interface LanguageRow {
    locale: AppLocale;
    href: string;
    current: boolean;
}

export interface ThemeRow {
    name: ThemeChoice;
    current: boolean;
}

export type HeaderMenu = "versions" | "language" | "theme";

export type FooterMode = "address" | "notfound";

export interface FooterPlan {
    show: boolean;
    issue: boolean;
    column: string;
}

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
    nav: PageIndex,
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
    nav: PageIndex,
    version: Version | undefined,
    slug: string | undefined,
): boolean {
    if (!version || slug === undefined || !hasPage(nav, version, slug)) return true;
    return nav[version][slug].kind !== "endpoint";
}

/**
 * Gives the column of a page: the width and the side padding that the main landmark of the page
 * and the footer under it share, so that the first word of the footer stands under the first
 * word of the page and the two can never diverge.
 *
 * @param kind - Kind of the page, "home" for the home page
 * @returns The Tailwind classes of the column
 */
export function columnClass(kind: PageKind | "home"): string {
    if (kind === "home") return "max-w-296 px-5 home:px-8";
    if (kind === "playground") return "max-w-300 px-5 desk:px-12";
    return "max-w-219 px-5 desk:px-12";
}

/**
 * Picks the column of the footer for the page being read: the column of that page's kind, the
 * home column outside the documentation, the text column for an address the index does not know.
 *
 * @param nav - Navigation index, the list of existing pages
 * @param version - Version being read, undefined outside the documentation
 * @param slug - Page id being read
 * @returns The Tailwind classes of the column of the page
 */
export function footerColumn(
    nav: PageIndex,
    version: Version | undefined,
    slug: string | undefined,
): string {
    if (!version || slug === undefined) return columnClass("home");
    return columnClass(hasPage(nav, version, slug) ? nav[version][slug].kind : "article");
}

/**
 * Tells whether the footer carries its own report-an-issue link: only where the page has no foot
 * links of its own. Every page of the index already ends with the edit and report links of the
 * documentation, so repeating the report link right under them would be a duplicate.
 *
 * @param nav - Navigation index, the list of existing pages
 * @param version - Version being read, undefined outside the documentation
 * @param slug - Page id being read
 * @returns False for a page of the index, true otherwise
 */
export function footerIssue(
    nav: PageIndex,
    version: Version | undefined,
    slug: string | undefined,
): boolean {
    return !version || slug === undefined || !hasPage(nav, version, slug);
}

/**
 * Decides the footer of a page: whether it shows, whether it carries the report-an-issue link and
 * the column it stands in. The 404 cannot be read from its address, so it asks for the "notfound"
 * mode, which always shows the footer with its report link in the text column of the 404 page.
 *
 * @param nav - Navigation index, the list of existing pages
 * @param version - Version being read, undefined outside the documentation
 * @param slug - Page id being read
 * @param mode - "address" to decide from the page being read, "notfound" for the 404
 * @returns Whether the footer shows, its report link and the Tailwind classes of its column
 */
export function footerPlan(
    nav: PageIndex,
    version: Version | undefined,
    slug: string | undefined,
    mode: FooterMode = "address",
): FooterPlan {
    if (mode === "notfound") return { show: true, issue: true, column: columnClass("article") };
    return {
        show: showsFooter(nav, version, slug),
        issue: footerIssue(nav, version, slug),
        column: footerColumn(nav, version, slug),
    };
}

/**
 * Gives the label of a version in the banner: the full release on the latest major, read from
 * package.json, and the major alone on the others (the picker rows use the major only).
 *
 * @param def - Version of the catalog, whose status and last release are read
 * @returns The release with a v prefix for the latest version, the major for the others
 */
export function versionLabel(def: VersionDef): string {
    return def.status === "latest" && def.release ? `v${def.release}` : def.id;
}

/**
 * Lists the rows of the version menu for a path: one per published version, newest first, labelled
 * with the major only and linking to the page the switch lands on (see versionTarget). Outside the
 * documentation every row links to its version home and the latest version is the current one.
 *
 * @param nav - Navigation index; a version without any page is not published yet and is left out
 * @param pathname - Path of the current page, in either language
 * @returns The rows, in the order of the version catalog
 */
export function versionEntries(nav: PageIndex, pathname: string): VersionEntry[] {
    const { lang, version = LATEST, slug } = parsePath(pathname);
    return VERSIONS.filter((def) => Object.keys(nav[def.id]).length > 0).map((def) => ({
        id: def.id,
        label: def.id,
        href: href(lang, def.id, slug === undefined ? undefined : versionTarget(nav, def.id, slug)),
        latest: def.status === "latest",
        current: def.id === version,
        status: def.status,
        served: def.served,
    }));
}

/**
 * Splits the rows of the version menu in its two groups: the versions the API still serves
 * ("API active") and the archives, whose documentation is kept for reference.
 *
 * @param entries - Rows of the version menu, newest first
 * @returns The two groups, each keeping the order of the rows
 */
export function versionGroups(entries: VersionEntry[]): VersionGroups {
    return {
        active: entries.filter((entry) => entry.served),
        archived: entries.filter((entry) => !entry.served),
    };
}

/**
 * Lists the releases of a version for the submenu of the version picker, newest first, each
 * linking to its changelog page in the language of the reader. Read from the page index, so a
 * version without release pages gives none and its row has no submenu.
 *
 * @param nav - Page index listing the pages that exist per version
 * @param lang - Picks the path prefix of the links (none for English, /fr for French)
 * @param version - Version whose releases are listed
 * @returns The release numbers and their site paths, for example "5.9.0" then "5.8.0"
 */
export function releaseLinks(nav: PageIndex, lang: Lang, version: Version): ReleaseLink[] {
    return releasePages(nav, version).map((slug) => ({
        label: releaseNumber(slug),
        href: href(lang, version, slug),
    }));
}

/**
 * Gives the major number of a version id, for the heading of its release list.
 *
 * @param version - Version id such as "v5"
 * @returns The number, "5" for that example
 */
export function majorOf(version: Version): string {
    return version.slice(1);
}

/**
 * Lists the rows of the language menu: one per locale, in the order of the routing, the one of the
 * document marked as current. The label of a row is the name of the language in that language, a
 * message the caller reads with the locale of the row.
 *
 * @param locales - Locales of the site, routing.locales
 * @param current - Language of the document
 * @param links - Path of the same page in each language, from useLocaleSwitch()
 * @returns The rows, each with the path of the same page in its language
 */
export function languageRows(
    locales: readonly AppLocale[],
    current: AppLocale,
    links: Record<AppLocale, string>,
): LanguageRow[] {
    return locales.map((locale) => ({ locale, href: links[locale], current: locale === current }));
}

/**
 * Narrows a theme name read from next-themes to one the site offers. next-themes types it as a
 * string, and a value that someone put in the storage by hand is none of the three.
 *
 * @param theme - Theme preference of next-themes, undefined before it is known
 * @returns The preference when it is light, dark or system, else "system", which is the default
 */
export function themeChoice(theme: string | undefined): ThemeChoice {
    return THEME_CHOICES.find((name) => name === theme) ?? "system";
}

/**
 * Lists the rows of the theme choice, in the order of THEME_CHOICES, the preference in force marked
 * as current. It is shared by the desktop menu and the phone sheet. The label of a row is the
 * message common.themes.<name>, read by the caller.
 *
 * @param current - Preference in force (not the theme it resolves to), undefined when it is not
 *   known yet, in which case no row is current
 * @returns One row per choice
 */
export function themeRows(current: ThemeChoice | undefined): ThemeRow[] {
    return THEME_CHOICES.map((name) => ({ name, current: name === current }));
}

/**
 * Gives the preference that Alt+T switches to: the next one of THEME_CHOICES, wrapping around. A
 * value that is not known counts as the system one, as the site does by default.
 *
 * @param theme - Theme preference of next-themes, undefined before it is known
 * @returns The next choice of the cycle
 */
export function nextTheme(theme: string | undefined): ThemeChoice {
    const at = THEME_CHOICES.indexOf(themeChoice(theme));
    return THEME_CHOICES[(at + 1) % THEME_CHOICES.length];
}

/**
 * Tells which of the menus of the desktop header is open once one of them asks to open or close.
 * At most one is open: opening a menu closes the one that was open, and a menu that closes while
 * another one took its place (the late close that a click outside sends) leaves that one alone.
 *
 * @param current - Menu that is open, null when none is
 * @param name - Menu that asks
 * @param open - True when it asks to open, false when it asks to close
 * @returns The menu that is open afterwards
 */
export function menuAfter(
    current: HeaderMenu | null,
    name: HeaderMenu,
    open: boolean,
): HeaderMenu | null {
    if (open) return name;
    return current === name ? null : current;
}
