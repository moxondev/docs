import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { argv, cwd, exit } from "node:process";
import { pathToFileURL } from "node:url";

import ts from "typescript";

export interface Finding {
    file: string;
    line: number;
    rule: string;
    message: string;
}

interface Block {
    pos: number;
    end: number;
    kind: "line" | "block" | "jsdoc";
    text: string;
    startLine: number;
    endLine: number;
    pragma: boolean;
    trailing: boolean;
}

type TopSymbol =
    | { kind: "function"; name: string; fn: ts.FunctionLikeDeclaration }
    | { kind: "callable"; name: string }
    | { kind: "data" | "type" | "import" | "class" | "other" };

// Folders that are never scanned: git data, dependencies, build outputs, local work
const SKIPPED_DIRS = new Set([".git", "node_modules", ".next", "out", ".claude-work"]);

// Generated paths, git-ignored and rewritten by every build
const SKIPPED_PATHS = new Set(["public/search", "public/md", "next-env.d.ts"]);

// The only stylesheet the charter allows
const STYLESHEET = "src/app/globals.css";

// Source files whose code and comments must be pure ASCII
const CODE_FILE = /\.(?:ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;

// Source files parsed by TypeScript for the comment and JSDoc rules
const TYPED_FILE = /\.(?:ts|tsx|mts|cts)$/;

// Stylesheets of any dialect
const STYLE_FILE = /\.(?:css|scss|sass|less)$/;

// Documentation content, which may quote HTML verbatim
const CONTENT_DIR = "src/data/pages/";

// User-facing data (catalogs, navigation, content): non-ASCII text is allowed in strings only
const TEXT_DIR = "src/data/";

// shadcn output (kebab-case files directly in src/components/ui/), skipped like it is by ESLint
const GENERATED_FILE = /^src\/components\/ui\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.tsx?$/;

// Folders whose TypeScript file names must be camelCase, PascalCase or a Next.js special name
const NAMED_DIRS = ["scripts/", "src/"];

// File names imposed by Next.js, kebab-case included
const NEXT_FILES = new Set([
    "page",
    "layout",
    "template",
    "default",
    "loading",
    "error",
    "global-error",
    "not-found",
    "global-not-found",
    "route",
    "sitemap",
    "robots",
    "manifest",
    "icon",
    "apple-icon",
    "opengraph-image",
    "twitter-image",
    "instrumentation",
    "instrumentation-client",
    "proxy",
]);

// Folder that holds the test files, beside their subject
const TESTS_DIR = "__tests__";

// Test files, which must sit in the tests folder
const TEST_FILE = /\.test\.[cm]?tsx?$/;

// Largest width of a comment line, as for the code
const MAX_COMMENT_WIDTH = 100;

// Most lines of description in a JSDoc: one sentence and two lines of prose
const MAX_DESCRIPTION_LINES = 3;

// Calls whose result is a component: a const initialised by one is callable
const COMPONENT_WRAPPERS = new Set(["dynamic", "lazy", "memo", "forwardRef"]);

// Suppression comments, which fix nothing
const SUPPRESSION = /eslint-disable|@ts-(?:ignore|expect-error|nocheck)/;

// Plan ids and documents that the repository does not hold, which no comment may cite
const PLANNING_REF =
    /\b(?:plan\s+[A-Z]?\d|SPEC\s+\d|design[- ]spec|UD\d+|AD\d+|delta\s+X\d|spike|stage\s+\d|wave\s*\d|decision\s+(?:Q?\d|2b)|mockups?|variant\s+[A-Z]\b|claude-work|VitePress)|\.vue\b/i;

// Built from two halves so that this file does not match its own search
const STYLE_TAG = new RegExp(`<${"style"}\\b`, "i");

/**
 * Decorative characters banned from user-facing text: the middle dot and bullets, arrows, keyboard
 * glyphs, box drawing, geometric shapes, check marks, stars, dingbats and emoji.
 */
const GLYPHS =
    /[\u00b7\u2022\u2023\u2043\u2219\u2190-\u21ff\u2300-\u23ff\u2500-\u27bf\u27f0-\u27ff\u2900-\u297f\u2b00-\u2bff\ufe0f\u{1f000}-\u{1faff}]/u;

const NON_ASCII = /[\u0080-\u{10ffff}]/u;

// Tool directives, which the charter does not count as comments
const PRAGMA =
    /^(?:\/\/\/\s*<reference|\/\/\s*@ts-|\/\*\s*@ts-|\/\/\s*eslint-|\/\*\s*eslint[\s-]|\/\/\s*prettier-ignore|\/\*\s*prettier-ignore)/;

// Characters after which a comment may open a block (or a switch case) without a blank line
const OPENERS = new Set(["{", "(", "[", ":"]);

// Brackets before which a comment may close an otherwise empty block
const CLOSERS = new Set(["}", ")", "]"]);

/**
 * Lists the files of the project that the charter applies to, as POSIX paths from the root.
 *
 * Git data, dependencies, build outputs, generated files and local work files are skipped.
 *
 * @param root - Project root, the folder that holds package.json
 * @returns Sorted relative paths
 */
export function listFiles(root: string): string[] {
    const out: string[] = [];
    const stack = [""];
    for (let dir = stack.pop(); dir !== undefined; dir = stack.pop()) {
        for (const name of readdirSync(join(root, dir))) {
            const path = dir ? `${dir}/${name}` : name;
            if (SKIPPED_DIRS.has(name) || SKIPPED_PATHS.has(path)) continue;
            if (statSync(join(root, path)).isDirectory()) stack.push(path);
            else out.push(path);
        }
    }
    return out.sort();
}

/**
 * Returns the 1-based line of a character offset in a plain text.
 *
 * @param text - Whole file text
 * @param index - Character offset, 0 for the first character
 * @returns Line number as editors show it
 */
function lineAt(text: string, index: number): number {
    let line = 1;
    for (let i = text.indexOf("\n"); i !== -1 && i < index; i = text.indexOf("\n", i + 1)) line++;
    return line;
}

/**
 * Finds the first match of a pattern on every line of a text.
 *
 * @param text - Whole file text
 * @param pattern - Non-global pattern tested line by line
 * @returns Offsets of the first match of each matching line, in file order
 */
function firstPerLine(text: string, pattern: RegExp): number[] {
    const out: number[] = [];
    let start = 0;
    for (const line of text.split("\n")) {
        const match = pattern.exec(line);
        if (match) out.push(start + match.index);
        start += line.length + 1;
    }
    return out;
}

/**
 * Checks the names on the path of a TypeScript file: the file is camelCase, PascalCase or a name
 * imposed by Next.js, and the folders below src/ (route folders of src/app excepted) are camelCase.
 *
 * The ESLint check-file rule covers file names in some folders only and never folder names.
 *
 * @param file - Path relative to the project root
 * @returns A finding when a name breaks the rule, otherwise null
 */
function checkName(file: string): Finding | null {
    if (!TYPED_FILE.test(file) || GENERATED_FILE.test(file) || file.endsWith(".d.ts")) {
        return null;
    }
    if (!NAMED_DIRS.some((dir) => file.startsWith(dir))) return null;
    const segments = file.split("/");
    const base = (segments.pop() ?? file).replace(/(\.test)?\.[cm]?tsx?$/, "");
    const folder = file.startsWith("src/app/")
        ? undefined
        : segments
              .slice(1)
              .find((segment) => segment !== TESTS_DIR && !/^[a-z][A-Za-z0-9]*$/.test(segment));
    if (folder) {
        return { file, line: 1, rule: "file-name", message: `folder "${folder}" is not camelCase` };
    }
    if (NEXT_FILES.has(base) || /^[A-Za-z][A-Za-z0-9]*$/.test(base)) return null;
    return {
        file,
        line: 1,
        rule: "file-name",
        message: `"${base}" is not camelCase or PascalCase`,
    };
}

/**
 * Checks that a test file sits in a __tests__ folder, the immediate parent of the file.
 *
 * @param file - Path relative to the project root
 * @returns A finding when a test file sits elsewhere, otherwise null
 */
function checkTestPlace(file: string): Finding | null {
    if (!TEST_FILE.test(file)) return null;
    if (file.split("/").slice(-2, -1)[0] === TESTS_DIR) return null;
    return {
        file,
        line: 1,
        rule: "test-place",
        message: "test files sit in a __tests__ folder beside their subject",
    };
}

/**
 * Checks a messages file: valid JSON, ASCII keys and no decorative glyph in any value.
 *
 * @param file - Path relative to the project root, under messages/
 * @param text - File content
 * @returns Findings, with the line of the raw glyph when it is written literally
 */
function checkMessages(file: string, text: string): Finding[] {
    const findings: Finding[] = [];
    let data: unknown;
    try {
        data = JSON.parse(text);
    } catch (error) {
        return [{ file, line: 1, rule: "json", message: `invalid JSON: ${String(error)}` }];
    }
    for (const index of firstPerLine(text, GLYPHS)) {
        const glyph = text.codePointAt(index) ?? 0;
        findings.push({
            file,
            line: lineAt(text, index),
            rule: "glyph",
            message: `decorative character U+${glyph.toString(16).toUpperCase()} in a message`,
        });
    }
    const literal = findings.length > 0;
    const visit = (value: unknown, path: string): void => {
        if (typeof value === "string") {
            if (!literal && GLYPHS.test(value)) {
                findings.push({
                    file,
                    line: 1,
                    rule: "glyph",
                    message: `escaped glyph in ${path}`,
                });
            }
            return;
        }
        if (value && typeof value === "object") {
            for (const [key, child] of Object.entries(value)) {
                if (NON_ASCII.test(key)) {
                    findings.push({ file, line: 1, rule: "ascii", message: `key ${path}.${key}` });
                }
                visit(child, path ? `${path}.${key}` : key);
            }
        }
    };
    visit(data, "");
    return findings;
}

/**
 * Applies the rules that need only the text of a file: one stylesheet, no style element, ASCII
 * in code that TypeScript does not parse, file names and places, and the messages glyph check.
 *
 * @param file - Path relative to the project root
 * @param text - File content
 * @returns Findings of the text rules
 */
export function checkText(file: string, text: string): Finding[] {
    const findings: Finding[] = [];
    const add = (index: number, rule: string, message: string): void => {
        findings.push({ file, line: lineAt(text, index), rule, message });
    };
    if (STYLE_FILE.test(file) && file !== STYLESHEET) {
        add(0, "css", `only ${STYLESHEET} may hold styles`);
    }
    if ((CODE_FILE.test(file) || file.endsWith(".html")) && !file.startsWith(CONTENT_DIR)) {
        const tag = STYLE_TAG.exec(text);
        if (tag) add(tag.index, "style-tag", "no style element: Tailwind classes or globals.css");
    }
    if (CODE_FILE.test(file) && !TYPED_FILE.test(file)) {
        for (const index of firstPerLine(text, NON_ASCII))
            add(index, "ascii", "non-ASCII character");
    }
    if (file.startsWith("messages/") && file.endsWith(".json")) {
        findings.push(...checkMessages(file, text));
    }
    const name = checkName(file);
    if (name) findings.push(name);
    const place = checkTestPlace(file);
    if (place) findings.push(place);
    return findings;
}

/**
 * Builds a TypeScript program over the files that tsconfig.json includes, for the type checker.
 *
 * @param root - Project root that holds tsconfig.json
 * @returns The program; the inspected files are those of the project among its source files
 */
export function createProgram(root: string): ts.Program {
    const config = ts.readConfigFile(join(root, "tsconfig.json"), ts.sys.readFile);
    if (config.error) {
        throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
    }
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
    return ts.createProgram({
        rootNames: parsed.fileNames,
        options: { ...parsed.options, incremental: false, noEmit: true },
    });
}

/**
 * Returns the 1-based line of a character offset in a parsed file.
 *
 * @param source - Parsed file
 * @param pos - Character offset in the file text
 * @returns Line number as editors show it
 */
function lineOf(source: ts.SourceFile, pos: number): number {
    return source.getLineAndCharacterOfPosition(pos).line + 1;
}

/**
 * Collects every comment of a file and merges runs of adjacent // lines into one block.
 *
 * Comments are read from the trivia around each token; ranges that fall inside JSX text are
 * dropped, because slashes there are text.
 *
 * @param source - Parsed file
 * @returns Comment blocks in file order
 */
function collectBlocks(source: ts.SourceFile): Block[] {
    const text = source.getFullText();
    const ranges = new Map<number, ts.CommentRange>();
    const jsxText: [number, number][] = [];
    const visit = (node: ts.Node): void => {
        if (node.kind === ts.SyntaxKind.JsxText) {
            jsxText.push([node.getFullStart(), node.getEnd()]);
            return;
        }
        for (const range of ts.getLeadingCommentRanges(text, node.getFullStart()) ?? []) {
            ranges.set(range.pos, range);
        }
        for (const range of ts.getTrailingCommentRanges(text, node.getEnd()) ?? []) {
            ranges.set(range.pos, range);
        }
        for (const child of node.getChildren(source)) visit(child);
    };
    visit(source);

    const blocks: Block[] = [];
    const sorted = [...ranges.values()].sort((a, b) => a.pos - b.pos);
    for (const range of sorted) {
        if (jsxText.some(([start, end]) => range.pos >= start && range.pos < end)) continue;
        const body = text.slice(range.pos, range.end);
        const lineStart = text.lastIndexOf("\n", range.pos - 1) + 1;
        const block: Block = {
            pos: range.pos,
            end: range.end,
            kind: body.startsWith("//")
                ? "line"
                : body.startsWith("/**") && !body.startsWith("/**/")
                  ? "jsdoc"
                  : "block",
            text: body,
            startLine: lineOf(source, range.pos),
            endLine: lineOf(source, range.end),
            pragma: PRAGMA.test(body),
            trailing: text.slice(lineStart, range.pos).trim() !== "",
        };
        const last = blocks[blocks.length - 1];
        const mergeable = (b: Block): boolean => b.kind === "line" && !b.pragma && !b.trailing;
        if (last && mergeable(last) && mergeable(block) && block.startLine === last.endLine + 1) {
            last.end = block.end;
            last.endLine = block.endLine;
            last.text = `${last.text}\n${block.text}`;
            continue;
        }
        blocks.push(block);
    }
    return blocks;
}

/**
 * Tells whether a node is a function with a body (declaration, expression, arrow, method).
 *
 * @param node - Node of any kind, narrowed to a function-like declaration when the result is true
 * @returns True for function-like declarations that carry a body
 */
function hasBody(node: ts.Node): node is ts.FunctionLikeDeclaration {
    return (
        (ts.isFunctionDeclaration(node) ||
            ts.isFunctionExpression(node) ||
            ts.isArrowFunction(node) ||
            ts.isMethodDeclaration(node) ||
            ts.isConstructorDeclaration(node) ||
            ts.isGetAccessorDeclaration(node) ||
            ts.isSetAccessorDeclaration(node)) &&
        node.body !== undefined
    );
}

/**
 * Returns the chain of nodes, outermost first, whose span (leading trivia excluded) holds a
 * position.
 *
 * @param source - Parsed file
 * @param pos - Character offset, usually the start of a comment
 * @returns The path from the file down to the innermost node; empty at top-level trivia
 */
function pathTo(source: ts.SourceFile, pos: number): ts.Node[] {
    const path: ts.Node[] = [];
    let node: ts.Node | undefined = source;
    while (node) {
        const parent: ts.Node = node;
        node = parent
            .getChildren(source)
            .find((child) => child.getStart(source) <= pos && pos < child.getEnd());
        if (node) path.push(node);
    }
    return path;
}

/**
 * Removes the wrappers that do not change what an initializer evaluates to.
 *
 * @param node - Initializer of a variable declaration
 * @returns The expression inside parentheses, as, satisfies and type assertions
 */
function unwrap(node: ts.Expression): ts.Expression {
    let current = node;
    while (
        ts.isParenthesizedExpression(current) ||
        ts.isAsExpression(current) ||
        ts.isSatisfiesExpression(current) ||
        ts.isTypeAssertionExpression(current)
    ) {
        current = current.expression;
    }
    return current;
}

/**
 * Returns the name of the function that a call invokes: foo for foo(...) and for React.foo(...).
 *
 * @param callee - Expression that is called
 * @returns The name, or an empty string for any other callee
 */
function calleeName(callee: ts.Expression): string {
    if (ts.isIdentifier(callee)) return callee.text;
    if (
        ts.isPropertyAccessExpression(callee) &&
        ts.isIdentifier(callee.expression) &&
        callee.expression.text === "React"
    ) {
        return callee.name.text;
    }
    return "";
}

/**
 * Classifies a top-level statement the way the charter does: a function or component, a const
 * that evaluates to a function, a data const, a type, an import, or anything else.
 *
 * @param statement - Statement of the source file
 * @param checker - Type checker, null when the file is outside the program
 * @returns The kind, with the name and the function node when there is one
 */
function classify(statement: ts.Statement, checker: ts.TypeChecker | null): TopSymbol {
    if (ts.isFunctionDeclaration(statement) && statement.body) {
        return { kind: "function", name: statement.name?.text ?? "default", fn: statement };
    }
    if (ts.isImportDeclaration(statement) || ts.isImportEqualsDeclaration(statement)) {
        return { kind: "import" };
    }
    if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
        return { kind: "type" };
    }
    if (ts.isClassDeclaration(statement)) return { kind: "class" };
    if (ts.isEnumDeclaration(statement)) return { kind: "data" };
    if (!ts.isVariableStatement(statement)) return { kind: "other" };

    for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
        const name = declaration.name.text;
        const init = unwrap(declaration.initializer);
        if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
            return { kind: "function", name, fn: init };
        }
        if (ts.isCallExpression(init) && COMPONENT_WRAPPERS.has(calleeName(init.expression))) {
            return { kind: "callable", name };
        }
        if (checker && !ts.isLiteralExpression(init)) {
            const type = checker.getTypeAtLocation(declaration.name);
            if (type.getCallSignatures().length > 0) return { kind: "callable", name };
        }
    }
    return { kind: "data" };
}

