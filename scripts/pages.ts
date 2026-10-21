import {
    existsSync,
    readdirSync,
    readFileSync,
    renameSync,
    statSync,
    writeFileSync,
} from "node:fs";
import { join, relative, sep } from "node:path";
import { argv, cwd, exit, pid } from "node:process";
import { pathToFileURL } from "node:url";

import { format, resolveConfig } from "prettier";

import { CATALOGUE, CATEGORIES } from "@/data/catalogue";
import { LATEST } from "@/data/versions";
import { pageAnchors } from "@/lib/anchors";
import { type InlineNode, isLoc, parseInline, pick, plain, refTarget } from "@/lib/inline";
import { catalogueEntry, isListed, PAGE_STATUSES, pageOrder, releasePages } from "@/lib/nav";
import { hasPage, isVersion } from "@/lib/routes";
import type { Block, Inline, Lang, Lx, Method, Page, Version } from "@/types/content";
import type { Nav, NavPage } from "@/types/nav";

export interface PageEntry {
    version: Version;
    id: string;
    module: string;
    release?: string;
    page: Page;
}

export interface Problem {
    where: string;
    rule: string;
    message: string;
}

export type Identical = Record<string, string[]>;

// Folder of the page modules, one subfolder per published version (relative to the root)
export const PAGES_DIR = "src/data/pages";

// The three generated modules, committed and checked for freshness by npm run check
export const NAV_FILE = "src/data/nav.ts";
export const KINDS_FILE = "src/data/kinds.ts";
export const REGISTRY_FILE = "src/data/pages/registry.ts";

// Reviewed prose leaves written once for both languages, keyed by "vN/<page id>"
export const IDENTICAL_FILE = "scripts/identical.json";

// Every version in ascending order, the key order of the generated records
export const ALL_VERSIONS: readonly Version[] = ["v1", "v2", "v3", "v4", "v5", "v6"];

// Module of every release page of a version: a dotted file name would trip check-file
const RELEASES_MODULE = "releases";

// Page id of a release, "changelog/<major>.<minor>.<patch>"
const RELEASE_ID = /^changelog\/(\d+\.\d+\.\d+)$/;

// Shape of Page.updated
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Expected count of listed entries of the latest version per category, in display order: asserted
 * by the check and never typed in the interface.
 */
const LATEST_COUNTS: readonly number[] = [9, 8, 7, 10, 6, 6, 3];

const LANGS: readonly Lang[] = ["en", "fr"];

/**
 * Converts one kebab-case id segment to camelCase, "tic-tac-toe" becoming "ticTacToe".
 *
 * @param segment - Segment of a page id, lower case
 * @returns The segment as a file or folder name of src/data/pages
 */
function camel(segment: string): string {
    return segment.replace(/-([a-z0-9])/g, (_, next: string) => next.toUpperCase());
}

/**
 * Gives the module that holds a page, relative to its version folder and without extension: each
 * id segment in camelCase, the release pages in "releases".
 *
 * @param id - Page id such as "tic-tac-toe/fetch" or "changelog/6.1.0"
 * @returns For example "ticTacToe/fetch", "index" or "releases"
 */
export function modulePath(id: string): string {
    if (RELEASE_ID.test(id)) return RELEASES_MODULE;
    return id.split("/").map(camel).join("/");
}

/**
 * Lists the version folders of src/data/pages: a version has a folder only once its pages are
 * published, so these are the published versions.
 *
 * @param root - Repository root
 * @returns The versions found, in ascending order
 */
export function listVersions(root: string): Version[] {
    const dir = join(root, PAGES_DIR);
    if (!existsSync(dir)) return [];
    return ALL_VERSIONS.filter((version) => {
        const folder = join(dir, version);
        return existsSync(folder) && statSync(folder).isDirectory();
    });
}

/**
 * Lists the TypeScript modules under a folder, tests and declarations excluded.
 *
 * @param dir - Version folder of src/data/pages
 * @returns Paths relative to the folder with "/" separators and the .ts extension, sorted
 */
export function listModules(dir: string): string[] {
    const out: string[] = [];
    const walk = (folder: string) => {
        for (const name of readdirSync(folder).sort()) {
            const path = join(folder, name);
            if (statSync(path).isDirectory()) walk(path);
            else if (name.endsWith(".ts") && !/\.(test|d)\.ts$/.test(name)) {
                out.push(relative(dir, path).split(sep).join("/"));
            }
        }
    };
    walk(dir);
    return out.sort();
}

