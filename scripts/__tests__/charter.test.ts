import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { checkText, inspectText } from "../charter";

// Characters built from code points so that this file stays pure ASCII
const E_ACUTE = String.fromCodePoint(0xe9);
const ARROW = String.fromCodePoint(0x2192);

/**
 * Joins fixture lines into a file text that ends with a newline.
 *
 * @param lines - Source lines of the fixture
 * @returns The file content
 */
function source(...lines: string[]): string {
    return `${lines.join("\n")}\n`;
}

/**
 * Lists the rule ids that the charter reports for a fixture, sorted.
 *
 * @param file - Path the rules see, which selects the .ts or .tsx rules
 * @param lines - Source lines of the fixture
 * @returns Rule ids, one per finding
 */
function rules(file: string, ...lines: string[]): string[] {
    return inspectText(file, source(...lines))
        .map((finding) => finding.rule)
        .sort();
}

describe("JSDoc of top-level symbols", () => {
    test("a documented function and a data const header pass", () => {
        assert.deepEqual(
            rules(
                "src/lib/paths.ts",
                'import { join } from "node:path";',
                "",
                "// Separator appended to every generated path",
                'const SEP = "/";',
                "",
                "/**",
                " * Joins two path segments and appends the separator.",
                " *",
                " * @param a - First segment, without a trailing slash",
                " * @param b - Second segment",
                " * @returns The joined path",
                " */",
                "export function both(a: string, b: string): string {",
                "    return join(a, b) + SEP;",
                "}",
            ),
            [],
        );
    });

    test("a function without JSDoc is reported", () => {
        assert.deepEqual(
            rules(
                "src/lib/add.ts",
                "export function add(a: number, b: number): number {",
                "    return a + b;",
                "}",
            ),
            ["jsdoc-missing"],
        );
    });

    test("a single-line JSDoc is reported once", () => {
        assert.deepEqual(
            rules(
                "src/lib/add.ts",
                "/** Adds two numbers. */",
                "export function add(a: number, b: number): number {",
                "    return a + b;",
                "}",
            ),
            ["jsdoc-inline"],
        );
    });

    test("missing @param and @returns tags are reported", () => {
        assert.deepEqual(
            rules(
                "src/lib/add.ts",
                "/**",
                " * Adds two numbers.",
                " *",
                " * @param a - Left operand",
                " */",
                "export function add(a: number, b: number): number {",
                "    return a + b;",
                "}",
            ),
            ["jsdoc-param", "jsdoc-returns"],
        );
    });

    test("the summary period and the tag periods are checked", () => {
        assert.deepEqual(
            rules(
                "src/lib/add.ts",
                "/**",
                " * Adds two numbers",
                " *",
                " * @param a - Left operand.",
                " * @param b - Right operand",
                " * @returns The sum",
                " */",
                "export function add(a: number, b: number): number {",
                "    return a + b;",
                "}",
            ),
            ["jsdoc-summary", "jsdoc-tag-period"],
        );
    });

    test("a void arrow const needs no @returns", () => {
        assert.deepEqual(
            rules(
                "src/lib/log.ts",
                "/**",
                " * Stores a line in the in-memory log.",
                " *",
                " * @param line - Text to store",
                " */",
                "export const log = (line: string): void => {",
                "    LINES.push(line);",
                "};",
                "",
                "const LINES: string[] = [];",
            ),
            [],
        );
    });

    test("a const that evaluates to a function needs a JSDoc", () => {
        assert.deepEqual(
            rules(
                "src/lib/adder.ts",
                "/**",
                " * Makes an adder.",
                " *",
                " * @param n - Amount added",
                " * @returns The adder",
                " */",
                "function make(n: number) {",
                "    return (x: number) => x + n;",
                "}",
                "",
                "export const addOne = make(1);",
            ),
            ["jsdoc-missing"],
        );
    });

    test("a function may document a destructured object under one name", () => {
        assert.deepEqual(
            rules(
                "src/lib/render.ts",
                "/**",
                " * Renders a label.",
                " *",
                " * @param text - Label text",
                " * @param options - Prefix and suffix around the text",
                " * @returns The decorated label",
                " */",
                "export function render(",
                "    text: string,",
                "    { prefix, suffix }: { prefix: string; suffix: string },",
                "): string {",
                "    return prefix + text + suffix;",
                "}",
            ),
            [],
        );
    });

    test("a component must document each destructured prop", () => {
        assert.deepEqual(
            rules(
                "src/components/Label.tsx",
                "/**",
                " * Shows a label.",
                " *",
                " * @param props - Label text and tone",
                " */",
                "export function Label({ text, tone }: { text: string; tone: string }) {",
                "    return <span className={tone}>{text}</span>;",
                "}",
            ),
            ["jsdoc-param", "jsdoc-param", "jsdoc-param"],
        );
    });

    test("a component documents its destructured props and needs no @returns", () => {
        assert.deepEqual(
            rules(
                "src/components/Title.tsx",
                "/**",
                " * Shows the page title.",
                " *",
                " * @param title - Heading text",
                " */",
                "export function Title({ title }: { title: string }) {",
                "    return <h1>{title}</h1>;",
                "}",
            ),
            [],
        );
    });
});

