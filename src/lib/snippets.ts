import { hasBody } from "@/lib/request";
import type { Method } from "@/types/content";

export type SnippetLang = "curl" | "javascript" | "python" | "php";

export interface SnippetRequest {
    method: Method;
    url: string;
    body?: Record<string, unknown>;
}

// Tab order of the code samples; the tab labels live in messages snippet.languages
export const SNIPPET_LANGS: readonly SnippetLang[] = ["curl", "javascript", "python", "php"];

/**
 * Tells whether a stored value is one of the snippet languages, for the persisted tab choice.
 *
 * @param value - Value read from storage or a URL, of any type
 * @returns True for curl, javascript, python and php
 */
export function isSnippetLang(value: unknown): value is SnippetLang {
    return typeof value === "string" && (SNIPPET_LANGS as readonly string[]).includes(value);
}

/**
 * Serializes a key-value object as an indented JS object literal, one key per line.
 *
 * @param obj - Body of the request; nested values print as compact JSON
 * @param baseIndent - Spaces before the closing brace; the keys get four more
 * @returns The literal, "{}" when the object is empty
 */
function toJsObject(obj: Record<string, unknown>, baseIndent: number): string {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    const pad = " ".repeat(baseIndent);
    const inner = " ".repeat(baseIndent + 4);
    const lines = entries.map(([k, v]) => `${inner}${JSON.stringify(k)}: ${JSON.stringify(v)}`);
    return `{\n${lines.join(",\n")}\n${pad}}`;
}

/**
 * Prints a JSON value as a Python literal: the JSON text, except that true, false and null
 * become True, False and None, since JSON booleans are not valid Python.
 *
 * @param value - Value of the request body, any JSON value
 * @returns The literal, compact like JSON.stringify for arrays and objects
 */
function pyLiteral(value: unknown): string {
    if (value === null || value === undefined) return "None";
    if (value === true) return "True";
    if (value === false) return "False";
    if (Array.isArray(value)) return `[${value.map(pyLiteral).join(",")}]`;
    if (typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>);
        return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${pyLiteral(v)}`).join(",")}}`;
    }
    return JSON.stringify(value);
}

/**
 * Serializes a key-value object as a one-line Python dict literal.
 *
 * @param obj - Body of the request; every value prints as a Python literal
 * @returns The dict literal, "{}" when the object is empty
 */
function toPythonDict(obj: Record<string, unknown>): string {
    const entries = Object.entries(obj).map(([k, v]) => `${JSON.stringify(k)}: ${pyLiteral(v)}`);
    return `{${entries.join(", ")}}`;
}

/**
 * Escapes text for a single-quoted shell argument: each quote closes, escapes and reopens.
 *
 * @param text - Content to put between single quotes
 * @returns The content with every "'" written as "'\''"
 */
function shellQuote(text: string): string {
    return text.replaceAll("'", "'\\''");
}

/**
 * Escapes text for a single-quoted PHP string: a quote, and a backslash that PHP would read as an
 * escape (before a backslash, a quote or the end), get a backslash; every other backslash, such
 * as the "\n" of a JSON string, stays unchanged.
 *
 * @param text - Content to put between single quotes
 * @returns The content PHP reads back as the original text
 */
function phpQuote(text: string): string {
    return text.replace(/\\(?=[\\']|$)|'/g, (match) => (match === "'" ? "\\'" : "\\\\"));
}

/**
 * Generates the cURL command: the quoted URL first, then the header and the body flags.
 *
 * @param req - Method, URL with its query string, body for the methods that send one
 * @returns The command over several lines joined by backslashes
 */
function curlSnippet({ method, url, body = {} }: SnippetRequest): string {
    const m = method.toUpperCase();
    if (hasBody(method)) {
        const json = JSON.stringify(body, null, 2).replace(/\n/g, "\n  ");
        return [
            `curl -X ${m} \\`,
            `  "${url}" \\`,
            '  -H "Content-Type: application/json" \\',
            `  -d '${shellQuote(json)}'`,
        ].join("\n");
    }
    return `curl -X ${m} \\\n  "${url}"`;
}

/**
 * Generates the JavaScript fetch snippet.
 *
 * @param req - Method, URL with its query string, body for the methods that send one
 * @returns The code, ending with the parsed JSON in "data"
 */
function javascriptSnippet({ method, url, body = {} }: SnippetRequest): string {
    if (hasBody(method)) {
        return `const response = await fetch("${url}", {
    method: "${method.toUpperCase()}",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(${toJsObject(body, 4)})
});
const data = await response.json();`;
    }
    return `const response = await fetch("${url}");
const data = await response.json();`;
}

/**
 * Generates the Python requests snippet.
 *
 * @param req - Method, URL with its query string, body for the methods that send one
 * @returns The code, ending with the parsed JSON in "data"
 */
function pythonSnippet({ method, url, body = {} }: SnippetRequest): string {
    if (hasBody(method)) {
        return `import requests

response = requests.${method}(
    "${url}",
    json=${toPythonDict(body)}
)
data = response.json()`;
    }
    return `import requests

response = requests.get("${url}")
data = response.json()`;
}

/**
 * Generates the PHP snippet: the curl extension for a body, file_get_contents for a GET.
 *
 * @param req - Method, URL with its query string, body for the methods that send one
 * @returns The code, ending with the decoded JSON in "$data"
 */
function phpSnippet({ method, url, body = {} }: SnippetRequest): string {
    if (hasBody(method)) {
        const json = phpQuote(JSON.stringify(body));
        return `$ch = curl_init("${url}");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${method.toUpperCase()}");
curl_setopt($ch, CURLOPT_POSTFIELDS, '${json}');
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$data = json_decode(curl_exec($ch), true);
curl_close($ch);`;
    }
    return `$response = file_get_contents("${url}");
$data = json_decode($response, true);`;
}

/**
 * Generates the code sample of a request in one language: GET puts its parameters in the URL,
 * the other methods send a JSON body.
 *
 * @param lang - Language of the sample tab
 * @param req - Method, full URL (query string included for a GET) and body
 * @returns The code, without a trailing newline
 */
export function generateSnippet(lang: SnippetLang, req: SnippetRequest): string {
    switch (lang) {
        case "curl":
            return curlSnippet(req);
        case "javascript":
            return javascriptSnippet(req);
        case "python":
            return pythonSnippet(req);
        case "php":
            return phpSnippet(req);
    }
}
