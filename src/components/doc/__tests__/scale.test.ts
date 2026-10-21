import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { barPercent } from "@/components/doc/scale";

describe("bar of a plan on the ladder", () => {
    test("the width is the share of the largest quota", () => {
        assert.equal(barPercent(2_000, 10_000), 20);
        assert.equal(barPercent(6_000, 10_000), 60);
        assert.equal(barPercent(10_000, 10_000), 100);
    });

    test("a very small quota keeps a visible stub of 4 percent", () => {
        assert.equal(barPercent(10, 10_000), 4);
        assert.equal(barPercent(0, 10_000), 4);
    });

    test("a quota above the maximum is capped at the full track", () => {
        assert.equal(barPercent(20_000, 10_000), 100);
    });

    test("an empty list gives a full track instead of a division by zero", () => {
        assert.equal(barPercent(0, 0), 100);
        assert.equal(barPercent(5, Number.NaN), 100);
    });

    test("a fifth plan scales every bar against the new maximum", () => {
        assert.equal(barPercent(10_000, 20_000), 50);
        assert.equal(barPercent(2_000, 20_000), 10);
    });
});
