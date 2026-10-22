"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCopy } from "@/hooks/useCopy";

export interface BaseProps {
    host: string;
    path: string;
}

/**
 * Base URL bar of the home hero: the label, then the API host with the version path and a copy
 * control. On a phone the control is a 44 px square at the right end of the bar, on a desktop the
 * bordered button of the Route bar. The result of the copy is announced to screen readers.
 *
 * @param host - API origin, "https://api.moxon.dev"
 * @param path - Version path of the base URL, "/v6"
 */
export function Base({ host, path }: BaseProps) {
    const t = useTranslations("home");
    const aria = useTranslations("aria");
    const common = useTranslations("common");
    const { status, copy } = useCopy();
    const Glyph = status === "copied" ? CheckIcon : CopyIcon;

    return (
        <div className="mt-6 flex max-w-130 flex-col gap-2 home:mt-9">
            <span className="text-[14px] text-muted">{t("base")}</span>
            <div className="flex min-h-12 items-center gap-3 rounded-box border border-field bg-soft py-0.5 pr-0.5 pl-3.5 home:min-h-0 home:py-1.5 home:pr-1.5 home:pl-2">
                <span className="min-w-0 flex-1 truncate font-mono text-[14.5px] text-faint home:text-[16px]">
                    {host}
                    <span className="text-ink">{path}</span>
                </span>
                <button
                    type="button"
                    aria-label={aria("copyBaseUrl")}
                    onClick={() => void copy(`${host}${path}`)}
                    className="flex size-11 shrink-0 items-center justify-center rounded-btn text-muted hover:text-ink home:size-7.5 home:border home:border-field home:bg-control home:hover:bg-control-hover"
                >
                    <Glyph aria-hidden="true" className="size-4 home:size-3.5" />
                </button>
            </div>
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
