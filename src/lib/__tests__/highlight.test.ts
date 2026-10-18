import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
    highlight,
    type HighlightLang,
    SNIPPET_HIGHLIGHT,
    type Token,
    TOKEN_CLASSES,
} from "@/lib/highlight";
import { generateSnippet, SNIPPET_LANGS } from "@/lib/snippets";

// Samples of every highlighted language, the shapes of the content and of the generated code
const SAMPLES: readonly [HighlightLang | undefined, string][] = [
    [
        "json",
        '{\n  "method": "sha256",\n  "ok": true,\n  "n": -1.5e3,\n  "list": [null, "a\\"b"]\n}',
    ],
    ["bash", 'npm install @moxon/api\ncurl -X GET "https://api.moxon.dev/v6/uuid" # comment'],
    ["bash", 'curl -X POST -d "text=hello&method=sha512" "https://api.moxon.dev/v3/hash" | jq .'],
    [
        "html",
        '<img src="https://api.moxon.dev/v6/qrcode?url=x" alt="QR Code" />\n<!-- note -->\n<p>a</p>',
    ],
    ["js", '{\n    "message": "Unauthorized",\n    "status": 401\n}'],
    [
        "diff",
        "- import { evaluate } from '@20syldev/api/v6';\n+ import { evaluate } from '@moxon/api/v6';\n@@ -1 +1 @@\n context",
    ],
    ["http", 'GET /v6/uuid HTTP/1.1\nHost: api.moxon.dev\n\n{"a": 1}'],
    ["http", "HTTP/2 429 Too Many Requests\nretry-after: 30"],
    ["text", "plain text\n\nwith lines"],
    [undefined, "no language"],
    ["json", ""],
    ["bash", "'unterminated"],
    ["bash", `curl -X GET \\\r\n  "u"\r\necho${String.fromCodePoint(0xa0)}a\vb\fc`],
    ["html", "<a href='x'"],
];

/**
 * Joins the token texts of every line back into code.
 *
 * @param lines - Highlighted lines
 * @returns The code the lines were made from
 */
function join(lines: Token[][]): string {
    return lines.map((line) => line.map((token) => token.text).join("")).join("\n");
}

/**
 * Lists the tokens of a line that carry a kind.
 *
 * @param line - Highlighted line
 * @returns "kind:text" strings, plain tokens left out
 */
function kinds(line: Token[]): string[] {
    return line.filter((token) => token.kind).map((token) => `${token.kind}:${token.text}`);
}

describe("highlight keeps the code", () => {
    test("the tokens of each line join back to the line, for every language", () => {
        for (const [lang, code] of SAMPLES) {
            const lines = highlight(code, lang);
            assert.equal(join(lines), code, `${lang}: ${code}`);
            assert.equal(lines.length, code.split("\n").length);
        }
    });

    test("the generated snippets of the four tabs round-trip too", () => {
        const req = {
            method: "post" as const,
            url: "https://api.moxon.dev/v6/hash",
            body: { text: "l'a", n: 1, ok: true },
        };
        for (const lang of SNIPPET_LANGS) {
            const code = generateSnippet(lang, req);
            assert.equal(join(highlight(code, SNIPPET_HIGHLIGHT[lang])), code, lang);
        }
    });

    test("adjacent tokens of the same kind are merged, no empty token", () => {
        for (const [lang, code] of SAMPLES) {
            for (const line of highlight(code, lang)) {
                for (let i = 0; i < line.length; i += 1) {
                    assert.notEqual(line[i].text, "");
                    if (i > 0) assert.notEqual(line[i].kind, line[i - 1].kind);
                }
            }
        }
    });
});

