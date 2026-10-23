"use client";

import { CircleAlertIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { GitHub } from "@/components/chrome/GitHub";
import { Logo } from "@/components/chrome/Logo";
import { type FooterMode, footerPlan } from "@/components/chrome/targets";
import { KINDS } from "@/data/kinds";
import { LINKS } from "@/data/links";
import { SITE } from "@/data/site";
import { linkAttrs, parsePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

export interface FooterProps {
    mode?: FooterMode;
}

// A footer link: drawn at its text height, with an invisible extension to 44 px on a phone
const LINK =
    "prose-link relative inline-flex items-center gap-1.5 after:absolute after:inset-x-0 after:-inset-y-3 home:after:hidden";

/**
 * Site footer: the moxon wordmark signed with the documentation release, then the GitHub and
 * licence links, centered on a phone and on one row in the column of the page on a wider screen.
 * Endpoint pages show none; the report link is added where the page has none of its own.
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
                    "mx-auto flex flex-col items-center gap-x-8 gap-y-3 pt-5 pb-5 home:flex-row home:justify-between home:pt-5.5 home:pb-7",
                    column,
                )}
            >
                <div className="flex items-baseline gap-2">
                    <Logo size="footer" />
                    <code className="font-mono text-xs text-muted">{`v${SITE.version}`}</code>
                </div>
                <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 home:gap-x-6">
                    {issue ? (
                        <a {...linkAttrs(LINKS.newIssue)} className={LINK}>
                            <CircleAlertIcon aria-hidden="true" className="size-3.5" />
                            {t("issue")}
                            <span className="sr-only">{`, ${aria("newTab")}`}</span>
                        </a>
                    ) : null}
                    <a {...linkAttrs(LINKS.repo)} className={LINK}>
                        <GitHub className="size-3.5" />
                        {t("github")}
                        <span className="sr-only">{`, ${aria("newTab")}`}</span>
                    </a>
                    <a {...linkAttrs(LINKS.license)} className={LINK}>
                        {t("license")}
                        <span className="sr-only">{`, ${aria("newTab")}`}</span>
                    </a>
                </nav>
            </div>
        </footer>
    );
}
