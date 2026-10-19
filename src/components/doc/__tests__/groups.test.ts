import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { familyName, filterGroups, hiddenNames, valueGroups } from "@/components/doc/groups";

// Families of a hash list, shortened: the SHA family holds the featured values
const GROUPS = [
    { label: { en: "RSA Methods:", fr: "Methodes RSA :" }, items: ["RSA-MD5", "RSA-SHA1"] },
    { label: { en: "SHA Methods:", fr: "Methodes SHA :" }, items: ["sha1", "sha256", "sha512"] },
    { label: { en: "Blake Methods:", fr: "Methodes Blake :" }, items: ["blake2b512"] },
    { label: { en: "MD5 Methods:", fr: "Methodes MD5 :" }, items: ["md5", "md5-sha1"] },
    { label: { en: "Other:", fr: "Autres :" }, items: ["whirlpool"] },
];

describe("family of a values list", () => {
    test("the name is the first word of the label that the values contain", () => {
        assert.equal(familyName("SHA Methods:", ["sha1", "sha256"]), "SHA");
        assert.equal(familyName("Blake Methods:", ["blake2b512"]), "Blake");
    });

    test("a label without such a word has no name", () => {
        assert.equal(familyName("Other:", ["whirlpool"]), null);
    });
});

describe("primary families", () => {
    test("the families that hold a featured value come first and alone", () => {
        const groups = valueGroups(GROUPS, "en", ["sha256", "md5"]);
        assert.deepEqual(
            groups.map((group) => group.primary),
            [false, true, false, true, false],
        );
        assert.equal(groups[1].label, "SHA Methods:");
    });

    test("without a featured value the first three families are primary", () => {
        const groups = valueGroups(GROUPS, "fr", []);
        assert.deepEqual(
            groups.map((group) => group.primary),
            [true, true, true, false, false],
        );
        assert.equal(groups[0].label, "Methodes RSA :");
    });

    test("featured values match without regard to case", () => {
        const groups = valueGroups(GROUPS, "en", ["BLAKE2B512"]);
        assert.equal(groups[2].primary, true);
    });
});

describe("hidden family names and filter", () => {
    test("the button names up to three hidden families, once each", () => {
        const groups = valueGroups(GROUPS, "en", ["sha256"]);
        assert.deepEqual(hiddenNames(groups), ["RSA", "Blake", "MD5"]);
    });

    test("the filter searches every family and drops the empty ones", () => {
        const groups = valueGroups(GROUPS, "en", ["sha256"]);
        const found = filterGroups(groups, " SHA1 ");
        assert.deepEqual(
            found.map((group) => group.items),
            [["RSA-SHA1"], ["sha1"], ["md5-sha1"]],
        );
    });

    test("a blank query keeps every family and a query without hit keeps none", () => {
        const groups = valueGroups(GROUPS, "en", []);
        assert.equal(filterGroups(groups, "  ").length, groups.length);
        assert.deepEqual(filterGroups(groups, "zzz"), []);
    });
});