describe("comment placement", () => {
    test("a comment before the imports is reported", () => {
        assert.deepEqual(
            rules(
                "src/lib/paths.ts",
                "// Header of the file",
                'import { join } from "node:path";',
                "",
                'export const ROOT = join("a", "b");',
            ),
            ["header-comment"],
        );
    });

    test("comments in and above types are reported", () => {
        assert.deepEqual(
            rules(
                "src/types/site.ts",
                "export interface Props {",
                "    // the title",
                "    title: string;",
                "}",
                "",
                "// A version id",
                "export type Version = string;",
            ),
            ["type-comment", "type-comment"],
        );
    });

    test("comments inside a .tsx body and JSX are reported", () => {
        assert.deepEqual(
            rules(
                "src/components/Title.tsx",
                "/**",
                " * Shows the page title.",
                " *",
                " * @param title - Heading text",
                " */",
                "export function Title({ title }: { title: string }) {",
                "    // why",
                "    return (",
                "        <h1>",
                "            {/* note */}",
                "            {title}",
                "        </h1>",
                "    );",
                "}",
            ),
            ["tsx-comment", "tsx-comment"],
        );
    });

    test("a data const of a .tsx takes a // header, not a JSDoc", () => {
        assert.deepEqual(
            rules(
                "src/components/Tabs.tsx",
                "// Order of the tabs",
                'const TABS = ["a", "b"];',
                "",
                "/**",
                " * Other tabs.",
                " */",
                'export const OTHER = ["c", ...TABS];',
            ),
            ["tsx-comment"],
        );
    });

    test("spacing, trailing and detached comments are reported", () => {
        assert.deepEqual(
            rules(
                "src/lib/sum.ts",
                "/**",
                " * Sums two numbers.",
                " *",
                " * @param a - Left operand",
                " * @param b - Right operand",
                " * @returns The sum",
                " */",
                "export function sum(a: number, b: number): number {",
                "    const c = a + b; // trailing",
                "    // no blank line above",
                "    const d = c;",
                "",
                "    // detached from the code below",
                "",
                "    return d;",
                "}",
            ),
            ["comment-spacing", "comment-spacing", "comment-trailing"],
        );
    });

    test("a comment stacked on a JSDoc is reported", () => {
        assert.deepEqual(
            rules(
                "src/lib/one.ts",
                "// Stray note",
                "/**",
                " * Returns one.",
                " *",
                " * @returns The number one",
                " */",
                "export function one(): number {",
                "    return 1;",
                "}",
            ),
            ["comment-place", "comment-spacing"],
        );
    });

    test("tool pragmas are not comments", () => {
        assert.deepEqual(
            rules(
                "src/lib/sum.ts",
                "/**",
                " * Sums two numbers.",
                " *",
                " * @param a - Left operand",
                " * @param b - Right operand",
                " * @returns The sum",
                " */",
                "export function sum(a: number, b: number): number {",
                "    // prettier-ignore",
                "    let c = a + b;",
                "    return c;",
                "}",
            ),
            [],
        );
    });
});

