import { LATEST, VERSIONS } from "@/data/versions";
import { LOCALE_KEY, localePath } from "@/i18n/routing";
import { hasPage, href, INDEX, isVersion, segments } from "@/lib/routes";
import type { Lang, Version } from "@/types/content";
import type { Nav } from "@/types/nav";

export interface LegacyPage {
    version: Version;
    lang: Lang;
    id: string;
}

export interface LegacyFile {
    file: string;
    target: string;
}

/**
 * Redirect files of the legacy homes that are not pages of a version: only /fr.html, since
 * /index.html is already the English home of the export itself.
 */
export const LEGACY_HOME_FILES: readonly LegacyFile[] = [{ file: "fr.html", target: "/fr/" }];

/**
 * Tells whether a path segment is a language segment (compared whole: "encode" is a page id,
 * not the language "en").
 *
 * @param segment - One path segment
 * @returns True for exactly "en" or "fr"
 */
function isLang(segment: string | undefined): segment is Lang {
    return segment === "en" || segment === "fr";
}

/**
 * Reads the language saved by the language menu, without throwing where storage is blocked.
 *
 * @returns The stored value, or null outside a browser or when storage is unavailable
 */
function savedLang(): string | null {
    try {
        return typeof localStorage === "undefined" ? null : localStorage.getItem(LOCALE_KEY);
    } catch {
        return null;
    }
}

/**
 * Lists the languages of the browser in order of preference.
 *
 * @returns navigator.languages, or navigator.language alone, or nothing outside a browser
 */
function browserLanguages(): readonly string[] {
    if (typeof navigator === "undefined") return [];
    return navigator.languages?.length ? navigator.languages : [navigator.language];
}

/**
 * Picks the language of a visitor: the saved choice, else the first browser language that the
 * site has, else English.
 *
 * @param saved - Value saved under the "lang" key; read from localStorage when omitted
 * @param languages - Browser language tags such as "fr-FR"; read from navigator when omitted
 * @returns "fr" or "en"
 */
export function getUserLang(
    saved: string | null = savedLang(),
    languages: readonly string[] = browserLanguages(),
): Lang {
    if (saved === "en" || saved === "fr") return saved;
    for (const tag of languages) {
        const code = tag.toLowerCase().split("-")[0];
        if (isLang(code)) return code;
    }
    return "en";
}

/**
 * Gives the path of a page when it exists, else the home of its version when that exists.
 *
 * @param nav - Navigation index, the list of existing pages
 * @param lang - Language of the target, French adds the /fr prefix
 * @param version - Version whose pages are searched, from the path or the latest one
 * @param slug - Wanted page id; "" or "index" ask for the version home
 * @returns The path, or null when the version has no pages (an unpromoted version)
 */
function pageOrHome(nav: Nav, lang: Lang, version: Version, slug: string): string | null {
    if (slug && slug !== INDEX && hasPage(nav, version, slug)) return href(lang, version, slug);
    return hasPage(nav, version, INDEX) ? href(lang, version) : null;
}

/**
 * Gives the changelog page of a release: the release page of its major when that version has a
 * changelog, the changelog index of that major when the release is unknown, else the changelog
 * of the latest version.
 *
 * @param nav - Navigation index, the pages that exist per version
 * @param lang - Language of the target, French adds the /fr prefix
 * @param release - Release number such as "6.0.0"
 * @returns The path, or null when no changelog page exists
 */
function releasePath(nav: Nav, lang: Lang, release: string): string | null {
    const major = `v${release.split(".")[0]}`;
    const def = VERSIONS.find((version) => version.id === major && version.changelog);
    if (def && hasPage(nav, def.id, `changelog/${release}`))
        return href(lang, def.id, `changelog/${release}`);
    if (def && hasPage(nav, def.id, "changelog")) return href(lang, def.id, "changelog");
    return hasPage(nav, LATEST, "changelog") ? href(lang, LATEST, "changelog") : null;
}

/**
 * Resolves the segments of a path, whose language prefix if any has been removed, to the path of
 * an existing page of the site.
 *
 * @param parts - Segments after the language prefix, without the .html suffix
 * @param nav - Navigation index, the pages that exist per version
 * @param lang - Explicit language of the path, else the detected language
 * @param explicit - Whether the path carried a language prefix
 * @returns The target path, or null for the 404 page
 */
function resolve(parts: string[], nav: Nav, lang: Lang, explicit: boolean): string | null {
    if (parts.length === 0) return explicit ? localePath(lang) : null;
    if (parts.length === 1 && parts[0] === INDEX) return explicit ? localePath(lang) : "/";
    const [first, ...rest] = parts;

    if (isVersion(first)) {
        if (isLang(rest[0])) return pageOrHome(nav, rest[0], first, rest.slice(1).join("/"));
        return pageOrHome(nav, lang, first, rest.join("/"));
    }
    if (first === "latest") return pageOrHome(nav, lang, LATEST, rest.join("/"));

    const release = /^\d+\.\d+\.\d+$/;
    if (first === "changelog" && rest.length === 1 && rest[0] === "latest") {
        const latest = VERSIONS.find((version) => version.id === LATEST)?.release;
        return latest ? releasePath(nav, lang, latest) : null;
    }
    if (parts.length === 1 && release.test(first)) return releasePath(nav, lang, first);
    if (first === "changelog" && rest.length === 1 && release.test(rest[0])) {
        return releasePath(nav, lang, rest[0]);
    }

    const slug = parts.join("/");
    return hasPage(nav, LATEST, slug) ? href(lang, LATEST, slug) : null;
}

/**
 * Computes where the 404 page sends a path that is not a page: legacy /vN/en and /vN/fr shapes,
 * /latest, release numbers, bare page ids, .html suffixes and language prefixes. The trailing
 * slash is ignored.
 *
 * @param path - location.pathname of the missing page
 * @param nav - Navigation index; a target always exists in it, so the 404 page never loops
 * @param detected - Language used when the path has no language segment; read from the browser
 * when omitted
 * @returns The path to replace the location with (the caller appends search and hash), or null
 * to render the 404 page
 */
export function getSmartRedirect(
    path: string,
    nav: Nav,
    detected: Lang = getUserLang(),
): string | null {
    const parts = segments(path);
    const last = parts[parts.length - 1];
    if (last?.endsWith(".html")) {
        const bare = last.slice(0, -".html".length);
        parts.splice(parts.length - 1, 1, ...(bare ? [bare] : []));
    }
    const target = isLang(parts[0])
        ? resolve(parts.slice(1), nav, parts[0], true)
        : resolve(parts, nav, detected, false);

    // A target equal to the missing path would loop; targets end with "/", so one hop at most
    const pathname = path.split(/[?#]/)[0];
    return target === null || target === pathname ? null : target;
}

/**
 * Maps a page of the legacy site to its new path.
 *
 * @param page - Version, language and page id of the legacy URL /vN/<lang>/<id>
 * @returns The new path, "/vN/<id>/" in English and "/fr/vN/<id>/" in French
 */
export function legacyUrl(page: LegacyPage): string {
    return href(page.lang, page.version, page.id);
}

/**
 * Lists the files that answer the legacy URLs of a page in the export: the folder form and the
 * .html twin that GitHub Pages serves for the slashless URL.
 *
 * @param page - Version, language and page id of the legacy page
 * @returns The two paths relative to out/, folder form first
 */
export function legacyFiles(page: LegacyPage): [string, string] {
    const base =
        page.id === INDEX
            ? `${page.version}/${page.lang}`
            : `${page.version}/${page.lang}/${page.id}`;
    return [`${base}/index.html`, `${base}.html`];
}
