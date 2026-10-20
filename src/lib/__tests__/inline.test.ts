import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { LATEST } from "@/data/versions";
import {
    ICON_TEXT,
    type InlineNode,
    isLoc,
    parseInline,
    pick,
    plain,
    printInline,
    refTarget,
} from "@/lib/inline";
import type { Block, Inline, Lang, Lx, Page } from "@/types/content";

// Characters built from code points so that this file stays pure ASCII
const E_ACUTE = String.fromCodePoint(0xe9);
const A_GRAVE = String.fromCodePoint(0xe0);
const C_CEDILLA = String.fromCodePoint(0xe7);
const EM_DASH = String.fromCodePoint(0x2014);
const APOSTROPHE = String.fromCodePoint(0x2019);
const QUOTE_OPEN = String.fromCodePoint(0xab);
const QUOTE_CLOSE = String.fromCodePoint(0xbb);

// A version that does not exist yet: the one after the latest, whatever the latest is
const NEXT = `v${Number(LATEST.slice(1)) + 1}`;

// Link targets of every form the grammar allows, used by the generated trees
const TARGETS = [
    "ref:hash",
    "ref:v5/changelog",
    "ref:captcha/verify#parameters",
    "ref:/",
    "#plans",
    "https://api.moxon.dev/v6/uuid",
    "mailto:contact@sylvain.sh",
];

// Text pieces of the generated trees: specials to escape, braces, symbols, accents
const WORDS = [
    "a",
    " b ",
    "x*y",
    "[1]",
    "a\\b",
    "tick`",
    "{text}",
    "{icon:arrow-right}",
    "< > & # |",
    `caf${E_ACUTE} ${EM_DASH} `,
    "KNOWN_VERSIONS",
];

// Code span contents of the generated trees
const CODES = [
    "hex",
    "4532 **** 1234",
    "games[].moves",
    "a\\b",
    "?text={text}",
    "{icon:arrow-right}",
];

/**
 * Builds a text node.
 *
 * @param value - Raw text, without escapes
 * @returns A text node, escaped only when printed
 */
function txt(value: string): InlineNode {
    return { type: "text", value };
}

/**
 * Builds a code span node.
 *
 * @param value - Content of the span
 * @returns A code node, printed between backticks
 */
function code(value: string): InlineNode {
    return { type: "code", value };
}

/**
 * Builds a strong node.
 *
 * @param children - Content of the strong text
 * @returns A strong node, printed between double stars
 */
function strong(...children: InlineNode[]): InlineNode {
    return { type: "strong", children };
}

/**
 * Builds an emphasis node.
 *
 * @param children - Content of the emphasis
 * @returns An em node, printed between single stars
 */
function em(...children: InlineNode[]): InlineNode {
    return { type: "em", children };
}

/**
 * Builds a link node.
 *
 * @param target - Link target (ref:, #id, https or mailto)
 * @param children - Link text
 * @returns A link node, printed as "[text](target)"
 */
function link(target: string, ...children: InlineNode[]): InlineNode {
    return { type: "link", target, children };
}

/**
 * Asserts that a string parses to the expected nodes and prints back unchanged.
 *
 * @param s - Canonical inline string
 * @param nodes - Expected parse
 */
function same(s: string, nodes: InlineNode[]): void {
    assert.deepEqual(parseInline(s), nodes);
    assert.equal(printInline(parseInline(s)), s);
}

/**
 * Returns a deterministic pseudo-random generator (mulberry32), so failures can be replayed.
 *
 * @param seed - Any 32-bit integer
 * @returns A function giving numbers in [0, 1)
 */
