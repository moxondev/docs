import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { SHORTCUTS } from "@/data/shortcuts";
import { APPLE_KEYS, OTHER_KEYS, platformKeys, shortcutLabels } from "@/hooks/useModKey";
import { SHORTCUT } from "@/hooks/useShortcuts";

test("Apple platforms print Cmd and Option, the others Ctrl and Alt", () => {
    for (const platform of ["MacIntel", "macOS", "iPhone", "iPad", "iPod touch"]) {
        assert.equal(platformKeys(platform), APPLE_KEYS, platform);
    }
    for (const platform of ["Win32", "Windows", "Linux x86_64", "Android", "ChromeOS", ""]) {
        assert.equal(platformKeys(platform), OTHER_KEYS, platform);
    }
});

test("hints list the modifiers first, then the key as a word or a character", () => {
    assert.deepEqual(shortcutLabels(SHORTCUT.search, OTHER_KEYS), [
        { word: "ctrl" },
        { text: "K" },
    ]);
    assert.deepEqual(shortcutLabels(SHORTCUT.search, APPLE_KEYS), [{ word: "cmd" }, { text: "K" }]);
    assert.deepEqual(shortcutLabels(SHORTCUT.lang, APPLE_KEYS), [
        { word: "option" },
        { text: "L" },
    ]);
    assert.deepEqual(shortcutLabels(SHORTCUT.send, OTHER_KEYS), [
        { word: "ctrl" },
        { word: "enter" },
    ]);
    assert.deepEqual(shortcutLabels(SHORTCUT.searchSlash, OTHER_KEYS), [{ text: "/" }]);
    assert.deepEqual(shortcutLabels(SHORTCUT.close, OTHER_KEYS), [{ word: "escape" }]);
});

test("every word of every hint is a key of messages common.keys in both locales", () => {
    for (const locale of ["en", "fr"]) {
        const common = JSON.parse(readFileSync(`messages/${locale}/common.json`, "utf8")) as {
            keys: Record<string, string>;
        };
        for (const keys of [APPLE_KEYS, OTHER_KEYS]) {
            for (const shortcut of SHORTCUTS) {
                for (const label of shortcutLabels(shortcut, keys)) {
                    if ("word" in label) assert.ok(common.keys[label.word], label.word);
                    else assert.match(label.text, /^[A-Z/]$/);
                }
            }
        }
    }
});
