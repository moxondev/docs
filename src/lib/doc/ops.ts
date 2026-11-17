import type { Block, Lang, Operation, Page } from "@/types/content";

/**
 * Finds the operation that each block of a page belongs to: the one of the last endpoint,
 * examples or try block met in document order, the first operation of the page before any of
 * them. A parameters table thus inherits the operation of the Route bar above it.
 *
 * @param page - Page whose sections are walked in document order
 * @param lang - Language rendered; it picks the split branches and the one-language sections
 * @returns The operation per block, undefined for a page without operations
 */
export function blockOperations(page: Page, lang: Lang): Map<Block, Operation | undefined> {
    const out = new Map<Block, Operation | undefined>();
    const operations = page.operations ?? [];
    let current: Operation | undefined = operations[0];

    const walk = (blocks: readonly Block[]) => {
        for (const block of blocks) {
            if (block.type === "endpoint" || block.type === "examples" || block.type === "try") {
                current = operations.find((operation) => operation.id === block.op) ?? current;
            }
            out.set(block, current);
            if (block.type === "split") walk(block[lang]);
            else if (block.type === "details") walk(block.body);
        }
    };

    for (const section of page.sections) {
        if (section.only && section.only !== lang) continue;
        walk(section.blocks);
    }
    return out;
}
