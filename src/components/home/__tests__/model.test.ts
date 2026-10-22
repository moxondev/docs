import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
    countEntries,
    filterCategories,
    fold,
    homeCatalogue,
    type HomeCategory,
} from "@/components/home/model";
import { CATALOGUE, CATEGORIES } from "@/data/catalogue";
import { NAV } from "@/data/nav";
import { LATEST } from "@/data/versions";
import { isListed } from "@/lib/nav";
import { getPage } from "@/lib/pages";

// Letters built from their code points so that this file stays pure ASCII
const E_ACUTE = String.fromCodePoint(0xe9);

/**
 * Builds the catalogue of the home in a language, the way the page does.
 *
 * @param lang - Language of the names and descriptions
 * @returns The categories of the latest version
 */
function catalogue(lang: "en" | "fr"): HomeCategory[] {
    return homeCatalogue(NAV, LATEST, lang);
}

/**
 * Lists the names of the entries of a filtered catalogue.
 *
 * @param categories - Categories after a filter
 * @returns The entry names in display order
 */
function names(categories: readonly HomeCategory[]): string[] {
    return categories.flatMap((category) => category.entries.map((entry) => entry.name));
}

describe("home catalogue", () => {
    test("49 listed endpoints in 7 categories, counted from the data", () => {
        const categories = catalogue("fr");
        assert.equal(categories.length, 7);
        assert.equal(countEntries(categories), 49);
        assert.deepEqual(
            categories.map((category) => category.entries.length),
            [9, 8, 7, 10, 6, 6, 3],
        );
        const listed = CATALOGUE.filter((entry) => isListed(entry, LATEST));
        assert.equal(countEntries(categories), listed.length);
    });

    test("the categories follow the catalogue order and carry the anchors of the sections", () => {
        const categories = catalogue("en");
        assert.deepEqual(
            categories.map((category) => category.anchor),
            ["securite", "texte", "images", "calcul", "donnees", "reseau", "temps-reel"],
        );
        assert.deepEqual(
            categories.map((category) => category.id),
            CATEGORIES.map((category) => category.id),
        );
        assert.ok(categories.every((category) => category.summary !== ""));
    });

    test("the unlisted hyperplanning page is not drawn, the entries are alphabetical", () => {
        for (const lang of ["en", "fr"] as const) {
            const categories = catalogue(lang);
            assert.ok(!names(categories).includes("Hyperplanning"));
            for (const category of categories) {
                const list = category.entries.map((entry) => entry.name);
                const sorted = [...list].sort((a, b) =>
                    a.localeCompare(b, "en", { sensitivity: "base" }),
                );
                assert.deepEqual(list, sorted, category.id);
            }
        }
    });

    test("a family shows the methods of its sub-pages: Pow and Captcha read GET POST", () => {
        const all = catalogue("fr").flatMap((category) => category.entries);
        const method = (slug: string) => all.find((entry) => entry.slug === slug)?.methods;
        assert.deepEqual(method("pow"), ["get", "post"]);
        assert.deepEqual(method("captcha"), ["get", "post"]);
        assert.deepEqual(method("chat"), ["get", "post"]);
        assert.deepEqual(method("hash"), ["post"]);
        assert.deepEqual(method("password"), ["get"]);
    });

    test("descriptions and links follow the language", () => {
        const fr = catalogue("fr").flatMap((category) => category.entries);
        const en = catalogue("en").flatMap((category) => category.entries);
        assert.equal(
            fr.find((entry) => entry.slug === "hash")?.tagline.startsWith("Empreintes"),
            true,
        );
        assert.equal(en.find((entry) => entry.slug === "hash")?.tagline, "Hash digests");
        assert.equal(fr.find((entry) => entry.slug === "hash")?.href, `/fr/${LATEST}/hash/`);
        assert.equal(en.find((entry) => entry.slug === "hash")?.href, `/${LATEST}/hash/`);
    });

    test("the route of each card is the path of its documented operation", async () => {
        for (const category of catalogue("en")) {
            for (const entry of category.entries) {
                const page = await getPage(LATEST, entry.slug);
                const path = page?.operations?.[0]?.path;
                if (path !== undefined) assert.equal(entry.route, path, entry.slug);
                else assert.equal(entry.route, `/${entry.slug}`);
            }
        }
    });

    test("no status is drawn today, and one that a page gets is carried to its card", () => {
        assert.ok(catalogue("en").every((c) => c.entries.every((e) => e.status === undefined)));
        const nav = structuredClone(NAV);
        nav[LATEST].hash.status = "beta";
        const hash = homeCatalogue(nav, LATEST, "en")
            .flatMap((category) => category.entries)
            .find((entry) => entry.slug === "hash");
        assert.equal(hash?.status, "beta");
    });
});

describe("home catalogue status", () => {
    test("a deprecated page is carried to its card in a version that lists it", () => {
        const nav = structuredClone(NAV);
        nav.v5.hyperplanning.status = "deprecated";
        const entries = homeCatalogue(nav, "v5", "en").flatMap((category) => category.entries);
        assert.equal(entries.find((entry) => entry.slug === "hyperplanning")?.status, "deprecated");
        const latest = catalogue("en").flatMap((category) => category.entries);
        assert.equal(
            latest.some((entry) => entry.slug === "hyperplanning"),
            false,
        );
    });
});

describe("home catalogue filter", () => {
    test("a blank query keeps every category and entry", () => {
        const categories = catalogue("fr");
        assert.equal(countEntries(filterCategories(categories, "   ")), 49);
    });

    test("fold ignores case and accents", () => {
        assert.equal(fold(`D${E_ACUTE}FI`), "defi");
    });

    test("the name, the route and the description are searched, accents and slash ignored", () => {
        const categories = catalogue("fr");
        assert.deepEqual(names(filterCategories(categories, "uuid")), ["UUID"]);
        assert.deepEqual(names(filterCategories(categories, "/hash")), ["Hash"]);
        assert.deepEqual(names(filterCategories(categories, `D${E_ACUTE}fi`)), ["Captcha", "Pow"]);
        assert.deepEqual(names(filterCategories(categories, "defi")), ["Captcha", "Pow"]);
    });

    test("a category with no match left disappears and a miss gives nothing", () => {
        const categories = filterCategories(catalogue("en"), "uuid");
        assert.deepEqual(
            categories.map((category) => category.id),
            ["fakeData"],
        );
        assert.deepEqual(filterCategories(catalogue("en"), "zzzz"), []);
    });
});
