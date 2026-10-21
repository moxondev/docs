"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import { Tokens } from "@/components/try/Tokens";
import {
    formatBytes,
    responseSize,
    statusAccent,
    statusLabel,
    statusTone,
} from "@/components/try/util";
import { Button } from "@/components/ui/button";
import type { RequestPhase } from "@/hooks/useRequest";
import { highlight } from "@/lib/highlight";
import { type ApiResponse, TIMEOUT_MS } from "@/lib/request";
import { cn } from "@/lib/utils";

export interface ResponseProps {
    phase: RequestPhase;
    response: ApiResponse | null;
    retry?: number;
    quiet?: boolean;
    onClear: () => void;
}

export interface StatusProps {
    phase: RequestPhase;
    response: ApiResponse | null;
    quiet?: boolean;
    className?: string;
}

export interface ResponseBodyProps {
    response: ApiResponse;
    retry?: number;
    dim?: boolean;
}

export interface HeaderListProps {
    headers: Record<string, string>;
}

/**
 * Status of the request in the response bar: the code with its reason phrase, "ERR" for a network
 * failure or a timeout, the sending label while in flight. It is only drawn: the live region of the
 * Announcer reads the same words, and a region created with its text is rarely announced.
 *
 * @param phase - State of the request machine
 * @param response - Last answer, null before the first one
 * @param quiet - True for the quiet look of the Try panel and sheet
 * @param className - Classes of the text size, which differs between the panel and the sheet
 */
export function Status({ phase, response, quiet = false, className }: StatusProps) {
    const t = useTranslations("response");
    const tryT = useTranslations("try");
    const loading = phase === "loading";
    const tone = response && !loading ? statusTone(response.status) : "ok";
    const answered = response !== null && !loading && response.kind !== "error";

    const words = answered ? (
        <>
            {response.status}
            <span className="max-[23rem]:hidden">{` ${response.statusText}`}</span>
        </>
    ) : (
        statusLabel(phase, response, { sending: tryT("sending"), error: t("statusError") })
    );

    if (quiet) {
        const failed = response !== null && !loading && statusAccent(response.status) === "req";

        return (
            <span
                aria-hidden="true"
                className={cn(
                    "text-[14px] font-semibold",
                    failed ? "text-req" : "text-ink",
                    loading && "animate-pulse-dot font-normal text-muted",
                    className,
                )}
            >
                {words}
            </span>
        );
    }

    return (
        <span
            aria-hidden="true"
            className={cn(
                "inline-flex items-center gap-1.75 font-mono",
                tone === "ok" ? "text-ok" : "text-warn",
                className,
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    "size-1.75 shrink-0 rounded-full",
                    tone === "ok" ? "bg-ok-dot" : "bg-warn-dot",
                    loading && "animate-pulse-dot",
                )}
            />
            {words}
        </span>
    );
}

/**
 * Disclosure list of the response headers the browser exposes (content type, rate limit, the
 * captcha token of the Captcha endpoint), closed by default so the body stays in view.
 *
 * @param headers - Lower-case header names with their values
 */
function HeaderList({ headers }: HeaderListProps) {
    const t = useTranslations("response");
    const entries = Object.entries(headers).sort(([a], [b]) => a.localeCompare(b));
    if (entries.length === 0) return null;

    return (
        <details className="group border-t border-code-line">
            <summary className="flex w-full cursor-pointer list-none items-center gap-1.5 px-4 py-2.5 text-xs text-code-dim hover:text-code-text max-desk:min-h-11 [&::-webkit-details-marker]:hidden">
                {t("headers")}
                <span className="font-mono">{entries.length}</span>
                <ChevronDown
                    aria-hidden="true"
                    className="ml-auto size-3.5 transition-transform group-open:rotate-180"
                />
            </summary>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 px-4 pb-3 font-mono text-[12.5px]/[1.6]">
                {entries.map(([name, value]) => (
                    <div key={name} className="col-span-2 grid grid-cols-subgrid">
                        <dt className="text-code-dim">{name}</dt>
                        <dd className="break-all text-code-text">{value}</dd>
                    </div>
                ))}
            </dl>
        </details>
    );
}

/**
 * Body of an answer, drawn according to its kind, with the Retry-After delay above it on a 429 and
 * the exposed headers below.
 *
 * @param response - Answer whose kind (JSON, text, image or failure) picks the rendering
 * @param retry - Seconds to wait read from Retry-After on a 429, undefined otherwise
 * @param dim - True while a newer request is in flight, so the old answer reads as stale
 */
