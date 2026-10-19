import assert from "node:assert/strict";
import { test } from "node:test";

import { carryLocation, routePath } from "@/hooks/useLocaleSwitch";
import { alternates } from "@/lib/routes";

test("the language link keeps the query and the fragment", () => {
    const links = alternates("/v6/hash/");
    assert.equal(carryLocation(links.fr, { search: "", hash: "" }), "/fr/v6/hash/");
    assert.equal(
        carryLocation(links.fr, { search: "?x=1", hash: "#parameters" }),
        "/fr/v6/hash/?x=1#parameters",
    );
    assert.equal(
        carryLocation(alternates("/fr/v6/changelog/6.1.0").en, { search: "", hash: "#api" }),
        "/v6/changelog/6.1.0/#api",
    );
    assert.equal(carryLocation(alternates("/fr/").en, { search: "?q=a", hash: "" }), "/?q=a");
});

test("the internal not-found route and a path of another language count as the home", () => {
    assert.equal(routePath("/_not-found/", "en"), "/");
    assert.equal(routePath("/_not-found", "fr"), "/");
    assert.equal(routePath("/fr/zzz/", "en"), "/");
    assert.equal(routePath("/zzz/", "fr"), "/");
    assert.equal(routePath("/v6/hash/", "en"), "/v6/hash/");
    assert.equal(routePath("/fr/v6/hash/", "fr"), "/fr/v6/hash/");
    assert.equal(routePath("/fr/", "fr"), "/fr/");
    assert.equal(routePath("/_not-foundish/", "en"), "/_not-foundish/");
    assert.deepEqual(alternates(routePath("/_not-found/", "en")), { en: "/", fr: "/fr/" });
    assert.deepEqual(alternates(routePath("/fr/zzz/", "en")), { en: "/", fr: "/fr/" });
});
