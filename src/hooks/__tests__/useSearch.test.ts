import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { createElement } from "react";
import { renderToString } from "react-dom/server";

import {
    emptyGroups,
    type Fetcher,
    indexStore,
    loadIndex,
    movedKey,
    pushRecent,
    readRecent,
    selectedKey,
    useSearch,
} from "@/hooks/useSearch";
import { createIndex, docKey } from "@/lib/search";
import type { SearchDoc } from "@/types/search";

// A small v6 French index: the suggested pages, one parameter and one error
const DOCS: SearchDoc[] = [
    { k: "endpoint", t: "Hash", u: "/fr/v6/hash/", r: "/v6/hash", m: ["post"] },
    { k: "param", t: "text", u: "/fr/v6/hash/", h: "p-text", r: "/v6/hash", m: ["post"] },
    { k: "error", t: "Missing text", u: "/fr/v6/hash/", h: "e-1", n: 400 },
    { k: "endpoint", t: "UUID", u: "/fr/v6/uuid/", r: "/v6/uuid", m: ["get"] },
    { k: "endpoint", t: "QR Code", u: "/fr/v6/qrcode/", r: "/v6/qrcode", m: ["get"] },
    { k: "page", t: "Playground", u: "/fr/v6/playground/" },
];

// Rows of the selection tests, in display order
const ROWS = DOCS.slice(0, 3);
const KEYS = ROWS.map(docKey);

/**
 * Builds a fetcher that answers with a status and the test documents, and counts its calls.
 *
 * @param status - HTTP status of every answer
 * @returns The fetcher and the URLs it was called with
 */
function fakeFetch(status = 200): { fetcher: Fetcher; calls: string[] } {
    const calls: string[] = [];
    const fetcher: Fetcher = async (url) => {
        calls.push(url);
        return { ok: status < 400, status, json: async () => DOCS };
    };
    return { fetcher, calls };
}

describe("recent results (moxon-recent)", () => {
    test("only a JSON array of strings is read, at most five", () => {
        assert.deepEqual(readRecent(null), []);
        assert.deepEqual(readRecent("not json"), []);
        assert.deepEqual(readRecent('{"a":1}'), []);
        assert.deepEqual(readRecent('["a",1,"b"]'), ["a", "b"]);
        assert.deepEqual(readRecent(JSON.stringify(["1", "2", "3", "4", "5", "6"])), [
            "1",
            "2",
            "3",
            "4",
            "5",
        ]);
    });

    test("the opened result goes first, once, and the list stays five long", () => {
        assert.deepEqual(pushRecent([], "a"), ["a"]);
        assert.deepEqual(pushRecent(["b", "a", "c"], "a"), ["a", "b", "c"]);
        assert.deepEqual(pushRecent(["1", "2", "3", "4", "5"], "6"), ["6", "1", "2", "3", "4"]);
    });

    test("empty palette: the recent results the index still has, then the other suggestions", () => {
        const index = createIndex(DOCS);
        const groups = emptyGroups(
            index,
            ["/fr/v6/uuid/#", "/fr/v6/gone/#", "/fr/v6/hash/#p-text"],
            "fr",
            "v6",
        );
        assert.deepEqual(
            groups.map((group) => [group.id, group.docs.map(docKey)]),
            [
                ["recent", ["/fr/v6/uuid/#", "/fr/v6/hash/#p-text"]],
                ["suggestions", ["/fr/v6/hash/#", "/fr/v6/qrcode/#", "/fr/v6/playground/#"]],
            ],
        );
        assert.deepEqual(
            emptyGroups(index, [], "fr", "v6").map((group) => group.id),
            ["suggestions"],
        );
        assert.deepEqual(emptyGroups(createIndex([]), [], "fr", "v6"), []);
    });
});

describe("selection", () => {
    test("the first row on desktop, none on a phone, the chosen row while it is listed", () => {
        assert.equal(selectedKey(ROWS, null, "hash", true), KEYS[0]);
        assert.equal(selectedKey(ROWS, null, "hash", false), null);
        assert.equal(selectedKey([], null, "hash", true), null);
        assert.equal(selectedKey(ROWS, { query: "hash", key: KEYS[2] }, "hash", true), KEYS[2]);
        assert.equal(selectedKey(ROWS, { query: "hash", key: null }, "hash", true), null);
        assert.equal(selectedKey(ROWS, { query: "has", key: KEYS[2] }, "hash", true), KEYS[0]);
        assert.equal(selectedKey(ROWS, { query: "hash", key: "/gone/#" }, "hash", false), null);
    });

    test("arrows wrap around, from no selection down is the first row and up the last", () => {
        assert.equal(movedKey(ROWS, KEYS[0], 1), KEYS[1]);
        assert.equal(movedKey(ROWS, KEYS[2], 1), KEYS[0]);
        assert.equal(movedKey(ROWS, KEYS[0], -1), KEYS[2]);
        assert.equal(movedKey(ROWS, null, 1), KEYS[0]);
        assert.equal(movedKey(ROWS, null, -1), KEYS[2]);
        assert.equal(movedKey(ROWS, "/gone/#", 1), KEYS[0]);
        assert.equal(movedKey([], null, 1), null);
    });
});

describe("index loading", () => {
    test("idle, then loading after a microtask, then ready; one fetch per index file", async () => {
        const store = indexStore("v1", "en");
        const seen: string[] = [];
        const stop = store.subscribe(() => seen.push(store.get().status));
        const { fetcher, calls } = fakeFetch();
        const first = loadIndex("v1", "en", fetcher);
        const second = loadIndex("v1", "en", fetcher);
        assert.equal(store.get().status, "idle");
        await Promise.all([first, second]);
        await loadIndex("v1", "en", fetcher);
        stop();
        assert.deepEqual(seen, ["loading", "ready"]);
        assert.deepEqual(calls, ["/search/v1en.json"]);
        assert.equal(store.get().index?.byKey.get("/fr/v6/hash/#p-text")?.t, "text");
        assert.equal(indexStore("v1", "en"), store);
    });

    test("an HTTP error or a network failure is the error state, which a new load leaves", async () => {
        const store = indexStore("v2", "fr");
        await loadIndex("v2", "fr", fakeFetch(404).fetcher);
        assert.deepEqual(store.get(), { status: "error", index: null });
        await loadIndex("v2", "fr", async () => {
            throw new TypeError("offline");
        });
        assert.equal(store.get().status, "error");
        await loadIndex("v2", "fr", fakeFetch().fetcher);
        assert.equal(store.get().status, "ready");
    });
});

describe("server render", () => {
    test("the static export renders the palette idle, with the seed and no result", () => {
        let view: unknown;
        const Probe = () => {
            const search = useSearch({
                version: "v6",
                lang: "fr",
                active: true,
                seed: "post: hash",
            });
            view = {
                status: search.status,
                query: search.query,
                parsed: search.parsed,
                groups: search.groups,
                total: search.total,
                selected: search.selected,
                suggestion: search.suggestion,
            };
            return null;
        };
        assert.equal(typeof window, "undefined");
        renderToString(createElement(Probe));
        assert.deepEqual(view, {
            status: "idle",
            query: "post: hash",
            parsed: { text: "hash", method: "post" },
            groups: [],
            total: 0,
            selected: null,
            suggestion: null,
        });
        assert.equal(indexStore("v6", "fr").get().status, "idle");
    });
});
