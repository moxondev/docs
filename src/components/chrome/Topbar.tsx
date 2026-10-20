"use client";

import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Logo } from "@/components/chrome/Logo";
import { Menu } from "@/components/chrome/Menu";
import { Searchbar } from "@/components/chrome/Searchbar";
import { useLocaleSwitch } from "@/hooks/useLocaleSwitch";
import { useSlim } from "@/hooks/useSlim";
import { localePath } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { SlimMeta } from "@/types/nav";

export interface BackProps {
    meta: SlimMeta;
    home: string;
}

/**
 * Back link and two-line title of the slim phone header: a chevron that returns to the category
 * of the page in the catalogue, then the category in small muted text over the page name. The
 * link is named by the category it goes back to.
 *
 * @param meta - Facts published by the Sentinel of the page: name, category and back link
 * @param home - Home path of the language, the back target of a page without a category
 */
function Back({ meta, home }: BackProps) {
    const aria = useTranslations("aria");
    const t = useTranslations("menu");

    return (
        <>
            <Link
                href={meta.back ?? home}
                aria-label={meta.category ? aria("backTo", { name: meta.category }) : t("back")}
                className="flex size-11 shrink-0 items-center justify-center rounded-field text-ink hover:bg-chip"
            >
                <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </Link>
            <div className="ml-0.5 flex min-w-0 flex-col leading-[1.15]">
                {meta.category ? (
                    <small className="truncate text-[11.5px] text-muted">{meta.category}</small>
                ) : null}
                <b className="truncate text-[17px] font-semibold text-ink">{meta.name}</b>
            </div>
        </>
    );
}

/**
 * Phone header (the desktop one is Header's): a sticky bar with the logo, the search button and
 * the menu button. Once the Sentinel reports that the title has scrolled away, it swaps the logo
 * for a back link and a two-line title, at the same height so the page never moves.
 */
export function Topbar() {
    const { locale } = useLocaleSwitch();
    const { slim, meta } = useSlim();
    const scrolled = slim && meta !== null;

    return (
        <header
            className={cn(
                "sticky top-0 z-30 flex h-14 items-center gap-1 border-b border-line-soft bg-page pr-1.5 desk:hidden print:hidden",
                scrolled ? "pl-1" : "pl-5",
            )}
        >
            {scrolled && meta ? (
                <Back meta={meta} home={localePath(locale)} />
            ) : (
                <Logo size="phone" />
            )}
            <div className="flex-1" />
            <Searchbar variant="icon" />
            <Menu />
        </header>
    );
}
