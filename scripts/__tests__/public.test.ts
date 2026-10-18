import assert from "node:assert/strict";
import { cwd } from "node:process";
import { describe, test } from "node:test";

import type { MarkdownLabels } from "@/lib/markdown";
import { getPage, loadPages } from "@/lib/pages";
import type { Page } from "@/types/content";

import {
    LABEL_KEYS,
    markdownFiles,
    markdownLabels,
    message,
    SEARCH_BUDGET,
    searchFiles,
} from "../public";

/**
 * Builds labels whose words are their own field names, for the shape of the exports.
 *
 * @returns One word per label
 */
function fieldLabels(): MarkdownLabels {
    return Object.fromEntries(Object.keys(LABEL_KEYS).map((key) => [key, key])) as Record<
        keyof MarkdownLabels,
        string
    >;
}

describe("messages read outside Next", () => {
    test("a dotted path gives a string message, anything else undefined", () => {
        assert.equal(message(cwd(), "en", "meta.siteName"), "moxon");
        assert.equal(message(cwd(), "fr", "meta.kinds.endpoint")?.startsWith("L'endpoint"), true);
        assert.equal(message(cwd(), "en", "meta.kinds"), undefined);
        assert.equal(message(cwd(), "en", "meta.nope"), undefined);
        assert.equal(message(cwd(), "en", "meta.constructor"), undefined);
        assert.equal(message(cwd(), "en", "nope.key"), undefined);
    });

    test("the Markdown words come all from the messages, or the missing paths are named", () => {
        for (const lang of ["en", "fr"] as const) {
            const result = markdownLabels(cwd(), lang);
            if (result.labels) {
                assert.deepEqual(Object.keys(result.labels).sort(), Object.keys(LABEL_KEYS).sort());
            } else {
                assert.ok(result.missing.length > 0);
                const paths = new Set(Object.values(LABEL_KEYS));
                assert.ok(result.missing.every((path) => paths.has(path)));
            }
        }
    });
});

describe("public files", () => {
    test("one search index per published version and language, within the budget", async () => {
        const pages = new Map([["v6" as const, await loadPages("v6")]]);
        const { files, sizes } = searchFiles(pages, cwd());
        assert.deepEqual(
            files.map((file) => file.file),
            ["v6en.json", "v6fr.json"],
        );
        assert.ok(sizes.every((size) => size.gzip <= SEARCH_BUDGET && size.docs > 1000));
        assert.ok(Array.isArray(JSON.parse(files[0].text)));
    });

    test("one Markdown export per page and language, the home as index.md", async () => {
        const hash = await getPage("v6", "hash");
        const home = await getPage("v6", "index");
        assert.ok(hash && home);
        const pages = new Map<"v6", Page[]>([["v6", [home, hash]]]);
        const files = markdownFiles(pages, { en: fieldLabels(), fr: fieldLabels() });
        assert.deepEqual(
            files.map((file) => file.file),
            ["v6/en/index.md", "v6/en/hash.md", "v6/fr/index.md", "v6/fr/hash.md"],
        );
        assert.ok(files[1].text.startsWith("# Hash"));
    });
});
