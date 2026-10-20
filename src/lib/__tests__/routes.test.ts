import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";

import { LATEST, VERSIONS } from "@/data/versions";
import {
    absoluteUrl,
    alternates,
    hasPage,
    href,
    isVersion,
    linkAttrs,
    localizedPath,
    parsePath,
    resolveRef,
    segments,
    versionTarget,
} from "@/lib/routes";
import type { PageKind, Version } from "@/types/content";
import type { Nav } from "@/types/nav";

interface LegacyEntry {
    version: Version;
    lang: string;
    id: string;
}

/**
 * Builds a navigation index holding exactly the pages of the legacy site, the set that NAV
 * holds once every version is promoted.
 *
 * @returns Nav with one entry per legacy page id, kinds guessed from the id
 */
function legacyNav(): Nav {
    const file = join(import.meta.dirname, "../oldUrls.json");
    const urls = JSON.parse(readFileSync(file, "utf8")) as { pages: LegacyEntry[] };
    const nav = Object.fromEntries(VERSIONS.map((def) => [def.id, {}])) as Nav;
    for (const page of urls.pages) {
        const kind: PageKind =
            page.id === "index"
                ? "index"
                : page.id === "changelog"
                  ? "changelog"
                  : page.id.startsWith("changelog/")
                    ? "release"
                    : "endpoint";
        nav[page.version][page.id] = { title: { en: page.id, fr: page.id }, kind, methods: [] };
    }
    return nav;
}

const NAV = legacyNav();

// A version that does not exist yet: the one after the latest, whatever the latest is
const NEXT = `v${Number(LATEST.slice(1)) + 1}`;

describe("segments and isVersion", () => {
    test("segments drop slashes, the query and the fragment", () => {
        assert.deepEqual(segments("/fr/v6/hash/"), ["fr", "v6", "hash"]);
        assert.deepEqual(segments("//v6//changelog/6.1.0"), ["v6", "changelog", "6.1.0"]);
        assert.deepEqual(segments("/v6/hash/?x=1#parameters"), ["v6", "hash"]);
        assert.deepEqual(segments("/"), []);
    });

    test("only the documented versions are versions, compared whole", () => {
        for (const def of VERSIONS) assert.equal(isVersion(def.id), true, def.id);
        const next = [NEXT, "v0", `${LATEST}6`, `${LATEST}.1`, LATEST.toUpperCase()];
        for (const v of [...next, "toString", "hasOwnProperty", ""]) {
            assert.equal(isVersion(v), false, v);
        }
    });
});

describe("parsePath", () => {
    test("homes", () => {
        assert.deepEqual(parsePath("/"), { lang: "en" });
        assert.deepEqual(parsePath("/fr/"), { lang: "fr" });
        assert.deepEqual(parsePath("/fr"), { lang: "fr" });
    });

    test("version homes are the index page", () => {
        assert.deepEqual(parsePath("/v6/"), { lang: "en", version: "v6", slug: "index" });
        assert.deepEqual(parsePath("/fr/v1"), { lang: "fr", version: "v1", slug: "index" });
    });

    test("pages, sub-pages and dotted releases, slash optional", () => {
        assert.deepEqual(parsePath("/v6/hash/"), { lang: "en", version: "v6", slug: "hash" });
        assert.deepEqual(parsePath("/fr/v6/captcha/verify/"), {
            lang: "fr",
            version: "v6",
            slug: "captcha/verify",
        });
        assert.deepEqual(parsePath("/v6/changelog/6.1.0"), {
            lang: "en",
            version: "v6",
            slug: "changelog/6.1.0",
        });
        assert.deepEqual(parsePath("/fr/v6/changelog/6.1.0/"), {
            lang: "fr",
            version: "v6",
            slug: "changelog/6.1.0",
        });
        assert.deepEqual(parsePath("/v6/hash/?q=1#parameters"), {
            lang: "en",
            version: "v6",
            slug: "hash",
        });
    });

    test("paths outside a version carry the language only", () => {
        assert.deepEqual(parsePath(`/${NEXT}/hash/`), { lang: "en" });
        assert.deepEqual(parsePath("/fr/zzz/"), { lang: "fr" });
        assert.deepEqual(parsePath("/en/v6/hash/"), { lang: "en" });
    });
});

