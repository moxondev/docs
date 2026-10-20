import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { VERSIONS } from "@/data/versions";
import { type MarkdownLabels, pageMarkdown } from "@/lib/markdown";
import type { Block, Page } from "@/types/content";
import type { Nav } from "@/types/nav";

// Characters built from code points so that this file stays pure ASCII
const EM_DASH = String.fromCodePoint(0x2014);
const EURO = String.fromCodePoint(0x20ac);
const NBSP = String.fromCodePoint(0xa0);

const LABELS: MarkdownLabels = {
    parameter: "Parameter",
    required: "Required",
    default: "Default",
    description: "Description",
    field: "Field",
    type: "Type",
    errorMessage: "Error Message",
    error: "Error",
    status: "Status",
    yes: "Yes",
    no: "No",
    conditional: "Conditional",
    plan: "Plan",
    price: "Price",
    hour: "Hour",
    day: "Day",
    week: "Week",
    month: "Month",
    burst: "Burst",
    free: "Free",
    perMonth: "/month",
    arrow: "to",
};

const NAV: Nav = {
    ...(Object.fromEntries(VERSIONS.map((def) => [def.id, {}])) as Nav),
    v6: {
        "captcha/verify": {
            title: { en: "Captcha Verify", fr: "Captcha, verification" },
            kind: "endpoint",
            methods: ["post"],
        },
        "tic-tac-toe": {
            title: { en: "Online Tic-Tac-Toe", fr: "Morpion en ligne" },
            kind: "endpoint",
            methods: ["post"],
        },
    },
};

/**
 * Wraps blocks in a one-section v6 page.
 *
 * @param blocks - Blocks of the preamble section
 * @param extra - Fields that replace those of the default page
 * @returns The page
 */
function page(blocks: Block[], extra: Partial<Page> = {}): Page {
    return {
        version: "v6",
        id: "hash",
        kind: "endpoint",
        title: { en: "Hash", fr: "Hash" },
        sections: [{ id: "", blocks }],
        ...extra,
    };
}

/**
 * Exports a page and drops its title line, to compare the body only.
 *
 * @param p - Page to export
 * @param lang - Language of the export
 * @returns The Markdown after "# <title>" and its blank line
 */
function body(p: Page, lang: "en" | "fr" = "en"): string {
    return pageMarkdown(p, lang, { labels: LABELS, nav: NAV }).split("\n\n").slice(1).join("\n\n");
}

describe("page structure", () => {
    test("title, lead, headings, one-language sections, a final newline", () => {
        const p: Page = {
            ...page([]),
            lead: { en: "Lead **text**.", fr: "Chapeau." },
            sections: [
                { id: "", blocks: [{ type: "p", text: "Preamble." }] },
                {
                    id: "parameters",
                    level: 2,
                    title: { en: "Parameters", fr: "Parametres" },
                    blocks: [{ type: "p", text: { en: "One.", fr: "Un." } }],
                },
                {
                    id: "note",
                    level: 3,
                    title: { en: "", fr: "Note" },
                    only: "fr",
                    blocks: [{ type: "p", text: "Seulement." }],
                },
            ],
        };
        assert.equal(
            pageMarkdown(p, "en", { labels: LABELS }),
            "# Hash\n\nLead **text**.\n\nPreamble.\n\n## Parameters\n\nOne.\n",
        );
        assert.equal(
            pageMarkdown(p, "fr", { labels: LABELS }),
            "# Hash\n\nChapeau.\n\nPreamble.\n\n## Parametres\n\nUn.\n\n### Note\n\nSeulement.\n",
        );
    });

    test("the release line opens the API section, with its em dash", () => {
        const p: Page = {
            ...page([]),
            id: "changelog/6.1.0",
            kind: "release",
            title: { en: "6.1.0", fr: "6.1.0" },
            release: {
                version: "6.1.0",
                url: "https://github.com/moxondev/api/tree/6.1.0",
                summary: "New site.",
            },
            sections: [
                { id: "", blocks: [] },
                {
                    id: "api",
                    level: 2,
                    title: { en: "API", fr: "API" },
                    blocks: [{ type: "list", items: ["One"] }],
                },
            ],
        };
        assert.equal(
            body(p),
            `## API\n\n**[API v6.1.0](https://github.com/moxondev/api/tree/6.1.0)** ${EM_DASH} New site.\n\n- One\n`,
        );
    });
});