describe("token kinds", () => {
    test("a cURL sample: command, flags, strings, JSON punctuation", () => {
        const code = generateSnippet("curl", {
            method: "post",
            url: "https://api.moxon.dev/v6/hash",
            body: { text: "hello", method: "sha256" },
        });
        const lines = highlight(code, "bash");
        assert.deepEqual(kinds(lines[0]), ["command:curl", "flag:-X"]);
        assert.deepEqual(kinds(lines[1]), ['string:"https://api.moxon.dev/v6/hash"']);
        assert.deepEqual(kinds(lines[2]), ["flag:-H", 'string:"Content-Type: application/json"']);
        assert.deepEqual(kinds(lines[3]), ["flag:-d", "string:'{"]);
        assert.deepEqual(kinds(lines[4]), [
            'string:"text"',
            "punct::",
            'string:"hello"',
            "punct:,",
        ]);
        assert.deepEqual(kinds(lines[6]), ["string:}'"]);
    });

    test("a continued line never starts a command, a new line does", () => {
        const lines = highlight("curl \\\n  https://api.moxon.dev \\\n  -v\necho done", "bash");
        assert.deepEqual(kinds(lines[1]), []);
        assert.deepEqual(kinds(lines[2]), ["flag:-v"]);
        assert.deepEqual(kinds(lines[3]), ["command:echo"]);
        assert.deepEqual(kinds(highlight("a | grep x && wc -l", "bash")[0]), [
            "command:a",
            "punct:|",
            "command:grep",
            "punct:&&",
            "command:wc",
            "flag:-l",
        ]);
    });

    test("JSON keys, string values, literals and punctuation", () => {
        const [line] = highlight('{"a": "b", "c": 1, "d": [true, null]}', "json");
        assert.deepEqual(kinds(line), [
            "punct:{",
            'key:"a"',
            "punct::",
            'string:"b"',
            "punct:,",
            'key:"c"',
            "punct::",
            "literal:1",
            "punct:,",
            'key:"d"',
            "punct::",
            "punct:[",
            "literal:true",
            "punct:,",
            "literal:null",
            "punct:]}",
        ]);
    });

    test("JavaScript, Python and PHP snippets", () => {
        const js = highlight('const response = await fetch("u");', "js")[0];
        assert.deepEqual(kinds(js), [
            "keyword:const",
            "punct:=",
            "keyword:await",
            "command:fetch",
            "punct:(",
            'string:"u"',
            "punct:);",
        ]);
        const py = highlight('response = requests.get("u")', "python")[0];
        assert.ok(kinds(py).includes("command:get"));
        assert.ok(kinds(py).includes('string:"u"'));
        const php = highlight("curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);", "php")[0];
        assert.deepEqual(kinds(php), [
            "command:curl_setopt",
            "punct:(",
            "key:$ch",
            "punct:,",
            "flag:CURLOPT_RETURNTRANSFER",
            "punct:,",
            "literal:true",
            "punct:);",
        ]);
    });

    test("HTML tags, attributes and values", () => {
        const [line] = highlight('<img src="x" alt="QR" />', "html");
        assert.deepEqual(kinds(line), [
            "punct:<",
            "keyword:img",
            "key:src",
            "punct:=",
            'string:"x"',
            "key:alt",
            "punct:=",
            'string:"QR"',
            "punct:/>",
        ]);
    });

    test("diff lines and HTTP messages", () => {
        const diff = highlight("- old\n+ new\n@@ -1 +1 @@\n same", "diff");
        assert.deepEqual(diff.map(kinds), [
            ["removed:- old"],
            ["added:+ new"],
            ["comment:@@ -1 +1 @@"],
            [],
        ]);
        const http = highlight("POST /v6/hash HTTP/1.1\nContent-Type: application/json", "http");
        assert.deepEqual(kinds(http[0]), ["command:POST"]);
        assert.deepEqual(kinds(http[1]), [
            "key:Content-Type",
            "punct::",
            "string: application/json",
        ]);
        assert.deepEqual(kinds(highlight("HTTP/2 200 OK", "http")[0]), ["literal:200"]);
    });

    test("text and a missing language stay plain", () => {
        assert.deepEqual(highlight("a\nb", "text"), [[{ text: "a" }], [{ text: "b" }]]);
        assert.deepEqual(highlight("x"), [[{ text: "x" }]]);
        assert.deepEqual(highlight(""), [[]]);
    });
});

describe("classes", () => {
    test("every kind maps to a code palette token of globals.css, no raw color", () => {
        for (const value of Object.values(TOKEN_CLASSES)) {
            assert.match(value, /^text-code-(fn|key|str|punct)$/);
        }
        assert.equal(TOKEN_CLASSES.command, "text-code-fn");
        assert.equal(TOKEN_CLASSES.key, "text-code-fn");
        assert.equal(TOKEN_CLASSES.flag, "text-code-key");
        assert.equal(TOKEN_CLASSES.string, "text-code-str");
        assert.equal(TOKEN_CLASSES.punct, "text-code-punct");
    });

    test("snippet tabs map to their highlighting language", () => {
        assert.deepEqual(SNIPPET_HIGHLIGHT, {
            curl: "bash",
            javascript: "js",
            python: "python",
            php: "php",
        });
    });
});
