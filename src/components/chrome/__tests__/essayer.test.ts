import assert from "node:assert/strict";
import { test } from "node:test";

import {
    essayer,
    type FieldSearch,
    firstField,
    type FocusTarget,
    TRY_FIELDS,
} from "@/components/chrome/essayer";

/**
 * Builds a fake Try panel whose first field records the focus options it is given.
 *
 * @param calls - Receives one entry per focus call
 * @param selectors - Receives the selector the panel was asked for
 * @returns The fake panel element
 */
function panel(calls: unknown[], selectors: string[] = []): FieldSearch {
    const field: FocusTarget = { focus: (options) => calls.push(options) };
    return {
        querySelector: (selector) => {
            selectors.push(selector);
            return field;
        },
    };
}

const EMPTY: FieldSearch = { querySelector: () => null };

test("the first field is looked up with the input, select and textarea selector", () => {
    const selectors: string[] = [];
    assert.ok(firstField(panel([], selectors)));
    assert.deepEqual(selectors, [TRY_FIELDS]);
    assert.equal(TRY_FIELDS, "input, select, textarea");
});

test("a page without a Try panel or a panel without fields has no first field", () => {
    assert.equal(firstField(null), null);
    assert.equal(firstField(EMPTY), null);
});

test("on a phone the action opens the sheet and leaves the panel alone", () => {
    let opened = 0;
    const calls: unknown[] = [];
    const outcome = essayer({
        desktop: false,
        root: panel(calls),
        openSheet: () => (opened += 1),
        later: (run) => run(),
    });
    assert.equal(outcome, "sheet");
    assert.equal(opened, 1);
    assert.deepEqual(calls, []);
});

test("on a desktop the action focuses the first field later, without scrolling again", () => {
    let opened = 0;
    const calls: unknown[] = [];
    const queue: Array<() => void> = [];
    const outcome = essayer({
        desktop: true,
        root: panel(calls),
        openSheet: () => (opened += 1),
        later: (run) => queue.push(run),
    });
    assert.equal(outcome, "field");
    assert.equal(opened, 0);
    assert.deepEqual(calls, []);
    queue.forEach((run) => run());
    assert.deepEqual(calls, [{ preventScroll: true }]);
});

test("on a desktop a panel without fields focuses nothing and schedules nothing", () => {
    let scheduled = 0;
    const outcome = essayer({
        desktop: true,
        root: EMPTY,
        openSheet: () => assert.fail("the sheet is for phones"),
        later: () => (scheduled += 1),
    });
    assert.equal(outcome, "none");
    assert.equal(scheduled, 0);
});
