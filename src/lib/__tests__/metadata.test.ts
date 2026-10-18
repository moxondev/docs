import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
    breadcrumbJsonLd,
    buildMetadata,
    DESCRIPTION_MAX,
    jsonLdText,
    metaDescription,
    rootMetadata,
    truncate,
    VIEWPORT,
    websiteJsonLd,
} from "@/lib/metadata";
import type { Page } from "@/types/content";

// Characters built from code points so that this file stays pure ASCII
const ELLIPSIS = String.fromCodePoint(0x2026);

const TEXT = { siteName: "moxon", template: "%s - moxon" };

const PAGE: Page = {
    version: "v6",
    id: "hash",
    kind: "endpoint",
    title: { en: "Hash", fr: "Hash" },
    lead: {
        en: "The `/hash` endpoint converts a string into a **hash**.",
        fr: "L'endpoint `/hash` convertit une cha\\*ne.",
    },
    sections: [],
};

describe("buildMetadata", () => {
    const meta = buildMetadata(
        "fr",
        { title: "Hash", description: "Convertir une chaine.", path: "/fr/v6/hash/" },
        TEXT,
    );

    test("title, description, canonical and hreflang alternates with x-default", () => {
        assert.equal(meta.title, "Hash");
        assert.equal(meta.description, "Convertir une chaine.");
        assert.deepEqual(meta.alternates, {
            canonical: "/fr/v6/hash/",
            languages: { en: "/v6/hash/", fr: "/fr/v6/hash/", "x-default": "/v6/hash/" },
        });
    });

    test("complete Open Graph and Twitter cards", () => {
        assert.deepEqual(meta.openGraph, {
            title: "Hash - moxon",
            description: "Convertir une chaine.",
            url: "/fr/v6/hash/",
            siteName: "moxon",
            locale: "fr_FR",
            alternateLocale: ["en_US"],
            type: "website",
        });
        assert.deepEqual(meta.twitter, {
            card: "summary",
            site: "@20syldev",
            title: "Hash - moxon",
            description: "Convertir une chaine.",
        });
    });

    test("an absolute title skips the template (the homes)", () => {
        const home = buildMetadata(
            "en",
            { title: "moxon - API documentation", description: "d", path: "/", absolute: true },
            TEXT,
        );
        assert.deepEqual(home.title, { absolute: "moxon - API documentation" });
        assert.equal((home.openGraph as { title: string }).title, "moxon - API documentation");
        assert.deepEqual(home.alternates?.languages, { en: "/", fr: "/fr/", "x-default": "/" });
    });
});

describe("rootMetadata and VIEWPORT", () => {
    test("base URL, title template, icons, manifest", () => {
        const meta = rootMetadata("en", TEXT, { title: "moxon", description: "Docs" });
        assert.equal(String(meta.metadataBase), "https://moxon.dev/");
        assert.deepEqual(meta.title, { default: "moxon", template: "%s - moxon" });
        assert.equal(meta.manifest, "/site.webmanifest");
        assert.deepEqual(meta.icons, {
            icon: [
                { url: "/favicon.svg", type: "image/svg+xml" },
                { url: "/favicon.ico", sizes: "48x48" },
            ],
            apple: "/apple-touch-icon.png",
        });
        assert.deepEqual(meta.twitter, { card: "summary", site: "@20syldev" });
    });

    test("theme color per color scheme", () => {
        assert.deepEqual(VIEWPORT.themeColor, [
            { media: "(prefers-color-scheme: light)", color: "#fde68a" },
            { media: "(prefers-color-scheme: dark)", color: "#121316" },
        ]);
    });
});

describe("descriptions", () => {
    test("truncate keeps short text and cuts long text at a word", () => {
        assert.equal(truncate("  a   b  "), "a b");
        const long = Array.from({ length: 60 }, (_, i) => `word${i}`).join(" ");
        const cut = truncate(long);
        assert.ok(cut.length <= DESCRIPTION_MAX, String(cut.length));
        assert.ok(cut.endsWith(ELLIPSIS));
        assert.ok(long.startsWith(cut.slice(0, -1)));
        assert.match(cut.slice(0, -1), /word\d+$/);
    });

    test("the lead first, in plain text, then the catalogue summary, then the per-kind sentence", () => {
        assert.equal(
            metaDescription(PAGE, "en", "fallback", "summary"),
            "The /hash endpoint converts a string into a hash.",
        );
        assert.equal(metaDescription(PAGE, "fr", "x"), "L'endpoint /hash convertit une cha*ne.");
        const bare: Page = { ...PAGE, lead: undefined };
        assert.equal(metaDescription(bare, "en", "fallback", "summary"), "summary");
        assert.equal(metaDescription(bare, "en", "fallback"), "fallback");
    });
});

describe("structured data", () => {
    test("WebSite on the homes", () => {
        assert.deepEqual(websiteJsonLd("fr", "moxon", "Documentation"), {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "moxon",
            url: "https://moxon.dev/fr/",
            description: "Documentation",
            inLanguage: "fr-FR",
            author: { "@type": "Person", name: "Sylvain L.", url: "https://sylvain.sh" },
        });
    });

    test("BreadcrumbList on endpoint pages, absolute URLs, positions from 1", () => {
        const data = breadcrumbJsonLd([
            { name: "moxon", path: "/" },
            { name: "v6", path: "/v6/" },
            { name: "Hash", path: "/v6/hash/" },
        ]);
        assert.deepEqual(data.itemListElement, [
            { "@type": "ListItem", position: 1, name: "moxon", item: "https://moxon.dev/" },
            { "@type": "ListItem", position: 2, name: "v6", item: "https://moxon.dev/v6/" },
            { "@type": "ListItem", position: 3, name: "Hash", item: "https://moxon.dev/v6/hash/" },
        ]);
    });

    test("the script text cannot close its element", () => {
        const text = jsonLdText({ name: "</script><b>" });
        assert.ok(!text.includes("<"));
        assert.deepEqual(JSON.parse(text), { name: "</script><b>" });
    });
});
