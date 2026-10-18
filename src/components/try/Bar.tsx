"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import type { BarProps } from "@/types/try";

/**
 * Placeholder of the phone sticky bar: the yellow "Try this request" button at the bottom of
 * the screen below 960 px, inert for now because the sheet it opens is a stub too.
 *
 * @param op - Operation whose sheet the bar opens; its id marks the placeholder
 */
export function Bar({ op }: BarProps) {
    const t = useTranslations("try");

    return (
        <div
            data-stub="bar"
            data-op={op.id}
            className="fixed inset-x-0 bottom-0 z-20 border-t border-line-soft bg-page px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-bar desk:hidden"
        >
            <Button type="button" size="phone" aria-disabled="true" className="w-full">
                {t("bar")}
            </Button>
        </div>
    );
}
