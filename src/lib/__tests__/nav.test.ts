import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { CATALOGUE, CATEGORIES } from "@/data/catalogue";
import { NAV } from "@/data/nav";

import {
    catalogueEntry,
    crumbs,
    familyMethods,
    isListed,
    navTitle,
    pageOrder,
    pager,
    releasePages,
    sidebar,
    slimMeta,
    subPages,
    tocEntries,
} from "@/lib/nav";
import { getPage } from "@/lib/pages";
import type { Lang, Page, PageStatus, Version } from "@/types/content";
import type { Nav, NavPage } from "@/types/nav";

// Letters built from their code points so that this file stays pure ASCII
const E_ACUTE = String.fromCodePoint(0xe9);

/**
 * Builds a navigation entry for the synthetic indexes of the tests.
 *
 * @param kind - Kind of the page; its title is the kind itself
 * @param methods - Methods of its operations
 * @returns The NAV entry
 */
function entry(kind: NavPage["kind"], methods: NavPage["methods"] = []): NavPage {
    return { title: { en: kind, fr: kind }, kind, methods };
}

describe("catalogue entries and families", () => {
    test("a sub-page belongs to the entry of its first segment", () => {
        assert.equal(catalogueEntry("captcha/verify")?.slug, "captcha");
        assert.equal(catalogueEntry("tic-tac-toe/play")?.slug, "tic-tac-toe");
        assert.equal(catalogueEntry("hash")?.name, "Hash");
        assert.equal(catalogueEntry("changelog/6.1.0"), undefined);
        assert.equal(catalogueEntry("authentication"), undefined);
    });

    test("hyperplanning is unlisted in v6 only", () => {
        const hyperplanning = catalogueEntry("hyperplanning");
        assert.ok(hyperplanning);
        assert.equal(isListed(hyperplanning, "v6"), false);
        assert.equal(isListed(hyperplanning, "v5"), true);
    });

    test("families show the methods of the page and of its sub-pages", () => {
        assert.deepEqual(familyMethods(NAV, "v6", "captcha"), ["get", "post"]);
        assert.deepEqual(familyMethods(NAV, "v6", "pow"), ["get", "post"]);
        assert.deepEqual(familyMethods(NAV, "v6", "chat"), ["get", "post"]);
        assert.deepEqual(familyMethods(NAV, "v6", "tic-tac-toe"), ["post"]);
        assert.deepEqual(familyMethods(NAV, "v6", "hash"), ["post"]);
        assert.deepEqual(familyMethods(NAV, "v6", "nope"), []);
    });

    test("sub-pages are listed in id order and releases are not sub-pages", () => {
        assert.deepEqual(subPages(NAV, "v6", "chat"), [
            "chat/clear",
            "chat/messages",
            "chat/private",
        ]);
        assert.deepEqual(subPages(NAV, "v6", "changelog"), []);
        assert.deepEqual(releasePages(NAV, "v6"), ["changelog/6.1.0", "changelog/6.0.0"]);
    });

    test("releases sort by number, not by text", () => {
        const nav: Nav = {
            v1: {},
            v2: {},
            v3: {},
            v4: {
                changelog: entry("changelog"),
                "changelog/4.9.0": entry("release"),
                "changelog/4.10.0": entry("release"),
                "changelog/4.0.0": entry("release"),
            },
            v5: {},
            v6: {},
        };
        assert.deepEqual(releasePages(nav, "v4"), [
            "changelog/4.10.0",
            "changelog/4.9.0",
            "changelog/4.0.0",
        ]);
    });

    test("titles: catalogue names for entry pages, page titles elsewhere", () => {
        assert.equal(navTitle(NAV, "v6", "qrcode", "fr"), "QR Code");
        assert.equal(
            navTitle(NAV, "v6", "captcha/verify", "fr"),
            `V${E_ACUTE}rification de captcha`,
        );
        assert.equal(navTitle(NAV, "v6", "index", "fr"), "Commencer");
    });
});

