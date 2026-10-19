import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { clientMessages } from "@/i18n/routing";

export interface VersionLayoutProps {
    children: ReactNode;
}

/**
 * Documentation layout of the English tree, around every page of every version: it hands the client
 * components the messages they read, since a nested provider replaces those of its parent.
 *
 * @param children - The documentation page
 */
export default async function VersionLayout({ children }: VersionLayoutProps) {
    setRequestLocale("en");
    const messages = await getMessages({ locale: "en" });

    return (
        <NextIntlClientProvider locale="en" messages={clientMessages(messages, "page")}>
            {children}
        </NextIntlClientProvider>
    );
}
