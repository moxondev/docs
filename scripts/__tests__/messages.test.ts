import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { CLIENT_NAMESPACES, CLIENT_PARENT, MESSAGE_FILES } from "@/i18n/routing";

import {
    analyzeSource,
    charProblems,
    checkClientTrees,
    checkMessageFiles,
    checkSources,
    lineOfKey,
    type MessageFile,
    nests,
    readIcu,
    resolveImport,
    type SourceInfo,
    treeOf,
    typographyProblems,
    unusedKeys,
} from "../messages";

// Characters built from code points so that this file stays pure ASCII
const ARROW = String.fromCodePoint(0x2192);
const MIDDLE_DOT = String.fromCodePoint(0x00b7);
const CMD = String.fromCodePoint(0x2318);
const SHIFT = String.fromCodePoint(0x21e7);
const CHECK = String.fromCodePoint(0x2713);
const BULLET = String.fromCodePoint(0x2022);
const BOX = String.fromCodePoint(0x2500);
const EMOJI = String.fromCodePoint(0x1f680);
const E_ACUTE = String.fromCodePoint(0x00e9);
const OE = String.fromCodePoint(0x0153);
const OPEN = String.fromCodePoint(0x00ab);
const CLOSE = String.fromCodePoint(0x00bb);
const ELLIPSIS = String.fromCodePoint(0x2026);
const NBSP = String.fromCodePoint(0x00a0);
const TIMES = String.fromCodePoint(0x00d7);
const CURLY = String.fromCodePoint(0x2019);
const EM_DASH = String.fromCodePoint(0x2014);
const ANGLE = String.fromCodePoint(0x203a);

/**
 * Builds the English and French message files of one namespace.
 *
 * @param namespace - Namespace, which is also the file name
 * @param en - Message tree written to the English file
 * @param fr - Message tree written to the French file
 * @returns One file per locale, with a JSON text formatted like the real files
 */
function pair(namespace: string, en: object, fr: object): MessageFile[] {
    return [
        {
            locale: "en",
            namespace,
            file: `messages/en/${namespace}.json`,
            text: JSON.stringify(en, null, 4),
        },
        {
            locale: "fr",
            namespace,
            file: `messages/fr/${namespace}.json`,
            text: JSON.stringify(fr, null, 4),
        },
    ];
}

/**
 * Lists the rule ids that the message check reports for a set of files, sorted.
 *
 * @param files - Message files of both locales
 * @returns Rule ids, one per finding
 */
function rules(files: MessageFile[]): string[] {
    return checkMessageFiles(files, "en")
        .findings.map((finding) => finding.rule)
        .sort();
}

/**
 * Analyzes in-memory source files the way the check analyzes the project.
 *
 * @param sources - Content of each file, keyed by its path from the project root
 * @returns The analysis of every file, keyed by path
 */
function analyze(sources: Record<string, string>): Map<string, SourceInfo> {
    const known = new Set(Object.keys(sources));
    return new Map(
        Object.entries(sources).map(([file, text]) => [file, analyzeSource(file, text, known)]),
    );
}

/**
 * Runs the source check on in-memory files against a small message set.
 *
 * @param sources - Content of each file, keyed by its path from the project root
 * @returns The findings, as "file:line rule" strings, sorted
 */
function sourceFindings(sources: Record<string, string>): string[] {
    const leaves = new Map([
        ["common.copy", "Copy"],
        ["common.languages.en", "English"],
        ["endpoint.default", "Default: <code>{value}</code>."],
        ["meta.siteName", "moxon"],
        ["search.title", "Search"],
        ["snippet.languages.curl", "cURL"],
        ["try.send", "Send request"],
    ]);
    const objects = new Set([
        "common",
        "common.languages",
        "endpoint",
        "meta",
        "search",
        "snippet",
        "try",
    ]);
    return checkSources(analyze(sources), leaves, objects)
        .map((finding) => `${finding.file}:${finding.line} ${finding.rule}`)
        .sort();
}

