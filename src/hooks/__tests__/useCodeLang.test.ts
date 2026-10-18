import assert from "node:assert/strict";
import { test } from "node:test";

import { CODE_LANG_KEY, codeLang, DEFAULT_CODE_LANG } from "@/hooks/useCodeLang";
import { SNIPPET_LANGS } from "@/lib/snippets";

test("the storage key is moxon-code-lang and the values are the four snippet languages", () => {
    assert.equal(CODE_LANG_KEY, "moxon-code-lang");
    for (const lang of ["curl", "javascript", "python", "php"]) assert.equal(codeLang(lang), lang);
    assert.deepEqual([...SNIPPET_LANGS], ["curl", "javascript", "python", "php"]);
});

test("an unset or unknown stored value gives cURL", () => {
    assert.equal(DEFAULT_CODE_LANG, "curl");
    for (const stored of [null, "", "js", "PHP", "ruby", "curl "]) {
        assert.equal(codeLang(stored), "curl", String(stored));
    }
});
