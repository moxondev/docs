import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, posix } from "node:path";
import { argv, cwd, exit } from "node:process";
import { pathToFileURL } from "node:url";

import { type AbstractIntlMessages, createTranslator } from "next-intl";
import ts from "typescript";

import {
    CLIENT_NAMESPACES,
    CLIENT_PARENT,
    type ClientTree,
    MESSAGE_FILES,
    routing,
} from "../src/i18n/routing";

import type { Finding } from "./charter";

export type ArgKind = "plain" | "number" | "date" | "time" | "plural" | "select";

export interface IcuInfo {
    args: Map<string, ArgKind>;
    tags: Set<string>;
    errors: string[];
}

interface Cursor {
    text: string;
    pos: number;
    info: IcuInfo;
}

export interface MessageFile {
    locale: string;
    namespace: string;
    file: string;
    text: string;
}

export interface MessageSet {
    findings: Finding[];
    leaves: Map<string, Map<string, string>>;
    objects: Map<string, Set<string>>;
}

export interface Usage {
    file: string;
    line: number;
    namespace: string | null;
    key: string | null;
    prefix: string | null;
    method: string;
}

export interface SourceInfo {
    file: string;
    client: boolean;
    imports: string[];
    hooks: { namespace: string | null; line: number }[];
    usages: Usage[];
}

interface VisitContext {
    source: ts.SourceFile;
    info: SourceInfo;
    known: ReadonlySet<string>;
    scopes: Map<string, string | null | false>[];
}

/**
 * Decorative characters the charter bans from user-facing text, as inclusive code point ranges:
 * middle dot and bullets, arrows, technical symbols (the Cmd, Option and Enter key glyphs), box
 * drawing, shapes, check marks, stars, dingbats, supplemental arrows, variation selector, emoji.
 */
const GLYPH_RANGES: readonly (readonly [number, number])[] = [
    [0x00b7, 0x00b7],
    [0x2022, 0x2023],
    [0x2043, 0x2043],
    [0x2219, 0x2219],
    [0x2190, 0x21ff],
    [0x2300, 0x23ff],
    [0x2500, 0x27bf],
    [0x27f0, 0x27ff],
    [0x2900, 0x297f],
    [0x2b00, 0x2bff],
    [0xfe0f, 0xfe0f],
    [0x1f000, 0x1faff],
];

/**
 * The only non-ASCII characters a message may hold: no-break spaces, French quotes, Latin letters
 * with diacritics and ligatures (oe), the ellipsis, and the symbols that carry a value (degree,
 * plus-minus, times, euro, minus, almost equal, comparisons).
 */
const ALLOWED_RANGES: readonly (readonly [number, number])[] = [
    [0x00a0, 0x00a0],
    [0x00ab, 0x00ab],
    [0x00b0, 0x00b1],
    [0x00bb, 0x00bb],
    [0x00c0, 0x00ff],
    [0x0100, 0x017f],
    [0x2026, 0x2026],
    [0x202f, 0x202f],
    [0x20ac, 0x20ac],
    [0x2212, 0x2212],
    [0x2248, 0x2248],
    [0x2260, 0x2260],
    [0x2264, 0x2265],
];

// Characters with a dedicated hint, since each has an obvious ASCII or French replacement
const REPLACEMENTS = new Map<number, string>([
    [0x2018, "use a straight apostrophe"],
    [0x2019, "use a straight apostrophe"],
    [0x201c, "use French quotes in French, straight quotes in English"],
    [0x201d, "use French quotes in French, straight quotes in English"],
    [0x201e, "use French quotes in French, straight quotes in English"],
    [0x2013, "use an ASCII hyphen, a comma or a colon"],
    [0x2014, "use an ASCII hyphen, a comma or a colon"],
    [0x2039, "use an icon or an ASCII separator"],
    [0x203a, "use an icon or an ASCII separator"],
]);

// No-break spaces, which French punctuation does not use here (a plain space is written)
const NO_BREAK = new Set([0x00a0, 0x202f]);

// The French opening and closing quotes, as code points so that this file stays ASCII
const OPEN_QUOTE = 0x00ab;
const CLOSE_QUOTE = 0x00bb;

// Message keys: ASCII letters and digits, starting with a lowercase letter (a dot would split it)
const KEY = /^[a-z][A-Za-z0-9]*$/;

// Plural categories of CLDR, the only words allowed as plural selectors besides =N
const PLURAL_CATEGORIES = new Set(["zero", "one", "two", "few", "many", "other"]);

// Characters after which an apostrophe opens an ICU quote and silently disables the syntax
const QUOTED = new Set(["{", "}", "<", ">", "#", "|", "'"]);

// The functions of next-intl that return a translator bound to a namespace
const TRANSLATOR_FACTORIES = new Set(["useTranslations", "getTranslations"]);

// Methods of a translator whose first argument is a message key
const TRANSLATOR_METHODS = new Set(["rich", "markup", "raw", "has"]);

/**
 * Client tree that renders the client components of each source path; the longest matching prefix
 * wins and any other file of src/ belongs to the root tree (CLIENT_NAMESPACES).
 */
const TREE_OF: readonly (readonly [string, ClientTree])[] = [
    ["src/components/doc/", "page"],
    ["src/components/try/", "try"],
    ["src/components/try/Playground.tsx", "playground"],
    ["src/components/try/Picker.tsx", "playground"],
    ["src/components/search/", "search"],
    ["src/components/home/", "home"],
];

/**
 * Key prefixes read through a key built at run time (a status, a kind, an id) or handed over as a
 * whole; the --unused report counts them as used, with the template literal prefixes it finds.
 */
