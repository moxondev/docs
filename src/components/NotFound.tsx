"use client";

import { createTranslator } from "next-intl";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import { Redirect } from "@/components/Redirect";
import { NAV } from "@/data/nav";
import { type AppLocale, localePath } from "@/i18n/routing";
import { getSmartRedirect } from "@/lib/redirect";
import { parsePath } from "@/lib/routes";

export interface NotFoundCopy {
    code: string;
    title: string;
    message: string;
    link: string;
    redirecting: string;
    redirectingTo: string;
}

export interface NotFoundProps {
    copy: Record<AppLocale, NotFoundCopy>;
    contentId: string;
}

/**
 * The 404 document never navigates, so there is nothing to subscribe to.
 *
 * @returns A no-op unsubscribe function
 */
function subscribe(): () => void {
    return () => {};
}

/**
 * Gives the address in the bar, which the prerendered 404 cannot know (it is one file for every
 * unknown address).
 *
 * @returns The pathname of the current location
 */
function getPath(): string {
    return window.location.pathname;
}

/**
 * Gives the path of the server HTML and of hydration: none, so that the page first shows the
 * English 404 and the visitor's language and redirect are settled once the address is known.
 *
 * @returns An empty string
 */
function getServerPath(): string {
    return "";
}

/**
 * The 404 page of the static export: it renders in English, then asks getSmartRedirect where the
 * address should have gone and replaces the location when it knows, else shows the page in the
 * language of the address, from the copy of both languages that the server hands over.
 *
 * @param copy - The notfound messages of every language, keyed by locale
 * @param contentId - Id of the main landmark, the target of the skip link
 */
export function NotFound({ copy, contentId }: NotFoundProps) {
    const path = useSyncExternalStore(subscribe, getPath, getServerPath);
    const lang = parsePath(path).lang;
    const target = useMemo(() => (path ? getSmartRedirect(path, NAV) : null), [path]);
    const text = copy[lang];
    const t = createTranslator({
        locale: lang,
        messages: { notfound: text },
        namespace: "notfound",
    });

    useEffect(() => {
        if (!path) return;
        document.documentElement.lang = lang;
        if (target) {
            window.location.replace(`${target}${window.location.search}${window.location.hash}`);
        }
    }, [path, lang, target]);

    if (target) return <Redirect label={t("redirectingTo", { target })} target={target} />;

    return (
        <main id={contentId} tabIndex={-1} className="mx-auto max-w-205 px-6 pt-16 pb-18">
            <p className="font-mono text-sm text-faint">{text.code}</p>
            <h1 className="mt-2 text-[36px]/[1.1] font-semibold text-ink">{text.title}</h1>
            <p className="mt-4.5 text-base/[1.65] text-text">{text.message}</p>
            <a className="prose-link mt-6 inline-block" href={localePath(lang)}>
                {text.link}
            </a>
        </main>
    );
}
