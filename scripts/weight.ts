import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { argv, cwd, exit } from "node:process";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

import { OUT_DIR } from "./redirects";

export interface FirstLoad {
    scripts: number;
    preloaded: number;
    total: number;
}

export interface WeightReport {
    pages: number;
    worstScripts: { page: string; load: FirstLoad } | null;
    worstTotal: { page: string; load: FirstLoad } | null;
    groups: Map<string, { page: string; count: number; load: FirstLoad }>;
    problems: string[];
}

// Alarm of the first load, in kB of gzip: the script tags of a page
export const SCRIPTS_MAX = 250;

// Alarm of the first load, in kB of gzip: the script tags plus the script chunks the page preloads
export const TOTAL_MAX = 258;

const SCRIPT_SRC = /<script\b[^>]*\ssrc="([^"]+)"/g;

// Link tags, whose rel and as attributes tell a script preload
const LINK_TAG = /<link\b[^>]*>/g;

const HREF = /\shref="([^"]+)"/;

/**
 * Lists the scripts a page downloads before it is usable: the script tags and, apart from them,
 * the script chunks announced by a preload link. Order follows the page, duplicates are dropped.
 *
 * @param html - HTML text of an exported page
 * @returns The script URLs of the tags and the URLs of the extra preloaded chunks
 */
export function scriptsOf(html: string): { tags: string[]; preloads: string[] } {
    const tags = [...new Set([...html.matchAll(SCRIPT_SRC)].map((match) => match[1]))];
    const preloads: string[] = [];
    for (const [tag] of html.matchAll(LINK_TAG)) {
        if (!/\sas="script"/.test(tag)) continue;
        const href = HREF.exec(tag)?.[1];
        if (href && !tags.includes(href) && !preloads.includes(href)) preloads.push(href);
    }
    return { tags, preloads };
}

/**
 * Measures the first load of a page in kB of gzip (level 9): the script tags, the preloaded
 * chunks and their sum.
 *
 * @param html - HTML text of an exported page
 * @param gzipSize - Gzip size in bytes of a script URL (cached by the caller across pages)
 * @returns The three figures in kB of 1024 bytes
 */
export function firstLoad(html: string, gzipSize: (url: string) => number): FirstLoad {
    const { tags, preloads } = scriptsOf(html);
    const sum = (urls: string[]) => urls.reduce((total, url) => total + gzipSize(url), 0) / 1024;
    const scripts = sum(tags);
    const preloaded = sum(preloads);
    return { scripts, preloaded, total: scripts + preloaded };
}

/**
 * Tells whether a first load is over the alarms of the weight guard.
 *
 * @param load - First load of a page in kB of gzip
 * @returns The messages of the exceeded alarms, empty when the page is within both
 */
export function overruns(load: FirstLoad): string[] {
    const found: string[] = [];
    if (load.scripts > SCRIPTS_MAX) {
        found.push(`script tags ${load.scripts.toFixed(1)} kB over ${SCRIPTS_MAX} kB`);
    }
    if (load.total > TOTAL_MAX) {
        found.push(`with preloads ${load.total.toFixed(1)} kB over ${TOTAL_MAX} kB`);
    }
    return found;
}

/**
 * Lists the HTML pages of an export, redirect stubs included (they have no script and weigh
 * nothing), as paths relative to the export folder with forward slashes.
 *
 * @param out - Export folder
 * @returns The sorted paths of the .html files
 */
function htmlFiles(out: string): string[] {
    const files: string[] = [];
    const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
            const path = join(dir, name);
            if (statSync(path).isDirectory()) walk(path);
            else if (name.endsWith(".html")) files.push(relative(out, path).split(sep).join("/"));
        }
    };
    walk(out);
    return files.sort();
}

/**
 * Measures every page of an export against the alarms. Pages are grouped by identical figures so
 * that the report names one example per kind of page (Try page, home, 404 and so on).
 *
 * @param out - Export folder of the production build
 * @returns The page count, the heaviest pages, the groups of equal pages and the problems
 */
export function checkWeight(out: string): WeightReport {
    const sizes = new Map<string, number>();
    const gzipSize = (url: string) => {
        const known = sizes.get(url);
        if (known !== undefined) return known;
        const file = join(out, url.replace(/^\/+/, "").split("?")[0]);
        const size = existsSync(file) ? gzipSync(readFileSync(file), { level: 9 }).length : 0;
        sizes.set(url, size);
        return size;
    };
    const report: WeightReport = {
        pages: 0,
        worstScripts: null,
        worstTotal: null,
        groups: new Map(),
        problems: [],
    };
    for (const page of htmlFiles(out)) {
        const load = firstLoad(readFileSync(join(out, page), "utf8"), gzipSize);
        if (load.scripts === 0) continue;
        report.pages += 1;
        if (!report.worstScripts || load.scripts > report.worstScripts.load.scripts) {
            report.worstScripts = { page, load };
        }
        if (!report.worstTotal || load.total > report.worstTotal.load.total) {
            report.worstTotal = { page, load };
        }
        const key = `${load.scripts.toFixed(1)}/${load.total.toFixed(1)}`;
        const group = report.groups.get(key);
        if (group) group.count += 1;
        else report.groups.set(key, { page, count: 1, load });
        for (const message of overruns(load)) report.problems.push(`${page} ${message}`);
    }
    return report;
}

/**
 * Checks the first-load JavaScript of the static export against the gzip alarms, SCRIPTS_MAX for
 * the script tags and TOTAL_MAX with the preloaded chunks, after a build.
 *
 * @param args - "--dir <export folder>", "--root <repository root>" and "--list" to print one
 *   example page for every distinct pair of figures
 * @returns The exit status: 1 on any page over an alarm or when the export is missing
 */
export function main(args: readonly string[]): number {
    const option = (flag: string) => {
        const at = args.indexOf(flag);
        return at >= 0 && args[at + 1] && !args[at + 1].startsWith("--") ? args[at + 1] : undefined;
    };
    const out = option("--dir") ?? join(option("--root") ?? cwd(), OUT_DIR);
    if (!existsSync(out)) {
        console.error(`weight: ${out} does not exist, run npm run build first`);
        return 1;
    }
    const report = checkWeight(out);
    const show = (name: string, entry: WeightReport["worstScripts"]) => {
        if (entry) {
            console.log(
                `weight: ${name} ${entry.load.scripts.toFixed(1)} kB scripts, ${entry.load.total.toFixed(1)} kB with preloads (${entry.page})`,
            );
        }
    };
    if (args.includes("--list")) {
        for (const [key, group] of [...report.groups].sort()) {
            console.log(`weight: ${key} kB, ${group.count} pages, for example ${group.page}`);
        }
    }
    show("heaviest scripts", report.worstScripts);
    show("heaviest total", report.worstTotal);
    console.log(
        `weight: ${report.pages} pages, alarms ${SCRIPTS_MAX} kB scripts and ${TOTAL_MAX} kB with preloads, ${report.problems.length} problems`,
    );
    for (const problem of report.problems.slice(0, 50)) console.error(problem);
    if (report.problems.length > 50) console.error(`... and ${report.problems.length - 50} more`);
    return report.problems.length ? 1 : 0;
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
    exit(main(argv.slice(2)));
}