function random(seed: number): () => number {
    let state = seed >>> 0;
    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Generates a random printable node list: no empty or adjacent text, no empty container, no
 * strong in a strong, em in an em or link in a link at any depth; siblings of one kind may touch.
 *
 * @param next - Random generator
 * @param depth - Remaining nesting depth
 * @param inside - Container types already open around the list
 * @returns Between one and four nodes
 */
function tree(next: () => number, depth: number, inside: Set<string>): InlineNode[] {
    const out: InlineNode[] = [];
    const count = 1 + Math.floor(next() * 4);
    while (out.length < count) {
        const last = out[out.length - 1];
        const kinds = ["text", "code", "icon"];
        if (depth > 0) {
            for (const kind of ["strong", "em", "link"]) {
                if (!inside.has(kind)) kinds.push(kind);
            }
        }
        const kind = kinds[Math.floor(next() * kinds.length)];
        if (kind === "text") {
            const value = WORDS[Math.floor(next() * WORDS.length)];
            if (last?.type === "text") last.value += value;
            else out.push(txt(value));
        } else if (kind === "code") {
            out.push(code(CODES[Math.floor(next() * CODES.length)]));
        } else if (kind === "icon") {
            out.push({ type: "icon", name: "arrow-right" });
        } else {
            const children = tree(next, depth - 1, new Set([...inside, kind]));
            if (kind === "link") {
                out.push(link(TARGETS[Math.floor(next() * TARGETS.length)], ...children));
            } else {
                out.push({ type: kind as "strong" | "em", children });
            }
        }
    }
    return out;
}

/**
 * Collects every inline string of a list of blocks for one language, nested blocks included.
 *
 * @param blocks - Blocks of a section, a details body or a split branch
 * @param lang - Language whose strings are read; a split contributes only its branch
 * @returns The strings in document order
 */
function inlineLeaves(blocks: Block[], lang: Lang): Inline[] {
    const out: Inline[] = [];
    const add = (lx: Lx<Inline> | undefined): void => {
        if (lx !== undefined) out.push(pick(lx, lang));
    };
    for (const block of blocks) {
        switch (block.type) {
            case "p":
            case "label":
            case "quote":
                add(block.text);
                break;
            case "list":
                block.items.forEach(add);
                break;
            case "callout":
                add(block.title);
                for (const part of pick(block.body, lang)) {
                    if (part.type === "p") out.push(part.text);
                    else out.push(...part.items);
                }
                break;
            case "details":
                add(block.title);
                out.push(...inlineLeaves(block.body, lang));
                break;
            case "values":
                add(block.title);
                block.groups.forEach((group) => add(group.label));
                break;
            case "table":
                out.push(...pick(block.head, lang));
                block.rows.forEach((row) => row.forEach(add));
                break;
            case "params":
                block.rows.forEach((row) => {
                    add(row.default);
                    add(row.description);
                });
                break;
            case "fields":
                block.rows.forEach((row) => {
                    add(row.type);
                    add(row.description);
                });
                break;
            case "errors":
                block.rows.forEach((row) => add(row.description));
                break;
            case "related":
                block.items.forEach((item) => add(item.description));
                break;
            case "split":
                out.push(...inlineLeaves(block[lang], lang));
                break;
            default:
                break;
        }
    }
    return out;
}

// A page that uses every block type, operation and release field of the content model
const SAMPLE: Page = {
    version: "v6",
    id: "hash",
    kind: "endpoint",
    title: { en: "Hash", fr: "Hash" },
    lead: {
        en: "The `/hash` endpoint converts a string into a hash.",
        fr: `L${APOSTROPHE}endpoint \`/hash\` convertit une cha${String.fromCodePoint(0xee)}ne en hash.`,
    },
    updated: "2026-10-17",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/hash",
            try: true,
            params: [
                { name: "text", type: "string", in: "body", required: true, placeholder: "Hello" },
                {
                    name: "method",
                    type: "enum",
                    in: "body",
                    required: true,
                    options: ["md5", "sha1", "sha256"],
                    featured: ["sha256", "md5"],
                },
                { name: "encoding", type: "enum", in: "body", required: false, default: "hex" },
                { name: "token", type: "string", in: "path", required: "conditional", value: "x1" },
            ],
        },
    ],
    release: {
        version: "6.1.0",
        url: "https://github.com/moxondev/api/tree/v6.1.0",
        summary: { en: "New site.", fr: "Nouveau site." },
    },
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }, { type: "rule" }] },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: `Param${String.fromCodePoint(0xe8)}tres` },
            aliases: ["parametres"],
            blocks: [
                {
                    type: "params",
                    columns: "default-after-description",
                    rows: [
                        {
                            name: "text",
                            required: true,
                            description: { en: "The string to hash", fr: `La cha${A_GRAVE}` },
                        },
                        {
                            name: "encoding",
                            required: "conditional",
                            default: "`hex`",
                            description: "`hex` or `base64`",
                        },
                    ],
                },
            ],
        },
        {
            id: "available-methods",
            level: 2,
            title: { en: "Available Methods", fr: `M${E_ACUTE}thodes disponibles` },
            blocks: [
                {
                    type: "values",
                    title: { en: "All methods", fr: `Toutes les m${E_ACUTE}thodes` },
                    groups: [
                        { label: { en: "**SHA:**", fr: "**SHA :**" }, items: ["sha1", "sha256"] },
                    ],
                },
                {
                    type: "details",
                    title: "Details",
                    body: [
                        { type: "label", text: "**RSA Methods:**" },
                        { type: "list", items: ["`RSA-MD5`", "`RSA-SHA1`"] },
                        { type: "list", ordered: true, items: ["one", "two"] },
                    ],
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            blocks: [
                { type: "examples", op: "default", body: { text: "hello", method: "sha256" } },
                {
                    type: "examples",
                    op: "default",
                    path: "/hash/x1",
                    query: { en: { lang: "en" }, fr: { lang: "fr" } },
                    body: { data: [1, { deep: [true, null] }] },
                },
                { type: "code", lang: "json", text: '{ "hash": "2cf2" }', role: "response" },
                { type: "code", text: { en: "# Before", fr: "# Avant" } },
            ],
        },
        {
            id: "response-fields",
            level: 2,
            title: { en: "Response Fields", fr: `Champs de r${E_ACUTE}ponse` },
            aliases: ["champs-de-reponse"],
            blocks: [
                {
                    type: "fields",
                    rows: [{ name: "hash", type: "`string`", description: "Resulting **hash**" }],
                },
                {
                    type: "table",
                    head: {
                        en: ["Method", "Description"],
                        fr: [`M${E_ACUTE}thode`, "Description"],
                    },
                    rows: [["`morse`", { en: "Text {icon:arrow-right} Morse", fr: "Texte" }]],
                    kind: "definition",
                },
            ],
        },
        {
            id: "error-handling",
            level: 2,
            title: { en: "Error Handling", fr: "Gestion des erreurs" },
            blocks: [
                {
                    type: "callout",
                    kind: "warning",
                    title: "Note",
                    body: {
                        en: [{ type: "p", text: "See [plans](ref:pricing#plans)." }],
                        fr: [{ type: "list", items: [`Voir ${QUOTE_OPEN} offres ${QUOTE_CLOSE}`] }],
                    },
                },
                {
                    type: "errors",
                    short: true,
                    rows: [
                        {
                            message: "Please provide a text (?text={text})",
                            description: "The `text` parameter is missing",
                            status: 400,
                        },
                    ],
                },
                { type: "quote", text: "*Quoted*" },
                { type: "try", op: "default", autoSend: true },
                {
                    type: "related",
                    items: [{ label: "/v6/captcha", to: "captcha/verify", description: "Verify" }],
                },
                { type: "plans" },
                { type: "playground" },
                {
                    type: "split",
                    en: [{ type: "p", text: "English only" }],
                    fr: [{ type: "p", text: `Version fran${C_CEDILLA}aise` }],
                },
            ],
        },
        {
            id: "move-format",
            level: 3,
            title: { en: "Move format", fr: "Format des coups" },
            only: "en",
            blocks: [{ type: "p", text: "[`POST /tic-tac-toe/play`](ref:tic-tac-toe/play)" }],
        },
    ],
};

