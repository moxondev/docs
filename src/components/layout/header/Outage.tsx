"use client";

import { CircleAlertIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { KINDS } from "@/data/kinds";
import { useApiStatus } from "@/hooks/useApiStatus";
import { hasPage, parsePath } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Alert shown while the API does not answer: a line under the header on a desktop, centered on the
 * content beside the sidebar, and a card that can be closed at the bottom of a phone screen. Its
 * live region stays mounted, empty, so that screen readers announce it when it fills.
 */
export function Outage() {
    const t = useTranslations("banner");
    const common = useTranslations("common");
    const { status, since } = useApiStatus();
    const [closed, setClosed] = useState<number | null>(null);
    const shown = status === "down" && since !== closed;
    const { version, slug } = parsePath(usePathname() ?? "/");
    const sidebar = version !== undefined && slug !== undefined && hasPage(KINDS, version, slug);

    return (
        <div role="status">
            {shown ? (
                <aside
                    aria-label={t("outage.title")}
                    data-outage
                    className={cn(
                        "fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-30 flex items-start gap-2.5 rounded-box border border-line bg-surface py-3 pr-2 pl-3.5 text-[14px]/5 text-ink shadow-palette desk:static desk:justify-center desk:rounded-none desk:border-x-0 desk:border-t-0 desk:px-12 desk:py-2.5 desk:shadow-none print:hidden [body:has([data-try-bar])_&]:bottom-[calc(84px+env(safe-area-inset-bottom))] desk:[body:has([data-try-bar])_&]:bottom-auto",
                        sidebar && "desk:pl-[calc(16.25rem+3rem)]",
                    )}
                >
                    <CircleAlertIcon
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-req"
                    />
                    <p className="min-w-0 flex-1 desk:flex-none">
                        <span className="font-semibold">{t("outage.title")}</span>{" "}
                        {t("outage.text")}
                    </p>
                    <button
                        type="button"
                        aria-label={common("close")}
                        onClick={() => setClosed(since)}
                        className="relative -my-1 inline-flex size-7 shrink-0 items-center justify-center rounded-row text-muted after:absolute after:-inset-2 hover:text-ink desk:hidden"
                    >
                        <XIcon aria-hidden="true" className="size-4" />
                    </button>
                </aside>
            ) : null}
        </div>
    );
}
