import assert from "node:assert/strict";
import { test } from "node:test";

import { createStore } from "@/hooks/useStore";

test("a store gives its value and its initial value", () => {
    const store = createStore({ n: 1 });
    assert.deepEqual(store.get(), { n: 1 });
    store.set({ n: 2 });
    assert.deepEqual(store.get(), { n: 2 });
    assert.deepEqual(store.getInitial(), { n: 1 });
});

test("set takes a value or an updater and notifies every listener once", () => {
    const store = createStore(0);
    const seen: number[] = [];
    store.subscribe(() => seen.push(store.get()));
    store.subscribe(() => seen.push(-store.get()));
    store.set(1);
    store.set((n) => n + 2);
    assert.deepEqual(seen, [1, -1, 3, -3]);
});

test("an identical value notifies nobody, an unsubscribed listener is not called", () => {
    const state = { open: false };
    const store = createStore(state);
    let calls = 0;
    const stop = store.subscribe(() => (calls += 1));
    store.set(state);
    store.set((current) => current);
    assert.equal(calls, 0);
    store.set({ open: true });
    stop();
    store.set({ open: false });
    assert.equal(calls, 1);
});

test("a listener that unsubscribes during a notification does not skip the others", () => {
    const store = createStore(0);
    const seen: string[] = [];
    const stop = store.subscribe(() => {
        seen.push("a");
        stop();
    });
    store.subscribe(() => seen.push("b"));
    store.set(1);
    store.set(2);
    assert.deepEqual(seen, ["a", "b", "b"]);
});