describe("parseInline and printInline", () => {
    test("plain text and the empty string", () => {
        same("", []);
        same("Hello world", [txt("Hello world")]);
        same("KNOWN_VERSIONS and snake_case", [txt("KNOWN_VERSIONS and snake_case")]);
    });

    test("code spans keep their content verbatim", () => {
        same("`hex`", [code("hex")]);
        same("Output: `hex` or `base64`", [
            txt("Output: "),
            code("hex"),
            txt(" or "),
            code("base64"),
        ]);
        same("`4532 **** **** 1234`", [code("4532 **** **** 1234")]);
        same("`games[].moves`", [code("games[].moves")]);
        same("`a\\b`", [code("a\\b")]);
        same("`{icon:arrow-right}`", [code("{icon:arrow-right}")]);
        same("`a``b`", [code("a"), code("b")]);
    });

    test("strong and em", () => {
        same("**RSA Methods:**", [strong(txt("RSA Methods:"))]);
        same("an *experimental* flag", [txt("an "), em(txt("experimental")), txt(" flag")]);
        same("**`secret` action:**", [strong(code("secret"), txt(" action:"))]);
        same("*a **b** c*", [em(txt("a "), strong(txt("b")), txt(" c"))]);
        same("**a *b* c**", [strong(txt("a "), em(txt("b")), txt(" c"))]);
    });

    test("adjacent and stacked stars resolve without loss", () => {
        same("***x***", [strong(em(txt("x")))]);
        same("***a** b*", [em(strong(txt("a")), txt(" b"))]);
        same("**a *b***", [strong(txt("a "), em(txt("b")))]);
        same("*a***b**", [em(txt("a")), strong(txt("b"))]);
        same("**a***b*", [strong(txt("a")), em(txt("b"))]);
        same("*a**b*", [em(txt("a")), em(txt("b"))]);
        same("**a****b**", [strong(txt("a")), strong(txt("b"))]);
        assert.equal(printInline([em(strong(txt("x")))]), "***x***");
    });

    test("a closing run of three stars closes the em, then the strong around it", () => {
        same("**Note *important*** and **more**", [
            strong(txt("Note "), em(txt("important"))),
            txt(" and "),
            strong(txt("more")),
        ]);
        same("**a*`c`***a**a**", [strong(txt("a"), em(code("c"))), txt("a"), strong(txt("a"))]);
        same("*see **this*** or *that*", [
            em(txt("see "), strong(txt("this"))),
            txt(" or "),
            em(txt("that")),
        ]);
    });

    test("links: strong around a link, code as link text, every target form", () => {
        const release = "https://github.com/moxondev/api/releases/tag/v4.0.0";
        same(`**[API v4.0.0](${release})**`, [strong(link(release, txt("API v4.0.0")))]);
        same("[`POST /tic-tac-toe/play`](ref:tic-tac-toe/play)", [
            link("ref:tic-tac-toe/play", code("POST /tic-tac-toe/play")),
        ]);
        same("[**Pro**](ref:pricing#plans)", [link("ref:pricing#plans", strong(txt("Pro")))]);
        for (const target of TARGETS) same(`[x](${target})`, [link(target, txt("x"))]);
        same("[a](x(y)", [link("x(y", txt("a"))]);
    });

    test("links do not nest: the inner link wins and the outer brackets stay text", () => {
        assert.deepEqual(parseInline("[a [b](x)](y)"), [
            txt("[a "),
            link("x", txt("b")),
            txt("](y)"),
        ]);
        assert.deepEqual(parseInline("[[x](y)"), [txt("["), link("y", txt("x"))]);
        assert.deepEqual(parseInline("[](x)"), [txt("[](x)")]);
        assert.notEqual(printInline(parseInline("[a [b](x)](y)")), "[a [b](x)](y)");
    });

    test("escapes of the five special characters", () => {
        same("2 \\* 3", [txt("2 * 3")]);
        same("\\[draft\\]", [txt("[draft]")]);
        same("a \\` b", [txt("a ` b")]);
        same("C:\\\\temp", [txt("C:\\temp")]);
        same("end\\\\", [txt("end\\")]);
        assert.equal(printInline([txt("a*b[c]`d\\")]), "a\\*b\\[c\\]\\`d\\\\");
    });

    test("an escaped pipe is not canonical: the converter writes a plain pipe", () => {
        same("`string|null` or a | b", [code("string|null"), txt(" or a | b")]);
        assert.deepEqual(parseInline("a \\| b"), [txt("a \\| b")]);
        assert.notEqual(printInline(parseInline("a \\| b")), "a \\| b");
    });

    test("braces stay text unless they form a known icon token", () => {
        same("{text}", [txt("{text}")]);
        same("Use {methods} here", [txt("Use {methods} here")]);
        same("{icon:star}", [txt("{icon:star}")]);
        same("{icon:arrow-right", [txt("{icon:arrow-right")]);
        same("{ icon:arrow-right}", [txt("{ icon:arrow-right}")]);
    });

    test("the arrow icon token", () => {
        same("Text {icon:arrow-right} Morse code", [
            txt("Text "),
            { type: "icon", name: "arrow-right" },
            txt(" Morse code"),
        ]);
        same("(`?tag=js` {icon:arrow-right} `[1]`)", [
            txt("("),
            code("?tag=js"),
            txt(" "),
            { type: "icon", name: "arrow-right" },
            txt(" "),
            code("[1]"),
            txt(")"),
        ]);
        same("**{icon:arrow-right}**", [strong({ type: "icon", name: "arrow-right" })]);
    });

    test("a literal icon token in text is printed with an escaped brace", () => {
        const s = printInline([txt("write {icon:arrow-right} for an arrow")]);
        assert.equal(s, "write \\{icon:arrow-right} for an arrow");
        assert.deepEqual(parseInline(s), [txt("write {icon:arrow-right} for an arrow")]);
        assert.equal(printInline([txt("{icon:star}")]), "{icon:star}");
    });

    test("HTML-like characters, hashes and newlines are plain text", () => {
        same("a < b > c & d", [txt("a < b > c & d")]);
        same("issue #4", [txt("issue #4")]);
        same("<img src='x'>", [txt("<img src='x'>")]);
        same("line one\nline two", [txt("line one\nline two")]);
    });

    test("non-ASCII text is kept as is", () => {
        const s = `Encodage de sortie ${EM_DASH} \`hex\` (d${E_ACUTE}faut) ${QUOTE_OPEN}a${QUOTE_CLOSE}`;
        assert.equal(printInline(parseInline(s)), s);
        assert.equal(parseInline(s).length, 3);
    });

    test("unmatched markers become text and are not canonical", () => {
        const loose = [
            "a * b",
            "**open",
            "*open",
            "[draft",
            "draft]",
            "[text]",
            "[a](b c)",
            "``",
            "`x",
        ];
        for (const s of loose) {
            const nodes = parseInline(s);
            assert.ok(
                nodes.every((node) => node.type === "text"),
                s,
            );
            assert.notEqual(printInline(nodes), s, s);
        }
        assert.deepEqual(parseInline("[a]()"), [txt("[a]()")]);
        assert.deepEqual(parseInline("**"), [txt("**")]);
        assert.deepEqual(parseInline("a \\x"), [txt("a \\x")]);
    });

    test("text nodes are never empty and never adjacent", () => {
        const inputs = ["\\*\\*x", "a*b", "[[x](y)", "{icon:no} {x}", "`` `a`", "\\q\\[z"];
        for (const s of inputs) {
            const nodes = parseInline(s);
            nodes.forEach((node, index) => {
                if (node.type !== "text") return;
                assert.ok(node.value.length > 0, s);
                assert.notEqual(nodes[index + 1]?.type, "text", s);
            });
        }
    });

    test("printInline refuses trees the grammar cannot express", () => {
        assert.throws(() => printInline([strong()]), /empty strong/);
        assert.throws(() => printInline([em()]), /empty em/);
        assert.throws(() => printInline([link("ref:hash")]), /empty link/);
        assert.throws(() => printInline([code("")]), /code span/);
        assert.throws(() => printInline([code("a`b")]), /code span/);
        assert.throws(() => printInline([link("ref:a b", txt("x"))]), /link target/);
        assert.throws(() => printInline([link("x)y", txt("x"))]), /link target/);
        assert.throws(() => printInline([link("", txt("x"))]), /link target/);
        assert.throws(() => printInline([strong(txt(""))]), /empty strong/);
        assert.throws(() => printInline([strong(em(strong(txt("x"))))]), /strong inside strong/);
        assert.throws(() => printInline([em(link("ref:a", em(txt("x"))))]), /em inside em/);
        assert.throws(() => printInline([link("ref:a", strong(link("ref:b", txt("x"))))]), /link/);
        assert.throws(
            () => printInline([{ type: "icon", name: "star" } as unknown as InlineNode]),
            /unknown icon/,
        );
    });

    test("printInline refuses a tree whose string reads back with other emphasis", () => {
        const nodes = [em(strong(txt("a")), txt(" b "), strong(txt("c")))];
        assert.throws(() => printInline(nodes), /would read back with other emphasis/);
        assert.deepEqual(parseInline("***a** b **c***"), [
            strong(em(txt("a")), em(txt(" b ")), em(txt("c"))),
        ]);
        assert.equal(
            printInline([strong(em(txt("a")), txt(" b "), em(txt("c")))]),
            "***a* b *c***",
        );
        assert.equal(printInline([em(strong(txt("a"), txt(" b")))]), "***a b***");
    });

    test("consecutive text nodes are escaped as one text", () => {
        const s = printInline([txt("{icon:arrow-"), txt("right}")]);
        assert.equal(s, "\\{icon:arrow-right}");
        assert.deepEqual(parseInline(s), [txt("{icon:arrow-right}")]);
    });

    test("random trees print to strings that read back unchanged, or are refused", () => {
        let printed = 0;
        for (const seed of [20261018, 7, 42, 65537]) {
            const next = random(seed);
            for (let i = 0; i < 2500; i++) {
                let s: string;
                try {
                    s = printInline(tree(next, 3, new Set()));
                } catch (error) {
                    assert.match(String(error), /would read back with other emphasis/);
                    continue;
                }
                printed += 1;
                assert.equal(printInline(parseInline(s)), s, s);
            }
        }
        assert.ok(printed > 8000, `${printed} of 10000 trees printed`);
    });

    test("trees whose star containers are separated by text read back as the same tree", () => {
        const trees = [
            [strong(txt("a")), txt(" "), em(txt("b"))],
            [em(txt("a "), link("ref:hash", strong(txt("b"))), txt(" c"))],
            [strong(link("https://x.dev", code("c"), txt(" t")))],
            [
                txt("x "),
                em(code("y")),
                txt(" "),
                { type: "icon", name: "arrow-right" } as InlineNode,
            ],
        ];
        for (const nodes of trees) assert.deepEqual(parseInline(printInline(nodes)), nodes);
    });

    test("pathological inputs parse in bounded time", () => {
        const started = Date.now();
        const inputs = [
            "*".repeat(5000),
            "[".repeat(2000),
            "**a".repeat(2000),
            "*a[".repeat(1500),
            "`".repeat(5000),
            "{icon:".repeat(2000),
            "\\".repeat(5000),
        ];
        for (const s of inputs) parseInline(s);
        assert.ok(Date.now() - started < 3000, `took ${Date.now() - started} ms`);
    });
});

