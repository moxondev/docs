"use client";

import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import type { Method } from "@/types/content";
import type { TryProps } from "@/types/try";

/**
 * Picks the chip colors of an HTTP method: blue for GET, green for the methods with a body.
 *
 * @param method - Lower-case method of the operation
 * @returns Tailwind classes of the chip ground and text
 */
function methodTone(method: Method): string {
    return method === "get" ? "bg-get-bg text-get" : "bg-post-bg text-post";
}

/**
 * Placeholder of the Essayer panel: the real panel head (title, method chip, route) above an
 * empty dashed area, so that the page layout and the provider of the try messages are proven
 * at the mount site before the panel has its body.
 *
 * @param version - Documentation version, which is also the API version printed before the path
 * @param op - Operation of the panel; its method and path fill the head
 * @param variant - "panel" for the sticky desktop column, "inline" inside the content column
 * @param autoSend - True for the Getting Started form that sends itself once; only marked here
 */
export function Try({ version, op, variant = "panel", autoSend = false }: TryProps) {
    const t = useTranslations("try");
    const aria = useTranslations("aria");

    return (
        <section
            aria-label={aria("tryPanel")}
            data-stub="try"
            data-variant={variant}
            data-auto-send={autoSend || undefined}
            className={cn(
                "flex flex-col overflow-hidden rounded-panel border border-panel-line bg-surface shadow-panel",
                variant === "inline" && "my-4",
            )}
        >
            <div className="flex items-center gap-2.5 border-b border-line-soft px-4 py-3">
                <span className="text-sm font-semibold text-ink">{t("title")}</span>
                <span className="grow" />
                <span
                    className={cn(
                        "rounded-chip px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase",
                        methodTone(op.method),
                    )}
                >
                    {op.method}
                </span>
                <span className="font-mono text-xs text-muted">{`/${version}${op.path}`}</span>
            </div>
            <div className="m-4 h-40 rounded-box border border-dashed border-field bg-soft" />
        </section>
    );
}
