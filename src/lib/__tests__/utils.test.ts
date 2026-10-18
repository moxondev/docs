import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { cn } from "@/lib/utils";

describe("cn", () => {
    test("joins conditional class values", () => {
        const off = false;
        assert.equal(cn("a", off && "b", ["c", { d: true, e: false }], undefined), "a c d");
    });

    test("a later Tailwind utility overrides a conflicting one", () => {
        assert.equal(cn("px-2 text-muted", "px-4"), "text-muted px-4");
        assert.equal(cn("text-code-fn", "text-code-str"), "text-code-str");
    });
});
