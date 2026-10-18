import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
    aliasMap,
    anchorSlug,
    errorId,
    fieldId,
    pageAnchors,
    paramId,
    TRY_ALIASES,
    TRY_ANCHOR,
    tryOperation,
} from "@/lib/anchors";
import type { Block, Operation, Page } from "@/types/content";

const HASH_OP: Operation = {
    id: "default",
    method: "post",
    path: "/hash",
    try: true,
    params: [{ name: "text", type: "string", in: "body", required: true }],
};

const PARAMS: Block = {
    type: "params",
    rows: [
        { name: "text", required: true, description: "Text" },
        { name: "method", required: true, description: "Method" },
    ],
};

const FIELDS: Block = {
    type: "fields",
    rows: [
        { name: "hash", type: "`string`", description: "Digest" },
        { name: "games[].moves", type: "`array`", description: "Moves" },
        { name: "data.items[0].id", type: "`string`", description: "Id" },
    ],
};

const ERRORS: Block = {
    type: "errors",
    rows: [
        { message: "Text is required", description: "Missing", status: 400 },
        { message: "Invalid method", description: "Bad", status: 400 },
    ],
};

const HASH: Page = {
    version: "v6",
    id: "hash",
    kind: "endpoint",
    title: { en: "Hash", fr: "Hash" },
    operations: [HASH_OP],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Param" },
            aliases: ["parametres"],
            blocks: [PARAMS],
        },
        {
            id: "response-fields",
            level: 2,
            title: { en: "Response Fields", fr: "Champs" },
            aliases: ["champs-de-reponse", "response-fields"],
            blocks: [
                FIELDS,
                {
                    type: "fields",
                    rows: [{ name: "hash", type: "`string`", description: "Again" }],
                },
                { type: "try", op: "default" },
            ],
        },
        {
            id: "error-handling",
            level: 2,
            title: { en: "Error Handling", fr: "Erreurs" },
            aliases: ["gestion-des-erreurs"],
            blocks: [ERRORS],
        },
    ],
};

const CHAT: Page = {
    version: "v3",
    id: "chat",
    kind: "endpoint",
    title: { en: "Chat", fr: "Chat" },
    operations: [
        { id: "get", method: "get", path: "/chat", try: false, params: [] },
        { id: "post", method: "post", path: "/chat", try: false, params: [] },
    ],
    sections: [
        { id: "", blocks: [] },
        {
            id: "get-v3-chat",
            level: 2,
            title: { en: "GET /v3/chat", fr: "GET /v3/chat" },
            blocks: [
                { type: "endpoint", op: "get" },
                { type: "params", rows: [{ name: "session", required: true, description: "S" }] },
                { type: "errors", rows: [{ message: "Missing session", description: "M" }] },
            ],
        },
        {
            id: "post-v3-chat",
            level: 2,
            title: { en: "POST /v3/chat", fr: "POST /v3/chat" },
            blocks: [
                { type: "endpoint", op: "post" },
                { type: "params", rows: [{ name: "session", required: true, description: "S" }] },
                {
                    type: "errors",
                    rows: [
                        { message: "Missing session", description: "M" },
                        { message: "Missing message", description: "M" },
                    ],
                },
            ],
        },
    ],
};

describe("row ids", () => {
    test("anchorSlug keeps letters, digits, _ and -, and joins the rest into one hyphen", () => {
        assert.equal(anchorSlug("text"), "text");
        assert.equal(anchorSlug("timezoneOffset"), "timezoneOffset");
        assert.equal(anchorSlug("games[].moves"), "games-moves");
        assert.equal(anchorSlug("data.items[0].id"), "data-items-0-id");
        assert.equal(anchorSlug("X-RateLimit-Limit"), "X-RateLimit-Limit");
        assert.equal(anchorSlug("snake_case"), "snake_case");
        assert.equal(anchorSlug("[]"), "");
    });

    test("prefixes and the operation id", () => {
        assert.equal(paramId("method"), "p-method");
        assert.equal(paramId("session", "get"), "get-p-session");
        assert.equal(fieldId("games[].moves"), "f-games-moves");
        assert.equal(fieldId("id", "post"), "post-f-id");
        assert.equal(errorId(1), "e-1");
        assert.equal(errorId(2, "post"), "post-e-2");
        assert.equal(paramId("*"), "p-row");
    });
});

