import assert from "node:assert/strict";
import { test } from "node:test";

import { releaseNumber, releasePages } from "@/lib/releases";
import type { PageIndex } from "@/lib/routes";

// A small index with an out-of-order list of releases and pages that are not releases
const INDEX: PageIndex = {
    v1: {},
    v2: {},
    v3: {},
    v4: {
        changelog: { kind: "index" },
        "changelog/4.9.0": { kind: "release" },
        "changelog/4.10.0": { kind: "release" },
        "changelog/4.0.0": { kind: "release" },
        hash: { kind: "endpoint" },
    },
    v5: {},
    v6: {},
};

test("the releases come newest first, comparing the numbers and not the text", () => {
    assert.deepEqual(releasePages(INDEX, "v4"), [
        "changelog/4.10.0",
        "changelog/4.9.0",
        "changelog/4.0.0",
    ]);
});

test("a version without releases gives an empty list", () => {
    assert.deepEqual(releasePages(INDEX, "v3"), []);
});

test("the release number is read from the page id", () => {
    assert.equal(releaseNumber("changelog/5.3.0"), "5.3.0");
    assert.equal(releaseNumber("hash"), "hash");
});
