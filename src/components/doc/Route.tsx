"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Method } from "@/components/doc/Method";
import { useCopy } from "@/hooks/useCopy";
import type { Method as HttpMethod } from "@/types/content";

export interface RouteProps {
    method: HttpMethod;
    host: string;
    path: string;
}

/**
 * Route bar of an endpoint: the method chip, the API host in faint text and the versioned path in
 * ink, with a copy control. On a phone the whole bar is the button, so the URL is one tap away
 * and is not selected by accident; a long URL wraps between the host and the path.
 *
 * @param method - Method of the operation, in the chip
 * @param host - API origin, "https://api.moxon.dev"
 * @param path - Versioned path of the operation, "/v6/hash", placeholders such as :token kept
 */
export function Route({ method, host, path }: RouteProps) {
    const aria = useTranslations("aria");
    const common = useTranslations("common");
    const { status, copy } = useCopy();
    const url = `${host}${path}`;
    const Glyph = status === "copied" ? CheckIcon : CopyIcon;

    return (
        <div className="relative flex min-h-12 items-center gap-2.5 rounded-box border border-field bg-soft py-2 pr-11 pl-2 desk:min-h-0 desk:gap-3 desk:py-1.5 desk:pr-1.5">
            <Method methods={[method]} variant="chip" />
            <span className="min-w-0 flex-1 font-mono text-[14px]/[1.4] tracking-[-0.01em] wrap-break-word text-muted desk:truncate desk:text-sm desk:tracking-normal desk:text-faint">
                {host}
                <wbr />
                <span className="text-ink">{path}</span>
            </span>
            <button
                type="button"
                aria-label={aria("copyUrl", { url })}
                onClick={() => void copy(url)}
                className="absolute inset-0 flex items-center justify-end rounded-box pr-3.5 text-muted desk:static desk:size-7.5 desk:shrink-0 desk:justify-center desk:rounded-btn desk:border desk:border-field desk:bg-control desk:p-0 desk:hover:bg-control-hover desk:hover:text-ink"
            >
                <Glyph aria-hidden="true" className="size-4 desk:size-3.5" />
            </button>
            <span role="status" className="sr-only">
                {status === "copied"
                    ? common("copied")
                    : status === "failed"
                      ? common("copyFailed")
                      : ""}
            </span>
        </div>
    );
}
