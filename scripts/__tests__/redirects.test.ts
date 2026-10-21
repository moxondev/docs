import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, test } from "node:test";

import { NAV } from "@/data/nav";
import { LATEST, VERSIONS } from "@/data/versions";
import {
    aliasAddresses,
    aliasFiles,
    getSmartRedirect,
    LEGACY_HOME_FILES,
    legacyFiles,
    type LegacyPage,
} from "@/lib/redirect";
import { absoluteUrl } from "@/lib/routes";
import { sitemapEntries } from "@/lib/sitemap";
import type { Lang, Page } from "@/types/content";
import type { Nav } from "@/types/nav";

import {
    aliasHtml,
    aliasPlan,
    escapeHtml,
    isReserved,
    type OldPage,
    type OldUrls,
    REDIRECT_MAX,
    redirectHtml,
    redirectPlan,
    type RedirectText,
    redirectTexts,
    reservedRoots,
    writeRedirects,
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
        assert.ok(
            html.includes('<meta name="viewport" content="width=device-width, initial-scale=1">'),
        );
        assert.ok(html.includes('<meta name="color-scheme" content="light dark">'));
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

/**
 * Removes the noscript elements of a document, to see what runs when scripts are on.
 *
 * @param html - An alias page
 * @returns The document without its noscript elements
 */
function withoutNoscript(html: string): string {
    return html.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");
}

/**
 * Reads the targets of an alias page back from its script.
 *
 * @param html - An alias page
 * @returns The two targets of a detection page, or the single one of a fixed page
 */
function targetsOf(html: string): Partial<Record<Lang, string>> {
    const map = /<script>var t=(\{.*?\}),h=/.exec(html)?.[1];
    if (map) return JSON.parse(map) as Record<Lang, string>;
    const fixed = /<script>location\.replace\("([^"]+)"\+/.exec(html)?.[1] ?? "";
    return { [fixed.startsWith("/fr/") ? "fr" : "en"]: fixed };
}

describe("alias page", () => {
    const text = { title: 'Hash <"v6">', link: "Redirecting to Hash" };
    const both = aliasHtml({ en: "/v6/hash/", fr: "/fr/v6/hash/" }, "en", text);
    const fixed = aliasHtml({ fr: "/fr/v6/hash/" }, "fr", {
        title: "Hash",
        link: "Redirection vers Hash",
    });

    test("both targets: English document, English canonical, detection script", () => {
        assert.ok(both.startsWith('<!doctype html>\n<html lang="en">'));
        assert.ok(
            both.includes('<meta name="viewport" content="width=device-width, initial-scale=1">'),
        );
        assert.ok(both.includes('<link rel="canonical" href="https://moxon.dev/v6/hash/">'));
        assert.ok(both.includes('{"en":"/v6/hash/","fr":"/fr/v6/hash/"}'));
        assert.ok(both.includes('localStorage.getItem("lang")'));
        assert.ok(both.includes("<title>Hash &lt;&quot;v6&quot;&gt;</title>"));
        assert.ok(both.includes('<noscript><a href="/v6/hash/">Redirecting to Hash</a>'));
        assert.ok(Buffer.byteLength(both) < REDIRECT_MAX);
    });

    test("the refresh sits in a noscript element, so it never races the script", () => {
        assert.ok(
            both.includes(
                '<noscript><meta http-equiv="refresh" content="0; url=/v6/hash/"></noscript>',
            ),
        );
        assert.ok(!withoutNoscript(both).includes("http-equiv"));
        assert.ok(!withoutNoscript(fixed).includes("http-equiv"));
    });

    test("one target: French document, no detection, French canonical", () => {
        assert.ok(fixed.startsWith('<!doctype html>\n<html lang="fr">'));
        assert.ok(fixed.includes('<link rel="canonical" href="https://moxon.dev/fr/v6/hash/">'));
        assert.ok(
            fixed.includes(
                '<script>location.replace("/fr/v6/hash/"+location.search+location.hash)',
            ),
        );
        assert.ok(!fixed.includes("localStorage"));
        assert.ok(!fixed.includes('"en"'));
        assert.ok(fixed.includes('<noscript><a href="/fr/v6/hash/">Redirection vers Hash</a>'));
    });

    test("a page without a target in its own language is refused", () => {
        assert.throws(() => aliasHtml({ en: "/v6/" }, "fr", text), /no target in fr/);
    });
});