describe("nesting", () => {
    test("a function declared inside a function is reported", () => {
        assert.deepEqual(
            rules(
                "src/lib/twice.ts",
                "/**",
                " * Doubles a number.",
                " *",
                " * @param n - Input",
                " * @returns Twice the input",
                " */",
                "export function twice(n: number): number {",
                "    function inner(x: number): number {",
                "        return x * 2;",
                "    }",
                "    return inner(n);",
                "}",
            ),
            ["nested-function"],
        );
    });

    test("the methods of a factory are allowed", () => {
        assert.deepEqual(
            rules(
                "src/lib/counter.ts",
                "/**",
                " * Builds a counter with private state.",
                " *",
                " * @returns The counter and its increment method",
                " */",
                "export function counter() {",
                "    let n = 0;",
                "    function increment(): number {",
                "        n += 1;",
                "        return n;",
                "    }",
                "    return { increment };",
                "}",
            ),
            [],
        );
    });
});

describe("characters", () => {
    test("non-ASCII code is reported", () => {
        assert.deepEqual(rules("src/lib/name.ts", `export const NAME = "caf${E_ACUTE}";`), [
            "ascii",
        ]);
    });

    test("content strings may hold accents but no decorative glyph", () => {
        assert.deepEqual(
            rules("src/data/pages/v6/hash.ts", `export const page = { title: "caf${E_ACUTE}" };`),
            [],
        );
        assert.deepEqual(
            rules("src/data/pages/v6/encode.ts", `export const page = { cell: "a ${ARROW} b" };`),
            ["glyph"],
        );
    });

    test("catalog strings may hold accents, their code may not", () => {
        assert.deepEqual(
            rules("src/data/catalogue.ts", `export const TAGLINE = { fr: "caf${E_ACUTE}" };`),
            [],
        );
        assert.deepEqual(rules("src/data/site.ts", `export const caf${E_ACUTE} = 1;`), ["ascii"]);
    });

    test("messages are checked for glyphs", () => {
        const text = JSON.stringify({ common: { next: `Suivant ${ARROW}` } }, null, 4);
        const found = checkText("messages/fr/common.json", text).map((finding) => finding.rule);
        assert.deepEqual(found, ["glyph"]);
    });
});

describe("files", () => {
    test("only globals.css may hold styles", () => {
        assert.deepEqual(
            checkText("src/components/doc/Code.css", "").map((f) => f.rule),
            ["css"],
        );
        assert.deepEqual(checkText("src/app/globals.css", ""), []);
    });

    test("a style element is reported", () => {
        const text = source("export const X = `<" + "style>p {}</" + "style>`;");
        assert.deepEqual(
            checkText("src/lib/x.ts", text).map((f) => f.rule),
            ["style-tag"],
        );
    });

    test("file names are camelCase, PascalCase or imposed by Next", () => {
        assert.deepEqual(
            checkText("src/lib/my-file.ts", "").map((f) => f.rule),
            ["file-name"],
        );
        assert.deepEqual(checkText("src/app/global-not-found.tsx", ""), []);
        assert.deepEqual(checkText("scripts/__tests__/charter.test.ts", ""), []);
        assert.deepEqual(
            checkText("scripts/__tests__/my-charter.test.ts", "").map((f) => f.rule),
            ["file-name"],
        );
        assert.deepEqual(
            checkText("src/lib/Bad_Folder/x.ts", "").map((f) => f.rule),
            ["file-name"],
        );
        assert.deepEqual(checkText("src/data/pages/v6/ticTacToe/fetch.ts", ""), []);
        assert.deepEqual(
            checkText("src/data/pages/v6/tic-tac-toe/fetch.ts", "").map((f) => f.rule),
            ["file-name"],
        );
        assert.deepEqual(checkText("src/app/(fr)/fr/[version]/[[...slug]]/page.tsx", ""), []);
    });
});

describe("test files", () => {
    test("a test file sits in a __tests__ folder", () => {
        assert.deepEqual(
            checkText("src/lib/__tests__/utils.test.ts", "").map((f) => f.rule),
            [],
        );
        assert.deepEqual(
            checkText("src/components/__tests__/Title.test.tsx", "").map((f) => f.rule),
            [],
        );
        assert.deepEqual(
            checkText("src/lib/utils.test.ts", "").map((f) => f.rule),
            ["test-place"],
        );
        assert.deepEqual(
            checkText("src/components/Title.test.tsx", "").map((f) => f.rule),
            ["test-place"],
        );
        assert.deepEqual(
            checkText("src/lib/__tests__/deep/utils.test.ts", "").map((f) => f.rule),
            ["test-place"],
        );
    });
});

