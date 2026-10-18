import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { type ClipboardLike, COPY_LABELS, copyText } from "@/hooks/useCopy";

/**
 * Builds a clipboard that records what it receives and can refuse writes.
 *
 * @param refuse - Which methods reject: "text" (writeText), "item" (write) or both
 * @param withWrite - False for a clipboard that only has writeText
 * @returns The clipboard and the list of texts written
 */
function fakeClipboard(refuse: readonly ("text" | "item")[] = [], withWrite = true) {
    const written: string[] = [];
    const clipboard: ClipboardLike = {
        writeText: async (text) => {
            if (refuse.includes("text")) throw new Error("NotAllowedError");
            written.push(text);
        },
    };
    if (withWrite) {
        clipboard.write = async (items) => {
            if (refuse.includes("item")) throw new Error("NotAllowedError");
            const blob = await (items[0] as unknown as FakeItem).data["text/plain"];
            written.push(await blob.text());
        };
    }
    return { clipboard, written };
}

interface FakeItem {
    data: Record<string, Promise<Blob>>;
}

test("a string or a function giving a string is written as is", async () => {
    const { clipboard, written } = fakeClipboard();
    assert.equal(await copyText("curl -X POST", clipboard), "copied");
    assert.equal(await copyText(() => "# Hash", clipboard), "copied");
    assert.deepEqual(written, ["curl -X POST", "# Hash"]);
});

test("later text without ClipboardItem is awaited, then written", async () => {
    const { clipboard, written } = fakeClipboard();
    assert.equal(typeof ClipboardItem, "undefined");
    assert.equal(await copyText(async () => "# Later", clipboard), "copied");
    assert.deepEqual(written, ["# Later"]);
});

test("later text goes through a ClipboardItem holding the promise when one exists", async () => {
    const scope = globalThis as { ClipboardItem?: unknown };
    scope.ClipboardItem = class {
        data: Record<string, Promise<Blob>>;
        constructor(data: Record<string, Promise<Blob>>) {
            this.data = data;
        }
    };
    try {
        const ok = fakeClipboard();
        assert.equal(await copyText(async () => "# Item", ok.clipboard), "copied");
        assert.deepEqual(ok.written, ["# Item"]);

        const refused = fakeClipboard(["item"]);
        assert.equal(await copyText(async () => "# Fallback", refused.clipboard), "copied");
        assert.deepEqual(refused.written, ["# Fallback"]);
    } finally {
        delete scope.ClipboardItem;
    }
});

test("a refused write, a failing source or no clipboard at all give failed", async () => {
    assert.equal(await copyText("x", fakeClipboard(["text"]).clipboard), "failed");
    const failing = async (): Promise<string> => {
        throw new Error("fetch failed");
    };
    assert.equal(await copyText(failing, fakeClipboard([], false).clipboard), "failed");
    assert.equal(await copyText("x"), "failed");
});

test("every status label is a message of the common namespace in both locales", () => {
    for (const locale of ["en", "fr"]) {
        const common = JSON.parse(readFileSync(`messages/${locale}/common.json`, "utf8")) as Record<
            string,
            unknown
        >;
        for (const key of Object.values(COPY_LABELS)) assert.equal(typeof common[key], "string");
    }
});
