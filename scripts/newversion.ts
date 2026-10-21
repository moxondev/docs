import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { argv, cwd, exit } from "node:process";
import { pathToFileURL } from "node:url";

import { format, resolveConfig } from "prettier";

import { type Identical, IDENTICAL_FILE, PAGES_DIR, readIdentical, writeAtomic } from "./pages";

export interface PlannedFile {
    path: string;
    text: string;
    replacements: number;
}

export interface Plan {
    from: string;
    to: string;
    files: PlannedFile[];
    skipped: string[];
    identical: string[];
}

export interface Planned {
    plan: Plan | null;
    problems: string[];
}

// A version id: the letter v and a positive number without leading zero
const VERSION = /^v([1-9][0-9]*)$/;

/**
 * Builds the pattern of the three spellings of a version that a page module holds: a path segment,
 * a ref: target with an explicit version and the version field of the page itself. Prose such as
 * "in v6" is not matched, so the text of a page keeps saying what it said.
 *
 * @param version - Version whose spellings are searched, for example "v6"
 * @returns A global pattern with one alternative per spelling
 */
function spellings(version: string): RegExp {
    return new RegExp(`/${version}(?![0-9A-Za-z])|ref:${version}(?=/)|version: "${version}"`, "g");
}

/**
 * Tells the number of a version id.
 *
 * @param value - Command line argument, for example "v7"
 * @returns The number (7), or null when the argument is not a version id
 */
export function versionNumber(value: string): number | null {
    const match = VERSION.exec(value);
    return match ? Number(match[1]) : null;
}

/**
 * Rewrites every link of a page module from one version to the next one: /v6/ becomes /v7/, a
 * ref:v6/ target becomes ref:v7/ and the field version: "v6" becomes version: "v7".
 *
 * @param text - Source of a page module
 * @param from - Version of the source, for example "v6"
 * @param to - Version of the copy, for example "v7"
 * @returns The new source and the number of replacements made
 */
export function rewriteLinks(
    text: string,
    from: string,
    to: string,
): { text: string; replacements: number } {
    let replacements = 0;
    const rewritten = text.replace(spellings(from), (match) => {
        replacements += 1;
        return match.replace(from, to);
    });
    return { text: rewritten, replacements };
}

/**
 * Lists the files of a folder, subfolders included.
 *
 * @param dir - Folder to walk
 * @returns Paths relative to the folder with "/" separators, sorted
 */
function listFiles(dir: string): string[] {
    const out: string[] = [];
    const walk = (folder: string) => {
        for (const name of readdirSync(folder).sort()) {
            const path = join(folder, name);
            if (statSync(path).isDirectory()) walk(path);
            else out.push(relative(dir, path).split(sep).join("/"));
        }
    };
    walk(dir);
    return out;
}

/**
 * Lists the reviewed shared prose entries of scripts/identical.json that the copy needs, under the
 * key of the new version. The guard of pages.ts refuses a prose leaf written once for both
 * languages that is not listed, so a copy without them fails npm run check.
 *
 * @param identical - Content of scripts/identical.json
 * @param from - Version of the source, for example "v6"
 * @param to - Version of the copy, for example "v7"
 * @returns The keys to add ("v7/hash"), in the order of the file, without those already there
 */
export function identicalKeys(identical: Identical, from: string, to: string): string[] {
    return Object.keys(identical)
        .filter((key) => key.startsWith(`${from}/`))
        .map((key) => `${to}/${key.slice(from.length + 1)}`)
        .filter((key) => !Object.hasOwn(identical, key));
}

/**
 * Reads the folder of a version and prepares its copy for the next one, without writing anything.
 * An existing destination is refused: an existing version is never overwritten, not even partly.
 *
 * @param root - Repository root, the folder that holds src/data/pages
 * @param from - Version to copy, for example "v6"
 * @param to - Version to create, for example "v7"
 * @returns The plan, or null with the reasons why there is none
 */
