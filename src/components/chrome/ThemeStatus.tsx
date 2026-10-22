"use client";

import { useTranslations } from "next-intl";

import type { ThemeChoice } from "@/data/theme";

export interface ThemeStatusProps {
    choice: ThemeChoice | null;
}

/**
 * Live region that tells a screen reader which theme Alt+T has just switched to, since the cycle
 * changes the page without moving the focus. It sits beside the desktop header, not inside it:
 * a hidden region is not announced. It starts empty: some readers miss a region born full.
 *
 * @param choice - Preference Alt+T has just applied, null when there is nothing to say
 */
export function ThemeStatus({ choice }: ThemeStatusProps) {
    const t = useTranslations("header");
    const common = useTranslations("common");

    return (
        <div role="status" aria-live="polite" className="sr-only">
            {choice ? t("theme", { name: common(`themes.${choice}`) }) : null}
        </div>
    );
}
