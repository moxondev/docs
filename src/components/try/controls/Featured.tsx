"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

export interface FeaturedProps {
    values: string[];
    value: string;
    clearable: boolean;
    onPick: (value: string) => void;
}

/**
 * Row of toggle chips under a long enum field: the values that the data marks as featured, one
 * click each. The chip of the current value is on, and pressing it again clears an optional
 * parameter. The select above stays the control of reference, and the phone keeps it alone.
 *
 * @param values - Featured values, all of them options of the parameter, in the order of the data
 * @param value - Current value of the parameter, empty when none is chosen
 * @param clearable - True for an optional parameter, whose chip can be pressed off
 * @param onPick - Called with the value to set, or an empty string to clear it
 */
export function Featured({ values, value, clearable, onPick }: FeaturedProps) {
    const t = useTranslations("try");

    return (
        <div
            role="group"
            aria-label={t("common")}
            className="flex flex-wrap items-center gap-0.75 max-desk:hidden"
        >
            <span aria-hidden="true" className="text-xs text-muted">
                {t("common")}
            </span>
            {values.map((option) => {
                const on = option === value;

                return (
                    <button
                        key={option}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onPick(on && clearable ? "" : option)}
                        className={cn(
                            "h-7 cursor-pointer rounded-chip border px-1.75 font-mono text-xs transition-colors",
                            on
                                ? "border-chip-on-line bg-chip-on text-ink"
                                : "border-field bg-control text-muted hover:bg-control-hover hover:text-ink",
                        )}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
