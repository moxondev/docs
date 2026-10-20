import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { NAV } from "@/data/nav";
import { LATEST, VERSIONS } from "@/data/versions";
import { sitemapEntries } from "@/lib/sitemap";
import type { Nav } from "@/types/nav";

// A release page of the latest version, the shape of a dotted page id
const RELEASE = Object.keys(NAV[LATEST]).find(
    (slug) => NAV[LATEST][slug].kind === "release",
) as string;

describe("sitemap entries", () => {
    const entries = sitemapEntries(NAV);
    const pages = VERSIONS.reduce((sum, v) => sum + Object.keys(NAV[v.id] ?? {}).length, 0);

    test("two homes, then one entry per page and language", () => {
        assert.equal(entries.length, 2 + 2 * pages);
        assert.equal(entries[0].url, "https://moxon.dev/");
        assert.equal(entries[1].url, "https://moxon.dev/fr/");
    });

    test("every URL is absolute, unique and ends with a slash", () => {
        const urls = entries.map((entry) => entry.url);
        assert.equal(new Set(urls).size, urls.length);
        for (const url of urls) assert.match(url, /^https:\/\/moxon\.dev\/(?:.*\/)?$/);
    });

    test("each entry lists both languages and x-default, itself included", () => {
        for (const entry of entries) {
            const languages = entry.alternates?.languages as Record<string, string>;
            assert.deepEqual(Object.keys(languages), ["en", "fr", "x-default"]);
            assert.equal(languages["x-default"], languages.en);
            assert.ok(Object.values(languages).includes(entry.url));
            assert.ok(languages.fr.startsWith("https://moxon.dev/fr/"));
            assert.ok(!languages.en.startsWith("https://moxon.dev/fr/"));
        }
    });

    test("a page gives its date, and a dotted release keeps its slash", () => {
        const hash = entries.find((entry) => entry.url === `https://moxon.dev/${LATEST}/hash/`);
        assert.equal(hash?.lastModified, NAV[LATEST].hash.updated);
        const release = entries.find(
            (entry) => entry.url === `https://moxon.dev/fr/${LATEST}/${RELEASE}/`,
        );
        assert.ok(release);
    });

    test("the homes carry the latest update of the latest version", () => {
        const dates = Object.values(NAV[LATEST]).map((page) => page.updated ?? "");
        assert.equal(entries[0].lastModified, dates.sort().at(-1));
    });

    test("a version without pages adds nothing", () => {
        const small = Object.fromEntries(
            VERSIONS.map((def) => [def.id, def.id === LATEST ? NAV[LATEST] : {}]),
        ) as Nav;
        const only = sitemapEntries(small);
        assert.equal(only.length, 2 + 2 * Object.keys(NAV[LATEST]).length);
    });
});
