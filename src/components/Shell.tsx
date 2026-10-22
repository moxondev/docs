import { type AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { preload, type PreloadOptions } from "react-dom";

import bricolage from "@/app/fonts/bricolage.woff2" with { turbopackModuleType: "asset" };
import geist from "@/app/fonts/geist.woff2" with { turbopackModuleType: "asset" };
import { Addressed } from "@/components/chrome/Addressed";
import { PaletteHost } from "@/components/chrome/PaletteHost";
import { SkipLink } from "@/components/chrome/SkipLink";
import { TooltipProvider } from "@/components/ui/tooltip";
import { type AppLocale, clientMessages, LOCALE_KEY, routing } from "@/i18n/routing";

import "@/app/globals.css";

export interface ShellProps {
    locale: AppLocale;
    messages: AbstractIntlMessages;
    detect?: boolean;
    alternate?: { locale: AppLocale; messages: AbstractIntlMessages };
    header?: ReactNode;
    children: ReactNode;
}

// Id of the element that holds the main content of every page: the target of the skip link
export const CONTENT_ID = "content";

// Storage key of the theme, the next-themes default
const THEME_KEY = "theme";

// Storage key under which the former site kept the theme of returning visitors
const LEGACY_THEME_KEY = "vitepress-theme-appearance";

// Preload hints of the two latin files the first paint needs: the Geist text and the logo
const FONT_PRELOAD: PreloadOptions = { as: "font", type: "font/woff2", crossOrigin: "anonymous" };

// Boot script run before next-themes: it carries the former site theme over unless one is saved
const SEED_SCRIPT = `(function () {
    try {
        var old = localStorage.getItem(${JSON.stringify(LEGACY_THEME_KEY)});
        var known = old === "dark" || old === "light" || old === "auto";
        if (known && localStorage.getItem(${JSON.stringify(THEME_KEY)}) === null) {
            localStorage.setItem(${JSON.stringify(THEME_KEY)}, old === "auto" ? "system" : old);
        }
    } catch (error) {}
})();`;

// Boot script of the English home: a visitor of / goes to the saved or the browser language
const DETECT_SCRIPT = `(function () {
    if (location.pathname !== "/") return;
    var locales = ${JSON.stringify(routing.locales)};
    var fallback = ${JSON.stringify(routing.defaultLocale)};
    var found = null;
    try {
        found = localStorage.getItem(${JSON.stringify(LOCALE_KEY)});
    } catch (error) {}
    if (locales.indexOf(found) < 0) {
        found = fallback;
        var wanted = navigator.languages && navigator.languages.length
            ? navigator.languages
            : [navigator.language];
        for (var i = 0; i < wanted.length; i++) {
            var code = String(wanted[i]).toLowerCase().split("-")[0];
            if (locales.indexOf(code) >= 0) {
                found = code;
                break;
            }
        }
        try {
            localStorage.setItem(${JSON.stringify(LOCALE_KEY)}, found);
        } catch (error) {}
    }
    if (found !== fallback) location.replace("/" + found + "/" + location.search + location.hash);
})();`;

/**
 * Root document of a locale, rendered by both root layouts and by the global 404: html lang, boot
 * scripts, font preloads, providers, skip link, header slot and the search palette host. The
 * palette host is mounted once here so that it outlives navigations.
 *
 * @param locale - Locale of the document, written to the html lang attribute
 * @param messages - Every message of that locale (getMessages); the client provider only gets
 *   the namespaces of the root tree
 * @param detect - True in the English root layout only: adds the language detection script
 * @param alternate - Only the global 404 gives it: the other language of the site with its
 *   messages, which the chrome switches to when the address in the bar is in that language
 * @param header - Site header, rendered before the page so that it persists across pages
 * @param children - Page tree; its main element carries the id CONTENT_ID
 */
export function Shell({
    locale,
    messages,
    detect = false,
    alternate,
    header,
    children,
}: ShellProps) {
    const page = (
        <>
            <SkipLink target={CONTENT_ID} />
            {header}
            {children}
            <PaletteHost />
        </>
    );

    preload(geist, FONT_PRELOAD);
    preload(bricolage, FONT_PRELOAD);

    return (
        <html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
            <body className="min-h-dvh">
                {detect ? <script dangerouslySetInnerHTML={{ __html: DETECT_SCRIPT }} /> : null}
                <script dangerouslySetInnerHTML={{ __html: SEED_SCRIPT }} />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider
                        locale={locale}
                        messages={clientMessages(messages, "root")}
                    >
                        <TooltipProvider delayDuration={300}>
                            {alternate ? (
                                <Addressed
                                    locale={alternate.locale}
                                    messages={clientMessages(alternate.messages, "root")}
                                >
                                    {page}
                                </Addressed>
                            ) : (
                                page
                            )}
                        </TooltipProvider>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
