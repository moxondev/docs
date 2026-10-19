import { useTranslations } from "next-intl";

import { type DocContext, NEW_TAB_ID } from "@/components/doc/context";
import { Inline } from "@/components/doc/Inline";
import { linkAttrs } from "@/lib/routes";

export interface ReleaseProps {
    ctx: DocContext;
}

const EM_DASH = String.fromCodePoint(0x2014);

/**
 * Release line of a changelog page: the API version as a link to its GitHub release, an em dash
 * and the summary.
 *
 * @param ctx - Context of the page, whose release data is printed; nothing without one
 */
export function Release({ ctx }: ReleaseProps) {
    const t = useTranslations("changelog");
    const { release } = ctx.page;
    if (!release) return null;

    return (
        <p className="text-[15px]/[1.65] text-text">
            <strong className="font-semibold text-ink">
                <a {...linkAttrs(release.url)} aria-describedby={NEW_TAB_ID} className="prose-link">
                    {t("apiVersion", { version: release.version })}
                </a>
            </strong>{" "}
            {EM_DASH} <Inline text={release.summary} ctx={ctx} />
        </p>
    );
}
