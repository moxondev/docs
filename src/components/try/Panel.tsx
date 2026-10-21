"use client";

import { useTranslations } from "next-intl";
import { lazy, Suspense, useEffect, useRef } from "react";

import { Announcer } from "@/components/try/Announcer";
import { RequestForm, RequestLine } from "@/components/try/Form";
import { orFallback, whenIdle } from "@/components/try/prefetch";
import { Snippet } from "@/components/try/Snippet";
import { scrollBehavior } from "@/components/try/util";
import { useRequest } from "@/hooks/useRequest";
import { cn } from "@/lib/utils";
import type { TryProps } from "@/types/try";

// Width from which the panel is sticky in its own column, the wide breakpoint of globals.css
const WIDE = "(min-width: 80rem)";

/**
 * Shows the network notice in place of the answer view when its chunk cannot be loaded.
 */
function ResponseUnavailable() {
    const t = useTranslations("response");

    return (
        <p className="border-t border-code-line px-4 py-3.5 text-[14px] text-warn">
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
export const loadResponse = orFallback(
    () => import("@/components/try/Response").then((m) => m.Response),
    ResponseUnavailable,
);

/**
 * Answer view of the panel, loaded on demand.
 *
 * @param phase - State of the request machine
 * @param response - Last answer, null before the first one
 * @param retry - Seconds to wait on a 429, undefined otherwise
 * @param quiet - True for the quiet look; its colors come from the .code-quiet scope around it
 * @param onClear - Resets the request machine, which drops the answer and its blob URL
 */
export const Response = lazy(loadResponse);

/**
 * Body of the Try panel in the quiet look: the request line, the form built from Operation.params,
 * the code samples of the request that Send makes and the live answer. Below the wide layout the
 * code area is bounded, so a long answer never pushes the page away.
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
    const inline = variant === "inline";
    const answered = handle.phase !== "idle" || handle.response !== null;
    const output = useRef<HTMLDivElement>(null);

    useEffect(() => whenIdle(() => void loadResponse()), []);

    useEffect(() => {
        if (inline || handle.response === null || window.matchMedia(WIDE).matches) return;
        output.current?.scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
    }, [handle.response, inline]);

    return (
        <section
            aria-label={aria("tryPanel")}
            data-variant={variant}
            className={cn(
                "flex flex-col overflow-hidden rounded-table border border-panel-line bg-surface",
                inline && "my-4",
                !inline &&
                    "max-desk:hidden wide:sticky wide:top-22 wide:max-h-[calc(100dvh-7rem)] print:hidden",
            )}
        >
            <div className="flex shrink-0 items-center gap-2.5 border-b border-line-soft px-4 py-3">
                <span className="text-sm font-semibold text-ink">{t("title")}</span>
                <span className="grow" />
                <RequestLine method={op.method} path={`/${version}${op.path}`} />
            </div>
            <Announcer phase={handle.phase} response={handle.response} />
            <RequestForm
                op={op}
                handle={handle}
                pinned
                className={cn("shrink-4 p-4", op.params.length > 0 && "min-h-66")}
            />
            <div
                ref={output}
                className={cn(
                    "code-quiet min-h-40 flex-auto overflow-y-auto border-t border-line bg-search text-code-text",
                    inline ? "max-h-[70dvh]" : "max-wide:max-h-[70dvh]",
                )}
            >
                <Snippet request={handle.request} variant="quiet" className="min-h-30" />
                {answered ? (
                    <Suspense fallback={null}>
                        <Response
                            phase={handle.phase}
                            response={handle.response}
                            retry={handle.retry}
                            quiet
                            onClear={handle.reset}
                        />
                    </Suspense>
                ) : (
                    <p className="border-t border-line px-4 pt-3 pb-3.5 text-[13px] text-muted">
                        {answer("empty")}
                    </p>
                )}
            </div>
        </section>
    );
}
