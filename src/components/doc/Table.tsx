import type { DocContext } from "@/components/doc/context";
import { Inline } from "@/components/doc/Inline";
import { pick } from "@/lib/inline";
import type { Block } from "@/types/content";

export interface TableProps {
    block: Extract<Block, { type: "table" }>;
    ctx: DocContext;
}

/**
 * Generic data table of the documentation: a framed table whose header and cells are inline
 * text, scrolling sideways inside its frame on a narrow screen with a keyboard focusable region,
 * so a wide table never widens the page.
 *
 * @param block - Table block: its header, its rows, one string or one per language for each cell
 * @param ctx - Context of the page: the language picks every cell, the version resolves links
 */
export function Table({ block, ctx }: TableProps) {
    const head = pick(block.head, ctx.lang);
    const rows = block.rows.map((row) => row.map((cell) => pick(cell, ctx.lang)));

    return (
        <div
            tabIndex={0}
            className="overflow-x-auto rounded-table border border-line focus-visible:outline-offset-0"
        >
            <table className="w-full border-collapse text-left text-sm/[1.5]">
                <thead className="bg-soft text-[14px] font-medium text-ink">
                    <tr>
                        {head.map((cell, index) => (
                            <th
                                key={index}
                                scope="col"
                                className="border-b border-line-soft px-4 py-2.5 font-medium whitespace-nowrap"
                            >
                                <Inline text={cell} ctx={ctx} />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, at) => (
                        <tr key={at} className="border-b border-line-soft last:border-b-0">
                            {row.map((cell, index) => (
                                <td key={index} className="px-4 py-2.5 align-top text-text">
                                    <Inline text={cell} ctx={ctx} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
