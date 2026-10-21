import { useEffect } from "react";

/**
 * Replaces a phrase of a document title, the way the 404 puts its French title in the template
 * of the English one ("Page not found - moxon" becomes "Page non trouvee - moxon").
 *
 * @param title - Current title of the document
 * @param from - Phrase to replace, as the build wrote it
 * @param to - Phrase that takes its place
 * @returns The title with the first occurrence of the phrase replaced, unchanged when it is absent
 */
export function swapTitle(title: string, from: string, to: string): string {
    return from === to ? title : title.replace(from, to);
}

/**
 * Keeps a phrase of the document title in another language than the one the build wrote. The
 * title is written again when the streamed metadata settles after hydration, so the swap is
 * applied now and again whenever the title changes under it.
 *
 * @param from - Phrase of the built title to replace
 * @param to - Phrase to show instead, null to leave the title alone
 */
export function useTitleSwap(from: string, to: string | null): void {
    useEffect(() => {
        if (to === null) return;
        const apply = () => {
            const next = swapTitle(document.title, from, to);
            if (next !== document.title) document.title = next;
        };
        apply();
        const observer = new MutationObserver(apply);
        observer.observe(document.head, { subtree: true, childList: true, characterData: true });
        return () => observer.disconnect();
    }, [from, to]);
}
