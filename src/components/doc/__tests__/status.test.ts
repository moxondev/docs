import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, test } from "node:test";

import { NextIntlClientProvider } from "next-intl";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Crumb } from "@/components/chrome/Header";
import { Status } from "@/components/doc/Status";
import { PAGE_STATUSES } from "@/lib/nav";
import type { Lang, PageStatus } from "@/types/content";

import en from "../../../../messages/en/common.json";
import fr from "../../../../messages/fr/common.json";

// Letters built from their code points so that this file stays pure ASCII
const E_ACUTE = String.fromCodePoint(0xe9);
const CIRCUMFLEX_E = String.fromCodePoint(0xea);

// Stylesheet of the project, read to check that the tokens of the status exist in both themes
const CSS = readFileSync(join(import.meta.dirname, "../../../app/globals.css"), "utf8");

/**
 * Renders an element inside the intl provider of a language, the way the root layout does.
 *
 * @param lang - Language whose common messages are provided
 * @param element - Element of the site that reads messages, rendered inside the provider
 * @returns The static HTML
 */
function render(lang: Lang, element: ReactElement): string {
    const messages = { common: lang === "en" ? en : fr };
    const props = { locale: lang, messages, timeZone: "UTC", children: element };
    return renderToStaticMarkup(createElement(NextIntlClientProvider, props));
}

describe("Status", () => {
    test("the pictogram alone has the word as its accessible name and a tooltip of the site", () => {
        const html = render("en", createElement(Status, { status: "experimental" }));
        assert.match(html, /role="img"/);
        assert.match(html, /aria-label="Experimental"/);
        assert.match(html, /data-slot="tooltip-trigger"/);
        assert.doesNotMatch(html, /title=/);
        assert.match(html, /<svg[^>]*aria-hidden="true"/);
        assert.match(html, /size-4\.5/);
        assert.doesNotMatch(html, />Experimental</);
    });

    test("each status has its own pictogram and its own tone, in French as well", () => {
        const flask = render("fr", createElement(Status, { status: "experimental" }));
        const sprout = render("fr", createElement(Status, { status: "beta" }));
        assert.match(flask, new RegExp(`aria-label="Exp${E_ACUTE}rimental"`));
        assert.match(sprout, new RegExp(`aria-label="B${CIRCUMFLEX_E}ta"`));
        assert.match(flask, /lucide-flask-conical/);
        assert.match(sprout, /lucide-sprout/);
        assert.match(flask, /bg-exp\/16 text-exp/);
        assert.match(sprout, /bg-beta\/16 text-beta/);
    });

    test("the marker prints the word, with no icon and no tooltip", () => {
        const html = render(
            "fr",
            createElement(Status, { status: "experimental", variant: "mark" }),
        );
        assert.match(html, new RegExp(`>Exp${E_ACUTE}rimental</span>`));
        assert.doesNotMatch(html, /<svg|role="img"|title=/);
        assert.match(html, /bg-mark/);
        const beta = render("en", createElement(Status, { status: "beta", variant: "mark" }));
        assert.match(beta, />Beta</);
        assert.match(beta, /bg-mark-beta/);
    });

    test("the caller adds its classes, and the marker keeps its own", () => {
        const html = render("en", createElement(Status, { status: "beta", className: "ml-auto" }));
        assert.match(html, /ml-auto/);
        assert.match(html, /rounded-chip/);
        assert.doesNotMatch(html, /rounded-full/);
    });
});

