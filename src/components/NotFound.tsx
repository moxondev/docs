"use client";

import { useEffect, useMemo } from "react";

import { Footer } from "@/components/chrome/Footer";
import { columnClass } from "@/components/chrome/targets";
import { Hint } from "@/components/notfound/Hint";
import { type NotFoundCopy, say } from "@/components/notfound/say";
import { Search } from "@/components/notfound/Search";
import { Where } from "@/components/notfound/Where";
import { Redirect } from "@/components/Redirect";
import { KINDS } from "@/data/kinds";
import { SITE } from "@/data/site";
import { useAddressPath } from "@/hooks/useAddress";
import { useTitleSwap } from "@/hooks/useTitleSwap";
import { type AppLocale, localePath } from "@/i18n/routing";
import { getSmartRedirect } from "@/lib/redirect";
import { parsePath } from "@/lib/routes";
import { searchTerm, suggestPath } from "@/lib/suggest";
import { cn } from "@/lib/utils";

export type { NotFoundCopy } from "@/components/notfound/say";

export interface NotFoundStats {
    count: number;
    categories: number;
}

export interface NotFoundProps {
    copy: Record<AppLocale, NotFoundCopy>;
    stats: NotFoundStats;
    contentId: string;
}

/**
 * The 404 page of the static export: it asks getSmartRedirect where the address should have gone,
 * replaces the location when it knows, else shows the page in the language of the address. Nothing
 * is drawn until the address is read, so a valid old address never flashes the 404 text.
 *
 * @param copy - The notfound messages of every language, keyed by locale
 * @param stats - Counts of the latest version read from the data on the server: endpoints and
 *   categories of the catalogue
 * @param contentId - Id of the main landmark, the target of the skip link
 */
export function NotFound({ copy, stats, contentId }: NotFoundProps) {
    const path = useAddressPath();
    const lang = parsePath(path).lang;
    const target = useMemo(() => (path ? getSmartRedirect(path, KINDS) : null), [path]);
    const suggestion = useMemo(() => (path ? suggestPath(KINDS, path) : null), [path]);
    const text = copy[lang];
    const t = say(lang, text);
    const term = searchTerm(path);

    useEffect(() => {
        if (!path) return;
        document.documentElement.lang = lang;
        if (target) {
            window.location.replace(`${target}${window.location.search}${window.location.hash}`);
        }
    }, [path, lang, target]);

    useTitleSwap(copy.en.title, path && lang !== "en" ? copy[lang].title : null);

    if (target) return <Redirect label={t("redirectingTo", { target })} target={target} />;

    return (
        <>
            <div
                className={cn(
                    "min-h-[calc(100dvh-3.5rem)] flex-col desk:min-h-[calc(100dvh-3.75rem)]",
                    path ? "flex" : "hidden",
                )}
            >
                <main
                    id={contentId}
                    tabIndex={-1}
                    className={cn(
                        "mx-auto flex w-full flex-1 flex-col justify-center pt-6 pb-10 outline-none home:pt-3 home:pb-4.5",
                        columnClass("article"),
                    )}
                >
                    <div className="relative flex flex-col items-center text-center">
                        <p aria-hidden="true" className="nf-ghost">
                            {text.code}
                        </p>
                        <div className="relative w-full max-w-160 pt-17 home:pt-26">
                            <h1 className="font-brand text-[30px]/[1.1] font-extrabold tracking-[-0.03em] text-ink home:text-[36px]/[1.1]">
                                <span className="sr-only">{text.code} </span>
                                {text.title}
                            </h1>
                            <Search
                                term={term}
                                label={term ? t("search", { query: term }) : t("searchAll")}
                                placeholder={t("searchAll")}
                                go={text.go}
                            />
                            <Hint say={t} path={path} suggestion={suggestion} />
                            <Where
                                say={t}
                                lang={lang}
                                release={SITE.version}
                                count={stats.count}
                                categories={stats.categories}
                            />
                        </div>
                    </div>
                </main>
                <Footer mode="notfound" />
            </div>
            <noscript>
                <div className={cn("mx-auto pt-16 pb-18", columnClass("article"))}>
                    <p className="font-mono text-sm text-faint">{copy.en.code}</p>
                    <p className="mt-2 text-[36px]/[1.1] font-semibold text-ink">{copy.en.title}</p>
                    <p className="mt-4.5 text-base/[1.65] text-text">{copy.en.message}</p>
                    <a
                        className="prose-link mt-3 inline-flex min-h-11 items-center"
                        href={localePath("en")}
                    >
                        {copy.en.link}
                    </a>
                </div>
            </noscript>
        </>
    );
}