describe("ICU reader", () => {
    test("plain arguments, plural cases and nested arguments are read", () => {
        const info = readIcu(
            "{count, plural, =0 {None} one {+ # more: {names}} other {+ # more: {names}}}",
        );
        assert.deepEqual(info.errors, []);
        assert.deepEqual(
            [...info.args],
            [
                ["count", "plural"],
                ["names", "plain"],
            ],
        );
    });

    test("tags, select and number arguments are read", () => {
        const info = readIcu(
            "Default: <code>{value}</code>, {kind, select, a {A} other {B}} {n, number}",
        );
        assert.deepEqual(info.errors, []);
        assert.deepEqual([...info.tags], ["code"]);
        assert.deepEqual(
            [...info.args],
            [
                ["value", "plain"],
                ["kind", "select"],
                ["n", "number"],
            ],
        );
    });

    test("an elision before a letter is plain text", () => {
        assert.deepEqual(readIcu(`L'endpoint {name} d'erreur`).errors, []);
    });

    test("syntax errors are reported", () => {
        const broken = [
            "{count, plural, one {x}}",
            "broken {x",
            "stray } brace",
            "<b>unclosed",
            "closing</b> only",
            "{n, plurl, other {x}}",
            "{n, plural, few2 {x} other {y}}",
            "{n, plural, one {a} one {b} other {c}}",
            "Essayer l'{name}",
            "{} empty",
        ];
        for (const message of broken) {
            assert.notDeepEqual(readIcu(message).errors, [], message);
        }
    });
});

describe("characters", () => {
    test("decorative glyphs are reported", () => {
        for (const glyph of [ARROW, MIDDLE_DOT, CMD, SHIFT, CHECK, BULLET, BOX, EMOJI]) {
            const problems = charProblems(`Send ${glyph} now`);
            assert.equal(problems.length, 1, glyph);
            assert.match(problems[0], /decorative character/);
        }
    });

    test("accents, French quotes, the ellipsis, no-break spaces and value symbols pass", () => {
        const words = `Pr${E_ACUTE}c${E_ACUTE}dent, ${OE}uvre, ${OPEN} hello ${CLOSE}`;
        const symbols = `Chargement${ELLIPSIS} 1,5${TIMES}${NBSP}x`;
        assert.deepEqual(charProblems(`${words}, ${symbols}`), []);
    });

    test("curly apostrophes, dashes, angle quotes and three dots get a hint", () => {
        assert.match(charProblems(`l${CURLY}API`)[0], /straight apostrophe/);
        assert.match(charProblems(`a ${EM_DASH} b`)[0], /ASCII hyphen/);
        assert.match(charProblems(`a ${ANGLE} b`)[0], /ASCII separator/);
        assert.match(charProblems("Loading...")[0], /ellipsis/);
    });

    test("an empty message is reported", () => {
        assert.match(charProblems("")[0], /empty message/);
    });

    test("stray white space is reported", () => {
        assert.equal(charProblems(" Copy").length, 1);
        assert.equal(charProblems("Copy  code").length, 1);
        assert.equal(charProblems("Copy\ncode").length, 1);
    });
});

