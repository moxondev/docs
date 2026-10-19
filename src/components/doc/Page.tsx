import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";

import { Sentinel } from "@/components/chrome/Sentinel";
import { Sections } from "@/components/doc/Blocks";
import { docContext, NEW_TAB_ID } from "@/components/doc/context";
import { Contrib } from "@/components/doc/Contrib";
import { Crumbs } from "@/components/doc/Crumbs";
import { Inline } from "@/components/doc/Inline";
import { Pager } from "@/components/doc/Pager";
import { Scope } from "@/components/doc/Scope";
import { Title } from "@/components/doc/Title";
import { Toc } from "@/components/doc/Toc";
import { CONTENT_ID } from "@/components/Shell";
import { Bar } from "@/components/try/Bar";
import { Sheet } from "@/components/try/Sheet";
import { Try } from "@/components/try/Try";
import { NAV } from "@/data/nav";
import { tryOperation } from "@/lib/anchors";
import { navTitle, slimMeta, tocEntries } from "@/lib/nav";
import { type DocParams, resolveDoc } from "@/lib/pages";
import { cn } from "@/lib/utils";
import type { Lang } from "@/types/content";

export interface DocPageProps {
    lang: Lang;
    params: Promise<DocParams>;
}

/**
 * Hidden sentence that every external link of the page names as its description, so that a screen
 * reader says the link opens a new tab. It sits beside the main landmark, out of its text.
 */
function NewTab() {
    const aria = useTranslations("aria");

    return (
        <p id={NEW_TAB_ID} hidden>
            {aria("newTab")}
        </p>
    );
}

/**
 * Documentation page: the crumbs, the title with its actions, the lead, the "On this page" list,
 * the sections of the page module, then the pager and the foot links. An endpoint with a live
 * operation adds the Try column, which a phone replaces by the bar and the sheet.
 *
 * @param lang - Language of the route tree, which picks every value of the page
 * @param params - Route params of Next, resolved to the version and the page id
 */
export async function DocPage({ lang, params }: DocPageProps) {
    const doc = await resolveDoc(params);
    if (!doc) notFound();
    const { version, id, page } = doc;
    const ctx = docContext(page, version, id, lang);
    const meta = slimMeta(NAV, version, id, page, lang);
    const operation = tryOperation(page);
    const entries = tocEntries(page, lang);
    const [preamble, ...rest] = page.sections;
    const intro = preamble && preamble.id === "" ? [preamble] : [];
    const body = intro.length > 0 ? rest : page.sections;
    const needsTry =
        operation !== undefined ||
        [...ctx.operations.keys()].some(
            (block) => block.type === "examples" || block.type === "try",
        );
    const wide = page.kind === "playground";

    const content = (
        <>
            <div className={cn(operation && "wide:col-start-1")}>
                <Crumbs ctx={ctx} />
                <div className="mt-4">
                    <Title ctx={ctx} hasTry={operation !== undefined} />
                </div>
                {page.lead ? (
                    <p className="mt-4.5 text-base/[1.7] text-text">
                        <Inline text={page.lead} ctx={ctx} />
                    </p>
                ) : null}
                <Sections sections={intro} ctx={ctx} />
            </div>
            {operation ? (
                <div
                    id="try"
                    className="mt-6 scroll-mt-17 max-desk:hidden wide:col-start-2 wide:row-span-2 wide:row-start-1 wide:mt-0"
                >
                    <Try version={version} op={operation} />
                </div>
            ) : null}
            <div className="min-w-0 wide:col-start-1">
                {entries.length > 1 ? (
                    <div className="mt-6">
                        <Toc entries={entries} />
                    </div>
                ) : null}
                <Sections sections={body} ctx={ctx} />
                <div className="mt-12 flex flex-col gap-6">
                    <Pager ctx={ctx} />
                    <Contrib ctx={ctx} />
                </div>
            </div>
        </>
    );

    return (
        <>
            <main
                id={CONTENT_ID}
                tabIndex={-1}
                className={cn(
                    "mx-auto grid w-full min-w-0 grid-cols-[minmax(0,1fr)] content-start px-5 pt-6 pb-20 desk:px-12 desk:pt-9",
                    operation
                        ? "max-w-319 max-desk:pb-28 wide:grid-cols-[minmax(0,1fr)_25rem] wide:gap-x-6 wide:pr-6"
                        : wide
                          ? "max-w-300"
                          : "max-w-205",
                )}
            >
                {needsTry ? (
                    <Scope lang={lang} tree="try">
                        {content}
                        {operation ? (
                            <>
                                <Bar op={operation} />
                                <Sheet
                                    version={version}
                                    op={operation}
                                    name={navTitle(NAV, version, id, lang)}
                                />
                            </>
                        ) : null}
                    </Scope>
                ) : (
                    content
                )}
                {meta ? <Sentinel meta={meta} /> : null}
            </main>
            <NewTab />
        </>
    );
}
