import type { Metadata } from "next";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { layoutMetadata } from "@/app/root";
import { Header } from "@/components/chrome/Header";
import { Topbar } from "@/components/chrome/Topbar";
import { Shell } from "@/components/Shell";
import { VIEWPORT } from "@/lib/metadata";

export interface RootLayoutProps {
    children: ReactNode;
}

// Browser chrome colors of both color schemes, synced at run time by the theme control
export const viewport = VIEWPORT;

/**
 * Builds the metadata inherited by every French page.
 *
 * @returns The base URL, title template, icons and social card defaults
 */
export function generateMetadata(): Promise<Metadata> {
    return layoutMetadata("fr");
}

/**
 * Root layout of the French tree (served under /fr/): the document in French with the theme, intl
 * and tooltip providers of Shell and the desktop and phone site headers, which persist between
 * the pages. The language detection belongs to the English root layout alone.
 *
 * @param children - Page tree of the French routes
 */
export default async function RootLayout({ children }: RootLayoutProps) {
    setRequestLocale("fr");
    const messages = await getMessages({ locale: "fr" });

    return (
        <Shell
            locale="fr"
            messages={messages}
            header={
                <>
                    <Header />
                    <Topbar />
                </>
            }
        >
            {children}
        </Shell>
    );
}