describe("sidebar", () => {
    test("v6 lists 49 entries in the 7 categories with the expected counts", () => {
        const model = sidebar(NAV, "v6", "fr");
        assert.deepEqual(
            model.catalogue.map((category) => category.count),
            [9, 8, 7, 10, 6, 6, 3],
        );
        assert.deepEqual(
            model.catalogue.map((category) => category.id),
            CATEGORIES.map((category) => category.id),
        );
        assert.equal(
            model.catalogue.reduce((sum, category) => sum + category.items.length, 0),
            49,
        );
        assert.equal(model.catalogue[0].title, `S${E_ACUTE}curit${E_ACUTE}`);
        assert.equal(model.catalogue[0].anchor, "securite");
    });

    test("groups: Introduction, then the Tools with the releases under the changelog", () => {
        const model = sidebar(NAV, "v6", "en");
        assert.deepEqual(
            model.introduction.map((link) => link.slug),
            ["index", "authentication", "pricing"],
        );
        assert.deepEqual(
            model.tools.map((link) => link.slug),
            ["playground", "changelog", "manifest"],
        );
        assert.deepEqual(
            model.tools[1].children.map((link) => link.href),
            ["/v6/changelog/6.1.0/", "/v6/changelog/6.0.0/"],
        );
    });

    test("entries carry their family methods and their sub-pages, one level", () => {
        const security = sidebar(NAV, "v6", "fr").catalogue[0];
        const captcha = security.items.find((link) => link.slug === "captcha");
        assert.ok(captcha);
        assert.deepEqual(captcha.methods, ["get", "post"]);
        assert.equal(captcha.href, "/fr/v6/captcha/");
        assert.deepEqual(
            captcha.children.map((link) => [link.slug, link.methods]),
            [["captcha/verify", ["post"]]],
        );
    });

    test("an unlisted entry is not in the sidebar, a listed one in an older version is", () => {
        const slugs = (version: "v5" | "v6") =>
            sidebar(NAV, version, "en").catalogue.flatMap((category) =>
                category.items.map((link) => link.slug),
            );
        assert.equal(slugs("v6").includes("hyperplanning"), false);
        if (Object.keys(NAV.v5).length) assert.equal(slugs("v5").includes("hyperplanning"), true);
    });

    test("an empty version gives an empty sidebar", () => {
        const model = sidebar({ ...NAV, v1: {} }, "v1", "en");
        assert.deepEqual(model, { introduction: [], catalogue: [], tools: [] });
    });
});

describe("page order and pager", () => {
    test("Introduction first, the catalogue by category, sub-pages after their parent, Tools last", () => {
        const order = pageOrder(NAV, "v6");
        assert.deepEqual(order.slice(0, 3), ["index", "authentication", "pricing"]);
        assert.deepEqual(order.slice(-3), ["playground", "changelog", "manifest"]);
        const firstSecurity = CATALOGUE.find((item) => item.category === "security");
        assert.equal(order[3], firstSecurity?.slug);
        const captcha = order.indexOf("captcha");
        assert.equal(order[captcha + 1], "captcha/verify");
        const ticTacToe = order.indexOf("tic-tac-toe");
        assert.deepEqual(order.slice(ticTacToe, ticTacToe + 5), [
            "tic-tac-toe",
            "tic-tac-toe/fetch",
            "tic-tac-toe/forfeit",
            "tic-tac-toe/list",
            "tic-tac-toe/play",
        ]);
        assert.equal(order.includes("hyperplanning"), false);
        assert.equal(order.includes("changelog/6.1.0"), false);
        assert.equal(new Set(order).size, order.length);
    });

    test("categories follow the display order of the catalogue", () => {
        const order = pageOrder(NAV, "v6");
        const categoryOf = (slug: string) =>
            CATEGORIES.findIndex((category) => category.id === catalogueEntry(slug)?.category);
        const ranks = order.filter((slug) => catalogueEntry(slug)).map(categoryOf);
        assert.deepEqual(
            ranks,
            [...ranks].sort((a, b) => a - b),
        );
    });

    test("neighbours in the reading order", () => {
        const first = pager(NAV, "v6", "index", "en");
        assert.equal(first.prev, undefined);
        assert.equal(first.next?.slug, "authentication");
        const captcha = pager(NAV, "v6", "captcha", "fr");
        assert.equal(captcha.next?.slug, "captcha/verify");
        assert.equal(captcha.next?.href, "/fr/v6/captcha/verify/");
        const last = pager(NAV, "v6", "changelog", "en");
        assert.equal(last.prev?.slug, "playground");
        assert.equal(last.next, undefined);
    });

    test("release pages page among the changelog and the releases, newest first", () => {
        const newest = pager(NAV, "v6", "changelog/6.1.0", "en");
        assert.equal(newest.prev?.slug, "changelog");
        assert.equal(newest.next?.slug, "changelog/6.0.0");
        assert.equal(pager(NAV, "v6", "changelog/6.0.0", "en").next, undefined);
    });

    test("a page outside the order has no pager", () => {
        assert.deepEqual(pager(NAV, "v6", "hyperplanning", "en"), {});
        assert.deepEqual(pager(NAV, "v6", "nope", "en"), {});
    });
});

