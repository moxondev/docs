import assert from "node:assert/strict";
import { test } from "node:test";

import {
    buildSections,
    countedKinds,
    docEntry,
    flatEntries,
    type LinkEntry,
    pickValue,
    withMethod,
} from "@/components/search/entries";
import type { SearchDoc, SearchGroup } from "@/types/search";

// Documents of two pages, as the index file holds them
const HASH: SearchDoc = { k: "endpoint", t: "Hash", u: "/v6/hash/", r: "/v6/hash", m: ["post"] };
const METHOD: SearchDoc = { k: "param", t: "method", u: "/v6/hash/", h: "p-method" };
const UUID: SearchDoc = { k: "endpoint", t: "UUID", u: "/v6/uuid/", r: "/v6/uuid", m: ["get"] };

// The "other options" rows the palette builds for a version
const LINKS: LinkEntry[] = [
    { kind: "catalogue", value: "other:catalogue", href: "/#catalogue" },
    { kind: "playground", value: "other:playground", href: "/v6/playground/" },
];

const COUNTS = { endpoints: 2, params: 2, errors: 1, pages: 1 };

test("docEntry uses the document key as the cmdk value", () => {
    assert.equal(docEntry(HASH).value, "/v6/hash/#");
    assert.equal(docEntry(METHOD).value, "/v6/hash/#p-method");
});

test("buildSections keeps the groups of the search and their order", () => {
    const groups: SearchGroup[] = [
        { id: "endpoints", docs: [HASH, UUID] },
        { id: "params", docs: [METHOD] },
    ];
    const sections = buildSections(groups, null, true, LINKS);
    assert.deepEqual(
        sections.map((section) => section.id),
        ["endpoints", "params"],
    );
    assert.deepEqual(
        flatEntries(sections).map((entry) => entry.value),
        ["/v6/hash/#", "/v6/uuid/#", "/v6/hash/#p-method"],
    );
});

test("buildSections offers the corrected query then the other options when nothing is found", () => {
    const sections = buildSections([], { text: "hash", total: 6, counts: COUNTS }, true, LINKS);
    assert.deepEqual(
        sections.map((section) => section.id),
        ["didYouMean", "other"],
    );
    assert.equal(sections[0].entries[0].value, "suggest:hash");
    assert.deepEqual(
        sections[1].entries.map((entry) => entry.value),
        ["other:catalogue", "other:playground"],
    );
});

test("buildSections skips the correction when there is none, and everything for an empty field", () => {
    assert.deepEqual(
        buildSections([], null, true, LINKS).map((section) => section.id),
        ["other"],
    );
    assert.deepEqual(buildSections([], null, false, LINKS), []);
});

test("pickValue selects the first row on desktop and none on a phone", () => {
    const values = ["a", "b", "c"];
    assert.equal(pickValue(values, null, "q", true), "a");
    assert.equal(pickValue(values, null, "q", false), "");
    assert.equal(pickValue([], null, "q", true), "");
});

test("pickValue keeps the choice made for this query while the row is listed", () => {
    const values = ["a", "b", "c"];
    assert.equal(pickValue(values, { query: "q", value: "c" }, "q", true), "c");
    assert.equal(pickValue(values, { query: "q", value: "c" }, "q", false), "c");
    assert.equal(pickValue(values, { query: "old", value: "c" }, "q", true), "a");
    assert.equal(pickValue(values, { query: "q", value: "z" }, "q", true), "a");
});

test("withMethod writes, replaces and removes the method prefix", () => {
    assert.equal(withMethod("hash", "post"), "post: hash");
    assert.equal(withMethod("post: hash", "get"), "get: hash");
    assert.equal(withMethod("GET:hash", "post"), "post: hash");
    assert.equal(withMethod("post: hash", null), "hash");
    assert.equal(withMethod("", "get"), "get: ");
    assert.equal(withMethod("hash", null), "hash");
});

test("countedKinds lists the groups that have results, in display order", () => {
    assert.deepEqual(countedKinds(COUNTS), ["endpoints", "params", "errors", "pages"]);
    assert.deepEqual(countedKinds({ endpoints: 0, params: 3, errors: 0, pages: 1 }), [
        "params",
        "pages",
    ]);
});
