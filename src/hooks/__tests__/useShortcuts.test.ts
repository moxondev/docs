import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { SHORTCUTS } from "@/data/shortcuts";
import {
    allowed,
    findShortcut,
    isEditable,
    isTextInput,
    type KeyContext,
    type KeyPress,
    matches,
    SHORTCUT,
} from "@/hooks/useShortcuts";

/**
 * Builds a key press with no modifier unless given.
 *
 * @param key - Character or key name produced (event.key)
 * @param extra - Physical key (event.code) and the modifiers held
 * @returns The press, as the fields of a KeyboardEvent that matches() reads
 */
function press(key: string, extra: Partial<KeyPress> = {}): KeyPress {
    return {
        key,
        code: "",
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        ...extra,
    };
}

const QUIET: KeyContext = { editable: false, overlay: "none", singleKeys: true };

describe("matching", () => {
    test("Alt shortcuts match the physical key, whatever character it types", () => {
        assert.ok(matches(press("l", { code: "KeyL", altKey: true }), SHORTCUT.lang));
        assert.ok(
            matches(
                press(String.fromCodePoint(0xac), { code: "KeyL", altKey: true }),
                SHORTCUT.lang,
            ),
        );
        assert.ok(matches(press("v", { code: "KeyV", altKey: true }), SHORTCUT.version));
        assert.ok(matches(press("t", { code: "KeyT", altKey: true }), SHORTCUT.theme));
        assert.ok(!matches(press("l", { code: "KeyL" }), SHORTCUT.lang));
        assert.ok(
            !matches(press("L", { code: "KeyL", altKey: true, shiftKey: true }), SHORTCUT.lang),
        );
        assert.ok(
            !matches(press("l", { code: "KeyL", altKey: true, ctrlKey: true }), SHORTCUT.lang),
        );
        assert.ok(!matches(press("l", { code: "KeyO", altKey: true }), SHORTCUT.lang));
    });

    test("Ctrl and Cmd are the same modifier; Shift or Alt break a letter shortcut", () => {
        assert.ok(matches(press("k", { code: "KeyK", ctrlKey: true }), SHORTCUT.search));
        assert.ok(matches(press("k", { code: "KeyK", metaKey: true }), SHORTCUT.search));
        assert.ok(matches(press("K", { code: "KeyK", metaKey: true }), SHORTCUT.search));
        assert.ok(!matches(press("k", { code: "KeyK" }), SHORTCUT.search));
        assert.ok(
            !matches(press("K", { code: "KeyK", ctrlKey: true, shiftKey: true }), SHORTCUT.search),
        );
        assert.ok(
            !matches(press("k", { code: "KeyK", ctrlKey: true, altKey: true }), SHORTCUT.search),
        );
    });

    test("a layout without Latin letters matches by physical key, a remapped one by character", () => {
        const cyrillic = press(String.fromCodePoint(0x43b), { code: "KeyK", ctrlKey: true });
        assert.ok(matches(cyrillic, SHORTCUT.search));
        assert.ok(matches(press("k", { code: "KeyV", ctrlKey: true }), SHORTCUT.search));
        assert.ok(!matches(press("v", { code: "KeyK", ctrlKey: true }), SHORTCUT.search));
    });

    test("a symbol matches on the character, Shift allowed (AZERTY types / with Shift)", () => {
        assert.ok(matches(press("/", { code: "Slash" }), SHORTCUT.searchSlash));
        assert.ok(matches(press("/", { code: "Period", shiftKey: true }), SHORTCUT.searchSlash));
        assert.ok(!matches(press("/", { code: "Slash", ctrlKey: true }), SHORTCUT.searchSlash));
        assert.ok(!matches(press(":", { code: "Period" }), SHORTCUT.searchSlash));
    });

    test("Ctrl or Cmd plus Enter is the send and Playground key, Enter alone is not", () => {
        assert.ok(matches(press("Enter", { code: "Enter", ctrlKey: true }), SHORTCUT.send));
        assert.ok(matches(press("Enter", { code: "NumpadEnter", metaKey: true }), SHORTCUT.send));
        assert.ok(matches(press("Enter", { metaKey: true }), SHORTCUT.playground));
        assert.ok(!matches(press("Enter", { code: "Enter" }), SHORTCUT.send));
        assert.ok(matches(press("Escape", { code: "Escape" }), SHORTCUT.close));
    });

    test("findShortcut ignores passive entries and the ids without a handler", () => {
        const noop = () => {};
        const all = Object.fromEntries(SHORTCUTS.map((s) => [s.id, noop]));
        assert.equal(findShortcut(press("Enter", { ctrlKey: true }), all), null);
        assert.equal(findShortcut(press("Escape"), all), null);
        assert.equal(findShortcut(press("k", { ctrlKey: true }), { lang: noop }), null);
        assert.equal(findShortcut(press("k", { ctrlKey: true }), all)?.id, "search");
        assert.equal(findShortcut(press("/"), all)?.id, "searchSlash");
        assert.equal(findShortcut(press("t", { code: "KeyT", altKey: true }), all)?.id, "theme");
    });

    test("SHORTCUT indexes the whole catalog", () => {
        assert.deepEqual(Object.keys(SHORTCUT).sort(), SHORTCUTS.map((s) => s.id).sort());
        for (const shortcut of SHORTCUTS) assert.equal(SHORTCUT[shortcut.id], shortcut);
    });
});

