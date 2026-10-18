import { type AbstractIntlMessages, hasLocale, type IntlError } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { type AppLocale, MESSAGE_FILES, type Messages, type Namespace, routing } from "./routing";

// Zone of every date formatted by next-intl, so that the zone of the build machine never leaks
const TIME_ZONE = "UTC";

/**
 * Loads one message file of a locale; a missing file yields an empty object, so that a namespace
 * declared before its file exists never breaks the build (scripts/messages.ts still reports it).
 *
 * @param locale - Locale folder under messages/
 * @param file - Namespace, which is also the file name without its extension
 * @returns The parsed JSON object, or an empty object when the file does not exist
 */
async function loadFile(locale: AppLocale, file: Namespace): Promise<AbstractIntlMessages> {
    try {
        return (await import(`../../messages/${locale}/${file}.json`)).default;
    } catch {
        return {};
    }
}

/**
 * Builds every message of a locale, one entry per namespace. The request configuration uses it,
 * and so does the global 404 page, which hands the copy of every locale to the client.
 *
 * @param locale - Locale whose messages/<locale>/ folder is read
 * @returns The messages keyed by namespace, in the order of MESSAGE_FILES
 */
export async function loadMessages(locale: AppLocale): Promise<Messages> {
    const files = await Promise.all(MESSAGE_FILES.map((file) => loadFile(locale, file)));
    return Object.fromEntries(MESSAGE_FILES.map((file, index) => [file, files[index]])) as Messages;
}

/**
 * Reports a translation error. A static export must never ship a message key in place of its
 * text, so a production build throws and next build fails on the page that renders it, while
 * next dev only logs it.
 *
 * @param error - Missing message, invalid message or formatting error raised by next-intl
 */
function onError(error: IntlError): void {
    if (process.env.NODE_ENV === "production") throw error;
    console.error(error);
}

/**
 * Per-request next-intl configuration: resolves the active locale, falling back to the default
 * one, and loads its merged messages.
 *
 * @param params - Request context of next-intl, whose requestLocale resolves to the locale set by
 *   setRequestLocale in the layouts and pages, or to undefined when there is none
 * @returns The locale to render, its messages, the UTC time zone and the error policy
 */
const requestConfig = getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

    return { locale, messages: await loadMessages(locale), timeZone: TIME_ZONE, onError };
});

export default requestConfig;