const DYNAMIC: readonly string[] = [
    "banner.legacy.",
    "banner.previous.",
    "banner.retired.",
    "banner.slim.",
    "common.keys.",
    "common.languageCodes.",
    "common.languages.",
    "common.tags.",
    "common.themes.",
    "endpoint.callouts.",
    "endpoint.code.",
    "endpoint.sections.",
    "meta.kinds.",
    "notfound.",
    "search.groups.",
    "search.kinds.",
    "shortcuts.items.",
    "shortcuts.scopes.",
    "snippet.languages.",
];

// Generated shadcn output holds no translation (declaration files are skipped by their extension)
const SKIPPED_SOURCES = ["src/components/ui/"];

/**
 * Formats a code point the way the Unicode charts print it.
 *
 * @param code - Code point
 * @returns The U+XXXX notation, at least four hexadecimal digits
 */
function hex(code: number): string {
    return `U+${code.toString(16).toUpperCase().padStart(4, "0")}`;
}

/**
 * Tells whether a code point falls in one of a list of inclusive ranges.
 *
 * @param code - Code point
 * @param ranges - Inclusive [first, last] pairs
 * @returns True when one range holds the code point
 */
function inRanges(code: number, ranges: readonly (readonly [number, number])[]): boolean {
    return ranges.some(([first, last]) => code >= first && code <= last);
}

/**
 * Records an ICU syntax error at the current position of the reader.
 *
 * @param cur - Reader state, whose info collects the error
 * @param why - What is wrong, without a trailing period
 */
function fail(cur: Cursor, why: string): void {
    cur.info.errors.push(`${why} (character ${cur.pos + 1})`);
}

/**
 * Moves the reader past white space.
 *
 * @param cur - Reader state, advanced in place
 */
function skipSpaces(cur: Cursor): void {
    while (cur.pos < cur.text.length && /\s/.test(cur.text[cur.pos])) cur.pos++;
}

/**
 * Reads an identifier (an argument name, a type, a select key) at the reader position.
 *
 * @param cur - Reader state, advanced past the identifier
 * @returns The identifier, or an empty string when none starts here
 */
function readName(cur: Cursor): string {
    const match = /^[A-Za-z_][A-Za-z0-9_]*/.exec(cur.text.slice(cur.pos));
    if (!match) return "";
    cur.pos += match[0].length;
    return match[0];
}

/**
 * Records an argument, keeping the most specific kind when a name appears twice.
 *
 * @param cur - Reader state, whose info collects the argument
 * @param name - Argument name as written between the braces
 * @param kind - How the message formats it
 */
function addArg(cur: Cursor, name: string, kind: ArgKind): void {
    const known = cur.info.args.get(name);
    if (!known || known === "plain") cur.info.args.set(name, kind);
}

/**
 * Moves the reader to just after the closing brace of the argument it is inside, so that one
 * malformed argument does not hide the errors that follow it.
 *
 * @param cur - Reader state, inside an argument, advanced in place
 */
function skipArgument(cur: Cursor): void {
    let depth = 1;
    while (cur.pos < cur.text.length && depth > 0) {
        if (cur.text[cur.pos] === "{") depth++;
        else if (cur.text[cur.pos] === "}") depth--;
        cur.pos++;
    }
}

/**
 * Reads the cases of a plural, selectordinal or select argument, up to its closing brace.
 *
 * @param cur - Reader state, just after the comma that follows the type, advanced in place
 * @param plural - True for plural and selectordinal, whose selectors are CLDR categories or =N
 * @param name - Argument name, quoted in the error messages
 */
function parseOptions(cur: Cursor, plural: boolean, name: string): void {
    const seen = new Set<string>();
    for (;;) {
        skipSpaces(cur);
        if (cur.pos >= cur.text.length) {
            fail(cur, `missing } after the cases of {${name}}`);
            return;
        }
        if (cur.text[cur.pos] === "}") {
            cur.pos++;
            break;
        }
        if (plural && cur.text.startsWith("offset:", cur.pos)) {
            cur.pos += "offset:".length;
            skipSpaces(cur);
            while (/\d/.test(cur.text[cur.pos] ?? "")) cur.pos++;
            continue;
        }
        const match = /^(?:=\d+|[A-Za-z_][A-Za-z0-9_]*)/.exec(cur.text.slice(cur.pos));
        if (!match) {
            fail(cur, `unreadable case in {${name}}`);
            skipArgument(cur);
            return;
        }
        const selector = match[0];
        cur.pos += selector.length;
        if (plural && !selector.startsWith("=") && !PLURAL_CATEGORIES.has(selector)) {
            fail(cur, `"${selector}" is not a plural category`);
        }
        if (seen.has(selector)) fail(cur, `case "${selector}" written twice in {${name}}`);
        seen.add(selector);
        skipSpaces(cur);
        if (cur.text[cur.pos] !== "{") {
            fail(cur, `missing { after the case "${selector}"`);
            skipArgument(cur);
            return;
        }
        cur.pos++;
        parseMessage(cur, "}");
        if (cur.text[cur.pos] === "}") cur.pos++;
    }
    if (!seen.has("other")) fail(cur, `{${name}} has no "other" case`);
}

/**
 * Reads one argument, from its opening brace to its closing brace.
 *
 * @param cur - Reader state, on the opening brace, advanced past the argument
 */
