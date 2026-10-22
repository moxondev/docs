"use client";

import { CircleAlertIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { GitHub } from "@/components/chrome/GitHub";
import { type FooterMode, footerPlan } from "@/components/chrome/targets";
import { KINDS } from "@/data/kinds";
import { LINKS } from "@/data/links";
import { SITE } from "@/data/site";
import { linkAttrs, parsePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

export interface FooterProps {
    mode?: FooterMode;
}

/**
 * Site footer: the GitHub link, the licence and the documentation release, in the column of the
 * page above so that both left edges line up. Endpoint pages end with their own edit and report
 * links and show no footer; elsewhere the report link is added only where the page has none.
 *
 * @param mode - "address" (default) to decide from the page being read, "notfound" for the 404,
 *   which cannot be read from its address
 */
export function Footer({ mode = "address" }: FooterProps) {
    const t = useTranslations("footer");
    const aria = useTranslations("aria");
    const pathname = usePathname() ?? "/";
    const { version, slug } = parsePath(pathname);

    const { show, issue, column } = footerPlan(KINDS, version, slug, mode);

    if (!show) return null;

    return (
        <footer
            aria-label={aria("footer")}
            className="border-t border-line bg-side text-[14px] text-muted print:hidden"
        >
            <div
                className={cn(
                    "mx-auto flex flex-col gap-x-8 gap-y-3 pt-3.5 pb-7 home:flex-row home:flex-wrap home:items-center home:justify-between home:pt-5.5 home:pb-7",
                    column,
                )}
            >
                <nav className="flex flex-wrap items-center gap-x-5.5 gap-y-0 home:gap-x-6 home:gap-y-2">
                    {issue ? (
                        <a
                            {...linkAttrs(LINKS.newIssue)}
                            className="prose-link inline-flex min-h-11 items-center gap-1.5 home:min-h-0"
                        >
                            <CircleAlertIcon aria-hidden="true" className="size-3.5" />
                            {t("issue")}
                            <span className="sr-only">{`, ${aria("newTab")}`}</span>
                        </a>
                    ) : null}
                    <a
                        {...linkAttrs(LINKS.repo)}
                        className="prose-link inline-flex min-h-11 items-center gap-1.5 home:min-h-0"
                    >
                        <GitHub className="size-3.5" />
                        {t("github")}
                        <span className="sr-only">{`, ${aria("newTab")}`}</span>
                    </a>
                </nav>
                <div className="flex flex-wrap items-center gap-x-5.5 gap-y-0 home:gap-x-4.5 home:gap-y-1.5">
                    <a
                        {...linkAttrs(LINKS.license)}
                        className="prose-link inline-flex min-h-11 items-center home:min-h-0"
                    >
                        {t("license")}
                        <span className="sr-only">{`, ${aria("newTab")}`}</span>
                    </a>
                    <code className="font-mono text-xs text-muted">{`v${SITE.version}`}</code>
                </div>
            </div>
        </footer>
    );
}