describe("punctuation", () => {
    test("French takes a plain space before a colon", () => {
        assert.equal(typographyProblems("fr", `Par d${E_ACUTE}faut: hex`).length, 1);
        assert.deepEqual(typographyProblems("fr", `Par d${E_ACUTE}faut : hex`), []);
        assert.match(typographyProblems("fr", `Exemple${NBSP}: x`)[0], /no-break space/);
        assert.equal(typographyProblems("fr", "Disponible!").length, 1);
    });

    test("code spans, URLs and times are skipped", () => {
        assert.deepEqual(typographyProblems("fr", "avec <code>get:</code>."), []);
        assert.deepEqual(typographyProblems("fr", "voir https://moxon.dev"), []);
        assert.deepEqual(typographyProblems("fr", "12:30"), []);
    });

    test("French quotes take plain spaces inside, and only in French", () => {
        assert.equal(typographyProblems("fr", `${OPEN}hello${CLOSE}`).length, 1);
        assert.deepEqual(typographyProblems("fr", `${OPEN} hello ${CLOSE}`), []);
        assert.equal(typographyProblems("en", `${OPEN} hello ${CLOSE}`).length, 1);
    });

    test("English takes no space before a colon or a question mark", () => {
        assert.equal(typographyProblems("en", "Default : hex").length, 1);
        assert.deepEqual(typographyProblems("en", "Default: hex. Did you mean?"), []);
    });
});

describe("message files", () => {
    test("matching locales pass", () => {
        assert.deepEqual(
            rules(
                pair(
                    "search",
                    { count: "{count, plural, one {# result} other {# results}}", tip: "<b>x</b>" },
                    { count: "{count, plural, one {# r} other {# rs}}", tip: "<b>y</b>" },
                ),
            ),
            [],
        );
    });

    test("a key missing from a locale or extra in it is reported", () => {
        assert.deepEqual(rules(pair("common", { copy: "Copy", close: "Close" }, { copy: "C" })), [
            "parity",
        ]);
        assert.deepEqual(rules(pair("common", { copy: "Copy" }, { copy: "C", close: "F" })), [
            "parity",
        ]);
    });

    test("different arguments or tags between locales are reported", () => {
        assert.deepEqual(rules(pair("a", { m: "{count} more" }, { m: "{total} autres" })), [
            "parity",
        ]);
        assert.deepEqual(rules(pair("a", { m: "<code>x</code>" }, { m: "x" })), ["parity"]);
    });

    test("arrays, dotted keys, bad key names and empty objects are reported", () => {
        assert.deepEqual(rules(pair("a", { list: ["x"] }, { list: ["x"] })), [
            "structure",
            "structure",
        ]);
        assert.deepEqual(rules(pair("a", { "b.c": "x" }, { "b.c": "x" })), [
            "structure",
            "structure",
        ]);
        assert.deepEqual(rules(pair("a", { group: {} }, { group: {} })), [
            "structure",
            "structure",
        ]);
    });

    test("invalid JSON is reported", () => {
        const [en, fr] = pair("a", { m: "x" }, { m: "x" });
        assert.deepEqual(rules([en, { ...fr, text: "{" }]), ["json", "parity"]);
    });

    test("a message the reader accepts but next-intl rejects is reported", () => {
        const select = "{n, select, =1 {a} other {b}}";
        assert.deepEqual(readIcu(select).errors, []);
        assert.deepEqual(rules(pair("a", { m: select }, { m: select })), ["icu", "icu"]);
    });

    test("findings point at the line of the key", () => {
        const text = JSON.stringify({ a: { b: "x" }, c: { b: "y" } }, null, 4);
        assert.equal(lineOfKey(text, ["c", "b"]), 6);
        assert.equal(lineOfKey(text, ["zzz"]), 1);
    });
});

