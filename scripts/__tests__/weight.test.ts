import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { firstLoad, overruns, SCRIPTS_MAX, scriptsOf, TOTAL_MAX } from "../weight";

const PAGE = [
    '<link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/panel.js"/>',
    '<link rel="preload" as="script" href="/_next/static/chunks/a.js"/>',
    '<link rel="stylesheet" href="/_next/static/chunks/x.css"/>',
    '<link rel="preload" as="font" href="/_next/static/media/f.woff2"/>',
    '<script src="/_next/static/chunks/a.js" async=""></script>',
    '<script src="/_next/static/chunks/b.js" async=""></script>',
    '<script src="/_next/static/chunks/a.js" async=""></script>',
    '<script>self.__next_f.push([1,"<script src=\\"/ghost.js\\">"])</script>',
].join("");

describe("scripts of a page", () => {
    test("script tags once each, then the preloaded chunks that are not tags", () => {
        assert.deepEqual(scriptsOf(PAGE), {
            tags: ["/_next/static/chunks/a.js", "/_next/static/chunks/b.js"],
            preloads: ["/_next/static/chunks/panel.js"],
        });
    });

    test("a page without script", () => {
        assert.deepEqual(scriptsOf("<html><body>redirect</body></html>"), {
            tags: [],
            preloads: [],
        });
    });
});

describe("first load", () => {
    test("sums the tags, the preloads and both, in kB of 1024 bytes", () => {
        const sizes: Record<string, number> = {
            "/_next/static/chunks/a.js": 100 * 1024,
            "/_next/static/chunks/b.js": 50 * 1024,
            "/_next/static/chunks/panel.js": 10 * 1024,
        };
        assert.deepEqual(
            firstLoad(PAGE, (url) => sizes[url]),
            { scripts: 150, preloaded: 10, total: 160 },
        );
    });
});

describe("alarms", () => {
    test("a page at the limits passes", () => {
        assert.deepEqual(
            overruns({
                scripts: SCRIPTS_MAX,
                preloaded: TOTAL_MAX - SCRIPTS_MAX,
                total: TOTAL_MAX,
            }),
            [],
        );
    });

    test("each alarm is reported on its own", () => {
        assert.equal(overruns({ scripts: SCRIPTS_MAX + 0.1, preloaded: 0, total: 251 }).length, 1);
        assert.equal(overruns({ scripts: 240, preloaded: 20, total: TOTAL_MAX + 2 }).length, 1);
        assert.equal(overruns({ scripts: 260, preloaded: 20, total: 280 }).length, 2);
    });
});
