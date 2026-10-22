"use client";

import { SearchIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { preloadPalette } from "@/components/chrome/PaletteHost";
import { KeyLabels } from "@/components/KeyLabels";
import { Kbd } from "@/components/ui/kbd";
import { openPalette } from "@/hooks/usePalette";
import { useSearchHint } from "@/hooks/useSearchHint";
import { cn } from "@/lib/utils";

export type SearchbarVariant = "full" | "short" | "icon";

export interface SearchbarProps {
    variant?: SearchbarVariant;
    className?: string;
}

// Width of the field-looking trigger: it shrinks in the full header and is fixed in the short one
const WIDTHS: Record<Exclude<SearchbarVariant, "icon">, string> = {
    full: "shrink basis-120",
    short: "shrink-0 basis-57.5",
};

/**
 * Trigger of the search palette: a field-looking button in the desktop headers, an icon button on a
 * phone. It only opens the palette and starts fetching its chunk when the pointer or the focus
 * reaches it. The hint is written in words (Ctrl K, Cmd K), never with a key glyph.
 *
 * @param variant - "full" in the full desktop header, "short" in the slim one, "icon" on a phone
 * @param className - Extra classes for the button, for its place in a header
 */
export function Searchbar({ variant = "full", className }: SearchbarProps) {
    const t = useTranslations("header");
    const aria = useTranslations("aria");
    const { labels, shortcut } = useSearchHint();

    if (variant === "icon") {
        return (
            <button
                type="button"
                aria-label={aria("search")}
                aria-haspopup="dialog"
                aria-keyshortcuts={shortcut}
                onClick={() => openPalette()}
                onPointerEnter={preloadPalette}
                onFocus={preloadPalette}
                className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-field text-text hover:bg-chip hover:text-ink",
                    className,
                )}
            >
                <SearchIcon aria-hidden="true" className="size-5" />
            </button>
        );
    }

    return (
        <button
            type="button"
            aria-haspopup="dialog"
            aria-keyshortcuts={shortcut}
            onClick={() => openPalette()}
            onPointerEnter={preloadPalette}
            onFocus={preloadPalette}
            className={cn(
                "flex h-9 min-w-0 cursor-pointer items-center gap-2.5 rounded-cta border border-line bg-search pr-2 pl-3 text-sm text-faint hover:border-field",
                WIDTHS[variant],
                className,
            )}
        >
            <SearchIcon aria-hidden="true" className="size-4 shrink-0" />
            {variant === "short" ? (
                <span className="truncate">{t("searchShort")}</span>
            ) : (
                <>
                    <span className="truncate max-wide:hidden">{t("searchPlaceholder")}</span>
                    <span className="truncate wide:hidden">{t("searchShort")}</span>
                </>
            )}
            <Kbd className="ml-auto h-auto shrink-0 rounded-tag px-1.25 py-px leading-3.5 whitespace-nowrap">
                <KeyLabels labels={labels} />
            </Kbd>
        </button>
    );
}