/**
 * Checks the shape of a page id: segments of the inline grammar, no first segment that is a
 * language (the redirects read /vN/en and /vN/fr) or a version (ref: targets would misread it).
 *
 * @param id - Page id read from a module
 * @returns A sentence per problem, empty when the id is valid
 */
export function idProblems(id: string): string[] {
    const out: string[] = [];
    const ref = refTarget(`ref:${id}`);
    if (!ref || ref.version || ref.section || ref.slug !== id) out.push("not a valid page id");
    const first = id.split("/")[0];
    if (first === "en" || first === "fr") out.push(`first segment "${first}" is a language`);
    if (isVersion(first)) out.push(`first segment "${first}" is a version`);
    return out;
}

/**
 * Loads every page module of a version and checks what the generated registry relies on: ids,
 * module names, versions and the release keys of releases.ts.
 *
 * @param root - Repository root
 * @param version - Version folder to load
 * @returns The pages in id order, and the problems that forbid writing the registry
 */
export async function loadVersion(
    root: string,
    version: Version,
): Promise<{ entries: PageEntry[]; problems: Problem[] }> {
    const dir = join(root, PAGES_DIR, version);
    const entries: PageEntry[] = [];
    const problems: Problem[] = [];
    const fail = (where: string, rule: string, message: string) =>
        problems.push({ where, rule, message });

    for (const file of listModules(dir)) {
        const name = file.slice(0, -".ts".length);
        const where = `${PAGES_DIR}/${version}/${file}`;
        const loaded = (await import(pathToFileURL(join(dir, file)).href)) as {
            page?: Page;
            releases?: Record<string, Page>;
        };
        const found: PageEntry[] = [];
        if (name === RELEASES_MODULE) {
            for (const [key, page] of Object.entries(loaded.releases ?? {})) {
                found.push({ version, id: page.id, module: name, release: key, page });
                if (page.id !== `changelog/${key}` || page.release?.version !== key) {
                    fail(where, "release", `key ${key} holds ${page.id}`);
                }
                if (page.kind !== "release") fail(where, "release", `${page.id} is not a release`);
            }
            if (found.length === 0) fail(where, "module", "exports no releases");
        } else if (loaded.page) {
            found.push({ version, id: loaded.page.id, module: name, page: loaded.page });
        } else fail(where, "module", "exports no page");

        for (const entry of found) {
            if (entry.page.version !== version) {
                fail(where, "version", `${entry.id} declares ${entry.page.version}`);
            }
            for (const message of idProblems(entry.id))
                fail(where, "id", `${entry.id}: ${message}`);
            if (modulePath(entry.id) !== name) {
                fail(where, "module-name", `${entry.id} belongs in ${modulePath(entry.id)}.ts`);
            }
            if (entries.some((other) => other.id === entry.id)) {
                fail(where, "duplicate", `${entry.id} is defined twice`);
            }
            entries.push(entry);
        }
    }
    entries.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    return { entries, problems };
}

/**
 * Gives the navigation facts of a page: plain titles, kind, status, methods, update date and, for
 * a release, its plain summary.
 *
 * @param page - Page whose titles, kind, status, operations and release summary feed the entry
 * @returns The NAV entry
 */
export function navPage(page: Page): NavPage {
    const entry: NavPage = {
        title: { en: plain(page.title.en), fr: plain(page.title.fr) },
        kind: page.kind,
        methods: [...new Set<Method>((page.operations ?? []).map((op) => op.method))],
    };
    if (page.status) entry.status = page.status;
    if (page.updated) entry.updated = page.updated;
    if (page.release) {
        entry.summary = {
            en: plain(pick(page.release.summary, "en")),
            fr: plain(pick(page.release.summary, "fr")),
        };
    }
    return entry;
}

/**
 * Builds the navigation index from the loaded pages; a version without a folder is empty.
 *
 * @param entries - Pages of every published version
 * @returns The NAV record, every version key present
 */
export function buildNav(entries: readonly PageEntry[]): Nav {
    const nav = Object.fromEntries(ALL_VERSIONS.map((version) => [version, {}])) as Nav;
    for (const entry of entries) nav[entry.version][entry.id] = navPage(entry.page);
    return nav;
}