function parseArgument(cur: Cursor): void {
    cur.pos++;
    skipSpaces(cur);
    const name = readName(cur);
    if (!name) {
        fail(cur, "argument without a name");
        skipArgument(cur);
        return;
    }
    skipSpaces(cur);
    if (cur.text[cur.pos] === "}") {
        addArg(cur, name, "plain");
        cur.pos++;
        return;
    }
    if (cur.text[cur.pos] !== ",") {
        fail(cur, `unexpected character after {${name}`);
        skipArgument(cur);
        return;
    }
    cur.pos++;
    skipSpaces(cur);
    const type = readName(cur);
    skipSpaces(cur);
    if (type === "number" || type === "date" || type === "time") {
        addArg(cur, name, type);
        const end = cur.text.indexOf("}", cur.pos);
        if (end < 0) {
            fail(cur, `missing } after {${name}, ${type}`);
            cur.pos = cur.text.length;
            return;
        }
        cur.pos = end + 1;
        return;
    }
    if (type === "plural" || type === "selectordinal" || type === "select") {
        addArg(cur, name, type === "select" ? "select" : "plural");
        if (cur.text[cur.pos] !== ",") {
            fail(cur, `missing , after {${name}, ${type}`);
            skipArgument(cur);
            return;
        }
        cur.pos++;
        parseOptions(cur, type !== "select", name);
        return;
    }
    fail(cur, `unknown argument type "${type}" in {${name}}`);
    skipArgument(cur);
}

/**
 * Reads message text up to a closing brace or a closing tag, recording arguments and tags.
 *
 * @param cur - Reader state, advanced to the closing marker (a brace is left for the caller,
 *   a closing tag is consumed) or to the end of the text
 * @param close - The marker that ends this part: "}" for a case, "</name>" for a tag, null for
 *   the whole message
 */
function parseMessage(cur: Cursor, close: string | null): void {
    while (cur.pos < cur.text.length) {
        const char = cur.text[cur.pos];
        if (char === "{") {
            parseArgument(cur);
            continue;
        }
        if (char === "}") {
            if (close === "}") return;
            fail(cur, "} without a matching {");
            cur.pos++;
            continue;
        }
        if (cur.text.startsWith("</", cur.pos)) {
            if (close && close !== "}" && cur.text.startsWith(close, cur.pos)) {
                cur.pos += close.length;
                return;
            }
            fail(cur, "closing tag without a matching opening tag");
            const end = cur.text.indexOf(">", cur.pos);
            cur.pos = end < 0 ? cur.text.length : end + 1;
            continue;
        }
        const tag = char === "<" ? /^<([A-Za-z][A-Za-z0-9]*)>/.exec(cur.text.slice(cur.pos)) : null;
        if (tag) {
            cur.info.tags.add(tag[1]);
            cur.pos += tag[0].length;
            parseMessage(cur, `</${tag[1]}>`);
            continue;
        }
        if (char === "'" && QUOTED.has(cur.text[cur.pos + 1] ?? "")) {
            fail(cur, "an apostrophe before a syntax character opens an ICU quote: rephrase");
        }
        cur.pos++;
    }
    if (close) fail(cur, `missing ${close}`);
}

/**
 * Reads the ICU syntax of a message as next-intl does: arguments, rich text tags and errors.
 *
 * Apostrophe quoting is not supported on purpose: an apostrophe before a syntax character is
 * reported, so that French elisions never disable an argument by accident.
 *
 * @param message - Message text
 * @returns The arguments with their kind, the tag names and the syntax errors
 */
export function readIcu(message: string): IcuInfo {
    const cur: Cursor = {
        text: message,
        pos: 0,
        info: { args: new Map(), tags: new Set(), errors: [] },
    };
    parseMessage(cur, null);
    return cur.info;
}

/**
 * Lists the character problems of a message: an empty text, decorative glyphs, characters outside
 * the allowed set, curly apostrophes and quotes, dashes, three dots and stray white space.
 *
 * @param value - Message text
 * @returns One description per kind of problem, empty when the message is clean
 */
export function charProblems(value: string): string[] {
    const problems = new Set<string>();
    if (value === "") problems.add("empty message: write its text or drop the key");
    for (const char of value) {
        const code = char.codePointAt(0) ?? 0;
        if (code < 0x80) continue;
        const hint = REPLACEMENTS.get(code);
        if (inRanges(code, GLYPH_RANGES)) {
            problems.add(
                `decorative character ${hex(code)}: use an icon, a word or an ASCII separator`,
            );
        } else if (hint) {
            problems.add(`character ${hex(code)}: ${hint}`);
        } else if (!inRanges(code, ALLOWED_RANGES)) {
            problems.add(`character ${hex(code)} is not allowed in a message`);
        }
    }
    if (value.includes("...")) problems.add("three dots: write the ellipsis character");
    if (value !== value.trim()) problems.add("leading or trailing white space");
    if (value.includes("  ")) problems.add("two spaces in a row");
    if (/[\t\n\r]/.test(value)) problems.add("tab or line break in a message");
    return [...problems];
}

/**
 * Lists the punctuation problems of a message for its locale, code spans, URLs and times aside.
 *
 * French takes a plain space before : ; ? ! and inside French quotes (never a no-break space);
 * English takes no space before them and keeps to straight quotes.
 *
 * @param locale - Locale of the message, "fr" or another one
 * @param value - Message text
 * @returns One description per problem, empty when the punctuation is right
 */
export function typographyProblems(locale: string, value: string): string[] {
    const problems = new Set<string>();
    const text = value.replace(/<code>[\s\S]*?<\/code>/g, "<code></code>");
    const french = locale === "fr";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const code = text.charCodeAt(i);
        const before = i > 0 ? text.charCodeAt(i - 1) : 0;
        if (code === OPEN_QUOTE || code === CLOSE_QUOTE) {
            const space = code === OPEN_QUOTE ? text[i + 1] : text[i - 1];
            if (!french) problems.add("French quotes in a message that is not French");
            else if (space !== " ") problems.add("French quotes take a plain space inside");
            continue;
        }
        if (!":;?!".includes(char)) continue;
        if (char === ":" && text.startsWith("//", i + 1)) continue;
        if (/\d/.test(text[i - 1] ?? "") && /\d/.test(text[i + 1] ?? "")) continue;
        if (french && NO_BREAK.has(before)) {
            problems.add(`no-break space before "${char}": write a plain space`);
        } else if (french && before !== 0x20) {
            problems.add(`missing space before "${char}" (French punctuation)`);
        } else if (!french && (before === 0x20 || NO_BREAK.has(before))) {
            problems.add(`space before "${char}" (English punctuation)`);
        }
    }
    return [...problems];
}

