import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
    apiPath,
    buildUrl,
    exampleRequest,
    firstMissing,
    hasBody,
    initialValues,
    isComplete,
    pathParams,
    prepareRequest,
    requestInit,
    retryAfter,
    send,
    STATUS_TEXT,
} from "@/lib/request";
import type { Operation } from "@/types/content";

const CHAT_DELETE: Operation = {
    id: "default",
    method: "delete",
    path: "/chat/:token",
    try: true,
    params: [
        { name: "token", type: "string", in: "path", required: true },
        { name: "username", type: "string", in: "body", required: true },
    ],
};

const GAME_PATCH: Operation = {
    id: "default",
    method: "patch",
    path: "/tic-tac-toe/:game",
    try: true,
    params: [
        { name: "game", type: "string", in: "path", required: true },
        { name: "move", type: "string", in: "body", required: true },
        { name: "private", type: "boolean", in: "body", required: false },
    ],
};

const PASSWORD: Operation = {
    id: "default",
    method: "get",
    path: "/password",
    try: true,
    params: [
        { name: "len", type: "number", in: "query", required: false, default: "16" },
        { name: "symbols", type: "boolean", in: "query", required: false },
        { name: "type", type: "enum", in: "query", required: true, options: ["a", "b"] },
    ],
};

const MATRIX: Operation = {
    id: "default",
    method: "post",
    path: "/matrix",
    try: true,
    params: [
        { name: "matrix", type: "json", in: "body", required: true },
        { name: "matrix2", type: "json", in: "body", required: false },
        { name: "size", type: "number", in: "body", required: false },
        { name: "mode", type: "string", in: "query", required: "conditional" },
    ],
};

describe("URLs", () => {
    test("API base, version, then the path", () => {
        assert.equal(buildUrl("v6", PASSWORD, {}), "https://api.moxon.dev/v6/password");
    });

    test("placeholders take the encoded form value, an empty one stays visible", () => {
        assert.deepEqual(pathParams("/tic-tac-toe/:game/:id"), ["game", "id"]);
        assert.equal(
            buildUrl("v4", CHAT_DELETE, { token: "41a4" }),
            "https://api.moxon.dev/v4/chat/41a4",
        );
        assert.equal(
            buildUrl("v4", CHAT_DELETE, { token: "a b/c" }),
            "https://api.moxon.dev/v4/chat/a%20b%2Fc",
        );
        assert.equal(buildUrl("v4", CHAT_DELETE, {}), "https://api.moxon.dev/v4/chat/:token");
    });
});

describe("apiPath", () => {
    const HEALTH: Operation = {
        id: "health",
        method: "get",
        path: "/health",
        root: true,
        try: true,
        params: [],
    };

    test("a versioned operation is served after its version, a root one alone", () => {
        assert.equal(apiPath("v6", PASSWORD), "/v6/password");
        assert.equal(apiPath("v6", HEALTH), "/health");
        assert.equal(apiPath("v5", PASSWORD, "/password/x"), "/v5/password/x");
    });

    test("the request of a root operation has no version", () => {
        assert.equal(prepareRequest("v6", HEALTH, {}).url, "https://api.moxon.dev/health");
    });
});

describe("prepareRequest", () => {
    test("GET: filled values in the query string, in parameter order, empty ones left out", () => {
        const req = prepareRequest("v6", PASSWORD, { symbols: "true", len: "", type: "a" });
        assert.deepEqual(req, {
            method: "get",
            url: "https://api.moxon.dev/v6/password?symbols=true&type=a",
        });
        assert.equal(prepareRequest("v6", PASSWORD, {}).url, "https://api.moxon.dev/v6/password");
    });

    test("GET: values are URL-encoded", () => {
        const req = prepareRequest("v6", PASSWORD, { type: "a b&c=d" });
        assert.equal(req.url, "https://api.moxon.dev/v6/password?type=a+b%26c%3Dd");
    });

    test("DELETE: the placeholder goes into the path and never into the body", () => {
        const req = prepareRequest("v4", CHAT_DELETE, { token: "41a4", username: "User1" });
        assert.deepEqual(req, {
            method: "delete",
            url: "https://api.moxon.dev/v4/chat/41a4",
            body: { username: "User1" },
        });
    });

    test("PATCH: booleans become real booleans", () => {
        const on = prepareRequest("v4", GAME_PATCH, {
            game: "VWXYZ",
            move: "2-2",
            private: "true",
        });
        assert.deepEqual(on.body, { move: "2-2", private: true });
        assert.equal(on.url, "https://api.moxon.dev/v4/tic-tac-toe/VWXYZ");
        const off = prepareRequest("v4", GAME_PATCH, { game: "X", move: "1-1", private: "false" });
        assert.deepEqual(off.body, { move: "1-1", private: false });
    });

    test("POST: json values are parsed, invalid json is kept as typed, numbers stay strings", () => {
        const req = prepareRequest("v6", MATRIX, {
            matrix: "[[1,2],[3,4]]",
            matrix2: "[[5,6",
            size: "3",
        });
        assert.deepEqual(req.body, {
            matrix: [
                [1, 2],
                [3, 4],
            ],
            matrix2: "[[5,6",
            size: "3",
        });
    });

    test("POST: a query parameter stays in the query string, an empty body is an empty object", () => {
        const req = prepareRequest("v6", MATRIX, { mode: "fast" });
        assert.deepEqual(req, {
            method: "post",
            url: "https://api.moxon.dev/v6/matrix?mode=fast",
            body: {},
        });
    });
});