describe("inline markup", () => {
    test("code, strong, em, the arrow icon word", () => {
        const p = page([{ type: "p", text: "`a` **b** *c* `x` {icon:arrow-right} `y`" }]);
        assert.equal(body(p), "`a` **b** *c* `x` to `y`\n");
    });

    test("links become absolute: ref: targets, fragments, the site home; web links unchanged", () => {
        const p = page([
            {
                type: "p",
                text: "[a](ref:captcha/verify#parameters) [b](#errors) [c](ref:v5/changelog) [d](ref:/) [e](https://api.moxon.dev/v6/uuid) [f](mailto:contact@sylvain.sh)",
            },
        ]);
        assert.equal(
            body(p, "fr"),
            "[a](https://moxon.dev/fr/v6/captcha/verify/#parameters) [b](https://moxon.dev/fr/v6/hash/#errors) [c](https://moxon.dev/fr/v5/changelog/) [d](https://moxon.dev/fr/) [e](https://api.moxon.dev/v6/uuid) [f](mailto:contact@sylvain.sh)\n",
        );
    });

    test("literal syntax characters are escaped, words with underscores stay readable", () => {
        const p = page([
            { type: "p", text: "a \\* b \\[c\\] <tag> ~1.4M KNOWN_VERSIONS _x_ &amp; 5 < 6" },
        ]);
        assert.equal(
            body(p),
            "a \\* b \\[c\\] \\<tag> \\~1.4M KNOWN_VERSIONS \\_x\\_ \\&amp; 5 \\< 6\n",
        );
    });

    test("code spans holding backticks get a longer fence", () => {
        const p = page([{ type: "p", text: "use \\`x\\` or `a`" }]);
        assert.equal(body(p), "use \\`x\\` or `a`\n");
        const fenced = page([{ type: "code", lang: "json", text: '{"a": 1}\n```\nb' }]);
        assert.equal(body(fenced), '````json\n{"a": 1}\n```\nb\n````\n');
        const indented = page([{ type: "code", text: "a\n   `````\nb" }]);
        assert.equal(body(indented), "``````\na\n   `````\nb\n``````\n");
    });

    test("a paragraph or item that starts like a block marker is escaped", () => {
        const p = page([
            { type: "p", text: "1. not a list" },
            { type: "p", text: "# not a heading" },
            { type: "list", items: ["- not nested", "+ plus"] },
        ]);
        assert.equal(
            body(p),
            "1\\. not a list\n\n\\# not a heading\n\n- \\- not nested\n- \\+ plus\n",
        );
    });
});