describe("client trees", () => {
    test("the trees of src/i18n/routing.ts are consistent", () => {
        assert.deepEqual(checkClientTrees(CLIENT_NAMESPACES, CLIENT_PARENT, MESSAGE_FILES), []);
    });

    test("a tree that drops a namespace of its parent is reported", () => {
        const findings = checkClientTrees(
            { root: ["common", "aria"], page: ["common", "endpoint"] },
            { root: null, page: "root" },
            ["common", "aria", "endpoint"],
        );
        assert.equal(findings.length, 1);
        assert.match(findings[0].message, /"aria"/);
    });

    test("unknown namespaces and parent loops are reported", () => {
        const findings = checkClientTrees({ a: ["zzz"], b: [] }, { a: "b", b: "a" }, ["common"]);
        assert.ok(findings.some((finding) => /MESSAGE_FILES/.test(finding.message)));
        assert.ok(findings.some((finding) => /loops/.test(finding.message)));
    });

    test("source folders map to their trees", () => {
        assert.equal(treeOf("src/components/chrome/Header.tsx"), "root");
        assert.equal(treeOf("src/components/doc/Toc.tsx"), "page");
        assert.equal(treeOf("src/components/try/Try.tsx"), "try");
        assert.equal(treeOf("src/components/try/Picker.tsx"), "playground");
        assert.equal(treeOf("src/components/search/Palette.tsx"), "search");
        assert.equal(treeOf("src/components/home/Demo.tsx"), "home");
        assert.equal(treeOf("src/app/(site)/error.tsx"), "root");
    });

    test("a tree nests in the trees of its parent chain only", () => {
        assert.equal(nests("search", "root"), true);
        assert.equal(nests("playground", "root"), true);
        assert.equal(nests("playground", "page"), true);
        assert.equal(nests("try", "root"), true);
        assert.equal(nests("root", "search"), false);
        assert.equal(nests("page", "try"), false);
        assert.equal(nests("search", "home"), false);
        assert.equal(nests("home", "page"), false);
        assert.equal(nests("root", "root"), false);
    });

    test("every nested tree of the real routing nests in each of its ancestors", () => {
        for (const tree of Object.keys(CLIENT_PARENT) as (keyof typeof CLIENT_PARENT)[]) {
            for (let up = CLIENT_PARENT[tree]; up; up = CLIENT_PARENT[up]) {
                assert.equal(nests(tree, up), true, `${tree} in ${up}`);
                assert.equal(nests(up, tree), false, `${up} in ${tree}`);
            }
        }
    });
});

