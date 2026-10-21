"use client";

import { useTranslations } from "next-intl";
import { Suspense, useEffect } from "react";

import { Announcer } from "@/components/try/Announcer";
import { BenchForm } from "@/components/try/BenchForm";
import { DocsLink } from "@/components/try/DocsLink";
import { MethodChip } from "@/components/try/Form";
import { loadResponse, Response } from "@/components/try/Panel";
import { whenIdle } from "@/components/try/prefetch";
import { Snippet } from "@/components/try/Snippet";
import { useRequest } from "@/hooks/useRequest";
import { useSlim } from "@/hooks/useSlim";
import { cn } from "@/lib/utils";
import type { BenchBodyProps, BenchProps } from "@/types/try";

export interface IdleProps {
    title: string;
    hint: string;
}

/**
 * Response area before any request was sent: the caption bar on a wide screen, then the hint.
 * Below the wide layout, where the code area shows the answer under the code, only the hint
 * remains, as in the other Try panels.
 *
 * @param title - Caption of the response bar
 * @param hint - Sentence that says what to do to see an answer
 */
function Idle({ title, hint }: IdleProps) {
    return (
        <div>
            <div className="hidden items-center border-y border-code-line bg-code-bar px-4 py-2.5 text-xs text-code-dim wide:flex">
                <span className="font-medium tracking-[0.08em] uppercase">{title}</span>
            </div>
            <p className="border-t border-code-line px-4 py-3 text-xs text-code-dim wide:border-t-0 wide:py-5">
                {hint}
            </p>
        </div>
    );
}

/**
 * Everything of the bench that depends on the operation: the route bar, the form and the output
 * card, as two grid items. On a wide screen the answer comes first through CSS order only, so the
 * document order stays code then answer; without parameters the code leads until a send.
 *
 * @param version - Documentation version, which is also the API version printed before the path
 * @param op - Operation of the bench, with try true
 * @param docsHref - Address of its documentation page
 */
function BenchBody({ version, op, docsHref }: BenchBodyProps) {
    const t = useTranslations("try");
    const aria = useTranslations("aria");
    const answer = useTranslations("response");
    const handle = useRequest(version, op);
    const { slim } = useSlim();
    const answered = handle.phase !== "idle" || handle.response !== null;
    const responseFirst = answered || op.params.length > 0;
    const host = /^https?:\/\/([^/?#]+)/.exec(handle.request.url)?.[1] ?? "";
    const path = `/${version}${op.path}`;

    useEffect(() => whenIdle(() => void loadResponse()), []);

    return (
        <>
            <div className="hidden h-11 min-w-0 items-center gap-3 rounded-box border border-field bg-soft pr-4 pl-3 wide:flex">
                <MethodChip method={op.method} />
                <span className="min-w-0 flex-1 truncate font-mono text-sm text-faint">
                    {host}
                    <span className="text-ink">{path}</span>
                </span>
                <DocsLink href={docsHref} />
            </div>
            <section
                aria-label={aria("tryPanel")}
                data-variant="bench"
                className="my-4 flex flex-col overflow-hidden rounded-panel border border-panel-line bg-surface shadow-panel wide:col-span-2 wide:my-0 wide:grid wide:grid-cols-subgrid wide:items-start wide:overflow-visible wide:rounded-none wide:border-0 wide:bg-transparent wide:shadow-none print:hidden"
            >
                <div className="flex shrink-0 items-center gap-2.5 border-b border-line-soft px-4 py-3 wide:hidden">
                    <span className="text-sm font-semibold text-ink">{t("title")}</span>
                    <span className="grow" />
                    <MethodChip method={op.method} />
                    <span className="font-mono text-xs text-muted">{path}</span>
                </div>
                <BenchForm op={op} handle={handle} />
                <div
                    role="group"
                    aria-label={t("output")}
                    className={cn(
                        "scroll-dark max-h-[70dvh] min-h-40 flex-1 overflow-y-auto border-t border-code-edge bg-code-bg text-code-text wide:sticky wide:flex wide:min-h-0 wide:flex-col wide:overflow-hidden wide:rounded-panel wide:border wide:shadow-panel",
                        slim
                            ? "wide:top-20 wide:max-h-[calc(100dvh-6.5rem)]"
                            : "wide:top-22 wide:max-h-[calc(100dvh-7rem)]",
                    )}
                >
                    <Announcer phase={handle.phase} response={handle.response} />
                    <div
                        className={cn(
                            "wide:min-h-40 wide:flex-1 wide:overflow-y-auto",
                            responseFirst
                                ? "wide:order-2 wide:border-t wide:border-code-line"
                                : "wide:order-1",
                        )}
                    >
                        <Snippet request={handle.request} variant="panel" className="min-h-30" />
                    </div>
                    <div
                        className={cn(
                            "wide:max-h-[50dvh] wide:shrink-0 wide:overflow-y-auto wide:[&>div>div:first-child]:sticky wide:[&>div>div:first-child]:top-0 wide:[&>div>div:first-child]:z-10",
                            responseFirst
                                ? "wide:order-1 wide:[&>div>div:first-child]:border-t-0"
                                : "wide:order-2",
                        )}
                    >
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
                            <Idle title={answer("title")} hint={answer("empty")} />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

/**
 * Bench of one operation, keyed by it so that another endpoint starts from its own presets. The
 * endpoint picker and the grid around it belong to the Playground, which keeps the picker mounted
 * (and focused) while this part loads and changes.
 *
 * @param version - Documentation version, which is also the API version printed before the path
 * @param op - Operation of the bench, with try true
 * @param docsHref - Address of the documentation page of the operation
 */
export function Bench({ version, op, docsHref }: BenchProps) {
    return (
        <BenchBody key={`${op.method} ${op.path}`} version={version} op={op} docsHref={docsHref} />
    );
}