describe("blocks", () => {
    test("label, ordered list, quote, rule", () => {
        const p = page([
            { type: "label", text: "Note:" },
            { type: "list", ordered: true, items: ["a", "b"] },
            { type: "quote", text: "Said." },
            { type: "rule" },
        ]);
        assert.equal(body(p), "**Note:**\n\n1. a\n2. b\n\n> Said.\n\n---\n");
    });

    test("callouts become GitHub alerts", () => {
        const p = page([
            {
                type: "callout",
                kind: "danger",
                title: { en: "Deprecated", fr: "Deprecie" },
                body: {
                    en: [
                        { type: "p", text: "Do not use." },
                        { type: "list", items: ["a", "b"] },
                    ],
                    fr: [{ type: "p", text: "Non." }],
                },
            },
            { type: "callout", kind: "tip", title: "", body: [{ type: "p", text: "Tip." }] },
        ]);
        assert.equal(
            body(p),
            "> [!CAUTION]\n> **Deprecated**\n>\n> Do not use.\n>\n> - a\n> - b\n\n> [!TIP]\n>\n> Tip.\n",
        );
        assert.match(body(p, "fr"), /^> \[!CAUTION\]\n> \*\*Deprecie\*\*\n>\n> Non\.\n/);
    });

    test("details and values become details elements", () => {
        const p = page([
            {
                type: "values",
                title: "All <methods>",
                groups: [
                    { label: "RSA Methods:", items: ["RSA-MD5", "RSA-SHA1"] },
                    { label: "SHA:", items: ["sha1"] },
                ],
            },
            { type: "details", title: "More", body: [{ type: "p", text: "Inside." }] },
        ]);
        assert.equal(
            body(p),
            "<details>\n<summary>All &lt;methods&gt;</summary>\n\n**RSA Methods:**\n\n- `RSA-MD5`\n- `RSA-SHA1`\n\n**SHA:**\n\n- `sha1`\n\n</details>\n\n<details>\n<summary>More</summary>\n\nInside.\n\n</details>\n",
        );
        const arrow = page([{ type: "details", title: "a {icon:arrow-right} b", body: [] }]);
        assert.match(body(arrow), /^<details>\n<summary>a to b<\/summary>/);
    });

    test("generic tables escape the pipe, code spans included", () => {
        const p = page([
            {
                type: "table",
                head: { en: ["Before", "After"], fr: ["Avant", "Apres"] },
                rows: [["`a|b`", "c | d"], ["`x`"]],
            },
        ]);
        assert.equal(
            body(p),
            "| Before | After |\n| --- | --- |\n| `a\\|b` | c \\| d |\n| `x` |  |\n",
        );
    });

    test("parameters: Default column before or after the description, conditional word", () => {
        const before = page([
            {
                type: "params",
                rows: [
                    { name: "len", required: false, default: "`16`", description: "Length" },
                    { name: "type", required: true, description: "Type" },
                    { name: "e", required: "conditional", description: "Exponent" },
                ],
            },
        ]);
        assert.equal(
            body(before),
            "| Parameter | Required | Default | Description |\n| --- | --- | --- | --- |\n| `len` | No | `16` | Length |\n| `type` | Yes |  | Type |\n| `e` | Conditional |  | Exponent |\n",
        );
        const after = page([
            {
                type: "params",
                columns: "default-after-description",
                rows: [{ name: "size", required: false, default: "`200`", description: "Size" }],
            },
        ]);
        assert.equal(
            body(after),
            "| Parameter | Required | Description | Default |\n| --- | --- | --- | --- |\n| `size` | No | Size | `200` |\n",
        );
        const none = page([
            { type: "params", rows: [{ name: "a", required: true, description: "A" }] },
        ]);
        assert.equal(
            body(none),
            "| Parameter | Required | Description |\n| --- | --- | --- |\n| `a` | Yes | A |\n",
        );
    });

    test("fields and errors, with a Status column when the rows carry one", () => {
        const p = page([
            {
                type: "fields",
                rows: [{ name: "games[].moves", type: "`array`", description: "Moves" }],
            },
            {
                type: "errors",
                rows: [{ message: "Text is required", description: "Empty", status: 400 }],
            },
            { type: "errors", short: true, rows: [{ message: "Bad", description: "B" }] },
        ]);
        assert.equal(
            body(p),
            "| Field | Type | Description |\n| --- | --- | --- |\n| `games[].moves` | `array` | Moves |\n\n| Error Message | Description | Status |\n| --- | --- | --- |\n| `Text is required` | Empty | 400 |\n\n| Error | Description |\n| --- | --- |\n| `Bad` | B |\n",
        );
    });

    test("endpoint line and the cURL sample of Code Examples; Try and Playground print nothing", () => {
        const p = page(
            [
                { type: "endpoint", op: "default" },
                { type: "examples", op: "default", body: { text: "hello" } },
                { type: "try", op: "default" },
                { type: "playground" },
            ],
            {
                operations: [
                    { id: "default", method: "post", path: "/hash", try: true, params: [] },
                ],
            },
        );
        assert.equal(
            body(p),
            '`POST https://api.moxon.dev/v6/hash`\n\n```bash\ncurl -X POST \\\n  "https://api.moxon.dev/v6/hash" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n    "text": "hello"\n  }\'\n```\n',
        );
    });

    test("related: method and title of the target page, the label when it has one", () => {
        const p = page([
            {
                type: "related",
                items: [
                    { label: "/v6/captcha", to: "captcha/verify", description: "Verify it" },
                    { label: "", to: "tic-tac-toe", description: { en: "Hub", fr: "Accueil" } },
                ],
            },
        ]);
        assert.equal(
            body(p, "fr"),
            "- POST [/v6/captcha](https://moxon.dev/fr/v6/captcha/verify/) - Verify it\n- POST [Morpion en ligne](https://moxon.dev/fr/v6/tic-tac-toe/) - Accueil\n",
        );
        const noNav = pageMarkdown(p, "en", { labels: LABELS }).split("\n\n")[1];
        assert.equal(
            noNav,
            "- [/v6/captcha](https://moxon.dev/v6/captcha/verify/) - Verify it\n- [tic-tac-toe](https://moxon.dev/v6/tic-tac-toe/) - Hub\n",
        );
    });

    test("the plans block prints the pricing grid with the figures of each plan", () => {
        const fr = body(page([{ type: "plans" }]), "fr").split("\n");
        assert.equal(fr[0], "| Plan | Price | Hour | Day | Week | Month | Burst |  |");
        assert.equal(
            fr[2],
            "| GRATUIT | Free | 2 000 | 48 000 | 336 000 | ~1.4M | 50 | [Commencer](https://api.moxon.dev) |",
        );
        assert.equal(
            fr[4],
            `| PRO | 4,99${NBSP}${EURO}/month | 6 000 | 144 000 | 1 008 000 | ~4.2M | 120 | [Acheter](https://store.moxon.dev/join) |`,
        );
        const en = body(page([{ type: "plans" }]), "en").split("\n");
        assert.equal(
            en[3],
            `| ADVANCED | ${EURO}2.99/month | 3,500 | 84,000 | 588,000 | ~2.5M | 80 | [Purchase](https://store.moxon.dev/join) |`,
        );
    });

    test("split blocks follow the language", () => {
        const p = page([
            {
                type: "split",
                en: [{ type: "p", text: "English." }],
                fr: [{ type: "quote", text: "Francais." }],
            },
        ]);
        assert.equal(body(p, "en"), "English.\n");
        assert.equal(body(p, "fr"), "> Francais.\n");
    });
});