/**
 * Flattens one parsed message file into dotted keys, reporting what next-intl cannot read.
 *
 * @param value - Parsed JSON value at this path
 * @param path - Dotted key of the value, starting with the namespace
 * @param leaves - Collects every message, keyed by its dotted key
 * @param objects - Collects the dotted keys of the nested message objects
 * @param problems - Collects structure problems, with the dotted key they concern
 */
function flatten(
    value: unknown,
    path: string,
    leaves: Map<string, string>,
    objects: Set<string>,
    problems: { key: string; message: string }[],
): void {
    if (typeof value === "string") {
        leaves.set(path, value);
        return;
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        problems.push({ key: path, message: "a message is a string, or an object of messages" });
        return;
    }
    const entries = Object.entries(value);
    if (entries.length === 0) problems.push({ key: path, message: "empty object of messages" });
    objects.add(path);
    for (const [key, child] of entries) {
        const next = `${path}.${key}`;
        if (!KEY.test(key)) {
            problems.push({
                key: next,
                message: `key "${key}" is not camelCase ASCII letters and digits`,
            });
        }
        flatten(child, next, leaves, objects, problems);
    }
}

/**
 * Finds the line of a nested key in a JSON text, by looking for each segment in turn.
 *
 * @param text - JSON text of a message file
 * @param segments - Key path inside the file, the namespace excluded
 * @returns The 1-based line of the deepest segment found, 1 when the first one is missing
 */
export function lineOfKey(text: string, segments: string[]): number {
    const lines = text.split("\n");
    let line = 0;
    let found = 0;
    for (const segment of segments) {
        const at = lines.findIndex(
            (content, index) => index >= line && content.includes(`"${segment}":`),
        );
        if (at < 0) break;
        line = at;
        found = at + 1;
    }
    return found || 1;
}

/**
 * Builds sample values for every argument and tag of a message, so that the formatter of
 * next-intl can render it.
 *
 * @param info - Arguments and tags read by readIcu
 * @returns Values keyed by argument or tag name, each of a kind the formatter accepts for its type
 */
function sampleValues(info: IcuInfo): Record<string, unknown> {
    const values: Record<string, unknown> = {};
    for (const [name, kind] of info.args) {
        if (kind === "plural" || kind === "number") values[name] = 2;
        else if (kind === "date" || kind === "time") values[name] = new Date(0);
        else values[name] = kind === "select" ? "other" : "x";
    }
    for (const tag of info.tags) values[tag] = (chunks: string) => chunks;
    return values;
}

/**
 * Describes the arguments and tags of a message, for the comparison between locales.
 *
 * @param info - Arguments and tags read by readIcu
 * @returns A sorted, comparable description such as "count:plural, names:plain, <code>"
 */
function signature(info: IcuInfo): string {
    const args = [...info.args].map(([name, kind]) => `${name}:${kind}`).sort();
    const tags = [...info.tags].map((tag) => `<${tag}>`).sort();
    return [...args, ...tags].join(", ") || "none";
}

/**
 * Checks the message files of every locale: structure, key names, characters, punctuation, ICU
 * syntax, and the same keys, arguments and tags as in the reference locale.
 *
 * The ICU syntax is read by readIcu, then every message is rendered once by next-intl itself.
 *
 * @param files - Message files with their text, every locale and namespace
 * @param reference - Locale whose keys and arguments the others must match
 * @returns The findings, and per locale the messages and the nested objects by dotted key
 */
