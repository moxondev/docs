import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";

import { NextIntlClientProvider } from "next-intl";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Callout } from "@/components/doc/Callout";
import type { DocContext } from "@/components/doc/context";
import type { CalloutKind } from "@/types/content";

import common from "../../../../messages/en/common.json";

// Stylesheet of the project, read to check that the tokens of the rules exist
const CSS = readFileSync(join(import.meta.dirname, "../../../app/globals.css"), "utf8");

// Context of a page, reduced to what the plain text of a note reads
const CTX = { lang: "en", version: "v6" } as unknown as DocContext;

/**
 * Renders a note of one kind, with a title, a paragraph and a list.
 *
 * @param kind - Kind of the note, which picks its icon and its rule
 * @returns The static HTML
 */
function render(kind: CalloutKind): string {
    const block = {
        type: "callout" as const,
        kind,
        title: "Title",
        body: [
            { type: "p" as const, text: "Paragraph" },
            { type: "list" as const, items: ["First", "Second"] },
        ],
    };
    const props = {
        locale: "en",
        messages: { common },
        timeZone: "UTC",
        children: createElement(Callout, { block, ctx: CTX }),
    };
    return renderToStaticMarkup(createElement(NextIntlClientProvider, props));
}

describe("Callout", () => {
    test("every kind is a note without box, tint or rounded corner", () => {
        for (const kind of ["info", "tip", "warning", "danger"] as const) {
            const html = render(kind);
            assert.match(html, /role="note"/);
            assert.doesNotMatch(html, /bg-note|border-note|rounded/);
            assert.match(html, /text-text/);
        }
    });

    test("info and tip carry the 2 px ink rule", () => {
        for (const kind of ["info", "tip"] as const) {
            assert.match(render(kind), /border-l-2 border-l-ink/);
        }
    });

    test("warning keeps the yellow and danger the red, in a 3 px rule", () => {
        assert.match(render("warning"), /border-l-3 border-l-hl-edge/);
        assert.match(render("danger"), /border-l-3 border-l-destructive/);
        assert.match(CSS, /--color-hl-edge: var\(--hl-edge\)/);
        assert.match(CSS, /--color-destructive: var\(--destructive\)/);
    });

    test("the text follows the reading measure of the page and wraps normally", () => {
        const html = render("info");
        assert.equal(html.match(/max-w-\(--measure\)/g)?.length, 2);
        assert.doesNotMatch(html, /max-w-\[64ch\]/);
        assert.equal(html.match(/text-wrap/g)?.length, 4);
    });
});
