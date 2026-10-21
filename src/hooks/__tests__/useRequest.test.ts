import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
    fieldIssues,
    initialRequest,
    requestReducer,
    type RequestState,
    shouldSend,
} from "@/hooks/useRequest";
import type { KeyPress } from "@/hooks/useShortcuts";
import type { ApiResponse } from "@/lib/request";
import type { Operation } from "@/types/content";

const HASH: Operation = {
    id: "default",
    method: "post",
    path: "/hash",
    try: true,
    params: [
        { name: "text", type: "string", in: "body", required: true },
        { name: "method", type: "enum", in: "body", required: false, default: "sha256" },
        { name: "options", type: "json", in: "body", required: false },
    ],
};

const INFOS: Operation = { id: "default", method: "get", path: "/infos", try: true, params: [] };

const FORFEIT: Operation = {
    id: "default",
    method: "post",
    path: "/tic-tac-toe/forfeit",
    try: true,
    params: [{ name: "game", type: "string", in: "body", required: true, value: "4f2a" }],
};

const OK: ApiResponse = {
    status: 200,
    statusText: "OK",
    ms: 41,
    kind: "json",
    body: "{}",
    headers: {},
};

/**
 * Builds a key press with no modifier unless given.
 *
 * @param key - Character or key name produced (event.key)
 * @param extra - Modifiers held
 * @returns The press, as the fields of a KeyboardEvent that shouldSend reads
 */
function press(key: string, extra: Partial<KeyPress> = {}): KeyPress {
    return {
        key,
        code: key,
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        ...extra,
    };
}

describe("first state", () => {
    test("presets and defaults fill the form, the phase is idle", () => {
        assert.deepEqual(initialRequest(HASH), {
            phase: "idle",
            values: { text: "", method: "sha256", options: "" },
            touched: [],
            focus: null,
            response: null,
        });
        assert.deepEqual(initialRequest(FORFEIT).values, { game: "4f2a" });
    });

    test("auto-send starts loading at once, only when nothing required is missing", () => {
        assert.equal(initialRequest(INFOS, true).phase, "loading");
        assert.equal(initialRequest(FORFEIT, true).phase, "loading");
        assert.equal(initialRequest(HASH, true).phase, "idle");
        assert.equal(initialRequest(INFOS).phase, "idle");
    });
});

describe("transitions", () => {
    const idle: RequestState = initialRequest(HASH);

    test("an edit changes one value and marks the field touched once", () => {
        const one = requestReducer(idle, { type: "edit", name: "text", value: "hello" });
        assert.deepEqual(one.values, { text: "hello", method: "sha256", options: "" });
        assert.deepEqual(one.touched, ["text"]);
        const two = requestReducer(one, { type: "edit", name: "text", value: "" });
        assert.deepEqual(two.touched, ["text"]);
        assert.equal(requestReducer(two, { type: "edit", name: "text", value: "" }), two);
        assert.deepEqual(idle.values.text, "");
    });

    test("an answer with a status is done, a network failure or a timeout is error", () => {
        const loading = requestReducer(idle, { type: "start" });
        assert.equal(loading.phase, "loading");
        assert.equal(requestReducer(loading, { type: "start" }), loading);
        const done = requestReducer(loading, { type: "finish", response: OK });
        assert.equal(done.phase, "done");
        assert.equal(done.response, OK);
        const limited = { ...OK, status: 429, kind: "json" as const };
        const slow = requestReducer(loading, { type: "finish", response: limited, retry: 12 });
        assert.equal(slow.phase, "done");
        assert.equal(slow.retry, 12);
        const failed: ApiResponse = { ...OK, status: 0, kind: "error", error: "timeout" };
        assert.equal(requestReducer(loading, { type: "finish", response: failed }).phase, "error");
    });

    test("the previous answer stays visible while the next request loads", () => {
        const done = requestReducer(requestReducer(idle, { type: "start" }), {
            type: "finish",
            response: OK,
        });
        const again = requestReducer(done, { type: "start" });
        assert.equal(again.phase, "loading");
        assert.equal(again.response, OK);
    });

    test("reset clears the answer and keeps the values; load replaces the values", () => {
        const edited = requestReducer(idle, { type: "edit", name: "text", value: "hello" });
        const done = requestReducer(edited, { type: "finish", response: OK, retry: 3 });
        const cleared = requestReducer(done, { type: "reset" });
        assert.equal(cleared.phase, "idle");
        assert.equal(cleared.response, null);
        assert.equal(cleared.retry, undefined);
        assert.equal(cleared.values.text, "hello");
        assert.equal(requestReducer(cleared, { type: "reset" }), cleared);
        const loaded = requestReducer(cleared, { type: "load", values: { text: "x" } });
        assert.deepEqual(loaded.values, { text: "x" });
        assert.deepEqual(loaded.touched, []);
    });
});

