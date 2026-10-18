import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { generateSnippet, isSnippetLang, SNIPPET_LANGS, type SnippetRequest } from "@/lib/snippets";

// Characters built from code points so that this file stays pure ASCII
const E_ACUTE = String.fromCodePoint(0xe9);

const GET_PLAIN: SnippetRequest = { method: "get", url: "https://api.moxon.dev/v6/uuid" };

const GET_QUERY: SnippetRequest = {
    method: "get",
    url: "https://api.moxon.dev/v6/password?len=16&symbols=true",
};

const POST_BODY: SnippetRequest = {
    method: "post",
    url: "https://api.moxon.dev/v6/hash",
    body: { text: "hello", method: "sha256" },
};

const DELETE_BODY: SnippetRequest = {
    method: "delete",
    url: "https://api.moxon.dev/v4/chat/41a43360",
    body: { username: "User1" },
};

/**
 * Joins expected snippet lines.
 *
 * @param lines - Lines of the snippet, without newlines
 * @returns The snippet text
 */
function lines(...lines: string[]): string {
    return lines.join("\n");
}

describe("the 4 x 4 matrix of languages and request shapes", () => {
    test("GET without query", () => {
        assert.equal(
            generateSnippet("curl", GET_PLAIN),
            lines("curl -X GET \\", '  "https://api.moxon.dev/v6/uuid"'),
        );
        assert.equal(
            generateSnippet("javascript", GET_PLAIN),
            lines(
                'const response = await fetch("https://api.moxon.dev/v6/uuid");',
                "const data = await response.json();",
            ),
        );
        assert.equal(
            generateSnippet("python", GET_PLAIN),
            lines(
                "import requests",
                "",
                'response = requests.get("https://api.moxon.dev/v6/uuid")',
                "data = response.json()",
            ),
        );
        assert.equal(
            generateSnippet("php", GET_PLAIN),
            lines(
                '$response = file_get_contents("https://api.moxon.dev/v6/uuid");',
                "$data = json_decode($response, true);",
            ),
        );
    });

    test("GET with query: the parameters stay in the URL", () => {
        const url = "https://api.moxon.dev/v6/password?len=16&symbols=true";
        assert.equal(generateSnippet("curl", GET_QUERY), lines("curl -X GET \\", `  "${url}"`));
        assert.equal(
            generateSnippet("javascript", GET_QUERY),
            lines(`const response = await fetch("${url}");`, "const data = await response.json();"),
        );
        assert.equal(
            generateSnippet("python", GET_QUERY),
            lines(
                "import requests",
                "",
                `response = requests.get("${url}")`,
                "data = response.json()",
            ),
        );
        assert.equal(
            generateSnippet("php", GET_QUERY),
            lines(
                `$response = file_get_contents("${url}");`,
                "$data = json_decode($response, true);",
            ),
        );
    });

    test("POST with body: command, URL, then the flags", () => {
        assert.equal(
            generateSnippet("curl", POST_BODY),
            lines(
                "curl -X POST \\",
                '  "https://api.moxon.dev/v6/hash" \\',
                '  -H "Content-Type: application/json" \\',
                "  -d '{",
                '    "text": "hello",',
                '    "method": "sha256"',
                "  }'",
            ),
        );
        assert.equal(
            generateSnippet("javascript", POST_BODY),
            lines(
                'const response = await fetch("https://api.moxon.dev/v6/hash", {',
                '    method: "POST",',
                '    headers: { "Content-Type": "application/json" },',
                "    body: JSON.stringify({",
                '        "text": "hello",',
                '        "method": "sha256"',
                "    })",
                "});",
                "const data = await response.json();",
            ),
        );
        assert.equal(
            generateSnippet("python", POST_BODY),
            lines(
                "import requests",
                "",
                "response = requests.post(",
                '    "https://api.moxon.dev/v6/hash",',
                '    json={"text": "hello", "method": "sha256"}',
                ")",
                "data = response.json()",
            ),
        );
        assert.equal(
            generateSnippet("php", POST_BODY),
            lines(
                '$ch = curl_init("https://api.moxon.dev/v6/hash");',
                'curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");',
                'curl_setopt($ch, CURLOPT_POSTFIELDS, \'{"text":"hello","method":"sha256"}\');',
                'curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);',
                "curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);",
                "$data = json_decode(curl_exec($ch), true);",
                "curl_close($ch);",
            ),
        );
    });

    test("DELETE with body", () => {
        const url = "https://api.moxon.dev/v4/chat/41a43360";
        assert.equal(
            generateSnippet("curl", DELETE_BODY),
            lines(
                "curl -X DELETE \\",
                `  "${url}" \\`,
                '  -H "Content-Type: application/json" \\',
                "  -d '{",
                '    "username": "User1"',
                "  }'",
            ),
        );
        assert.equal(
            generateSnippet("javascript", DELETE_BODY),
            lines(
                `const response = await fetch("${url}", {`,
                '    method: "DELETE",',
                '    headers: { "Content-Type": "application/json" },',
                "    body: JSON.stringify({",
                '        "username": "User1"',
                "    })",
                "});",
                "const data = await response.json();",
            ),
        );
        assert.equal(
            generateSnippet("python", DELETE_BODY),
            lines(
                "import requests",
                "",
                "response = requests.delete(",
                `    "${url}",`,
                '    json={"username": "User1"}',
                ")",
                "data = response.json()",
            ),
        );
        assert.equal(
            generateSnippet("php", DELETE_BODY),
            lines(
                `$ch = curl_init("${url}");`,
                'curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");',
                'curl_setopt($ch, CURLOPT_POSTFIELDS, \'{"username":"User1"}\');',
                'curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);',
                "curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);",
                "$data = json_decode(curl_exec($ch), true);",
                "curl_close($ch);",
            ),
        );
    });
});

