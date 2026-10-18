import assert from "node:assert/strict";
import { mock, test } from "node:test";

import {
    FLASH_CLASSES,
    FLASH_MS,
    type FlashElement,
    flashElement,
    samePath,
    splitHref,
} from "@/hooks/useFlash";

/**
 * Builds an element with a class list and a layout read counter.
 *
 * @param classes - Classes the element already carries
 * @returns The element and its class set, observable by the test
 */
function fakeElement(classes: readonly string[] = []) {
    const set = new Set(classes);
    let reads = 0;
    const element: FlashElement = {
        classList: {
            contains: (name) => set.has(name),
            add: (...names) => names.forEach((name) => set.add(name)),
            remove: (...names) => names.forEach((name) => set.delete(name)),
        },
        getBoundingClientRect: () => {
            reads += 1;
            return {};
        },
    };
    return { element, set, reads: () => reads };
}

test("a link splits into its page and its fragment", () => {
    assert.deepEqual(splitHref("/fr/v6/hash/#p-method"), { path: "/fr/v6/hash/", id: "p-method" });
    assert.deepEqual(splitHref("/v6/hash/?x=1#e-2"), { path: "/v6/hash/?x=1", id: "e-2" });
    assert.deepEqual(splitHref("/v6/hash/"), { path: "/v6/hash/", id: "" });
});

test("pages compare without the trailing slash, the query or the fragment", () => {
    assert.ok(samePath("/v6/changelog/6.1.0/", "/v6/changelog/6.1.0"));
    assert.ok(samePath("/fr/v6/hash/?x=1", "/fr/v6/hash"));
    assert.ok(samePath("/", ""));
    assert.ok(!samePath("/fr/v6/hash/", "/v6/hash/"));
    assert.ok(!samePath("/v6/captcha/", "/v6/captcha/verify/"));
});

test("the flash adds the missing utilities and removes only those after 1.5 s", () => {
    mock.timers.enable({ apis: ["setTimeout"] });
    try {
        const { element, set, reads } = fakeElement(["relative", "py-4"]);
        flashElement(element);
        for (const name of FLASH_CLASSES) assert.ok(set.has(name), name);
        assert.equal(reads(), 1);
        mock.timers.tick(FLASH_MS - 1);
        assert.ok(set.has("animate-flash"));
        mock.timers.tick(1);
        assert.deepEqual([...set].sort(), ["py-4", "relative"]);
    } finally {
        mock.timers.reset();
    }
});

test("a second flash restarts the first one, and stop ends it at once", () => {
    mock.timers.enable({ apis: ["setTimeout"] });
    try {
        const { element, set } = fakeElement();
        flashElement(element, ["animate-flash"], 1000);
        mock.timers.tick(800);
        const stop = flashElement(element, ["animate-flash"], 1000);
        mock.timers.tick(800);
        assert.ok(set.has("animate-flash"));
        stop();
        assert.equal(set.size, 0);
        mock.timers.tick(5000);
        assert.equal(set.size, 0);
    } finally {
        mock.timers.reset();
    }
});
