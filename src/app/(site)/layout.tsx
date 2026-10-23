import type { Metadata } from "next";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { layoutMetadata } from "@/app/root";
import { Header } from "@/components/chrome/Header";
import { OutageHost } from "@/components/chrome/OutageHost";
import { Topbar } from "@/components/chrome/Topbar";
import { Shell } from "@/components/Shell";
import { VIEWPORT } from "@/lib/metadata";

export interface RootLayoutProps {
    children: ReactNode;
}

// Browser chrome colors of both color schemes, synced at run time by the theme control
export const viewport = VIEWPORT;

/**
 * Builds the metadata inherited by every English page.
 *
 * @returns The base URL, title template, icons and social card defaults
 */
export function generateMetadata(): Promise<Metadata> {
    return layoutMetadata("en");
}

/**
 * Root layout of the English tree (served at the root of the site): the document in English
 * with the theme, intl and tooltip providers of Shell, the language detection of the home and
 * the desktop and phone site headers, which persist between the pages.
 *
 * @param children - Page tree of the English routes
 */
export default async function RootLayout({ children }: RootLayoutProps) {
    setRequestLocale("en");
    const messages = await getMessages({ locale: "en" });

    return (
        <Shell
            locale="en"
            messages={messages}
            detect
            header={
                <>
                    <Header />
                    <Topbar />
                    <OutageHost />
                </>
            }
        >
            {children}
        </Shell>
    );
}