/**
 * Writes the source of src/data/nav.ts (before Prettier): the navigation index and the release
 * of the documentation, so that no client module has to import package.json.
 *
 * @param nav - Navigation index
 * @param release - Version of package.json, the documentation release
 * @returns Module text, to be passed to formatSource
 */
export function navSource(nav: Nav, release: string): string {
    const versions = ALL_VERSIONS.map((version) => `${version}: ${JSON.stringify(nav[version])},`);
    return [
        'import type { Nav } from "@/types/nav";',
        "",
        "/**",
        " * Release of the documentation, shown by the header and the metadata. Generated by",
        " * scripts/pages.ts from package.json, never edit it by hand: run npm run gen.",
        " */",
        `export const RELEASE = ${JSON.stringify(release)};`,
        "",
        "/**",
        " * Titles, kinds, methods and dates of every page, imported by the client navigation.",
        " * Generated by scripts/pages.ts from the page modules of src/data/pages, never edit it by",
        " * hand: run npm run gen (npm run check fails when it is stale).",
        " */",
        `export const NAV: Nav = {${versions.join("")}};`,
        "",
    ].join("\n");
}

/**
 * Writes the source of src/data/kinds.ts (before Prettier): the page index reduced to whether a
 * page exists and what kind it is, so that the client chrome never bundles the titles and dates
 * of NAV.
 *
 * @param nav - Navigation index
 * @returns Module text, to be passed to formatSource
 */
export function kindsSource(nav: Nav): string {
    const versions = ALL_VERSIONS.map((version) => {
        const pages = Object.entries(nav[version]).map(
            ([id, page]) => `${JSON.stringify(id)}: { kind: ${JSON.stringify(page.kind)} },`,
        );
        return `${version}: {${pages.join("")}},`;
    });
    return [
        'import type { PageIndex } from "@/lib/routes";',
        "",
        "/**",
        " * Kind of every page, imported by the client chrome in place of NAV. Generated by",
        " * scripts/pages.ts from the page modules of src/data/pages, never edit it by hand: run",
        " * npm run gen (npm run check fails when it is stale).",
        " */",
        `export const KINDS: PageIndex = {${versions.join("")}};`,
        "",
    ].join("\n");
}

/**
 * Reads the documentation release from the package.json of a project.
 *
 * @param root - Project root that holds package.json
 * @returns The version field, which must be a non-empty string
 */
export function readRelease(root: string): string {
    const pkg: unknown = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const version = (pkg as { version?: unknown }).version;
    if (typeof version !== "string" || !version) {
        throw new Error("package.json has no version string");
    }
    return version;
}

/**
 * Writes the source of src/data/pages/registry.ts (before Prettier): one lazy loader per page,
 * so that a route only bundles its own page module.
 *
 * @param entries - Pages of every published version
 * @returns Module text, to be passed to formatSource
 */
export function registrySource(entries: readonly PageEntry[]): string {
    const versions = ALL_VERSIONS.map((version) => {
        const lines = entries
            .filter((entry) => entry.version === version)
            .map((entry) => {
                const value = entry.release
                    ? `m.releases[${JSON.stringify(entry.release)}]`
                    : "m.page";
                return `${JSON.stringify(entry.id)}: () => import("./${version}/${entry.module}").then((m) => ${value}),`;
            });
        return `${version}: {${lines.join("")}},`;
    });
    return [
        'import type { Page, Version } from "@/types/content";',
        "",
        "/**",
        " * One lazy loader per page module of src/data/pages, so a route reads only its own page.",
        " * Generated by scripts/pages.ts, never edit it by hand: run npm run gen.",
        " */",
        `export const PAGES: Record<Version, Record<string, () => Promise<Page>>> = {${versions.join("")}};`,
        "",
    ].join("\n");
}

/**
 * Formats a generated module with the Prettier configuration of the repository.
 *
 * @param source - TypeScript source
 * @param file - Path of the module, which selects the parser and the configuration
 * @returns The text as Prettier prints it with the repository configuration
 */
export async function formatSource(source: string, file: string): Promise<string> {
    const config = (await resolveConfig(file)) ?? {};
    return format(source, { ...config, filepath: file });
}

/**
 * Tells whether inline markup holds a word (two letters or more) outside code spans and links,
 * the reading of the untranslated-prose guard.
 *
 * @param text - Inline markup written once for both languages
 * @returns True when the text reads as prose
 */
