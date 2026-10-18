import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { argv, cwd, exit } from "node:process";
import { pathToFileURL } from "node:url";

import { createTranslator } from "next-intl";

import { NAV } from "@/data/nav";
import { PAGES } from "@/data/pages/registry";
import { LATEST } from "@/data/versions";
import { aliasMap } from "@/lib/anchors";
import { LEGACY_HOME_FILES, legacyFiles, type LegacyPage, legacyUrl } from "@/lib/redirect";
import { absoluteUrl, hasPage } from "@/lib/routes";
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

export type TextOf = (lang: Lang, page: LegacyPage | null) => RedirectText;

/**
 * Inventory of the URLs of the former site, captured from its real build before the migration: the
 * input of the redirect files, never derived from the new registry.
 */
export const OLD_URLS_FILE = "src/lib/oldUrls.json";

// Output folder of next build (static export)
export const OUT_DIR = "out";

// Size that a redirect file should stay under
export const REDIRECT_MAX = 1024;

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
 * Writes one redirect page: charset and viewport, the title, the canonical URL of the new page, an
 * inline script that replaces the location with the new path, keeping the query and remapping the
 * fragment from the legacy ids, the zero-second refresh for browsers without script, and a link.
 *
 * @param target - New site path, ending with "/"
 * @param lang - Language of the page, for the html element
 * @param remap - Legacy fragment id to current id, from the section aliases
 * @param text - Title and link text in that language
 * @returns The HTML document
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
    return [
        "<!doctype html>",
        `<html lang="${lang}">`,
        '<head><meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        `<title>${escapeHtml(text.title)}</title>`,
        `<link rel="canonical" href="${escapeHtml(absoluteUrl(target))}">`,
        `<script>${script}</script>`,
        `<meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">`,
        "</head>",
        `<body><noscript><a href="${escapeHtml(target)}">${escapeHtml(text.link)}</a></noscript></body>`,
        "</html>",
        "",
    ].join("\n");
}

/**
 * Plans every redirect file of the export: two per legacy page of a published version (the folder
 * form and its .html twin), plus fr.html. A legacy page that has no page is a hard error, unless
 * its version is not published yet and the page is counted as skipped.
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
 * Writes the legacy redirect files into the static export after next build (postbuild).
 *
 * @param args - "--out <dir>" (export folder, out/ by default) and "--root <dir>" (repository
 *   root holding messages/ and src/lib/oldUrls.json)
 * @returns The exit status: 1 on a missing export, a collision or a legacy page without page
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

    const plan = redirectPlan(urls, NAV, pages, redirectTexts(root, NAV));
    for (const problem of plan.problems) console.error(`redirects: ${problem}`);
    const result = writeRedirects(out, plan.files);
    for (const file of result.collisions) console.error(`redirects: collision, ${file} exists`);
    const largest = Math.max(0, ...plan.files.map(({ html }) => Buffer.byteLength(html)));
    console.log(
        `redirects: ${plan.pages} legacy pages x 2 + ${LEGACY_HOME_FILES.length} home = ${plan.files.length} files (${result.written} written, ${result.unchanged} unchanged), ${result.collisions.length} collisions, ${plan.skipped} legacy pages of unpublished versions skipped, largest ${largest} bytes`,
    );
    if (largest > REDIRECT_MAX) console.log(`redirects: a file is over ${REDIRECT_MAX} bytes`);
    return plan.problems.length || result.collisions.length ? 1 : 0;
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
    exit(await main(argv.slice(2)));
}
