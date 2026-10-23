import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { keyboardInset } from "@/hooks/useKeyboardInset";

describe("keyboardInset", () => {
    test("a closed keyboard leaves nothing to lift", () => {
        assert.equal(keyboardInset(800, 800, 0), 0);
    });

    test("a keyboard that only shrinks the visual viewport lifts the sheet by its height", () => {
        assert.equal(keyboardInset(800, 480, 0), 320);
    });

    test("a layout that resizes with the keyboard asks for nothing", () => {
        assert.equal(keyboardInset(480, 480, 0), 0);
    });

    test("a pan of the visual viewport is taken off, and the result is never negative", () => {
        assert.equal(keyboardInset(800, 480, 100), 220);
        assert.equal(keyboardInset(800, 700, 300), 0);
    });
});
