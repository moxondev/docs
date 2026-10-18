import assert from "node:assert/strict";
import { test } from "node:test";

import { currentSection } from "@/hooks/useActiveSection";

const BOXES = [
    { id: "parameters", top: 400 },
    { id: "available-methods", top: 900 },
    { id: "response-fields", top: 1500 },
    { id: "errors", top: 2100 },
];

/**
 * Shifts the headings as if the page were scrolled down.
 *
 * @param by - Scroll distance in px
 * @returns The same headings, each top reduced by the distance
 */
function scrolled(by: number) {
    return BOXES.map((box) => ({ ...box, top: box.top - by }));
}

test("no section is current above the first heading", () => {
    assert.equal(currentSection(BOXES, 180), null);
    assert.equal(currentSection([], 180), null);
});

test("the current section is the last heading above the reading line", () => {
    assert.equal(currentSection(scrolled(230), 180), "parameters");
    assert.equal(currentSection(scrolled(800), 180), "available-methods");
    assert.equal(currentSection(scrolled(1332), 180), "response-fields");
});

test("a heading scrolled to by its Toc link (at the scroll padding) is current", () => {
    assert.equal(currentSection(scrolled(1500 - 68), 76), "response-fields");
    assert.equal(currentSection(scrolled(1500 - 77), 76), "available-methods");
});

test("at the end of the page the last visible heading wins", () => {
    const end = scrolled(1600);
    assert.equal(currentSection(end, 180), "response-fields");
    assert.equal(currentSection(end, 180, 900), "errors");
    assert.equal(currentSection(end, 180, 400), "response-fields");
});
