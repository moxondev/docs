"use client";

import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

import { LanguageFace } from "@/components/chrome/LanguageFace";
import type { LanguageMenuProps } from "@/components/chrome/LanguageMenu";
import { LANGUAGE_TRIGGER } from "@/components/chrome/look";
import { useLazyMenu } from "@/hooks/useLazyMenu";
import { useLocaleSwitch } from "@/hooks/useLocaleSwitch";

export interface LanguageProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Fetches the chunk of the language menu, which holds the dropdown primitive.
 *
 * @returns The menu component, once its chunk has arrived
 */
function loadMenu(): Promise<ComponentType<LanguageMenuProps>> {
    return import("@/components/chrome/LanguageMenu").then((module) => module.LanguageMenu);
}

/**
 * Language switch of the desktop headers: a button with the globe, the current code and a chevron
 * that opens the language menu (see LanguageMenu), loaded once the reader shows interest. Its
 * name starts with the code it shows, "EN, language: English", so that the visible text begins it.
 *
 * @param open - Whether the menu is open, controlled by the header for the Alt+L shortcut
 * @param onOpenChange - Called with the state the trigger, Escape or a click outside ask for
 */
export function Language({ open, onOpenChange }: LanguageProps) {
    const t = useTranslations("header");
    const common = useTranslations("common");
    const { locale } = useLocaleSwitch();
    const { plain, Menu, focus, want } = useLazyMenu(loadMenu, open);
    const code = common(`languageCodes.${locale}`);
    const label = t("language", { name: common(`languages.${locale}`), code });

    if (Menu) return <Menu open={open} onOpenChange={onOpenChange} focus={focus} />;

    return (
        <button
            ref={plain}
            type="button"
            aria-label={label}
            aria-haspopup="menu"
            aria-expanded={open}
            onPointerEnter={want}
            onFocus={want}
            onClick={() => onOpenChange(!open)}
            onKeyDown={(event) => {
                if (event.key !== "ArrowDown") return;
                event.preventDefault();
                onOpenChange(true);
            }}
            className={LANGUAGE_TRIGGER}
        >
            <LanguageFace code={code} />
        </button>
    );
}
