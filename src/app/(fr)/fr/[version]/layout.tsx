import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Banner } from "@/components/chrome/Banner";
import { Footer } from "@/components/chrome/Footer";
import { Sidebar } from "@/components/doc/Sidebar";
import { NAV } from "@/data/nav";
import { clientMessages } from "@/i18n/routing";
import { sidebar } from "@/lib/nav";
import { isVersion } from "@/lib/routes";

export interface VersionLayoutProps {
    children: ReactNode;
    params: Promise<{ version: string }>;
}

/**
 * Documentation layout of the French tree, around every page of every version: it hands the client
 * components the messages they read, since a nested provider replaces those of its parent, and
 * holds the sidebar so that its filter, open categories and scroll survive navigation.
 *
 * @param children - The documentation page
 * @param params - Route params of Next, resolved to the version of the sidebar
 */
export default async function VersionLayout({ children, params }: VersionLayoutProps) {
    setRequestLocale("fr");
    const messages = await getMessages({ locale: "fr" });
    const { version } = await params;

    return (
        <NextIntlClientProvider locale="fr" messages={clientMessages(messages, "page")}>
            <div className="desk:grid desk:grid-cols-[16.25rem_minmax(0,1fr)]">
                {isVersion(version) ? <Sidebar model={sidebar(NAV, version, "fr")} /> : null}
                <div className="flex min-h-[calc(100dvh-3.5rem)] min-w-0 flex-col desk:min-h-[calc(100dvh-3.75rem)]">
                    <Banner />
                    {children}
                    <div className="mt-auto">
                        <Footer />
                    </div>
                </div>
            </div>
        </NextIntlClientProvider>
    );
}