describe("edge cases", () => {
    test("an empty body prints an empty object", () => {
        const req: SnippetRequest = { method: "post", url: "https://api.moxon.dev/v6/infos" };
        assert.match(generateSnippet("curl", req), /-d '\{\}'$/);
        assert.match(generateSnippet("javascript", req), /JSON\.stringify\(\{\}\)/);
        assert.match(generateSnippet("python", req), /json=\{\}\n/);
        assert.match(generateSnippet("php", req), /CURLOPT_POSTFIELDS, '\{\}'\);/);
    });

    test("patch and put send a body too", () => {
        for (const method of ["patch", "put"] as const) {
            const out = generateSnippet("curl", { ...POST_BODY, method });
            assert.match(out, new RegExp(`^curl -X ${method.toUpperCase()} \\\\\n`));
            assert.match(out, /-d '\{/);
        }
    });

    test("quotes in a body cannot break the shell or the PHP string", () => {
        const req: SnippetRequest = {
            method: "post",
            url: "https://api.moxon.dev/v6/text",
            body: { text: `l'${E_ACUTE}t${E_ACUTE} a\\b` },
        };
        assert.ok(generateSnippet("curl", req).includes(`"l'\\''${E_ACUTE}t${E_ACUTE} a\\\\b"`));
        assert.ok(
            generateSnippet("php", req).includes(`'{"text":"l\\'${E_ACUTE}t${E_ACUTE} a\\\\\\b"}'`),
        );
    });

    test("Python gets True, False and None, nested values compact", () => {
        const req: SnippetRequest = {
            method: "post",
            url: "https://api.moxon.dev/v6/matrix",
            body: {
                private: true,
                legend: false,
                none: null,
                matrix: [
                    [1, 2],
                    [3, 4],
                ],
                o: { a: true },
            },
        };
        assert.ok(
            generateSnippet("python", req).includes(
                'json={"private": True, "legend": False, "none": None, "matrix": [[1,2],[3,4]], "o": {"a":True}}',
            ),
        );
        assert.ok(generateSnippet("javascript", req).includes('"matrix": [[1,2],[3,4]]'));
    });

    test("tab order and stored values", () => {
        assert.deepEqual(SNIPPET_LANGS, ["curl", "javascript", "python", "php"]);
        for (const lang of SNIPPET_LANGS) assert.equal(isSnippetLang(lang), true);
        for (const value of ["bash", "js", "", null, 3, undefined]) {
            assert.equal(isSnippetLang(value), false);
        }
    });
});
