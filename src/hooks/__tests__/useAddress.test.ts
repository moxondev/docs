import assert from "node:assert/strict";
import { test } from "node:test";

import { addressLocale } from "@/hooks/useAddress";

test("an address that is not known yet reads as English", () => {
    assert.equal(addressLocale(""), "en");
});

test("English has no prefix and French lives under /fr/", () => {
    assert.equal(addressLocale("/"), "en");
    assert.equal(addressLocale("/zzz/abc/"), "en");
    assert.equal(addressLocale("/v5/zzz"), "en");
    assert.equal(addressLocale("/fr"), "fr");
    assert.equal(addressLocale("/fr/"), "fr");
    assert.equal(addressLocale("/fr/v5/zzz"), "fr");
    assert.equal(addressLocale("/french/page/"), "en");
});
