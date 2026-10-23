"use client";

import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { KeyLabels } from "@/components/KeyLabels";
import { Control } from "@/components/try/Control";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useFieldFocus } from "@/hooks/useFieldFocus";
import { useModKey } from "@/hooks/useModKey";
import type { RequestHandle } from "@/hooks/useRequest";
import { useShortcutLabels } from "@/hooks/useShortcuts";
import { cn } from "@/lib/utils";
import type { Method, Operation } from "@/types/content";

export interface MethodChipProps {
    method: Method;
    className?: string;
}

export interface RequestLineProps {
    method: Method;
    path: string;
    className?: string;
}

export interface RequestFormProps {
    op: Operation;
    handle: RequestHandle;
    touch?: boolean;
    pinned?: boolean;
    className?: string;
}

export interface SendButtonProps {
    handle: RequestHandle;
    touch: boolean;
}

/**
 * HTTP method of an operation as a small monospace chip: blue for GET, green for the methods that
 * carry a body, the colors of the URL bar of the endpoint page.
 *
 * @param method - Lower-case method, printed in capitals
 * @param className - Extra classes, for the size of the chip in the panel head or the sheet
 */
export function MethodChip({ method, className }: MethodChipProps) {
    return (
        <span
            className={cn(
                "rounded-chip px-1.5 py-0.5 font-mono text-[12px] font-semibold uppercase",
                method === "get" ? "bg-get-bg text-get" : "bg-post-bg text-post",
                className,
            )}
        >
            {method}
        </span>
    );
}

/**
 * Request line of the quiet Try panel and sheet: the colored method chip, as in the URL bar and
 * the sidebar of the page, then the versioned path in grey. The method is real information and
 * keeps its color; the rest of the panel is quiet.
 *
 * @param method - Lower-case method, printed in capitals
 * @param path - Versioned path of the operation, which truncates when the row is narrow
 * @param className - Extra classes, for the place of the line in the head
 */
export function RequestLine({ method, path, className }: RequestLineProps) {
    return (
        <span className={cn("flex min-w-0 items-center gap-2 font-mono text-[13px]", className)}>
            <MethodChip method={method} />
            <span className="truncate text-muted">{path}</span>
        </span>
    );
}

/**
 * Yellow send button of the Try form, yellow in every state: an incomplete form keeps it, and a
 * click then flags and focuses the first missing required field. Only a request in flight dims
 * it, with a spinner. The shortcut hint is plain words, never a key glyph.
 *
 * @param handle - State machine of the form, which sends, or flags the missing field
 * @param touch - True in the phone sheet: the 48 px button without a keyboard hint. The inline
 * form of a phone page gets the same height and hides the hint through the media query
 */
export function SendButton({ handle, touch }: SendButtonProps) {
    const t = useTranslations("try");
    const labels = useShortcutLabels("send");
    const keys = useModKey();
    const loading = handle.phase === "loading";
    const shortcut = `${keys.mod === "cmd" ? "Meta" : "Control"}+Enter`;

    return (
        <Button
            type="button"
            size={touch ? "phone" : "send"}
            disabled={loading}
            aria-busy={loading}
            aria-keyshortcuts={touch ? undefined : shortcut}
            onClick={handle.send}
            className="w-full rounded-field max-desk:h-12 disabled:bg-hl disabled:text-on-hl disabled:opacity-60"
        >
            {loading ? <LoaderCircle aria-hidden="true" className="animate-spinner" /> : null}
            <span className="inline-flex items-baseline gap-2.5">
                {loading ? t("sending") : t("send")}
                {touch ? null : (
                    <Kbd
                        aria-hidden="true"
                        className="h-auto min-w-0 border-0 bg-transparent p-0 text-on-hl/66 max-desk:hidden"
                    >
                        <KeyLabels labels={labels} />
                    </Kbd>
                )}
            </span>
        </Button>
    );
}

/**
 * Form of an operation: one Control per parameter of Operation.params, then the send button. Enter
 * in a text field and Ctrl or Cmd+Enter anywhere send, read before the field so a list does not
 * open on them; the form never submits to the page itself.
 *
 * @param op - Operation whose parameters are the fields
 * @param handle - State machine of the form: values, issues, edit and send
 * @param touch - True in the phone sheet, which uses the 44 px sizes
 * @param pinned - True in a box of limited height (the sticky panel): the fields scroll, with a
 * fade at their foot on a wide screen, and the send button stays in view below them
 * @param className - Extra classes for the form, for its padding in the panel or the sheet
 */
export function RequestForm({
    op,
    handle,
    touch = false,
    pinned = false,
    className,
}: RequestFormProps) {
    const form = useFieldFocus(handle.focus);

    return (
        <form
            ref={form}
            noValidate
            onSubmit={(event) => event.preventDefault()}
            onKeyDownCapture={handle.onKeyDown}
            className={cn("flex flex-col", touch ? "gap-3" : "gap-3.5", className)}
        >
            <div
                className={cn(
                    "flex flex-col",
                    touch ? "gap-3" : "gap-3.5",
                    pinned && "relative -m-1 min-h-0 flex-1 overflow-y-auto p-1 wide:fade-end",
                )}
            >
                {op.params.map((param) => (
                    <Control
                        key={param.name}
                        param={param}
                        value={handle.values[param.name] ?? ""}
                        issue={handle.issues[param.name]}
                        touch={touch}
                        onChange={handle.setValue}
                    />
                ))}
            </div>
            <SendButton handle={handle} touch={touch} />
        </form>
    );
}
