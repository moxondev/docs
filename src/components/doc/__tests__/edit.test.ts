import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { editUrl, issueUrl, modulePath } from "@/components/doc/edit";

describe("module path of a page", () => {
    test("a page id is the module name under its version", () => {
        assert.equal(
            modulePath("v6", { id: "hash", kind: "endpoint" }),
            "src/data/pages/v6/hash.ts",
        );
        assert.equal(
            modulePath("v5", { id: "index", kind: "index" }),
            "src/data/pages/v5/index.ts",
        );
    });

    test("each segment of a sub-page is camelCased", () => {
        assert.equal(
            modulePath("v6", { id: "tic-tac-toe/play", kind: "endpoint" }),
            "src/data/pages/v6/ticTacToe/play.ts",
        );
        assert.equal(
            modulePath("v6", { id: "captcha/verify", kind: "endpoint" }),
            "src/data/pages/v6/captcha/verify.ts",
        );
    });

    test("every release page lives in the releases module", () => {
        assert.equal(
            modulePath("v6", { id: "changelog/6.1.0", kind: "release" }),
            "src/data/pages/v6/releases.ts",
        );
    });
});

describe("GitHub links of a page", () => {
    test("the edit link points at the module on the default branch", () => {
        assert.equal(
            editUrl("v6", { id: "hash", kind: "endpoint" }),
            "https://github.com/moxondev/docs/edit/master/src/data/pages/v6/hash.ts",
        );
    });

    test("the issue link carries the version and the page in its title", () => {
        const url = new URL(issueUrl("v6", { id: "captcha/verify" }));
        assert.equal(url.origin + url.pathname, "https://github.com/moxondev/docs/issues/new");
        assert.equal(url.searchParams.get("title"), "v6/captcha/verify");
    });
});
