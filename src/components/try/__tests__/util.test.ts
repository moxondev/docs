import assert from "node:assert/strict";
import { test } from "node:test";

import {
    controlSpan,
    featuredOptions,
    formatBytes,
    hangingIndent,
    nextTab,
    optionCount,
    responseSize,
    splitParams,
    statusAccent,
    statusLabel,
    statusTone,
    textareaRows,
    typeHint,
} from "@/components/try/util";
import type { ApiResponse } from "@/lib/request";
import type { ParamSpec } from "@/types/content";

/**
 * Builds an answer for the size tests.
 *
 * @param extra - Fields that differ from a plain empty JSON answer
 * @returns A complete ApiResponse
 */
function answer(extra: Partial<ApiResponse>): ApiResponse {
    return { status: 200, statusText: "OK", ms: 1, kind: "json", body: "", headers: {}, ...extra };
}

/**
 * Builds a parameter for the bench form tests.
 *
 * @param extra - Fields that differ from an optional body string without hints
 * @returns A complete ParamSpec
 */
function param(extra: Partial<ParamSpec>): ParamSpec {
    return { name: "p", type: "string", in: "body", required: false, ...extra };
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

test("the quiet status has one accent: red from 400 and for no answer, ink otherwise", () => {
    assert.equal(statusAccent(200), "ink");
    assert.equal(statusAccent(204), "ink");
    assert.equal(statusAccent(301), "ink");
    assert.equal(statusAccent(399), "ink");
    assert.equal(statusAccent(400), "req");
    assert.equal(statusAccent(429), "req");
    assert.equal(statusAccent(503), "req");
    assert.equal(statusAccent(0), "req");
});

test("a text area is drawn for JSON and for a string whose placeholder has a line break", () => {
    const base = { name: "x", in: "body", required: true } as const;
    assert.equal(textareaRows({ ...base, type: "json" }), 4);
    assert.equal(textareaRows({ ...base, type: "string", placeholder: "name,age\nAlice,30" }), 2);
    assert.equal(textareaRows({ ...base, type: "string", placeholder: "Alice" }), null);
    assert.equal(textareaRows({ ...base, type: "string" }), null);
    assert.equal(textareaRows({ ...base, type: "number", placeholder: "1\n2" }), null);
    assert.equal(textareaRows({ ...base, type: "enum", options: ["a", "b", "c", "d"] }), null);
});

test("the type is printed for a number and a JSON value, unless the name already says it", () => {
    const base = { in: "body", required: true } as const;
    assert.equal(typeHint({ ...base, name: "limit", type: "number" }), "number");
    assert.equal(typeHint({ ...base, name: "options", type: "json" }), "json");
    assert.equal(typeHint({ ...base, name: "json", type: "json" }), null);
    assert.equal(typeHint({ ...base, name: "text", type: "string" }), null);
    assert.equal(typeHint({ ...base, name: "on", type: "boolean" }), null);
    assert.equal(typeHint({ ...base, name: "mode", type: "enum", options: ["a"] }), null);
});

test("arrows move to the next tab and wrap around, Home and End jump to the ends", () => {
    assert.equal(nextTab(4, 0, "ArrowRight"), 1);
    assert.equal(nextTab(4, 3, "ArrowRight"), 0);
    assert.equal(nextTab(4, 0, "ArrowLeft"), 3);
    assert.equal(nextTab(4, 2, "Home"), 0);
    assert.equal(nextTab(4, 1, "End"), 3);
    assert.equal(nextTab(4, 1, "Enter"), null);
});

test("the status label follows the phase and the answer", () => {
    const labels = { sending: "Sending", error: "Error" };
    assert.equal(statusLabel("loading", null, labels), "Sending");
    assert.equal(statusLabel("loading", answer({}), labels), "Sending");
    assert.equal(statusLabel("done", answer({}), labels), "200 OK");
    assert.equal(statusLabel("done", answer({ status: 429, statusText: "" }), labels), "429");
    assert.equal(statusLabel("error", answer({ kind: "error", status: 0 }), labels), "Error");
});

test("numbers, booleans and short segmented controls take half a row", () => {
    assert.equal(controlSpan(param({ type: "number" })), "half");
    assert.equal(controlSpan(param({ type: "boolean" })), "half");
    assert.equal(
        controlSpan(param({ type: "enum", options: ["sha1", "sha256", "sha512"] })),
        "half",
    );
    assert.equal(controlSpan(param({ type: "enum", options: ["15", "30", "60"] })), "half");
    assert.equal(controlSpan(param({ type: "enum", options: ["hex", "base64"] })), "half");
});

test("a segmented control of more than 16 characters of options keeps the full row", () => {
    const wide = param({ type: "enum", options: ["secret", "generate", "verify"] });
    assert.equal(controlSpan(wide), "full");
    const edge = param({ type: "enum", options: ["abcdefgh", "abcdefgh", "a"] });
    assert.equal(controlSpan(edge), "full");
    const limit = param({ type: "enum", options: ["abcdefgh", "abcdefg", "a"] });
    assert.equal(controlSpan(limit), "half");
});

test("an enum of more than three options is a select and keeps the full row", () => {
    assert.equal(controlSpan(param({ type: "enum", options: ["a", "b", "c", "d"] })), "full");
    assert.equal(controlSpan(param({ type: "enum" })), "full");
});

test("json and text fields keep the full row unless their placeholder is short", () => {
    assert.equal(controlSpan(param({ type: "json" })), "full");
    assert.equal(controlSpan(param({})), "full");
    assert.equal(controlSpan(param({ placeholder: "alice" })), "half");
    assert.equal(controlSpan(param({ placeholder: "JBSWY3DPEHPK3PXP" })), "full");
    assert.equal(controlSpan(param({ placeholder: "Hello World" })), "full");
});

test("required and conditional parameters go first, optional ones second, in order", () => {
    const groups = splitParams([
        param({ name: "a", required: false }),
        param({ name: "b", required: true }),
        param({ name: "c", required: "conditional" }),
        param({ name: "d", required: false }),
    ]);
    assert.deepEqual(
        groups.required.map((item) => item.name),
        ["b", "c"],
    );
    assert.deepEqual(
        groups.optional.map((item) => item.name),
        ["a", "d"],
    );
});

test("an operation without parameters has two empty groups, and a lone group leaves the other empty", () => {
    const none = splitParams([]);
    assert.equal(none.required.length + none.optional.length, 0);
    const only = splitParams([param({ name: "uuid" }), param({ name: "count", type: "number" })]);
    assert.equal(only.required.length, 0);
    assert.equal(only.optional.length, 2);
});

test("the figure of an enum field is the length of its options, whatever it is", () => {
    const many = Array.from({ length: 52 }, (_, index) => `m${index}`);
    assert.equal(optionCount(param({ type: "enum", options: many })), 52);
    assert.equal(optionCount(param({ type: "enum", options: many.slice(0, 17) })), 17);
    assert.equal(optionCount(param({})), 0);
});

test("only the featured values that are real options become chips", () => {
    const method = param({
        type: "enum",
        options: ["sha256", "sha512", "md5"],
        featured: ["md5", "ghost", "sha256"],
    });
    assert.deepEqual(featuredOptions(method), ["md5", "sha256"]);
    assert.deepEqual(featuredOptions(param({ type: "string", featured: ["a"] })), []);
    assert.deepEqual(featuredOptions(param({ type: "enum", options: ["a"] })), []);
});