/**
 * Lists the parameters a JSDoc must document: one name per identifier parameter, and the
 * property names of each destructured object parameter.
 *
 * @param fn - Function whose parameters are read
 * @returns One entry per parameter, this excluded; props is null for an identifier parameter
 */
function paramList(fn: ts.FunctionLikeDeclaration): { name: string; props: string[] | null }[] {
    const out: { name: string; props: string[] | null }[] = [];
    for (const parameter of fn.parameters) {
        if (ts.isIdentifier(parameter.name)) {
            if (parameter.name.text !== "this")
                out.push({ name: parameter.name.text, props: null });
            continue;
        }
        if (!ts.isObjectBindingPattern(parameter.name)) continue;
        const props: string[] = [];
        for (const element of parameter.name.elements) {
            const key =
                element.propertyName && ts.isIdentifier(element.propertyName)
                    ? element.propertyName
                    : element.name;
            if (ts.isIdentifier(key)) props.push(key.text);
        }
        out.push({ name: "", props });
    }
    return out;
}

/**
 * Tells whether a type means "returns nothing": void, undefined, never, or a union of those.
 *
 * @param type - Return type, already unwrapped from a Promise
 * @returns True when no @returns tag is needed
 */
function isVoidLike(type: ts.Type): boolean {
    if (type.isUnion()) return type.types.every(isVoidLike);
    const flags = ts.TypeFlags.Void | ts.TypeFlags.Undefined | ts.TypeFlags.Never;
    return (type.flags & flags) !== 0;
}