describe("plain", () => {
    test("drops markers and keeps code, link text and words", () => {
        assert.equal(plain("The `/hash` endpoint"), "The /hash endpoint");
        assert.equal(plain("**[API v6.1.0](https://x.dev)** notes"), "API v6.1.0 notes");
        assert.equal(plain("*a* \\* b"), "a * b");
        assert.equal(plain("`4532 **** 1234`"), "4532 **** 1234");
        assert.equal(plain(""), "");
    });

    test("writes icons as ASCII by default, or with the given words", () => {
        assert.equal(ICON_TEXT["arrow-right"], "->");
        assert.equal(plain("Text {icon:arrow-right} Morse"), "Text -> Morse");
        assert.equal(
            plain("Texte {icon:arrow-right} Morse", { "arrow-right": "vers" }),
            "Texte vers Morse",
        );
    });
});

describe("isLoc and pick", () => {
    test("a Loc has exactly the keys en and fr", () => {
        assert.equal(isLoc({ en: "a", fr: "b" }), true);
        assert.equal(isLoc({ fr: ["x"], en: ["y"] }), true);
        assert.equal(isLoc<unknown>({ en: "a" }), false);
        assert.equal(isLoc<unknown>({ en: "a", fr: "b", de: "c" }), false);
        assert.equal(isLoc<unknown>({ en: "a", de: "b" }), false);
        assert.equal(isLoc("text"), false);
        assert.equal(isLoc<unknown>(["en", "fr"]), false);
        assert.equal(isLoc<unknown>(null), false);
        assert.equal(isLoc<unknown>(42), false);
        assert.equal(isLoc<unknown>(Object.create({ en: 1, fr: 2 })), false);
    });

    test("pick returns the shared value or the value of the language", () => {
        assert.equal(pick("same", "fr"), "same");
        assert.equal(pick({ en: "Yes", fr: "Oui" }, "en"), "Yes");
        assert.equal(pick({ en: "Yes", fr: "Oui" }, "fr"), "Oui");
        assert.deepEqual(pick({ en: ["Field"], fr: ["Champ"] }, "fr"), ["Champ"]);
        assert.deepEqual(pick({ text: "hello" }, "en"), { text: "hello" });
    });
});

