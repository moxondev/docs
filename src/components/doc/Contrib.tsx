import { MessageSquareWarningIcon, SquarePenIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { type DocContext, NEW_TAB_ID } from "@/components/doc/context";
import { editUrl, issueUrl } from "@/components/doc/edit";
import { formatDate } from "@/lib/format";
import { linkAttrs } from "@/lib/routes";

export interface ContribProps {
    ctx: DocContext;
}

/**
 * Foot of a documentation page: the link that edits the page module on GitHub, the link that
 * reports an issue for this page, and, quiet, the date of the last update when the data has one.
 * The two links open GitHub in a new tab.
 *
 * @param ctx - Context of the page: the version, the page and the language of the date
 */
export function Contrib({ ctx }: ContribProps) {
    const t = useTranslations("endpoint");
    const links = [
        { Glyph: SquarePenIcon, label: t("contrib.edit"), url: editUrl(ctx.version, ctx.page) },
        {
            Glyph: MessageSquareWarningIcon,
            label: t("contrib.issue"),
            url: issueUrl(ctx.version, ctx.page),
        },
    ];

    return (
        <div className="flex flex-col gap-2 text-[13px]/5">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
                {links.map(({ Glyph, label, url }) => (
                    <a
                        key={url}
                        {...linkAttrs(url)}
                        aria-describedby={NEW_TAB_ID}
                        className="flex min-h-11 items-center gap-1.5 text-ink desk:min-h-0"
                    >
                        <Glyph aria-hidden="true" className="size-3.5 shrink-0" />
                        <span className="prose-link">{label}</span>
                    </a>
                ))}
            </div>
            {ctx.page.updated ? (
                <p className="text-faint">
                    {t("contrib.updated", { date: formatDate(ctx.page.updated, ctx.lang) })}
                </p>
            ) : null}
        </div>
    );
}
