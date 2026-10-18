import assert from "node:assert/strict";
import { test } from "node:test";

import { HEADER_OFFSET, scrolledPast, SLIM_NONE, slimStore } from "@/hooks/useSlim";

test("the title counts as gone once its bottom passes under the sticky header", () => {
    assert.equal(HEADER_OFFSET, 60);
    assert.equal(scrolledPast(61, HEADER_OFFSET), false);
    assert.equal(scrolledPast(60, HEADER_OFFSET), true);
    assert.equal(scrolledPast(-400, HEADER_OFFSET), true);
});

test("the store starts with the full headers and nothing to show in the slim ones", () => {
    assert.deepEqual(SLIM_NONE, { slim: false, meta: null });
    assert.equal(slimStore.get(), SLIM_NONE);
    assert.equal(slimStore.getInitial(), SLIM_NONE);
});
