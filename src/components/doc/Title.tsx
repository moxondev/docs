import { Actions } from "@/components/doc/Actions";
import type { DocContext } from "@/components/doc/context";
import { Inline } from "@/components/doc/Inline";
import { Status } from "@/components/doc/Status";
import { NAV } from "@/data/nav";
import { hasPage, href } from "@/lib/routes";

export interface TitleProps {
    ctx: DocContext;
    hasTry: boolean;
}

/**
 * Title row of a documentation page: the h1, the status of the page as a marker with its word
 * beside it when it has one, and the actions on its right. The Playground action only appears
 * when the page has a live Try and the version has a Playground, and presets this endpoint.
 *
 * @param ctx - Context of the page: its title, id, version and language
 * @param hasTry - Whether the page has a live Try panel
 */
export function Title({ ctx, hasTry }: TitleProps) {
    const { lang, version, id, page } = ctx;
    const playground =
        hasTry && hasPage(NAV, version, "playground")
            ? `${href(lang, version, "playground")}?endpoint=${id}`
            : undefined;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                <h1 className="min-w-0 font-display text-[30px]/[1.1] font-semibold tracking-[-0.025em] text-ink desk:text-[36px]/[1.1]">
                    <Inline text={page.title} ctx={ctx} />
                </h1>
                {page.status ? <Status status={page.status} variant="mark" /> : null}
            </div>
            <Actions markdownUrl={`/md/${version}/${lang}/${id}.md`} playgroundHref={playground} />
        </div>
    );
}
