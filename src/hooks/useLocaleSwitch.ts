import { usePathname } from "next/navigation";
import { type MouseEvent, useCallback, useMemo } from "react";

import { writePreference } from "@/hooks/usePreference";
import { type AppLocale, LOCALE_KEY } from "@/i18n/routing";
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
 * Gives the language of the page and the way to change it: the language links are plain anchors,
 * since each language is its own root document and the browser does a full load. The click saves
 * the choice under lang and widens the href with the query and the fragment.
 *
 * @returns The language of the current path, the path of the same page per language, the saver
 * and the click handler of the language links
 */
export function useLocaleSwitch(): LocaleSwitch {
    const pathname = usePathname() ?? "/";
    const locale = parsePath(pathname).lang;
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
