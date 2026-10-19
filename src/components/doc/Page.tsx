import { notFound } from "next/navigation";

import { Sentinel } from "@/components/chrome/Sentinel";
import { Blocks } from "@/components/doc/Blocks";
import { CONTENT_ID } from "@/components/Shell";
import { NAV } from "@/data/nav";
import { pick, plain } from "@/lib/inline";
import { slimMeta } from "@/lib/nav";
import { type DocParams, resolveDoc } from "@/lib/pages";
import type { Lang } from "@/types/content";

export interface DocPageProps {
    lang: Lang;
    params: Promise<DocParams>;
}

/**
 * Temporary documentation page: the title, the lead and every section of the page module as
 * plain text, in the main landmark, with the Sentinel of the endpoint pages that have a live Try
 * operation, which the slim headers need. An unknown route is a 404.
 *
 * @param lang - Language of the route tree, which picks every value of the page
 * @param params - Route params of Next, resolved to the version and the page id
 */
export async function DocPage({ lang, params }: DocPageProps) {
    const doc = await resolveDoc(params);
    if (!doc) notFound();
    const { version, id, page } = doc;
    const meta = slimMeta(NAV, version, id, page, lang);

    return (
        <main
            id={CONTENT_ID}
            tabIndex={-1}
            className="mx-auto max-w-205 px-6 pt-9 pb-18 desk:px-12"
        >
            <h1 className="text-[36px]/[1.1] font-semibold tracking-[-0.025em] text-ink">
                {plain(pick(page.title, lang))}
            </h1>
            {page.lead ? (
                <p className="mt-4.5 text-base/[1.65] text-text">{plain(pick(page.lead, lang))}</p>
            ) : null}
            {page.sections
                .filter((section) => !section.only || section.only === lang)
                .map((section, index) => (
                    <section key={`${section.id}-${index}`} className="mt-10">
                        {section.title ? (
                            <h2 id={section.id} className="text-xl font-semibold text-ink">
                                {plain(pick(section.title, lang))}
                            </h2>
                        ) : null}
                        <Blocks blocks={section.blocks} lang={lang} />
                    </section>
                ))}
            {meta ? <Sentinel meta={meta} /> : null}
        </main>
    );
}