describe("href", () => {
    test("version homes, pages, sections, both languages", () => {
        assert.equal(href("en", "v6"), "/v6/");
        assert.equal(href("fr", "v6", "index"), "/fr/v6/");
        assert.equal(href("en", "v5", ""), "/v5/");
        assert.equal(href("fr", "v6", "hash"), "/fr/v6/hash/");
        assert.equal(
            href("en", "v6", "captcha/verify", "parameters"),
            "/v6/captcha/verify/#parameters",
        );
        assert.equal(href("en", "v6", "changelog/6.1.0"), "/v6/changelog/6.1.0/");
        assert.equal(href("fr", "v6", "index", "try"), "/fr/v6/#try");
    });

    test("every legacy page id gives a path that parses back to it", () => {
        for (const [version, pages] of Object.entries(NAV) as [Version, Nav[Version]][]) {
            for (const slug of Object.keys(pages)) {
                for (const lang of ["en", "fr"] as const) {
                    assert.deepEqual(parsePath(href(lang, version, slug)), { lang, version, slug });
                }
            }
        }
    });
});

describe("localizedPath and alternates", () => {
    test("moves a page between the two trees", () => {
        assert.equal(localizedPath("fr", "/v6/hash/"), "/fr/v6/hash/");
        assert.equal(localizedPath("en", "/fr/v6/hash/"), "/v6/hash/");
        assert.equal(localizedPath("fr", "/fr/v6/hash/"), "/fr/v6/hash/");
        assert.equal(localizedPath("en", "/v6/hash/"), "/v6/hash/");
    });

    test("homes", () => {
        assert.equal(localizedPath("fr", "/"), "/fr/");
        assert.equal(localizedPath("en", "/fr/"), "/");
        assert.equal(localizedPath("en", "/fr"), "/");
    });

    test("keeps the query and the fragment, adds the trailing slash", () => {
        assert.equal(
            localizedPath("fr", "/v6/hash/?x=1#parameters"),
            "/fr/v6/hash/?x=1#parameters",
        );
        assert.equal(localizedPath("en", "/fr/v6/changelog/6.1.0#api"), "/v6/changelog/6.1.0/#api");
    });

    test("alternates give both languages", () => {
        assert.deepEqual(alternates("/fr/v6/captcha/verify/"), {
            en: "/v6/captcha/verify/",
            fr: "/fr/v6/captcha/verify/",
        });
        assert.deepEqual(alternates("/"), { en: "/", fr: "/fr/" });
    });
});

describe("versionTarget", () => {
    test("same page when the target version has it", () => {
        assert.equal(versionTarget(NAV, "v5", "captcha/verify"), "captcha/verify");
        assert.equal(versionTarget(NAV, "v2", "hash"), "hash");
        assert.equal(versionTarget(NAV, "v1", "token"), "token");
        assert.equal(versionTarget(NAV, "v4", "playground"), "playground");
    });

    test("a release falls back to the changelog of the target version", () => {
        assert.equal(versionTarget(NAV, "v5", "changelog/6.1.0"), "changelog");
        assert.equal(versionTarget(NAV, "v4", "changelog/5.6.0"), "changelog");
    });

    test("otherwise the version home", () => {
        assert.equal(versionTarget(NAV, "v3", "captcha/verify"), "index");
        assert.equal(versionTarget(NAV, "v3", "changelog/6.1.0"), "index");
        assert.equal(versionTarget(NAV, "v3", "playground"), "index");
        assert.equal(versionTarget(NAV, "v1", "manifest"), "index");
        assert.equal(versionTarget(NAV, "v1", "hash"), "index");
        assert.equal(versionTarget({ ...NAV, v4: {} }, "v4", "hash"), "index");
        assert.equal(versionTarget(NAV, "v5", "constructor"), "index");
        assert.equal(versionTarget(NAV, "v5", "toString/x"), "index");
    });

    test("hasPage reads own keys only", () => {
        assert.equal(hasPage(NAV, "v6", "hash"), true);
        assert.equal(hasPage(NAV, "v6", "changelog/6.1.0"), true);
        for (const slug of ["constructor", "toString", "__proto__", "hasOwnProperty", ""]) {
            assert.equal(hasPage(NAV, "v6", slug), false, slug);
        }
    });

    test("paths: the French captcha/verify of v6 to v5 and v3, the 6.1.0 release to v5", () => {
        const { lang, slug } = parsePath("/fr/v6/captcha/verify/");
        assert.equal(href(lang, "v5", versionTarget(NAV, "v5", slug!)), "/fr/v5/captcha/verify/");
        assert.equal(href(lang, "v3", versionTarget(NAV, "v3", slug!)), "/fr/v3/");
        const release = parsePath("/fr/v6/changelog/6.1.0/");
        assert.equal(
            href(release.lang, "v5", versionTarget(NAV, "v5", release.slug!)),
            "/fr/v5/changelog/",
        );
    });
});

