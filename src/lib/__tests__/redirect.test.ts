import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";

import {
    getSmartRedirect,
    getUserLang,
    LEGACY_HOME_FILES,
    legacyFiles,
    legacyUrl,
} from "@/lib/redirect";
import type { Lang, PageKind, Version } from "@/types/content";
import type { Nav, NavPage } from "@/types/nav";

interface LegacyEntry {
    version: Version;
    lang: Lang;
    id: string;
    url: string;
    html: string;
    file: string;
}

interface LegacyUrls {
    counts: { pages: number; homes: number; html: number };
    homes: { lang: Lang; url: string; html: string; file: string }[];
    pages: LegacyEntry[];
}

const URLS = JSON.parse(
    readFileSync(join(import.meta.dirname, "../oldUrls.json"), "utf8"),
) as LegacyUrls;

/**
 * Builds a navigation index holding exactly the pages of the legacy site, the set that NAV
 * holds once every version is promoted.
 *
 * @returns Nav with one entry per legacy page id, kinds guessed from the id
 */
function legacyNav(): Nav {
    const nav: Nav = { v1: {}, v2: {}, v3: {}, v4: {}, v5: {}, v6: {} };
    for (const page of URLS.pages) {
        const kind: PageKind =
            page.id === "index"
                ? "index"
                : page.id.startsWith("changelog/")
                  ? "release"
                  : "endpoint";
        nav[page.version][page.id] = { title: { en: page.id, fr: page.id }, kind, methods: [] };
    }
    return nav;
}

const NAV = legacyNav();

type Row = [path: string, detected: Lang, expected: string | null];

// The rows of the redirect table in order: incoming path, detected language, expected target
const ROWS: readonly Row[] = [
    ["/latest", "en", "/v6/"],
    ["/latest", "fr", "/fr/v6/"],
    ["/latest/", "en", "/v6/"],
    ["/latest/hash", "en", "/v6/hash/"],
    ["/latest/hash/", "fr", "/fr/v6/hash/"],
    ["/latest/captcha/verify", "en", "/v6/captcha/verify/"],
    ["/latest/zzz", "en", "/v6/"],
    ["/latest/zzz", "fr", "/fr/v6/"],
    ["/changelog/latest", "en", "/v6/changelog/6.1.0/"],
    ["/changelog/latest/", "fr", "/fr/v6/changelog/6.1.0/"],
    ["/6.0.0", "en", "/v6/changelog/6.0.0/"],
    ["/6.0.0", "fr", "/fr/v6/changelog/6.0.0/"],
    ["/changelog/6.0.0", "en", "/v6/changelog/6.0.0/"],
    ["/changelog/6.1.0/", "en", "/v6/changelog/6.1.0/"],
    ["/5.6.0", "en", "/v5/changelog/5.6.0/"],
    ["/changelog/4.0.0", "fr", "/fr/v4/changelog/4.0.0/"],
    ["/3.0.0", "en", "/v6/changelog/"],
    ["/1.0.0", "fr", "/fr/v6/changelog/"],
    ["/6.9.9", "en", "/v6/changelog/"],
    ["/v5", "en", "/v5/"],
    ["/v5/", "fr", "/fr/v5/"],
    ["/v5/hash", "en", "/v5/hash/"],
    ["/v5/hash", "fr", "/fr/v5/hash/"],
    ["/v5/zzz", "en", "/v5/"],
    ["/v3/captcha/verify", "en", "/v3/"],
    ["/v6/captcha/verify/zzz", "fr", "/fr/v6/"],
    ["/fr/hash", "en", "/fr/v6/hash/"],
    ["/fr/hash/", "en", "/fr/v6/hash/"],
    ["/en/latest/hash", "fr", "/v6/hash/"],
    ["/en/hash", "fr", "/v6/hash/"],
    ["/fr/v5/zzz", "en", "/fr/v5/"],
    ["/fr/latest", "en", "/fr/v6/"],
    ["/fr/changelog/latest", "en", "/fr/v6/changelog/6.1.0/"],
    ["/fr/6.0.0", "en", "/fr/v6/changelog/6.0.0/"],
    ["/fr/zzz", "en", null],
    ["/en/zzz", "fr", null],
    ["/hash", "en", "/v6/hash/"],
    ["/hash", "fr", "/fr/v6/hash/"],
    ["/hash/", "en", "/v6/hash/"],
    ["/captcha/verify", "en", "/v6/captcha/verify/"],
    ["/changelog", "fr", "/fr/v6/changelog/"],
    ["/encode", "en", "/v6/encode/"],
    ["/fr/encode", "en", "/fr/v6/encode/"],
    ["/zzz", "en", null],
    ["/encode/zzz", "en", null],
    ["/v6/en/hash", "fr", "/v6/hash/"],
    ["/v6/en/hash/", "en", "/v6/hash/"],
    ["/v6/en/hash.html", "fr", "/v6/hash/"],
    ["/v6/en/encode", "fr", "/v6/encode/"],
    ["/v6/en/index", "en", "/v6/"],
    ["/v6/en/index.html", "fr", "/v6/"],
    ["/v6/en", "fr", "/v6/"],
    ["/v6/en/", "en", "/v6/"],
    ["/v6/en.html", "fr", "/v6/"],
    ["/v6/en/zzz", "fr", "/v6/"],
    ["/v6/en/changelog/6.1.0", "en", "/v6/changelog/6.1.0/"],
    ["/v6/en/changelog/6.1.0.html", "en", "/v6/changelog/6.1.0/"],
    ["/v6/fr/hash", "en", "/fr/v6/hash/"],
    ["/v6/fr/hash.html", "en", "/fr/v6/hash/"],
    ["/v6/fr/index", "en", "/fr/v6/"],
    ["/v6/fr", "en", "/fr/v6/"],
    ["/v6/fr.html", "en", "/fr/v6/"],
    ["/v6/fr/zzz", "en", "/fr/v6/"],
    ["/v5/fr/zzz.html", "en", "/fr/v5/"],
    ["/fr", "en", "/fr/"],
    ["/fr.html", "en", "/fr/"],
    ["/index.html", "en", "/"],
    ["/index.html", "fr", "/"],
    ["/index", "fr", "/"],
    ["/fr/index.html", "en", "/fr/"],
    ["/hash.html", "en", "/v6/hash/"],
    ["/v5/hash.html", "fr", "/fr/v5/hash/"],
    ["/latest/hash.html", "en", "/v6/hash/"],
    ["/fr/hash.html", "en", "/fr/v6/hash/"],
    ["/en", "fr", "/"],
    ["/en/", "fr", "/"],
    ["/", "fr", null],
    ["/fr/", "en", null],
    ["/v7", "en", null],
    ["/v7/hash", "en", null],
    ["/zzz/yyy", "en", null],
    ["/favicon.ico", "en", null],
    ["/_next/static/x.js", "en", null],
    ["/zzz.html", "en", null],
];