export function hasWords(text: Inline): boolean {
    const visit = (nodes: InlineNode[]): string =>
        nodes
            .map((node) => {
                if (node.type === "text") return node.value;
                if (node.type === "strong" || node.type === "em") return visit(node.children);
                return " ";
            })
            .join("");
    return /\p{L}{2,}/u.test(visit(parseInline(text)));
}

/**
 * Lists the prose leaves of a page that are written once for both languages and hold words, for
 * the untranslated-prose guard. Names, messages, types and code are neutral columns, never read.
 *
 * @param page - Page whose prose leaves are scanned
 * @returns The distinct leaves, in document order
 */
export function sharedProse(page: Page): string[] {
    const out: string[] = [];
    const note = (lx: Lx<Inline> | undefined) => {
        if (lx === undefined || isLoc(lx) || !hasWords(lx) || out.includes(lx)) return;
        out.push(lx);
    };
    const walk = (blocks: readonly Block[]) => {
        for (const block of blocks) {
            switch (block.type) {
                case "p":
                case "label":
                case "quote":
                    note(block.text);
                    break;
                case "list":
                    block.items.forEach(note);
                    break;
                case "callout":
                    note(block.title);
                    if (!isLoc(block.body)) {
                        for (const part of block.body) {
                            (part.type === "p" ? [part.text] : part.items).forEach(note);
                        }
                    }
                    break;
                case "details":
                    note(block.title);
                    walk(block.body);
                    break;
                case "values":
                    note(block.title);
                    block.groups.forEach((group) => note(group.label));
                    break;
                case "table":
                    if (!isLoc(block.head)) block.head.forEach(note);
                    block.rows.forEach((row) => row.forEach(note));
                    break;
                case "params":
                    block.rows.forEach((row) => {
                        note(row.default);
                        note(row.description);
                    });
                    break;
                case "fields":
                case "errors":
                    block.rows.forEach((row) => note(row.description));
                    break;
                case "related":
                    block.items.forEach((item) => note(item.description));
                    break;
            }
        }
    };
    note(page.lead);
    if (page.release) note(page.release.summary);

    // Split branches and one-language sections are single-language by design
    for (const section of page.sections) if (!section.only) walk(section.blocks);
    return out;
}

/**
 * Lists every inline string of a page in one language, with the Related targets as ref: links,
 * for the link check.
 *
 * @param page - Page whose title, sections and Related targets are walked
 * @param lang - Language whose leaves, split branches and sections are read
 * @returns Inline strings; a Related target is given as "[x](ref:<to>)"
 */
export function inlineLeaves(page: Page, lang: Lang): Inline[] {
    const out: Inline[] = [pick(page.title, lang)];
    const add = (lx: Lx<Inline> | undefined) => {
        if (lx !== undefined) out.push(pick(lx, lang));
    };
    const walk = (blocks: readonly Block[]) => {
        for (const block of blocks) {
            switch (block.type) {
                case "p":
                case "label":
                case "quote":
                    add(block.text);
                    break;
                case "list":
                    block.items.forEach(add);
                    break;
                case "callout":
                    add(block.title);
                    for (const part of pick(block.body, lang)) {
                        out.push(...(part.type === "p" ? [part.text] : part.items));
                    }
                    break;
                case "details":
                    add(block.title);
                    walk(block.body);
                    break;
                case "values":
                    add(block.title);
                    block.groups.forEach((group) => add(group.label));
                    break;
                case "table":
                    out.push(...pick(block.head, lang));
                    block.rows.forEach((row) => row.forEach(add));
                    break;
                case "params":
                    block.rows.forEach((row) => {
                        add(row.default);
                        add(row.description);
                    });
                    break;
                case "fields":
                    block.rows.forEach((row) => {
                        add(row.type);
                        add(row.description);
                    });
                    break;
                case "errors":
                    block.rows.forEach((row) => add(row.description));
                    break;
                case "related":
                    block.items.forEach((item) => {
                        out.push(`[x](ref:${item.to})`);
                        add(item.description);
                    });
                    break;
                case "split":
                    walk(block[lang]);
                    break;
            }
        }
    };
    add(page.lead);
    if (page.release) add(page.release.summary);
    for (const section of page.sections) {
        if (section.only && section.only !== lang) continue;
        if (section.title) add(section.title);
        walk(section.blocks);
    }
    return out;
}

/**
 * Lists the link targets of inline markup (ref:, fragment and web targets).
 *
 * @param text - Inline markup
 * @returns The targets of its links, nested ones included
 */
