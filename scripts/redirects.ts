import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { argv, cwd, exit } from "node:process";
import { pathToFileURL } from "node:url";

import { createTranslator } from "next-intl";

import { NAV } from "@/data/nav";
import { PAGES } from "@/data/pages/registry";
import { LATEST, VERSIONS } from "@/data/versions";
import { routing } from "@/i18n/routing";
import { aliasMap } from "@/lib/anchors";
import {
    aliasAddresses,
    aliasFiles,
    aliasLang,
    aliasScript,
    type AliasTargets,
    getSmartRedirect,
    LEGACY_HOME_FILES,
    legacyFiles,
    type LegacyPage,
    legacyUrl,
} from "@/lib/redirect";
import { absoluteUrl, hasPage, INDEX, isVersion, type PageIndex, parsePath } from "@/lib/routes";
import type { Lang, Page } from "@/types/content";
import type { Nav } from "@/types/nav";

import { readNamespace } from "./public";

export interface OldPage extends LegacyPage {
    url: string;
    html: string;
    file: string;
}

export interface OldUrls {
    counts: { pages: number; homes: number; html: number };
    notFound: string;
    homes: { lang: Lang; url: string; html: string; file: string }[];
    pages: OldPage[];
}

export interface RedirectText {
    title: string;
    link: string;
}

export interface RedirectFile {
    file: string;
    html: string;
}

export interface RedirectPlan {
    files: RedirectFile[];
    pages: number;
    skipped: number;
    problems: string[];
}

export interface AliasPlan {
    files: RedirectFile[];
    addresses: number;
    skipped: string[];
    shadowed: string[];
    problems: string[];
}

export type TextOf = (lang: Lang, page: LegacyPage | null) => RedirectText;

export type Resolve = (path: string, nav: PageIndex, detected: Lang) => string | null;

/**
 * Inventory of the URLs of the former site, captured from its real build before the migration: the
 * input of the redirect files, never derived from the new registry.
 */
export const OLD_URLS_FILE = "src/lib/oldUrls.json";

// Output folder of next build (static export)
export const OUT_DIR = "out";

// Size that a redirect file should stay under, the alias pages included
export const REDIRECT_MAX = 1024;

/**
 * Names at the root of the export that Next or the host owns besides the version folders, the
 * language folders and the content of public/: an alias address may never take one of them.
 */
export const EXPORT_ROOTS: readonly string[] = [
    "404",
    "404.html",
    "index",
    "index.html",
    "index.txt",
    "robots",
    "robots.txt",
    "sitemap",
    "sitemap.xml",
];

/**
 * Escapes text for an HTML attribute or element.
 *
 * @param text - Plain text
 * @returns The text with "&", "<", ">" and the double quote as entities
 */
export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/**
 * Writes the document shared by every redirect page: charset, viewport and color scheme, the
 * title, the canonical URL of the target, the inline script, the zero-second refresh for browsers
 * without script, and a noscript link.
 *
 * @param lang - Language of the page, for the html element
 * @param text - Title and link text in that language
 * @param target - Site path that the canonical URL, the refresh and the link point at
 * @param script - Body of the inline script
 * @param guarded - Whether the refresh sits in a noscript element of the head, so that it never
 *   runs next to the script (an alias page whose script picks another target than the refresh)
 * @returns The complete page, from the doctype to the closing html tag
 */
function redirectDocument(
    lang: Lang,
    text: RedirectText,
    target: string,
    script: string,
    guarded = false,
): string {
    const refresh = `<meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">`;
    return [
        "<!doctype html>",
        `<html lang="${lang}">`,
        '<head><meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<meta name="color-scheme" content="light dark">',
        `<title>${escapeHtml(text.title)}</title>`,
        `<link rel="canonical" href="${escapeHtml(absoluteUrl(target))}">`,
        `<script>${script}</script>`,
        guarded ? `<noscript>${refresh}</noscript>` : refresh,
        "</head>",
        `<body><noscript><a href="${escapeHtml(target)}">${escapeHtml(text.link)}</a></noscript></body>`,
        "</html>",
        "",
    ].join("\n");
}