describe("getSmartRedirect, the table of paths and their targets", () => {
    for (const [path, detected, expected] of ROWS) {
        test(`${path} (detected ${detected}) -> ${expected ?? "404 page"}`, () => {
            assert.equal(getSmartRedirect(path, NAV, detected), expected);
        });
    }

    test("every target is a fixed point: a page of its language, never sent further", () => {
        for (const [path, detected] of ROWS) {
            const target = getSmartRedirect(path, NAV, detected);
            if (target === null) continue;
            const lang: Lang = target.startsWith("/fr/") ? "fr" : "en";
            assert.equal(getSmartRedirect(target, NAV, lang), null, path);
            assert.ok(target.endsWith("/"), target);
        }
    });

    test("a version without pages renders the 404 page instead of looping", () => {
        const partial: Nav = { ...NAV, v4: {} };
        assert.equal(getSmartRedirect("/v4/hash", partial, "en"), null);
        assert.equal(getSmartRedirect("/v4/en/hash", partial, "en"), null);
        assert.equal(getSmartRedirect("/v5/hash", partial, "en"), "/v5/hash/");
    });

    test("a segment named like an Object member is not a page", () => {
        assert.equal(getSmartRedirect("/constructor", NAV, "en"), null);
        assert.equal(getSmartRedirect("/fr/valueOf", NAV, "en"), null);
        assert.equal(getSmartRedirect("/latest/toString", NAV, "en"), "/v6/");
        assert.equal(getSmartRedirect("/v6/hasOwnProperty", NAV, "fr"), "/fr/v6/");
        assert.equal(getSmartRedirect("/v5/en/__proto__.html", NAV, "fr"), "/v5/");
    });

    test("a language prefix is a whole segment, never a prefix of a page id (Q6)", () => {
        assert.equal(getSmartRedirect("/encode", NAV, "fr"), "/fr/v6/encode/");
        assert.equal(getSmartRedirect("/v6/encode", NAV, "fr"), "/fr/v6/encode/");
        assert.equal(getSmartRedirect("/fragment", NAV, "en"), null);
    });
});

