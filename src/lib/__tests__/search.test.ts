import assert from "node:assert/strict";
import { before, describe, test } from "node:test";
import { gzipSync } from "node:zlib";

import { NAV } from "@/data/nav";
import { pageAnchors } from "@/lib/anchors";
import { loadPages } from "@/lib/pages";
import { href } from "@/lib/routes";
import {
    buildDocs,
    countKinds,
    createIndex,
    docHref,
    docKey,
    foldTerm,
    groupDocs,
    indexFile,
    indexUrl,
    matchesFilters,
    pageParams,
    parseQuery,
    playgroundHref,
    searchDocs,
    type SearchIndex,
    searchScope,
    suggestedDocs,
    suggestQuery,
    typoDistance,
} from "@/lib/search";
import type { Lang } from "@/types/content";
import type { SearchDoc } from "@/types/search";

// Letters built from their code points so that this file stays pure ASCII
const E_ACUTE = String.fromCodePoint(0xe9);

// Index files of v6, built once from the promoted page modules
const DOCS: Record<Lang, SearchDoc[]> = { en: [], fr: [] };
const INDEX: Partial<Record<Lang, SearchIndex>> = {};

// Words of the arrow icon, as public.ts reads them from messages/*/aria.json
const ICONS: Record<Lang, { "arrow-right": string }> = {
    en: { "arrow-right": "to" },
    fr: { "arrow-right": "vers" },
};

// Queries and the first result they must give (kind and page path)
const FIRST_HITS: readonly [string, Lang, SearchDoc["k"], string][] = [
    ["hash", "en", "endpoint", "/v6/hash/"],
    ["post:hash", "en", "endpoint", "/v6/hash/"],
    ["post: hash", "fr", "endpoint", "/fr/v6/hash/"],
    ["/uuid", "en", "endpoint", "/v6/uuid/"],
    ["/v6/uuid/", "fr", "endpoint", "/fr/v6/uuid/"],
    ["qr", "en", "endpoint", "/v6/qrcode/"],
    ["jwt", "en", "endpoint", "/v6/jwt/"],
    ["pow", "fr", "endpoint", "/fr/v6/pow/"],
    ["captcha", "en", "endpoint", "/v6/captcha/"],
    ["get: ip", "en", "endpoint", "/v6/ip/"],
    ["uuid", "fr", "endpoint", "/fr/v6/uuid/"],
    ["password", "en", "endpoint", "/v6/password/"],
    ["/tic-tac-toe", "en", "endpoint", "/v6/tic-tac-toe/"],
    ["count", "en", "param", "/v6/password/"],
    ["429", "en", "error", "/v6/chat/"],
];

// Words found only in prose, tables or response-field descriptions, and their page
const RECALL: readonly [string, Lang, string][] = [
    ["Luhn", "en", "/v6/credit/"],
    ["Retry-After", "en", "/v6/authentication/"],
    ["base64url", "en", "/v6/jwt/"],
    ["authenticator", "en", "/v6/otp/"],
    ["scryptSync", "en", "/v6/symmetric/"],
    ["Shannon", "en", "/v6/password/"],
    ["subsequence", "en", "/v6/diff/"],
    ["initialization vector", "en", "/v6/symmetric/"],
    ["fingerprint", "en", "/v6/pow/"],
    ["randomInt", "en", "/v6/password/"],
    ["glyphs", "en", "/v6/captcha/"],
    ["TypeScript", "en", "/v6/manifest/"],
    ["unauthenticated", "en", "/v6/authentication/"],
    ["md5WithRSAEncryption", "en", "/v6/hash/"],
    [`luminosit${E_ACUTE}`, "fr", "/fr/v6/color/"],
    ["kilooctets", "fr", "/fr/v6/convert/"],
    ["transposition", "fr", "/fr/v6/matrix/"],
    ["unaire", "fr", "/fr/v6/evaluate/"],
    [`incr${E_ACUTE}mentation`, "fr", "/fr/v6/semver/"],
    ["harmonieuse", "fr", "/fr/v6/palette/"],
];

