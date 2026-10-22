import { createTranslator } from "next-intl";

import type { AppLocale } from "@/i18n/routing";

export interface NotFoundCopy {
    code: string;
    title: string;
    message: string;
    link: string;
    redirecting: string;
    redirectingTo: string;
    search: string;
    searchAll: string;
    go: string;
    asked: string;
    mean: string;
    over: string;
    links: Record<
        "start" | "catalog" | "playground" | "changelog",
        { title: string; text: string }
    >;
    older: string;
}

/**
 * Builds the translator of the 404 for one language. The 404 is one document for every language,
 * so it does not read the intl provider: it holds the notfound messages of both languages and
 * translates from the one of the address.
 *
 * @param lang - Language of the address
 * @param text - The notfound messages of that language
 * @returns A translator of the notfound namespace
 */
export function say(lang: AppLocale, text: NotFoundCopy) {
    return createTranslator({ locale: lang, messages: { notfound: text }, namespace: "notfound" });
}

export type Say = ReturnType<typeof say>;