/**
 * Writes one redirect page of a legacy URL: the shared redirect document, whose inline script
 * replaces the location with the new path, keeps the query and remaps the fragment from the
 * legacy ids.
 *
 * @param target - New site path, ending with "/"
 * @param lang - Language of the page, for the html element
 * @param remap - Legacy fragment id to current id, from the section aliases
 * @param text - Title and link text in that language
 * @returns The complete page, from the doctype to the closing html tag
 */
export function redirectHtml(
    target: string,
    lang: Lang,
    remap: Readonly<Record<string, string>>,
    text: RedirectText,
): string {
    const map = JSON.stringify(remap).replace(/</g, "\\u003c");
    const script =
        `var m=${map},h=location.hash.slice(1);` +
        `location.replace(${JSON.stringify(target)}+location.search+` +
        `(h?"#"+({}.hasOwnProperty.call(m,h)?m[h]:h):""))`;
    return redirectDocument(lang, text, target, script);
}

/**
 * Writes one redirect page of an alias address: the shared redirect document, whose script keeps
 * the query and the fragment as they are and picks the language of the visitor when the page holds
 * a target per language. The refresh sits in a noscript element, so it never overrides the script.
 *
 * @param targets - Site path per language: both for an address without a prefix, the one of the
 *   prefix for an address with one
 * @param lang - Language of the page and of its text, the one whose target the canonical URL, the
 *   refresh and the noscript link use
 * @param text - Title and link text in that language
 * @returns The complete page, from the doctype to the closing html tag
 */
export function aliasHtml(targets: AliasTargets, lang: Lang, text: RedirectText): string {
    const target = targets[lang];
    if (!target) throw new Error(`an alias page has no target in ${lang}`);
    return redirectDocument(lang, text, target, aliasScript(targets), true);
}

/**
 * Plans every redirect file of the export: two per legacy page of a published version (the folder
 * form and its .html twin), plus fr.html. A legacy page that has no page is a hard error, unless
 * its version is not published yet.
 *
 * @param urls - Legacy URL inventory
 * @param nav - Navigation index, the published pages
 * @param pages - Loaded page modules by "vN/<id>", for the fragment aliases
 * @param textOf - Title and link text of a redirect page, null for the home
 * @returns The files, the number of legacy pages served, the skipped ones and the problems
 */
export function redirectPlan(
    urls: OldUrls,
    nav: Nav,
    pages: ReadonlyMap<string, Page>,
    textOf: TextOf,
): RedirectPlan {
    const files: RedirectFile[] = [];
    const problems: string[] = [];
    let served = 0;
    let skipped = 0;
    for (const old of urls.pages) {
        if (Object.keys(nav[old.version]).length === 0) {
            skipped += 1;
            continue;
        }
        const page = pages.get(`${old.version}/${old.id}`);
        if (!hasPage(nav, old.version, old.id) || !page) {
            problems.push(`${old.url}: no page ${old.version}/${old.id} in the published data`);
            continue;
        }
        const html = redirectHtml(
            legacyUrl(old),
            old.lang,
            aliasMap(page, old.lang),
            textOf(old.lang, old),
        );
        for (const file of legacyFiles(old)) files.push({ file, html });
        served += 1;
    }
    for (const home of LEGACY_HOME_FILES) {
        files.push({
            file: home.file,
            html: redirectHtml(home.target, "fr", {}, textOf("fr", null)),
        });
    }
    return { files, pages: served, skipped, problems };
}

/**
 * Lists the first segments that a real route of the export owns, which no alias address may take:
 * the version folders, the language folders, the names that Next and the host own (EXPORT_ROOTS)
 * and everything at the root of public/.
 *
 * @param publicNames - Names of the entries at the root of the public folder
 * @returns The reserved names; isReserved also reserves any name that starts with an underscore
 */
export function reservedRoots(publicNames: readonly string[]): Set<string> {
    return new Set<string>([
        ...VERSIONS.map((def) => def.id),
        ...routing.locales.filter((locale) => locale !== routing.defaultLocale),
        ...EXPORT_ROOTS,
        ...publicNames,
    ]);
}

/**
 * Tells whether a first path segment belongs to a real route of the export.
 *
 * @param segment - First segment of an alias address, after its language prefix if any
 * @param reserved - The names of reservedRoots
 * @returns True for a version, a reserved name or a name that starts with an underscore
 */
export function isReserved(segment: string, reserved: ReadonlySet<string>): boolean {
    return isVersion(segment) || reserved.has(segment) || segment.startsWith("_");
}