export function ResponseBody({ response, retry, dim = false }: ResponseBodyProps) {
    const t = useTranslations("response");
    const tryT = useTranslations("try");
    const aria = useTranslations("aria");
    const lines = useMemo(
        () => (response.kind === "json" ? highlight(response.body, "json") : []),
        [response.kind, response.body],
    );

    return (
        <div className={cn("transition-opacity", dim && "opacity-60")}>
            {retry !== undefined ? (
                <p className="px-4 pt-3.5 text-[14px] text-warn">
                    {tryT("rateLimited", { seconds: retry })}
                </p>
            ) : null}
            {response.kind === "error" ? (
                <p className="px-4 py-3.5 text-[14px] text-warn">
                    {response.error === "timeout"
                        ? tryT("timeout", { seconds: TIMEOUT_MS / 1000 })
                        : t("networkError")}
                </p>
            ) : null}
            {response.kind === "json" ? (
                <pre
                    tabIndex={0}
                    className="overflow-x-auto px-4 pt-3.5 pb-4.5 font-mono text-[13.5px]/[1.7]"
                >
                    <Tokens lines={lines} wrap />
                </pre>
            ) : null}
            {response.kind === "text" && response.body !== "" ? (
                <pre
                    tabIndex={0}
                    className="overflow-x-auto px-4 pt-3.5 pb-4.5 font-mono text-[13.5px]/[1.7] break-words whitespace-pre-wrap"
                >
                    {response.body}
                </pre>
            ) : null}
            {response.kind === "image" && response.blobUrl ? (
                <div className="flex justify-center px-4 py-4">
                    <img
                        src={response.blobUrl}
                        alt={aria("responseImage")}
                        className="h-auto max-h-80 w-auto max-w-full rounded-row bg-surface object-contain"
                    />
                </div>
            ) : null}
            <HeaderList headers={response.headers} />
        </div>
    );
}

/**
 * Response area of the Try panel, mounted once a request was sent or is in flight: a bar with the
 * caption, the status, the metrics and the Clear button, then the answer body. The quiet look puts
 * the status and the metrics on a second row.
 *
 * @param phase - State of the request machine
 * @param response - Last answer, null before the first one
 * @param retry - Seconds to wait on a 429, undefined otherwise
 * @param quiet - True for the quiet look; its colors come from the .code-quiet scope around it
 * @param onClear - Resets the request machine, which drops the answer and its blob URL
 */
export function Response({ phase, response, retry, quiet = false, onClear }: ResponseProps) {
    const t = useTranslations("response");
    const common = useTranslations("common");
    const size = response ? responseSize(response) : null;
    const metrics =
        response && phase !== "loading" && response.kind !== "error"
            ? [t("duration", { ms: response.ms }), size === null ? "" : formatBytes(size)]
                  .filter(Boolean)
                  .join(", ")
            : null;
    const clear = (
        <Button
            type="button"
            variant={quiet ? "ghost" : "code"}
            size="xs"
            onClick={onClear}
            className={cn(
                "relative after:absolute after:-inset-3 desk:after:hidden",
                quiet && "h-6.5 rounded-row border border-field px-2.5 text-[13px]",
            )}
        >
            {common("clear")}
        </Button>
    );

    if (quiet) {
        return (
            <div className="border-t border-code-line">
                <div className="flex items-center gap-2.5 px-4 pt-2.5">
                    <span className="text-[13px] font-medium text-muted">{t("title")}</span>
                    <span className="grow" />
                    {clear}
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-4 pt-1.5">
                    <Status phase={phase} response={response} quiet />
                    {metrics === null ? null : (
                        <span className="font-mono text-[12.5px] text-faint">{metrics}</span>
                    )}
                </div>
                {response ? (
                    <ResponseBody response={response} retry={retry} dim={phase === "loading"} />
                ) : null}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2.5 border-y border-code-line bg-code-bar px-4 py-2.5 text-xs text-code-dim">
                <span className="font-medium tracking-[0.08em] uppercase">{t("title")}</span>
                <Status phase={phase} response={response} />
                {metrics === null ? null : <span className="font-mono">{metrics}</span>}
                <span className="grow" />
                {clear}
            </div>
            {response ? (
                <ResponseBody response={response} retry={retry} dim={phase === "loading"} />
            ) : null}
        </div>
    );
}
