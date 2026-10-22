"use client";

import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import { useLayoutEffect, useRef } from "react";

import {
    MENU_MODALITY,
    MENU_PANEL,
    MENU_ROW,
    THEME_TRIGGER,
    tipOnKeyFocus,
} from "@/components/chrome/look";
import { themeRows } from "@/components/chrome/targets";
import { ThemeFace } from "@/components/chrome/ThemeFace";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipTrigger } from "@/components/ui/tooltip";
import type { ThemeChoice } from "@/data/theme";
import { useEntryFocus } from "@/hooks/useLazyMenu";
import { cn } from "@/lib/utils";

export interface ThemeMenuProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    focus: boolean;
    label: string;
    choice: ThemeChoice | undefined;
}

const THEME_ICONS = { light: SunIcon, dark: MoonIcon, system: MonitorIcon } as const;

/**
 * Menu of the theme control, in its own chunk (see Theme): the icon trigger, which relies on the
 * tooltip root of Theme, and one radio row per theme, checked on the preference in force. After a
 * mouse use the focus is not given back to the trigger, or its ring and tooltip would stay.
 *
 * @param open - Whether the menu is open, controlled by the header
 * @param onOpenChange - Called with the state the trigger, Escape, a row or a click outside ask for
 * @param focus - True when the plain trigger that this one replaces had the focus, which the new
 *   trigger then takes
 * @param label - Name of the trigger, "Theme: System", which the tooltip shows too
 * @param choice - Preference in force, undefined before hydration
 */
export function ThemeMenu({ open, onOpenChange, focus, label, choice }: ThemeMenuProps) {
    const common = useTranslations("common");
    const { setTheme } = useTheme();
    const trigger = useRef<HTMLButtonElement>(null);
    const onPanelFocus = useEntryFocus(open);

    useLayoutEffect(() => {
        if (focus) trigger.current?.focus({ preventScroll: true });
    }, [focus]);

    return (
        <DropdownMenu open={open} onOpenChange={onOpenChange} modal={false}>
            <TooltipTrigger asChild>
                <DropdownMenuTrigger
                    ref={trigger}
                    aria-label={label}
                    onFocus={tipOnKeyFocus}
                    className={THEME_TRIGGER}
                >
                    <ThemeFace />
                </DropdownMenuTrigger>
            </TooltipTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={8}
                onFocus={onPanelFocus}
                onCloseAutoFocus={(event) => {
                    if (event.target instanceof HTMLElement && "pointer" in event.target.dataset) {
                        event.preventDefault();
                    }
                }}
                {...MENU_MODALITY}
                className={cn(MENU_PANEL, "w-44")}
            >
                <DropdownMenuRadioGroup value={choice} onValueChange={(name) => setTheme(name)}>
                    {themeRows(choice).map((row) => {
                        const Glyph = THEME_ICONS[row.name];
                        return (
                            <MenuPrimitive.RadioItem
                                key={row.name}
                                value={row.name}
                                className={cn(
                                    MENU_ROW,
                                    "relative flex h-9 items-center text-sm outline-hidden select-none",
                                )}
                            >
                                <Glyph aria-hidden="true" className="size-4 shrink-0 text-muted" />
                                {common(`themes.${row.name}`)}
                                {row.current ? (
                                    <CheckIcon
                                        aria-hidden="true"
                                        className="ml-auto size-4 shrink-0 text-ink"
                                    />
                                ) : null}
                            </MenuPrimitive.RadioItem>
                        );
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
