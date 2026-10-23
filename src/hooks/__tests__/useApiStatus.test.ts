import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { CHECK_TTL, freshCheck, healthStatus } from "@/hooks/useApiStatus";

describe("healthStatus", () => {
    test("no answer or a server error is down", () => {
        assert.equal(healthStatus(null), "down");
        assert.equal(healthStatus({ status: 502, body: null }), "down");
        assert.equal(healthStatus({ status: 503, body: { status: "ok" } }), "down");
    });

    test("a 200 is up only when its status is ok", () => {
        assert.equal(healthStatus({ status: 200, body: { status: "ok" } }), "up");
        assert.equal(healthStatus({ status: 200, body: { status: "degraded" } }), "down");
        assert.equal(healthStatus({ status: 200, body: null }), "down");
    });

    test("only a rate limit still proves the API answers", () => {
        assert.equal(healthStatus({ status: 429, body: null }), "up");
        assert.equal(healthStatus({ status: 404, body: { error: "Not found" } }), "down");
        assert.equal(healthStatus({ status: 403, body: null }), "down");
    });
});

describe("freshCheck", () => {
    const now = 1_800_000_000_000;

    test("a recent check is kept", () => {
        const raw = JSON.stringify({ status: "down", at: now - 1000 });
        assert.deepEqual(freshCheck(raw, now), { status: "down", at: now - 1000 });
    });

    test("an old, future, malformed or missing check is ignored", () => {
        assert.equal(freshCheck(JSON.stringify({ status: "up", at: now - CHECK_TTL }), now), null);
        assert.equal(freshCheck(JSON.stringify({ status: "up", at: now + 5000 }), now), null);
        assert.equal(freshCheck(JSON.stringify({ status: "maybe", at: now }), now), null);
        assert.equal(freshCheck("{not json", now), null);
        assert.equal(freshCheck(null, now), null);
    });
});
