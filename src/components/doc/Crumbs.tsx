import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type { DocContext } from "@/components/doc/context";
import { NAV } from "@/data/nav";
import { crumbs } from "@/lib/nav";

export interface CrumbsProps {
    ctx: DocContext;
}

/**
 * Breadcrumb of a documentation page: Catalogue, the category and the page for an endpoint, the
 * group and the page for the others. The current page is plain ink and carries aria-current.
 *
 * @param ctx - Context of the page: language, version and page id give the trail
 */
export function Crumbs({ ctx }: CrumbsProps) {
    const t = useTranslations("crumbs");
    const aria = useTranslations("aria");
    const items = crumbs(NAV, ctx.version, ctx.id, ctx.lang);

    return (
        <nav aria-label={aria("breadcrumb")}>
            <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px]/5 text-faint">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-1.5">
                        {index > 0 ? (
                            <ChevronRightIcon aria-hidden="true" className="size-3 shrink-0" />
                        ) : null}
                        {item.type === "current" ? (
                            <span aria-current="page" className="text-ink">
                                {item.title}
                            </span>
                        ) : item.href ? (
                            <Link
                                href={item.href}
                                className="relative text-muted after:absolute after:-inset-x-1 after:-inset-y-3.5 hover:text-ink hover:underline hover:decoration-hl-line hover:decoration-2 hover:underline-offset-4 desk:after:hidden"
                            >
                                {item.type === "group" ? t(item.group) : item.title}
                            </Link>
                        ) : (
                            <span>{item.type === "group" ? t(item.group) : item.title}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
