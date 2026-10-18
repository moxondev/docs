import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, test } from "node:test";

import { createTranslator } from "next-intl";

import { CATALOGUE } from "@/data/catalogue";
import { NAV } from "@/data/nav";

import {
    docParams,
    docTitle,
    getPage,
    loadPages,
    type MetaTranslate,
    pageId,
    pageMetadata,
    resolveDoc,
    slugOf,
} from "@/lib/pages";
import type { Lang, Page } from "@/types/content";

/**
 * Builds the translator of the meta namespace from the committed messages, as next-intl does on
 * the server.
 *
 * @param lang - Language of the messages
 * @returns The translator, typed as pageMetadata takes it
 */
function metaOf(lang: Lang): MetaTranslate {
    const meta: unknown = JSON.parse(readFileSync(`messages/${lang}/meta.json`, "utf8"));
    const t = createTranslator({ locale: lang, messages: { meta }, namespace: "meta" });
    return (key, values) => t(key as never, values as never);
}

/**
 * Builds a page without a lead, to follow the description chain.
 *
 * @param id - Page id in v6
 * @param kind - Kind of the page
 * @returns The page module
 */
function bare(id: string, kind: Page["kind"]): Page {
    return { version: "v6", id, kind, title: { en: "T", fr: "T" }, sections: [] };
}

describe("route params", () => {
    test("ids and catch-all segments are inverse, the home has no segment", () => {
        assert.equal(pageId(undefined), "index");
        assert.equal(pageId([]), "index");
        assert.equal(pageId(["captcha", "verify"]), "captcha/verify");
        assert.deepEqual(slugOf("index"), []);
        assert.deepEqual(slugOf("changelog/6.1.0"), ["changelog", "6.1.0"]);
    });

    test("one route per page of the navigation, in every published version", () => {
        const params = docParams();
        const pages = Object.values(NAV).reduce((sum, nav) => sum + Object.keys(nav).length, 0);
        assert.equal(params.length, pages);
        const keys = params.map(({ version, slug }) => `${version}/${pageId(slug)}`);
        assert.equal(new Set(keys).size, keys.length);
        assert.ok(keys.includes("v6/index"));
        assert.deepEqual(
            params.find(({ version, slug }) => version === "v6" && slug.length === 0),
            { version: "v6", slug: [] },
        );
        assert.ok(params.some(({ slug }) => slug.join("/") === "changelog/6.1.0"));
        assert.ok(params.every(({ version }) => Object.keys(NAV[version]).length > 0));
    });
});

describe("page loading", () => {
    test("a known page loads, an unknown version, page or prototype key gives null", async () => {
        const hash = await getPage("v6", "hash");
        assert.equal(hash?.id, "hash");
        assert.equal(hash?.version, "v6");
        assert.equal(await getPage("v6", "nope"), null);
        assert.equal(await getPage("v6", "constructor"), null);
        assert.equal(await getPage("v6", "__proto__"), null);
        assert.equal(await getPage("v9", "hash"), null);
        assert.equal(await getPage("fr", "index"), null);
    });

    test("every page of a version loads, with its own version and id", async () => {
        const pages = await loadPages("v6");
        assert.equal(pages.length, Object.keys(NAV.v6).length);
        assert.ok(pages.every((page) => page.version === "v6" && page.id in NAV.v6));
        assert.deepEqual(await loadPages("v1"), []);
    });

    test("route params resolve to the page or to null", async () => {
        const doc = await resolveDoc(
            Promise.resolve({ version: "v6", slug: ["captcha", "verify"] }),
        );
        assert.equal(doc?.id, "captcha/verify");
        assert.equal(doc?.page.id, "captcha/verify");
        assert.equal((await resolveDoc(Promise.resolve({ version: "v6" })))?.id, "index");
        assert.equal(await resolveDoc(Promise.resolve({ version: "v6", slug: ["x"] })), null);
        assert.equal(await resolveDoc(Promise.resolve({ version: "latest", slug: [] })), null);
    });
});

describe("page metadata", () => {
    test("the latest version shows the title, older ones add the version", () => {
        assert.equal(docTitle("v6", "Hash", metaOf("en")), "Hash");
        assert.equal(docTitle("v5", "Hash", metaOf("fr")), "Hash, v5");
    });

    test("title, lead as description, canonical and alternates", async () => {
        const page = await getPage("v6", "hash");
        assert.ok(page);
        const meta = pageMetadata("en", { version: "v6", id: "hash", page }, metaOf("en"));
        assert.equal(meta.title, "Hash");
        assert.ok(String(meta.description).startsWith("The /hash endpoint converts a string"));
        assert.deepEqual(meta.alternates, {
            canonical: "/v6/hash/",
            languages: { en: "/v6/hash/", fr: "/fr/v6/hash/", "x-default": "/v6/hash/" },
        });
        assert.equal((meta.openGraph as { title: string }).title, "Hash - moxon");
    });

    test("an older version: versioned title and its own paths", async () => {
        const page = await getPage("v5", "hash");
        if (!page) return;
        const meta = pageMetadata("fr", { version: "v5", id: "hash", page }, metaOf("fr"));
        assert.equal(meta.title, "Hash, v5");
        assert.equal(meta.alternates?.canonical, "/fr/v5/hash/");
    });

    test("without a lead: the catalogue summary of the entry page, else the kind sentence", async () => {
        const summary = CATALOGUE.find((item) => item.slug === "hash")?.summary.en;
        const entry = pageMetadata(
            "en",
            { version: "v6", id: "hash", page: bare("hash", "endpoint") },
            metaOf("en"),
        );
        assert.equal(entry.description, summary);
        const sub = pageMetadata(
            "en",
            { version: "v6", id: "captcha/verify", page: bare("captcha/verify", "endpoint") },
            metaOf("en"),
        );
        assert.equal(
            sub.description,
            "The Captcha endpoint of the moxon API v6: parameters, response and errors.",
        );
        const changelog = await getPage("v6", "changelog");
        assert.ok(changelog);
        const history = pageMetadata(
            "en",
            { version: "v6", id: "changelog", page: changelog },
            metaOf("en"),
        );
        assert.equal(
            history.description,
            "Release history of the moxon API v6, with the changes of each release.",
        );
        const release = await getPage("v6", "changelog/6.1.0");
        assert.ok(release);
        const notes = pageMetadata(
            "en",
            { version: "v6", id: "changelog/6.1.0", page: release },
            metaOf("en"),
        );
        assert.equal(notes.title, "6.1.0");
        assert.ok(String(notes.description).includes("release 6.1.0"));
    });
});
