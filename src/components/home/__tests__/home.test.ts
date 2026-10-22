import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { NextIntlClientProvider } from "next-intl";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Catalogue } from "@/components/home/Catalogue";
import { Category } from "@/components/home/Category";
import { homeCatalogue } from "@/components/home/model";
import { NAV } from "@/data/nav";
import { LATEST } from "@/data/versions";
import type { Lang } from "@/types/content";

import aria from "../../../../messages/en/aria.json";
import catalogueEn from "../../../../messages/en/catalogue.json";
import common from "../../../../messages/en/common.json";
import ariaFr from "../../../../messages/fr/aria.json";
import catalogueFr from "../../../../messages/fr/catalogue.json";
import commonFr from "../../../../messages/fr/common.json";

/**
 * Renders an element inside the intl provider of the home tree, the way the home page does.
 *
 * @param lang - Language of the messages
 * @param element - Element to draw
 * @returns The static HTML
 */
function render(lang: Lang, element: ReactElement): string {
    const messages =
        lang === "en"
            ? { aria, catalogue: catalogueEn, common }
            : { aria: ariaFr, catalogue: catalogueFr, common: commonFr };
    const props = { locale: lang, messages, timeZone: "UTC", children: element };
    return renderToStaticMarkup(createElement(NextIntlClientProvider, props));
}

/**
 * Counts the matches of a pattern in a string.
 *
 * @param text - Text to search
 * @param pattern - Global regular expression
 * @returns The number of matches
 */
function count(text: string, pattern: RegExp): number {
    return text.match(pattern)?.length ?? 0;
}

describe("home Catalogue (static HTML)", () => {
    const categories = homeCatalogue(NAV, LATEST, "en");

    test("49 cards in 7 sections with the anchors, all in the document", () => {
        const html = render("en", createElement(Catalogue, { categories }));
        assert.equal(count(html, /<section id="/g), 8);
        for (const anchor of ["securite", "texte", "images", "calcul", "donnees", "reseau"]) {
            assert.match(html, new RegExp(`<section id="${anchor}"`));
        }
        assert.match(html, /<section id="temps-reel"/);
        assert.match(html, /<section id="catalogue"/);
        assert.equal(count(html, new RegExp(`href="/${LATEST}/[a-z-]+/?"`, "g")), 49);
        assert.match(html, /Catalog<span[^>]*>49<\/span>/);
        assert.match(html, /Seven categories\./);
    });

    test("the jump row links the 7 categories with their counts", () => {
        const html = render("en", createElement(Catalogue, { categories }));
        const nav = html.slice(html.indexOf("<nav"), html.indexOf("</nav>"));
        assert.equal(count(nav, /href="#/g), 7);
        assert.match(nav, /href="#calcul"[^>]*>Math and formats<span[^>]*>10<\/span>/);
        assert.match(nav, /class="[^"]*\bhidden\b[^"]*home:flex/);
    });

    test("the filter field and the cards carry names, chips, routes and descriptions", () => {
        const html = render("en", createElement(Catalogue, { categories }));
        assert.match(html, /aria-label="Filter endpoints"/);
        assert.match(html, /placeholder="Filter endpoints"/);
        assert.match(html, />Captcha<\/span>/);
        assert.equal(count(html, />get<\/span>/g) > 0, true);
        assert.match(html, />\/hash<\/code>/);
        assert.match(html, />Hash digests</);
    });

    test("a phone category is a button that controls its list and folds it when closed", () => {
        const [security] = categories;
        const props = { category: security, phone: true, onToggle: () => {} };
        const open = render("en", createElement(Category, { ...props, open: true }));
        assert.match(open, /<button[^>]*aria-expanded="true"[^>]*aria-controls="securite-list"/);
        assert.match(open, /<ul id="securite-list" class="(?![^"]*max-home:hidden)/);
        const closed = render("en", createElement(Category, { ...props, open: false }));
        assert.match(closed, /aria-expanded="false"/);
        assert.match(closed, /<ul id="securite-list" class="[^"]*max-home:hidden/);
        assert.match(closed, /<p class="[^"]*max-home:hidden/);
    });

    test("a desktop category has a plain heading and no button", () => {
        const html = render(
            "en",
            createElement(Category, {
                category: categories[0],
                phone: false,
                open: false,
                onToggle: () => {},
            }),
        );
        assert.doesNotMatch(html, /<button/);
        assert.match(html, /<h3 class="m-0"><span/);
    });

    test("the French catalogue says it in French", () => {
        const html = render(
            "fr",
            createElement(Catalogue, { categories: homeCatalogue(NAV, LATEST, "fr") }),
        );
        assert.match(html, /Sept cat\u00e9gories\./);
        assert.match(html, new RegExp(`href="/fr/${LATEST}/hash/?"`));
        assert.match(html, /Aller \u00e0/);
    });
});
