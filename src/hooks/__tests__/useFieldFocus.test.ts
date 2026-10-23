import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { focusField, isPending } from "@/hooks/useFieldFocus";

interface FakeControl {
    focused: number;
    focus: () => void;
}

/**
 * Builds a stand-in for the root of a form: a few Control wrappers, each with an optional control.
 *
 * @param fields - Parameter name and its control (null for a wrapper without any)
 * @returns A fake form root listing one wrapper per field, in the order of the fields
 */
function form(fields: readonly [string, FakeControl | null][]) {
    const wrappers = fields.map(([name, control]) => ({
        getAttribute: (attribute: string) => (attribute === "data-param" ? name : null),
        querySelector: () => control,
    }));
    return { querySelectorAll: () => wrappers } as unknown as HTMLElement;
}

/**
 * Builds a control that counts its focus calls.
 *
 * @returns The fake control
 */
function control(): FakeControl {
    const fake: FakeControl = {
        focused: 0,
        focus: () => {
            fake.focused += 1;
        },
    };
    return fake;
}

describe("focusField", () => {
    test("focuses the control of the named parameter only", () => {
        const a = control();
        const b = control();
        assert.equal(
            focusField(
                form([
                    ["a", a],
                    ["b", b],
                ]),
                "b",
            ),
            true,
        );
        assert.equal(a.focused, 0);
        assert.equal(b.focused, 1);
    });

    test("does nothing without a form, an unknown name or a wrapper without a control", () => {
        const a = control();
        assert.equal(focusField(null, "a"), false);
        assert.equal(focusField(form([["a", a]]), "zz"), false);
        assert.equal(focusField(form([["a", null]]), "a"), false);
        assert.equal(a.focused, 0);
    });
});

describe("focusField selector", () => {
    test("reaches the inputs, the textareas and the button that opens a list", () => {
        const selectors: string[] = [];
        const root = {
            querySelectorAll: () => [
                {
                    getAttribute: () => "type",
                    querySelector: (selector: string) => {
                        selectors.push(selector);
                        return null;
                    },
                },
            ],
        } as unknown as HTMLElement;
        focusField(root, "type");
        assert.equal(selectors.length, 1);
        for (const part of ["input", "textarea", "button[aria-haspopup]"]) {
            assert.ok(selectors[0].split(", ").includes(part), part);
        }
    });
});

describe("isPending", () => {
    test("serves a request that is new, never one already served or none at all", () => {
        const first = { name: "text", seq: 1 };
        const second = { name: "text", seq: 2 };
        assert.equal(isPending(null, null), false);
        assert.equal(isPending(first, null), true);
        assert.equal(isPending(first, first), false);
        assert.equal(isPending(second, first), true);
    });

    test("a form that mounts while a request waits does not serve it again", () => {
        const waiting = { name: "text", seq: 1 };
        assert.equal(isPending(waiting, waiting), false);
    });
});