describe("context", () => {
    test("Ctrl or Cmd shortcuts fire everywhere", () => {
        for (const overlay of ["none", "menu", "dialog"] as const) {
            const context = { editable: true, overlay, singleKeys: false };
            assert.ok(allowed(SHORTCUT.search, context), overlay);
        }
    });

    test("Alt shortcuts stay out of text fields and dialogs, not out of menus", () => {
        assert.ok(allowed(SHORTCUT.lang, QUIET));
        assert.ok(allowed(SHORTCUT.version, { ...QUIET, overlay: "menu" }));
        assert.ok(allowed(SHORTCUT.theme, { ...QUIET, singleKeys: false }));
        assert.ok(!allowed(SHORTCUT.lang, { ...QUIET, overlay: "dialog" }));
        assert.ok(!allowed(SHORTCUT.lang, { ...QUIET, editable: true }));
    });

    test("single keys fire only outside fields and overlays, and only while kept on", () => {
        assert.ok(allowed(SHORTCUT.searchSlash, QUIET));
        assert.ok(!allowed(SHORTCUT.searchSlash, { ...QUIET, editable: true }));
        assert.ok(!allowed(SHORTCUT.searchSlash, { ...QUIET, overlay: "menu" }));
        assert.ok(!allowed(SHORTCUT.searchSlash, { ...QUIET, overlay: "dialog" }));
        assert.ok(!allowed(SHORTCUT.searchSlash, { ...QUIET, singleKeys: false }));
    });

    test("text fields: inputs that take text, textareas, selects, editable content", () => {
        assert.ok(isEditable({ tagName: "INPUT", type: "text" }));
        assert.ok(isEditable({ tagName: "input" }));
        assert.ok(isEditable({ tagName: "INPUT", type: "search" }));
        assert.ok(isEditable({ tagName: "INPUT", type: "number" }));
        assert.ok(isEditable({ tagName: "TEXTAREA" }));
        assert.ok(isEditable({ tagName: "SELECT" }));
        assert.ok(isEditable({ tagName: "DIV", isContentEditable: true }));
        assert.ok(!isEditable({ tagName: "INPUT", type: "checkbox" }));
        assert.ok(!isEditable({ tagName: "INPUT", type: "radio" }));
        assert.ok(!isEditable({ tagName: "BUTTON" }));
        assert.ok(!isEditable({ tagName: "A" }));
        assert.ok(!isEditable(null));
    });

    test("Enter submits from single-line text inputs only", () => {
        assert.ok(isTextInput({ tagName: "INPUT", type: "text" }));
        assert.ok(isTextInput({ tagName: "INPUT", type: "URL" }));
        assert.ok(!isTextInput({ tagName: "TEXTAREA" }));
        assert.ok(!isTextInput({ tagName: "SELECT" }));
        assert.ok(!isTextInput({ tagName: "INPUT", type: "submit" }));
        assert.ok(!isTextInput({ tagName: "BUTTON" }));
        assert.ok(!isTextInput(null));
    });
});
