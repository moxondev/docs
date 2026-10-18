import assert from "node:assert/strict";
import { test } from "node:test";

import { carryLocation, routePath } from "@/hooks/useLocaleSwitch";
import { alternates } from "@/lib/routes";

import { carryLocation } from "./useLocaleSwitch";

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