/**
 * Reads the version and the page id of a target path as a legacy page, for the texts.
 *
 * @param target - Site path such as "/fr/v6/hash/"
 * @returns The language, version and page id, or null when the path is not inside a version
 */
function pageOf(target: string): LegacyPage | null {
    const info = parsePath(target);
    return info.version ? { version: info.version, lang: info.lang, id: info.slug ?? INDEX } : null;
}

/**
 * Tells whether two target paths are the same page, whatever their language.
 *
 * @param a - Site path such as "/v6/hash/"
 * @param b - Site path such as "/fr/v6/hash/"
 * @returns True when the version and the page id are equal
 */
function samePage(a: string, b: string): boolean {
    const [one, other] = [parsePath(a), parsePath(b)];
    return one.version === other.version && one.slug === other.slug;
}

/**
 * Plans the prebuilt redirect pages of the alias addresses, each with the targets that
 * getSmartRedirect answers in English and in French, so that a prebuilt page can never disagree
 * with the 404 script. An address that shadows a real route is dropped: the real route wins.
 *
 * @param nav - Navigation index, the published pages
 * @param textOf - Title and link text of a redirect page
 * @param reserved - First segments that real routes own (reservedRoots)
 * @param resolve - The resolver of the 404 script; only a test passes another one, to feed the
 *   plan answers that getSmartRedirect never gives
 * @returns The files, the number of addresses served, the skipped and the shadowed addresses, and
 *   the problems (a resolver whose answers do not make a coherent pair of languages)
 */
export function aliasPlan(
    nav: Nav,
    textOf: TextOf,
    reserved: ReadonlySet<string>,
    resolve: Resolve = getSmartRedirect,
): AliasPlan {
    const files: RedirectFile[] = [];
    const skipped: string[] = [];
    const shadowed: string[] = [];
    const problems: string[] = [];
    let addresses = 0;
    for (const address of aliasAddresses(nav)) {
        const stated = aliasLang(address);
        if (isReserved(address.split("/")[stated ? 1 : 0] ?? "", reserved)) {
            shadowed.push(address);
            continue;
        }
        const en = resolve(`/${address}`, nav, "en");
        const fr = resolve(`/${address}`, nav, "fr");
        if (en === null || fr === null) {
            skipped.push(address);
            continue;
        }

        // Without script, an address with no prefix falls back to the English page
        const lang: Lang = stated ?? "en";
        const targets: AliasTargets = stated ? { [stated]: fr } : { en, fr };
        const coherent = stated
            ? en === fr && parsePath(fr).lang === stated
            : parsePath(en).lang === "en" && parsePath(fr).lang === "fr" && samePage(en, fr);
        const target = targets[lang];
        if (!coherent || !target) {
            problems.push(`/${address}: incoherent targets ${en} and ${fr}`);
            continue;
        }
        const html = aliasHtml(targets, lang, textOf(lang, pageOf(target)));
        for (const file of aliasFiles(address)) files.push({ file, html });
        addresses += 1;
    }
    return { files, addresses, skipped, shadowed, problems };
}

/**
 * Builds the texts of the redirect pages from the messages: the title of the target page through
 * the title template (with the version on older versions), and the redirect sentence of the 404
 * namespace for the noscript link.
 *
 * @param root - Folder that holds messages/
 * @param nav - Navigation index, the titles of the target pages
 * @returns A function giving the texts of one page, or of the French home for null
 */
export function redirectTexts(root: string, nav: Nav): TextOf {
    const translators = new Map<Lang, ReturnType<typeof createTranslator>>();
    const translator = (lang: Lang) => {
        let t = translators.get(lang);
        if (!t) {
            const messages = {
                meta: readNamespace(root, lang, "meta"),
                notfound: readNamespace(root, lang, "notfound"),
            };
            t = createTranslator({ locale: lang, messages });
            translators.set(lang, t);
        }
        return t;
    };
    return (lang, old) => {
        const t = translator(lang);
        let title = t("meta.home.title");
        if (old) {
            const name = nav[old.version][old.id].title[lang];
            const versioned =
                old.version === LATEST
                    ? name
                    : t("meta.versioned", { title: name, version: old.version });
            title = t("meta.template").replace("%s", versioned);
        }
        return { title, link: t("notfound.redirectingTo", { target: title }) };
    };
}

