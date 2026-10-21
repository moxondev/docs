import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { closeSheet, openSheet, restoreOpener, setSheetOpen, sheetStore } from "@/hooks/useSheet";

beforeEach(() => sheetStore.set(false));

test("the sheet starts closed, also on the server", () => {
    assert.equal(sheetStore.getInitial(), false);
    assert.equal(sheetStore.get(), false);
});

test("the bar opens the sheet and the sheet closes itself, through one shared state", () => {
    openSheet();
    assert.equal(sheetStore.get(), true);
    closeSheet();
    assert.equal(sheetStore.get(), false);
});

test("the drawer primitive follows the store and listeners are told once per change", () => {
    let calls = 0;
    const stop = sheetStore.subscribe(() => (calls += 1));
    setSheetOpen(true);
    setSheetOpen(true);
    setSheetOpen(false);
    stop();
    assert.equal(calls, 2);
});

test("closing without an opener element restores nothing and does not throw", () => {
    openSheet();
    restoreOpener();
    restoreOpener();
    assert.equal(sheetStore.get(), true);
});
