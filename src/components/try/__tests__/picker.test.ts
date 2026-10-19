import assert from "node:assert/strict";
import { test } from "node:test";

import { groupEntries, scoreEntry } from "@/components/try/Picker";

test("an empty filter shows everything", () => {
    assert.equal(scoreEntry("Hash post /hash hash", ""), 1);
    assert.equal(scoreEntry("Hash post /hash hash", "  "), 1);
});

test("a name that starts with the text ranks above a match elsewhere", () => {
    assert.equal(scoreEntry("Avatar get /avatar avatar", "avat"), 1);
    assert.equal(scoreEntry("Hash post /hash hash", "post"), 0.5);
    assert.equal(scoreEntry("Hash post /hash hash", "/ha"), 0.5);
});

test("a subsequence is not a match, unlike the fuzzy default of cmdk", () => {
    assert.equal(scoreEntry("chat/private post /chat/private chat/private", "avat"), 0);
});

test("groups follow the catalogue categories and keep operations without one first", () => {
    const op = { id: "default", method: "get" as const, path: "/x", try: true, params: [] };
    const groups = groupEntries(
        [
            { slug: "text", name: "Text", category: "text", op },
            { slug: "hash", name: "Hash", category: "security", op },
            { slug: "misc", name: "Misc", op },
            { slug: "base", name: "Base", category: "security", op },
        ],
        "en",
    );
    assert.deepEqual(
        groups.map((g) => [g.id, g.entries.map((e) => e.slug)]),
        [
            ["other", ["misc"]],
            ["security", ["hash", "base"]],
            ["text", ["text"]],
        ],
    );
});
