import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { classify, decodeAttribute, htmlFacts } from "../links";

describe("HTML facts", () => {
    test("href and src of link elements, quoted or not, decoded", () => {
        const html = [
            '<a href="/v6/hash/#p-text">a</a>',
            "<link rel=icon href=/favicon.ico>",
            "<img src='/icon-192.png' alt=\"\">",
            '<a class="x" href="/v6/?a=1&amp;b=2">b</a>',
            '<div data-href="/nope/">c</div>',
        ].join("");
        assert.deepEqual(htmlFacts(html).links, [
            "/v6/hash/#p-text",
            "/favicon.ico",
            "/icon-192.png",
            "/v6/?a=1&b=2",
        ]);
    });

    test("script bodies give neither links nor ids, their src does", () => {
        const html =
            '<script src="/_next/a.js"></script>' +
            '<script>self.__next_f.push([1,"<a href=\\"/ghost/\\" id=\\"ghost\\">"])</script>' +
            "<h2 id=\"parameters\">P</h2><span id='p-text'></span>";
        const facts = htmlFacts(html);
        assert.deepEqual(facts.links, ["/_next/a.js"]);
        assert.deepEqual([...facts.ids], ["parameters", "p-text"]);
    });

    test("entities written by the serializer", () => {
        assert.equal(decodeAttribute("a&amp;b&quot;c&#x27;d&#39;e&lt;f&gt;"), "a&b\"c'd'e<f>");
        assert.equal(decodeAttribute("&nbsp;"), "&nbsp;");
    });
});

describe("link kinds", () => {
    test("site paths and moxon.dev URLs are internal, relative ones resolve on the page", () => {
        assert.deepEqual(classify("/v6/hash/#p-text", "/v6/"), {
            kind: "internal",
            path: "/v6/hash/",
            fragment: "p-text",
        });
        assert.deepEqual(classify("https://moxon.dev/fr/", "/v6/"), {
            kind: "internal",
            path: "/fr/",
            fragment: "",
        });
        assert.deepEqual(classify("verify/", "/v6/captcha/"), {
            kind: "internal",
            path: "/v6/captcha/verify/",
            fragment: "",
        });
        assert.deepEqual(classify("#errors", "/v6/hash/"), {
            kind: "internal",
            path: "/v6/hash/",
            fragment: "errors",
        });
        assert.deepEqual(classify("/a%20b/", "/"), {
            kind: "internal",
            path: "/a b/",
            fragment: "",
        });
        assert.deepEqual(classify("/v6/hash/#100%", "/"), {
            kind: "internal",
            path: "/v6/hash/",
            fragment: "100%",
        });
    });

    test("other origins are external, other schemes are not checked", () => {
        assert.deepEqual(classify("https://github.com/20syldev", "/"), {
            kind: "external",
            url: "https://github.com/20syldev",
        });
        assert.deepEqual(classify("mailto:a@b.c", "/"), { kind: "other" });
        assert.deepEqual(classify("data:image/png;base64,AA", "/"), { kind: "other" });
        assert.deepEqual(classify("ftp://x.y/", "/"), { kind: "other" });
    });
});
