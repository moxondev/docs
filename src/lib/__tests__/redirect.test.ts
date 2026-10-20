import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";
import { createContext, runInContext } from "node:vm";

import { LATEST, VERSIONS } from "@/data/versions";
import { LOCALE_KEY } from "@/i18n/routing";
import {
    aliasAddresses,
    aliasFiles,
    aliasLang,
    aliasScript,
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

// Release of the latest version, the page that /changelog/latest lands on
const RELEASE = VERSIONS[0].release ?? "";

// Pages that the latest version needs in the index even when the legacy site never had it
const LATEST_PAGES = [
    "index",
    "hash",
    "encode",
    "captcha/verify",
    "changelog",
    `changelog/${RELEASE}`,
];

/**
 * Describes a page id of the index, the kind being guessed from the id.
 *
 * @param id - Page id such as "hash" or "changelog/6.1.0"
 * @returns The index entry of the page
 */
function entry(id: string): NavPage {
    const kind: PageKind =
        id === "index" ? "index" : id.startsWith("changelog/") ? "release" : "endpoint";
    return { title: { en: id, fr: id }, kind, methods: [] };
}

/**
 * Builds a navigation index holding exactly the pages of the legacy site, the set that NAV
 * holds once every version is promoted. The legacy site stops at v6, so a latest version that
 * comes later gets the few pages the rows need.
 *
 * @returns Nav with one entry per legacy page id and one empty version per documented version
 */
function legacyNav(): Nav {
    const nav = Object.fromEntries(VERSIONS.map((def) => [def.id, {}])) as Nav;
    for (const page of URLS.pages) nav[page.version][page.id] = entry(page.id);
    for (const id of LATEST_PAGES) nav[LATEST][id] ??= entry(id);
    return nav;
}

const NAV = legacyNav();

type Row = [path: string, detected: Lang, expected: string | null];

// Version home of the latest version, in English and in French
const HOME = `/${LATEST}/`;
const HOME_FR = `/fr/${LATEST}/`;

// A version that does not exist yet: the one after the latest, whatever the latest is
const NEXT = `v${Number(LATEST.slice(1)) + 1}`;

/**
 * The rows of the redirect table in order: incoming path, detected language, expected target.
 * Rows that name a version or a release number keep it literal; the other rows that land on the
 * latest version are built from LATEST.
 */
const ROWS: readonly Row[] = [
    ["/latest", "en", HOME],
    ["/latest", "fr", HOME_FR],
    ["/latest/", "en", HOME],
    ["/latest/hash", "en", `${HOME}hash/`],
    ["/latest/hash/", "fr", `${HOME_FR}hash/`],
    ["/latest/captcha/verify", "en", `${HOME}captcha/verify/`],
    ["/latest/zzz", "en", HOME],
    ["/latest/zzz", "fr", HOME_FR],
    ["/changelog/latest", "en", `${HOME}changelog/${RELEASE}/`],
    ["/changelog/latest/", "fr", `${HOME_FR}changelog/${RELEASE}/`],
    ["/6.0.0", "en", "/v6/changelog/6.0.0/"],
    ["/6.0.0", "fr", "/fr/v6/changelog/6.0.0/"],
    ["/changelog/6.0.0", "en", "/v6/changelog/6.0.0/"],
    ["/changelog/6.1.0/", "en", "/v6/changelog/6.1.0/"],
    ["/5.6.0", "en", "/v5/changelog/5.6.0/"],
    ["/changelog/4.0.0", "fr", "/fr/v4/changelog/4.0.0/"],
    ["/3.0.0", "en", `${HOME}changelog/`],
    ["/1.0.0", "fr", `${HOME_FR}changelog/`],
    ["/6.9.9", "en", "/v6/changelog/"],
    ["/v5", "en", "/v5/"],
    ["/v5/", "fr", "/fr/v5/"],
    ["/v5/hash", "en", "/v5/hash/"],
    ["/v5/hash", "fr", "/fr/v5/hash/"],
    ["/v5/zzz", "en", "/v5/"],
    ["/v3/captcha/verify", "en", "/v3/"],
    ["/v6/captcha/verify/zzz", "fr", "/fr/v6/"],
    ["/fr/hash", "en", `${HOME_FR}hash/`],
    ["/fr/hash/", "en", `${HOME_FR}hash/`],
    ["/en/latest/hash", "fr", `${HOME}hash/`],
    ["/en/hash", "fr", `${HOME}hash/`],
    ["/fr/v5/zzz", "en", "/fr/v5/"],
    ["/fr/latest", "en", HOME_FR],
    ["/fr/changelog/latest", "en", `${HOME_FR}changelog/${RELEASE}/`],
    ["/fr/6.0.0", "en", "/fr/v6/changelog/6.0.0/"],
    ["/fr/zzz", "en", null],
    ["/en/zzz", "fr", null],
    ["/hash", "en", `${HOME}hash/`],
    ["/hash", "fr", `${HOME_FR}hash/`],
    ["/hash/", "en", `${HOME}hash/`],
    ["/captcha/verify", "en", `${HOME}captcha/verify/`],
    ["/changelog", "fr", `${HOME_FR}changelog/`],
    ["/encode", "en", `${HOME}encode/`],
    ["/fr/encode", "en", `${HOME_FR}encode/`],
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
    ["/hash.html", "en", `${HOME}hash/`],
    ["/v5/hash.html", "fr", "/fr/v5/hash/"],
    ["/latest/hash.html", "en", `${HOME}hash/`],
    ["/fr/hash.html", "en", `${HOME_FR}hash/`],
    ["/en", "fr", "/"],
    ["/en/", "fr", "/"],
    ["/", "fr", null],
    ["/fr/", "en", null],
    [`/${NEXT}`, "en", null],
    [`/${NEXT}/hash`, "en", null],
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
        assert.equal(getSmartRedirect("/latest/toString", NAV, "en"), HOME);
        assert.equal(getSmartRedirect("/v6/hasOwnProperty", NAV, "fr"), "/fr/v6/");
        assert.equal(getSmartRedirect("/v5/en/__proto__.html", NAV, "fr"), "/v5/");
    });

    test("a language prefix is a whole segment, never a prefix of a page id", () => {
        assert.equal(getSmartRedirect("/encode", NAV, "fr"), `${HOME_FR}encode/`);
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

describe("aliasAddresses", () => {
    const ADDRESSES = aliasAddresses(NAV);
    const PLAIN = ADDRESSES.filter((address) => !address.startsWith("fr/"));

    test("the latest version, its pages, the changelog shortcut and the releases", () => {
        for (const address of [
            "latest",
            "latest/hash",
            "latest/captcha/verify",
            "hash",
            "encode",
            "captcha/verify",
            "changelog",
            "changelog/latest",
            `changelog/${RELEASE}`,
            RELEASE,
            "5.6.0",
            "changelog/5.6.0",
            "4.0.0",
            "changelog/4.0.0",
        ]) {
            assert.ok(ADDRESSES.includes(address), address);
            assert.ok(ADDRESSES.includes(`fr/${address}`), `fr/${address}`);
        }
    });

    test("the version homes, the index, the versions and every unknown release are left out", () => {
        for (const address of [
            "index",
            "latest/index",
            "v6",
            "v6/hash",
            "3.0.0",
            "changelog/3.0.0",
        ]) {
            assert.ok(!ADDRESSES.includes(address), address);
        }
        assert.ok(ADDRESSES.every((address) => !address.startsWith("en/")));
        assert.ok(ADDRESSES.every((address) => !address.endsWith("/") && !address.startsWith("/")));
    });

    test("distinct, in ascending order, and every address comes with its French form", () => {
        assert.equal(new Set(ADDRESSES).size, ADDRESSES.length);
        assert.deepEqual(ADDRESSES, [...ADDRESSES].sort());
        assert.equal(PLAIN.length * 2, ADDRESSES.length);
        for (const address of PLAIN) assert.ok(ADDRESSES.includes(`fr/${address}`), address);
        assert.deepEqual(aliasAddresses(NAV), ADDRESSES);
    });

    test("one bare address per page of the latest version, none for its home", () => {
        const pages = Object.keys(NAV[LATEST]).filter((id) => id !== "index");
        const releases = VERSIONS.filter((def) => def.changelog).flatMap((def) =>
            Object.keys(NAV[def.id]).filter((id) => /^changelog\/\d+\.\d+\.\d+$/.test(id)),
        );
        assert.ok(releases.length >= 20);
        const wanted = new Set<string>(["latest", "changelog/latest"]);
        for (const id of pages) wanted.add(id).add(`latest/${id}`);
        for (const id of releases) wanted.add(id).add(id.slice("changelog/".length));
        assert.deepEqual(PLAIN, [...wanted].sort());
    });

    test("a version without pages gives no address", () => {
        const partial: Nav = { ...NAV, v4: {} };
        const found = aliasAddresses(partial);
        assert.ok(found.every((address) => !/(^|\/)(changelog\/)?4\.\d+\.\d+$/.test(address)));
        assert.ok(found.includes("5.6.0"));
        assert.ok(ADDRESSES.includes("4.9.0"));
    });

    test("a version whose changelog flag is off is not searched for releases", () => {
        const flags = VERSIONS.map((def) => (def.id === "v5" ? { ...def, changelog: false } : def));
        const found = aliasAddresses(NAV, flags);
        assert.ok(found.every((address) => !/(^|\/)(changelog\/)?5\.\d+\.\d+$/.test(address)));
        assert.ok(found.includes("4.0.0"));
    });

    test("an unpublished latest version leaves the releases and the two fixed shortcuts", () => {
        const found = aliasAddresses({ ...NAV, [LATEST]: {} });
        assert.ok(found.includes("latest"));
        assert.ok(found.includes("changelog/latest"));
        assert.ok(!found.includes("hash"));
        assert.ok(found.includes("5.6.0"));
    });
});

describe("aliasLang and aliasFiles", () => {
    test("the language of the prefix, compared whole", () => {
        assert.equal(aliasLang("fr/hash"), "fr");
        assert.equal(aliasLang("fr/latest/hash"), "fr");
        assert.equal(aliasLang("hash"), null);
        assert.equal(aliasLang("latest/hash"), null);
        assert.equal(aliasLang("fragment/x"), null);
        assert.equal(aliasLang("en/hash"), null);
    });

    test("folder form and .html twin, nested ids and dotted releases included", () => {
        assert.deepEqual(aliasFiles("latest"), ["latest/index.html", "latest.html"]);
        assert.deepEqual(aliasFiles("captcha/verify"), [
            "captcha/verify/index.html",
            "captcha/verify.html",
        ]);
        assert.deepEqual(aliasFiles("fr/changelog/6.1.0"), [
            "fr/changelog/6.1.0/index.html",
            "fr/changelog/6.1.0.html",
        ]);
    });
});

interface Env {
    storage: "absent" | "blocked" | "throws" | { value: string | null };
    navigator: { languages?: readonly string[]; language?: string } | null;
}

// Targets of the alias page under test, one per language
const TARGETS = { en: "/v6/hash/", fr: "/fr/v6/hash/" };

/**
 * Describes the localStorage global of a fake browser.
 *
 * @param storage - The storage behaviour wanted: missing, throwing on access, throwing on read,
 * or holding a value for the key of the language menu
 * @returns The property descriptor to define on a global object
 */
function storageOf(storage: Env["storage"]): PropertyDescriptor {
    const throwing = () => {
        throw new Error("storage denied");
    };
    if (storage === "absent") return { value: undefined, configurable: true };
    if (storage === "blocked") return { get: throwing, configurable: true };
    const getItem = (key: string) => {
        if (key !== LOCALE_KEY) throw new Error(`unexpected key ${key}`);
        return storage === "throws" ? throwing() : storage.value;
    };
    return { value: { getItem }, configurable: true };
}

/**
 * Describes the localStorage and navigator globals of a fake browser.
 *
 * @param env - The storage and navigator behaviour wanted
 * @returns Property descriptors to define on a global object, in a vm context or on globalThis
 */
function globalsOf(env: Env): PropertyDescriptorMap {
    return {
        localStorage: storageOf(env.storage),
        navigator: { value: env.navigator ?? undefined, configurable: true },
    };
}

/**
 * Runs a function with the localStorage and navigator globals of a fake browser, then restores
 * the real ones.
 *
 * @param env - The fake browser
 * @param run - What to run while the globals are in place
 * @returns What run returns
 */
function withGlobals<T>(env: Env, run: () => T): T {
    const map = globalsOf(env);
    const saved = Object.keys(map).map(
        (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
    );
    Object.defineProperties(globalThis, map);
    try {
        return run();
    } finally {
        for (const [key, descriptor] of saved) {
            if (descriptor) Object.defineProperty(globalThis, key, descriptor);
            else delete (globalThis as Record<string, unknown>)[key];
        }
    }
}

/**
 * Runs an alias script in a vm context that holds a fake browser, the way a visitor's page would.
 *
 * @param script - The inline script of an alias page
 * @param env - The fake browser
 * @param search - location.search of the visit
 * @param hash - location.hash of the visit
 * @returns The URL given to location.replace, null when the script never called it
 */
function visit(script: string, env: Env, search = "", hash = ""): string | null {
    let replaced: string | null = null;
    const sandbox = {
        location: {
            search,
            hash,
            replace: (url: string) => {
                replaced = url;
            },
        },
    };
    Object.defineProperties(sandbox, globalsOf(env));
    runInContext(script, createContext(sandbox));
    return replaced;
}

type LangCase = [name: string, env: Env, want: Lang];

const FR_FR = { languages: ["fr-FR", "en"] };
const EN_US = { languages: ["en-US"] };

const CASES: readonly LangCase[] = [
    ["saved fr beats an English browser", { storage: { value: "fr" }, navigator: EN_US }, "fr"],
    ["saved en beats a French browser", { storage: { value: "en" }, navigator: FR_FR }, "en"],
    [
        "saved garbage falls back to the browser",
        { storage: { value: "de" }, navigator: FR_FR },
        "fr",
    ],
    ["saved in capitals is not a choice", { storage: { value: "FR" }, navigator: EN_US }, "en"],
    [
        "saved Object member name is not a choice",
        { storage: { value: "constructor" }, navigator: FR_FR },
        "fr",
    ],
    ["nothing saved, fr-FR first", { storage: { value: null }, navigator: FR_FR }, "fr"],
    ["nothing saved, en-US", { storage: { value: null }, navigator: EN_US }, "en"],
    [
        "nothing saved, de-DE then fr",
        { storage: { value: null }, navigator: { languages: ["de-DE", "fr"] } },
        "fr",
    ],
    [
        "nothing saved, only de and es",
        { storage: { value: null }, navigator: { languages: ["de", "es"] } },
        "en",
    ],
    [
        "nothing saved, de-DE then en-GB then fr",
        { storage: { value: null }, navigator: { languages: ["de-DE", "en-GB", "fr"] } },
        "en",
    ],
    ["capital tag", { storage: { value: null }, navigator: { languages: ["FR"] } }, "fr"],
    [
        "an empty languages list reads navigator.language",
        { storage: { value: null }, navigator: { languages: [], language: "fr-CA" } },
        "fr",
    ],
    [
        "no languages list reads navigator.language",
        { storage: { value: null }, navigator: { language: "fr" } },
        "fr",
    ],
    ["a storage that throws on read", { storage: "throws", navigator: FR_FR }, "fr"],
    ["a storage that throws on access", { storage: "blocked", navigator: FR_FR }, "fr"],
    [
        "a storage that throws and an English browser",
        { storage: "blocked", navigator: EN_US },
        "en",
    ],
    ["no storage at all", { storage: "absent", navigator: FR_FR }, "fr"],
    ["no navigator and nothing saved", { storage: { value: null }, navigator: null }, "en"],
    ["no navigator but a saved choice", { storage: { value: "fr" }, navigator: null }, "fr"],
    ["neither storage nor navigator", { storage: "absent", navigator: null }, "en"],
];

describe("aliasScript", () => {
    const script = aliasScript(TARGETS);

    for (const [name, env, want] of CASES) {
        test(`${name}: the script and getUserLang both pick ${want}`, () => {
            assert.equal(
                withGlobals(env, () => getUserLang()),
                want,
            );
            assert.equal(visit(script, env), TARGETS[want]);
        });
    }

    test("the script agrees with getUserLang on every saved value and language list", () => {
        const saved: Env["storage"][] = [
            "absent",
            "blocked",
            "throws",
            ...[null, "en", "fr", "de", "FR", "", "constructor", "__proto__", "toString"].map(
                (value) => ({ value }),
            ),
        ];
        const lists: Env["navigator"][] = [
            null,
            { language: "fr-FR" },
            { language: "de" },
            { languages: [], language: "" },
            { languages: ["en"] },
            { languages: ["FR-ca"] },
            { languages: ["fr_FR"] },
            { languages: ["de", "es", "fr"] },
            { languages: ["de", "en", "fr"] },
            { languages: ["frxyz", "en-US"] },
            { languages: [], language: "en-GB" },
        ];
        let compared = 0;
        for (const storage of saved) {
            for (const navigator of lists) {
                const env: Env = { storage, navigator };
                const lib = withGlobals(env, () => getUserLang());
                assert.equal(visit(script, env), TARGETS[lib], JSON.stringify(env));
                compared += 1;
            }
        }
        assert.equal(compared, saved.length * lists.length);
    });

    test("the query and the fragment are kept", () => {
        const env: Env = { storage: { value: "fr" }, navigator: EN_US };
        assert.equal(visit(script, env, "?a=1", "#b"), "/fr/v6/hash/?a=1#b");
        assert.equal(visit(script, { ...env, storage: { value: "en" } }, "", "#c"), "/v6/hash/#c");
    });

    test("the key is the one of the language menu and the default is the default locale", () => {
        assert.ok(script.includes(`getItem(${JSON.stringify(LOCALE_KEY)})`));
        assert.ok(script.includes('l="en"'));
        assert.equal(visit(script, { storage: "absent", navigator: null }), TARGETS.en);
    });

    test("a single target needs no detection and keeps the query and the fragment", () => {
        const fixed = aliasScript({ fr: "/fr/v6/hash/" });
        assert.equal(fixed, 'location.replace("/fr/v6/hash/"+location.search+location.hash)');
        const env: Env = { storage: { value: "en" }, navigator: EN_US };
        assert.equal(visit(fixed, env, "?x=1", "#y"), "/fr/v6/hash/?x=1#y");
    });

    test("it refuses a page without target, or without the default language", () => {
        assert.throws(() => aliasScript({}), /needs a target/);
        assert.throws(() => aliasScript({ fr: "/fr/v6/", en: undefined }), /needs a target|in en/);
    });

    test("a target cannot close the script element", () => {
        const hostile = aliasScript({ en: "/a</script>/", fr: "/fr/a</script>/" });
        assert.ok(!hostile.includes("</"));
        assert.ok(hostile.includes("\\u003c/script>"));
        assert.equal(visit(hostile, { storage: "absent", navigator: null }), "/a</script>/");
    });
});
