"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { type ComponentType, useEffect, useState } from "react";

import { THEME_TRIGGER, tipOnKeyFocus } from "@/components/chrome/look";
import { themeChoice } from "@/components/chrome/targets";
import { ThemeFace } from "@/components/chrome/ThemeFace";
import type { ThemeMenuProps } from "@/components/chrome/ThemeMenu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { THEME_COLORS } from "@/data/theme";
import { useHydrated } from "@/hooks/useHydrated";
import { useLazyMenu } from "@/hooks/useLazyMenu";

export interface ThemeProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Fetches the chunk of the theme menu, which holds the dropdown primitive.
 *
 * @returns The menu component, once its chunk has arrived
 */
function loadMenu(): Promise<ComponentType<ThemeMenuProps>> {
    return import("@/components/chrome/ThemeMenu").then((module) => module.ThemeMenu);
}

/**
 * Theme control of the desktop headers: an icon button that opens the theme menu (see ThemeMenu),
 * whose chunk is fetched only once the reader shows interest. Mounted on every page, phone
 * included, so it also keeps the browser theme color in step with the theme in use.
 *
 * @param open - Whether the menu is open, controlled by the header, which keeps one menu open
 * @param onOpenChange - Called with the state the trigger, Escape or a click outside ask for
 */
export function Theme({ open, onOpenChange }: ThemeProps) {
    const t = useTranslations("header");
    const aria = useTranslations("aria");
    const common = useTranslations("common");
    const { theme, resolvedTheme } = useTheme();
    const hydrated = useHydrated();
    const { plain, Menu, focus, want } = useLazyMenu(loadMenu, open);
    const [tip, setTip] = useState(false);
    const choice = hydrated ? themeChoice(theme) : undefined;
    const label = choice ? t("theme", { name: common(`themes.${choice}`) }) : aria("theme");
    const change = (next: boolean) => {
        if (next) setTip(false);
        onOpenChange(next);
    };

    useEffect(() => {
        if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
        document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
            meta.setAttribute("content", THEME_COLORS[resolvedTheme]);
        });
    }, [resolvedTheme]);

    return (
        <Tooltip open={tip} onOpenChange={(next) => setTip(next && !open)}>
            {Menu ? (
                <Menu
                    open={open}
                    onOpenChange={change}
                    focus={focus}
                    label={label}
                    choice={choice}
                />
            ) : (
                <TooltipTrigger asChild>
                    <button
                        ref={plain}
                        type="button"
                        aria-label={label}
                        aria-haspopup="menu"
                        aria-expanded={open}
                        onPointerEnter={want}
                        onFocus={(event) => {
                            want();
                            tipOnKeyFocus(event);
                        }}
                        onClick={() => change(!open)}
                        onKeyDown={(event) => {
                            if (event.key !== "ArrowDown") return;
                            event.preventDefault();
                            change(true);
                        }}
                        className={THEME_TRIGGER}
                    >
                        <ThemeFace />
                    </button>
                </TooltipTrigger>
            )}
            <TooltipContent sideOffset={6}>{label}</TooltipContent>
        </Tooltip>
    );
}
