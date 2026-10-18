import type { SnippetLang } from "@/lib/snippets";
import type { CodeLang } from "@/types/content";

export type TokenKind =
    | "command"
    | "flag"
    | "key"
    | "keyword"
    | "string"
    | "literal"
    | "punct"
    | "comment"
    | "added"
    | "removed";

export interface Token {
    text: string;
    kind?: TokenKind;
}

export type HighlightLang = CodeLang | "python" | "php";

interface Rule {
    re: RegExp;
    kind?: TokenKind;
}

/**
 * Tailwind class of each token kind, backed by the code palette of globals.css: command and JSON
 * keys --code-fn, flags --code-key, strings and values --code-str, punctuation --code-punct. An
 * unclassified token keeps the --code-text of its panel.
 */
export const TOKEN_CLASSES: Readonly<Record<TokenKind, string>> = {
    command: "text-code-fn",
    key: "text-code-fn",
    keyword: "text-code-fn",
    flag: "text-code-key",
    removed: "text-code-key",
    string: "text-code-str",
    literal: "text-code-str",
    added: "text-code-str",
    punct: "text-code-punct",
    comment: "text-code-punct",
};

export const SNIPPET_HIGHLIGHT: Readonly<Record<SnippetLang, HighlightLang>> = {
    curl: "bash",
    javascript: "js",
    python: "python",
    php: "php",
};

// JSON: a string before a colon is a key; numbers, true, false and null are values
const JSON_RULES: readonly Rule[] = [
    { re: /"(?:[^"\\\n]|\\.)*"(?=\s*:)/y, kind: "key" },
    { re: /"(?:[^"\\\n]|\\.)*"/y, kind: "string" },
    { re: /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/y, kind: "literal" },
    { re: /(?:true|false|null)\b/y, kind: "literal" },
    { re: /[{}[\]:,]/y, kind: "punct" },
    { re: /\s+/y },
];

const JS_KEYWORDS = [
    "const",
    "let",
    "var",
    "await",
    "async",
    "function",
    "return",
    "import",
    "from",
    "export",
    "new",
    "if",
    "else",
    "for",
    "of",
    "typeof",
];

