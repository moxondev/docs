import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { blockOperations } from "@/components/doc/ops";
import { getPage } from "@/lib/pages";
import type { Page } from "@/types/content";

/**
 * Loads a page of the data for the tests.
 *
 * @param version - Version whose data holds the page
 * @param id - Id of the page within that version
 * @returns The page, which must exist
 */
async function load(version: string, id: string): Promise<Page> {
    const page = await getPage(version, id);
    assert.ok(page, `${version}/${id} exists`);
    return page;
}

describe("operation of each block", () => {
    test("a single-operation page gives its operation to every block", async () => {
        const page = await load("v6", "hash");
        const map = blockOperations(page, "en");
        const params = page.sections
            .flatMap((section) => section.blocks)
            .find((b) => b.type === "params");
        assert.ok(params);
        assert.equal(map.get(params)?.id, "default");
    });

    test("a page without operations maps its blocks to none", async () => {
        const page = await load("v6", "authentication");
        const map = blockOperations(page, "fr");
        assert.ok(map.size > 0);
        assert.ok([...map.values()].every((operation) => operation === undefined));
    });

    test("a one-language section of the other language is not walked", () => {
        const page: Page = {
            version: "v6",
            id: "x",
            kind: "article",
            title: { en: "X", fr: "X" },
            sections: [
                { id: "a", only: "en", blocks: [{ type: "p", text: "en" }] },
                { id: "b", only: "fr", blocks: [{ type: "p", text: "fr" }] },
            ],
        };
        assert.equal(blockOperations(page, "fr").size, 1);
    });

    test("both branches of a split and the body of a details block are walked", () => {
        const page: Page = {
            version: "v6",
            id: "x",
            kind: "article",
            title: { en: "X", fr: "X" },
            sections: [
                {
                    id: "a",
                    blocks: [
                        {
                            type: "split",
                            en: [{ type: "p", text: "en" }],
                            fr: [{ type: "p", text: "fr" }, { type: "rule" }],
                        },
                        { type: "details", title: "t", body: [{ type: "rule" }] },
                    ],
                },
            ],
        };
        assert.equal(blockOperations(page, "fr").size, 5);
        assert.equal(blockOperations(page, "en").size, 4);
    });
});
