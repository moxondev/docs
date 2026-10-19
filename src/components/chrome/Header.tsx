"use client";

import { ChevronRightIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";

import { GitHub } from "@/components/chrome/GitHub";
import { Language } from "@/components/chrome/Language";
import { Logo } from "@/components/chrome/Logo";
import { Searchbar } from "@/components/chrome/Searchbar";
import { Theme, toggledTheme } from "@/components/chrome/Theme";
import { Versions } from "@/components/chrome/Versions";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LINKS } from "@/data/links";
import { NAV } from "@/data/nav";
import { LATEST } from "@/data/versions";
import { useShortcuts } from "@/hooks/useShortcuts";
import { type SlimMeta, useSlim } from "@/hooks/useSlim";
import { hasPage, href, linkAttrs, parsePath } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Lang, Method, Version } from "@/types/content";

export interface CrumbProps {
    meta: SlimMeta;
    className?: string;
}

export interface TopLinksProps {
    lang: Lang;
    version?: Version;
    slug?: string;
    className?: string;
}

export interface PartProps {
    className?: string;
}

// Id of the Essayer anchor that the endpoint page puts on its Try panel
const TRY_ANCHOR = "try";

// Fields of the Try panel that the Essayer action of the slim header focuses, in document order
const FIELDS = "input, select, textarea";

// Desk breakpoint of globals.css, from which the desktop header shows
const DESKTOP = "(min-width: 60rem)";

const TOOL_PAGES = ["playground", "changelog"] as const;

// Chip colors of an HTTP method in the crumb of the slim header: blue for GET, green for the others
const METHOD_TONES: Record<Method, string> = {
    get: "bg-get-bg text-get",
    post: "bg-post-bg text-post",
    put: "bg-post-bg text-post",
    patch: "bg-post-bg text-post",
    delete: "bg-post-bg text-post",
};

/**
 * Gives the address of a tools page for the top navigation: in the version being read when it
 * has that page, else in the latest version (the oldest versions have no Playground).
 *
 * @param lang - Language of the link
 * @param version - Version being read, undefined outside the documentation
 * @param slug - Page id of the tools page ("playground" or "changelog")
 * @returns The site path of the page
 */
function toolHref(lang: Lang, version: Version | undefined, slug: string): string {
    const target = version && hasPage(NAV, version, slug) ? version : LATEST;
    return href(lang, target, slug);
}

/**
 * Moves the focus to the first field of the Try panel once the browser has followed the
 * Essayer link to it, without a second scroll (the link scroll is smooth unless reduced motion).
 */
function focusTry(): void {
    const field = document.getElementById(TRY_ANCHOR)?.querySelector<HTMLElement>(FIELDS);
    if (field) requestAnimationFrame(() => field.focus({ preventScroll: true }));
}

/**
 * Where the reader is, in the slim header: the category, a chevron, the page name in bold and the
 * method chips of its Try operations. Plain text, not a second breadcrumb landmark: the page has
 * its own.
 *
 * @param meta - Facts published by the Sentinel of the page: name, category, methods
 * @param className - Extra classes, the fade of the header swap
 */
function Crumb({ meta, className }: CrumbProps) {
    return (
        <div className={cn("flex min-w-0 items-center gap-1.5 text-sm text-muted", className)}>
            {meta.category ? (
                <>
                    <span className="truncate">{meta.category}</span>
                    <ChevronRightIcon aria-hidden="true" className="size-4 shrink-0 text-faint" />
                </>
            ) : null}
            <b className="truncate font-semibold text-ink">{meta.name}</b>
            {meta.methods.map((method) => (
                <span
                    key={method}
                    className={cn(
                        "ml-1.5 shrink-0 rounded-chip px-1.5 py-0.5 font-mono text-[11px]/3.5 font-semibold uppercase",
                        METHOD_TONES[method],
                    )}
                >
                    {method}
                </span>
            ))}
        </div>
    );
}

/**
 * Playground and Changelog links of the full header, in the version being read when it has them.
 * They never look current, neither yellow nor bold; only aria-current says it.
 *
 * @param lang - Picks the path prefix of the two links (none for English, /fr for French)
 * @param version - Version being read, undefined outside the documentation
 * @param slug - Page id being read, for aria-current
 * @param className - Extra classes, the fade of the header swap
 */
