import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { NAV } from "@/data/nav";
import { LATEST, VERSIONS } from "@/data/versions";
import type { LegacyPage } from "@/lib/redirect";
import type { Lang, Page } from "@/types/content";
import type { Nav } from "@/types/nav";

import {
    escapeHtml,
    type OldPage,
    type OldUrls,
    REDIRECT_MAX,
    redirectHtml,
    redirectPlan,
    type RedirectText,
    redirectTexts,
} from "../redirects";

// A page whose French section kept the slug of the legacy heading as an alias
const PAGE: Page = {
    version: "v6",
    id: "hash",
    kind: "endpoint",
    title: { en: "Hash", fr: "Hash" },
    sections: [
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Parametres" },
            aliases: ["parametres"],
            blocks: [],
        },
    ],
};

/**
 * Gives the texts of a redirect page in the tests; the real ones come from the messages.
 *
 * @param lang - Language of the redirect page
 * @param page - Legacy page, null for the home
 * @returns The page id and language as the title, and a fixed link text
 */
function testText(lang: Lang, page: LegacyPage | null): RedirectText {
    return { title: page ? `${page.id} (${lang})` : "home", link: "Go" };
}

/**
 * Builds a legacy URL record as captured from the old build.
 *
 * @param version - Version of the legacy page
 * @param lang - Language segment of the legacy URL
 * @param id - Page id, also the last segment of the legacy URL
 * @returns The record of src/lib/oldUrls.json
 */
function old(version: OldPage["version"], lang: OldPage["lang"], id: string): OldPage {
    const url = `/${version}/${lang}/${id}`;
    return { version, lang, id, url, html: `${url}.html`, file: `${url.slice(1)}.html` };
}

/**
 * Wraps legacy pages as an inventory.
 *
 * @param pages - Legacy pages the inventory lists
 * @returns An inventory of those pages with no home file
 */
function inventory(pages: OldPage[]): OldUrls {
    return { counts: { pages: pages.length, homes: 0, html: 0 }, notFound: "", homes: [], pages };
}

describe("redirect page", () => {
    const html = redirectHtml(
        "/fr/v6/hash/",
        "fr",
        { parametres: "parameters" },
        {
            title: 'Hash <"v6">',
            link: "Redirection vers Hash",
        },
    );

    test("canonical, script, refresh and noscript link to the new path", () => {
        assert.ok(html.startsWith('<!doctype html>\n<html lang="fr">'));
        assert.ok(html.includes('<meta charset="utf-8">'));
        assert.ok(html.includes('<link rel="canonical" href="https://moxon.dev/fr/v6/hash/">'));
        assert.ok(html.includes('<meta http-equiv="refresh" content="0; url=/fr/v6/hash/">'));
        assert.ok(html.includes('<noscript><a href="/fr/v6/hash/">Redirection vers Hash</a>'));
        assert.ok(html.includes("<title>Hash &lt;&quot;v6&quot;&gt;</title>"));
        assert.ok(Buffer.byteLength(html) < REDIRECT_MAX);
    });

    test("the script keeps the query and remaps a legacy fragment", () => {
        const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? "";
        const run = (search: string, hash: string) => {
            let target = "";
            const location = { search, hash, replace: (url: string) => (target = url) };
            new Function("location", script)(location);
            return target;
        };
        assert.equal(run("", ""), "/fr/v6/hash/");
        assert.equal(run("?a=1", "#parametres"), "/fr/v6/hash/?a=1#parameters");
        assert.equal(run("", "#p-text"), "/fr/v6/hash/#p-text");
        assert.equal(run("", "#constructor"), "/fr/v6/hash/#constructor");
    });

    test("a fragment map cannot close the script element", () => {
        const page = redirectHtml("/v6/", "en", { "</script>": "x" }, { title: "t", link: "l" });
        assert.equal(page.split("</script>").length, 2);
        assert.equal(escapeHtml(`a&b<c>"d"`), "a&amp;b&lt;c&gt;&quot;d&quot;");
    });
});

describe("redirect plan", () => {
    const nav = Object.fromEntries(
        VERSIONS.map((def) => [def.id, def.id === "v6" ? { hash: NAV.v6.hash } : {}]),
    ) as Nav;
    const pages = new Map([["v6/hash", PAGE]]);

    test("two files per legacy page of a published version, plus fr.html", () => {
        const plan = redirectPlan(
            inventory([old("v6", "fr", "hash"), old("v4", "en", "hash")]),
            nav,
            pages,
            testText,
        );
        assert.deepEqual(plan.problems, []);
        assert.equal(plan.pages, 1);
        assert.equal(plan.skipped, 1);
        assert.deepEqual(
            plan.files.map((file) => file.file),
            ["v6/fr/hash/index.html", "v6/fr/hash.html", "fr.html"],
        );
        assert.ok(plan.files[0].html.includes('"parametres":"parameters"'));
        assert.ok(plan.files[2].html.includes("url=/fr/"));
    });

    test("a legacy page of a published version without its page is a problem", () => {
        const plan = redirectPlan(inventory([old("v6", "en", "gone")]), nav, pages, testText);
        assert.equal(plan.pages, 0);
        assert.deepEqual(plan.problems, ["/v6/en/gone: no page v6/gone in the published data"]);
    });

    test("titles from the messages: the template, and the version on older versions", () => {
        const textOf = redirectTexts(process.cwd(), NAV);
        assert.deepEqual(textOf("en", old(LATEST, "en", "hash")), {
            title: "Hash - moxon",
            link: "Redirecting to Hash - moxon",
        });
        if (Object.keys(NAV.v5).length) {
            assert.equal(textOf("fr", old("v5", "fr", "hash")).title, "Hash, v5 - moxon");
        }
        assert.equal(textOf("en", null).title, "moxon - API documentation");
    });
});