describe("real routes of the export", () => {
    const reserved = reservedRoots(["md", "search", "fonts", "robots.txt", "favicon.ico"]);

    test("versions, the French folder, the host files and public/ are reserved", () => {
        for (const name of [
            "v1",
            "v6",
            "fr",
            "md",
            "search",
            "404",
            "sitemap",
            "sitemap.xml",
            "robots",
            "robots.txt",
            "index.html",
            "fonts",
            "favicon.ico",
        ]) {
            assert.ok(isReserved(name, reserved), name);
        }
    });

    test("Next internals starting with an underscore are reserved", () => {
        for (const name of ["_next", "_not-found", "__next._tree.txt", "__next.fr"]) {
            assert.ok(isReserved(name, reserved), name);
        }
    });

    test("page ids and release numbers are not, and a name is compared whole", () => {
        for (const name of ["latest", "hash", "changelog", "6.1.0", "encode", "v66", "searching"]) {
            assert.ok(!isReserved(name, reserved), name);
        }
        assert.ok(!isReserved("en", reserved));
    });

    test("the real public folder is read: its entries are reserved", () => {
        const names = readdirSync(join(process.cwd(), "public"));
        const found = reservedRoots(names);
        for (const name of names) assert.ok(isReserved(name, found), name);
        assert.ok(names.includes("fonts") && names.includes("robots.txt"));
    });
});

