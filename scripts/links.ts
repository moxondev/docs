import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { argv, cwd, exit } from "node:process";
import { pathToFileURL } from "node:url";

import { LINKS } from "@/data/links";
import { NAV } from "@/data/nav";
import { PAGES } from "@/data/pages/registry";
import { SITE } from "@/data/site";
import { localePath } from "@/i18n/routing";
import { LEGACY_HOME_FILES, legacyFiles } from "@/lib/redirect";
import { hasPage, href, parsePath } from "@/lib/routes";
import type { Lang, Version } from "@/types/content";
import type { Nav } from "@/types/nav";
import type { SearchDoc } from "@/types/search";

import { ALL_VERSIONS, inlineLeaves, linkTargets } from "./pages";
import { OLD_URLS_FILE, type OldUrls, OUT_DIR } from "./redirects";

export interface LinkProblem {
    file: string;
    rule: string;
    message: string;
}

export interface HtmlFacts {
    links: string[];
    ids: Set<string>;
}

export interface RouteReport {
    mapped: number;
    legacy: number;
    present: number;
    routes: number;
    skipped: number;
    problems: LinkProblem[];
}

const LANGS: readonly Lang[] = ["en", "fr"];

// Elements whose href or src attribute points at a file (a, link, script, img, source...)
const LINK_TAG = /<(a|area|link|script|img|source|iframe|video|audio)\b([^>]*)>/gi;