/**
 * Tells whether a function returns a value, which makes its @returns tag mandatory.
 *
 * Without a type checker, a return statement with an expression (or an arrow with an
 * expression body) is taken as a value.
 *
 * @param fn - Function whose return type (or, without a checker, return statements) is read
 * @param checker - Type checker, null when the file is outside the program
 * @returns True when the function returns something other than void (Promise of void included)
 */
function returnsValue(fn: ts.FunctionLikeDeclaration, checker: ts.TypeChecker | null): boolean {
    if (checker) {
        const signature = checker.getSignatureFromDeclaration(fn);
        if (!signature) return false;
        const type = checker.getReturnTypeOfSignature(signature);
        return !isVoidLike(checker.getAwaitedType(type) ?? type);
    }
    if (fn.body && !ts.isBlock(fn.body)) return true;
    let found = false;
    const visit = (node: ts.Node): void => {
        if (found || (node !== fn.body && hasBody(node))) return;
        if (ts.isReturnStatement(node) && node.expression) found = true;
        else ts.forEachChild(node, visit);
    };
    if (fn.body) visit(fn.body);
    return found;
}

/**
 * Counts the non-blank lines of the description of a multi-line JSDoc, the text before its tags.
 *
 * @param block - A comment block of the jsdoc kind
 * @returns The number of lines; 0 for a single-line block
 */