// JavaScript (snippets and the js fences of the content, which hold JSON)
const JS_RULES: readonly Rule[] = [
    { re: /\/\/[^\n]*/y, kind: "comment" },
    { re: /\/\*[\s\S]*?\*\//y, kind: "comment" },
    { re: /"(?:[^"\\\n]|\\.)*"(?=\s*:)/y, kind: "key" },
    { re: /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/y, kind: "string" },
    { re: new RegExp(`(?:${JS_KEYWORDS.join("|")})\\b`, "y"), kind: "keyword" },
    { re: /(?:true|false|null|undefined)\b|\d+(?:\.\d+)?/y, kind: "literal" },
    { re: /[A-Za-z_$][\w$]*(?=\s*\()/y, kind: "command" },
    { re: /[A-Za-z_$][\w$]*/y },
    { re: /[{}()[\];,.:=+\-*/<>!?&|]/y, kind: "punct" },
    { re: /\s+/y },
];

// Python (the requests snippet)
const PYTHON_RULES: readonly Rule[] = [
    { re: /#[^\n]*/y, kind: "comment" },
    { re: /"(?:[^"\\\n]|\\.)*"(?=\s*:)/y, kind: "key" },
    { re: /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/y, kind: "string" },
    { re: /(?:import|from|as|def|return|if|elif|else|for|in|with|not|and|or)\b/y, kind: "keyword" },
    { re: /(?:True|False|None)\b|\d+(?:\.\d+)?/y, kind: "literal" },
    { re: /[A-Za-z_][\w]*(?=\s*\()/y, kind: "command" },
    { re: /[A-Za-z_][\w]*/y },
    { re: /[{}()[\]:,.=]/y, kind: "punct" },
    { re: /\s+/y },
];

// PHP (the curl extension snippet)
const PHP_RULES: readonly Rule[] = [
    { re: /\/\/[^\n]*|#[^\n]*/y, kind: "comment" },
    { re: /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\]|\\.)*'/y, kind: "string" },
    { re: /\$[A-Za-z_]\w*/y, kind: "key" },
    { re: /(?:true|false|null)\b|\d+(?:\.\d+)?/y, kind: "literal" },
    { re: /[A-Z][A-Z0-9_]+\b/y, kind: "flag" },
    { re: /[A-Za-z_]\w*(?=\s*\()/y, kind: "command" },
    { re: /[A-Za-z_]\w*/y },
    { re: /[{}()[\];,.=>]/y, kind: "punct" },
    { re: /\s+/y },
];

/**
 * Scans code with an ordered list of sticky rules; the first rule that matches at the position
 * wins, and a character no rule matches is plain text.
 *
 * @param code - Code to scan, newlines included
 * @param rules - Rules of the language, in order of priority
 * @returns Tokens whose texts join back to the code
 */
function scan(code: string, rules: readonly Rule[]): Token[] {
    const out: Token[] = [];
    let i = 0;
    while (i < code.length) {
        let matched = false;
        for (const rule of rules) {
            rule.re.lastIndex = i;
            const match = rule.re.exec(code);
            if (!match || match[0] === "") continue;
            out.push(rule.kind ? { text: match[0], kind: rule.kind } : { text: match[0] });
            i += match[0].length;
            matched = true;
            break;
        }
        if (!matched) {
            out.push({ text: code[i] });
            i += 1;
        }
    }
    return out;
}

/**
 * Tokenizes the content of a single-quoted shell string: a JSON body ("-d '{...}'") keeps its
 * structure (every part a string, colons and commas punctuation), any other content is one
 * string.
 *
 * @param inner - Text between the quotes
 * @returns Tokens of the content, the quotes excluded
 */
function shellJson(inner: string): Token[] {
    if (!/^\s*[{[]/.test(inner)) return inner ? [{ text: inner, kind: "string" }] : [];
    return scan(inner, JSON_RULES).map((token) =>
        token.kind === undefined || (token.kind === "punct" && /^[:,]$/.test(token.text))
            ? token
            : { text: token.text, kind: "string" },
    );
}

/**
 * Tokenizes shell code: the first word of a command (line start, after a pipe, ";" or "&&",
 * not on a line continued by a backslash) is the command, "-x" and "--long" words are flags,
 * quoted strings are strings and "#" starts a comment.
 *
 * @param code - Shell code, cURL snippets included
 * @returns Tokens whose texts join back to the code
 */
function scanShell(code: string): Token[] {
    const out: Token[] = [];
    let i = 0;
    let atCommand = true;
    let continued = false;
    while (i < code.length) {
        const c = code[i];
        const rest = code.slice(i);
        const wordStart = i === 0 || /\s/.test(code[i - 1]);
        if (c === "\n") {
            out.push({ text: c });
            atCommand = !continued;
            continued = false;
            i += 1;
            continue;
        }
        const space = /^[^\S\n]+/.exec(rest);
        if (space) {
            out.push({ text: space[0] });
            i += space[0].length;
            continue;
        }
        continued = false;
        if (c === "\\" && code[i + 1] === "\n") {
            out.push({ text: c });
            continued = true;
            i += 1;
            continue;
        }
        if (c === "#" && wordStart) {
            const comment = /^[^\n]*/.exec(rest)![0];
            out.push({ text: comment, kind: "comment" });
            i += comment.length;
            continue;
        }
        if (c === "'") {
            const end = code.indexOf("'", i + 1);
            const stop = end === -1 ? code.length : end + 1;
            const inner = code.slice(i + 1, end === -1 ? code.length : end);
            out.push({ text: "'", kind: "string" }, ...shellJson(inner));
            if (end !== -1) out.push({ text: "'", kind: "string" });
            atCommand = false;
            i = stop;
            continue;
        }
        const quoted = /^"(?:[^"\\]|\\[\s\S])*"?/.exec(rest);
        if (c === '"' && quoted) {
            out.push({ text: quoted[0], kind: "string" });
            atCommand = false;
            i += quoted[0].length;
            continue;
        }
        if (/[|;&]/.test(c)) {
            const op = /^[|;&]+/.exec(rest)![0];
            out.push({ text: op, kind: "punct" });
            atCommand = true;
            i += op.length;
            continue;
        }
        const word = /^[^\s'"|;&]+/.exec(rest)![0];
        if (word === "\\") {
            out.push({ text: word });
        } else if (c === "-" && wordStart && word.length > 1) {
            out.push({ text: word, kind: "flag" });
        } else if (atCommand && word !== "$") {
            out.push({ text: word, kind: "command" });
            atCommand = false;
        } else {
            out.push({ text: word });
        }
        i += word.length;
    }
    return out;
}

/**
 * Tokenizes HTML: tag names, attribute names, attribute values, the tag punctuation and
 * comments; text between tags stays plain.
 *
 * @param code - HTML code, such as the img tags of the image endpoints
 * @returns Tokens whose texts join back to the code
 */
function scanHtml(code: string): Token[] {
    const out: Token[] = [];
    let i = 0;
    while (i < code.length) {
        const rest = code.slice(i);
        const comment = /^<!--[\s\S]*?(?:-->|$)/.exec(rest);
        if (comment) {
            out.push({ text: comment[0], kind: "comment" });
            i += comment[0].length;
            continue;
        }
        const open = /^<\/?[A-Za-z][\w-]*/.exec(rest);
        if (!open) {
            const text = /^[^<]+|^</.exec(rest)![0];
            out.push({ text });
            i += text.length;
            continue;
        }
        out.push({ text: open[0].slice(0, open[0].startsWith("</") ? 2 : 1), kind: "punct" });
        out.push({ text: open[0].replace(/^<\/?/, ""), kind: "keyword" });
        i += open[0].length;
        while (i < code.length) {
            const part = code.slice(i);
            const close = /^\/?>/.exec(part);
            if (close) {
                out.push({ text: close[0], kind: "punct" });
                i += close[0].length;
                break;
            }
            const piece =
                /^\s+/.exec(part) ??
                /^"[^"]*"?|^'[^']*'?/.exec(part) ??
                /^=/.exec(part) ??
                /^[^\s"'=>/]+/.exec(part) ??
                /^\//.exec(part)!;
            const text = piece[0];
            const kind: TokenKind | undefined = /^\s/.test(text)
                ? undefined
                : /^["']/.test(text)
                  ? "string"
                  : text === "=" || text === "/"
                    ? "punct"
                    : "key";
            out.push(kind ? { text, kind } : { text });
            i += text.length;
        }
    }
    return out;
}

/**
 * Tokenizes a unified diff: added lines, removed lines and hunk headers as a whole.
 *
 * @param code - Diff text, newlines included
 * @returns One token per line, newlines plain
 */
function scanDiff(code: string): Token[] {
    const out: Token[] = [];
    code.split("\n").forEach((line, index) => {
        if (index > 0) out.push({ text: "\n" });
        if (!line) return;
        const kind: TokenKind | undefined = line.startsWith("@@")
            ? "comment"
            : line.startsWith("+")
              ? "added"
              : line.startsWith("-")
                ? "removed"
                : undefined;
        out.push(kind ? { text: line, kind } : { text: line });
    });
    return out;
}

/**
 * Tokenizes an HTTP message: the method or the status code of the first line, the header names
 * and values, then a JSON body after the blank line.
 *
 * @param code - Request or response, headers then an optional body
 * @returns Tokens whose texts join back to the code
 */
function scanHttp(code: string): Token[] {
    const blank = code.indexOf("\n\n");
    const head = blank === -1 ? code : code.slice(0, blank);
    const out: Token[] = [];
    head.split("\n").forEach((line, index) => {
        if (index > 0) out.push({ text: "\n" });
        const start = /^([A-Z]+)( .*)?$/.exec(line);
        const status = /^(HTTP\/[\d.]+ )(\d{3})(.*)$/.exec(line);
        const header = /^([\w-]+)(:)(.*)$/.exec(line);
        if (index === 0 && status) {
            out.push({ text: status[1] }, { text: status[2], kind: "literal" });
            if (status[3]) out.push({ text: status[3] });
        } else if (index === 0 && start) {
            out.push({ text: start[1], kind: "command" });
            if (start[2]) out.push({ text: start[2] });
        } else if (header) {
            out.push({ text: header[1], kind: "key" }, { text: header[2], kind: "punct" });
            if (header[3]) out.push({ text: header[3], kind: "string" });
        } else if (line) out.push({ text: line });
    });
    if (blank !== -1) out.push({ text: "\n\n" }, ...scan(code.slice(blank + 2), JSON_RULES));
    return out;
}

/**
 * Tokenizes code in a language.
 *
 * @param code - Code of one block, newlines included
 * @param lang - Language; text, an unknown or a missing language give plain lines
 * @returns Tokens whose texts join back to the code
 */
function tokens(code: string, lang?: HighlightLang): Token[] {
    switch (lang) {
        case "json":
            return scan(code, JSON_RULES);
        case "js":
            return scan(code, JS_RULES);
        case "python":
            return scan(code, PYTHON_RULES);
        case "php":
            return scan(code, PHP_RULES);
        case "bash":
            return scanShell(code);
        case "html":
            return scanHtml(code);
        case "diff":
            return scanDiff(code);
        case "http":
            return scanHttp(code);
        default:
            return [{ text: code }];
    }
}

/**
 * Highlights code for the dark code panels, shared by the server Code block and the client
 * Snippet and Response views: no runtime dependency, no Shiki, no HTML string.
 *
 * @param code - Code of one block, newlines included
 * @param lang - Language of the block; text or none gives plain lines
 * @returns One array of tokens per line (as many lines as the code has), adjacent tokens of the
 * same kind merged; the texts of a line join back to that line
 */
export function highlight(code: string, lang?: HighlightLang): Token[][] {
    const lines: Token[][] = [[]];
    for (const token of tokens(code, lang)) {
        token.text.split("\n").forEach((part, index) => {
            if (index > 0) lines.push([]);
            if (!part) return;
            const line = lines[lines.length - 1];
            const last = line[line.length - 1];
            if (last && last.kind === token.kind) last.text += part;
            else line.push(token.kind ? { text: part, kind: token.kind } : { text: part });
        });
    }
    return lines;
}
