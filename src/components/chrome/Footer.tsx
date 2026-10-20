"use client";

import { CircleAlertIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { GitHub } from "@/components/chrome/GitHub";
import { showsFooter } from "@/components/chrome/targets";
import { LINKS } from "@/data/links";
import { NAV } from "@/data/nav";
import { SITE } from "@/data/site";
import { linkAttrs, parsePath } from "@/lib/routes";

/**
 * Site footer with the report and GitHub links, the licence and the documentation release.
 * Endpoint pages end with their own edit and report links and show no footer; others have one.
 * It collapses to a column on a phone.
 */
export function Footer() {
    const t = useTranslations("footer");
    const aria = useTranslations("aria");
    const pathname = usePathname() ?? "/";
    const { version, slug } = parsePath(pathname);

    if (!showsFooter(NAV, version, slug)) return null;

    return (
        <footer
            aria-label={aria("footer")}
            className="border-t border-line bg-side text-[13px] text-muted print:hidden"
        >
            <div className="mx-auto flex max-w-296 flex-col gap-x-8 gap-y-3 px-5 pt-3.5 pb-7 home:flex-row home:flex-wrap home:items-center home:justify-between home:px-8 home:pt-5.5 home:pb-7">
                <nav className="flex flex-col gap-x-6 gap-y-2 home:flex-row home:items-center">
                    <a
                        {...linkAttrs(LINKS.newIssue)}
                        className="prose-link inline-flex min-h-11 items-center gap-1.5 home:min-h-0"
                    >
                        <CircleAlertIcon aria-hidden="true" className="size-3.5" />
                        {t("issue")}
                        <span className="sr-only">{`, ${aria("newTab")}`}</span>
                    </a>
                    <a
                        {...linkAttrs(LINKS.repo)}
                        className="prose-link inline-flex min-h-11 items-center gap-1.5 home:min-h-0"
                    >
                        <GitHub className="size-3.5" />
                        {t("github")}
                        <span className="sr-only">{`, ${aria("newTab")}`}</span>
                    </a>
                </nav>
                <div className="flex flex-col gap-x-4.5 gap-y-1.5 home:flex-row home:items-center">
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