describe("sources", () => {
    test("imports resolve through the alias and relative paths only", () => {
        const known = new Set(["src/components/try/Snippet.tsx", "src/lib/routes.ts"]);
        assert.equal(
            resolveImport("src/components/home/Demo.tsx", "@/components/try/Snippet", known),
            "src/components/try/Snippet.tsx",
        );
        assert.equal(
            resolveImport("src/components/doc/Page.tsx", "../../lib/routes", known),
            "src/lib/routes.ts",
        );
        assert.equal(resolveImport("src/components/doc/Page.tsx", "next-intl", known), null);
    });

    test("a client component reads the namespaces of its tree only", () => {
        const header = [
            '"use client";',
            'import { useTranslations } from "next-intl";',
            "export function Header() {",
            '    const t = useTranslations("common");',
            '    const s = useTranslations("try");',
            '    return t("copy") + s("send");',
            "}",
        ].join("\n");
        assert.deepEqual(sourceFindings({ "src/components/chrome/Header.tsx": header }), [
            "src/components/chrome/Header.tsx:5 client-namespace",
        ]);
        assert.deepEqual(sourceFindings({ "src/components/try/Header.tsx": header }), []);
    });

    test("a client component imported into another tree must fit that tree", () => {
        const snippet = [
            '"use client";',
            'import { useTranslations } from "next-intl";',
            "export function Snippet() {",
            '    const t = useTranslations("try");',
            '    return t("send");',
            "}",
        ].join("\n");
        const demo = [
            '"use client";',
            'import { Snippet } from "@/components/try/Snippet";',
            "export function Demo() {",
            "    return Snippet();",
            "}",
        ].join("\n");
        assert.deepEqual(
            sourceFindings({
                "src/components/home/Demo.tsx": demo,
                "src/components/try/Snippet.tsx": snippet,
            }),
            ["src/components/try/Snippet.tsx:4 client-namespace"],
        );
    });

    test("a nested tree that a client file only loads is checked from its own entry", () => {
        const palette = [
            '"use client";',
            'import { useTranslations } from "next-intl";',
            "export function Body() {",
            '    const t = useTranslations("search");',
            '    return t("title");',
            "}",
        ].join("\n");
        const host = [
            '"use client";',
            'import { Body } from "@/components/search/Body";',
            "export function Host() {",
            "    return Body();",
            "}",
        ].join("\n");
        const sources = {
            "src/components/chrome/Host.tsx": host,
            "src/components/search/Body.tsx": palette,
        };
        assert.deepEqual(sourceFindings(sources), []);
        assert.deepEqual(
            sourceFindings({
                "src/components/chrome/Host.tsx": host,
                "src/components/chrome/Body.tsx": palette,
            }),
            ["src/components/chrome/Body.tsx:4 client-namespace"],
        );
        assert.deepEqual(
            sourceFindings({
                "src/components/home/Host.tsx": host,
                "src/components/search/Body.tsx": palette,
            }),
            ["src/components/search/Body.tsx:4 client-namespace"],
        );
    });

    test("server components and dynamic namespaces", () => {
        const server = [
            'import { useTranslations } from "next-intl";',
            "export function Fields() {",
            '    const t = useTranslations("try");',
            '    return t("send");',
            "}",
        ].join("\n");
        const dynamic = [
            '"use client";',
            'import { useTranslations } from "next-intl";',
            "export function Any({ ns }: { ns: string }) {",
            "    const t = useTranslations(ns);",
            "    const u = useTranslations();",
            '    return t("x") + u("common.copy");',
            "}",
        ].join("\n");
        assert.deepEqual(sourceFindings({ "src/components/chrome/Fields.tsx": server }), []);
        assert.deepEqual(sourceFindings({ "src/components/chrome/Any.tsx": dynamic }), [
            "src/components/chrome/Any.tsx:4 client-namespace",
            "src/components/chrome/Any.tsx:5 client-namespace",
        ]);
    });

    test("every key a translator reads must exist", () => {
        const page = [
            'import { getTranslations } from "next-intl/server";',
            "export async function meta(locale: string, id: string) {",
            '    const t = await getTranslations({ locale, namespace: "meta" });',
            '    const c = await getTranslations("common");',
            '    const e = await getTranslations("endpoint");',
            "    return [",
            '        t("siteName"),',
            '        t("nope"),',
            "        c(`languages.${id}`),",
            "        c(`zzz.${id}`),",
            '        c.has("nope"),',
            '        e.rich("default", { value: id }),',
            '        c.raw("languages"),',
            "    ];",
            "}",
        ].join("\n");
        assert.deepEqual(sourceFindings({ "src/lib/meta.ts": page }), [
            "src/lib/meta.ts:10 missing-key",
            "src/lib/meta.ts:8 missing-key",
        ]);
    });

    test("a variable of an inner block shadows a translator", () => {
        const file = [
            'import { getTranslations } from "next-intl/server";',
            "export async function f() {",
            '    const t = await getTranslations("common");',
            "    {",
            "        const t = (key: string) => key;",
            '        t("not a message key");',
            "    }",
            '    return t("copy");',
            "}",
        ].join("\n");
        assert.deepEqual(sourceFindings({ "src/lib/f.ts": file }), []);
    });

    test("the unused report counts literal keys, dynamic prefixes and whole namespaces", () => {
        const infos = analyze({
            "src/lib/a.ts": [
                'import { getTranslations } from "next-intl/server";',
                "export async function a(id: string) {",
                '    const t = await getTranslations("try");',
                "    return t(`send${id}`);",
                "}",
            ].join("\n"),
        });
        const leaves = new Map([
            ["try.send", "x"],
            ["try.title", "x"],
            ["common.keys.ctrl", "Ctrl"],
            ["footer.github", "GitHub"],
            ["header.pro", "Go Pro"],
        ]);
        assert.deepEqual(unusedKeys(infos, leaves, ["footer"]), ["header.pro", "try.title"]);
    });
});
