import assert from "node:assert/strict";
import { test } from "node:test";

test("the test runner starts", () => {
    assert.equal([1, 2, 3].length, 3);
});