describe("alias plan, on the real data", () => {
    const textOf = redirectTexts(process.cwd(), NAV);
    const reserved = reservedRoots(readdirSync(join(process.cwd(), "public")));
    const plan = aliasPlan(NAV, textOf, reserved);
    const addresses = aliasAddresses(NAV);

    test("every enumerated address is served, nothing skipped, dropped or incoherent", () => {
        assert.deepEqual(plan.problems, []);
        assert.deepEqual(plan.skipped, []);
        assert.deepEqual(plan.shadowed, []);
        assert.equal(plan.addresses, addresses.length);
        assert.equal(plan.files.length, 2 * addresses.length);
    });

    test("counts follow the data: the pages of the latest version, the releases, both languages", () => {
        const pages = Object.keys(NAV[LATEST]).length - 1;
        const frozen = addresses.filter((address) => /^[45]\.\d+\.\d+$/.test(address));
        assert.equal(frozen.length, 20);
        const releases = addresses.filter((address) => /^\d+\.\d+\.\d+$/.test(address));
        assert.ok(releases.length >= 22);
        assert.equal(
            addresses.filter((address) => !address.startsWith("fr/")).length * 2,
            addresses.length,
        );
        assert.ok(addresses.length >= 2 * (2 + 2 * pages + releases.length));
    });

    test("both forms of each address, folder form first, no duplicate, no en/ prefix", () => {
        assert.deepEqual(
            plan.files.map((file) => file.file),
            addresses.flatMap((address) => aliasFiles(address)),
        );
        const names = plan.files.map((file) => file.file);
        assert.equal(new Set(names).size, names.length);
        assert.ok(names.every((name) => !name.startsWith("en/")));
        for (const address of addresses) {
            assert.ok(names.includes(`${address}/index.html`), address);
            assert.ok(names.includes(`${address}.html`), address);
        }
    });

    test("a few exact members", () => {
        const html = (file: string) => plan.files.find((entry) => entry.file === file)?.html ?? "";
        assert.deepEqual(targetsOf(html("latest.html")), {
            en: `/${LATEST}/`,
            fr: `/fr/${LATEST}/`,
        });
        assert.deepEqual(targetsOf(html("hash/index.html")), {
            en: `/${LATEST}/hash/`,
            fr: `/fr/${LATEST}/hash/`,
        });
        assert.deepEqual(targetsOf(html("changelog.html")), {
            en: `/${LATEST}/changelog/`,
            fr: `/fr/${LATEST}/changelog/`,
        });
        assert.deepEqual(targetsOf(html("changelog/latest.html")), {
            en: `/${LATEST}/changelog/${VERSIONS[0].release}/`,
            fr: `/fr/${LATEST}/changelog/${VERSIONS[0].release}/`,
        });
        assert.deepEqual(targetsOf(html("5.6.0.html")), {
            en: "/v5/changelog/5.6.0/",
            fr: "/fr/v5/changelog/5.6.0/",
        });
        assert.deepEqual(targetsOf(html("fr/latest/captcha/verify/index.html")), {
            fr: `/fr/${LATEST}/captcha/verify/`,
        });
        assert.deepEqual(targetsOf(html("fr/4.0.0.html")), { fr: "/fr/v4/changelog/4.0.0/" });
    });

    test("each page carries exactly what getSmartRedirect answers, in both languages", () => {
        for (const address of addresses) {
            const html = plan.files.find((file) => file.file === `${address}.html`)?.html ?? "";
            const en = getSmartRedirect(`/${address}`, NAV, "en");
            const fr = getSmartRedirect(`/${address}`, NAV, "fr");
            assert.ok(en !== null && fr !== null, address);
            const found = targetsOf(html);
            const canonical = absoluteUrl(found.en ?? found.fr ?? "");
            if (address.startsWith("fr/")) {
                assert.equal(en, fr, address);
                assert.deepEqual(found, { fr }, address);
            } else {
                assert.deepEqual(found, { en, fr }, address);
            }
            assert.ok(html.includes(`href="${canonical}"`), address);
            const twin = plan.files.find((file) => file.file === `${address}/index.html`);
            assert.equal(twin?.html, html, address);
        }
    });

    test("the title is the one of the target page, in the language of the page", () => {
        const html = (file: string) => plan.files.find((entry) => entry.file === file)?.html ?? "";
        const page = (lang: Lang): LegacyPage => ({ version: LATEST, lang, id: "hash" });
        assert.ok(html("hash.html").includes(`<title>${textOf("en", page("en")).title}</title>`));
        assert.ok(
            html("fr/hash.html").includes(`<title>${textOf("fr", page("fr")).title}</title>`),
        );
        assert.ok(html("fr/hash.html").includes('<html lang="fr">'));
        assert.ok(html("hash.html").includes('<html lang="en">'));
        assert.ok(html("fr/hash.html").includes("Redirection vers"));
    });

    test("every file stays under the size limit", () => {
        const largest = Math.max(...plan.files.map(({ html }) => Buffer.byteLength(html)));
        assert.ok(largest < REDIRECT_MAX, `${largest} bytes`);
    });

    test("no file is under a real route, a legacy redirect or the home files", () => {
        const legacy = new Set<string>(LEGACY_HOME_FILES.map((home) => home.file));
        for (const old of readLegacy()) for (const file of legacyFiles(old)) legacy.add(file);
        assert.ok(legacy.size > 1000);
        for (const { file } of plan.files) {
            assert.ok(!legacy.has(file), file);
            const parts = file.split("/");
            const root = (parts[0] === "fr" ? parts[1] : parts[0]).replace(/\.html$/, "");
            assert.ok(!isReserved(root, reserved), file);
            assert.ok(!["index.html", "404.html"].includes(file), file);
        }
    });

    test("no alias address is a page of the sitemap", () => {
        const urls = new Set(sitemapEntries(NAV).map((entry) => entry.url));
        for (const address of addresses) {
            assert.ok(!urls.has(absoluteUrl(`/${address}/`)), address);
            assert.ok(!urls.has(absoluteUrl(`/${address}`)), address);
        }
    });

    test("no alias for an unpublished version", () => {
        const partial: Nav = { ...NAV, v4: {} };
        const result = aliasPlan(partial, testText, reserved);
        const names = result.files.map((file) => file.file);
        assert.ok(
            names.every(
                (name) => !/(^|\/)(changelog\/)?4\.\d+\.\d+(\.html|\/index\.html)$/.test(name),
            ),
        );
        assert.ok(names.includes("5.6.0.html"));
        assert.deepEqual(result.problems, []);
    });

    test("an address that does not resolve is skipped and listed, not written", () => {
        const empty: Nav = { ...NAV, [LATEST]: {} };
        const result = aliasPlan(empty, testText, reserved);
        assert.deepEqual(result.skipped, [
            "changelog/latest",
            "fr/changelog/latest",
            "fr/latest",
            "latest",
        ]);
        const names = result.files.map((file) => file.file);
        assert.ok(!names.includes("latest.html"));
        assert.ok(names.includes("5.6.0.html"));
        assert.equal(result.addresses * 2, result.files.length);
        assert.deepEqual(result.problems, []);
    });

    test("a real route wins: the address is dropped and listed, the others stay", () => {
        const page = NAV[LATEST].hash;
        const crowded: Nav = {
            ...NAV,
            [LATEST]: { ...NAV[LATEST], search: page, md: page, "404": page, _next: page },
        };
        const result = aliasPlan(crowded, testText, reservedRoots(["md", "search"]));
        assert.deepEqual(result.shadowed, [
            "404",
            "_next",
            "fr/404",
            "fr/_next",
            "fr/md",
            "fr/search",
            "md",
            "search",
        ]);
        const names = result.files.map((file) => file.file);
        for (const root of ["search", "md", "404", "_next"]) {
            assert.ok(!names.includes(`${root}/index.html`), root);
            assert.ok(!names.includes(`${root}.html`), root);
            assert.ok(!names.includes(`fr/${root}.html`), root);
        }
        assert.ok(names.includes("latest/search.html"));
        assert.ok(names.includes("fr/latest/md/index.html"));
        assert.ok(names.includes("hash.html"));
        assert.deepEqual(result.problems, []);
    });

    test("the plan is deterministic", () => {
        assert.deepEqual(aliasPlan(NAV, textOf, reserved), plan);
    });

    test("answers that are not a coherent pair of languages are problems, never written", () => {
        const english = aliasPlan(NAV, textOf, reserved, () => "/v6/hash/");
        assert.equal(english.problems.length, addresses.length);
        assert.deepEqual(english.files, []);
        assert.equal(english.addresses, 0);

        const apart = aliasPlan(NAV, textOf, reserved, (path, nav, detected) =>
            detected === "fr" ? "/fr/v6/encode/" : getSmartRedirect(path, nav, "en"),
        );
        assert.ok(apart.problems.length > 0);
        assert.ok(apart.problems[0].includes("incoherent targets"));

        const none = aliasPlan(NAV, textOf, reserved, () => null);
        assert.equal(none.skipped.length, addresses.length);
        assert.deepEqual(none.files, []);
    });
});

