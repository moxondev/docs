import type { Inline, Lang, Loc, Lx, Version } from "@/types/content";

export type IconName = "arrow-right";

export type InlineNode =
    | { type: "text"; value: string }
    | { type: "code"; value: string }
    | { type: "strong"; children: InlineNode[] }
    | { type: "em"; children: InlineNode[] }
    | { type: "link"; target: string; children: InlineNode[] }
    | { type: "icon"; name: IconName };

export interface RefTarget {
    version?: Version;
    slug: string;
    section?: string;
}

type Frame = "s" | "e" | "l";

type Token =
    | { kind: "text"; value: string }
    | { kind: "code"; value: string }
    | { kind: "icon"; name: IconName }
    | { kind: "stars"; count: number }
    | { kind: "open" }
    | { kind: "close"; target: string; raw: string };

type Action =
    | { kind: "append" }
    | { kind: "literal"; text: string }
    | { kind: "stars"; close: number; open: Frame[] }
    | { kind: "open" }
    | { kind: "close" };

interface Choice {
    stack: string;
    action: Action;
}

interface Container {
    frame: Frame | "";
    children: InlineNode[];
}

interface Style {
    strong: boolean;
    em: boolean;
    link: string | null;
}

// Plain-text stand-in of each icon token; its keys are the allow-list of the {icon:name} token
export const ICON_TEXT: Record<IconName, string> = { "arrow-right": "->" };

// Every documentation version, keyed so that a new member of Version must be added here
const VERSIONS: Record<Version, true> = {
    v1: true,
    v2: true,
    v3: true,
    v4: true,
    v5: true,
    v6: true,
};

// Characters that a backslash escapes; a backslash before any other character is literal
const ESCAPABLE = new Set(["\\", "*", "[", "]", "`", "{"]);

