import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { NAV } from "@/data/nav";
import { pageTrail } from "@/lib/trail";

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

    test("a page the version does not have gives no trail", () => {
        assert.deepEqual(pageTrail(NAV, "v6", "nope", "en", WORDS, "/v6/nope/"), []);
    });
});