/**
 * Gives the index of a language, built in the before hook.
 *
 * @param lang - Language of the index
 * @returns The v6 index of that language
 */
function indexOf(lang: Lang): SearchIndex {
    const index = INDEX[lang];
    assert.ok(index, "the index is built before the tests");
    return index;
}

/**
 * Runs a query typed in the search field.
 *
 * @param input - Text of the field
 * @param lang - Language of the index
 * @returns The ranked results
 */
function run(input: string, lang: Lang): SearchDoc[] {
    return searchDocs(indexOf(lang), parseQuery(input));
}

before(async () => {
    const pages = await loadPages("v6");
    for (const lang of ["en", "fr"] as const) {
        DOCS[lang] = buildDocs(pages, lang, { nav: NAV, icons: ICONS[lang] });
        INDEX[lang] = createIndex(DOCS[lang]);
    }
});

describe("query language (plan 2.10)", () => {
    test("method prefixes, routes and statuses are filters, the rest is text", () => {
        assert.deepEqual(parseQuery("  post:hash "), { text: "hash", method: "post" });
        assert.deepEqual(parseQuery("GET: ip"), { text: "ip", method: "get" });
        assert.deepEqual(parseQuery("/uuid"), { text: "", route: "/uuid" });
        assert.deepEqual(parseQuery("/V6/UUID/"), { text: "", route: "/uuid" });
        assert.deepEqual(parseQuery("400"), { text: "", status: 400 });
        assert.deepEqual(parseQuery("400 hash"), { text: "hash", status: 400 });
        assert.deepEqual(parseQuery("rate: limit"), { text: "rate: limit" });
        assert.deepEqual(parseQuery("/"), { text: "/" });
        assert.deepEqual(parseQuery("2000 requests"), { text: "2000 requests" });
        assert.deepEqual(parseQuery(""), { text: "" });
    });

    test("filters read the method, the route without its version and the status", () => {
        const doc: SearchDoc = {
            k: "error",
            t: "x",
            u: "/v6/hash/",
            h: "e-1",
            r: "/v6/hash",
            m: ["post"],
            n: 400,
        };
        assert.equal(matchesFilters(doc, { text: "", method: "post" }), true);
        assert.equal(matchesFilters(doc, { text: "", method: "get" }), false);
        assert.equal(matchesFilters(doc, { text: "", route: "/ha" }), true);
        assert.equal(matchesFilters(doc, { text: "", route: "/uuid" }), false);
        assert.equal(matchesFilters(doc, { text: "", status: 400 }), true);
        assert.equal(matchesFilters({ ...doc, k: "param" }, { text: "", status: 400 }), false);
        assert.equal(
            matchesFilters({ k: "page", t: "x", u: "/v6/" }, { text: "", method: "get" }),
            false,
        );
    });

    test("terms fold case and accents", () => {
        assert.equal(foldTerm(`S${E_ACUTE}curit${E_ACUTE}`), "securite");
        assert.equal(foldTerm("UUID"), "uuid");
        assert.equal(foldTerm(""), null);
    });

    test("typo distance counts a swap as one edit", () => {
        assert.equal(typoDistance("hsah", "hash"), 1);
        assert.equal(typoDistance("hash", "hash"), 0);
        assert.equal(typoDistance("uiid", "uuid"), 1);
        assert.equal(typoDistance("", "abc"), 3);
    });
});

