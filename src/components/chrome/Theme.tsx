"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { THEME_COLORS, type ThemeName } from "@/data/theme";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";

export interface ThemeProps {
    className?: string;
}

/**
 * Picks the theme a press of the toggle (or Alt+T) switches to.
 *
 * @param resolved - Theme in use as next-themes resolves it (the system one applied), undefined
 *   before hydration
 * @returns "light" when the dark theme is in use, else "dark"
 */
export function toggledTheme(resolved: string | undefined): ThemeName {
    return resolved === "dark" ? "light" : "dark";
}

/**
 * Theme toggle of the headers: a moon in the light theme, a sun in the dark one, picked by the dark
 * class that next-themes sets before the first paint. The label waits for hydration, and the
 * browser theme color follows the theme in use.
 *
 * @param className - Extra classes for the button, for its place in a header
 */
export function Theme({ className }: ThemeProps) {
    const aria = useTranslations("aria");
    const { resolvedTheme, setTheme } = useTheme();
    const hydrated = useHydrated();
    const label = aria(hydrated && resolvedTheme === "dark" ? "themeLight" : "themeDark");

    useEffect(() => {
        if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;
        document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
            meta.setAttribute("content", THEME_COLORS[resolvedTheme]);
        });
    }, [resolvedTheme]);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    aria-label={label}
                    onClick={() => setTheme(toggledTheme(resolvedTheme))}
                    className={cn(
                        "flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-field text-muted hover:bg-chip hover:text-ink",
                        className,
                    )}
                >
                    <MoonIcon aria-hidden="true" className="size-4 dark:hidden" />
                    <SunIcon aria-hidden="true" className="hidden size-4 dark:block" />
                </button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>{label}</TooltipContent>
        </Tooltip>
    );
}
