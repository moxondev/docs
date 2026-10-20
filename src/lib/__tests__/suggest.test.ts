import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { KINDS } from "@/data/kinds";
import { closestId, editDistance, searchTerm, suggestPath } from "@/lib/suggest";

describe("editDistance", () => {
    test("counts insertions, deletions and substitutions", () => {
        assert.equal(editDistance("hash", "hash"), 0);
        assert.equal(editDistance("hsh", "hash"), 1);
        assert.equal(editDistance("hashh", "hash"), 1);
        assert.equal(editDistance("hesh", "hash"), 1);
        assert.equal(editDistance("kitten", "sitting"), 3);
    });

    test("counts a swap of two neighbouring letters once", () => {
        assert.equal(editDistance("hahs", "hash"), 1);
        assert.equal(editDistance("pasword", "password"), 1);
    });

    test("handles empty words", () => {
        assert.equal(editDistance("", ""), 0);
        assert.equal(editDistance("", "qr"), 2);
        assert.equal(editDistance("qr", ""), 2);
    });
});

describe("closestId", () => {
    const ids = ["color", "hash", "password", "qrcode"];

    test("finds the nearest id and ignores the case", () => {
        assert.equal(closestId(ids, "hsh"), "hash");
        assert.equal(closestId(ids, "Pasword"), "password");
        assert.equal(closestId(ids, "colour"), "color");
    });

    test("gives nothing for a word that is too far", () => {
        assert.equal(closestId(ids, "zzz-nope"), null);
        assert.equal(closestId(ids, "xyz"), null);
        assert.equal(closestId([], "hash"), null);
    });

    test("breaks a tie by the order of the list", () => {
        assert.equal(closestId(["bat", "cat"], "mat"), "bat");
        assert.equal(closestId(["cat", "bat"], "mat"), "cat");
    });

    test("allows more distance to a longer word", () => {
        assert.equal(closestId(["authentication"], "authentification"), "authentication");
        assert.equal(closestId(["ab"], "ba"), "ab");
        assert.equal(closestId(["abc"], "xyz"), null);
    });
});

describe("suggestPath", () => {
    test("reads a bare address in the latest version", () => {
        assert.equal(suggestPath(KINDS, "/hsh"), "/v6/hash/");
        assert.equal(suggestPath(KINDS, "/fr/hsh/"), "/fr/v6/hash/");
        assert.equal(suggestPath(KINDS, "/fr/pasword/"), "/fr/v6/password/");
        assert.equal(suggestPath(KINDS, "/hsh.html"), "/v6/hash/");
    });

    test("reads a percent encoded address and the spaces around the word", () => {
        assert.equal(suggestPath(KINDS, "/hash%20"), "/v6/hash/");
        assert.equal(suggestPath(KINDS, "/fr/v6/h%61sh%20"), "/fr/v6/hash/");
        assert.equal(suggestPath(KINDS, "/v6/100%"), null);
    });

    test("gives nothing for a very long segment", () => {
        assert.equal(suggestPath(KINDS, `/v6/${"a".repeat(5000)}`), null);
    });

    test("suggests a page of the version in the language of the address", () => {
        assert.equal(suggestPath(KINDS, "/fr/v6/hsh"), "/fr/v6/hash/");
        assert.equal(suggestPath(KINDS, "/fr/v6/hsh/"), "/fr/v6/hash/");
        assert.equal(suggestPath(KINDS, "/v6/hsh"), "/v6/hash/");
        assert.equal(suggestPath(KINDS, "/v5/pasword/"), "/v5/password/");
    });

    test("only looks at the pages of the version in the address", () => {
        assert.equal(suggestPath(KINDS, "/v1/hsh"), null);
    });

    test("gives nothing outside a version or when nothing is close", () => {
        assert.equal(suggestPath(KINDS, "/zzz-nope/"), null);
        assert.equal(suggestPath(KINDS, "/fr/zzz-nope/"), null);
        assert.equal(suggestPath(KINDS, "/fr/v6/zzz-nope/"), null);
        assert.equal(suggestPath(KINDS, "/v6/"), null);
        assert.equal(suggestPath(KINDS, "/"), null);
        assert.equal(suggestPath(KINDS, "/fr/"), null);
    });
});

describe("searchTerm", () => {
    test("reads the last segment", () => {
        assert.equal(searchTerm("/fr/v6/hsh"), "hsh");
        assert.equal(searchTerm("/fr/v6/hsh/"), "hsh");
        assert.equal(searchTerm("/zzz-nope/"), "zzz-nope");
        assert.equal(searchTerm("/v6/a%20b/?q=1"), "a b");
    });

    test("trims the blanks and drops the .html suffix", () => {
        assert.equal(searchTerm("/v6/hash%20/"), "hash");
        assert.equal(searchTerm("/v6/%20/"), "");
        assert.equal(searchTerm("/hsh.html"), "hsh");
        assert.equal(searchTerm("/hsh.HTML"), "hsh");
    });

    test("keeps a segment that is not valid percent encoding", () => {
        assert.equal(searchTerm("/v6/100%/"), "100%");
    });

    test("is empty without segments", () => {
        assert.equal(searchTerm("/"), "");
        assert.equal(searchTerm(""), "");
    });
});
