import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { NAV } from "@/data/nav";
import { documentTrail, pageTrail } from "@/lib/trail";

const WORDS = { home: "moxon", group: (key: string) => `group:${key}` };

describe("breadcrumb trail", () => {
    test("an endpoint goes from the home through the catalogue and its category", () => {
        const trail = pageTrail(NAV, "v6", "hash", "en", WORDS, "/v6/hash/");
        assert.deepEqual(
            trail.map((crumb) => crumb.name),
            ["moxon", "group:catalogue", "Security", "Hash"],
        );
        assert.deepEqual(
            trail.map((crumb) => crumb.path),
            ["/", "/#catalogue", "/#securite", "/v6/hash/"],
        );
    });

    test("a sub-page adds its parent entry, in French", () => {
        const trail = pageTrail(NAV, "v6", "captcha/verify", "fr", WORDS, "/fr/v6/captcha/verify/");
        assert.equal(trail[0].path, "/fr/");
        assert.equal(trail.length, 5);
        assert.equal(trail[3].path, "/fr/v6/captcha/");
        assert.equal(trail[4].path, "/fr/v6/captcha/verify/");
    });

    test("a group without a target points at the page", () => {
        const trail = pageTrail(NAV, "v6", "authentication", "en", WORDS, "/v6/authentication/");
        assert.deepEqual(
            trail.map((crumb) => crumb.path),
            ["/", "/v6/authentication/", "/v6/authentication/"],
        );
    });

    test("the structured data keeps the documents: no fragment, no group that repeats the page", () => {
        const names = (id: string, here: string) =>
            documentTrail(pageTrail(NAV, "v6", id, "en", WORDS, here)).map((crumb) => crumb.name);
        assert.deepEqual(names("hash", "/v6/hash/"), ["moxon", "Hash"]);
        assert.deepEqual(names("authentication", "/v6/authentication/"), [
            "moxon",
            "Authentication",
        ]);
        const verify = documentTrail(
            pageTrail(NAV, "v6", "captcha/verify", "en", WORDS, "/v6/captcha/verify/"),
        );
        assert.deepEqual(
            verify.map((crumb) => crumb.path),
            ["/", "/v6/captcha/", "/v6/captcha/verify/"],
        );
        assert.equal(new Set(verify.map((crumb) => crumb.path)).size, verify.length);
        const release = documentTrail(
            pageTrail(NAV, "v6", "changelog/6.3.0", "en", WORDS, "/v6/changelog/6.3.0/"),
        );
        assert.deepEqual(
            release.map((crumb) => crumb.path),
            ["/", "/v6/changelog/", "/v6/changelog/6.3.0/"],
        );
    });

    test("a page the version does not have gives no trail", () => {
        assert.deepEqual(pageTrail(NAV, "v6", "nope", "en", WORDS, "/v6/nope/"), []);
    });
});