export function checkMessageFiles(
    files: MessageFile[],
    reference: string = routing.defaultLocale,
): MessageSet {
    const findings: Finding[] = [];
    const leaves = new Map<string, Map<string, string>>();
    const objects = new Map<string, Set<string>>();
    const origin = new Map<string, MessageFile>();
    const parsed = new Map<string, Record<string, unknown>>();
    const broken = new Set<string>();
    const add = (file: MessageFile, key: string, rule: string, message: string): void => {
        const line = lineOfKey(file.text, key.split(".").slice(1));
        findings.push({ file: file.file, line, rule, message: `${key}: ${message}` });
    };

    for (const file of files) {
        if (!leaves.has(file.locale)) leaves.set(file.locale, new Map());
        if (!objects.has(file.locale)) objects.set(file.locale, new Set());
        if (!parsed.has(file.locale)) parsed.set(file.locale, {});
        let data: unknown;
        try {
            data = JSON.parse(file.text);
        } catch (error) {
            findings.push({
                file: file.file,
                line: 1,
                rule: "json",
                message: `invalid JSON: ${String(error)}`,
            });
            continue;
        }
        const problems: { key: string; message: string }[] = [];
        const own = new Map<string, string>();
        flatten(data, file.namespace, own, objects.get(file.locale) as Set<string>, problems);
        for (const problem of problems) {
            add(file, problem.key, "structure", problem.message);
            broken.add(`${file.locale}:${problem.key}`);
        }
        for (const [key, value] of own) {
            (leaves.get(file.locale) as Map<string, string>).set(key, value);
            origin.set(`${file.locale}:${key}`, file);
        }
        (parsed.get(file.locale) as Record<string, unknown>)[file.namespace] = data;
    }

    const infos = new Map<string, IcuInfo>();
    for (const [locale, messages] of leaves) {
        for (const [key, value] of messages) {
            const file = origin.get(`${locale}:${key}`) as MessageFile;
            for (const problem of charProblems(value)) add(file, key, "glyph", problem);
            for (const problem of typographyProblems(locale, value)) {
                add(file, key, "typography", problem);
            }
            const info = readIcu(value);
            for (const error of info.errors) add(file, key, "icu", error);
            infos.set(`${locale}:${key}`, info);
        }
    }

    const base = leaves.get(reference) ?? new Map<string, string>();
    for (const [locale, messages] of leaves) {
        if (locale === reference) continue;
        const absent = new Set<string>();
        for (const key of base.keys()) {
            if (!messages.has(key)) {
                const namespace = key.split(".")[0];
                const file = files.find((f) => f.locale === locale && f.namespace === namespace);
                if (file) add(file, key, "parity", `missing in ${locale}, present in ${reference}`);
                else absent.add(namespace);
                continue;
            }
            const want = signature(infos.get(`${reference}:${key}`) as IcuInfo);
            const got = signature(infos.get(`${locale}:${key}`) as IcuInfo);
            if (want !== got) {
                const file = origin.get(`${locale}:${key}`) as MessageFile;
                add(
                    file,
                    key,
                    "parity",
                    `arguments and tags differ: ${reference} has ${want}, ${locale} has ${got}`,
                );
            }
        }
        for (const namespace of absent) {
            findings.push({
                file: `messages/${locale}/${namespace}.json`,
                line: 1,
                rule: "parity",
                message: `the namespace ${namespace} has no messages in ${locale}`,
            });
        }
        for (const key of messages.keys()) {
            if (base.has(key)) continue;
            add(
                origin.get(`${locale}:${key}`) as MessageFile,
                key,
                "parity",
                `missing in ${reference}, present in ${locale}`,
            );
        }
    }

    for (const [locale, messages] of leaves) {
        const errors: string[] = [];
        const translate = createTranslator({
            locale,
            messages: parsed.get(locale) as AbstractIntlMessages,
            timeZone: "UTC",
            onError: (error) => errors.push(error.message),
        });
        for (const key of messages.keys()) {
            const info = infos.get(`${locale}:${key}`) as IcuInfo;
            const malformed = [...broken].some(
                (bad) => `${locale}:${key}` === bad || `${locale}:${key}`.startsWith(`${bad}.`),
            );
            if (info.errors.length || malformed) continue;
            errors.length = 0;
            try {
                translate.markup(key as never, sampleValues(info) as never);
            } catch (error) {
                errors.push(String(error));
            }
            const file = origin.get(`${locale}:${key}`) as MessageFile;
            for (const error of errors) add(file, key, "icu", error);
        }
    }

    return { findings, leaves, objects };
}

/**
 * Reads the message files of every locale and namespace, reporting missing and stray files.
 *
 * @param root - Project root, the folder that holds messages/
 * @returns The files found and the findings about the folder layout
 */
export function readMessageFiles(root: string): { files: MessageFile[]; findings: Finding[] } {
    const files: MessageFile[] = [];
    const findings: Finding[] = [];
    const locales: readonly string[] = routing.locales;
    const namespaces: readonly string[] = MESSAGE_FILES;
    const dir = join(root, "messages");
    if (!existsSync(dir)) {
        return {
            files,
            findings: [
                { file: "messages", line: 1, rule: "files", message: "messages/ is missing" },
            ],
        };
    }
    for (const entry of readdirSync(dir)) {
        if (locales.includes(entry) && statSync(join(dir, entry)).isDirectory()) continue;
        findings.push({
            file: `messages/${entry}`,
            line: 1,
            rule: "files",
            message: `not a locale folder of src/i18n/routing.ts (${locales.join(", ")})`,
        });
    }
    for (const locale of locales) {
        for (const namespace of namespaces) {
            const file = `messages/${locale}/${namespace}.json`;
            if (existsSync(join(root, file))) {
                files.push({
                    locale,
                    namespace,
                    file,
                    text: readFileSync(join(root, file), "utf-8"),
                });
            } else {
                findings.push({
                    file,
                    line: 1,
                    rule: "files",
                    message: "missing: every namespace of MESSAGE_FILES has a file in every locale",
                });
            }
        }
        if (!existsSync(join(dir, locale))) continue;
        for (const name of readdirSync(join(dir, locale))) {
            const namespace = name.endsWith(".json") ? name.slice(0, -".json".length) : "";
            if (namespaces.includes(namespace)) continue;
            findings.push({
                file: `messages/${locale}/${name}`,
                line: 1,
                rule: "files",
                message: "not a namespace of MESSAGE_FILES, so request.ts never loads it",
            });
        }
    }
    return { files, findings };
}

/**
 * Checks the client trees of src/i18n/routing.ts: known namespaces, no duplicate, a parent chain
 * that ends at the root, and every namespace of the parent repeated in the child.
 *
 * @param trees - Namespaces of each client tree (CLIENT_NAMESPACES)
 * @param parents - Enclosing tree of each client tree (CLIENT_PARENT)
 * @param namespaces - Every namespace that has message files (MESSAGE_FILES)
 * @returns Findings located in src/i18n/routing.ts
 */