export function planCopy(root: string, from: string, to: string): Planned {
    const problems: string[] = [];
    if (versionNumber(from) === null) problems.push(`${from} is not a version id (v1, v2, ...)`);
    if (versionNumber(to) === null) problems.push(`${to} is not a version id (v1, v2, ...)`);
    if (from === to) problems.push("the new version must differ from the one it is copied from");
    if (problems.length) return { plan: null, problems };

    const source = join(root, PAGES_DIR, from);
    const target = join(root, PAGES_DIR, to);
    if (!existsSync(source) || !statSync(source).isDirectory()) {
        problems.push(`${PAGES_DIR}/${from} does not exist, nothing to copy`);
    }
    if (existsSync(target)) {
        problems.push(`${PAGES_DIR}/${to} already exists and is never overwritten`);
    }
    if (problems.length) return { plan: null, problems };

    const files: PlannedFile[] = [];
    const skipped: string[] = [];
    for (const path of listFiles(source)) {
        if (!path.endsWith(".ts") || /\.(test|d)\.ts$/.test(path)) {
            skipped.push(path);
            continue;
        }
        const rewritten = rewriteLinks(readFileSync(join(source, path), "utf8"), from, to);
        files.push({ path, text: rewritten.text, replacements: rewritten.replacements });
    }
    const identical = identicalKeys(readIdentical(root), from, to);
    return { plan: { from, to, files, skipped, identical }, problems };
}

/**
 * Formats the content of scripts/identical.json with the Prettier configuration of the project,
 * so that npm run check accepts the file as it is written.
 *
 * @param root - Repository root
 * @param identical - Content to write
 * @returns The text to write, as Prettier prints it for that file
 */
async function identicalSource(root: string, identical: Identical): Promise<string> {
    const file = join(root, IDENTICAL_FILE);
    const options = (await resolveConfig(file)) ?? {};
    return format(JSON.stringify(identical), { ...options, filepath: file });
}

/**
 * Writes the copy of the version: one new file per module, each created with the "wx" flag so
 * that a file that appeared since the plan was made is an error, never an overwrite, then the
 * new entries of scripts/identical.json (the only existing file that is edited, additions only).
 *
 * @param root - Repository root
 * @param plan - Plan returned by planCopy
 * @returns The number of module files written
 */
export async function writeCopy(root: string, plan: Plan): Promise<number> {
    for (const file of plan.files) {
        const path = join(root, PAGES_DIR, plan.to, file.path);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, file.text, { flag: "wx" });
    }
    if (plan.identical.length) {
        const identical = readIdentical(root);
        const added: Identical = {};
        for (const key of plan.identical) {
            added[key] = identical[`${plan.from}/${key.slice(plan.to.length + 1)}`];
        }
        const merged = { ...identical, ...added };
        const sorted = Object.fromEntries(
            Object.entries(merged).sort(([a], [b]) => (a < b ? -1 : 1)),
        );
        writeAtomic(join(root, IDENTICAL_FILE), await identicalSource(root, sorted));
    }
    return plan.files.length;
}

/**
 * Lists what the script does not do: the places that name the versions one by one and the pages
 * that need an editor, in the order to work through them.
 *
 * @param from - Version that was copied, for example "v6"
 * @param to - Version that was created, for example "v7"
 * @returns One sentence per step, ready to print
 */
