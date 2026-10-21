import assert from "node:assert/strict";
import { test } from "node:test";

import { queryWords, splitMarks } from "@/components/search/marks";

// Letters built from their code points so that this file stays pure ASCII
const E_ACUTE = String.fromCodePoint(0xe9);
const I_CIRC = String.fromCodePoint(0xee);

test("queryWords folds case and accents and drops punctuation", () => {
    assert.deepEqual(queryWords("Hash, S" + E_ACUTE + "curit" + E_ACUTE), ["hash", "securite"]);
    assert.deepEqual(queryWords("   "), []);
});

test("splitMarks bolds every word start and leaves the rest plain", () => {
    assert.deepEqual(splitMarks("Convert a string to hash", ["hash"]), [
        { text: "Convert a string to ", hit: false },
        { text: "hash", hit: true },
    ]);
    assert.deepEqual(splitMarks("hashing the hash", ["hash"]), [
        { text: "hash", hit: true },
        { text: "ing the ", hit: false },
        { text: "hash", hit: true },
    ]);
});

test("splitMarks does not match inside a word", () => {
    assert.deepEqual(splitMarks("rehash", ["hash"]), [{ text: "rehash", hit: false }]);
});

test("splitMarks ignores case and accents but prints the original text", () => {
    const text = "Cha" + I_CIRC + "ne " + E_ACUTE + "t" + E_ACUTE;
    const pieces = splitMarks(text, ["chaine", "ete"]);
    assert.deepEqual(pieces, [
        { text: "Cha" + I_CIRC + "ne", hit: true },
        { text: " ", hit: false },
        { text: E_ACUTE + "t" + E_ACUTE, hit: true },
    ]);
    assert.equal(pieces.map((piece) => piece.text).join(""), text);
});

test("splitMarks keeps the whole text when there is nothing to mark", () => {
    assert.deepEqual(splitMarks("Hash", []), [{ text: "Hash", hit: false }]);
    assert.deepEqual(splitMarks("", ["hash"]), [{ text: "", hit: false }]);
});

test("splitMarks marks route words after a slash", () => {
    assert.deepEqual(splitMarks("/v6/hash", ["hash"]), [
        { text: "/v6/", hit: false },
        { text: "hash", hit: true },
    ]);
});
