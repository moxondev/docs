import assert from "node:assert/strict";
import { test } from "node:test";

import type { ApiResponse } from "@/lib/request";

import { formatBytes, hangingIndent, nextTab, responseSize, statusTone } from "./util";

/**
 * Builds an answer for the size tests.
 *
 * @param extra - Fields that differ from a plain empty JSON answer
 * @returns A complete ApiResponse
 */
function answer(extra: Partial<ApiResponse>): ApiResponse {
    return { status: 200, statusText: "OK", ms: 1, kind: "json", body: "", headers: {}, ...extra };
}

test("a long keyed string hangs under its first character", () => {
    const line = `  "hash": "${"a".repeat(64)}",`;
    assert.deepEqual(hangingIndent(line), { lead: 2, hang: 11 });
});

test("a long array string hangs one column inside its quote", () => {
    assert.deepEqual(hangingIndent(`    "${"b".repeat(60)}"`), { lead: 4, hang: 5 });
});

test("short lines, numbers and brackets keep the plain layout", () => {
    assert.equal(hangingIndent('  "method": "sha256",'), null);
    assert.equal(hangingIndent(`  "count": ${"1".repeat(50)}`), null);
    assert.equal(hangingIndent("{"), null);
});

test("sizes print in bytes below 1 kB and with one decimal above", () => {
    assert.equal(formatBytes(0), "0 B");
    assert.equal(formatBytes(143), "143 B");
    assert.equal(formatBytes(1024), "1.0 kB");
    assert.equal(formatBytes(1536), "1.5 kB");
    assert.equal(formatBytes(3 * 1024 * 1024), "3.0 MB");
});

test("the size of an answer is its UTF-8 length, or the header for an image", () => {
    assert.equal(responseSize(answer({ body: `caf${String.fromCodePoint(0xe9)}` })), 5);
    assert.equal(
        responseSize(answer({ kind: "image", headers: { "content-length": "812" } })),
        812,
    );
    assert.equal(responseSize(answer({ kind: "image" })), null);
    assert.equal(responseSize(answer({ kind: "error", status: 0 })), null);
});

test("2xx is green and every other status, the network failure included, is amber", () => {
    assert.equal(statusTone(200), "ok");
    assert.equal(statusTone(204), "ok");
    assert.equal(statusTone(301), "warn");
    assert.equal(statusTone(429), "warn");
    assert.equal(statusTone(0), "warn");
});

test("arrows move to the next tab and wrap around, Home and End jump to the ends", () => {
    assert.equal(nextTab(4, 0, "ArrowRight"), 1);
    assert.equal(nextTab(4, 3, "ArrowRight"), 0);
    assert.equal(nextTab(4, 0, "ArrowLeft"), 3);
    assert.equal(nextTab(4, 2, "Home"), 0);
    assert.equal(nextTab(4, 1, "End"), 3);
    assert.equal(nextTab(4, 1, "Enter"), null);
});