/**
 * Writes the planned files under the export folder. An existing file with the same content is
 * left alone (a second run); an existing file with another content is a collision and is never
 * overwritten.
 *
 * @param out - Absolute export folder
 * @param files - Planned redirect files, relative to it
 * @returns How many files were written, already there, and the collisions
 */
export function writeRedirects(
    out: string,
    files: readonly RedirectFile[],
): { written: number; unchanged: number; collisions: string[] } {
    let written = 0;
    let unchanged = 0;
    const collisions: string[] = [];
    for (const { file, html } of files) {
        const path = join(out, file);
        if (existsSync(path)) {
            if (statSync(path).isFile() && readFileSync(path, "utf8") === html) unchanged += 1;
            else collisions.push(file);
            continue;
        }
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, html);
        written += 1;
    }
    return { written, unchanged, collisions };
}

/**
 * Writes the redirect files into the static export after next build (postbuild): the legacy URLs
 * from the fixed inventory, then the prebuilt pages of the alias addresses.
 *
 * @param args - "--out <dir>" (export folder, out/ by default) and "--root <dir>" (repository
 *   root holding messages/, public/ and src/lib/oldUrls.json)
 * @returns The exit status: 1 on a missing export, a collision, a legacy page without page or an
 *   alias page whose targets disagree
 */
export async function main(args: readonly string[]): Promise<number> {
    const option = (flag: string) => {
        const at = args.indexOf(flag);
        return at >= 0 && args[at + 1] ? args[at + 1] : undefined;
    };
    const root = option("--root") ?? cwd();
    const out = option("--out") ?? join(root, OUT_DIR);
    if (!existsSync(out)) {
        console.error(`redirects: ${out} does not exist, run next build first`);
        return 1;
    }
    const urls = JSON.parse(readFileSync(join(root, OLD_URLS_FILE), "utf8")) as OldUrls;
    const pages = new Map<string, Page>();
    for (const [version, loaders] of Object.entries(PAGES)) {
        for (const [id, load] of Object.entries(loaders))
            pages.set(`${version}/${id}`, await load());
    }

    const textOf = redirectTexts(root, NAV);
    const plan = redirectPlan(urls, NAV, pages, textOf);
    for (const problem of plan.problems) console.error(`redirects: ${problem}`);
    const result = writeRedirects(out, plan.files);
    for (const file of result.collisions) console.error(`redirects: collision, ${file} exists`);
    const largest = Math.max(0, ...plan.files.map(({ html }) => Buffer.byteLength(html)));
    console.log(
        `redirects: ${plan.pages} legacy pages x 2 + ${LEGACY_HOME_FILES.length} home = ${plan.files.length} files (${result.written} written, ${result.unchanged} unchanged), ${result.collisions.length} collisions, ${plan.skipped} legacy pages of unpublished versions skipped, largest ${largest} bytes`,
    );
    if (largest > REDIRECT_MAX) console.log(`redirects: a file is over ${REDIRECT_MAX} bytes`);

    const publicDir = join(root, "public");
    const reserved = reservedRoots(existsSync(publicDir) ? readdirSync(publicDir) : []);
    const alias = aliasPlan(NAV, textOf, reserved);
    for (const problem of alias.problems) console.error(`redirects: alias ${problem}`);
    for (const address of alias.skipped)
        console.log(`redirects: alias /${address} skipped, no target`);
    for (const address of alias.shadowed) {
        console.log(`redirects: alias /${address} dropped, a real route of the export owns it`);
    }
    const written = writeRedirects(out, alias.files);
    for (const file of written.collisions) console.error(`redirects: collision, ${file} exists`);
    const biggest = Math.max(0, ...alias.files.map(({ html }) => Buffer.byteLength(html)));
    console.log(
        `redirects: ${alias.addresses} alias addresses x 2 = ${alias.files.length} files (${written.written} written, ${written.unchanged} unchanged), ${written.collisions.length} collisions, ${alias.skipped.length} skipped, ${alias.shadowed.length} dropped for a real route, largest ${biggest} bytes`,
    );
    if (biggest > REDIRECT_MAX)
        console.log(`redirects: an alias file is over ${REDIRECT_MAX} bytes`);

    const failed = plan.problems.length + result.collisions.length;
    return failed || alias.problems.length || written.collisions.length ? 1 : 0;
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
    exit(await main(argv.slice(2)));
}