export function linkTargets(text: Inline): string[] {
    const visit = (nodes: InlineNode[]): string[] =>
        nodes.flatMap((node) => {
            if (node.type === "link") return [node.target, ...visit(node.children)];
            if (node.type === "strong" || node.type === "em") return visit(node.children);
            return [];
        });
    return visit(parseInline(text));
}

/**
 * Checks the internal links of the published pages: a ref: target names a page of its version
 * and an id of that page in the same language, a "#id" target an id of the page itself. Links
 * into a version that is not published yet are counted, not checked.
 *
 * @param entries - Pages of every published version
 * @param nav - Navigation index of those pages
 * @returns The problems, and the number of links into unpublished versions
 */
export function checkLinks(
    entries: readonly PageEntry[],
    nav: Nav,
): { problems: Problem[]; skipped: number } {
    const problems: Problem[] = [];
    const ids = new Map<string, Set<string>>();
    const idsOf = (version: Version, id: string, lang: Lang): Set<string> => {
        const key = `${version}/${id}/${lang}`;
        let found = ids.get(key);
        if (!found) {
            const page = entries.find((entry) => entry.version === version && entry.id === id);
            found = new Set(page ? pageAnchors(page.page, lang).ids : []);
            ids.set(key, found);
        }
        return found;
    };
    let skipped = 0;
    for (const entry of entries) {
        for (const lang of LANGS) {
            const where = `${entry.version}/${entry.id} (${lang})`;
            for (const target of inlineLeaves(entry.page, lang).flatMap(linkTargets)) {
                if (target.startsWith("#")) {
                    if (!idsOf(entry.version, entry.id, lang).has(target.slice(1))) {
                        problems.push({ where, rule: "link", message: `no id ${target}` });
                    }
                    continue;
                }
                if (!target.startsWith("ref:")) continue;
                const ref = refTarget(target);
                if (!ref) {
                    problems.push({ where, rule: "link", message: `malformed ${target}` });
                    continue;
                }
                if (ref.slug === "") continue;
                const version = ref.version ?? entry.version;
                if (Object.keys(nav[version]).length === 0) {
                    skipped += 1;
                    continue;
                }
                if (!hasPage(nav, version, ref.slug)) {
                    problems.push({ where, rule: "link", message: `no page ${target}` });
                } else if (ref.section && !idsOf(version, ref.slug, lang).has(ref.section)) {
                    problems.push({ where, rule: "link", message: `no id in ${target}` });
                }
            }
        }
    }
    return { problems, skipped };
}

/**
 * Checks that a page exists in both languages: non-empty titles, and no Loc leaf empty in one
 * language only (the title of a one-language section is empty in the other by design).
 *
 * @param page - Page whose titles and Loc leaves are checked
 * @returns A sentence per problem
 */
export function languageProblems(page: Page): string[] {
    const out: string[] = [];
    if (!page.title.en.trim() || !page.title.fr.trim()) out.push("empty title");
    const walk = (value: unknown, path: string) => {
        if (Array.isArray(value)) value.forEach((item, i) => walk(item, `${path}[${i}]`));
        else if (value !== null && typeof value === "object") {
            if (isLoc(value as Lx<unknown>)) {
                const { en, fr } = value as { en: unknown; fr: unknown };
                if (typeof en === "string" && typeof fr === "string" && !en !== !fr) {
                    out.push(`${path} is empty in ${en ? "fr" : "en"}`);
                }
            }
            for (const [key, child] of Object.entries(value)) walk(child, `${path}.${key}`);
        }
    };
    page.sections.forEach((section, i) => {
        const where = `sections[${i}]`;
        if (section.title && !section.only) walk(section.title, `${where}.title`);
        if (section.title && section.only && !section.title[section.only].trim()) {
            out.push(`${where}.title is empty in ${section.only}`);
        }
        walk(section.blocks, `${where}.blocks`);
    });
    walk(page.lead, "lead");
    walk(page.release, "release");
    return out;
}

/**
 * Checks the published pages against the catalogue, the navigation and the reviewed shared prose
 * list; each problem carries the name of the rule it breaks.
 *
 * @param entries - Pages of every published version
 * @param nav - Navigation index built from them
 * @param identical - Reviewed shared prose leaves per "vN/<page id>"
 * @returns The problems, the warnings (stale allow-list entries) and the counted skipped links
 */
