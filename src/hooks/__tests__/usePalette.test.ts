import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import {
    closePalette,
    openPalette,
    PALETTE_CLOSED,
    paletteStore,
    setPaletteOpen,
    togglePalette,
} from "@/hooks/usePalette";

beforeEach(() => paletteStore.set(PALETTE_CLOSED));

test("the palette starts closed, also on the server", () => {
    assert.deepEqual(paletteStore.getInitial(), { open: false, seed: "", session: 0 });
});

test("each opening is a new session with its seed; closing keeps them", () => {
    openPalette();
    assert.deepEqual(paletteStore.get(), { open: true, seed: "", session: 1 });
    closePalette();
    assert.deepEqual(paletteStore.get(), { open: false, seed: "", session: 1 });
    openPalette("post:");
    assert.deepEqual(paletteStore.get(), { open: true, seed: "post:", session: 2 });
});

test("opening an open palette keeps its session unless a seed is given", () => {
    openPalette();
    const before = paletteStore.get();
    openPalette();
    assert.equal(paletteStore.get(), before);
    openPalette("hash");
    assert.deepEqual(paletteStore.get(), { open: true, seed: "hash", session: 2 });
});

test("toggle and setOpen follow the shortcut and the dialog primitive", () => {
    let calls = 0;
    const stop = paletteStore.subscribe(() => (calls += 1));
    togglePalette();
    assert.equal(paletteStore.get().open, true);
    togglePalette();
    assert.equal(paletteStore.get().open, false);
    setPaletteOpen(false);
    setPaletteOpen(true);
    assert.equal(paletteStore.get().open, true);
    closePalette();
    closePalette();
    stop();
    assert.equal(calls, 4);
});
