import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { argv, cwd, exit } from "node:process";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

import { NAV } from "@/data/nav";
import { PAGES } from "@/data/pages/registry";
import { type MarkdownLabels, pageMarkdown } from "@/lib/markdown";
import { buildDocs, indexFile } from "@/lib/search";
import type { Lang, Page, Version } from "@/types/content";

import { ALL_VERSIONS, writeAtomic } from "./pages";

export interface PublicFile {
    file: string;
    text: string;
}

export interface IndexSize {
    file: string;
    docs: number;
    raw: number;
    gzip: number;
}

export type Tree = { [key: string]: string | Tree };

/**
 * Folders written by this script (git-ignored): the search index files and the Markdown exports
 * of the "Copy as Markdown" button.
 */
export const SEARCH_DIR = "public/search";
export const MD_DIR = "public/md";

// Largest search index file after gzip, checked on every file
export const SEARCH_BUDGET = 100 * 1024;

/**
 * Message of each word of the Markdown export; UI text only lives in messages/, so a missing key
 * skips the exports instead of printing a made-up word.
 */
export const LABEL_KEYS: Readonly<Record<keyof MarkdownLabels, string>> = {
    parameter: "endpoint.columns.parameter",
    required: "endpoint.columns.required",
    default: "endpoint.columns.default",
    description: "endpoint.columns.description",
    field: "endpoint.columns.field",
    type: "endpoint.columns.type",
    errorMessage: "endpoint.columns.errorMessage",
    error: "endpoint.columns.error",
    status: "endpoint.columns.status",
    yes: "endpoint.answers.yes",
    no: "endpoint.answers.no",
    conditional: "endpoint.answers.conditional",
    plan: "pricing.columns.plan",
    price: "pricing.columns.price",
    hour: "pricing.columns.hour",
    day: "pricing.columns.day",
    week: "pricing.columns.week",
    month: "pricing.columns.month",
    burst: "pricing.columns.burst",
    free: "pricing.free",
    perMonth: "pricing.perMonth",
    arrow: "aria.arrow",
};

const LANGS: readonly Lang[] = ["en", "fr"];

/**
 * Reads one namespace of a locale straight from messages/<locale>/<namespace>.json (next-intl's
 * request configuration cannot load outside Next).
 *
 * @param root - Folder that holds messages/
 * @param lang - Locale folder
 * @param namespace - File name without extension, for example "meta"
 * @returns The messages of the namespace, empty when the file does not exist
 */
export function readNamespace(root: string, lang: Lang, namespace: string): Tree {
    const file = join(root, "messages", lang, `${namespace}.json`);
    return existsSync(file) ? (JSON.parse(readFileSync(file, "utf8")) as Tree) : {};
}

/**
 * Reads one message of a locale by its dotted path ("aria.arrow").
 *
 * @param root - Folder that holds messages/
 * @param lang - Locale folder
 * @param path - Namespace, then the keys, joined with dots
 * @returns The message, or undefined when the file or the key does not exist
 */
export function message(root: string, lang: Lang, path: string): string | undefined {
    const [namespace, ...keys] = path.split(".");
    let node: string | Tree | undefined = readNamespace(root, lang, namespace);
    for (const key of keys) {
        node = typeof node === "object" && Object.hasOwn(node, key) ? node[key] : undefined;
    }
    return typeof node === "string" ? node : undefined;
}

/**
 * Builds the words of the Markdown export of a language from the messages.
 *
 * @param root - Folder that holds messages/
 * @param lang - Language of the export
 * @returns The labels, or the dotted paths of the missing messages
 */
export function markdownLabels(
    root: string,
    lang: Lang,
): { labels?: MarkdownLabels; missing: string[] } {
    const labels: Partial<MarkdownLabels> = {};
    const missing: string[] = [];
    for (const [field, path] of Object.entries(LABEL_KEYS) as [keyof MarkdownLabels, string][]) {
        const value = message(root, lang, path);
        if (value === undefined) missing.push(path);
        else labels[field] = value;
    }
    return missing.length ? { missing } : { labels: labels as MarkdownLabels, missing };
}

/**
 * Builds the search index files of the published versions (both languages each), with their
 * sizes: the documents of lib/search.ts as compact JSON.
 *
 * @param pages - Pages of each published version
 * @param root - Folder that holds messages/ (for the word read after the arrow icon)
 * @returns The files, relative to public/search, and their sizes in bytes
 */
export function searchFiles(
    pages: ReadonlyMap<Version, Page[]>,
    root: string,
): { files: PublicFile[]; sizes: IndexSize[] } {
    const files: PublicFile[] = [];
    const sizes: IndexSize[] = [];
    for (const [version, list] of pages) {
        for (const lang of LANGS) {
            const arrow = message(root, lang, LABEL_KEYS.arrow);
            const icons = arrow ? { "arrow-right": arrow } : undefined;
            const docs = buildDocs(list, lang, { nav: NAV, icons });
            const text = JSON.stringify(docs);
            const file = indexFile(version, lang);
            files.push({ file, text });
            sizes.push({
                file,
                docs: docs.length,
                raw: Buffer.byteLength(text),
                gzip: gzipSync(text, { level: 9 }).length,
            });
        }
    }
    return { files, sizes };
}

