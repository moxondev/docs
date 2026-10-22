"use client";

import {
    type AbstractIntlMessages,
    NextIntlClientProvider,
    useLocale,
    useMessages,
} from "next-intl";
import type { ReactNode } from "react";

import { addressLocale, useAddressPath } from "@/hooks/useAddress";
import { RoutePathContext } from "@/hooks/useLocaleSwitch";
import { type AppLocale, localePath } from "@/i18n/routing";

export interface AddressedProps {
    locale: AppLocale;
    messages: AbstractIntlMessages;
    children: ReactNode;
}

/**
 * Makes the chrome of the 404 follow the language of the address: the 404 is one English document,
 * so once the address is read an address of the other language swaps the intl provider and points
 * the route path of the chrome to that language's home, with no remount.
 *
 * @param locale - The other language of the document, the one the address must start with
 * @param messages - Client messages of that language for the root tree (clientMessages)
 * @param children - The skip link, the headers and the page
 */
export function Addressed({ locale, messages, children }: AddressedProps) {
    const outerLocale = useLocale();
    const outerMessages = useMessages();
    const lang = addressLocale(useAddressPath());
    const swapped = lang === locale;

    return (
        <NextIntlClientProvider
            locale={swapped ? locale : outerLocale}
            messages={swapped ? messages : outerMessages}
        >
            <RoutePathContext.Provider value={localePath(lang)}>
                {children}
            </RoutePathContext.Provider>
        </NextIntlClientProvider>
    );
}