describe("deprecated status", () => {
    test("the pictogram is the archive box on a red-brown tint, named in both languages", () => {
        const en = render("en", createElement(Status, { status: "deprecated" }));
        const fr = render("fr", createElement(Status, { status: "deprecated" }));
        assert.match(en, /aria-label="Deprecated"/);
        assert.match(fr, new RegExp(`aria-label="D${E_ACUTE}pr${E_ACUTE}ci${E_ACUTE}"`));
        assert.match(fr, /lucide-archive/);
        assert.match(fr, /bg-dep\/16 text-dep/);
        assert.match(fr, /size-4\.5/);
        assert.doesNotMatch(fr, /bg-exp\/|bg-beta\/|bg-mark/);
    });

    test("the marker prints the word on its own ground, never on the yellow of the others", () => {
        const html = render("fr", createElement(Status, { status: "deprecated", variant: "mark" }));
        assert.match(html, new RegExp(`>D${E_ACUTE}pr${E_ACUTE}ci${E_ACUTE}</span>`));
        assert.match(html, /bg-dep-bg text-dep/);
        assert.doesNotMatch(html, /bg-mark|text-mark-ink|<svg|role="img"|title=|line-through/);
    });

    test("the pictogram follows the name in the header crumb, before the method chips", () => {
        const meta = { name: "Hyperplanning", category: "Network", methods: ["post" as const] };
        const html = render(
            "en",
            createElement(Crumb, { meta: { ...meta, status: "deprecated" } }),
        );
        const name = html.indexOf(">Hyperplanning<");
        const icon = html.indexOf('aria-label="Deprecated"');
        const chip = html.indexOf(">post<");
        assert.ok(name !== -1 && icon > name && chip > icon, html);
    });
});

describe("every status of the model", () => {
    test("has both words, a pictogram of its own and a marker of its own", () => {
        assert.deepEqual(Object.keys(en.status).sort(), [...PAGE_STATUSES].sort());
        assert.deepEqual(Object.keys(fr.status).sort(), [...PAGE_STATUSES].sort());
        const icons = new Set<string>();
        const marks = new Set<string>();
        for (const status of PAGE_STATUSES) {
            const icon = render("en", createElement(Status, { status }));
            const word = render("en", createElement(Status, { status, variant: "mark" }));
            const found = /lucide-[a-z-]+/.exec(icon)?.[0];
            assert.ok(found, status);
            icons.add(found);
            marks.add(/class="[^"]*"/.exec(word)?.[0] ?? "");
            assert.match(word, new RegExp(`>${en.status[status]}</span>`), status);
            assert.match(icon, new RegExp(`aria-label="${en.status[status]}"`), status);
        }
        assert.equal(icons.size, PAGE_STATUSES.length);
        assert.equal(marks.size, PAGE_STATUSES.length);
    });

    test("has an ink token in the light and the dark theme, and a ground for the deprecated marker", () => {
        const names: Record<PageStatus, string> = {
            experimental: "exp",
            beta: "beta",
            deprecated: "dep",
        };
        assert.deepEqual(Object.keys(names).sort(), [...PAGE_STATUSES].sort());
        for (const status of PAGE_STATUSES) {
            for (const name of status === "deprecated" ? ["dep", "dep-bg"] : [names[status]]) {
                const defined = CSS.match(new RegExp(`^\\s+--${name}:`, "gm")) ?? [];
                assert.equal(defined.length, 2, `--${name}`);
                assert.ok(CSS.includes(`--color-${name}: var(--${name});`), `--color-${name}`);
            }
        }
    });
});

describe("slim header crumb", () => {
    const meta = { name: "Hash", category: "Security", methods: ["post" as const] };

    test("the pictogram of the status follows the name, before the method chips", () => {
        const html = render("en", createElement(Crumb, { meta: { ...meta, status: "beta" } }));
        const name = html.indexOf(">Hash<");
        const icon = html.indexOf('aria-label="Beta"');
        const chip = html.indexOf(">post<");
        assert.ok(name !== -1 && icon > name && chip > icon, html);
    });

    test("a stable page draws no pictogram", () => {
        const html = render("en", createElement(Crumb, { meta }));
        assert.doesNotMatch(html, /role="img"/);
    });
});

describe("status tokens", () => {
    test("every token is defined for the light and the dark theme and mapped to a color", () => {
        for (const name of ["mark", "mark-ink", "mark-beta", "mark-beta-line", "exp"]) {
            const defined = CSS.match(new RegExp(`^\\s+--${name}:`, "gm")) ?? [];
            assert.equal(defined.length, 2, `--${name}`);
            assert.ok(CSS.includes(`--color-${name}: var(--${name});`), `--color-${name}`);
        }
        for (const name of ["beta"]) {
            const defined = CSS.match(new RegExp(`^\\s+--${name}:`, "gm")) ?? [];
            assert.equal(defined.length, 2, `--${name}`);
            assert.ok(CSS.includes(`--color-${name}: var(--${name});`), `--color-${name}`);
        }
    });
});