export function checkClientTrees(
    trees: Readonly<Record<string, readonly string[]>>,
    parents: Readonly<Record<string, string | null>>,
    namespaces: readonly string[],
): Finding[] {
    const findings: Finding[] = [];
    const add = (message: string): void => {
        findings.push({ file: "src/i18n/routing.ts", line: 1, rule: "client-tree", message });
    };
    for (const [tree, list] of Object.entries(trees)) {
        for (const namespace of list) {
            if (!namespaces.includes(namespace)) {
                add(`${tree}: "${namespace}" is not in MESSAGE_FILES`);
            }
        }
        if (new Set(list).size !== list.length) add(`${tree}: a namespace is listed twice`);
        const seen = new Set<string>([tree]);
        for (let parent = parents[tree]; parent; parent = parents[parent]) {
            if (seen.has(parent)) {
                add(`${tree}: the parent chain loops through "${parent}"`);
                break;
            }
            seen.add(parent);
            if (!trees[parent]) add(`${tree}: parent "${parent}" is not a client tree`);
        }
        const parent = parents[tree];
        if (parent === undefined) add(`${tree}: no entry in CLIENT_PARENT`);
        for (const namespace of parent ? (trees[parent] ?? []) : []) {
            if (!list.includes(namespace)) {
                add(`${tree}: lacks "${namespace}" of its parent "${parent}" (providers replace)`);
            }
        }
    }
    return findings;
}

/**
 * Returns the client tree that renders a source file, from its folder.
 *
 * @param file - Path from the project root, for example "src/components/try/Try.tsx"
 * @returns The tree of the longest matching prefix of TREE_OF, else "root"
 */
export function treeOf(file: string): ClientTree {
    let best: ClientTree = "root";
    let length = 0;
    for (const [prefix, tree] of TREE_OF) {
        if (file.startsWith(prefix) && prefix.length > length) {
            best = tree;
            length = prefix.length;
        }
    }
    return best;
}

/**
 * Returns the 1-based line of a character offset in a parsed file.
 *
 * @param source - Parsed file
 * @param pos - Character offset in the file text
 * @returns Line number as editors show it
 */
function lineOf(source: ts.SourceFile, pos: number): number {
    return source.getLineAndCharacterOfPosition(pos).line + 1;
}

/**
 * Tells whether a module starts with the "use client" directive.
 *
 * @param source - Parsed file
 * @returns True for a client module
 */
function isClientModule(source: ts.SourceFile): boolean {
    for (const statement of source.statements) {
        const directive =
            ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression);
        if (!directive) break;
        if (statement.expression.text === "use client") return true;
    }
    return false;
}

/**
 * Resolves an import specifier to a project file, through the @/ alias or a relative path.
 *
 * @param from - Importing file, from the project root
 * @param specifier - Module specifier as written
 * @param known - Project source files, from the project root
 * @returns The imported file, or null for a package or a file outside the known set
 */
