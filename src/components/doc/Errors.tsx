import type { DocContext } from "@/components/doc/context";
import { Inline } from "@/components/doc/Inline";
import type { ErrorsTable } from "@/types/content";

export interface ErrorsProps {
    block: ErrorsTable;
    ids: readonly string[];
    ctx: DocContext;
}

export interface MessageProps {
    text: string;
}

// A message that ends with a parenthesized part, the query hint kept in one piece
const HINT = /^(.*\S)\s+(\([^()]*\))$/;

/**
 * Prints an error message in mono, keeping its trailing query hint "(?text={text})" in one
 * piece so that it wraps as a whole under the message.
 *
 * @param text - Message as the API returns it, printed verbatim
 */
function Message({ text }: MessageProps) {
    const match = HINT.exec(text);

    return (
        <code className="min-w-0 flex-[1_1_17.5rem] font-mono text-[13px] text-ink">
            {match ? (
                <>
                    {match[1]} <span className="whitespace-nowrap">{match[2]}</span>
                </>
            ) : (
                text
            )}
        </code>
    );
}

/**
 * Error list of an endpoint page: a framed list with one row per error, the HTTP status chip when
 * the data has it, the message in mono, and the cause in muted text pushed to the right. Rows
 * carry the derived e-n ids that the search results and the flash aim at.
 *
 * @param block - Errors table, its rows in order
 * @param ids - Derived row anchors of the block, in row order
 * @param ctx - Context of the page, for the language and the links of the causes
 */
export function Errors({ block, ids, ctx }: ErrorsProps) {
    return (
        <ul className="overflow-hidden rounded-table border border-line">
            {block.rows.map((row, index) => (
                <li
                    key={ids[index]}
                    id={ids[index]}
                    className="flex scroll-mt-17 flex-wrap items-center gap-x-3.5 gap-y-1.5 border-b border-line-soft px-4 py-3 text-sm last:border-b-0"
                >
                    {row.status === undefined ? null : (
                        <span className="rounded-chip bg-status-bg px-1.5 py-0.5 font-mono text-xs font-semibold text-status">
                            {row.status}
                        </span>
                    )}
                    <Message text={row.message} />
                    <span className="ml-auto text-right text-muted">
                        <Inline text={row.description} ctx={ctx} />
                    </span>
                </li>
            ))}
        </ul>
    );
}
