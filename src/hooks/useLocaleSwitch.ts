import { usePathname } from "next/navigation";
import { hasLocale, useLocale } from "next-intl";
import { type MouseEvent, useCallback, useMemo } from "react";

import { writePreference } from "@/hooks/usePreference";
import { type AppLocale, LOCALE_KEY, routing } from "@/i18n/routing";
import { alternates, parsePath } from "@/lib/routes";

export interface LocaleSwitch {
    locale: AppLocale;
    links: Record<AppLocale, string>;
    remember: (locale: AppLocale) => void;
    follow: (locale: AppLocale, event: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Appends the query string and the fragment of the current address to the path of the other
 * language; both carry over because section ids are the same in every language.
 *
 * @param path - Path of the same page in the target language, from alternates()
 * @param location - Query and fragment of the current address, each with its "?" or "#"
 * @returns The address the language link opens
 */
export function carryLocation(path: string, location: { search: string; hash: string }): string {
    return `${path}${location.search}${location.hash}`;
}

/**
 * Gives the path to read the alternates from. The prerendered 404 is one English document for
 * every unknown address and reports the internal route /_not-found/, so a path that is not in
 * the language of the document, or is that internal route, counts as the home.
 *
 * @param pathname - Value of usePathname(), possibly the internal not-found route
 * @param locale - Language of the document, the one its html lang says
 * @returns The home path for the internal route or a path of another language, the pathname
 * unchanged otherwise
 */
export function routePath(pathname: string, locale: AppLocale): string {
    if (pathname === "/_not-found" || pathname.startsWith("/_not-found/")) return "/";
    return parsePath(pathname).lang === locale ? pathname : "/";
}

/**
 * Reads the language of the document, the one its html lang says: the language of the page
 * everywhere but on the 404, where it stays English whatever the address.
 *
 * @returns The locale of the intl provider, the default one when it is not a known locale
 */
function useDocumentLocale(): AppLocale {
    const locale = useLocale();
    return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}

/**
 * Gives the path of the page for the chrome: the pathname of the router, except in the
 * prerendered 404 (see routePath). It renders the same on the server and in the browser, so that
 * a header built from it never fails hydration.
 *
 * @returns The pathname to read the language, the version and the page from
 */
export function useRoutePath(): string {
    return routePath(usePathname() ?? "/", useDocumentLocale());
}

/**
 * Gives the language of the page and the way to change it: the language links are plain anchors,
 * since each language is its own root document and the browser does a full load. The click saves
 * the choice under lang and widens the href with the query and the fragment.
 *
 * @returns The language of the document, the path of the same page per language, the saver and
 * the click handler of the language links
 */
export function useLocaleSwitch(): LocaleSwitch {
    const locale = useDocumentLocale();
    const pathname = useRoutePath();
    const links = useMemo(() => alternates(pathname), [pathname]);

    const remember = useCallback((next: AppLocale) => writePreference(LOCALE_KEY, next), []);

    const follow = useCallback(
        (next: AppLocale, event: MouseEvent<HTMLAnchorElement>) => {
            remember(next);
            event.currentTarget.href = carryLocation(links[next], window.location);
        },
        [links, remember],
    );

    return { locale, links, remember, follow };
}