/**
 * Builds the Markdown exports of the published versions, one file per page and language at
 * <version>/<lang>/<page id>.md (the version home is index.md).
 *
 * @param pages - Pages of each published version
 * @param labels - Words of the export per language
 * @returns The files, relative to public/md
 */
export function markdownFiles(
    pages: ReadonlyMap<Version, Page[]>,
    labels: Readonly<Record<Lang, MarkdownLabels>>,
): PublicFile[] {
    const files: PublicFile[] = [];
    for (const [version, list] of pages) {
        for (const lang of LANGS) {
            for (const page of list) {
                files.push({
                    file: `${version}/${lang}/${page.id}.md`,
                    text: pageMarkdown(page, lang, { labels: labels[lang], nav: NAV }),
                });
            }
        }
    }
    return files;
}

/**
 * Lists the files under a folder.
 *
 * @param dir - Folder to walk; a missing one gives nothing
 * @returns Paths relative to the folder, "/" separators
 */
function listFiles(dir: string): string[] {
    if (!existsSync(dir)) return [];
    const out: string[] = [];
    const walk = (folder: string) => {
        for (const name of readdirSync(folder)) {
            const path = join(folder, name);
            if (statSync(path).isDirectory()) walk(path);
            else out.push(relative(dir, path).split(sep).join("/"));
        }
    };
    walk(dir);
    return out.sort();
}

/**
 * Writes generated files under a folder, each only when its content changed, and lists the files
 * found there that this run did not produce; they are left in place.
 *
 * @param dir - Absolute output folder
 * @param files - Files relative to it
 * @returns How many files were written, and the stale ones
 */
function writeAll(dir: string, files: readonly PublicFile[]): { written: number; stale: string[] } {
    let written = 0;
    for (const { file, text } of files) {
        const path = join(dir, file);
        mkdirSync(dirname(path), { recursive: true });
        if (writeAtomic(path, text)) written += 1;
    }
    const produced = new Set(files.map(({ file }) => file));
    return { written, stale: listFiles(dir).filter((file) => !produced.has(file)) };
}

/**
 * Formats a byte count in kB with one decimal.
 *
 * @param bytes - Byte count, converted at 1024 bytes per kB
 * @returns For example "41.2 kB"
 */
function kilobytes(bytes: number): string {
    return `${(bytes / 1024).toFixed(1)} kB`;
}

/**
 * Writes public/search/<version><lang>.json for every published version and language, measured
 * against the gzip budget, and public/md/<version>/<lang>/<id>.md when the export words exist in
 * messages/.
 *
 * @param args - "--root <dir>" (output root) and "--messages <dir>" (folder holding messages/)
 * @returns The exit status: 1 when an index file is over budget, else 0
 */
export async function main(args: readonly string[]): Promise<number> {
    const option = (flag: string) => {
        const at = args.indexOf(flag);
        return at >= 0 && args[at + 1] ? args[at + 1] : undefined;
    };
    const root = option("--root") ?? cwd();
    const messagesRoot = option("--messages") ?? cwd();

    const pages = new Map<Version, Page[]>();
    for (const version of ALL_VERSIONS) {
        const loaders = Object.values(PAGES[version]);
        if (loaders.length) pages.set(version, await Promise.all(loaders.map((load) => load())));
    }

    const search = searchFiles(pages, messagesRoot);
    const written = writeAll(join(root, SEARCH_DIR), search.files);
    let over = 0;
    for (const size of search.sizes) {
        const flag = size.gzip > SEARCH_BUDGET ? "OVER BUDGET" : "ok";
        if (size.gzip > SEARCH_BUDGET) over += 1;
        console.log(
            `search ${size.file}: ${size.docs} documents, ${kilobytes(size.raw)}, ${kilobytes(size.gzip)} gzip (budget ${kilobytes(SEARCH_BUDGET)}) ${flag}`,
        );
    }
    for (const file of written.stale) console.log(`stale (left in place): ${SEARCH_DIR}/${file}`);

    const en = markdownLabels(messagesRoot, "en");
    const fr = markdownLabels(messagesRoot, "fr");
    let summary: string;
    if (en.labels && fr.labels) {
        const files = markdownFiles(pages, { en: en.labels, fr: fr.labels });
        const md = writeAll(join(root, MD_DIR), files);
        for (const file of md.stale) console.log(`stale (left in place): ${MD_DIR}/${file}`);
        summary = `${files.length} Markdown exports (${md.written} written)`;
    } else {
        const missing = [...new Set([...en.missing, ...fr.missing])];
        summary = `Markdown exports skipped: ${missing.length} messages missing (${missing.join(", ")})`;
    }
    console.log(
        `public: ${search.files.length} search files (${written.written} written), ${summary}`,
    );
    return over ? 1 : 0;
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
    exit(await main(argv.slice(2)));
}
