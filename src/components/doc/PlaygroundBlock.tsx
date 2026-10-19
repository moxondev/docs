import type { DocContext } from "@/components/doc/context";
import { Playground } from "@/components/try/Playground";
import { NAV } from "@/data/nav";
import { catalogueEntry, navTitle } from "@/lib/nav";
import { loadPages } from "@/lib/pages";
import type { PlaygroundEntry } from "@/types/try";

export interface PlaygroundBlockProps {
    ctx: DocContext;
}

/**
 * Mounts the Playground with every operation that can be called live in the version: one entry
 * per operation with try true, with the slug and the name of its page and its category.
 *
 * @param ctx - Context of the page: its version and language
 */
export async function PlaygroundBlock({ ctx }: PlaygroundBlockProps) {
    const pages = await loadPages(ctx.version);
    const entries: PlaygroundEntry[] = pages.flatMap((page) =>
        (page.operations ?? [])
            .filter((operation) => operation.try)
            .map((operation) => ({
                slug: page.id,
                name: navTitle(NAV, ctx.version, page.id, ctx.lang),
                category: catalogueEntry(page.id)?.category,
                op: operation,
            })),
    );

    return <Playground version={ctx.version} entries={entries} />;
}