describe("breadcrumb", () => {
    test("Catalog, category, page for an entry", () => {
        assert.deepEqual(crumbs(NAV, "v6", "hash", "fr"), [
            { type: "group", group: "catalogue", href: "/fr/#catalogue" },
            { type: "link", title: `S${E_ACUTE}curit${E_ACUTE}`, href: "/fr/#securite" },
            { type: "current", title: "Hash" },
        ]);
    });

    test("a sub-page links its parent entry", () => {
        assert.deepEqual(crumbs(NAV, "v6", "captcha/verify", "en").slice(2), [
            { type: "link", title: "Captcha", href: "/v6/captcha/" },
            { type: "current", title: "Captcha Verification" },
        ]);
    });

    test("Tools, Changelog, release; Introduction pages", () => {
        assert.deepEqual(crumbs(NAV, "v6", "changelog/6.1.0", "en"), [
            { type: "group", group: "tools" },
            { type: "link", title: "Changelog", href: "/v6/changelog/" },
            { type: "current", title: "6.1.0" },
        ]);
        assert.deepEqual(crumbs(NAV, "v6", "authentication", "fr"), [
            { type: "group", group: "introduction" },
            { type: "current", title: "Authentification" },
        ]);
        assert.deepEqual(crumbs(NAV, "v6", "nope", "fr"), []);
    });
});

describe("Toc entries", () => {
    test("hash: short labels from the block types, the title elsewhere", async () => {
        const page = await getPage("v6", "hash");
        assert.ok(page);
        assert.deepEqual(
            tocEntries(page, "fr").map((item) => [item.id, item.level, item.label ?? item.title]),
            [
                ["parameters", 2, "params"],
                ["available-methods", 2, `M${E_ACUTE}thodes disponibles`],
                ["code-examples", 2, "examples"],
                ["response-fields", 2, "fields"],
                ["error-handling", 2, "errors"],
            ],
        );
    });

    test("level 3 sections are listed, the preamble is not", async () => {
        const page = await getPage("v6", "changelog");
        assert.ok(page);
        const entries = tocEntries(page, "en");
        assert.ok(entries.length > 0);
        assert.ok(entries.every((item) => item.id !== ""));
        assert.ok(entries.every((item) => item.level === 2 || item.level === 3));
    });

    test("a one-language section is listed in its language only", () => {
        const page: Page = {
            version: "v3",
            id: "x",
            kind: "article",
            title: { en: "X", fr: "X" },
            sections: [
                { id: "", blocks: [] },
                { id: "a", level: 2, title: { en: "A", fr: "" }, only: "en", blocks: [] },
                {
                    id: "b",
                    level: 3,
                    title: { en: "B", fr: "B" },
                    blocks: [{ type: "try", op: "default", autoSend: true }],
                },
            ],
        };
        assert.deepEqual(
            tocEntries(page, "fr").map((item) => item.id),
            ["b"],
        );
        assert.deepEqual(tocEntries(page, "en")[1], { id: "b", level: 3, title: "B" });
    });
});

describe("slim header facts", () => {
    const meta = async (version: Version, id: string, lang: Lang) => {
        const page = await getPage(version, id);
        assert.ok(page);
        return slimMeta(NAV, version, id, page, lang);
    };

    test("an endpoint page with a Try operation gives its name, category, back link and methods", async () => {
        assert.deepEqual(await meta("v6", "hash", "en"), {
            name: "Hash",
            category: CATEGORIES.find((category) => category.id === "security")?.title.en,
            back: "/#securite",
            methods: ["post"],
        });
        const fr = await meta("v6", "hash", "fr");
        assert.equal(fr?.back, "/fr/#securite");
        assert.equal(fr?.category, CATEGORIES.find((c) => c.id === "security")?.title.fr);
    });

    test("a sub-page keeps the family category and its own method", async () => {
        const verify = await meta("v6", "pow/verify", "en");
        assert.deepEqual(verify?.methods, ["post"]);
        assert.equal(verify?.name, NAV.v6["pow/verify"].title.en);
    });

    test("pages without a live Try operation keep the full header", async () => {
        for (const id of ["hyperplanning", "index", "changelog", "playground", "pricing"]) {
            assert.equal(await meta("v6", id, "en"), null, id);
        }
        assert.equal(await meta("v5", "changelog/5.6.0", "fr"), null);
    });
});
