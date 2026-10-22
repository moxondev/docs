"use client";

import { ChevronRightIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { essayer } from "@/components/chrome/essayer";
import { GitHub } from "@/components/chrome/GitHub";
import { Language } from "@/components/chrome/Language";
import { Logo } from "@/components/chrome/Logo";
import { Searchbar } from "@/components/chrome/Searchbar";
import {
    type HeaderMenu,
    menuAfter,
    nextTheme,
    themeChoice,
    toolTarget,
} from "@/components/chrome/targets";
import { Theme } from "@/components/chrome/Theme";
import { ThemeStatus } from "@/components/chrome/ThemeStatus";
import { Versions } from "@/components/chrome/Versions";
import { Status } from "@/components/doc/Status";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { KINDS } from "@/data/kinds";
import { LINKS } from "@/data/links";
import type { ThemeChoice } from "@/data/theme";
import { useRoutePath } from "@/hooks/useLocaleSwitch";
import { openSheet } from "@/hooks/useSheet";
import { useShortcuts } from "@/hooks/useShortcuts";
import { type SlimMeta, useSlim } from "@/hooks/useSlim";
import { TRY_ANCHOR } from "@/lib/anchors";
import { linkAttrs, parsePath } from "@/lib/routes";
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

// Desk breakpoint of globals.css, from which the header shows: open menus close below it
const DESKTOP = "(min-width: 60rem)";

// Width from which the Try panel is sticky in its own column, always in view: the wide breakpoint
const WIDE = "(min-width: 80rem)";

// Milliseconds the live region keeps the announced theme, time for a screen reader to speak it
const ANNOUNCE_MS = 4000;

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
 * Where the reader is, in the slim header: the category, a chevron, the page name in bold, the
 * pictogram of its status when it has one and the method chips of its Try operations. Plain text,
 * not a second breadcrumb landmark: the page has its own.
 *
 * @param meta - Facts published by the Sentinel of the page: name, category, status, methods
 * @param className - Extra classes, the fade of the header swap
 */
export function Crumb({ meta, className }: CrumbProps) {
    return (
        <div className={cn("flex min-w-0 items-center gap-1.5 text-sm text-muted", className)}>
            {meta.category ? (
                <>
                    <span className="truncate">{meta.category}</span>
                    <ChevronRightIcon aria-hidden="true" className="size-4 shrink-0 text-faint" />
                </>
            ) : null}
            <b className="truncate font-semibold text-ink">{meta.name}</b>
            {meta.status ? <Status status={meta.status} className="ml-1" /> : null}
            {meta.methods.map((method) => (
                <span
                    key={method}
                    className={cn(
                        "ml-1.5 shrink-0 rounded-chip px-1.5 py-0.5 font-mono text-[12px]/3.5 font-semibold uppercase",
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
                    href={toolTarget(KINDS, lang, version, page)}
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
 * Try action of the slim header: a link to the Try panel that also focuses its first field. On a
 * phone it opens the Try sheet instead, and from the wide breakpoint the panel is already in view;
 * in both cases the link is not followed.
 *
 * @param className - Extra classes, the fade of the header swap
 */
function TryLink({ className }: PartProps) {
    const t = useTranslations("header");

    return (
        <Button asChild className={cn("ml-1 h-8.5 px-3.5", className)}>
            <a
                href={`#${TRY_ANCHOR}`}
                onClick={(event) => {
                    const outcome = essayer({
                        desktop: window.matchMedia(DESKTOP).matches,
                        root: document.getElementById(TRY_ANCHOR),
                        openSheet,
                        later: (run) => requestAnimationFrame(run),
                    });
                    if (outcome === "sheet" || window.matchMedia(WIDE).matches) {
                        event.preventDefault();
                    }
                }}
            >
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
 * Desktop header (the phone headers are Topbar's): a sticky bar in its full form (version trigger,
 * centered search, tools) or, once the title of an endpoint page has scrolled away, in its slim
 * form (logo, crumb, short search, Try) of the same height, so the swap moves nothing.
 */
export function Header() {
    const pathname = useRoutePath();
    const { lang, version, slug } = parsePath(pathname);
    const { slim: scrolled, meta } = useSlim();
    const { theme, setTheme } = useTheme();
    const [menu, setMenu] = useState<HeaderMenu | null>(null);
    const [announced, setAnnounced] = useState<ThemeChoice | null>(null);
    const [swapped, setSwapped] = useState(false);
    const slim = scrolled && meta !== null;
    const fade = swapped ? "animate-swap" : undefined;
    const control = (name: HeaderMenu) => ({
        open: menu === name,
        onOpenChange: (next: boolean) => setMenu((current) => menuAfter(current, name, next)),
    });
    const spoken = announced !== null && announced === themeChoice(theme) ? announced : null;
    const toggle = (name: HeaderMenu) =>
        setMenu((current) => menuAfter(current, name, current !== name));

    useEffect(() => {
        const query = window.matchMedia(DESKTOP);
        const onChange = () => {
            if (!query.matches) setMenu(null);
        };
        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        if (announced === null) return;
        const timer = window.setTimeout(() => setAnnounced(null), ANNOUNCE_MS);
        return () => window.clearTimeout(timer);
    }, [announced]);

    if (slim && !swapped) setSwapped(true);
    if (slim && menu === "versions") setMenu(null);

    useShortcuts({
        lang: () => {
            if (window.matchMedia(DESKTOP).matches) toggle("language");
        },
        version: () => {
            if (!slim && window.matchMedia(DESKTOP).matches) toggle("versions");
        },
        theme: () => {
            const next = nextTheme(theme);
            setTheme(next);
            setAnnounced(next);
        },
    });

    return (
        <>
            <header className="pointer-events-none sticky top-0 z-30 hidden h-15 desk:block print:hidden">
                <div className="pointer-events-auto flex h-15 items-center gap-3.5 border-b border-line bg-page pr-5 pl-6">
                    {slim && meta ? (
                        <>
                            <Logo size="header" />
                            <span
                                aria-hidden="true"
                                className={cn("mx-1.5 h-5 w-px shrink-0 bg-line", fade)}
                            />
                            <Crumb meta={meta} className={fade} />
                        </>
                    ) : (
                        <Versions {...control("versions")} faceClassName={fade} />
                    )}
                    <div
                        className={cn(
                            "flex min-w-0 flex-1",
                            slim ? "justify-end" : "justify-center",
                        )}
                    >
                        <Searchbar variant={slim ? "short" : "full"} />
                    </div>
                    {slim ? null : (
                        <TopLinks lang={lang} version={version} slug={slug} className={fade} />
                    )}
                    {slim ? <TryLink className={fade} /> : null}
                    <div className="flex shrink-0 items-center gap-0.5">
                        <Language {...control("language")} />
                        <Theme {...control("theme")} />
                        <GitHubLink />
                    </div>
                    {slim ? null : <ProLink className={fade} />}
                </div>
            </header>
            <ThemeStatus choice={spoken} />
        </>
    );
}