describe("index documents of v6", () => {
    test("keys are unique and every result opens a page and an id of that page", async () => {
        const pages = await loadPages("v6");
        for (const lang of ["en", "fr"] as const) {
            const keys = DOCS[lang].map(docKey);
            assert.equal(new Set(keys).size, keys.length);
            for (const page of pages) {
                const ids = new Set(pageAnchors(page, lang).ids);
                const own = DOCS[lang].filter((doc) => doc.u === href(lang, "v6", page.id));
                assert.ok(own.length > 0, `${page.id} has documents`);
                for (const doc of own) {
                    if (doc.h) assert.ok(ids.has(doc.h), `${docHref(doc)} exists`);
                }
            }
        }
    });

    test("documents only use the compact keys, and stay within the budget", () => {
        const keys = new Set(["k", "t", "u", "h", "r", "m", "d", "n", "p", "x"]);
        for (const lang of ["en", "fr"] as const) {
            for (const doc of DOCS[lang]) {
                for (const key of Object.keys(doc)) assert.ok(keys.has(key), key);
                assert.ok((doc.x ?? "").length <= 1200);
                assert.ok((doc.d ?? "").length <= 160);
            }
            const gzip = gzipSync(JSON.stringify(DOCS[lang]), { level: 9 }).length;
            assert.ok(gzip <= 100 * 1024, `${lang}: ${gzip} bytes gzip`);
        }
    });

    test("one endpoint document per endpoint page and catalogue entry, with methods", () => {
        const endpoints = DOCS.en.filter((doc) => doc.k === "endpoint");
        const hash = endpoints.find((doc) => doc.u === "/v6/hash/");
        assert.deepEqual(hash && { t: hash.t, r: hash.r, m: hash.m }, {
            t: "Hash",
            r: "/v6/hash",
            m: ["post"],
        });
        const pow = endpoints.find((doc) => doc.u === "/v6/pow/");
        assert.deepEqual(pow?.m, ["get", "post"]);
        const hub = endpoints.find((doc) => doc.u === "/v6/tic-tac-toe/");
        assert.deepEqual(hub && { r: hub.r, m: hub.m }, { r: "/v6/tic-tac-toe", m: ["post"] });
        assert.ok(
            endpoints.some((doc) => doc.u === "/v6/hyperplanning/"),
            "unlisted, searchable",
        );
        assert.equal(
            endpoints.some((doc) => doc.u === "/v6/"),
            false,
        );
    });

    test("parameter rows: description, values count and the type key of the preview", () => {
        const params = pageParams(indexOf("fr"), { k: "endpoint", t: "Hash", u: "/fr/v6/hash/" });
        assert.deepEqual(
            params.map((doc) => [doc.t, doc.h, doc.p, doc.n]),
            [
                ["text", "p-text", "string!", undefined],
                ["method", "p-method", "enum!", 52],
                ["encoding", "p-encoding", "enum", 2],
            ],
        );
        assert.equal(params[0].r, "/v6/hash");
        assert.deepEqual(params[0].m, ["post"]);
        assert.ok(params[1].d?.startsWith("La m"));
    });

    test("error rows carry their status, field rows their type", () => {
        const errors = DOCS.en.filter((doc) => doc.k === "error" && doc.u === "/v6/hash/");
        assert.equal(errors.length, 5);
        assert.ok(errors.every((doc) => doc.n === 400 && doc.h?.startsWith("e-")));
        const field = DOCS.en.find(
            (doc) => doc.k === "field" && doc.h === "f-hash" && doc.u === "/v6/hash/",
        );
        assert.equal(field?.p, "string");
    });

    test("section documents carry the prose of the section", () => {
        const section = DOCS.en.find(
            (doc) => doc.u === "/v6/hash/" && doc.h === "available-methods",
        );
        assert.equal(section?.k, "section");
        assert.ok(section?.x?.includes("md5WithRSAEncryption"));
    });

    test("the arrow icon is read as the word of the language", () => {
        const fr = DOCS.fr.filter((doc) => doc.u === "/fr/v6/encode/").map((doc) => doc.x ?? "");
        assert.ok(fr.some((text) => / vers /.test(text)));
        assert.ok(fr.every((text) => !text.includes("{icon:")));
    });
});

