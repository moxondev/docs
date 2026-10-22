"use client";

import { CheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLayoutEffect, useRef } from "react";

import { LanguageFace } from "@/components/chrome/LanguageFace";
import { LANGUAGE_TRIGGER, MENU_MODALITY, MENU_PANEL, MENU_ROW } from "@/components/chrome/look";
import { languageRows } from "@/components/chrome/targets";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEntryFocus } from "@/hooks/useLazyMenu";
import { useLocaleSwitch } from "@/hooks/useLocaleSwitch";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export interface LanguageMenuProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    focus: boolean;
}

/**
 * Menu of the language switch, in its own chunk because of the dropdown primitive (see Language):
 * the trigger and one row per language, each named in its own language. The rows are menu items,
 * not radio items, because each is a real link to the same page in that language.
 *
 * @param open - Whether the menu is open, controlled by the header for the Alt+L shortcut
 * @param onOpenChange - Called with the state the trigger, Escape or a click outside ask for
 * @param focus - True when the plain trigger that this one replaces had the focus, which the new
 *   trigger then takes
 */
export function LanguageMenu({ open, onOpenChange, focus }: LanguageMenuProps) {
    const t = useTranslations("header");
    const common = useTranslations("common");
    const aria = useTranslations("aria");
    const { locale, links, follow } = useLocaleSwitch();
    const trigger = useRef<HTMLButtonElement>(null);
    const rows = languageRows(routing.locales, locale, links);
    const onPanelFocus = useEntryFocus(open);
    const code = common(`languageCodes.${locale}`);
    const label = t("language", { name: common(`languages.${locale}`), code });

    useLayoutEffect(() => {
        if (focus) trigger.current?.focus({ preventScroll: true });
    }, [focus]);

    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
            <DropdownMenuTrigger ref={trigger} aria-label={label} className={LANGUAGE_TRIGGER}>
                <LanguageFace code={code} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={8}
                onFocus={onPanelFocus}
                {...MENU_MODALITY}
                className={cn(MENU_PANEL, "w-44")}
            >
                {rows.map((row) => {
                    const name = <span lang={row.locale}>{common(`languages.${row.locale}`)}</span>;
                    if (row.current) {
                        return (
                            <DropdownMenuItem
                                key={row.locale}
                                aria-current="true"
                                className={cn(MENU_ROW, "h-9")}
                            >
                                {name}
                                <CheckIcon aria-hidden="true" className="ml-auto size-4 text-ink" />
                                <span className="sr-only">{aria("languageCurrent")}</span>
                            </DropdownMenuItem>
                        );
                    }
                    return (
                        <DropdownMenuItem key={row.locale} asChild className={cn(MENU_ROW, "h-9")}>
                            <a
                                href={row.href}
                                hrefLang={row.locale}
                                onClick={(event) => follow(row.locale, event)}
                            >
                                {name}
                            </a>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
