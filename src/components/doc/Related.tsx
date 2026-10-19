import Link from "next/link";

import type { DocContext } from "@/components/doc/context";
import { Inline } from "@/components/doc/Inline";
import { Method } from "@/components/doc/Method";
import { NAV } from "@/data/nav";
import { refTarget } from "@/lib/inline";
import { hasPage, href } from "@/lib/routes";
import type { Block } from "@/types/content";

export interface RelatedProps {
    block: Extract<Block, { type: "related" }>;
    ctx: DocContext;
}

/**
 * Related endpoints of a page: one row per link, with the method mark derived from the
 * operations of the target page, the route as the link text and a short description. An item
 * with an empty label shows the title of its target page.
 *
 * @param block - Related block: label, ref: target and description of each item
 * @param ctx - Context of the page: its language and version resolve the targets
 */
export function Related({ block, ctx }: RelatedProps) {
    return (
        <ul className="flex flex-col gap-2.5 text-[15px]/[1.6] text-text">
            {block.items.map((item) => {
                const ref = refTarget(`ref:${item.to}`);
                const version = ref?.version ?? ctx.version;
                const slug = ref?.slug ?? "";
                const page = slug !== "" && hasPage(NAV, version, slug) ? NAV[version][slug] : null;
                const label = item.label || page?.title[ctx.lang] || item.to;

                return (
                    <li key={item.to} className="flex flex-wrap items-baseline gap-x-2">
                        <Method methods={page?.methods ?? []} className="min-w-10" />
                        <span>
                            <Link
                                href={href(ctx.lang, version, slug, ref?.section)}
                                className={
                                    item.label ? "prose-link font-mono text-sm" : "prose-link"
                                }
                            >
                                {label}
                            </Link>
                            {" - "}
                            <Inline text={item.description} ctx={ctx} />
                        </span>
                    </li>
                );
            })}
        </ul>
    );
}