// href and src attributes, quoted or not
const LINK_ATTR = /\s(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/gi;

const ID_ATTR = /\sid\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

// Origin of the production site: absolute links to it are internal links
const ORIGIN = SITE.url;

// Characters escaped by the HTML serializer of React and Next in attribute values
const ENTITIES: Readonly<Record<string, string>> = {
    "&amp;": "&",
    "&quot;": '"',
    "&#x27;": "'",
    "&#39;": "'",
    "&lt;": "<",
    "&gt;": ">",
};

/**
 * Decodes the HTML entities that a serializer writes in attribute values.
 *
 * @param value - Raw attribute value
 * @returns The value as the browser reads it
 */
export function decodeAttribute(value: string): string {
    return value.replace(/&(?:amp|quot|#x27|#39|lt|gt);/g, (entity) => ENTITIES[entity] ?? entity);
}

/**
 * Reads the link targets and the ids of an HTML document; the bodies of script elements (the
 * RSC payload) are dropped first, so their strings count neither as links nor as ids.
 *
 * @param html - HTML source of a page of the export
 * @returns The href and src values in document order, and every id
 */
export function htmlFacts(html: string): HtmlFacts {
    const markup = html.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1</script>");
    const links: string[] = [];
    for (const tag of markup.matchAll(LINK_TAG)) {
        for (const attr of tag[2].matchAll(LINK_ATTR)) {
            links.push(decodeAttribute(attr[1] ?? attr[2] ?? attr[3] ?? ""));
        }
    }
    const ids = new Set<string>();
    for (const attr of markup.matchAll(ID_ATTR)) ids.add(decodeAttribute(attr[1] ?? attr[2] ?? ""));
    return { links, ids };
}

/**
 * Finds the file that GitHub Pages serves for a site path: "/" and "/x/" give an index.html,
 * "/x" gives the file x, else x.html, else x/index.html (after a redirect).
 *
 * @param out - Export folder
 * @param path - Decoded site path without query and fragment, starting with "/"
 * @returns The file path, or null when the server would answer 404
 */
export function servedFile(out: string, path: string): string | null {
    const local = join(out, ...path.split("/").filter(Boolean));
    const isFile = (file: string) => existsSync(file) && statSync(file).isFile();
    if (path.endsWith("/"))
        return isFile(join(local, "index.html")) ? join(local, "index.html") : null;
    for (const file of [local, `${local}.html`, join(local, "index.html")]) {
        if (isFile(file)) return file;
    }
    return null;
}

/**
 * Splits a link into its kind and parts: internal (site path or absolute moxon.dev URL), a
 * fragment of the same document, external web URL, or a scheme that is not checked.
 *
 * @param link - href or src value
 * @param base - Site path of the document holding the link, for relative links
 * @returns The classification, with the decoded path and the fragment of internal links
 */
export function classify(
    link: string,
    base: string,
):
    | { kind: "internal"; path: string; fragment: string }
    | { kind: "external"; url: string }
    | { kind: "other" } {
    if (/^(mailto|tel|data|javascript|blob):/i.test(link)) return { kind: "other" };
    let url: URL;
    try {
        url = new URL(link, `${ORIGIN}${base}`);
    } catch {
        return { kind: "other" };
    }
    if (url.origin !== ORIGIN) {
        return /^https?:$/.test(url.protocol)
            ? { kind: "external", url: url.href }
            : { kind: "other" };
    }
    return {
        kind: "internal",
        path: decodePart(url.pathname),
        fragment: decodePart(url.hash.slice(1)),
    };
}

/**
 * Decodes the percent escapes of a path or a fragment the way the browser compares them.
 *
 * @param part - Pathname or fragment of a parsed URL
 * @returns The decoded text, or the text as given when an escape is malformed ("#100%")
 */
function decodePart(part: string): string {
    try {
        return decodeURIComponent(part);
    } catch {
        return part;
    }
}

/**
 * Lists the external URLs that the site may print: the catalogue of src/data/links.ts, used as
 * prefixes (the per-page edit links and the API calls follow them), and every web link target of
 * the published content.
 *
 * @returns The allowed prefixes and exact URLs
 */
export async function externalAllowList(): Promise<string[]> {
    const allowed = new Set<string>(Object.values(LINKS).filter((url) => /^https?:/.test(url)));
    for (const loaders of Object.values(PAGES)) {
        for (const load of Object.values(loaders)) {
            const page = await load();
            if (page.release) allowed.add(page.release.url);
            for (const lang of LANGS) {
                for (const target of inlineLeaves(page, lang).flatMap(linkTargets)) {
                    if (/^https?:\/\//.test(target)) allowed.add(target);
                }
            }
        }
    }
    return [...allowed];
}

/**
 * Lists the HTML files of the export, the Next assets excluded.
 *
 * @param out - Export folder
 * @returns Paths relative to it, "/" separators
 */
function htmlFiles(out: string): string[] {
    const files: string[] = [];
    const walk = (folder: string) => {
        for (const name of readdirSync(folder)) {
            const path = join(folder, name);
            if (statSync(path).isDirectory()) {
                if (name !== "_next") walk(path);
            } else if (name.endsWith(".html")) files.push(relative(out, path).split(sep).join("/"));
        }
    };
    walk(out);
    return files.sort();
}

/**
 * Gives the site path of an exported HTML file: "v6/hash/index.html" is served at "/v6/hash/".
 *
 * @param file - Path relative to the export folder
 * @returns The path the file is served at
 */
function sitePath(file: string): string {
    if (file === "index.html") return "/";
    if (file.endsWith("/index.html")) return `/${file.slice(0, -"index.html".length)}`;
    return `/${file}`;
}

/**
 * Checks every link of the export (served files, fragment ids, allowed external URLs) and every
 * search result of out/search/*.json. A link into a version that is not published yet is counted,
 * not reported, until that version lands.
 *
 * @param out - Export folder
 * @param allowed - External prefixes and URLs that may appear
 * @param nav - Navigation index, the published versions
 * @returns The problems, how many files and links were checked and how many were skipped
 */
export function checkOut(
    out: string,
    allowed: readonly string[],
    nav: Nav,
): { problems: LinkProblem[]; files: number; links: number; skipped: number } {
    const problems: LinkProblem[] = [];
    let skipped = 0;
    const facts = new Map<string, HtmlFacts>();
    const factsOf = (file: string): HtmlFacts => {
        let found = facts.get(file);
        if (!found) {
            found = file.endsWith(".html")
                ? htmlFacts(readFileSync(file, "utf8"))
                : { links: [], ids: new Set() };
            facts.set(file, found);
        }
        return found;
    };
    const check = (where: string, link: string, base: string) => {
        const parsed = classify(link, base);
        if (parsed.kind === "other") return;
        if (parsed.kind === "external") {
            if (!allowed.some((prefix) => parsed.url.startsWith(prefix))) {
                problems.push({
                    file: where,
                    rule: "external",
                    message: `not allowed: ${parsed.url}`,
                });
            }
            return;
        }
        const target = servedFile(out, parsed.path);
        const version = parsePath(parsed.path).version;
        if (!target && version && Object.keys(nav[version]).length === 0) {
            skipped += 1;
            return;
        }
        if (!target) {
            problems.push({ file: where, rule: "missing", message: `no file for ${parsed.path}` });
        } else if (parsed.fragment && !factsOf(target).ids.has(parsed.fragment)) {
            problems.push({
                file: where,
                rule: "fragment",
                message: `no id #${parsed.fragment} in ${parsed.path}`,
            });
        }
    };

    const files = htmlFiles(out);
    let links = 0;
    for (const file of files) {
        const path = join(out, file);
        const base = sitePath(file);
        for (const link of factsOf(path).links) {
            links += 1;
            check(file, link, base);
        }
    }
    const search = join(out, "search");
    if (existsSync(search)) {
        for (const name of readdirSync(search).filter((entry) => entry.endsWith(".json"))) {
            const docs = JSON.parse(readFileSync(join(search, name), "utf8")) as SearchDoc[];
            for (const doc of docs) {
                links += 1;
                check(`search/${name}`, doc.h ? `${doc.u}#${doc.h}` : doc.u, "/");
            }
        }
    }
    return { problems, files: files.length, links, skipped };
}

/**
 * Checks the route coverage against the legacy inventory, never against the registry: every legacy
 * page of a published version has its page and its two redirect files, every page of the
 * navigation has its route in both languages, and no other documentation route exists.
 *
 * @param out - Export folder
 * @param urls - Legacy URL inventory (src/lib/oldUrls.json)
 * @param nav - Navigation index of the published versions
 * @returns The counts and the problems
 */
export function checkRoutes(out: string, urls: OldUrls, nav: Nav): RouteReport {
    const problems: LinkProblem[] = [];
    const has = (file: string) => existsSync(join(out, file));
    let mapped = 0;
    let skipped = 0;
    let legacy = 0;
    for (const old of urls.pages) {
        if (Object.keys(nav[old.version]).length === 0) {
            skipped += 1;
            continue;
        }
        legacy += 1;
        const route = `${href(old.lang, old.version, old.id).slice(1)}index.html`;
        const missing = [
            ...(hasPage(nav, old.version, old.id) && has(route) ? [] : [route]),
            ...legacyFiles(old).filter((file) => !has(file)),
        ];
        if (missing.length) {
            problems.push({
                file: old.url,
                rule: "legacy",
                message: `missing ${missing.join(", ")}`,
            });
        } else mapped += 1;
    }

    const expected = new Set<string>(["index.html", `${localePath("fr").slice(1)}index.html`]);
    for (const version of ALL_VERSIONS) {
        for (const id of Object.keys(nav[version])) {
            for (const lang of LANGS) expected.add(`${href(lang, version, id).slice(1)}index.html`);
        }
    }
    let present = 0;
    for (const file of expected) {
        if (has(file)) present += 1;
        else problems.push({ file, rule: "route", message: "missing route" });
    }
    for (const home of LEGACY_HOME_FILES) {
        if (!has(home.file)) problems.push({ file: home.file, rule: "legacy", message: "missing" });
    }

    const redirects = new Set(urls.pages.flatMap((old) => legacyFiles(old)));
    const isDocRoute = (file: string) =>
        /^(fr\/)?v[1-6]\//.test(file) && file.endsWith("/index.html");
    for (const file of htmlFiles(out).filter(isDocRoute)) {
        if (!expected.has(file) && !redirects.has(file)) {
            problems.push({ file, rule: "route", message: "route outside the navigation" });
        }
    }
    return { mapped, legacy, present, routes: expected.size, skipped, problems };
}

/**
 * Checks the static export: --routes for the route coverage, --out for the links; both by
 * default.
 *
 * @param args - "--routes", "--out", "--dir <export folder>" and "--root <repository root>"
 * @returns The exit status: 1 on any problem or when the export is missing
 */
export async function main(args: readonly string[]): Promise<number> {
    const option = (flag: string) => {
        const at = args.indexOf(flag);
        return at >= 0 && args[at + 1] && !args[at + 1].startsWith("--") ? args[at + 1] : undefined;
    };
    const root = option("--root") ?? cwd();
    const out = option("--dir") ?? join(root, OUT_DIR);
    const all = !args.includes("--routes") && !args.includes("--out");
    if (!existsSync(out)) {
        console.error(`links: ${out} does not exist, run npm run build first`);
        return 1;
    }
    const problems: LinkProblem[] = [];
    const published = ALL_VERSIONS.filter((version: Version) => Object.keys(NAV[version]).length);

    if (all || args.includes("--routes")) {
        const urls = JSON.parse(readFileSync(join(root, OLD_URLS_FILE), "utf8")) as OldUrls;
        const routes = checkRoutes(out, urls, NAV);
        problems.push(...routes.problems);
        console.log(
            `links --routes: ${routes.mapped}/${routes.legacy} legacy URLs mapped, ${routes.present}/${routes.routes} routes present (published ${published.join(", ") || "none"}; ${routes.skipped} legacy pages of unpublished versions not checked)`,
        );
    }
    if (all || args.includes("--out")) {
        const result = checkOut(out, await externalAllowList(), NAV);
        problems.push(...result.problems);
        console.log(
            `links --out: ${result.files} HTML files, ${result.links} links and search results, ${result.skipped} into unpublished versions not checked, ${result.problems.length} problems`,
        );
    }
    for (const problem of problems.slice(0, 200)) {
        console.error(`${problem.file} ${problem.rule} ${problem.message}`);
    }
    if (problems.length > 200) console.error(`... and ${problems.length - 200} more`);
    return problems.length ? 1 : 0;
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
    exit(await main(argv.slice(2)));
}
