"use client";

import { GlobeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Ref } from "react";

import { useLocaleSwitch } from "@/hooks/useLocaleSwitch";
import { type AppLocale, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface LanguageProps {
    ref?: Ref<HTMLAnchorElement>;
    className?: string;
}

/**
 * Picks the language the switch opens: the next one in the list of locales, so with English
 * and French each one switches to the other.
 *
 * @param locale - Language of the current page
 * @returns The language of the link target
 */
export function nextLocale(locale: AppLocale): AppLocale {
    const at = routing.locales.indexOf(locale);
    return routing.locales[(at + 1) % routing.locales.length];
}

/**
 * Language switch of the headers: the globe and the code of the current language, as a link to
 * the same page in the other language, a full load since each language is its own root document.
 * The click saves the choice under lang and keeps the query and the fragment. Alt+L clicks it.
 *
 * @param ref - Ref to the anchor, for the Alt+L shortcut of the header
 * @param className - Extra classes for the link, for its place in a header
 */
export function Language({ ref, className }: LanguageProps) {
    const t = useTranslations("header");
    const common = useTranslations("common");
    const { locale, links, follow } = useLocaleSwitch();
    const target = nextLocale(locale);
    const code = common(`languageCodes.${locale}`);

    return (
        <a
            ref={ref}
            href={links[target]}
            hrefLang={target}
            aria-label={t("language", { code, name: common(`languages.${target}`) })}
            onClick={(event) => follow(target, event)}
            className={cn(
                "flex h-8.5 shrink-0 items-center gap-1.5 rounded-field px-2.25 text-[13px] font-medium text-muted hover:bg-chip hover:text-ink",
                className,
            )}
        >
            <GlobeIcon aria-hidden="true" className="size-4" />
            {code}
        </a>
    );
}