describe("pageAnchors", () => {
    test("section ids, row ids in table order, duplicates numbered, Try anchor last", () => {
        const anchors = pageAnchors(HASH, "en");
        assert.deepEqual(anchors.sections, ["parameters", "response-fields", "error-handling"]);
        assert.deepEqual(anchors.rows.get(PARAMS), ["p-text", "p-method"]);
        assert.deepEqual(anchors.rows.get(FIELDS), [
            "f-hash",
            "f-games-moves",
            "f-data-items-0-id",
        ]);
        assert.deepEqual(anchors.rows.get(ERRORS), ["e-1", "e-2"]);
        assert.deepEqual(anchors.ids, [
            "parameters",
            "p-text",
            "p-method",
            "response-fields",
            "f-hash",
            "f-games-moves",
            "f-data-items-0-id",
            "f-hash-2",
            "error-handling",
            "e-1",
            "e-2",
            TRY_ANCHOR,
        ]);
    });

    test("ids are unique and parse as ref: sections", () => {
        for (const page of [HASH, CHAT]) {
            for (const lang of ["en", "fr"] as const) {
                const { ids } = pageAnchors(page, lang);
                assert.equal(new Set(ids).size, ids.length);
                for (const id of ids) assert.match(id, /^[A-Za-z0-9][A-Za-z0-9_-]*$/);
            }
        }
    });

    test("a page with two operations prefixes each row with the operation of its section", () => {
        const { ids } = pageAnchors(CHAT, "fr");
        assert.deepEqual(ids, [
            "get-v3-chat",
            "get-p-session",
            "get-e-1",
            "post-v3-chat",
            "post-p-session",
            "post-e-1",
            "post-e-2",
        ]);
    });

    test("split branches and one-language sections follow the language", () => {
        const page: Page = {
            ...HASH,
            operations: [],
            sections: [
                {
                    id: "only-fr",
                    level: 2,
                    title: { en: "", fr: "Seulement" },
                    only: "fr",
                    blocks: [
                        {
                            type: "params",
                            rows: [{ name: "a", required: false, description: "A" }],
                        },
                    ],
                },
                {
                    id: "shared",
                    level: 2,
                    title: { en: "Shared", fr: "Commun" },
                    blocks: [
                        {
                            type: "split",
                            en: [{ type: "errors", rows: [{ message: "x", description: "x" }] }],
                            fr: [
                                {
                                    type: "details",
                                    title: "D",
                                    body: [
                                        {
                                            type: "fields",
                                            rows: [{ name: "b", type: "t", description: "B" }],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        assert.deepEqual(pageAnchors(page, "en").ids, ["shared", "e-1"]);
        assert.deepEqual(pageAnchors(page, "fr").ids, ["only-fr", "p-a", "shared", "f-b"]);
        assert.deepEqual(pageAnchors(page, "en").sections, ["shared"]);
    });
});

describe("tryOperation and aliasMap", () => {
    test("the Try panel needs a Try block whose operation can be called live", () => {
        assert.equal(tryOperation(HASH), HASH_OP);
        assert.equal(tryOperation(CHAT), undefined);
        const dead: Page = { ...HASH, operations: [{ ...HASH_OP, try: false }] };
        assert.equal(tryOperation(dead), undefined);
        assert.ok(!pageAnchors(dead, "en").ids.includes(TRY_ANCHOR));
        const auto: Page = {
            ...HASH,
            sections: [{ id: "", blocks: [{ type: "try", op: "default", autoSend: true }] }],
        };
        assert.equal(tryOperation(auto), undefined);
    });

    test("legacy section slugs and the Try heading ids map to the current ids", () => {
        assert.deepEqual(aliasMap(HASH, "fr"), {
            parametres: "parameters",
            "champs-de-reponse": "response-fields",
            "gestion-des-erreurs": "error-handling",
            "try-it": TRY_ANCHOR,
            essayer: TRY_ANCHOR,
        });
        assert.deepEqual(TRY_ALIASES, ["try-it", "essayer"]);
        assert.deepEqual(aliasMap(CHAT, "en"), {});
    });
});