describe("writing the alias pages", () => {
    const textOf = redirectTexts(process.cwd(), NAV);
    const reserved = reservedRoots(readdirSync(join(process.cwd(), "public")));
    const plan = aliasPlan(NAV, textOf, reserved);

    test("a second run leaves everything alone", () => {
        const out = mkdtempSync(join(tmpdir(), "alias-write-"));
        const first = writeRedirects(out, plan.files);
        assert.deepEqual(first, { written: plan.files.length, unchanged: 0, collisions: [] });
        const second = writeRedirects(out, plan.files);
        assert.deepEqual(second, { written: 0, unchanged: plan.files.length, collisions: [] });
        assert.equal(
            readFileSync(join(out, "fr/latest/hash.html"), "utf8"),
            plan.files.find((file) => file.file === "fr/latest/hash.html")?.html,
        );
    });

    test("a file with another content is a collision and is never overwritten", () => {
        const out = mkdtempSync(join(tmpdir(), "alias-collide-"));
        writeFileSync(join(out, "latest.html"), "real page");
        const files = plan.files.filter((file) => file.file.startsWith("latest"));
        const result = writeRedirects(out, files);
        assert.deepEqual(result.collisions, ["latest.html"]);
        assert.equal(readFileSync(join(out, "latest.html"), "utf8"), "real page");
        assert.ok(result.written >= 1);
    });
});

/**
 * Reads the legacy inventory of the repository, the fixed input of the legacy redirect files.
 *
 * @returns The legacy pages of src/lib/oldUrls.json
 */
function readLegacy(): LegacyPage[] {
    const urls = JSON.parse(
        readFileSync(join(process.cwd(), "src/lib/oldUrls.json"), "utf8"),
    ) as OldUrls;
    return urls.pages;
}
