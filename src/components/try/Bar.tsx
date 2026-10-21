"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useSheet } from "@/hooks/useSheet";
import type { BarProps } from "@/types/try";

/**
 * Sticky bar of the phone layout: one yellow button, "Try this request", fixed at the bottom of
 * the screen, which opens the Try sheet through the state both share. Nothing renders for an
 * operation without a live Try; the page leaves room at its foot so the bar hides no content.
 *
 * @param op - Operation whose sheet the bar opens; its id marks the bar
 */
export function Bar({ op }: BarProps) {
    const t = useTranslations("try");
    const { open, openSheet } = useSheet();

    if (!op.try) return null;

    return (
        <div
            data-op={op.id}
            className="fixed inset-x-0 bottom-0 z-20 border-t border-line-soft bg-page px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-bar desk:hidden print:hidden"
        >
            <Button
                type="button"
                size="phone"
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={openSheet}
                className="w-full"
            >
                {t("bar")}
            </Button>
        </div>
    );
}
