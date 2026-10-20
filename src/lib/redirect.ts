import { LATEST, type VersionDef, VERSIONS } from "@/data/versions";
import { LOCALE_KEY, localePath, routing } from "@/i18n/routing";
import { hasPage, href, INDEX, isVersion, type PageIndex, segments } from "@/lib/routes";
import type { Lang, Version } from "@/types/content";

export interface LegacyPage {
    version: Version;
    lang: Lang;
    id: string;
}

export interface LegacyFile {
    file: string;
    target: string;
}

export type AliasTargets = Partial<Record<Lang, string>>;

/**
 * Redirect files of the legacy homes that are not pages of a version: only /fr.html, since
 * /index.html is already the English home of the export itself.
 */
export const LEGACY_HOME_FILES: readonly LegacyFile[] = [{ file: "fr.html", target: "/fr/" }];

// Page id of a release page of a changelog, capturing the release number
const RELEASE_PAGE = /^changelog\/(\d+\.\d+\.\d+)$/;

// Locales whose pages live under a prefix, which is the first segment of their alias addresses
const PREFIXED: readonly Lang[] = routing.locales.filter(
    (locale) => locale !== routing.defaultLocale,
);

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
function pageOrHome(nav: PageIndex, lang: Lang, version: Version, slug: string): string | null {
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
function releasePath(nav: PageIndex, lang: Lang, release: string): string | null {
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
function resolve(parts: string[], nav: PageIndex, lang: Lang, explicit: boolean): string | null {
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
 * Computes where the 404 page sends a path that is not a page, ignoring the trailing slash. The
 * postbuild step runs it for each alias address and prebuilds a redirect page, so only the long
 * tail of other paths reaches the 404 page and the two can never disagree.
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
    nav: PageIndex,
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

/**
 * Enumerates the alias addresses that get a prebuilt redirect page instead of the 404 script: the
 * short forms of the latest version, the release numbers and "changelog/latest", each also under
 * every non-default language prefix. The list is read from the navigation index, never typed.
 *
 * @param nav - Navigation index of the published pages; an unpublished version is an empty record
 * @param versions - Documented versions, newest first; those with a changelog flag hold releases
 * @param latest - The version that the short forms point at
 * @returns The distinct addresses without leading or trailing slash, in ascending order
 */
export function aliasAddresses(
    nav: PageIndex,
    versions: readonly VersionDef[] = VERSIONS,
    latest: Version = LATEST,
): string[] {
    const plain = new Set<string>(["latest", "changelog/latest"]);
    for (const id of Object.keys(nav[latest] ?? {})) {
        if (id === INDEX) continue;
        plain.add(`latest/${id}`);
        plain.add(id);
    }
    for (const def of versions) {
        if (!def.changelog) continue;
        for (const id of Object.keys(nav[def.id] ?? {})) {
            const release = RELEASE_PAGE.exec(id)?.[1];
            if (!release) continue;
            plain.add(release);
            plain.add(id);
        }
    }
    const all = [...plain, ...PREFIXED.flatMap((lang) => [...plain].map((a) => `${lang}/${a}`))];
    return all.sort();
}

/**
 * Reads the language that an alias address states by its prefix.
 *
 * @param address - Alias address such as "fr/hash" or "latest/hash"
 * @returns The language of the prefix ("fr"), or null for an address without one, whose language
 * is only known in the browser
 */
export function aliasLang(address: string): Lang | null {
    const first = address.split("/")[0];
    return PREFIXED.find((lang) => lang === first) ?? null;
}

/**
 * Lists the files that answer an alias address in the export: the folder form and the .html twin
 * that GitHub Pages serves for the slashless address, as legacyFiles does for the legacy ones.
 *
 * @param address - Alias address without leading or trailing slash, such as "latest/hash"
 * @returns The two paths relative to out/, folder form first
 */
export function aliasFiles(address: string): [string, string] {
    return [`${address}/index.html`, `${address}.html`];
}

/**
 * Writes the inline script of an alias redirect page: it replaces the location with the target of
 * the visitor's language and keeps the query and the fragment. With several targets the language
 * is picked exactly as getUserLang does.
 *
 * @param targets - Site path to go to per language; at least one, and the default language
 * among them when there are several
 * @returns The script text, free of anything that could close a script element
 * @throws When there are no target, or several without one for the default language
 */
export function aliasScript(targets: AliasTargets): string {
    const langs = Object.keys(targets) as Lang[];
    const fallback = routing.defaultLocale;
    if (langs.length === 0) throw new Error("an alias page needs a target");
    const keep = "+location.search+location.hash)";
    if (langs.length === 1) {
        const only = JSON.stringify(targets[langs[0]]).replace(/</g, "\\u003c");
        return `location.replace(${only}${keep}`;
    }
    if (!targets[fallback]) throw new Error(`an alias page needs a target in ${fallback}`);
    const map = JSON.stringify(targets).replace(/</g, "\\u003c");

    // Every storage access is guarded because a blocked storage throws
    return (
        `var t=${map},h={}.hasOwnProperty,l=${JSON.stringify(fallback)},s,a,i,c;` +
        `try{s=localStorage.getItem(${JSON.stringify(LOCALE_KEY)})}catch(e){}` +
        "if(h.call(t,s))l=s;" +
        "else try{a=navigator.languages;if(!a||!a.length)a=[navigator.language];" +
        'for(i=0;i<a.length;i++){c=String(a[i]).toLowerCase().split("-")[0];' +
        "if(h.call(t,c)){l=c;break}}}catch(e){}" +
        `location.replace(t[l]${keep}`
    );
}
