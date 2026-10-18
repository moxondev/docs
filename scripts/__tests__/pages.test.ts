import assert from "node:assert/strict";
import { describe, test } from "node:test";

import type { Page } from "@/types/content";
import type { Nav } from "@/types/nav";

import {
    buildNav,
    checkLinks,
    checkPages,
    hasWords,
    idProblems,
    languageProblems,
    linkTargets,
    main,
    modulePath,
    navPage,
    navSource,
    type PageEntry,
    registrySource,
    sharedProse,
} from "../pages";

// Two v6 pages: the index links to the hash page, to missing targets and to a version without pages
const TARGET: Page = {
    version: "v6",
    id: "hash",
    kind: "endpoint",
    title: { en: "Hash", fr: "Hash" },
    operations: [{ id: "default", method: "post", path: "/hash", try: true, params: [] }],
    sections: [
        { id: "", blocks: [] },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Parametres" },
            blocks: [
                {
                    type: "params",
                    rows: [
                        { name: "text", required: true, description: { en: "Text", fr: "Texte" } },
                    ],
                },
            ],
        },
    ],
};

const SOURCE: Page = {
    version: "v6",
    id: "index",
    kind: "index",
    title: { en: "Getting Started", fr: "Commencer" },
    updated: "2026-01-15",
    sections: [
        {
            id: "intro",
            level: 2,
            title: { en: "Intro", fr: "Intro" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "See [hash](ref:hash#p-text), [params](ref:hash#parameters) and [here](#intro).",
                        fr: "Voir [hash](ref:hash#nope), [old](ref:v4/hash) et [ici](#missing).",
                    },
                },
                { type: "list", items: ["[gone](ref:gone)", "[home](ref:index)"] },
                {
                    type: "related",
                    items: [{ label: "Hash", to: "hash", description: { en: "Hash", fr: "Hash" } }],
                },
            ],
        },
    ],
};

/**
 * Wraps a page as a loaded module entry.
 *
 * @param page - Page whose version and id name the entry; the module path is derived from the id
 * @returns The entry, named after the page id
 */
function entryOf(page: Page): PageEntry {
    return { version: page.version, id: page.id, module: modulePath(page.id), page };
}

describe("module names and ids", () => {
    test("each segment in camelCase, releases in one module", () => {
        assert.equal(modulePath("index"), "index");
        assert.equal(modulePath("tic-tac-toe/fetch"), "ticTacToe/fetch");
        assert.equal(modulePath("captcha/verify"), "captcha/verify");
        assert.equal(modulePath("changelog/6.1.0"), "releases");
        assert.equal(modulePath("changelog"), "changelog");
    });

    test("an id is a ref target that is neither a language nor a version", () => {
        assert.deepEqual(idProblems("tic-tac-toe/fetch"), []);
        assert.deepEqual(idProblems("changelog/6.1.0"), []);
        assert.deepEqual(idProblems("fr/hash"), ['first segment "fr" is a language']);
        assert.ok(idProblems("v5/hash").includes('first segment "v5" is a version'));
        assert.ok(idProblems("hash#top").includes("not a valid page id"));
        assert.ok(idProblems("Hash").includes("not a valid page id"));
    });
});

describe("generated modules", () => {
    test("NAV entries: plain titles, distinct methods, date and release summary", () => {
        assert.deepEqual(navPage(TARGET), {
            title: { en: "Hash", fr: "Hash" },
            kind: "endpoint",
            methods: ["post"],
        });
        assert.equal(navPage(SOURCE).updated, "2026-01-15");
        const nav = buildNav([entryOf(TARGET)]);
        assert.deepEqual(Object.keys(nav), ["v1", "v2", "v3", "v4", "v5", "v6"]);
        assert.deepEqual(Object.keys(nav.v6), ["hash"]);
        assert.deepEqual(nav.v5, {});
        assert.ok(navSource(nav).includes("export const NAV: Nav = {"));
    });

    test("one lazy loader per page, the releases read from their key", () => {
        const release: PageEntry = {
            version: "v6",
            id: "changelog/6.1.0",
            module: "releases",
            release: "6.1.0",
            page: { ...TARGET, id: "changelog/6.1.0", kind: "release" },
        };
        const source = registrySource([entryOf(TARGET), release]);
        assert.ok(source.includes('"hash": () => import("./v6/hash").then((m) => m.page),'));
        assert.ok(
            source.includes(
                '"changelog/6.1.0": () => import("./v6/releases").then((m) => m.releases["6.1.0"]),',
            ),
        );
        assert.ok(source.includes("v1: {},"));
    });
});