export function checkPages(
    entries: readonly PageEntry[],
    nav: Nav,
    identical: Identical,
): { problems: Problem[]; warnings: Problem[]; skipped: number } {
    const problems: Problem[] = [];
    const warnings: Problem[] = [];
    const fail = (where: string, rule: string, message: string) =>
        problems.push({ where, rule, message });
    const published = ALL_VERSIONS.filter((version) => Object.keys(nav[version]).length > 0);

    for (const entry of entries) {
        const where = `${entry.version}/${entry.id}`;
        for (const message of languageProblems(entry.page)) fail(where, "languages", message);
        if (entry.page.status !== undefined && !PAGE_STATUSES.includes(entry.page.status)) {
            fail(where, "status", `${String(entry.page.status)} is not a page status`);
        }
        if (entry.page.updated !== undefined && !DATE.test(entry.page.updated)) {
            fail(where, "updated", `${entry.page.updated} is not YYYY-MM-DD`);
        }
        const parent = entry.id.includes("/") ? entry.id.slice(0, entry.id.lastIndexOf("/")) : "";
        if (parent && !hasPage(nav, entry.version, parent)) {
            fail(where, "parent", `no parent page ${parent}`);
        }
        const shared = sharedProse(entry.page);
        const allowed = identical[where] ?? [];
        for (const leaf of shared) {
            if (!allowed.includes(leaf)) {
                fail(where, "untranslated", `written once for both languages: ${leaf}`);
            }
        }
        for (const leaf of allowed) {
            if (!shared.includes(leaf)) {
                warnings.push({ where, rule: "identical", message: `stale entry: ${leaf}` });
            }
        }
    }

    for (const version of published) {
        const ids = Object.keys(nav[version]);
        if (!ids.includes("index")) fail(version, "index", "no version home (index)");
        const placed = new Set([...pageOrder(nav, version), ...releasePages(nav, version)]);
        for (const id of ids) {
            const entry = catalogueEntry(id);
            if (!placed.has(id) && !(entry && !isListed(entry, version))) {
                fail(`${version}/${id}`, "navigation", "reachable from no sidebar group");
            }
        }
    }

    const rank = (version: Version) => ALL_VERSIONS.indexOf(version);
    for (const entry of CATALOGUE) {
        for (const version of published) {
            const present = hasPage(nav, version, entry.slug);
            if (rank(version) >= rank(entry.since) && !present) {
                fail(`${version}/${entry.slug}`, "catalogue", `missing (since ${entry.since})`);
            }
            if (rank(version) < rank(entry.since) && present) {
                fail(`${version}/${entry.slug}`, "catalogue", `exists before since ${entry.since}`);
            }
        }
        for (const version of [...(entry.unlisted ?? []), entry.deprecated ?? entry.since]) {
            if (rank(version) < rank(entry.since)) {
                fail(entry.slug, "catalogue", `${version} is older than since ${entry.since}`);
            }
        }
    }

    if (published.includes(LATEST)) {
        if (CATEGORIES.length !== LATEST_COUNTS.length) {
            fail(
                LATEST,
                "counts",
                `${CATEGORIES.length} categories, expected ${LATEST_COUNTS.length}`,
            );
        }
        CATEGORIES.forEach((category, i) => {
            const listed = CATALOGUE.filter(
                (entry) =>
                    entry.category === category.id &&
                    hasPage(nav, LATEST, entry.slug) &&
                    isListed(entry, LATEST),
            ).length;
            if (listed !== LATEST_COUNTS[i]) {
                fail(
                    LATEST,
                    "counts",
                    `${category.id}: ${listed} entries, expected ${LATEST_COUNTS[i]}`,
                );
            }
        });
    }

    const links = checkLinks(entries, nav);
    return { problems: [...problems, ...links.problems], warnings, skipped: links.skipped };
}

/**
 * Reads the reviewed shared prose list.
 *
 * @param root - Repository root
 * @returns The list per page key; empty when the file does not exist
 */
export function readIdentical(root: string): Identical {
    const file = join(root, IDENTICAL_FILE);
    return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as Identical) : {};
}

/**
 * Writes a file through a temporary sibling and a rename, only when its content changed, so a
 * reader (next dev, a parallel check) never sees a half-written module.
 *
 * @param file - Absolute path
 * @param content - Full text the file must hold
 * @returns True when the file was written
 */
