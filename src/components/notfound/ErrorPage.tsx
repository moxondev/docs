"use client";

import { RotateCcwIcon } from "lucide-react";
import { hasLocale, useLocale, useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { localePath, routing } from "@/i18n/routing";

export interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

// Id of the main landmark, the one of Shell (CONTENT_ID), which a client component cannot import
const MAIN = "content";

/**
 * Error screen of a page that failed to render, shown under the header in the place of the page:
 * what happened, a retry button and a link home, since the same address may fail again. The
 * heading takes the focus so that a screen reader announces the change.
 *
 * @param error - Error thrown by the page, logged to the console for whoever debugs it
 * @param reset - Renders the page again, the retry button
 */
export function ErrorPage({ error, reset }: ErrorPageProps) {
    const t = useTranslations("common");
    const locale = useLocale();
    const heading = useRef<HTMLHeadingElement>(null);
    const home = hasLocale(routing.locales, locale) ? localePath(locale) : "/";

    useEffect(() => {
        console.error(error);
        heading.current?.focus();
    }, [error]);

    return (
        <main id={MAIN} tabIndex={-1} className="mx-auto max-w-205 px-6 pt-16 pb-18">
            <h1
                ref={heading}
                tabIndex={-1}
                className="text-[36px]/[1.1] font-semibold text-ink outline-none"
            >
                {t("error.title")}
            </h1>
            <p className="mt-4.5 text-base/[1.65] text-text">{t("error.description")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button type="button" onClick={reset}>
                    <RotateCcwIcon aria-hidden="true" />
                    {t("error.retry")}
                </Button>
                <a href={home} className="prose-link">
                    {t("error.home")}
                </a>
            </div>
        </main>
    );
}