describe("untranslated-prose guard (plan 3.4)", () => {
    test("a word outside code and links is prose", () => {
        assert.equal(hasWords("Hello"), true);
        assert.equal(hasWords("**Bold** text"), true);
        assert.equal(hasWords("`sha256`"), false);
        assert.equal(hasWords("[sha256](ref:hash)"), false);
        assert.equal(hasWords("1.2.3, 4"), false);
        assert.equal(hasWords("a"), false);
    });

    test("shared leaves with words are listed once, Loc and one-language sections are not", () => {
        const page: Page = {
            ...TARGET,
            lead: "Shared lead",
            sections: [
                {
                    id: "a",
                    blocks: [
                        { type: "p", text: "Shared lead" },
                        { type: "p", text: { en: "English", fr: "Francais" } },
                        { type: "list", items: ["`code`", "Item words"] },
                        {
                            type: "table",
                            head: { en: ["A"], fr: ["A"] },
                            rows: [["Cell words", "1"]],
                        },
                        {
                            type: "errors",
                            rows: [{ message: "Bad request", description: "Same text" }],
                        },
                    ],
                },
                { id: "b", only: "en", blocks: [{ type: "p", text: "English only" }] },
            ],
        };
        assert.deepEqual(sharedProse(page), [
            "Shared lead",
            "Item words",
            "Cell words",
            "Same text",
        ]);
    });

    test("a shared leaf fails unless the reviewed list holds it, a stale entry warns", () => {
        const page: Page = {
            ...SOURCE,
            sections: [{ id: "", blocks: [{ type: "p", text: "Once" }] }],
        };
        const entries = [entryOf(page)];
        const nav = buildNav(entries);
        const rules = (identical: Record<string, string[]>) => {
            const result = checkPages(entries, nav, identical);
            return {
                untranslated: result.problems.filter((p) => p.rule === "untranslated").length,
                warnings: result.warnings.map((w) => w.message),
            };
        };
        assert.deepEqual(rules({}), { untranslated: 1, warnings: [] });
        assert.deepEqual(rules({ "v6/index": ["Once"] }), { untranslated: 0, warnings: [] });
        assert.deepEqual(rules({ "v6/index": ["Once", "Old"] }), {
            untranslated: 0,
            warnings: ["stale entry: Old"],
        });
    });
});

describe("command line", () => {
    test("an argument other than --check and --root is refused before anything is written", async () => {
        assert.equal(await main(["--identical", "parity.json"]), 1);
        assert.equal(await main(["--root"]), 1);
        assert.equal(await main(["--root", "--check"]), 1);
    });
});

describe("page checks", () => {
    test("both languages: titles and Loc leaves", () => {
        assert.deepEqual(languageProblems(TARGET), []);
        assert.deepEqual(languageProblems({ ...TARGET, title: { en: "Hash", fr: " " } }), [
            "empty title",
        ]);
        const half: Page = {
            ...TARGET,
            sections: [{ id: "a", blocks: [{ type: "p", text: { en: "Text", fr: "" } }] }],
        };
        assert.deepEqual(languageProblems(half), ["sections[0].blocks[0].text is empty in fr"]);
        const only: Page = {
            ...TARGET,
            sections: [{ id: "a", only: "fr", title: { en: "", fr: "Titre" }, blocks: [] }],
        };
        assert.deepEqual(languageProblems(only), []);
    });

    test("dates, parents and the version home", () => {
        const child: Page = { ...TARGET, id: "hash/more", updated: "15/01/2026" };
        const entries = [entryOf(child)];
        const { problems } = checkPages(entries, buildNav(entries), {});
        const rules = new Set(problems.map((p) => p.rule));
        assert.ok(rules.has("updated"));
        assert.ok(rules.has("parent"));
        assert.ok(rules.has("index"));
    });

    test("link targets, the ones inside emphasis included", () => {
        assert.deepEqual(linkTargets("[a](ref:x), **[b](#b)** and _[c](https://e.com)_"), [
            "ref:x",
            "#b",
            "https://e.com",
        ]);
        assert.deepEqual(linkTargets("`[a](ref:x)`"), []);
    });

    test("internal links name a page and an id of it, unpublished versions are counted", () => {
        const entries = [entryOf(TARGET), entryOf(SOURCE)];
        const nav: Nav = buildNav(entries);
        const { problems, skipped } = checkLinks(entries, nav);
        assert.equal(skipped, 1);
        assert.deepEqual(
            problems.map((p) => `${p.where}: ${p.message}`),
            [
                "v6/index (en): no page ref:gone",
                "v6/index (fr): no id in ref:hash#nope",
                "v6/index (fr): no id #missing",
                "v6/index (fr): no page ref:gone",
            ],
        );
    });
});