export function resolveImport(
    from: string,
    specifier: string,
    known: ReadonlySet<string>,
): string | null {
    let base: string;
    if (specifier.startsWith("@/")) base = `src/${specifier.slice(2)}`;
    else if (specifier.startsWith("./") || specifier.startsWith("../")) {
        base = posix.normalize(posix.join(posix.dirname(from), specifier));
    } else return null;
    const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`];
    return candidates.find((candidate) => known.has(candidate)) ?? null;
}

/**
 * Returns the translator factory call an expression evaluates to, if any.
 *
 * @param expression - Initializer of a variable declaration
 * @returns The useTranslations or getTranslations call, awaited or not, or null
 */
function translatorCall(expression: ts.Expression): ts.CallExpression | null {
    let node: ts.Expression = expression;
    while (
        ts.isAwaitExpression(node) ||
        ts.isParenthesizedExpression(node) ||
        ts.isAsExpression(node)
    ) {
        node = node.expression;
    }
    if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression)) return null;
    return TRANSLATOR_FACTORIES.has(node.expression.text) ? node : null;
}

/**
 * Reads the namespace given to useTranslations or getTranslations.
 *
 * @param call - The factory call
 * @returns The namespace path ("" for none), or null when it is not a literal
 */
function namespaceOf(call: ts.CallExpression): string | null {
    const [arg] = call.arguments;
    if (!arg) return "";
    if (ts.isStringLiteralLike(arg)) return arg.text;
    if (!ts.isObjectLiteralExpression(arg)) return null;
    for (const property of arg.properties) {
        const name =
            property.name && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name))
                ? property.name.text
                : "";
        if (name !== "namespace") continue;
        return ts.isPropertyAssignment(property) && ts.isStringLiteralLike(property.initializer)
            ? property.initializer.text
            : null;
    }
    return "";
}

/**
 * Collects the variables a block declares: a translator variable maps to its namespace, any other
 * variable to false, so that it shadows an outer translator of the same name.
 *
 * @param statements - Direct statements of a block or of a file
 * @returns Declared names, with the namespace of the translators
 */
function bindingsOf(statements: ts.NodeArray<ts.Statement>): Map<string, string | null | false> {
    const bindings = new Map<string, string | null | false>();
    for (const statement of statements) {
        if (!ts.isVariableStatement(statement)) continue;
        for (const declaration of statement.declarationList.declarations) {
            if (!ts.isIdentifier(declaration.name)) continue;
            const call = declaration.initializer ? translatorCall(declaration.initializer) : null;
            bindings.set(declaration.name.text, call ? namespaceOf(call) : false);
        }
    }
    return bindings;
}

/**
 * Records an import of the file being analyzed when it resolves to a project file.
 *
 * @param ctx - Analysis state of the file
 * @param specifier - Module specifier node of the import, export or dynamic import
 */
function addImport(ctx: VisitContext, specifier: ts.Node | undefined): void {
    if (!specifier || !ts.isStringLiteralLike(specifier)) return;
    const target = resolveImport(ctx.info.file, specifier.text, ctx.known);
    if (target && !ctx.info.imports.includes(target)) ctx.info.imports.push(target);
}

/**
 * Records a call to useTranslations, a dynamic import, or a translator call with its key.
 *
 * @param call - Call expression met by the walk
 * @param ctx - Analysis state of the file, with the translator variables in scope
 */
function inspectCall(call: ts.CallExpression, ctx: VisitContext): void {
    const callee = call.expression;
    const line = lineOf(ctx.source, call.getStart(ctx.source));
    if (callee.kind === ts.SyntaxKind.ImportKeyword) {
        addImport(ctx, call.arguments[0]);
        return;
    }
    if (ts.isIdentifier(callee) && callee.text === "useTranslations") {
        ctx.info.hooks.push({ namespace: namespaceOf(call), line });
    }
    let name = "";
    let method = "t";
    if (ts.isIdentifier(callee)) name = callee.text;
    else if (
        ts.isPropertyAccessExpression(callee) &&
        ts.isIdentifier(callee.expression) &&
        TRANSLATOR_METHODS.has(callee.name.text)
    ) {
        name = callee.expression.text;
        method = callee.name.text;
    }
    let namespace: string | null | false | undefined;
    for (let i = ctx.scopes.length - 1; i >= 0 && namespace === undefined; i--) {
        namespace = ctx.scopes[i].get(name);
    }
    if (namespace === undefined || namespace === false) return;
    const [arg] = call.arguments;
    const usage: Usage = { file: ctx.info.file, line, namespace, key: null, prefix: null, method };
    if (arg && ts.isStringLiteralLike(arg)) usage.key = arg.text;
    else usage.prefix = arg && ts.isTemplateExpression(arg) ? arg.head.text : "";
    ctx.info.usages.push(usage);
}

/**
 * Walks a syntax tree, keeping a stack of block scopes for the translator variables.
 *
 * @param node - Node to visit, then its children
 * @param ctx - Analysis state of the file
 */
function visit(node: ts.Node, ctx: VisitContext): void {
    const scoped = ts.isSourceFile(node) || ts.isBlock(node) || ts.isModuleBlock(node);
    if (scoped) ctx.scopes.push(bindingsOf(node.statements));
    if (ts.isImportDeclaration(node)) {
        if (!node.importClause?.isTypeOnly) addImport(ctx, node.moduleSpecifier);
    } else if (ts.isExportDeclaration(node)) {
        if (!node.isTypeOnly) addImport(ctx, node.moduleSpecifier);
    } else if (ts.isCallExpression(node)) {
        inspectCall(node, ctx);
    }
    ts.forEachChild(node, (child) => visit(child, ctx));
    if (scoped) ctx.scopes.pop();
}

/**
 * Analyzes one source file: client directive, project imports, useTranslations namespaces and
 * the message keys its translators read.
 *
 * @param file - Path from the project root
 * @param text - File content
 * @param known - Every project source file, to resolve imports
 * @returns What the message checks need to know about the file
 */
export function analyzeSource(file: string, text: string, known: ReadonlySet<string>): SourceInfo {
    const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
    const info: SourceInfo = {
        file,
        client: isClientModule(source),
        imports: [],
        hooks: [],
        usages: [],
    };
    visit(source, { source, info, known, scopes: [] });
    return info;
}

/**
 * Tells whether a client tree sits inside another one: its provider is nested in the provider of
 * the outer tree, so the files of the inner tree are checked from their own entry points and not
 * from a file of the outer tree that only loads them (the lazy palette, the Try island).
 *
 * @param inner - Tree of the imported file
 * @param outer - Tree of the file that imports it
 * @returns True when the parent chain of the inner tree reaches the outer one
 */
export function nests(inner: ClientTree, outer: ClientTree): boolean {
    for (let tree = CLIENT_PARENT[inner]; tree; tree = CLIENT_PARENT[tree]) {
        if (tree === outer) return true;
    }
    return false;
}

/**
 * Lists the useTranslations calls of a file and of every project file it imports, directly or not.
 *
 * @param entry - Client file whose module graph is walked
 * @param infos - Analysis of every project source file
 * @returns Each call with the file it sits in
 */
function closureHooks(
    entry: string,
    infos: ReadonlyMap<string, SourceInfo>,
): { file: string; namespace: string | null; line: number }[] {
    const out: { file: string; namespace: string | null; line: number }[] = [];
    const seen = new Set([entry]);
    const stack = [entry];
    const entryTree = treeOf(entry);
    for (let file = stack.pop(); file !== undefined; file = stack.pop()) {
        const info = infos.get(file);
        if (!info) continue;
        for (const hook of info.hooks) out.push({ file, ...hook });
        for (const next of info.imports) {
            if (seen.has(next) || nests(treeOf(next), entryTree)) continue;
            seen.add(next);
            stack.push(next);
        }
    }
    return out;
}

/**
 * Checks the sources against the messages: every key a translator reads exists, and every
 * useTranslations reachable from a client module names a namespace of its client tree.
 *
 * A template literal key only needs one message that starts with its static head.
 *
 * @param infos - Analysis of every project source file
 * @param leaves - Messages of the reference locale by dotted key
 * @param objects - Dotted keys of the nested message objects of the reference locale
 * @param trees - Namespaces of each client tree, CLIENT_NAMESPACES by default
 * @returns Findings located in the source files
 */
export function checkSources(
    infos: ReadonlyMap<string, SourceInfo>,
    leaves: ReadonlyMap<string, string>,
    objects: ReadonlySet<string>,
    trees: Readonly<Record<ClientTree, readonly string[]>> = CLIENT_NAMESPACES,
): Finding[] {
    const findings = new Map<string, Finding>();
    const add = (file: string, line: number, rule: string, message: string): void => {
        findings.set(`${file}:${line}:${message}`, { file, line, rule, message });
    };
    const keys = [...leaves.keys()];

    for (const info of infos.values()) {
        for (const usage of info.usages) {
            if (usage.namespace === null || usage.method === "has") continue;
            const scope = usage.namespace ? `${usage.namespace}.` : "";
            if (usage.key !== null) {
                const key = scope + usage.key;
                const found = leaves.has(key) || (usage.method === "raw" && objects.has(key));
                if (!found) add(usage.file, usage.line, "missing-key", `no message "${key}"`);
            } else if (usage.prefix) {
                const prefix = scope + usage.prefix;
                const message = `no message starts with "${prefix}"`;
                if (!keys.some((key) => key.startsWith(prefix))) {
                    add(usage.file, usage.line, "missing-key", message);
                }
            }
        }
    }

    for (const info of infos.values()) {
        if (!info.client) continue;
        const tree = treeOf(info.file);
        const allowed = trees[tree];
        for (const hook of closureHooks(info.file, infos)) {
            const namespace = hook.namespace?.split(".")[0];
            if (!namespace) {
                add(
                    hook.file,
                    hook.line,
                    "client-namespace",
                    "useTranslations in client code needs a literal namespace, to match a provider",
                );
            } else if (!allowed.includes(namespace)) {
                const via = hook.file === info.file ? "" : `, imported by ${info.file}`;
                add(
                    hook.file,
                    hook.line,
                    "client-namespace",
                    `namespace "${namespace}" is not in CLIENT_NAMESPACES.${tree}${via}`,
                );
            }
        }
    }

    return [...findings.values()];
}

/**
 * Lists the message keys that no source file reads, for the --unused report.
 *
 * @param infos - Analysis of every project source file
 * @param leaves - Messages of the reference locale by dotted key
 * @param whole - Namespaces whose JSON file a source imports as a whole
 * @returns Unused dotted keys, sorted
 */
export function unusedKeys(
    infos: ReadonlyMap<string, SourceInfo>,
    leaves: ReadonlyMap<string, string>,
    whole: readonly string[],
): string[] {
    const used = new Set<string>();
    const prefixes = [...DYNAMIC, ...whole.map((namespace) => `${namespace}.`)];
    for (const info of infos.values()) {
        for (const usage of info.usages) {
            if (usage.namespace === null) continue;
            const scope = usage.namespace ? `${usage.namespace}.` : "";
            if (usage.key !== null) used.add(scope + usage.key);
            else prefixes.push(scope + (usage.prefix ?? ""));
        }
    }
    return [...leaves.keys()]
        .filter((key) => !used.has(key) && !prefixes.some((prefix) => key.startsWith(prefix)))
        .sort();
}

/**
 * Lists the files of a folder tree, as POSIX paths from the project root.
 *
 * @param root - Project root
 * @param dir - Folder to walk, from the project root
 * @param pattern - File names to keep
 * @returns Sorted paths, empty when the folder does not exist
 */
function listFiles(root: string, dir: string, pattern: RegExp): string[] {
    const out: string[] = [];
    if (!existsSync(join(root, dir))) return out;
    const stack = [dir];
    for (let current = stack.pop(); current !== undefined; current = stack.pop()) {
        for (const name of readdirSync(join(root, current))) {
            const path = `${current}/${name}`;
            if (statSync(join(root, path)).isDirectory()) stack.push(path);
            else if (pattern.test(name)) out.push(path);
        }
    }
    return out.sort();
}

/**
 * Runs every check and prints one line per finding, then a summary.
 *
 * @param args - Command-line flags: --root <dir> checks another tree (read-only), --unused prints
 *   the keys that no source reads (a report), --gate-unused also counts them as findings
 * @returns Number of findings, plus the unused keys under --gate-unused; the entry point exits
 *   with status 1 when it is not zero
 */
function main(args: string[]): number {
    const at = args.indexOf("--root");
    const root = at >= 0 && args[at + 1] ? args[at + 1] : cwd();
    const gate = args.includes("--gate-unused");
    const report = gate || args.includes("--unused");

    const layout = readMessageFiles(root);
    const set = checkMessageFiles(layout.files);
    const reference = set.leaves.get(routing.defaultLocale) ?? new Map<string, string>();
    const objects = set.objects.get(routing.defaultLocale) ?? new Set<string>();

    const sources = listFiles(root, "src", /\.tsx?$/).filter(
        (file) => !file.endsWith(".d.ts") && !SKIPPED_SOURCES.some((dir) => file.startsWith(dir)),
    );
    const known = new Set(sources);
    const infos = new Map(
        sources.map((file) => [
            file,
            analyzeSource(file, readFileSync(join(root, file), "utf-8"), known),
        ]),
    );

    const findings = [
        ...layout.findings,
        ...set.findings,
        ...checkClientTrees(CLIENT_NAMESPACES, CLIENT_PARENT, MESSAGE_FILES),
        ...checkSources(infos, reference, objects),
    ];
    for (const f of findings) console.log(`${f.file}:${f.line} ${f.rule} ${f.message}`);

    let unused = 0;
    if (report) {
        const texts = [...sources, ...listFiles(root, "scripts", /^(?!.*\.test\.ts$).*\.ts$/)];
        const whole = new Set<string>();
        for (const file of texts) {
            const text = readFileSync(join(root, file), "utf-8");
            for (const match of text.matchAll(/messages\/[^/'"`\s]+\/([a-z]+)\.json/g)) {
                whole.add(match[1]);
            }
        }
        const keys = unusedKeys(infos, reference, [...whole]);
        for (const key of keys) console.log(`unused ${key}`);
        console.log(`messages: ${keys.length} unused keys${gate ? "" : " (report only)"}`);
        unused = gate ? keys.length : 0;
    }

    const clients = [...infos.values()].filter((info) => info.client).length;
    console.log(
        `messages: ${MESSAGE_FILES.length} namespaces, ${routing.locales.length} locales, ` +
            `${reference.size} keys per locale, ${sources.length} sources (${clients} client), ` +
            `${findings.length} findings`,
    );
    return findings.length + unused;
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
    exit(main(argv.slice(2)) > 0 ? 1 : 0);
}
