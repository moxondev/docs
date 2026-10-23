import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { pullStretch, STRETCH_MAX } from "@/hooks/usePullStretch";

describe("pullStretch", () => {
    test("no pull gives no stretch", () => {
        assert.equal(pullStretch(0), 0);
    });

    test("the stretch grows with the pull, more slowly each time", () => {
        const [a, b, c] = [pullStretch(40), pullStretch(80), pullStretch(120)];
        assert.ok(a > 0 && b > a && c > b);
        assert.ok(b - a > c - b);
    });

    test("a pull up or down gives the same stretch", () => {
        assert.equal(pullStretch(-70), pullStretch(70));
    });

    test("no pull, however long, goes past the ceiling", () => {
        assert.ok(pullStretch(100000) <= STRETCH_MAX);
        assert.ok(pullStretch(400) < STRETCH_MAX);
    });
});
