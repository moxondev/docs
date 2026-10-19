import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { defaultText, paramView } from "@/components/doc/params";
import type { ParamSpec } from "@/types/content";

// The empty-default marker, an em dash built from its code point to stay ASCII
const EM_DASH = String.fromCodePoint(0x2014);

/**
 * Builds a parameter spec for the tests, an optional body string unless the fields say more.
 *
 * @param fields - Fields that replace the defaults
 * @returns The default spec with the given fields applied over it
 */
function spec(fields: Partial<ParamSpec>): ParamSpec {
    return { name: "p", type: "string", in: "body", required: false, ...fields };
}

describe("type and values of a parameter row", () => {
    test("a parameter that the operation does not list has no type", () => {
        assert.deepEqual(paramView(undefined), { type: "", chips: [], more: 0 });
    });

    test("a plain parameter shows its type word", () => {
        assert.deepEqual(paramView(spec({ type: "number" })), {
            type: "number",
            chips: [],
            more: 0,
        });
    });

    test("an enum of three values or fewer is a quoted union", () => {
        const view = paramView(spec({ type: "enum", options: ["hex", "base64"] }));
        assert.equal(view.type, '"hex" | "base64"');
        assert.deepEqual(view.chips, []);
    });

    test("a long enum without featured values lists every option", () => {
        const options = ["a", "b", "c", "d"];
        assert.deepEqual(paramView(spec({ type: "enum", options })), {
            type: "string",
            chips: options,
            more: 0,
        });
    });

    test("featured values are the chips and the rest sits behind the Values section", () => {
        const view = paramView(
            spec({ type: "enum", options: ["a", "b", "c", "d"], featured: ["a", "b"] }),
            { id: "available-methods", total: 52 },
        );
        assert.deepEqual(view, {
            type: "string",
            chips: ["a", "b"],
            more: 50,
            moreTo: "available-methods",
        });
    });

    test("without a Values section the overflow counts the options and links nowhere", () => {
        const view = paramView(
            spec({ type: "enum", options: ["a", "b", "c", "d", "e"], featured: ["a", "b"] }),
        );
        assert.equal(view.more, 3);
        assert.equal(view.moreTo, undefined);
    });
});

describe("default value of a parameter row", () => {
    test("the cell of the table wins over the default of the operation", () => {
        assert.equal(defaultText("`hex`", spec({ default: "base64" }), "en"), "`hex`");
    });

    test("the operation default fills a table without a Default column", () => {
        assert.equal(defaultText(undefined, spec({ default: "hex" }), "en"), "hex");
        assert.equal(defaultText(undefined, undefined, "en"), undefined);
    });

    test("a localized cell is read in the language of the page", () => {
        const cell = { en: "`yes`", fr: "`oui`" };
        assert.equal(defaultText(cell, undefined, "fr"), "`oui`");
    });

    test("the em dash cell is kept and the hyphen and empty cells tell nothing", () => {
        assert.equal(defaultText(EM_DASH, spec({ default: "x" }), "en"), EM_DASH);
        assert.equal(defaultText("-", undefined, "en"), undefined);
        assert.equal(defaultText("  ", undefined, "en"), undefined);
    });
});