describe("resolveRef", () => {
    const fr = { lang: "fr" as const, version: "v6" as const };
    const en = { lang: "en" as const, version: "v5" as const };

    test("ref: targets in the language and version of the page", () => {
        assert.equal(resolveRef("ref:hash", fr), "/fr/v6/hash/");
        assert.equal(resolveRef("ref:hash", en), "/v5/hash/");
        assert.equal(
            resolveRef("ref:captcha/verify#parameters", fr),
            "/fr/v6/captcha/verify/#parameters",
        );
        assert.equal(resolveRef("ref:v5/changelog", fr), "/fr/v5/changelog/");
        assert.equal(resolveRef("ref:v6/changelog/6.1.0", en), "/v6/changelog/6.1.0/");
        assert.equal(resolveRef("ref:index", fr), "/fr/v6/");
        assert.equal(resolveRef("ref:/", fr), "/fr/");
        assert.equal(resolveRef("ref:/", en), "/");
    });

    test("fragments, web and mail links are unchanged", () => {
        assert.equal(resolveRef("#available-methods", fr), "#available-methods");
        assert.equal(
            resolveRef("https://api.moxon.dev/v6/uuid", fr),
            "https://api.moxon.dev/v6/uuid",
        );
        assert.equal(resolveRef("mailto:contact@sylvain.sh", fr), "mailto:contact@sylvain.sh");
    });

    test("a malformed ref: target throws", () => {
        assert.throws(() => resolveRef(`ref:${NEXT}/hash`, fr), /malformed ref target/);
        assert.throws(() => resolveRef("ref:", fr), /malformed ref target/);
        assert.throws(() => resolveRef("ref:Hash Page", fr), /malformed ref target/);
    });
});

describe("linkAttrs and absoluteUrl", () => {
    test("site paths, fragments and mail links get no attribute", () => {
        assert.deepEqual(linkAttrs("/fr/v6/hash/"), { href: "/fr/v6/hash/" });
        assert.deepEqual(linkAttrs("#try"), { href: "#try" });
        assert.deepEqual(linkAttrs("mailto:contact@sylvain.sh"), {
            href: "mailto:contact@sylvain.sh",
        });
    });

    test("web links get rel, and a new tab unless they point at moxon.dev", () => {
        assert.deepEqual(linkAttrs("https://moxon.dev/v6/"), {
            href: "https://moxon.dev/v6/",
            rel: "noopener noreferrer",
        });
        assert.deepEqual(linkAttrs("https://api.moxon.dev/v6/uuid"), {
            href: "https://api.moxon.dev/v6/uuid",
            rel: "noopener noreferrer",
            target: "_blank",
        });
        assert.equal(linkAttrs("https://github.com/moxondev/docs").target, "_blank");
    });

    test("absoluteUrl prefixes the production host", () => {
        assert.equal(absoluteUrl("/fr/v6/hash/"), "https://moxon.dev/fr/v6/hash/");
    });
});