function descriptionLines(block: Block): number {
    if (block.startLine === block.endLine) return 0;
    const body = block.text
        .split("\n")
        .slice(1, -1)
        .map((line) => line.trim().replace(/^\* ?/, ""));
    const firstTag = body.findIndex((line) => line.startsWith("@"));
    return (firstTag === -1 ? body : body.slice(0, firstTag)).filter((line) => line !== "").length;
}

/**
 * Checks what a comment says and how wide it is, whatever its place: no suppression, no cited
 * plan or document, and no line over the width of the code.
 *
 * @param block - The comment block
 * @param lines - Lines of the file, to measure the full width of the lines the comment spans
 * @returns Findings without the file name
 */
function checkCommentText(block: Block, lines: string[]): Omit<Finding, "file">[] {
    const findings: Omit<Finding, "file">[] = [];
    block.text.split("\n").forEach((row, index) => {
        const line = block.startLine + index;
        if (SUPPRESSION.test(row)) {
            findings.push({
                line,
                rule: "suppression",
                message: "a suppression is never an acceptable why: fix the cause",
            });
        }
        if (PLANNING_REF.test(row)) {
            findings.push({
                line,
                rule: "comment-ref",
                message:
                    "cite the reason, not a plan id or a document that is not in the repository",
            });
        }
    });
    for (let line = block.startLine; line <= block.endLine; line++) {
        if (lines[line - 1].length > MAX_COMMENT_WIDTH) {
            findings.push({
                line,
                rule: "comment-wide",
                message: `comment line over ${MAX_COMMENT_WIDTH} columns`,
            });
        }
    }
    return findings;
}

