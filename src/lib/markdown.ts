import { PLANS } from "@/data/plans";
import { formatApprox, formatCount, formatPrice } from "@/lib/format";
import { type InlineNode, parseInline, pick, plain, refTarget } from "@/lib/inline";
import { buildUrl, exampleRequest } from "@/lib/request";
import { absoluteUrl, href, resolveRef } from "@/lib/routes";
import { generateSnippet } from "@/lib/snippets";
import type {
    Block,
    CalloutKind,
    CalloutPart,
    Inline,
    Lang,
    Lx,
    Operation,
    Page,
    ParamsTable,
    RelatedItem,
} from "@/types/content";
import type { Nav } from "@/types/nav";

export interface MarkdownLabels {
    parameter: string;
    required: string;
    default: string;
    description: string;
    field: string;
    type: string;
    errorMessage: string;
    error: string;
    status: string;
    yes: string;
    no: string;
    conditional: string;
    plan: string;
    price: string;
    hour: string;
    day: string;
    week: string;
    month: string;
    burst: string;
    free: string;
    perMonth: string;
    arrow: string;
}

export interface MarkdownContext {
    labels: MarkdownLabels;
    nav?: Nav;
}

interface Writer {
    page: Page;
    lang: Lang;
    ctx: MarkdownContext;
}

// GitHub alert type of each callout kind; readers without alerts show a plain blockquote
const ALERTS: Readonly<Record<CalloutKind, string>> = {
    info: "NOTE",
    tip: "TIP",
    warning: "WARNING",
    danger: "CAUTION",
};

// Separator of the release line
const EM_DASH = String.fromCodePoint(0x2014);

/**
 * Escapes the characters that Markdown would read as syntax inside running text: backslash,
 * backtick, star, brackets, "<", "~", an entity-like "&", and "_" at a word boundary (inside a
 * word such as snake_case it is literal and stays readable).
 *
 * @param text - Literal text of a text node
 * @returns The text, each syntax character preceded by a backslash
 */
function escapeText(text: string): string {
    return text
        .replace(/[\\`*[\]<~]/g, "\\$&")
        .replace(/(^|[^A-Za-z0-9])_|_(?=[^A-Za-z0-9]|$)/g, (match) => match.replace("_", "\\_"))
        .replace(/&(?=#?\w+;)/g, "\\&");
}

/**
 * Escapes text for an HTML element of the export (the summary of a details block).
 *
 * @param text - Plain text, markup already removed
 * @returns The text with "&", "<" and ">" as entities
 */
function escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Writes a code span whose fence is longer than any backtick run of the code, padded with spaces
 * when the code starts or ends with a backtick or a space (CommonMark strips one of each).
 *
 * @param value - Code, verbatim
 * @returns The code span, backtick fences included
 */
function codeSpan(value: string): string {
    const longest = Math.max(0, ...[...value.matchAll(/`+/g)].map((match) => match[0].length));
    const fence = "`".repeat(longest + 1);
    const pad = /^[`\s]|[`\s]$/.test(value) ? " " : "";
    return `${fence}${pad}${value}${pad}${fence}`;
}

/**
 * Resolves a link target of the content to an absolute URL, so the export works wherever it is
 * pasted.
 *
 * @param w - Writer state: page, language and version give the base of ref: and # targets
 * @param target - Link target of the inline grammar: ref:, a "#" fragment, a web or mailto URL
 * @returns The URL, wrapped in angle brackets when it holds a space or a parenthesis
 */
function linkUrl(w: Writer, target: string): string {
    const ctx = { lang: w.lang, version: w.page.version };
    const url = target.startsWith("#")
        ? absoluteUrl(href(w.lang, w.page.version, w.page.id, target.slice(1)))
        : target.startsWith("ref:")
          ? absoluteUrl(resolveRef(target, ctx))
          : target;
    return /[\s()]/.test(url) ? `<${url}>` : url;
}

/**
 * Prints an inline tree as Markdown.
 *
 * @param w - Writer state, for links and the icon word
 * @param nodes - Parsed inline markup
 * @returns The Markdown of the nodes, text escaped and links resolved to absolute URLs
 */
