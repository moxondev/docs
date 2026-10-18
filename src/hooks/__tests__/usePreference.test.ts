import assert from "node:assert/strict";
import { test } from "node:test";

import { type PreferenceStorage, readPreference, writePreference } from "@/hooks/usePreference";

/**
 * Builds an in-memory storage whose methods can be told to throw, like a blocked localStorage.
 *
 * @param fail - Which operations throw: "read", "write" or both
 * @returns The storage getter and the map holding what was really stored
 */
function fakeStorage(fail: readonly ("read" | "write")[] = []) {
    const data = new Map<string, string>();
    const storage: PreferenceStorage = {
        getItem: (key) => {
            if (fail.includes("read")) throw new Error("SecurityError");
            return data.get(key) ?? null;
        },
        setItem: (key, value) => {
            if (fail.includes("write")) throw new Error("QuotaExceededError");
            data.set(key, value);
        },
        removeItem: (key) => {
            if (fail.includes("write")) throw new Error("QuotaExceededError");
            data.delete(key);
        },
    };
    return { get: () => storage, data };
}

test("a working storage holds the value; null removes it", () => {
    const { get, data } = fakeStorage();
    assert.equal(readPreference("t-ok", get), null);
    writePreference("t-ok", "fr", get);
    assert.equal(data.get("t-ok"), "fr");
    assert.equal(readPreference("t-ok", get), "fr");
    writePreference("t-ok", null, get);
    assert.equal(data.has("t-ok"), false);
    assert.equal(readPreference("t-ok", get), null);
});

test("a refused write lives in memory for the visit and beats the stored value", () => {
    const { get, data } = fakeStorage(["write"]);
    data.set("t-quota", "curl");
    writePreference("t-quota", "php", get);
    assert.equal(data.get("t-quota"), "curl");
    assert.equal(readPreference("t-quota", get), "php");
    writePreference("t-quota", null, get);
    assert.equal(readPreference("t-quota", get), null);
});

test("a later successful write clears the memory fallback", () => {
    const blocked = fakeStorage(["write"]);
    writePreference("t-back", "python", blocked.get);
    const working = fakeStorage();
    writePreference("t-back", "php", working.get);
    working.data.set("t-back", "javascript");
    assert.equal(readPreference("t-back", working.get), "javascript");
});

test("an unreadable storage reads as unset and never throws", () => {
    const { get } = fakeStorage(["read", "write"]);
    assert.equal(readPreference("t-blocked", get), null);
    assert.doesNotThrow(() => writePreference("t-blocked", "on", get));
    assert.equal(readPreference("t-blocked", get), "on");
});

test("without a browser (server, tests) the default storage falls back to memory", () => {
    assert.equal(typeof window, "undefined");
    assert.equal(readPreference("t-node"), null);
    writePreference("t-node", "dark");
    assert.equal(readPreference("t-node"), "dark");
});
