"use client";

import { SearchIcon } from "lucide-react";

import { preloadPalette } from "@/components/chrome/PaletteHost";
import { KeyLabels } from "@/components/KeyLabels";
import { Kbd } from "@/components/ui/kbd";
import { openPalette } from "@/hooks/usePalette";
import { useSearchHint } from "@/hooks/useSearchHint";
import { cn } from "@/lib/utils";

export interface SearchProps {
    term: string;
    label: string;
    placeholder: string;
    go: string;
}

/**
 * The large search field of the 404: a button that looks like a field and opens the search palette
 * with the last segment of the wrong address typed in, so that the first results are those of the
 * word the visitor was after. The key hint is left out on a phone, which has no shortcut to teach.
 *
 * @param term - Search term read from the address, the text of the field and the palette seed
 * @param label - Accessible name of the button, which says what the field searches
 * @param placeholder - Text of the field when the address holds no term
 * @param go - Label of the yellow button on the right of the field
 */
export function Search({ term, label, placeholder, go }: SearchProps) {
    const { labels, shortcut } = useSearchHint();

    return (
        <button
            type="button"
            aria-haspopup="dialog"
            aria-keyshortcuts={shortcut}
            aria-label={label}
            onClick={() => openPalette(term)}
            onPointerEnter={preloadPalette}
            onFocus={preloadPalette}
            className="group mt-6 flex h-14 w-full cursor-pointer items-center gap-3.5 rounded-2xl border border-field bg-page pr-2 pl-5 text-left text-lg text-ink shadow-panel hover:border-faint focus-visible:outline-offset-3 home:pl-6 home:text-xl"
        >
            <SearchIcon aria-hidden="true" className="size-5.5 shrink-0 text-muted" />
            <span className={cn("min-w-0 flex-1 truncate font-medium", !term && "text-faint")}>
                {term || placeholder}
            </span>
            <Kbd className="hidden shrink-0 home:inline-flex">
                <KeyLabels labels={labels} />
            </Kbd>
            <span className="inline-flex h-10 shrink-0 items-center rounded-cta bg-hl px-4 text-[15px] font-semibold text-on-hl group-hover:bg-hl-hover home:px-5.5 home:text-base">
                {go}
            </span>
        </button>
    );
}
