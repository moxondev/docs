import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { categoryOf, childLabel, filterCatalogue } from "@/components/doc/filter";
import type { NavCategory, NavLink } from "@/lib/nav";

/**
 * Builds a sidebar entry for the tests.
 *
 * @param slug - Page id, which is also the title
 * @param children - Sub-pages of the entry
 * @returns The entry, titled by its slug and with no method
 */
function link(slug: string, children: NavLink[] = []): NavLink {
    return { slug, title: slug, href: `/v6/${slug}`, methods: [], children };
}

const CATEGORIES: NavCategory[] = [
    {
        id: "security",
        anchor: "security",
        title: "Security",
        count: 3,
        items: [link("hash"), link("captcha", [link("captcha/verify")])],
    },
    { id: "text", anchor: "text", title: "Text", count: 1, items: [link("case")] },
];

describe("filter of the sidebar catalogue", () => {
    test("a blank query keeps every category", () => {
        assert.equal(filterCatalogue(CATEGORIES, "  ").length, 2);
    });

    test("a category keeps the matching entries and disappears when none matches", () => {
        const found = filterCatalogue(CATEGORIES, "has");
        assert.deepEqual(
            found.map((category) => [category.id, category.items.map((item) => item.slug)]),
            [["security", ["hash"]]],
        );
    });

    test("a route query and the case of the text do not matter", () => {
        assert.equal(filterCatalogue(CATEGORIES, "/CASE")[0].id, "text");
    });

    test("an entry matches through its sub-pages", () => {
        const found = filterCatalogue(CATEGORIES, "verify");
        assert.deepEqual(
            found[0].items.map((item) => item.slug),
            ["captcha"],
        );
    });
});

describe("category of a page", () => {
    test("an entry and its sub-pages belong to the category", () => {
        assert.equal(categoryOf(CATEGORIES, "hash"), "security");
        assert.equal(categoryOf(CATEGORIES, "captcha/verify"), "security");
        assert.equal(categoryOf(CATEGORIES, "case"), "text");
    });

    test("a page outside the catalogue has none", () => {
        assert.equal(categoryOf(CATEGORIES, "authentication"), undefined);
    });
});

describe("childLabel", () => {
    test("drops the name of the parent from the name of a sub-page", () => {
        assert.equal(childLabel("Chat", "Chat Effacer"), "Effacer");
        assert.equal(childLabel("Chat", "Chat Priv\u00e9"), "Priv\u00e9");
    });

    test("matches the parent's name without regard to case, at the start only", () => {
        assert.equal(childLabel("Tic-tac-toe", "Tic-Tac-Toe Forfait"), "Forfait");
        assert.equal(childLabel("Chat", "Private Chat"), "Private Chat");
        assert.equal(
            childLabel("Captcha", "V\u00e9rification de captcha"),
            "V\u00e9rification de captcha",
        );
    });

    test("keeps a name that does not start with the parent's name", () => {
        assert.equal(childLabel("Captcha", "V\u00e9rification"), "V\u00e9rification");
        assert.equal(childLabel("Chat", "Chatbot"), "Chatbot");
    });

    test("keeps the name of the parent alone", () => {
        assert.equal(childLabel("Chat", "Chat"), "Chat");
        assert.equal(childLabel("Chat", "Chat "), "Chat ");
    });
});