describe("form state", () => {
    test("initial values: the literal-id preset, else the default, else empty", () => {
        const op: Operation = {
            ...GAME_PATCH,
            params: [
                { name: "game", type: "string", in: "path", required: true, value: "VWXYZ" },
                { name: "move", type: "string", in: "body", required: true, default: "1-1" },
                { name: "private", type: "boolean", in: "body", required: false },
            ],
        };
        assert.deepEqual(initialValues(op), { game: "VWXYZ", move: "1-1", private: "" });
        assert.deepEqual(initialValues(PASSWORD), { len: "16", symbols: "", type: "" });
    });

    test("send is enabled once every required value is filled; conditional ones never block", () => {
        assert.equal(isComplete(PASSWORD, {}), false);
        assert.equal(isComplete(PASSWORD, { type: "a" }), true);
        assert.equal(isComplete(MATRIX, { matrix: "[[1]]" }), true);
        assert.equal(isComplete(CHAT_DELETE, { token: "", username: "u" }), false);
    });

    test("the first missing required value is named in form order, conditional ones never count", () => {
        const op: Operation = {
            ...PASSWORD,
            params: [
                { name: "a", type: "string", in: "body", required: "conditional" },
                { name: "b", type: "string", in: "body", required: true },
                { name: "c", type: "string", in: "body", required: true },
            ],
        };
        assert.equal(firstMissing(op, {}), "b");
        assert.equal(firstMissing(op, { b: "x" }), "c");
        assert.equal(firstMissing(op, { b: "x", c: "y" }), null);
        assert.equal(firstMissing({ ...op, params: [] }, {}), null);
    });

    test("only post, put, patch and delete send a body", () => {
        assert.deepEqual((["get", "post", "put", "patch", "delete"] as const).map(hasBody), [
            false,
            true,
            true,
            true,
            true,
        ]);
    });
});

describe("exampleRequest (Code Examples blocks)", () => {
    test("GET: the sample is the query string, any JSON value printed", () => {
        const req = exampleRequest(
            "v6",
            PASSWORD,
            { type: "examples", op: "default", query: { len: 24, symbols: true, type: "a" } },
            "en",
        );
        assert.deepEqual(req, {
            method: "get",
            url: "https://api.moxon.dev/v6/password?len=24&symbols=true&type=a",
        });
    });

    test("POST: the sample of the language is the body", () => {
        const block = {
            type: "examples" as const,
            op: "default",
            body: { en: { text: "hello" }, fr: { text: "bonjour" } },
        };
        assert.deepEqual(exampleRequest("v6", MATRIX, block, "fr").body, { text: "bonjour" });
        assert.deepEqual(exampleRequest("v6", MATRIX, { type: "examples", op: "default" }, "en"), {
            method: "post",
            url: "https://api.moxon.dev/v6/matrix",
            body: {},
        });
    });

    test("a literal path replaces the operation path", () => {
        const block = {
            type: "examples" as const,
            op: "default",
            path: "/chat/41a4",
            body: { username: "u" },
        };
        assert.equal(
            exampleRequest("v5", CHAT_DELETE, block, "en").url,
            "https://api.moxon.dev/v5/chat/41a4",
        );
    });
});