// Characters that a text node always escapes when printed
const ESCAPED = /[\\*[\]`]/g;

// An icon token as it would be read back, to escape its brace when it is literal text
const ICON_TOKEN = /\{icon:([a-z0-9-]+)\}/g;

const ICON_OPEN = "{icon:";

// Stars that open or close each container (a link uses brackets)
const MARKER: Record<Frame, number> = { s: 2, e: 1, l: 0 };

// Node name of each container, for error messages
const NAMES: Record<Frame, string> = { s: "strong", e: "em", l: "link" };

// What 0 to 3 stars left after the closers can open, outermost first, preferred split first
const OPENERS: Frame[][][] = [
    [[]],
    [["e"]],
    [["s"]],
    [
        ["s", "e"],
        ["e", "s"],
    ],
];

// Every stack of open containers, innermost last: s strong, e em, l link, each kind at most once
const STACKS = [
    ...["", "s", "e", "l", "se", "es", "sl", "ls", "el", "le"],
    ...["sel", "sle", "esl", "els", "lse", "les"],
];

// Prefix of an internal link target
const REF = "ref:";

// One segment of a page id: lowercase words joined by hyphens or dots (tic-tac-toe, 6.1.0)
const SEGMENT = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

// A section id or a derived row anchor (parameters, p-method, get-p-name)
const FRAGMENT = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;

// A first segment that names a version, known or not (v5, v7)
const VERSION_LIKE = /^v\d+$/;

// Anything a link target may not hold, since the target ends at the first closing parenthesis
const BAD_TARGET = /[\s)]/;

/**
 * Tells whether a string names an icon of the allow-list.
 *
 * @param name - Text read between "{icon:" and "}"
 * @returns True when the token renders an icon, false when it stays literal text
 */
function isIcon(name: string): name is IconName {
    return Object.hasOwn(ICON_TEXT, name);
}

/**
 * Tells whether a string is one of the documentation versions.
 *
 * @param value - First segment of a ref: target, already known to look like "v" + digits
 * @returns True for a documented version id, false for any other string
 */
function isVersion(value: string): value is Version {
    return Object.hasOwn(VERSIONS, value);
}

/**
 * Reads an icon token of the allow-list at a position.
 *
 * @param src - Inline string whose characters are read at pos
 * @param pos - Offset of a "{" character
 * @returns The icon name, or null when the brace is plain text (unknown name, no closing brace)
 */
function iconAt(src: string, pos: number): IconName | null {
    if (!src.startsWith(ICON_OPEN, pos)) return null;
    const end = src.indexOf("}", pos);
    const name = end === -1 ? "" : src.slice(pos + ICON_OPEN.length, end);
    return isIcon(name) ? name : null;
}

/**
 * Reads the link closer "](target)" at a position: a target that is not empty and holds no
 * whitespace, up to the first closing parenthesis.
 *
 * @param src - Inline string whose characters are read at pos
 * @param pos - Offset of a "]" character
 * @returns The target and the offset after ")", or null when the bracket is plain text
 */
function closeAt(src: string, pos: number): { target: string; end: number } | null {
    if (src[pos + 1] !== "(") return null;
    const end = src.indexOf(")", pos + 2);
    if (end <= pos + 2) return null;
    const target = src.slice(pos + 2, end);
    return /\s/.test(target) ? null : { target, end: end + 1 };
}

/**
 * Splits an inline string into tokens; a run of stars stays one token for the parser to split.
 *
 * A bracket right before "]" or followed by another "[" before any closer becomes text here,
 * since a link needs text and links do not nest (the inner one wins).
 *
 * @param src - Inline string, canonical or not
 * @returns Tokens in reading order
 */
function tokenize(src: string): Token[] {
    const tokens: Token[] = [];
    let text = "";
    let pending = -1;
    const push = (token: Token): void => {
        if (text) tokens.push({ kind: "text", value: text });
        text = "";
        tokens.push(token);
    };

    let pos = 0;
    while (pos < src.length) {
        const ch = src[pos];
        const codeEnd = ch === "`" ? src.indexOf("`", pos + 1) : -1;
        const icon = ch === "{" ? iconAt(src, pos) : null;
        const close = ch === "]" ? closeAt(src, pos) : null;
        if (ch === "\\" && ESCAPABLE.has(src[pos + 1])) {
            text += src[pos + 1];
            pos += 2;
        } else if (codeEnd > pos + 1) {
            push({ kind: "code", value: src.slice(pos + 1, codeEnd) });
            pos = codeEnd + 1;
        } else if (ch === "*") {
            let end = pos;
            while (src[end] === "*") end += 1;
            push({ kind: "stars", count: end - pos });
            pos = end;
        } else if (ch === "[" && src[pos + 1] !== "]") {
            push({ kind: "open" });
            if (pending !== -1) tokens[pending] = { kind: "text", value: "[" };
            pending = tokens.length - 1;
            pos += 1;
        } else if (close) {
            push({ kind: "close", target: close.target, raw: src.slice(pos, close.end) });
            pending = -1;
            pos = close.end;
        } else if (icon) {
            push({ kind: "icon", name: icon });
            pos += ICON_OPEN.length + icon.length + 1;
        } else {
            text += ch;
            pos += 1;
        }
    }
    if (text) tokens.push({ kind: "text", value: text });
    return tokens;
}

/**
 * Lists the ways a run of stars can be read from a stack of open containers: close some
 * innermost strong or em containers (never across a link), then open new ones with the rest.
 *
 * @param count - Number of stars in the run
 * @param stack - Open containers, innermost last
 * @returns The readings, each with the stack it leaves
 */
function starChoices(count: number, stack: string): Choice[] {
    const preferred: Choice[] = [];
    const reopened: Choice[] = [];
    let closable = 0;
    while (closable < stack.length && stack[stack.length - 1 - closable] !== "l") closable += 1;

    for (let k = closable; k >= 0; k -= 1) {
        const base = stack.slice(0, stack.length - k);
        const closed = [...stack.slice(stack.length - k)] as Frame[];
        const rest = closed.reduce((left, frame) => left - MARKER[frame], count);
        for (const open of OPENERS[rest] ?? []) {
            if (open.some((frame) => base.includes(frame))) continue;
            const choice: Choice = {
                stack: base + open.join(""),
                action: { kind: "stars", close: k, open },
            };
            (open.some((frame) => closed.includes(frame)) ? reopened : preferred).push(choice);
        }
    }

    // Readings that close and reopen one kind come last, so "*a **b** c*" keeps its bold word
    return [...preferred, ...reopened];
}

/**
 * Lists the readings of one token from a stack of open containers.
 *
 * @param token - Token whose kind selects the readings; text, code and icon tokens only append
 * @param stack - Open containers, innermost last
 * @param lenient - Whether a star run or a bracket may also be read as literal text, the last
 *     resort for a string that is not canonical
 * @returns The readings in order of preference, each with the stack it leaves
 */
function choices(token: Token, stack: string, lenient: boolean): Choice[] {
    if (token.kind === "text" || token.kind === "code" || token.kind === "icon") {
        return [{ stack, action: { kind: "append" } }];
    }
    const out: Choice[] = [];
    if (token.kind === "stars") {
        out.push(...starChoices(token.count, stack));
    } else if (token.kind === "open" && !stack.includes("l")) {
        out.push({ stack: `${stack}l`, action: { kind: "open" } });
    } else if (token.kind === "close" && stack.endsWith("l")) {
        out.push({ stack: stack.slice(0, -1), action: { kind: "close" } });
    }
    if (lenient) {
        const text =
            token.kind === "stars"
                ? "*".repeat(token.count)
                : token.kind === "open"
                  ? "["
                  : token.raw;
        out.push({ stack, action: { kind: "literal", text } });
    }
    return out;
}

/**
 * Computes, from the last token back to the first, the stacks of open containers from which
 * the rest of the tokens can be read with every container closed at the end.
 *
 * @param tokens - Tokens in reading order, from tokenize()
 * @param lenient - Whether literal readings are allowed
 * @returns One set per position, the end included; the parse exists when the first set holds ""
 */
function viable(tokens: Token[], lenient: boolean): Set<string>[] {
    const ok = new Array<Set<string>>(tokens.length + 1);
    ok[tokens.length] = new Set([""]);
    for (let i = tokens.length - 1; i >= 0; i -= 1) {
        const next = ok[i + 1];
        const kind = tokens[i].kind;
        ok[i] =
            kind === "text" || kind === "code" || kind === "icon"
                ? next
                : new Set(
                      STACKS.filter((stack) =>
                          choices(tokens[i], stack, lenient).some((c) => next.has(c.stack)),
                      ),
                  );
    }
    return ok;
}

/**
 * Appends text to a list of nodes, merged into the last node when it is text.
 *
 * @param children - Nodes of the innermost open container
 * @param value - Text to append; an empty string adds no node
 */
function addText(children: InlineNode[], value: string): void {
    const last = children[children.length - 1];
    if (last?.type === "text") last.value += value;
    else if (value) children.push({ type: "text", value });
}

/**
 * Closes the innermost open container and appends it, as a node, to its parent.
 *
 * @param open - Open containers, the root first
 * @param target - Target of the link being closed, unused for strong and em
 */
function closeTop(open: Container[], target: string): void {
    const inner = open.pop();
    const parent = open[open.length - 1];
    if (!inner || !parent || !inner.frame) throw new Error("inline: unbalanced containers");
    const { children } = inner;
    parent.children.push(
        inner.frame === "l"
            ? { type: "link", target, children }
            : { type: inner.frame === "s" ? "strong" : "em", children },
    );
}

/**
 * Builds the nodes by reading each token with its first reading that keeps the rest viable.
 *
 * @param tokens - Tokens in reading order, from tokenize()
 * @param ok - Result of viable() for the same tokens and mode, whose first set holds ""
 * @param lenient - The mode viable() ran in
 * @returns Nodes in reading order
 */
function build(tokens: Token[], ok: Set<string>[], lenient: boolean): InlineNode[] {
    const root: Container = { frame: "", children: [] };
    const open: Container[] = [root];
    let stack = "";
    tokens.forEach((token, i) => {
        const choice = choices(token, stack, lenient).find((c) => ok[i + 1].has(c.stack));
        if (!choice) throw new Error("inline: no viable reading");
        const { action } = choice;
        const children = open[open.length - 1].children;
        if (action.kind === "literal") addText(children, action.text);
        else if (token.kind === "text") addText(children, token.value);
        else if (token.kind === "code") children.push({ type: "code", value: token.value });
        else if (token.kind === "icon") children.push({ type: "icon", name: token.name });
        else if (action.kind === "open") open.push({ frame: "l", children: [] });
        else if (action.kind === "close" && token.kind === "close") closeTop(open, token.target);
        else if (action.kind === "stars") {
            for (let k = 0; k < action.close; k += 1) closeTop(open, "");
            for (const frame of action.open) open.push({ frame, children: [] });
        }
        stack = choice.stack;
    });
    return root.children;
}

/**
 * Parses an inline markup string into nodes: code spans, strong, em, links and icon tokens.
 *
 * Never throws: when no reading closes every marker, unmatched stars and brackets stay literal
 * text, like an unknown icon or a backslash before an ordinary character.
 *
 * @param s - Inline string of the content model
 * @returns Nodes in reading order; text nodes are never empty and never adjacent
 */
export function parseInline(s: Inline): InlineNode[] {
    const tokens = tokenize(s);
    const strict = viable(tokens, false);
    if (strict[0].has("")) return build(tokens, strict, false);
    return build(tokens, viable(tokens, true), true);
}

/**
 * Escapes the text of a text node: backslash, star, brackets and backtick always, the brace of
 * a literal "{icon:name}" only when that name would otherwise render an icon.
 *
 * @param value - Raw text of the node
 * @returns The text as it is written in an inline string
 */
function escapeText(value: string): string {
    return value
        .replace(ESCAPED, (ch) => `\\${ch}`)
        .replace(ICON_TOKEN, (token, name: string) => (isIcon(name) ? `\\${token}` : token));
}

/**
 * Prints the children of a container after checking that the grammar can express it.
 *
 * @param nodes - Children of a strong, em or link node
 * @param open - Containers already open around it, outermost first
 * @param frame - Container being printed: s for strong, e for em, l for link
 * @returns The printed children, never empty
 */
function printInside(nodes: InlineNode[], open: string, frame: Frame): string {
    if (open.includes(frame)) throw new Error(`inline: ${NAMES[frame]} inside ${NAMES[frame]}`);
    const inner = printNodes(nodes, open + frame);
    if (!inner) throw new Error(`inline: empty ${NAMES[frame]}`);
    return inner;
}

/**
 * Prints one node that is not text in the canonical form of the grammar.
 *
 * @param node - Node other than text; its code content or link target is checked first
 * @param open - Containers already open around it, outermost first
 * @returns The canonical markup of the node, its children included
 */
function printNode(node: Exclude<InlineNode, { type: "text" }>, open: string): string {
    switch (node.type) {
        case "code":
            if (!node.value || node.value.includes("`")) {
                throw new Error(`inline: a code span cannot hold ${JSON.stringify(node.value)}`);
            }
            return `\`${node.value}\``;
        case "strong":
            return `**${printInside(node.children, open, "s")}**`;
        case "em":
            return `*${printInside(node.children, open, "e")}*`;
        case "link":
            if (!node.target || BAD_TARGET.test(node.target)) {
                throw new Error(`inline: invalid link target ${JSON.stringify(node.target)}`);
            }
            return `[${printInside(node.children, open, "l")}](${node.target})`;
        case "icon":
            if (!isIcon(node.name)) throw new Error(`inline: unknown icon ${String(node.name)}`);
            return `${ICON_OPEN}${node.name}}`;
    }
}