describe("flagging a skipped field", () => {
    test("a flag marks the field as touched, so its required issue shows, and asks for the focus", () => {
        const start = initialRequest(HASH);
        assert.deepEqual(fieldIssues(HASH, start.values, start.touched), {});
        const flagged = requestReducer(start, { type: "flag", name: "text" });
        assert.deepEqual(flagged.touched, ["text"]);
        assert.deepEqual(flagged.focus, { name: "text", seq: 1 });
        assert.deepEqual(fieldIssues(HASH, flagged.values, flagged.touched), { text: "required" });
        assert.equal(flagged.phase, "idle");
    });

    test("flagging again asks for the focus again and keeps one touched entry", () => {
        const once = requestReducer(initialRequest(HASH), { type: "flag", name: "text" });
        const twice = requestReducer(once, { type: "flag", name: "text" });
        assert.deepEqual(twice.touched, ["text"]);
        assert.deepEqual(twice.focus, { name: "text", seq: 2 });
    });

    test("typing a value clears the flag, which only shows for an empty required field", () => {
        const flagged = requestReducer(initialRequest(HASH), { type: "flag", name: "text" });
        const typed = requestReducer(flagged, { type: "edit", name: "text", value: "a" });
        assert.deepEqual(fieldIssues(HASH, typed.values, typed.touched), {});
    });
});

describe("checks and keys", () => {
    test("a required field is flagged once the reader empties it, invalid JSON always", () => {
        assert.deepEqual(fieldIssues(HASH, { text: "" }, []), {});
        assert.deepEqual(fieldIssues(HASH, { text: "" }, ["text"]), { text: "required" });
        assert.deepEqual(fieldIssues(HASH, { text: "a", options: "{" }, []), { options: "json" });
        assert.deepEqual(fieldIssues(HASH, { text: "a", options: '{"a":1}' }, []), {});
        assert.deepEqual(fieldIssues(HASH, { text: "a", method: "{" }, ["method"]), {});
    });

    test("Ctrl or Cmd+Enter sends from anywhere in the form", () => {
        assert.ok(shouldSend(press("Enter", { ctrlKey: true }), { tagName: "TEXTAREA" }));
        assert.ok(shouldSend(press("Enter", { metaKey: true }), { tagName: "BUTTON" }));
        assert.ok(shouldSend(press("Enter", { metaKey: true }), null));
    });

    test("plain Enter sends from a text input only, never with a modifier", () => {
        assert.ok(shouldSend(press("Enter"), { tagName: "INPUT", type: "text" }));
        assert.ok(shouldSend(press("Enter"), { tagName: "INPUT", type: "number" }));
        assert.ok(!shouldSend(press("Enter"), { tagName: "TEXTAREA" }));
        assert.ok(!shouldSend(press("Enter"), { tagName: "SELECT" }));
        assert.ok(!shouldSend(press("Enter"), { tagName: "BUTTON" }));
        assert.ok(!shouldSend(press("Enter", { shiftKey: true }), { tagName: "INPUT" }));
        assert.ok(!shouldSend(press("Enter", { altKey: true }), { tagName: "INPUT" }));
        assert.ok(!shouldSend(press("a"), { tagName: "INPUT" }));
    });
});