describe("refTarget", () => {
    test("same version, explicit version, version home, site home and sections", () => {
        assert.deepEqual(refTarget("ref:captcha/verify"), { slug: "captcha/verify" });
        assert.deepEqual(refTarget("ref:v5/changelog"), { version: "v5", slug: "changelog" });
        assert.deepEqual(refTarget("ref:index"), { slug: "index" });
        assert.deepEqual(refTarget("ref:v4/index"), { version: "v4", slug: "index" });
        assert.deepEqual(refTarget("ref:/"), { slug: "" });
        assert.deepEqual(refTarget("ref:hash#algorithms"), { slug: "hash", section: "algorithms" });
        assert.deepEqual(refTarget("ref:v6/changelog/6.1.0"), {
            version: "v6",
            slug: "changelog/6.1.0",
        });
        assert.deepEqual(refTarget("ref:v5/tic-tac-toe#move-format"), {
            version: "v5",
            slug: "tic-tac-toe",
            section: "move-format",
        });
        assert.deepEqual(refTarget("ref:hash#get-p-method"), {
            slug: "hash",
            section: "get-p-method",
        });
        assert.deepEqual(refTarget("ref:encode"), { slug: "encode" });
    });

    test("anything else is not a ref target", () => {
        const invalid = [
            "ref:",
            `ref:${NEXT}/hash`,
            "ref:v5",
            "ref:v5/",
            "ref:Hash",
            "ref:hash#",
            "ref:hash#a b",
            "ref:/#plans",
            "ref:a//b",
            "ref:/hash",
            "ref:tic_tac_toe",
            "#plans",
            "https://api.moxon.dev",
            "mailto:contact@sylvain.sh",
            "hash",
        ];
        for (const target of invalid) assert.equal(refTarget(target), null, target);
    });
});

describe("content model sample", () => {
    test("every inline string of a page that uses every block type is canonical", () => {
        for (const lang of ["en", "fr"] as const) {
            const strings: Inline[] = [pick(SAMPLE.title, lang)];
            if (SAMPLE.lead) strings.push(pick(SAMPLE.lead, lang));
            if (SAMPLE.release) strings.push(pick(SAMPLE.release.summary, lang));
            for (const section of SAMPLE.sections) {
                if (section.only && section.only !== lang) continue;
                if (section.title) strings.push(pick(section.title, lang));
                strings.push(...inlineLeaves(section.blocks, lang));
            }
            assert.ok(strings.length > 30, `${lang}: ${strings.length} strings`);
            for (const s of strings) assert.equal(printInline(parseInline(s)), s, s);
        }
    });

    test("the plain text of the sample keeps the words a reader sees", () => {
        const leaves = inlineLeaves(SAMPLE.sections[4].blocks, "en").map((s) => plain(s));
        assert.deepEqual(leaves, [
            "string",
            "Resulting hash",
            "Method",
            "Description",
            "morse",
            "Text -> Morse",
        ]);
    });
});