/**
 * Checks one JSDoc block against the charter: its multi-line form, its summary sentence and its
 * tags, which must cover every parameter and the returned value.
 *
 * @param block - The JSDoc block glued above the symbol
 * @param symbol - The documented symbol; parameters are only checked for real functions
 * @param component - Whether the symbol is a React component, which needs no @returns
 * @param checker - Type checker, null when the file is outside the program
 * @returns Findings without the file name, which the caller adds
 */
function checkJsDoc(
    block: Block,
    symbol: TopSymbol,
    component: boolean,
    checker: ts.TypeChecker | null,
): Omit<Finding, "file">[] {
    const findings: Omit<Finding, "file">[] = [];
    const add = (rule: string, message: string): void => {
        findings.push({ line: block.startLine, rule, message });
    };
    if (block.startLine === block.endLine) return findings;
    const lines = block.text.split("\n").map((line) => line.trim());
    const multiLine = lines.length >= 3 && lines[0] === "/**" && lines[lines.length - 1] === "*/";
    if (!multiLine || !lines.slice(1, -1).every((line) => line.startsWith("*"))) {
        add("jsdoc-form", "a JSDoc block opens with /** alone and closes with */ alone");
        return findings;
    }

    const body = lines.slice(1, -1).map((line) => line.replace(/^\* ?/, "").trimEnd());
    const firstTag = body.findIndex((line) => line.startsWith("@"));
    const description = (firstTag === -1 ? body : body.slice(0, firstTag)).join(" ").trim();
    if (!description.endsWith(".")) add("jsdoc-summary", "the description must end with a period");
    if (firstTag > 0 && body[firstTag - 1] !== "") {
        add("jsdoc-form", "leave a blank line between the description and the tags");
    }

    const tags: string[] = [];
    for (const line of firstTag === -1 ? [] : body.slice(firstTag)) {
        if (line.startsWith("@")) tags.push(line);
        else if (tags.length && line) tags[tags.length - 1] += ` ${line}`;
    }
    const documented: string[] = [];
    let hasReturns = false;
    for (const tag of tags) {
        const name = /^@(\w+)/.exec(tag)?.[1] ?? "";
        let text = "";
        if (name === "param") {
            const match = /^@param\s+([\w$.[\]]+)\s+-\s+(\S.*)$/.exec(tag);
            if (!match) {
                add("jsdoc-tag", `write "@param name - Description": ${tag}`);
                continue;
            }
            documented.push(match[1]);
            text = match[2];
        } else if (name === "returns") {
            const match = /^@returns\s+([^-\s].*)$/.exec(tag);
            if (!match) {
                add("jsdoc-tag", `write "@returns Description": ${tag}`);
                continue;
            }
            hasReturns = true;
            text = match[1];
        } else if (name === "return") {
            add("jsdoc-tag", "use @returns, not @return");
            continue;
        }
        if (text.endsWith(".")) add("jsdoc-tag-period", "a tag description ends without a period");
    }

    if (symbol.kind !== "function") return findings;
    const params = paramList(symbol.fn);
    const roots = documented.map((param) => param.split(".")[0].replace(/\[\]$/, ""));
    const known = new Set(params.flatMap((param) => (param.props ? param.props : [param.name])));
    const bags = roots.filter((root) => !known.has(root));
    for (const param of params) {
        if (!param.props) {
            if (!roots.includes(param.name)) add("jsdoc-param", `missing @param ${param.name}`);
            continue;
        }

        // A component documents each prop; any other function may name the destructured object
        const complete = param.props.every((prop) => roots.includes(prop));
        if (complete || (!component && bags.shift() !== undefined)) continue;
        for (const prop of param.props) {
            if (!roots.includes(prop)) add("jsdoc-param", `missing @param ${prop}`);
        }
    }
    for (const root of bags) add("jsdoc-param", `@param ${root} matches no parameter`);
    if (!component && !hasReturns && returnsValue(symbol.fn, checker)) {
        add("jsdoc-returns", `${symbol.name} returns a value: add @returns`);
    }
    return findings;
}

