"use client";

import { useTranslations } from "next-intl";
import { lazy, Suspense, useEffect } from "react";

import { MethodChip, RequestForm } from "@/components/try/Form";
import { orFallback, whenIdle } from "@/components/try/prefetch";
import { Snippet } from "@/components/try/Snippet";
import { useRequest } from "@/hooks/useRequest";
import { useSlim } from "@/hooks/useSlim";
import { cn } from "@/lib/utils";
import type { TryProps } from "@/types/try";

/**
 * Shows the network notice in place of the answer view when its chunk cannot be loaded.
 */
function ResponseUnavailable() {
    const t = useTranslations("response");

    return (
        <p className="border-t border-code-line px-4 py-3.5 text-[13px] text-warn">
            {t("networkError")}
        </p>
    );
}

/**
 * Loads the answer view, which is only needed once a request was sent. The same loader serves the
 * idle prefetch and the lazy component, so both ask for the very same chunk.
 *
 * @returns The module of the answer view, or of its stand-in when the chunk cannot be fetched
 */
const loadResponse = orFallback(
    () => import("@/components/try/Response").then((m) => m.Response),
    ResponseUnavailable,
);

/**
 * Answer view of the panel, loaded on demand.
 *
 * @param phase - State of the request machine
 * @param response - Last answer, null before the first one
 * @param retry - Seconds to wait on a 429, undefined otherwise
 * @param onClear - Resets the request machine, which drops the answer
 */
const Response = lazy(loadResponse);

/**
 * Body of the Try panel: the method and versioned path, the form built from Operation.params, the
 * code samples of the request that Send makes and the live answer. The "panel" variant is the
 * sticky desktop column, hidden on narrow screens; the "inline" one sits in the content column.
 *
 * @param version - Documentation version, which is also the API version printed before the path
 * @param op - Operation of the panel, with try true; its method, path and params build the form
 * @param variant - "panel" for the sticky desktop column, "inline" inside the content column
 * @param autoSend - True for the Getting Started form that sends itself once on mount
 */
export function Panel({ version, op, variant = "panel", autoSend = false }: TryProps) {
    const t = useTranslations("try");
    const aria = useTranslations("aria");
    const answer = useTranslations("response");
    const handle = useRequest(version, op, { autoSend });
    const { slim } = useSlim();
    const inline = variant === "inline";
    const answered = handle.phase !== "idle" || handle.response !== null;

    useEffect(() => whenIdle(() => void loadResponse()), []);

    return (
        <section
            aria-label={aria("tryPanel")}
            data-variant={variant}
            className={cn(
                "flex flex-col overflow-hidden rounded-panel border border-panel-line bg-surface shadow-panel",
                inline && "my-4",
                !inline && "max-desk:hidden wide:sticky",
                !inline &&
                    (slim
                        ? "wide:top-20 wide:max-h-[calc(100dvh-6.5rem)]"
                        : "wide:top-22 wide:max-h-[calc(100dvh-7rem)]"),
            )}
        >
            <div className="flex shrink-0 items-center gap-2.5 border-b border-line-soft px-4 py-3">
                <span className="text-sm font-semibold text-ink">{t("title")}</span>
                <span className="grow" />
                <MethodChip method={op.method} />
                <span className="font-mono text-xs text-muted">{`/${version}${op.path}`}</span>
            </div>
            <RequestForm op={op} handle={handle} className="shrink-0 p-4" />
            <div className="scroll-dark min-h-0 flex-1 overflow-y-auto border-t border-code-edge bg-code-bg text-code-text">
                <Snippet request={handle.request} variant="panel" className="min-h-30" />
                {answered ? (
                    <Suspense fallback={null}>
                        <Response
                            phase={handle.phase}
                            response={handle.response}
                            retry={handle.retry}
                            onClear={handle.reset}
                        />
                    </Suspense>
                ) : (
                    <p className="border-t border-code-line px-4 py-3 text-xs text-code-dim">
                        {answer("empty")}
                    </p>
                )}
            </div>
        </section>
    );
}
