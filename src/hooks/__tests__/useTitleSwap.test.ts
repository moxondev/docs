import assert from "node:assert/strict";
import { test } from "node:test";

import { swapTitle } from "@/hooks/useTitleSwap";

test("the phrase of the template is replaced and the site name stays", () => {
    assert.equal(
        swapTitle("Page not found - moxon", "Page not found", "Page non trouvee"),
        "Page non trouvee - moxon",
    );
});

test("swapping twice, or a phrase that is absent, changes nothing", () => {
    const once = swapTitle("Page not found - moxon", "Page not found", "Page non trouvee");
    assert.equal(swapTitle(once, "Page not found", "Page non trouvee"), once);
    assert.equal(
        swapTitle("Getting started - moxon", "Page not found", "x"),
        "Getting started - moxon",
    );
    assert.equal(swapTitle("Same - moxon", "Same", "Same"), "Same - moxon");
});
