import { type KeyLabel, useModKey } from "@/hooks/useModKey";
import { useShortcutLabels } from "@/hooks/useShortcuts";

export interface SearchHint {
    labels: KeyLabel[];
    shortcut: string;
}

/**
 * Gives the keys and the aria-keyshortcuts value of the search shortcut for the current platform,
 * shared by every control that opens the palette and shows its key.
 *
 * @returns The keys to print (Ctrl then K, or the Command key then K, which KeyLabels draws as the
 * Lucide icon, never as a Unicode glyph) and the aria-keyshortcuts value ("Control+K",
 * "Meta+K")
 */
export function useSearchHint(): SearchHint {
    const labels = useShortcutLabels("search");
    const keys = useModKey();

    return { labels, shortcut: `${keys.mod === "cmd" ? "Meta" : "Control"}+K` };
}
