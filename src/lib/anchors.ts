import type { Block, Lang, Operation, Page } from "@/types/content";

export interface PageAnchors {
    sections: string[];
    rows: Map<Block, string[]>;
    ids: string[];
}

// Fragment of the Try panel, the target of the ids of the removed Try headings in both languages
export const TRY_ANCHOR = "try";

// Legacy ids of the removed Try headings, both languages
export const TRY_ALIASES: readonly string[] = ["try-it", "essayer"];

/**
 * Turns a parameter or field name into the slug part of a row anchor: every run of characters
 * other than letters, digits, "_" and "-" becomes one "-", so "games[].moves" gives "games-moves".
 *
 * @param name - Name as written in the table, case kept
 * @returns The slug, empty when the name holds no ASCII letter, digit or underscore
 */
export function anchorSlug(name: string): string {
    return name.replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
}

/**
 * Builds the anchor of a parameter row.
 *
 * @param name - Parameter name as written in the table
 * @param op - Operation id, given only on pages with two operations
 * @returns "p-<name>", or "<op>-p-<name>"
 */
export function paramId(name: string, op?: string): string {
    return `${op ? `${op}-` : ""}p-${anchorSlug(name) || "row"}`;
}

/**
 * Builds the anchor of a response field row.
 *
 * @param name - Field name, dots and brackets allowed
 * @param op - Operation id, given only on pages with two operations
 * @returns "f-<slug>", or "<op>-f-<slug>"
 */
export function fieldId(name: string, op?: string): string {
    return `${op ? `${op}-` : ""}f-${anchorSlug(name) || "row"}`;
}

/**
 * Builds the anchor of an error row.
 *
 * @param n - Position of the row among the error rows of the page (or of its operation), from 1
 * @param op - Operation id, given only on pages with two operations
 * @returns "e-<n>", or "<op>-e-<n>"
 */
export function errorId(n: number, op?: string): string {
    return `${op ? `${op}-` : ""}e-${n}`;
}

/**
 * Finds the operation of the Try panel of a page: the first Try block that is not an inline
 * auto-send example, when its operation can be called live.
 *
 * @param page - Page whose Try blocks and operations are read
 * @returns The operation, or undefined when the page has no live Try panel
 */
export function tryOperation(page: Page): Operation | undefined {
    const panel = blocksOf(page).find((block) => block.type === "try" && !block.autoSend);
    if (panel?.type !== "try") return undefined;
    const operation = page.operations?.find((candidate) => candidate.id === panel.op);
    return operation?.try ? operation : undefined;
}

/**
 * Lists every block of a page in document order, both branches of a split and the bodies of
 * details blocks included.
 *
 * @param page - Page whose sections are walked
 * @returns The blocks, depth first
 */
function blocksOf(page: Page): Block[] {
    const out: Block[] = [];
    const walk = (list: readonly Block[]) => {
        for (const block of list) {
            out.push(block);
            if (block.type === "split") {
                walk(block.en);
                walk(block.fr);
            } else if (block.type === "details") walk(block.body);
        }
    };
    for (const section of page.sections) walk(section.blocks);
    return out;
}

/**
 * Derives every fragment id of a page in one language: the section ids, the Try anchor and one id
 * per parameter, response field and error row, unique in the page. The renderer, the search
 * index, the anchor flash and the link check all read them from here.
 *
 * @param page - Page whose sections, operations and table blocks give the ids
 * @param lang - Language rendered; it picks the split branches and the one-language sections
 * @returns Section ids, row ids per table block (same order as its rows), and every id in
 * document order with the Try anchor last
 */
export function pageAnchors(page: Page, lang: Lang): PageAnchors {
    const sections = page.sections
        .filter((section) => section.id !== "" && (!section.only || section.only === lang))
        .map((section) => section.id);
    const panel = tryOperation(page) !== undefined;
    const used = new Set<string>(panel ? [...sections, TRY_ANCHOR] : sections);
    const ids: string[] = [];
    const rows = new Map<Block, string[]>();
    const multi = (page.operations?.length ?? 0) > 1;
    const errors = new Map<string, number>();
    let op: string | undefined;

    // A repeated name (two field tables listing "name") gets "-2", "-3"
    const take = (id: string): string => {
        let out = id;
        for (let n = 2; used.has(out); n += 1) out = `${id}-${n}`;
        used.add(out);
        ids.push(out);
        return out;
    };

    const walk = (list: readonly Block[]) => {
        for (const block of list) {
            const prefix = multi ? op : undefined;
            switch (block.type) {
                case "endpoint":
                case "examples":
                case "try":
                    op = block.op;
                    break;
                case "params":
                    rows.set(
                        block,
                        block.rows.map((row) => take(paramId(row.name, prefix))),
                    );
                    break;
                case "fields":
                    rows.set(
                        block,
                        block.rows.map((row) => take(fieldId(row.name, prefix))),
                    );
                    break;
                case "errors":
                    rows.set(
                        block,
                        block.rows.map(() => {
                            const n = (errors.get(prefix ?? "") ?? 0) + 1;
                            errors.set(prefix ?? "", n);
                            return take(errorId(n, prefix));
                        }),
                    );
                    break;
                case "split":
                    walk(block[lang]);
                    break;
                case "details":
                    walk(block.body);
                    break;
            }
        }
    };

    for (const section of page.sections) {
        if (section.only && section.only !== lang) continue;
        if (section.id) ids.push(section.id);
        walk(section.blocks);
    }
    if (panel) ids.push(TRY_ANCHOR);
    return { sections, rows, ids };
}

/**
 * Maps the legacy fragment ids of a page to its current ids: the French and English slugs kept
 * as section aliases, and the ids of the removed Try headings when the page has a Try panel.
 * The redirect pages remap location.hash with it.
 *
 * @param page - Page whose section aliases and Try panel are read
 * @param lang - Language of the page; a section that exists only in the other one is skipped
 * @returns Legacy id to current id, without the identity entries
 */
export function aliasMap(page: Page, lang: Lang): Record<string, string> {
    const out: Record<string, string> = {};
    for (const section of page.sections) {
        if (section.only && section.only !== lang) continue;
        for (const alias of section.aliases ?? []) {
            if (alias !== section.id) out[alias] = section.id;
        }
    }
    if (tryOperation(page)) for (const alias of TRY_ALIASES) out[alias] = TRY_ANCHOR;
    return out;
}
