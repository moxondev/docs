import Link from "next/link";
import { useTranslations } from "next-intl";

import type { DocContext } from "@/components/doc/context";
import { NAV } from "@/data/nav";
import { type NavLink, pager } from "@/lib/nav";
import { cn } from "@/lib/utils";

export interface PagerProps {
    ctx: DocContext;
}

export interface PagerCardProps {
    link: NavLink;
    caption: string;
    next?: boolean;
}

/**
 * One card of the pager: a quiet caption over the name of the neighbour page.
 *
 * @param link - Neighbour page: its title and its path
 * @param caption - "Previous" or "Next", in the language of the page
 * @param next - True for the next card, whose text is right-aligned
 */
function PagerCard({ link, caption, next = false }: PagerCardProps) {
    return (
        <Link
            href={link.href}
            rel={next ? "next" : "prev"}
            className={cn(
                "flex min-w-0 flex-[1_1_12.5rem] flex-col gap-1 rounded-box border border-line px-4 py-3.5 text-ink hover:border-field hover:bg-soft",
                next && "items-end text-right",
            )}
        >
            <small className="text-xs text-faint">{caption}</small>
            <b className="text-[15px] font-medium">{link.title}</b>
        </Link>
    );
}

/**
 * Previous and next page of the reading order of the version: two cards, or one when the page is
 * the first or the last. A release page pages through the releases, newest first.
 *
 * @param ctx - Context of the page: version, page id and language
 */
export function Pager({ ctx }: PagerProps) {
    const t = useTranslations("common");
    const aria = useTranslations("aria");
    const { prev, next } = pager(NAV, ctx.version, ctx.id, ctx.lang);
    if (!prev && !next) return null;

    return (
        <nav aria-label={aria("pager")} className="flex flex-wrap gap-3">
            {prev ? <PagerCard link={prev} caption={t("previous")} /> : null}
            {next ? <PagerCard link={next} caption={t("next")} next /> : null}
        </nav>
    );
}