function TopLinks({ lang, version, slug, className }: TopLinksProps) {
    const t = useTranslations("header");
    const aria = useTranslations("aria");

    return (
        <nav aria-label={aria("mainNav")} className={cn("flex items-center gap-0.5", className)}>
            {TOOL_PAGES.map((page) => (
                <Link
                    key={page}
                    href={toolHref(lang, version, page)}
                    aria-current={slug === page ? "page" : undefined}
                    className="rounded-row px-2.5 py-1.75 text-sm/4.5 text-muted hover:bg-chip hover:text-ink"
                >
                    {t(page)}
                </Link>
            ))}
        </nav>
    );
}

/**
 * Essayer action of the slim header: a link to the Try panel of the page that also focuses its
 * first field, so the keyboard lands in the form.
 *
 * @param className - Extra classes, the fade of the header swap
 */
function TryLink({ className }: PartProps) {
    const t = useTranslations("header");

    return (
        <Button asChild className={cn("ml-1 h-8.5 px-3.5", className)}>
            <a href={`#${TRY_ANCHOR}`} onClick={focusTry}>
                <PlayIcon aria-hidden="true" className="size-3.25" />
                {t("try")}
            </a>
        </Button>
    );
}

/**
 * Link to the GitHub repository of the documentation, an icon button with a tooltip; it opens
 * a new tab, which its name says.
 */
function GitHubLink() {
    const t = useTranslations("header");
    const aria = useTranslations("aria");

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <a
                    {...linkAttrs(LINKS.repo)}
                    className="flex size-8.5 shrink-0 items-center justify-center rounded-field text-muted hover:bg-chip hover:text-ink"
                >
                    <GitHub />
                    <span className="sr-only">{`${t("github")}, ${aria("newTab")}`}</span>
                </a>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>{t("github")}</TooltipContent>
        </Tooltip>
    );
}

/**
 * Yellow call to action of the full header, "Go Pro", to the store. It never says that a key is
 * needed to try the API; it opens a new tab, which its name says.
 *
 * @param className - Extra classes, the fade of the header swap
 */
function ProLink({ className }: PartProps) {
    const t = useTranslations("header");
    const aria = useTranslations("aria");

    return (
        <Button asChild className={cn("ml-1", className)}>
            <a {...linkAttrs(LINKS.store)}>
                {t("pro")}
                <span className="sr-only">{`, ${aria("newTab")}`}</span>
            </a>
        </Button>
    );
}

/**
 * Desktop header (the phone headers are Topbar's): a sticky bar in its full form (version, centered
 * search, tools) or, once the title of an endpoint page has scrolled away, in its slim form (crumb,
 * short search, Essayer). The header box keeps the full height, so the swap moves nothing.
 */
export function Header() {
    const pathname = usePathname() ?? "/";
    const { lang, version, slug } = parsePath(pathname);
    const { slim: scrolled, meta } = useSlim();
    const { resolvedTheme, setTheme } = useTheme();
    const [versionsOpen, setVersionsOpen] = useState(false);
    const [swapped, setSwapped] = useState(false);
    const language = useRef<HTMLAnchorElement>(null);
    const slim = scrolled && meta !== null;
    const fade = swapped ? "animate-swap" : undefined;

    if (slim && !swapped) setSwapped(true);
    if (slim && versionsOpen) setVersionsOpen(false);

    useShortcuts({
        lang: () => language.current?.click(),
        version: () => {
            if (!slim && window.matchMedia(DESKTOP).matches) setVersionsOpen((open) => !open);
        },
        theme: () => setTheme(toggledTheme(resolvedTheme)),
    });

    return (
        <header className="pointer-events-none sticky top-0 z-30 hidden h-15 desk:block print:hidden">
            <div
                className={cn(
                    "pointer-events-auto flex items-center gap-3.5 border-b border-line bg-page pr-5 pl-6",
                    slim ? "h-13" : "h-15",
                )}
            >
                <Logo size={slim ? "slim" : "header"} />
                {slim && meta ? (
                    <>
                        <span
                            aria-hidden="true"
                            className={cn("mx-1.5 h-5 w-px shrink-0 bg-line", fade)}
                        />
                        <Crumb meta={meta} className={fade} />
                    </>
                ) : (
                    <Versions open={versionsOpen} onOpenChange={setVersionsOpen} className={fade} />
                )}
                <div className={cn("flex min-w-0 flex-1", slim ? "justify-end" : "justify-center")}>
                    <Searchbar variant={slim ? "short" : "full"} />
                </div>
                {slim ? null : (
                    <TopLinks lang={lang} version={version} slug={slug} className={fade} />
                )}
                {slim ? <TryLink className={fade} /> : null}
                <div className="flex shrink-0 items-center gap-0.5">
                    <Language ref={language} />
                    <Theme />
                    <GitHubLink />
                </div>
                {slim ? null : <ProLink className={fade} />}
            </div>
        </header>
    );
}
