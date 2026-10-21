"use client";

import { useRouter } from "next/navigation";
import {
    type AbstractIntlMessages,
    NextIntlClientProvider,
    useLocale,
    useMessages,
    useTranslations,
} from "next-intl";
import { useCallback, useMemo, useRef } from "react";

import { Body } from "@/components/search/Body";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useFlash } from "@/hooks/useFlash";
import { useRoutePath } from "@/hooks/useLocaleSwitch";
import { usePalette, usePaletteShortcuts } from "@/hooks/usePalette";
import type { AppLocale } from "@/i18n/routing";
import { searchScope } from "@/lib/search";

import en from "../../../messages/en/search.json";
import fr from "../../../messages/fr/search.json";

// Search messages of each locale, loaded with this chunk: the root provider does not carry them
const SEARCH: Record<AppLocale, AbstractIntlMessages> = { en, fr };

/**
 * Search palette, loaded on its first opening and mounted already open: a dialog over a cmdk list
 * with the results grouped by kind and, on desktop, the preview of the selected row. Focus returns
 * to the control that opened it, which Radix cannot do without a trigger element.
 */
export function Palette() {
    const { open, setOpen, seed, session, closePalette } = usePalette();
    const aria = useTranslations("aria");
    const locale = useLocale() as AppLocale;
    const outer = useMessages();
    const pathname = useRoutePath();
    const router = useRouter();
    const flash = useFlash();
    const opener = useRef<HTMLElement | null>(null);
    const scope = searchScope(pathname);
    const messages = useMemo(
        () => ({ ...outer, search: SEARCH[locale] ?? SEARCH.en }),
        [outer, locale],
    );

    usePaletteShortcuts();

    const onGo = useCallback(
        (href: string, flashTarget: boolean) => {
            closePalette();
            if (flashTarget) flash(href);
            else router.push(href);
        },
        [closePalette, flash, router],
    );

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    showCloseButton={false}
                    aria-describedby={undefined}
                    onOpenAutoFocus={() => {
                        opener.current = document.activeElement as HTMLElement | null;
                    }}
                    onCloseAutoFocus={(event) => {
                        event.preventDefault();
                        opener.current?.focus();
                    }}
                    className="top-21 flex w-230 max-w-none translate-y-0 flex-col gap-0 overflow-hidden rounded-panel border-0 bg-surface p-0 shadow-palette data-[state=closed]:animate-palette-out data-[state=open]:animate-palette-in sm:max-w-none desk:max-w-[calc(100%-2rem)] max-desk:top-0 max-desk:left-0 max-desk:h-dvh max-desk:w-full max-desk:translate-x-0 max-desk:rounded-none max-desk:shadow-none"
                >
                    <DialogTitle className="sr-only">{aria("searchDialog")}</DialogTitle>
                    <Body
                        key={session}
                        lang={scope.lang}
                        version={scope.version}
                        seed={seed}
                        onGo={onGo}
                        onClose={closePalette}
                    />
                </DialogContent>
            </Dialog>
        </NextIntlClientProvider>
    );
}
