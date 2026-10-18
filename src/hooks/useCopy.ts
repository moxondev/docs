import { useCallback, useEffect, useRef, useState } from "react";

export type CopyStatus = "idle" | "copied" | "failed";

export type CopySource = string | (() => string | Promise<string>);

export interface ClipboardLike {
    writeText: (text: string) => Promise<void>;
    write?: (items: ClipboardItem[]) => Promise<void>;
}

export interface CopyState {
    status: CopyStatus;
    copy: (source: CopySource) => Promise<void>;
    reset: () => void;
}

// Message of the common namespace for each status: the button label and its aria-live text
export const COPY_LABELS: Readonly<Record<CopyStatus, "copy" | "copied" | "copyFailed">> = {
    idle: "copy",
    copied: "copied",
    failed: "copyFailed",
};

// How long the copied or failed state lasts, in ms
export const COPY_MS = 2000;

/**
 * Writes text to the clipboard. Text produced later (the Markdown export fetched on click) goes
 * through a ClipboardItem holding a promise when the browser has one, so Safari keeps the user
 * gesture; otherwise, or when that write is refused, the text is awaited and written.
 *
 * @param source - The text, or a function giving it now or later
 * @param clipboard - Clipboard to write to, navigator.clipboard by default (tests inject one)
 * @returns "copied", or "failed" when the source rejects or the clipboard refuses the write
 */
export async function copyText(
    source: CopySource,
    clipboard?: ClipboardLike,
): Promise<"copied" | "failed"> {
    try {
        const target: ClipboardLike = clipboard ?? navigator.clipboard;
        const text = typeof source === "string" ? source : source();
        if (typeof text === "string") {
            await target.writeText(text);
            return "copied";
        }
        if (target.write && typeof ClipboardItem !== "undefined") {
            const blob = text.then((value) => new Blob([value], { type: "text/plain" }));
            const item = new ClipboardItem({ "text/plain": blob });
            const written = await target.write([item]).then(
                () => true,
                () => false,
            );
            if (written) return "copied";
        }
        await target.writeText(await text);
        return "copied";
    } catch {
        return "failed";
    }
}

/**
 * Copies text to the clipboard and exposes a short-lived status for the button feedback and
 * its aria-live announcement (common.copied); a newer copy replaces the status of an older one.
 *
 * @param duration - How long the copied or failed status lasts, in ms
 * @returns The status, the copy function and a reset back to idle
 */
export function useCopy(duration = COPY_MS): CopyState {
    const [status, setStatus] = useState<CopyStatus>("idle");
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const turn = useRef(0);

    useEffect(() => {
        const live = timer;
        return () => clearTimeout(live.current);
    }, []);

    const copy = useCallback(
        async (source: CopySource) => {
            turn.current += 1;
            const mine = turn.current;
            const next = await copyText(source);
            if (mine !== turn.current) return;
            setStatus(next);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setStatus("idle"), duration);
        },
        [duration],
    );

    const reset = useCallback(() => {
        turn.current += 1;
        clearTimeout(timer.current);
        setStatus("idle");
    }, []);

    return { status, copy, reset };
}