/**
 * Prints a list of nodes; consecutive text nodes are joined before escaping, so a literal icon
 * token split across two of them is still escaped.
 *
 * @param nodes - Siblings in reading order; text nodes may be empty or adjacent
 * @param open - Containers already open around them, outermost first
 * @returns The canonical markup of the nodes, with text escaped and adjacent text nodes joined
 */
function printNodes(nodes: InlineNode[], open: string): string {
    let out = "";
    let text = "";
    for (const node of nodes) {
        if (node.type === "text") {
            text += node.value;
            continue;
        }
        out += escapeText(text) + printNode(node, open);
        text = "";
    }
    return out + escapeText(text);
}

/**
 * Lists what a reader sees of nodes: each character of text, each code span and each icon, with
 * the strong, em and link containers around it.
 *
 * The nesting order of strong and em and the split of a container in two do not change the list.
 *
 * @param nodes - Nodes whose link targets are valid (printNodes checked them)
 * @param style - Containers around the nodes
 * @param out - List the entries are appended to
 * @returns The list, one entry per character, code span and icon
 */
function leaves(nodes: InlineNode[], style: Style, out: string[]): string[] {
    const key = `${style.strong ? "s" : "-"}${style.em ? "e" : "-"}${style.link ?? ""} `;
    for (const node of nodes) {
        if (node.type === "text") for (const ch of node.value) out.push(`${key}t${ch}`);
        else if (node.type === "code") out.push(`${key}c${node.value}`);
        else if (node.type === "icon") out.push(`${key}i${node.name}`);
        else if (node.type === "link") leaves(node.children, { ...style, link: node.target }, out);
        else if (node.type === "strong") leaves(node.children, { ...style, strong: true }, out);
        else leaves(node.children, { ...style, em: true }, out);
    }
    return out;
}