export function manualSteps(from: string, to: string): string[] {
    const major = String(versionNumber(to));
    return [
        `src/types/content.ts: add "${to}" to the Version type.`,
        `src/lib/routes.ts (KNOWN), src/lib/inline.ts (VERSIONS) and scripts/pages.ts (ALL_VERSIONS): add ${to}; src/lib/search.ts (the /^\\/v[1-6]/ prefix of normalizeRoute) and scripts/links.ts (the isDocRoute pattern) also list the versions in a pattern, so widen both to ${to}.`,
        `src/data/versions.ts: add ${to} first as "latest" and demote ${from} to "previous" and the older versions by what the API still serves (the status, served, playground and changelog fields).`,
        `src/data/pages/${to}/changelog.ts and releases.ts: replace the copied release pages by the release ${major}.0.0, whose ids, titles and GitHub links are still those of ${from}.`,
        `src/data/pages/${to}: reread the copied prose ("in ${from}", the "What changed" table of the version home, the callouts that name a version) and bump the updated date of every page you edit.`,
        `src/data/catalogue.ts: set since: "${to}" on a new endpoint, and deprecated or unlisted on one that leaves (an entry unlisted in ${from} is listed again in ${to} by the copy unless you add ${to} to its unlisted versions or drop its page); then update LATEST_COUNTS in scripts/pages.ts and the totals pinned by src/components/home/__tests__/model.test.ts and home.test.ts when the listed counts of a category change.`,
        `package.json: raise "version" to ${major}.0.0 (it is read by npm run gen into src/data/nav.ts).`,
        "npm run format, npm run gen, then npm run check, npm run build and npm run weight; the legacy redirect list (src/lib/oldUrls.json) stays as it is.",
        "Release: see guides/RELEASE.md.",
    ];
}

/**
 * Creates the page modules of a new documentation version from the folder of another one: the
 * files are copied with the links rewritten, the shared prose entries are carried over, and the
 * edits that stay manual are printed.
 *
 * @param args - "<new> [<from>]" (for example "v7 v6"; "<from>" defaults to the version just
 *   before "<new>"), "--dry-run" to print the plan and write nothing, and "--root <dir>" for the
 *   repository root (the working directory by default)
 * @returns The exit status: 1 on a refused plan, an unknown argument or a failed write
 */
export async function main(args: readonly string[]): Promise<number> {
    const at = args.indexOf("--root");
    const given = at >= 0 ? args[at + 1] : undefined;
    const misplaced = at >= 0 && (!given || given.startsWith("--"));
    const root = given && !misplaced ? given : cwd();
    const rest = args.filter(
        (arg, i) => arg !== "--root" && (misplaced || args[i - 1] !== "--root"),
    );
    const unknown = rest.filter((arg) => arg.startsWith("--") && arg !== "--dry-run");
    const positional = rest.filter((arg) => !arg.startsWith("--"));
    if (misplaced) console.error("newversion: --root needs a folder");
    if (unknown.length) console.error(`newversion: unknown argument ${unknown.join(" ")}`);
    if (misplaced || unknown.length || positional.length < 1 || positional.length > 2) {
        console.error(
            "usage: npx tsx scripts/newversion.ts <new> [<from>] [--dry-run] [--root <dir>]",
        );
        return 1;
    }
    const dryRun = rest.includes("--dry-run");
    const to = positional[0];
    const number = versionNumber(to);
    const from = positional[1] ?? (number === null ? "" : `v${number - 1}`);

    const { plan, problems } = planCopy(root, from, to);
    if (!plan) {
        for (const problem of problems) console.error(`newversion: ${problem}`);
        return 1;
    }
    const links = plan.files.reduce((sum, file) => sum + file.replacements, 0);
    console.log(
        `newversion: ${from} -> ${to}: ${plan.files.length} modules, ${links} links rewritten, ${plan.identical.length} shared prose entries`,
    );
    for (const path of plan.skipped) console.log(`newversion: not copied: ${path}`);

    if (dryRun) {
        for (const file of plan.files) {
            console.log(`newversion: would write ${PAGES_DIR}/${to}/${file.path}`);
        }
        console.log("newversion: dry run, nothing written");
    } else {
        try {
            const written = await writeCopy(root, plan);
            console.log(`newversion: ${written} files written under ${PAGES_DIR}/${to}`);
        } catch (error) {
            console.error(`newversion: ${error instanceof Error ? error.message : error}`);
            return 1;
        }
    }
    console.log("newversion: remaining manual steps");
    manualSteps(from, to).forEach((step, i) => console.log(`  ${i + 1}. ${step}`));
    return 0;
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
    exit(await main(argv.slice(2)));
}
