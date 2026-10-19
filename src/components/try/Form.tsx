"use client";

import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { KeyLabels } from "@/components/KeyLabels";
import { Control } from "@/components/try/Control";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useModKey } from "@/hooks/useModKey";
import type { RequestHandle } from "@/hooks/useRequest";
import { useShortcutLabels } from "@/hooks/useShortcuts";
import { cn } from "@/lib/utils";
import type { Method, Operation } from "@/types/content";

export interface MethodChipProps {
    method: Method;
    className?: string;
}

export interface RequestFormProps {
    op: Operation;
    handle: RequestHandle;
    touch?: boolean;
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
                "rounded-chip px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase",
                method === "get" ? "bg-get-bg text-get" : "bg-post-bg text-post",
                className,
            )}
        >
            {method}
        </span>
    );
}

/**
 * Yellow send button of the Try form: disabled until the required parameters are filled and
 * while a request is in flight, with a spinner then. On desktop it carries the shortcut hint as
 * words (Ctrl Enter, Cmd Enter), never a key glyph.
 *
 * @param handle - State machine of the form, which says whether it can send and does so
 * @param touch - True in the phone sheet: the 48 px button without a keyboard hint
 */
function SendButton({ handle, touch }: SendButtonProps) {
    const t = useTranslations("try");
    const common = useTranslations("common");
    const labels = useShortcutLabels("send");
    const keys = useModKey();
    const loading = handle.phase === "loading";
    const hint = labels
        .map((label) => ("word" in label ? common(`keys.${label.word}`) : label.text))
        .join(" ");
    const shortcut = `${keys.mod === "cmd" ? "Meta" : "Control"}+Enter`;

    return (
        <Button
            type="button"
            size={touch ? "phone" : "send"}
            disabled={!handle.canSend}
            aria-busy={loading}
            aria-keyshortcuts={touch ? undefined : shortcut}
            onClick={handle.send}
            className="w-full"
        >
            {loading ? <LoaderCircle aria-hidden="true" className="animate-spinner" /> : null}
            {loading ? t("sending") : t("send")}
            {touch ? null : (
                <Kbd
                    aria-hidden="true"
                    className="h-auto rounded-tag border-transparent bg-kbd-on-hl px-1.25 py-px text-on-hl"
                >
                    {hint}
                </Kbd>
            )}
        </Button>
    );
}

/**
 * Form of an operation: one Control per parameter of Operation.params, then the send button. Enter
 * in a text field and Ctrl or Cmd+Enter anywhere send, through the state machine; the form never
 * submits to the page itself.
 *
 * @param op - Operation whose parameters are the fields
 * @param handle - State machine of the form: values, issues, edit and send
 * @param touch - True in the phone sheet, which uses the 44 px sizes
 * @param className - Extra classes for the form, for its padding in the panel or the sheet
 */
export function RequestForm({ op, handle, touch = false, className }: RequestFormProps) {
    return (
        <form
            noValidate
            onSubmit={(event) => event.preventDefault()}
            onKeyDown={handle.onKeyDown}
            className={cn("flex flex-col", touch ? "gap-3" : "gap-3.5", className)}
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
            <SendButton handle={handle} touch={touch} />
        </form>
    );
}