/**
 * Prints nodes back to an inline string, in the one canonical form of each construct.
 *
 * Throws on a tree the grammar cannot express, or that would read back with other emphasis.
 *
 * @param nodes - Nodes as parseInline returns them, or as a caller builds them
 * @returns The inline string, which parseInline reads back with the same text and emphasis
 */
export function printInline(nodes: InlineNode[]): Inline {
    const out = printNodes(nodes, "");
    const none: Style = { strong: false, em: false, link: null };

    // An em that starts and ends with a strong prints fine but reads back as a strong of ems
    const seen = leaves(parseInline(out), none, []);
    const meant = leaves(nodes, none, []);
    if (seen.length !== meant.length || seen.some((entry, i) => entry !== meant[i])) {
        throw new Error(`inline: ${JSON.stringify(out)} would read back with other emphasis`);
    }
    return out;
}

/**
 * Concatenates the text of nodes without any markup.
 *
 * @param nodes - Nodes as parseInline returns them, walked depth first
 * @param icons - Text written for each icon token
 * @returns Plain text: code spans keep their content, links keep their text
 */
function textOf(nodes: InlineNode[], icons: Record<IconName, string>): string {
    let out = "";
    for (const node of nodes) {
        if (node.type === "text" || node.type === "code") out += node.value;
        else if (node.type === "icon") out += icons[node.name];
        else out += textOf(node.children, icons);
    }
    return out;
}

