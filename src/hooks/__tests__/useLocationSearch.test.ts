import assert from "node:assert/strict";
import { test } from "node:test";

import { queryParam, withQueryParam } from "@/hooks/useLocationSearch";

test("queryParam reads one parameter, with or without the question mark", () => {
    assert.equal(queryParam("?endpoint=hash", "endpoint"), "hash");
    assert.equal(queryParam("endpoint=hash&x=1", "x"), "1");
    assert.equal(queryParam("?endpoint=tic-tac-toe%2Fplay", "endpoint"), "tic-tac-toe/play");
    assert.equal(queryParam("", "endpoint"), null);
    assert.equal(queryParam("?Endpoint=hash", "endpoint"), null);
});

test("withQueryParam sets, replaces and removes a parameter, keeping the others", () => {
    assert.equal(withQueryParam("", "endpoint", "hash"), "?endpoint=hash");
    assert.equal(withQueryParam("?a=1&endpoint=uuid", "endpoint", "hash"), "?a=1&endpoint=hash");
    assert.equal(withQueryParam("?a=1&endpoint=uuid", "endpoint", null), "?a=1");
    assert.equal(withQueryParam("?endpoint=uuid", "endpoint", null), "");
    assert.equal(
        withQueryParam("?a=1", "endpoint", "chat/private"),
        "?a=1&endpoint=chat%2Fprivate",
    );
});
