import { SITE } from "@/data/site";
import { localePath } from "@/i18n/routing";
import { refTarget } from "@/lib/inline";
import type { Lang, Version } from "@/types/content";
import type { Nav } from "@/types/nav";

export interface PathInfo {
    lang: Lang;
    version?: Version;
    slug?: string;
}

export interface RefContext {
    lang: Lang;
    version: Version;
}

export interface LinkAttrs {
    href: string;
    rel?: string;
    target?: "_blank";
}

// Page id of a version home
export const INDEX = "index";

// First path segment of the French tree; English lives at the root
const FR = "fr";

// Every documentation version, keyed by the Version type so that a new member fails to compile here
const KNOWN: Record<Version, true> = { v1: true, v2: true, v3: true, v4: true, v5: true, v6: true };

// Host of the site: web links to it stay in the tab, links to any other host open a new one
const SITE_HOST = new URL(SITE.url).hostname;

/**
 * Tells whether a path segment names a documentation version.
 *
 * @param value - Candidate segment, compared whole ("v6" yes, "v66" and "v6.1" no)
 * @returns True for a documented version id, false for any other segment
 */
export function isVersion(value: string): value is Version {
    return Object.hasOwn(KNOWN, value);
}

/**
 * Tells whether a version of the navigation index has a page, reading own keys only, so that a
 * path segment such as "constructor" or "toString" never matches an Object member.
 *
 * @param nav - Navigation index; an unpromoted version is an empty record
 * @param version - Version whose pages are searched
 * @param slug - Page id, possibly read from an untrusted URL
 * @returns True when the version has that page
 */
export function hasPage(nav: Nav, version: Version, slug: string): boolean {
    return Object.hasOwn(nav[version], slug);
}

/**
 * Splits a pathname into its segments, dropping the query, the fragment and empty segments, so
 * every caller is trailing-slash agnostic (dotted release pages lose their slash in dev).
 *
 * @param path - Pathname, possibly with a query or a fragment
 * @returns The non-empty segments in order
 */
export function segments(path: string): string[] {
    const cut = path.search(/[?#]/);
    return (cut === -1 ? path : path.slice(0, cut)).split("/").filter(Boolean);
}

/**
 * Reads the language, the version and the page id of a path of the new URL scheme.
 *
 * @param pathname - Path such as "/fr/v6/hash/" or "/v6/changelog/6.1.0", slash optional
 * @returns The language (French only under /fr), plus the version and the page id ("index" for
 * a version home) when the path is inside a version
 */
export function parsePath(pathname: string): PathInfo {
    const parts = segments(pathname);
    const lang: Lang = parts[0] === FR ? "fr" : "en";
    const rest = lang === "fr" ? parts.slice(1) : parts;
    if (rest.length === 0 || !isVersion(rest[0])) return { lang };
    return { lang, version: rest[0], slug: rest.slice(1).join("/") || INDEX };
}

/**
 * Builds the path of a documentation page, with the trailing slash of the static export.
 *
 * @param lang - Language of the page, French adds the /fr prefix
 * @param version - First segment after the language prefix, a documented version id
 * @param slug - Page id; "index" or an empty string give the version home
 * @param section - Fragment id without "#", appended when given
 * @returns The site-relative path, for example "/fr/v6/captcha/verify/#parameters"
 */
export function href(lang: Lang, version: Version, slug = INDEX, section?: string): string {
    const page = slug === INDEX || slug === "" ? "" : `${slug}/`;
    const prefix = lang === "fr" ? `/${FR}` : "";
    return `${prefix}/${version}/${page}${section ? `#${section}` : ""}`;
}

/**
 * Moves a path of the new URL scheme into a language, keeping the page, the query and the
 * fragment; the language switch and the hreflang alternates use it.
 *
 * @param lang - Language of the result: French adds the /fr prefix, English removes it
 * @param path - Path in either language, query and fragment kept verbatim
 * @returns The same page in the wanted language, with a trailing slash
 */
export function localizedPath(lang: Lang, path: string): string {
    const cut = path.search(/[?#]/);
    const suffix = cut === -1 ? "" : path.slice(cut);
    const parts = segments(path);
    const rest = parts[0] === FR ? parts.slice(1) : parts;
    const body = rest.length ? `${rest.join("/")}/` : "";
    return `${localePath(lang)}${body}${suffix}`;
}

/**
 * Lists the path of the same page in every language.
 *
 * @param pathname - Path of the current page in any language
 * @returns One path per language, for hreflang links and the language menu
 */
export function alternates(pathname: string): Record<Lang, string> {
    return { en: localizedPath("en", pathname), fr: localizedPath("fr", pathname) };
}

/**
 * Picks the page a version switch lands on: the same page when the target version has it, the
 * changelog index for a release page, else the version home.
 *
 * @param nav - Navigation index; an unpromoted version is an empty record
 * @param version - Version picked in the version menu, whose pages are searched
 * @param slug - Page id currently shown, in any version
 * @returns The page id to open in the target version
 */
export function versionTarget(nav: Nav, version: Version, slug: string): string {
    if (hasPage(nav, version, slug)) return slug;
    const parent = slug.includes("/") ? slug.slice(0, slug.lastIndexOf("/")) : "";
    const release = Object.values(nav).some(
        (other) => Object.hasOwn(other, slug) && other[slug].kind === "release",
    );
    if (parent && release && hasPage(nav, version, parent)) return parent;
    return INDEX;
}

/**
 * Resolves a link target of the inline grammar to an href: a ref: target becomes the path of the
 * page in the language and version of the context, anything else is returned unchanged.
 *
 * @param target - "ref:hash#x", "ref:v5/changelog", "ref:/", "#x", "https://..." or "mailto:..."
 * @param ctx - Language and version of the page that holds the link
 * @returns The href to render: a site path for a ref: target
 * @throws When a ref: target does not parse, so that a content bug fails the build
 */
export function resolveRef(target: string, ctx: RefContext): string {
    if (!target.startsWith("ref:")) return target;
    const ref = refTarget(target);
    if (!ref) throw new Error(`malformed ref target: ${target}`);
    if (ref.slug === "") return localePath(ctx.lang);
    return href(ctx.lang, ref.version ?? ctx.version, ref.slug, ref.section);
}

/**
 * Gives the anchor attributes of a resolved href: web links carry rel="noopener noreferrer", and
 * open a new tab unless they point at the site itself.
 *
 * @param url - Resolved href (site path, fragment, web URL or mailto)
 * @returns The href with the rel and target attributes it needs
 */
export function linkAttrs(url: string): LinkAttrs {
    if (!/^https?:\/\//.test(url)) return { href: url };
    if (new URL(url).hostname === SITE_HOST) return { href: url, rel: "noopener noreferrer" };
    return { href: url, rel: "noopener noreferrer", target: "_blank" };
}

/**
 * Turns a site path into an absolute URL on the production host.
 *
 * @param path - Site-relative path starting with "/"
 * @returns The absolute URL, the path appended to SITE.url unchanged
 */
export function absoluteUrl(path: string): string {
    return `${SITE.url}${path}`;
}
