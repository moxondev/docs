import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { PLANS } from "@/data/plans";
import { formatApprox, formatCount, formatDate, formatPrice } from "@/lib/format";

// Characters built from code points so that this file stays pure ASCII
const EURO = String.fromCodePoint(0x20ac);
const NARROW_NBSP = String.fromCodePoint(0x202f);
const NBSP = String.fromCodePoint(0xa0);
const E_ACUTE = String.fromCodePoint(0xe9);

describe("formatCount", () => {
    test("comma in English, plain space in French", () => {
        assert.equal(formatCount(2000, "en"), "2,000");
        assert.equal(formatCount(2000, "fr"), "2 000");
        assert.equal(formatCount(1_400_000, "en"), "1,400,000");
        assert.equal(formatCount(1_008_000, "fr"), "1 008 000");
        assert.equal(formatCount(50, "fr"), "50");
        assert.equal(formatCount(0, "en"), "0");
        assert.equal(formatCount(-12345, "en"), "-12,345");
        assert.equal(formatCount(1234.5, "fr"), "1 234.5");
    });

    test("never the narrow or no-break spaces that Intl puts in French numbers", () => {
        for (const plan of PLANS) {
            for (const n of [plan.hour, plan.day, plan.week, plan.month]) {
                const fr = formatCount(n, "fr");
                assert.ok(!fr.includes(NARROW_NBSP) && !fr.includes(NBSP), fr);
            }
        }
    });

    test("the hour figures in French and the week figures in English for each plan", () => {
        assert.deepEqual(
            PLANS.map((plan) => formatCount(plan.hour, "fr")),
            ["2 000", "3 500", "6 000", "10 000"],
        );
        assert.deepEqual(
            PLANS.map((plan) => formatCount(plan.week, "en")),
            ["336,000", "588,000", "1,008,000", "1,680,000"],
        );
    });
});

describe("formatApprox and formatPrice", () => {
    test("the approximate monthly figure of each plan", () => {
        assert.deepEqual(
            PLANS.map((plan) => formatApprox(plan.month)),
            ["~1.4M", "~2.5M", "~4.2M", "~7M"],
        );
    });

    test("the French reading: decimal comma, euro sign after a no-break space", () => {
        assert.equal(formatPrice(2.99, "fr"), `2,99${NBSP}${EURO}`);
        assert.equal(formatPrice(9.99, "fr"), `9,99${NBSP}${EURO}`);
    });

    test("the English reading: euro sign first, decimal point", () => {
        assert.equal(formatPrice(9.99, "en"), `${EURO}9.99`);
        assert.equal(formatPrice(2.99, "en"), `${EURO}2.99`);
    });

    test("a whole amount has no decimals and a short one keeps two", () => {
        assert.equal(formatPrice(5, "fr"), `5${NBSP}${EURO}`);
        assert.equal(formatPrice(4.9, "fr"), `4,90${NBSP}${EURO}`);
    });

    test("the catalog keeps the price amounts of the plans", () => {
        assert.deepEqual(
            PLANS.map((plan) => plan.price?.amount),
            [undefined, 2.99, 4.99, 9.99],
        );
    });
});

describe("formatDate", () => {
    test("long dates in both languages", () => {
        assert.equal(formatDate("2026-10-17", "en"), "October 17, 2026");
        assert.equal(formatDate("2026-10-17", "fr"), "17 octobre 2026");
    });

    test("UTC: the first and the last day of a year never move", () => {
        assert.equal(formatDate("2026-01-01", "en"), "January 1, 2026");
        assert.equal(formatDate("2025-12-31", "fr"), `31 d${E_ACUTE}cembre 2025`);
    });

    test("anything else is returned as given", () => {
        assert.equal(formatDate("soon", "en"), "soon");
        assert.equal(formatDate("2026-13-45", "fr"), "2026-13-45");
        assert.equal(formatDate("2026-02-30", "en"), "2026-02-30");
        assert.equal(formatDate("2028-02-29", "en"), "February 29, 2028");
    });
});