describe("comment shape", () => {
    test("stacked // lines above a data const are reported in .ts and .tsx", () => {
        assert.deepEqual(
            rules(
                "src/lib/limit.ts",
                "// First line of the note",
                "// Second line",
                "export const MAX = 3;",
            ),
            ["comment-stack"],
        );
        assert.deepEqual(
            rules(
                "src/components/Tabs.tsx",
                "// First line",
                "// Second line",
                'const TABS = ["a"];',
            ),
            ["comment-stack"],
        );
        const message = (file: string): string | undefined =>
            inspectText(file, source("// One", "// Two", "export const MAX = 3;"))[0]?.message;
        assert.equal(
            message("src/lib/limit.ts"),
            "a description of several lines is a /** */ block",
        );
        assert.equal(message("src/components/Tabs.tsx"), "a data const header is one // line");
    });

    test("one // line, a // run in a body and stacked pragmas pass", () => {
        assert.deepEqual(
            rules("src/lib/limit.ts", "// Largest value", "export const MAX = 3;"),
            [],
        );
        assert.deepEqual(
            rules(
                "src/lib/sum.ts",
                "/**",
                " * Sums two numbers.",
                " *",
                " * @param a - Left operand",
                " * @param b - Right operand",
                " * @returns The sum",
                " */",
                "export function sum(a: number, b: number): number {",
                "    // Order matters: the first operand wins",
                "    // on a tie of the two",
                "    return a + b;",
                "}",
            ),
            [],
        );
        assert.deepEqual(
            rules(
                "src/lib/limit.ts",
                "",
                "// prettier-ignore",
                "// prettier-ignore",
                "export const MAX = 3;",
            ),
            [],
        );
    });

    test("a JSDoc description over three lines is reported", () => {
        const long = rules(
            "src/lib/add.ts",
            "/**",
            " * Adds two numbers.",
            " * Second line.",
            " * Third line.",
            " * Fourth line.",
            " *",
            " * @param a - Left operand",
            " * @param b - Right operand",
            " * @returns The sum",
            " */",
            "export function add(a: number, b: number): number {",
            "    return a + b;",
            "}",
        );
        assert.deepEqual(long, ["jsdoc-long"]);
        const found = inspectText(
            "src/lib/limit.ts",
            source(
                "/**",
                " * One.",
                " * Two.",
                " * Three.",
                " * Four.",
                " */",
                "export const MAX = 3;",
            ),
        );
        assert.equal(
            found[0]?.message,
            "description is 4 lines: one sentence and at most 2 lines of prose",
        );
        assert.deepEqual(
            rules(
                "src/lib/add.ts",
                "/**",
                " * Adds two numbers.",
                " * Second line.",
                " * Third line.",
                " *",
                " * @param a - Left operand",
                " * @param b - Right operand",
                " * @returns The sum",
                " */",
                "export function add(a: number, b: number): number {",
                "    return a + b;",
                "}",
            ),
            [],
        );
    });

    test("a cited plan id or missing document is reported in any comment", () => {
        const stub = ["export const MAX = 3;"];
        assert.deepEqual(rules("src/lib/limit.ts", "// Chosen in plan B2", ...stub), [
            "comment-ref",
        ]);
        assert.deepEqual(rules("src/lib/limit.ts", "// Ported from a .vue page", ...stub), [
            "comment-ref",
        ]);
        assert.deepEqual(
            rules("src/lib/limit.ts", "/**", " * Kept from the mockup.", " */", ...stub),
            ["comment-ref"],
        );
        assert.deepEqual(rules("src/lib/limit.ts", "// Opens on the F1 key", ...stub), []);
        assert.deepEqual(rules("src/lib/limit.ts", "// Largest planned value", ...stub), []);
    });

    test("a comment line over 100 columns is reported", () => {
        const text = `// ${"word ".repeat(21)}`;
        assert.ok(text.length > 100);
        assert.deepEqual(rules("src/lib/limit.ts", text.trimEnd(), "export const MAX = 3;"), [
            "comment-wide",
        ]);
        assert.deepEqual(rules("src/lib/limit.ts", "// Short", "export const MAX = 3;"), []);
    });

    test("a suppression is reported even as a tool pragma", () => {
        const body = (comment: string): string[] => [
            "/**",
            " * Sums two numbers.",
            " *",
            " * @param a - Left operand",
            " * @returns The sum",
            " */",
            "export function sum(a: number): number {",
            `    ${comment}`,
            "    return a;",
            "}",
        ];
        for (const comment of [
            "// eslint-disable-next-line no-console",
            "// @ts-ignore",
            "// @ts-expect-error because",
            "/* eslint-disable */",
            "// @ts-nocheck",
        ]) {
            assert.ok(rules("src/lib/sum.ts", ...body(comment)).includes("suppression"), comment);
        }
        assert.deepEqual(rules("src/lib/sum.ts", ...body("// prettier-ignore")), []);
        assert.deepEqual(rules("src/lib/ref.ts", '/// <reference types="node" />'), []);
    });

    test("a block comment or a JSDoc inside a function body is reported", () => {
        const body = (...inner: string[]): string[] => [
            "/**",
            " * Sums two numbers.",
            " *",
            " * @param a - Left operand",
            " * @returns The sum",
            " */",
            "export function sum(a: number): number {",
            ...inner,
            "    return a;",
            "}",
        ];
        assert.deepEqual(rules("src/lib/sum.ts", ...body("    /* note */", "    const b = a;")), [
            "comment-nested-block",
        ]);
        assert.deepEqual(
            rules(
                "src/lib/sum.ts",
                ...body("    /**", "     * Helper.", "     */", "    const b = a;"),
            ),
            ["comment-nested-block"],
        );
        assert.deepEqual(rules("src/lib/sum.ts", ...body("    // note", "    const b = a;")), []);
    });
});