describe("fetch options (no API key header)", () => {
    test("a body comes with its Content-Type and nothing else", () => {
        const init = requestInit(prepareRequest("v4", CHAT_DELETE, { token: "t", username: "u" }));
        assert.equal(init.method, "DELETE");
        assert.deepEqual(init.headers, { "Content-Type": "application/json" });
        assert.equal(init.body, '{"username":"u"}');
    });

    test("no body, no header: a GET and an empty body are simple requests", () => {
        assert.deepEqual(requestInit(prepareRequest("v6", PASSWORD, { type: "a" })), {
            method: "GET",
        });
        assert.deepEqual(requestInit(prepareRequest("v6", MATRIX, {})), { method: "POST" });
    });
});

describe("send", () => {
    const req = prepareRequest("v6", PASSWORD, { type: "a" });

    // Builds a fake fetch that answers once, or throws when given an error, and records what it saw
    const fake = (answer: Response | Error, seen: { url?: string; init?: RequestInit } = {}) =>
        (async (url: string | URL | Request, init?: RequestInit) => {
            seen.url = String(url);
            seen.init = init;
            if (answer instanceof Error) throw answer;
            return answer;
        }) as typeof fetch;

    test("JSON is pretty-printed, the status gets its reason phrase, headers are kept", async () => {
        const seen: { url?: string; init?: RequestInit } = {};
        const res = await send(
            req,
            undefined,
            fake(
                new Response('{"a":1,"b":[true]}', {
                    status: 429,
                    headers: { "Content-Type": "application/json", "Retry-After": "30" },
                }),
                seen,
            ),
        );
        assert.equal(res.status, 429);
        assert.equal(res.statusText, "Too Many Requests");
        assert.equal(res.kind, "json");
        assert.equal(res.body, '{\n  "a": 1,\n  "b": [\n    true\n  ]\n}');
        assert.equal(res.headers["retry-after"], "30");
        assert.equal(retryAfter(res.headers), 30);
        assert.equal(seen.url, req.url);
        assert.equal(seen.init?.method, "GET");
        assert.ok(seen.init?.signal instanceof AbortSignal);
        assert.ok(res.ms >= 0);
    });

    test("text, and JSON that does not parse, come back as text", async () => {
        const text = await send(req, undefined, fake(new Response("hello", { status: 200 })));
        assert.deepEqual([text.kind, text.body, text.statusText], ["text", "hello", "OK"]);
        const broken = await send(
            req,
            undefined,
            fake(new Response("{oops", { headers: { "content-type": "application/json" } })),
        );
        assert.deepEqual([broken.kind, broken.body], ["text", "{oops"]);
    });

    test("an image becomes a blob URL", async () => {
        const png = new Response(new Uint8Array([137, 80, 78, 71]), {
            headers: { "content-type": "image/png" },
        });
        const res = await send(req, undefined, fake(png));
        assert.equal(res.kind, "image");
        assert.match(res.blobUrl ?? "", /^blob:/);
        URL.revokeObjectURL(res.blobUrl!);
    });

    test("a network failure resolves with status 0", async () => {
        const res = await send(req, undefined, fake(new TypeError("Failed to fetch")));
        assert.deepEqual([res.status, res.kind, res.error, res.body], [0, "error", "network", ""]);
    });

    test("the timeout resolves with status 0, an abort by the caller rejects", async () => {
        const hang = ((_url: string, init?: RequestInit) =>
            new Promise((_resolve, reject) => {
                init?.signal?.addEventListener("abort", () =>
                    reject(new DOMException("aborted", "AbortError")),
                );
            })) as typeof fetch;
        const late = await send(req, undefined, hang, 20);
        assert.deepEqual([late.status, late.error], [0, "timeout"]);
        const controller = new AbortController();
        const pending = send(req, controller.signal, hang, 5_000);
        controller.abort();
        await assert.rejects(pending, { name: "AbortError" });
    });

    test("Retry-After as a date, absent or unreadable", () => {
        const now = Date.parse("2026-10-18T12:00:00Z");
        assert.equal(retryAfter({ "retry-after": "Sun, 18 Oct 2026 12:01:00 GMT" }, now), 60);
        assert.equal(retryAfter({}), undefined);
        assert.equal(retryAfter({ "retry-after": "soon" }), undefined);
    });

    test("the reason phrases cover the statuses of the API", () => {
        for (const status of [200, 400, 401, 404, 429, 500, 503]) assert.ok(STATUS_TEXT[status]);
    });
});