describe("ranking and full-text recall", () => {
    for (const [input, lang, kind, page] of FIRST_HITS) {
        test(`"${input}" (${lang}) opens ${kind} ${page} first`, () => {
            const [first] = run(input, lang);
            assert.ok(first, "a result");
            assert.equal(first.k, kind);
            assert.equal(first.u, page);
        });
    }

    test(`"400" lists the 400 errors only`, () => {
        const hits = run("400", "en");
        assert.ok(hits.length > 100);
        assert.ok(hits.every((doc) => doc.k === "error" && doc.n === 400));
    });

    test("a method filter keeps only rows of that method", () => {
        const hits = run("post: hash", "en");
        assert.ok(hits.length > 0);
        assert.ok(hits.every((doc) => doc.m?.includes("post")));
    });

    for (const [input, lang, page] of RECALL) {
        test(`"${input}" (${lang}) finds ${page}`, () => {
            const pages = run(input, lang).map((doc) => doc.u);
            assert.ok(pages.slice(0, 10).includes(page), pages.slice(0, 10).join(" "));
        });
    }
});

describe("palette helpers", () => {
    test(`"hsah" finds nothing and suggests "hash"`, () => {
        assert.deepEqual(run("hsah", "en"), []);
        assert.equal(suggestQuery(indexOf("en"), parseQuery("hsah")), "hash");
        assert.equal(suggestQuery(indexOf("fr"), parseQuery("hsah")), "hash");
        assert.equal(suggestQuery(indexOf("en"), parseQuery("")), null);
    });

    test("groups follow Endpoints, Parameters, Errors, Pages and are capped", () => {
        const hits = run("hash", "en");
        const groups = groupDocs(hits, 2);
        assert.deepEqual(
            groups.map((group) => group.id),
            ["endpoints", "params", "errors", "pages"],
        );
        assert.ok(groups.every((group) => group.docs.length <= 2));
        const counts = countKinds(hits);
        assert.equal(counts.endpoints + counts.params + counts.errors + counts.pages, hits.length);
        assert.deepEqual(groupDocs([]), []);
    });

    test("the empty palette suggests Hash, UUID, QR Code and the Playground", () => {
        assert.deepEqual(
            suggestedDocs(indexOf("fr"), "fr", "v6").map((doc) => doc.u),
            ["/fr/v6/hash/", "/fr/v6/uuid/", "/fr/v6/qrcode/", "/fr/v6/playground/"],
        );
    });

    test("Ctrl or Cmd+Enter opens the Playground on the page of the result", () => {
        const param: SearchDoc = { k: "param", t: "text", u: "/fr/v6/hash/", h: "p-text" };
        assert.equal(playgroundHref(param, NAV), "/fr/v6/playground/?endpoint=hash");
        assert.equal(
            playgroundHref({ k: "endpoint", t: "x", u: "/v6/captcha/verify/" }, NAV),
            "/v6/playground/?endpoint=captcha/verify",
        );
        assert.equal(playgroundHref({ k: "endpoint", t: "x", u: "/v6/tic-tac-toe/" }, NAV), null);
        assert.equal(playgroundHref({ k: "page", t: "x", u: "/v6/authentication/" }, NAV), null);
        assert.equal(playgroundHref({ k: "page", t: "x", u: "/" }, NAV), null);
        assert.equal(playgroundHref({ k: "page", t: "x", u: "/fr/v6/" }, NAV), null);
        assert.equal(playgroundHref({ k: "endpoint", t: "x", u: "/v6/hyperplanning/" }, NAV), null);
        if (Object.keys(NAV.v5).length) {
            assert.equal(
                playgroundHref({ k: "endpoint", t: "x", u: "/v5/hyperplanning/" }, NAV),
                "/v5/playground/?endpoint=hyperplanning",
            );
        }
    });

    test("index files and scope", () => {
        assert.equal(indexFile("v6", "fr"), "v6fr.json");
        assert.equal(indexUrl("v5", "en"), "/search/v5en.json");
        assert.deepEqual(searchScope("/fr/v5/hash/"), { lang: "fr", version: "v5" });
        assert.deepEqual(searchScope("/fr/"), { lang: "fr", version: "v6" });
        assert.deepEqual(searchScope("/zzz/"), { lang: "en", version: "v6" });
    });
});