/**
 * Tells whether a nested function declaration is a method of a factory, which the charter
 * allows: the enclosing function returns an object literal that exposes it.
 *
 * @param enclosing - Function that contains the declaration
 * @param name - Name of the nested function
 * @returns True when a returned object literal references the name
 */
function isFactoryMember(enclosing: ts.FunctionLikeDeclaration, name: string): boolean {
    let found = false;
    const visit = (node: ts.Node): void => {
        if (found) return;
        if (ts.isReturnStatement(node) && node.expression) {
            const value = unwrap(node.expression);
            if (ts.isObjectLiteralExpression(value)) {
                found = value.properties.some(
                    (property) =>
                        (ts.isShorthandPropertyAssignment(property) &&
                            property.name.text === name) ||
                        (ts.isPropertyAssignment(property) &&
                            ts.isIdentifier(property.initializer) &&
                            property.initializer.text === name),
                );
            }
        }
        ts.forEachChild(node, visit);
    };
    if (enclosing.body) visit(enclosing.body);
    return found;
}

/**
 * Checks the ASCII rule on a parsed file. User-facing data may hold non-ASCII text, and only
 * inside its string literals, which must not hold decorative glyphs either.
 *
 * @param source - Parsed file
 * @param content - Whether the file is under src/data/: catalogs, navigation or page content
 * @returns Findings without the file name
 */
