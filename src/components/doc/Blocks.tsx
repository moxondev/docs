import { pick, plain } from "@/lib/inline";
import type { Block, Lang } from "@/types/content";

export interface BlocksProps {
    blocks: readonly Block[];
    lang: Lang;
}

/**
 * Lists the plain text lines of one block, in the language: prose, list items, code, table rows,
 * parameter, field and error rows and related links. Blocks that have no text of their own (the
 * Route bar, the code samples, the Try panel, the plans, the Playground) give no line.
 *
 * @param block - Block of a section
 * @param lang - Language whose values are read
 * @returns The lines in reading order, empty for a block without text
 */
function blockLines(block: Block, lang: Lang): string[] {
    switch (block.type) {
        case "p":
        case "label":
        case "quote":
            return [plain(pick(block.text, lang))];
        case "list":
            return block.items.map((item) => plain(pick(item, lang)));
        case "callout": {
            const parts = pick(block.body, lang).flatMap((part) =>
                part.type === "p" ? [plain(part.text)] : part.items.map((item) => plain(item)),
            );
            return [plain(pick(block.title, lang)), ...parts];
        }
        case "details":
            return [
                plain(pick(block.title, lang)),
                ...block.body.flatMap((inner) => blockLines(inner, lang)),
            ];
        case "values":
            return [
                plain(pick(block.title, lang)),
                ...block.groups.map(
                    (group) => `${plain(pick(group.label, lang))}: ${group.items.join(", ")}`,
                ),
            ];
        case "code":
            return [pick(block.text, lang)];
        case "table": {
            const head = pick(block.head, lang);
            const rows = block.rows.map((row) => row.map((cell) => pick(cell, lang)));
            return [head, ...rows].map((cells) => cells.map((cell) => plain(cell)).join(" | "));
        }
        case "params":
            return block.rows.map((row) => `${row.name}: ${plain(pick(row.description, lang))}`);
        case "fields":
            return block.rows.map((row) => `${row.name}: ${plain(pick(row.description, lang))}`);
        case "errors":
            return block.rows.map((row) => `${row.message}: ${plain(pick(row.description, lang))}`);
        case "related":
            return block.items.map(
                (item) => `${item.label}: ${plain(pick(item.description, lang))}`,
            );
        case "split":
            return block[lang].flatMap((inner) => blockLines(inner, lang));
        default:
            return [];
    }
}

/**
 * Temporary body of a documentation section: every block of the section as lines of plain text,
 * so that a real page of the data can be read, scrolled and compared in the browser before the
 * block components exist.
 *
 * @param blocks - Blocks of the section, in order
 * @param lang - Language whose values are printed
 */
export function Blocks({ blocks, lang }: BlocksProps) {
    return (
        <>
            {blocks.flatMap((block, index) =>
                blockLines(block, lang).map((line, at) => (
                    <p key={`${index}-${at}`} className="mt-3 text-[15px]/[1.65] text-text">
                        {line}
                    </p>
                )),
            )}
        </>
    );
}