export function writeAtomic(file: string, content: string): boolean {
    if (existsSync(file) && readFileSync(file, "utf8") === content) return false;
    const temporary = `${file}.${pid}.tmp`;
    writeFileSync(temporary, content);
    renameSync(temporary, file);
    return true;
}

/**
 * Lists the temporary files that an interrupted run left next to the generated modules; they
 * are reported, never removed.
 *
 * @param root - Repository root
 * @returns Paths relative to the root
 */
function strayFiles(root: string): string[] {
    return [NAV_FILE, KINDS_FILE, REGISTRY_FILE].flatMap((file) => {
        const dir = join(root, file, "..");
        const base = file.split("/").pop() ?? "";
        if (!existsSync(dir)) return [];
        return readdirSync(dir)
            .filter((name) => name.startsWith(`${base}.`) && name.endsWith(".tmp"))
            .map((name) => relative(root, join(dir, name)));
    });
}

/**
 * Prints problems one per line, "where rule message".
 *
 * @param list - Problems to print
 * @param stream - Output, stderr for problems and stdout for warnings
 */
function report(list: readonly Problem[], stream: (line: string) => void): void {
    for (const problem of list) stream(`${problem.where} ${problem.rule} ${problem.message}`);
}

/**
 * Generates src/data/nav.ts, src/data/kinds.ts and src/data/pages/registry.ts from the published
 * page modules, or with --check verifies that they are fresh and runs the content checks.
 *
 * @param args - "--check" and "--root <dir>"; any other argument is refused
 * @returns The exit status: 0, or 1 on any problem
 */
export async function main(args: readonly string[]): Promise<number> {
    const option = (flag: string) => {
        const at = args.indexOf(flag);
        return at >= 0 && args[at + 1] && !args[at + 1].startsWith("--") ? args[at + 1] : undefined;
    };
    const known = (arg: string, i: number) =>
        arg === "--check" ||
        (arg === "--root" && option("--root") !== undefined) ||
        (args[i - 1] === "--root" && !arg.startsWith("--"));
    const unknown = args.filter((arg, i) => !known(arg, i));
    if (unknown.length) {
        console.error(`pages: unknown argument ${unknown.join(" ")}`);
        return 1;
    }
    const root = option("--root") ?? cwd();
    const check = args.includes("--check");
    const versions = listVersions(root);

    const entries: PageEntry[] = [];
    const fatal: Problem[] = [];
    for (const version of versions) {
        const loaded = await loadVersion(root, version);
        entries.push(...loaded.entries);
        fatal.push(...loaded.problems);
    }
    if (fatal.length) {
        report(fatal, console.error);
        console.error(`pages: ${fatal.length} problems in the page modules, nothing written`);
        return 1;
    }

    const nav = buildNav(entries);
    const outputs: [string, string][] = [
        [NAV_FILE, await formatSource(navSource(nav, readRelease(root)), join(root, NAV_FILE))],
        [KINDS_FILE, await formatSource(kindsSource(nav), join(root, KINDS_FILE))],
        [REGISTRY_FILE, await formatSource(registrySource(entries), join(root, REGISTRY_FILE))],
    ];
    const counts = versions
        .map((version) => `${version} ${Object.keys(nav[version]).length}`)
        .join(", ");
    for (const stray of strayFiles(root))
        console.log(`stale temporary file (left in place): ${stray}`);

    if (!check) {
        const written = outputs.filter(([file, text]) => writeAtomic(join(root, file), text));
        const state = written.length
            ? `written: ${written.map(([file]) => file).join(", ")}`
            : "unchanged";
        console.log(`pages: ${counts || "no published version"}; ${state}`);
        return 0;
    }

    const problems: Problem[] = [];
    for (const [file, text] of outputs) {
        const path = join(root, file);
        if (!existsSync(path))
            problems.push({ where: file, rule: "fresh", message: "missing, run npm run gen" });
        else if (readFileSync(path, "utf8") !== text) {
            problems.push({ where: file, rule: "fresh", message: "stale, run npm run gen" });
        }
    }
    const result = checkPages(entries, nav, readIdentical(root));
    problems.push(...result.problems);
    report(result.warnings, console.log);
    report(problems, console.error);
    console.log(
        `pages: ${counts || "no published version"}; ${result.skipped} links into unpublished versions not checked; ${problems.length} problems`,
    );
    return problems.length ? 1 : 0;
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
    exit(await main(argv.slice(2)));
}