function inlineNodes(w: Writer, nodes: readonly InlineNode[]): string {
    return nodes
        .map((node) => {
            switch (node.type) {
                case "text":
                    return escapeText(node.value);
                case "code":
                    return codeSpan(node.value);
                case "strong":
                    return `**${inlineNodes(w, node.children)}**`;
                case "em":
                    return `*${inlineNodes(w, node.children)}*`;
                case "link":
                    return `[${inlineNodes(w, node.children)}](${linkUrl(w, node.target)})`;
                case "icon":
                    return escapeText(w.ctx.labels.arrow);
            }
        })
        .join("");
}

/**
 * Prints a leaf of inline markup in the language of the export.
 *
 * @param w - Writer state: page, language, labels and navigation index
 * @param value - Leaf, written once or per language
 * @returns The Markdown of the leaf, in the language of the writer
 */
function inline(w: Writer, value: Lx<Inline>): string {
    return inlineNodes(w, parseInline(pick(value, w.lang)));
}

/**
 * Escapes the start of a block line that Markdown would read as a heading, a quote, a list item
 * or a setext underline.
 *
 * @param text - Markdown text of a paragraph or a list item
 * @returns The text, its first marker escaped when needed
 */
function lineStart(text: string): string {
    if (/^(#{1,6}(\s|$)|>|[-+](\s|$)|=+\s*$)/.test(text)) return `\\${text}`;
    return text.replace(/^(\d+)([.)])(\s|$)/, "$1\\$2$3");
}

/**
 * Prints a table cell: a "|" is escaped everywhere, code spans included, as GFM tables require.
 *
 * @param text - Markdown text of the cell
 * @returns The cell text, safe between two pipes
 */
function cell(text: string): string {
    return text.replace(/\|/g, "\\|");
}

/**
 * Prints a details element: the summary as escaped plain text (HTML holds no Markdown), then the
 * body between blank lines, so that GitHub renders it as Markdown.
 *
 * @param w - Writer state, for the language of the title
 * @param title - Title of the details or values block
 * @param body - Markdown of the content
 * @returns The details element as text: summary escaped as HTML, body between blank lines
 */
function details(w: Writer, title: Lx<Inline>, body: string): string {
    const summary = escapeHtml(plain(pick(title, w.lang), { "arrow-right": w.ctx.labels.arrow }));
    return `<details>\n<summary>${summary}</summary>\n\n${body}\n\n</details>`;
}

/**
 * Prints a GFM table.
 *
 * @param head - Header cells, already Markdown
 * @param rows - Body rows, already Markdown; short rows are padded with empty cells
 * @returns The table lines joined by newlines
 */
function table(head: readonly string[], rows: readonly string[][]): string {
    const line = (cells: readonly string[]) =>
        `| ${head.map((_, i) => cell(cells[i] ?? "")).join(" | ")} |`;
    return [line(head), `| ${head.map(() => "---").join(" | ")} |`, ...rows.map(line)].join("\n");
}

/**
 * Prints a fenced code block whose fence is longer than any backtick fence inside the code,
 * including a fence indented by up to three spaces, which CommonMark still reads as a closer.
 *
 * @param lang - Info string; empty for a block without language
 * @param text - Code, verbatim
 * @returns The opening fence, the code and the closing fence, each on its own line
 */
function fence(lang: string, text: string): string {
    const runs = [...text.matchAll(/^ {0,3}(`{3,})/gm)].map((match) => match[1].length);
    const longest = Math.max(0, ...runs);
    const marks = "`".repeat(Math.max(3, longest + 1));
    return `${marks}${lang}\n${text}\n${marks}`;
}

/**
 * Finds an operation of the page by id.
 *
 * @param w - Writer state, whose page holds the operations
 * @param id - Operation id of an endpoint or examples block
 * @returns The operation, or undefined for a dangling id
 */
function operation(w: Writer, id: string): Operation | undefined {
    return w.page.operations?.find((op) => op.id === id);
}

/**
 * Prints the parameters table: a Default column when a row has a default, placed after the
 * description when the block asks for it.
 *
 * @param w - Writer state, whose labels give the headers and the Required words
 * @param block - Parameters table of the page
 * @returns The GFM table, header row included, lines joined by newlines
 */
function paramsTable(w: Writer, block: ParamsTable): string {
    const { labels } = w.ctx;
    const withDefault = block.rows.some((row) => row.default !== undefined);
    const after = block.columns === "default-after-description";
    const head = [labels.parameter, labels.required];
    if (withDefault && !after) head.push(labels.default);
    head.push(labels.description);
    if (withDefault && after) head.push(labels.default);
    const rows = block.rows.map((row) => {
        const required =
            row.required === "conditional"
                ? labels.conditional
                : row.required
                  ? labels.yes
                  : labels.no;
        const fallback = row.default === undefined ? "" : inline(w, row.default);
        const cells = [codeSpan(row.name), required];
        if (withDefault && !after) cells.push(fallback);
        cells.push(inline(w, row.description));
        if (withDefault && after) cells.push(fallback);
        return cells;
    });
    return table(head, rows);
}

/**
 * Prints one item of a Related list: the method of the target page, the link (the label, or the
 * title of the target page when the label is empty) and the description.
 *
 * @param w - Writer state; its navigation index gives the target title and methods
 * @param item - Related item: label (empty for the target title), target and description
 * @returns The list item text, without the "- " marker
 */
function relatedItem(w: Writer, item: RelatedItem): string {
    const ref = refTarget(`ref:${item.to}`);
    const target = ref ? w.ctx.nav?.[ref.version ?? w.page.version]?.[ref.slug] : undefined;
    const label = item.label || target?.title[w.lang] || item.to;
    const methods = target?.methods.map((method) => method.toUpperCase()).join(" ");
    const link = `[${escapeText(label)}](${linkUrl(w, `ref:${item.to}`)})`;
    return `${methods ? `${methods} ` : ""}${link} - ${inline(w, item.description)}`;
}

/**
 * Prints the parts of a callout body inside a blockquote.
 *
 * @param w - Writer state: page, language, labels and navigation index
 * @param parts - Paragraphs and lists of the callout, in the language of the export
 * @returns The lines after the alert header, each starting with ">"
 */
function calloutBody(w: Writer, parts: readonly CalloutPart[]): string[] {
    const lines: string[] = [];
    for (const part of parts) {
        lines.push(">");
        if (part.type === "p") lines.push(`> ${lineStart(inlineNodes(w, parseInline(part.text)))}`);
        else for (const item of part.items) lines.push(`> - ${lineStart(inline(w, item))}`);
    }
    return lines;
}

/**
 * Prints one block as Markdown. Interactive blocks (Try panel, Playground) have no Markdown form
 * and print nothing; a Code Examples block prints its cURL sample.
 *
 * @param w - Writer state: page, language, labels and navigation index
 * @param block - Block of the content model, of any type
 * @returns The Markdown of the block, an empty string when it prints nothing
 */
function blockMarkdown(w: Writer, block: Block): string {
    const { labels } = w.ctx;
    switch (block.type) {
        case "p":
            return lineStart(inline(w, block.text));
        case "label":
            return `**${inline(w, block.text)}**`;
        case "list":
            return block.items
                .map(
                    (item, i) =>
                        `${block.ordered ? `${i + 1}.` : "-"} ${lineStart(inline(w, item))}`,
                )
                .join("\n");
        case "quote":
            return `> ${lineStart(inline(w, block.text))}`;
        case "rule":
            return "---";
        case "callout": {
            const title = inline(w, block.title);
            const head = [`> [!${ALERTS[block.kind]}]`, ...(title ? [`> **${title}**`] : [])];
            return [...head, ...calloutBody(w, pick(block.body, w.lang))].join("\n");
        }
        case "details":
            return details(w, block.title, blocksMarkdown(w, block.body));
        case "values": {
            const groups = block.groups.map((group) => {
                const items = group.items.map((item) => `- ${codeSpan(item)}`).join("\n");
                return `**${inline(w, group.label)}**\n\n${items}`;
            });
            return details(w, block.title, groups.join("\n\n"));
        }
        case "code":
            return fence(block.lang ?? "", pick(block.text, w.lang));
        case "table":
            return table(
                pick(block.head, w.lang).map((head) => inline(w, head)),
                block.rows.map((row) => row.map((value) => inline(w, value))),
            );
        case "params":
            return paramsTable(w, block);
        case "fields":
            return table(
                [labels.field, labels.type, labels.description],
                block.rows.map((row) => [
                    codeSpan(row.name),
                    inline(w, row.type),
                    inline(w, row.description),
                ]),
            );
        case "errors": {
            const status = block.rows.some((row) => row.status !== undefined);
            const head = [block.short ? labels.error : labels.errorMessage, labels.description];
            return table(
                status ? [...head, labels.status] : head,
                block.rows.map((row) => {
                    const cells = [codeSpan(row.message), inline(w, row.description)];
                    return status
                        ? [...cells, row.status === undefined ? "" : String(row.status)]
                        : cells;
                }),
            );
        }
        case "endpoint": {
            const op = operation(w, block.op);
            const url = op ? buildUrl(w.page.version, op, {}) : "";
            return op ? codeSpan(`${op.method.toUpperCase()} ${url}`) : "";
        }
        case "examples": {
            const op = operation(w, block.op);
            const req = op ? exampleRequest(w.page.version, op, block, w.lang) : undefined;
            return req ? fence("bash", generateSnippet("curl", req)) : "";
        }
        case "try":
        case "playground":
            return "";
        case "related":
            return block.items.map((item) => `- ${relatedItem(w, item)}`).join("\n");
        case "plans":
            return table(
                [
                    labels.plan,
                    labels.price,
                    labels.hour,
                    labels.day,
                    labels.week,
                    labels.month,
                    labels.burst,
                    "",
                ],
                PLANS.map((plan) => [
                    escapeText(plan.name[w.lang]),
                    plan.price
                        ? `${formatPrice(plan.price.amount, w.lang)}${labels.perMonth}`
                        : labels.free,
                    formatCount(plan.hour, w.lang),
                    formatCount(plan.day, w.lang),
                    formatCount(plan.week, w.lang),
                    formatApprox(plan.month),
                    formatCount(plan.burst, w.lang),
                    `[${escapeText(plan.cta.label[w.lang])}](${plan.cta.href})`,
                ]),
            );
        case "split":
            return blocksMarkdown(w, block[w.lang]);
    }
}

/**
 * Prints a list of blocks separated by blank lines, skipping the blocks that print nothing.
 *
 * @param w - Writer state: page, language, labels and navigation index
 * @param list - Blocks in document order
 * @returns The Markdown of the blocks, a blank line between two of them
 */
function blocksMarkdown(w: Writer, list: readonly Block[]): string {
    return list
        .map((block) => blockMarkdown(w, block))
        .filter(Boolean)
        .join("\n\n");
}

/**
 * Serializes a documentation page to Markdown for the "Copy as Markdown" button and the
 * public/md exports, with absolute links and the cURL sample of each Code Examples block.
 *
 * @param page - Page to export: title, lead, release line and sections
 * @param lang - Language of the export; split branches and one-language sections follow it
 * @param ctx - Column headers and words of the language (from messages), and the navigation index
 * for the titles and methods of Related targets
 * @returns The Markdown text, ending with one newline
 */
export function pageMarkdown(page: Page, lang: Lang, ctx: MarkdownContext): string {
    const w: Writer = { page, lang, ctx };
    const parts = [`# ${inline(w, page.title)}`];
    if (page.lead !== undefined) parts.push(lineStart(inline(w, page.lead)));
    for (const section of page.sections) {
        if (section.only && section.only !== lang) continue;
        if (section.level && section.title) {
            parts.push(`${"#".repeat(section.level)} ${inline(w, section.title)}`);
        }
        if (page.release && section.id === "api" && section.level === 2) {
            const { version, url, summary } = page.release;
            parts.push(`**[API v${version}](${url})** ${EM_DASH} ${inline(w, summary)}`);
        }
        const body = blocksMarkdown(w, section.blocks);
        if (body) parts.push(body);
    }
    return `${parts.join("\n\n")}\n`;
}