describe("getSmartRedirect, every URL of oldUrls.json", () => {
    test("the inventory holds 500 pages and 2 homes", () => {
        assert.equal(URLS.pages.length, 500);
        assert.equal(URLS.counts.pages, 500);
        assert.equal(URLS.homes.length, 2);
    });

    test("each legacy page URL, its .html form and its slash form land on its new page", () => {
        let checked = 0;
        for (const page of URLS.pages) {
            const want = legacyUrl(page);
            const forms = [page.url, page.html, page.url.endsWith("/") ? page.url : `${page.url}/`];
            for (const form of forms) {
                for (const detected of ["en", "fr"] as const) {
                    assert.equal(
                        getSmartRedirect(form, NAV, detected),
                        want,
                        `${form} ${detected}`,
                    );
                    checked += 1;
                }
            }
        }
        assert.equal(checked, 500 * 3 * 2);
    });

    test("the new page of a legacy page is in its language and version", () => {
        for (const page of URLS.pages) {
            const want = page.id === "index" ? "" : `${page.id}/`;
            const prefix = page.lang === "fr" ? "/fr" : "";
            assert.equal(legacyUrl(page), `${prefix}/${page.version}/${want}`);
        }
    });

    test("the homes", () => {
        for (const home of URLS.homes) {
            const want = home.lang === "fr" ? "/fr/" : "/";
            assert.equal(getSmartRedirect(home.html, NAV, "en"), want, home.html);
            if (home.url !== want) assert.equal(getSmartRedirect(home.url, NAV, "en"), want);
        }
        assert.equal(getSmartRedirect("/", NAV, "fr"), null);
    });
});

describe("legacyFiles", () => {
    test("folder form and .html twin, index pages at the language folder", () => {
        assert.deepEqual(legacyFiles({ version: "v6", lang: "en", id: "hash" }), [
            "v6/en/hash/index.html",
            "v6/en/hash.html",
        ]);
        assert.deepEqual(legacyFiles({ version: "v6", lang: "fr", id: "index" }), [
            "v6/fr/index.html",
            "v6/fr.html",
        ]);
        assert.deepEqual(legacyFiles({ version: "v5", lang: "fr", id: "changelog/5.6.0" }), [
            "v5/fr/changelog/5.6.0/index.html",
            "v5/fr/changelog/5.6.0.html",
        ]);
    });

    test("two files per legacy page, all distinct, one of them the file of the old site", () => {
        const files = new Set<string>(LEGACY_HOME_FILES.map((home) => home.file));
        for (const page of URLS.pages) {
            const pair = legacyFiles(page);
            assert.ok(pair.includes(page.file), `${page.file} not in ${pair.join(", ")}`);
            for (const file of pair) {
                assert.ok(!files.has(file), `collision ${file}`);
                files.add(file);
            }
        }
        assert.equal(files.size, 500 * 2 + LEGACY_HOME_FILES.length);
    });

    test("the French home file of the legacy site", () => {
        assert.deepEqual(LEGACY_HOME_FILES, [{ file: "fr.html", target: "/fr/" }]);
        assert.ok(URLS.homes.some((home) => home.file === "fr.html"));
    });
});

describe("getUserLang", () => {
    test("the saved choice wins", () => {
        assert.equal(getUserLang("fr", ["en-US"]), "fr");
        assert.equal(getUserLang("en", ["fr-FR"]), "en");
    });

    test("else the first browser language the site has", () => {
        assert.equal(getUserLang(null, ["fr-FR", "en"]), "fr");
        assert.equal(getUserLang("de", ["de-DE", "fr-CA"]), "fr");
        assert.equal(getUserLang(null, ["de-DE", "en-GB", "fr"]), "en");
        assert.equal(getUserLang(null, ["FR"]), "fr");
    });

    test("else English", () => {
        assert.equal(getUserLang(null, []), "en");
        assert.equal(getUserLang(null, ["de-DE", "es"]), "en");
    });

    test("with no argument it reads the runtime (Node has a navigator) and never throws", () => {
        assert.ok(["en", "fr"].includes(getUserLang()));
    });
});