function checkAscii(source: ts.SourceFile, content: boolean): Omit<Finding, "file">[] {
    const text = source.getFullText();
    const findings: Omit<Finding, "file">[] = [];
    if (!content) {
        for (const index of firstPerLine(text, NON_ASCII)) {
            findings.push({
                line: lineAt(text, index),
                rule: "ascii",
                message: "non-ASCII character",
            });
        }
        return findings;
    }
    const strings: [number, number][] = [];
    const visit = (node: ts.Node): void => {
        if (
            ts.isStringLiteral(node) ||
            ts.isNoSubstitutionTemplateLiteral(node) ||
            ts.isTemplateHead(node) ||
            ts.isTemplateMiddle(node) ||
            ts.isTemplateTail(node)
        ) {
            strings.push([node.getStart(source), node.getEnd()]);
            if (GLYPHS.test(node.text)) {
                findings.push({
                    line: lineOf(source, node.getStart(source)),
                    rule: "glyph",
                    message: "decorative character in content (use an inline icon token)",
                });
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
    for (const index of firstPerLine(text, NON_ASCII)) {
        if (!strings.some(([start, end]) => index >= start && index < end)) {
            findings.push({
                line: lineAt(text, index),
                rule: "ascii",
                message: "non-ASCII outside a string",
            });
        }
    }
    return findings;
}

/**
 * Applies the comment, JSDoc, nesting and ASCII rules of the charter to one TypeScript file.
 *
 * @param source - Parsed file, from the program when possible
 * @param checker - Type checker of that program, null for a file outside it
 * @param file - Path relative to the project root, used in findings and for the folder rules
 * @returns Every finding of the file
 */
export function inspectSource(
    source: ts.SourceFile,
    checker: ts.TypeChecker | null,
    file: string,
): Finding[] {
    const found: Omit<Finding, "file">[] = [...checkAscii(source, file.startsWith(TEXT_DIR))];
    if (GENERATED_FILE.test(file) || file.endsWith(".d.ts")) {
        return found.map((finding) => ({ file, ...finding }));
    }
    const text = source.getFullText();
    const lines = text.split("\n");
    const tsx = file.endsWith(".tsx");
    const add = (pos: number, rule: string, message: string): void => {
        found.push({ line: lineOf(source, pos), rule, message });
    };
    const blocks = collectBlocks(source);
    const pragmaAt = new Map(blocks.filter((b) => b.pragma).map((b) => [b.pos, b]));
    const inComment = (index: number): Block | undefined =>
        blocks.find((b) => index >= b.pos && index < b.end);
    const skipForward = (index: number): number => {
        let i = index;
        for (;;) {
            while (i < text.length && /\s/.test(text[i])) i++;
            const pragma = pragmaAt.get(i);
            if (!pragma) return i;
            i = pragma.end;
        }
    };
    const lastImport = source.statements.filter(ts.isImportDeclaration).pop();
    const docs = new Map<number, Block>();

    for (const block of blocks) {
        if (block.kind === "jsdoc" && block.startLine === block.endLine) {
            add(block.pos, "jsdoc-inline", "single-line JSDoc: write it on several lines");
        }
        found.push(...checkCommentText(block, lines));
        if (block.pragma) continue;
        const path = pathTo(source, block.pos);
        const inType = path.some(
            (n) =>
                ts.isInterfaceDeclaration(n) ||
                ts.isTypeAliasDeclaration(n) ||
                ts.isTypeLiteralNode(n),
        );
        const inFunction = path.some(
            (n) => hasBody(n) && n.body !== undefined && block.pos >= n.body.getFullStart(),
        );
        const inClass = path.some((n) => ts.isClassDeclaration(n) || ts.isClassExpression(n));
        const topLevel = path.every((n) => n.kind === ts.SyntaxKind.SyntaxList);
        if (inType) {
            add(block.pos, "type-comment", "no comment inside an interface or a type");
            continue;
        }
        if (tsx && !topLevel && !inClass) {
            add(
                block.pos,
                "tsx-comment",
                "no comment inside a body or an expression of a .tsx file",
            );
            continue;
        }
        if (inFunction && block.kind !== "line") {
            add(
                block.pos,
                "comment-nested-block",
                "a nested helper takes a // comment, not a block",
            );
        }
        if (block.trailing) {
            add(block.pos, "comment-trailing", "a comment goes on its own line above the code");
            continue;
        }

        let before = block.pos - 1;
        while (before >= 0 && /\s/.test(text[before])) before--;
        const previous = before >= 0 ? inComment(before) : undefined;
        const gapAbove = before < 0 ? 2 : block.startLine - lineAt(text, before);
        if (gapAbove < 2 && !OPENERS.has(text[before]) && !previous?.pragma) {
            add(block.pos, "comment-spacing", "leave a blank line above a comment");
        }
        const next = skipForward(block.end);
        if (next >= text.length) {
            add(block.pos, "comment-place", "comment at the end of the file describes nothing");
            continue;
        }
        if (inComment(next)) {
            add(block.pos, "comment-place", "two comments in a row: keep one");
            continue;
        }
        if (lineAt(text, next) - block.endLine !== 1 && !CLOSERS.has(text[next])) {
            add(block.pos, "comment-spacing", "glue the comment to the line it describes");
        }

        if (inFunction || inClass) continue;
        if (!topLevel) {
            add(block.pos, "comment-place", "comment inside a top-level expression");
            continue;
        }

        const statement = source.statements.find((s) => s.getStart(source) === next);
        if (!statement) continue;
        if (lastImport && statement.getStart(source) <= lastImport.getStart(source)) {
            add(block.pos, "header-comment", "no comment before or among the imports");
            continue;
        }
        const symbol = classify(statement, checker);
        const described = ["function", "callable", "data", "class"].includes(symbol.kind);
        const length = block.kind === "jsdoc" && described ? descriptionLines(block) : 0;
        if (length > MAX_DESCRIPTION_LINES) {
            add(
                block.pos,
                "jsdoc-long",
                `description is ${length} lines: one sentence and at most 2 lines of prose`,
            );
        }
        if (symbol.kind === "type") {
            add(block.pos, "type-comment", "an interface or a type carries no comment");
        } else if (symbol.kind === "function" || symbol.kind === "callable") {
            if (block.kind === "jsdoc") docs.set(statement.getStart(source), block);
            else add(block.pos, "jsdoc-form", `${symbol.name} needs a /** */ JSDoc block, not //`);
        } else if (symbol.kind === "data") {
            if (tsx && block.kind !== "line") {
                add(block.pos, "tsx-comment", "a data const of a .tsx file takes a // header");
            }
            if (block.kind === "line" && block.endLine > block.startLine) {
                add(
                    block.pos,
                    "comment-stack",
                    tsx
                        ? "a data const header is one // line"
                        : "a description of several lines is a /** */ block",
                );
            }
        } else if (symbol.kind !== "class") {
            add(block.pos, "comment-place", "comment on a statement that is not a symbol");
        }
    }

    for (const statement of source.statements) {
        const symbol = classify(statement, checker);
        if (symbol.kind !== "function" && symbol.kind !== "callable") continue;
        const block = docs.get(statement.getStart(source));
        if (!block) {
            add(statement.getStart(source), "jsdoc-missing", `${symbol.name} has no JSDoc block`);
            continue;
        }
        const component = tsx && /^[A-Z]/.test(symbol.name);
        found.push(...checkJsDoc(block, symbol, component, checker));
    }

    const visit = (node: ts.Node, enclosing: ts.FunctionLikeDeclaration | null): void => {
        if (ts.isFunctionDeclaration(node) && enclosing) {
            const name = node.name?.text ?? "";
            if (!isFactoryMember(enclosing, name)) {
                add(
                    node.getStart(source),
                    "nested-function",
                    `function ${name} is declared inside a function`,
                );
            }
        }
        const inner = hasBody(node) ? node : enclosing;
        ts.forEachChild(node, (child) => visit(child, inner));
    };
    visit(source, null);

    return found.map((finding) => ({ file, ...finding }));
}

/**
 * Parses a file that the program does not include, so that it is still inspected (without the
 * type checker).
 *
 * @param file - Path relative to the project root
 * @param text - File content
 * @returns The parsed file with parent links set
 */
function parseAlone(file: string, text: string): ts.SourceFile {
    const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
}

/**
 * Inspects one in-memory file with a throwaway program: the entry point of the tests.
 *
 * @param file - Path the rules see, for example "src/components/Header.tsx"
 * @param text - File content
 * @returns Every finding of the text rules and of the TypeScript rules
 */
export function inspectText(file: string, text: string): Finding[] {
    const findings = checkText(file, text);
    if (!TYPED_FILE.test(file)) return findings;
    const options: ts.CompilerOptions = {
        noLib: true,
        noEmit: true,
        strict: true,
        types: [],
        jsx: ts.JsxEmit.ReactJSX,
    };
    const host = ts.createCompilerHost(options);
    const read = host.getSourceFile;
    host.getSourceFile = (name, version, onError) =>
        name.endsWith(file) ? parseAlone(file, text) : read(name, version, onError);
    const program = ts.createProgram({ rootNames: [file], options, host });
    const source = program.getSourceFiles().find((s) => s.fileName.endsWith(file));
    if (!source) return [...findings, ...inspectSource(parseAlone(file, text), null, file)];
    return [...findings, ...inspectSource(source, program.getTypeChecker(), file)];
}

/**
 * Runs every rule over the project and prints one line per finding, then a summary.
 *
 * @param args - Command-line flags: --root <dir> checks another tree (read-only)
 * @returns Number of findings; the entry point exits with status 1 when it is not zero
 */
function main(args: string[]): number {
    const at = args.indexOf("--root");
    const root = at >= 0 && args[at + 1] ? args[at + 1] : cwd();
    const files = listFiles(root);
    const findings: Finding[] = [];
    for (const file of files) {
        const relevant =
            CODE_FILE.test(file) || STYLE_FILE.test(file) || /\.(?:html|json)$/.test(file);
        if (relevant) findings.push(...checkText(file, readFileSync(join(root, file), "utf-8")));
    }

    const program = createProgram(root);
    const checker = program.getTypeChecker();
    const typed = new Set(files.filter((file) => TYPED_FILE.test(file)));
    for (const source of program.getSourceFiles()) {
        const file = relative(root, source.fileName).split(sep).join("/");
        if (!typed.delete(file)) continue;
        findings.push(...inspectSource(source, checker, file));
    }

    // Typed files that tsconfig.json leaves out are still checked, without the type checker
    for (const file of typed) {
        const source = parseAlone(file, readFileSync(join(root, file), "utf-8"));
        findings.push(...inspectSource(source, null, file));
    }

    for (const f of findings) console.log(`${f.file}:${f.line} ${f.rule} ${f.message}`);
    const rules = new Map<string, number>();
    for (const f of findings) rules.set(f.rule, (rules.get(f.rule) ?? 0) + 1);
    const detail = [...rules].map(([rule, count]) => `${rule} ${count}`).join(", ");
    const tsCount = files.filter((file) => TYPED_FILE.test(file)).length;
    console.log(
        `charter: ${files.length} files, ${tsCount} TypeScript, ${findings.length} findings` +
            (detail ? ` (${detail})` : ""),
    );
    return findings.length;
}

if (argv[1] && import.meta.url === pathToFileURL(argv[1]).href) {
    exit(main(argv.slice(2)) > 0 ? 1 : 0);
}