/**
 * Returns the plain text of an inline string, for search and meta descriptions.
 *
 * Markers are dropped, code spans and link texts are kept, whitespace is untouched.
 *
 * @param s - Inline string with its markers, which are dropped from the result
 * @param icons - Text of each icon token: ICON_TEXT ("->") by default, or the screen-reader words
 *     of a locale
 * @returns The text a reader sees, an icon replaced by its word
 */
export function plain(s: Inline, icons: Record<IconName, string> = ICON_TEXT): string {
    return textOf(parseInline(s), icons);
}

/**
 * Tells whether a value is a per-language pair: a plain object whose own keys are exactly "en"
 * and "fr".
 *
 * @param value - An Lx leaf, or any value to classify
 * @returns True for a Loc, false for a value written once for both languages
 */
export function isLoc<T>(value: Lx<T>): value is Loc<T> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
    const keys = Object.keys(value);
    return keys.length === 2 && Object.hasOwn(value, "en") && Object.hasOwn(value, "fr");
}

/**
 * Picks the value of one language from an Lx leaf.
 *
 * @param lx - A value written once for both languages, or a Loc pair
 * @param lang - Language of the page being rendered or indexed
 * @returns The value for that language
 */
export function pick<T>(lx: Lx<T>, lang: Lang): T {
    return isLoc(lx) ? lx[lang] : lx;
}

/**
 * Parses an internal link target "ref:[version/]slug[#section]", or "ref:/" for the site home.
 *
 * A first segment made of "v" and digits must be a documented version, so no page id may start
 * with one. Routing is done by lib/routes.ts.
 *
 * @param target - Link target as written in an inline string
 * @returns The version when explicit, the page id ("" for the site home, "index" for a version
 *     home) and the section id; null for a target that is not a well-formed ref: target
 */
export function refTarget(target: string): RefTarget | null {
    if (!target.startsWith(REF)) return null;
    const body = target.slice(REF.length);
    if (body === "/") return { slug: "" };

    const hash = body.indexOf("#");
    const path = hash === -1 ? body : body.slice(0, hash);
    const section = hash === -1 ? undefined : body.slice(hash + 1);
    if (section !== undefined && !FRAGMENT.test(section)) return null;

    const segments = path.split("/");
    const first = segments[0];
    let version: Version | undefined;
    if (VERSION_LIKE.test(first)) {
        if (!isVersion(first)) return null;
        version = first;
        segments.shift();
    }
    if (segments.length === 0 || !segments.every((segment) => SEGMENT.test(segment))) return null;

    const slug = segments.join("/");
    return {
        ...(version ? { version } : {}),
        slug,
        ...(section !== undefined ? { section } : {}),
    };
}
