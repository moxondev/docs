import assert from "node:assert/strict";
import { test } from "node:test";

import { NAV } from "@/data/nav";
import { VERSIONS } from "@/data/versions";

import {
    bannerKind,
    catalogueTarget,
    currentRow,
    docsTarget,
    showsFooter,
    toolTarget,
} from "./targets";

test("a tools page stays in the version being read when it has the page", () => {
    assert.equal(toolTarget(NAV, "fr", "v5", "playground"), "/fr/v5/playground/");
    assert.equal(toolTarget(NAV, "en", "v4", "changelog"), "/v4/changelog/");
    assert.equal(toolTarget(NAV, "en", "v3", "playground"), "/v6/playground/");
    assert.equal(toolTarget(NAV, "fr", undefined, "pricing"), "/fr/v6/pricing/");
});

test("the documentation and catalogue rows point at the version home and the home catalogue", () => {
    assert.equal(docsTarget("en", "v5"), "/v5/");
    assert.equal(docsTarget("fr", undefined), "/fr/v6/");
    assert.equal(catalogueTarget("en"), "/#catalogue");
    assert.equal(catalogueTarget("fr"), "/fr/#catalogue");
});

test("one row of the menu is current, the home has none", () => {
    assert.equal(currentRow(undefined, undefined), null);
    assert.equal(currentRow("v6", "hash"), "documentation");
    assert.equal(currentRow("v6", "index"), "documentation");
    assert.equal(currentRow("v6", "playground"), "playground");
    assert.equal(currentRow("v6", "pricing"), "pricing");
    assert.equal(currentRow("v6", "changelog"), "changelog");
    assert.equal(currentRow("v6", "changelog/6.1.0"), "changelog");
});

test("only the versions older than the latest carry a banner", () => {
    const kinds = Object.fromEntries(VERSIONS.map((def) => [def.id, bannerKind(def)]));
    assert.deepEqual(kinds, {
        v6: null,
        v5: "previous",
        v4: "legacy",
        v3: "retired",
        v2: "retired",
        v1: "retired",
    });
});

test("endpoint pages end with their own links and have no footer", () => {
    assert.equal(showsFooter(NAV, undefined, undefined), true);
    assert.equal(showsFooter(NAV, "v6", "hash"), false);
    assert.equal(showsFooter(NAV, "v6", "index"), true);
    assert.equal(showsFooter(NAV, "v6", "pricing"), true);
    assert.equal(showsFooter(NAV, "v6", "changelog/6.1.0"), true);
    assert.equal(showsFooter(NAV, "v6", "zzz"), true);
});
