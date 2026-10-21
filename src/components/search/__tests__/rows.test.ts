import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { Command } from "cmdk";
import { NextIntlClientProvider } from "next-intl";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { docEntry, type Section } from "@/components/search/entries";
import { Preview } from "@/components/search/Preview";
import { Results } from "@/components/search/Results";
import { PAGE_STATUSES } from "@/lib/nav";
import { createIndex } from "@/lib/search";
import type { Lang, PageStatus } from "@/types/content";
import type { SearchDoc } from "@/types/search";

import aria from "../../../../messages/en/aria.json";
import common from "../../../../messages/en/common.json";
import search from "../../../../messages/en/search.json";

// Provider messages of the rows: the root ones plus the lazy search namespace
const MESSAGES = { aria, common, search };

// Catalogue counts of the hint of the "browse" row
const CATALOGUE = { endpoints: 12, categories: 4 };

/**
 * Builds the endpoint document of a page that carries a status, as the index file holds it.
 *
 * @param status - Status of the page, absent for an ordinary one
 * @param methods - Methods of the endpoint
 * @returns The document
 */
function endpoint(status: PageStatus | undefined, methods: SearchDoc["m"]): SearchDoc {
    const doc: SearchDoc = { k: "endpoint", t: "Sample", u: "/v6/sample/", r: "/v6/sample" };
    if (methods) doc.m = methods;
    if (status) doc.s = status;
    return doc;
}

/**
 * Renders an element inside the intl provider the palette gives its rows.
 *
 * @param element - Row list or preview to render, wrapped in the provider of the palette messages
 * @returns The static HTML
 */
function render(element: ReactElement): string {
    const props = { locale: "en", messages: MESSAGES, timeZone: "UTC", children: element };
    return renderToStaticMarkup(createElement(NextIntlClientProvider, props));
}

/**
 * Renders the result list for one document, inside the cmdk root the rows need.
 *
 * @param doc - Document of the only row
 * @returns The static HTML of the list
 */
function rows(doc: SearchDoc): string {
    const sections: Section[] = [{ id: "endpoints", entries: [docEntry(doc)] }];
    const list = createElement(Results, {
        sections,
        words: [],
        index: createIndex([doc]),
        catalogue: CATALOGUE,
        onActivate: () => undefined,
    });
    return render(createElement(Command, { shouldFilter: false }, list));
}

/**
 * Renders the preview of one document.
 *
 * @param doc - Selected document
 * @param lang - Language of the index
 * @returns The static HTML of the preview
 */
function preview(doc: SearchDoc, lang: Lang = "en"): string {
    const props = {
        entry: docEntry(doc),
        index: createIndex([doc]),
        lang,
        onActivate: () => undefined,
    };
    return render(createElement(Preview, props));
}

describe("result rows", () => {
    test("a page without status draws no pictogram", () => {
        assert.doesNotMatch(rows(endpoint(undefined, ["post"])), /role="img"/);
    });

    for (const status of PAGE_STATUSES) {
        test(`the pictogram of the ${status} status follows the name, with its word`, () => {
            const label = (common.status as Record<string, string>)[status];
            assert.ok(label, `common.status.${status} is missing from the messages`);
            const html = rows(endpoint(status, ["post"]));
            assert.match(html, new RegExp(`role="img"[^>]*aria-label="${label}"`));
            assert.ok(html.indexOf(">Sample<") < html.indexOf('role="img"'));
        });

        test(`the preview of a page with the ${status} status prints the word on its marker`, () => {
            const label = (common.status as Record<string, string>)[status];
            const html = preview(endpoint(status, ["post"]));
            assert.match(html, new RegExp(`>${label}</span>`));
        });
    }
});

describe("method marks", () => {
    test("rows and preview use the small tinted chip, with no override from the wrapper", () => {
        for (const html of [
            rows(endpoint(undefined, ["post"])),
            preview(endpoint(undefined, ["post"])),
        ]) {
            assert.match(html, /bg-post-bg text-post/);
            assert.match(html, /rounded-chip px-1\.25 py-0\.5 text-\[11px\]\/3\.25/);
            assert.doesNotMatch(html, /\[&>span\]/);
        }
    });

    test("a family of two methods stacks its chips in the mark column", () => {
        const html = rows(endpoint(undefined, ["get", "post"]));
        assert.match(html, /flex-col items-center gap-0\.5/);
        assert.ok(html.indexOf(">get<") < html.indexOf(">post<"));
        assert.match(html, /bg-get-bg text-get/);
    });

    test("a page with no method draws no chip", () => {
        assert.doesNotMatch(rows(endpoint(undefined, undefined)), /bg-post-bg|bg-get-bg/);
    });
});