describe("component consts", () => {
    test("a dynamic const is a component that needs its JSDoc", () => {
        assert.deepEqual(
            rules(
                "src/components/Lazy.tsx",
                'import dynamic from "next/dynamic";',
                "",
                "// Heavy panel, loaded on demand",
                'export const Panel = dynamic(() => import("./Panel"));',
            ),
            ["jsdoc-form", "jsdoc-missing"],
        );
        assert.deepEqual(
            rules(
                "src/components/Lazy.tsx",
                'import dynamic from "next/dynamic";',
                "",
                'export const Panel = dynamic(() => import("./Panel"));',
            ),
            ["jsdoc-missing"],
        );
    });

    test("dynamic, lazy, memo and forwardRef consts accept a JSDoc with props", () => {
        for (const init of [
            'dynamic(() => import("./Panel"))',
            'lazy(() => import("./Panel"))',
            'React.lazy(() => import("./Panel"))',
            "memo(Base)",
            "forwardRef(Base)",
        ]) {
            assert.deepEqual(
                rules(
                    "src/components/Lazy.tsx",
                    "/**",
                    " * Heavy panel, loaded on demand.",
                    " *",
                    " * @param title - Heading of the panel",
                    " */",
                    `export const Panel = ${init};`,
                ),
                [],
                init,
            );
        }
    });
});

describe("shadcn files", () => {
    test("only kebab-case files directly in ui are skipped by the comment rules", () => {
        const text = source("// One", "// Two", "export const MAX = 3;");
        assert.deepEqual(inspectText("src/components/ui/dropdown-menu.tsx", text), []);
        assert.deepEqual(inspectText("src/components/ui/button.tsx", text), []);
        assert.deepEqual(
            inspectText("src/components/ui/Kbd.tsx", text).map((f) => f.rule),
            ["comment-stack"],
        );
        assert.deepEqual(
            inspectText("src/components/ui/deep/Dropdown.tsx", text).map((f) => f.rule),
            ["comment-stack"],
        );
    });

    test("next-env.d.ts keeps being skipped", () => {
        assert.deepEqual(inspectText("next-env.d.ts", source("// One", "// Two")), []);
    });
});
