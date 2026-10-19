"use client";

import { Check, Copy, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { MethodChip, RequestForm } from "@/components/try/Form";
import { ResponseBody, Status } from "@/components/try/Response";
import { restoreOpener, useSheet } from "@/components/try/store";
import { tabId, TabList } from "@/components/try/Tabs";
import { Tokens } from "@/components/try/Tokens";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { COPY_LABELS, useCopy } from "@/hooks/useCopy";
import type { RequestHandle } from "@/hooks/useRequest";
import { highlight } from "@/lib/highlight";
import { generateSnippet } from "@/lib/snippets";
import type { Operation, Version } from "@/types/content";

export type SheetView = "response" | "curl";

export interface SheetPanelProps {
    version: Version;
    op: Operation;
    name: string;
    handle: RequestHandle;
}

export interface OutputProps {
    handle: RequestHandle;
    view: SheetView;
    onView: (view: SheetView) => void;
}

/**
 * Dark output area of the sheet: a light bar with the Response and cURL views, the status and the
 * copy button, then either the answer or the cURL command of the form. The area scrolls into view
 * once an answer arrives, so it is never left below the fold.
 *
 * @param handle - State machine of the form, which owns the request and its answer
 * @param view - View shown, the answer or the cURL command
 * @param onView - Called with the view the reader picks
 */
function Output({ handle, view, onView }: OutputProps) {
    const t = useTranslations("response");
    const aria = useTranslations("aria");
    const common = useTranslations("common");
    const { status, copy } = useCopy();
    const area = useRef<HTMLDivElement>(null);
    const panelId = useId();
    const items = useMemo(
        () => (["response", "curl"] as const).map((id) => ({ id, label: t(`views.${id}`) })),
        [t],
    );
    const curl = useMemo(() => generateSnippet("curl", handle.request), [handle.request]);
    const lines = useMemo(() => highlight(curl, "bash"), [curl]);
    const text = view === "curl" ? curl : (handle.response?.body ?? "");
    const shown = handle.phase === "loading" || handle.response !== null;

    useEffect(() => {
        if (handle.phase === "done" || handle.phase === "error") {
            area.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }, [handle.phase]);

    return (
        <div ref={area} data-vaul-no-drag className="scroll-dark bg-code-bg pb-5.5 text-code-text">
            <div className="flex items-center gap-2.5 py-1.5 pr-1.5 pl-5">
                <TabList
                    items={items}
                    value={view}
                    onChange={(next) => onView(next as SheetView)}
                    label={aria("outputView")}
                    panelId={panelId}
                    className="flex gap-0.5 rounded-cta bg-code-tablist p-0.5"
                    tabClassName="relative h-8 rounded-btn px-3.5 text-[13px] text-code-punct after:absolute after:inset-x-0 after:-inset-y-1.5 aria-selected:bg-code-tabon aria-selected:text-code-sel"
                />
                <span className="grow" />
                {shown && view === "response" ? (
                    <Status
                        phase={handle.phase}
                        response={handle.response}
                        className="text-[13px]"
                    />
                ) : null}
                <Button
                    type="button"
                    variant="code"
                    size="icon-lg"
                    disabled={text === ""}
                    aria-label={aria(view === "curl" ? "copyCode" : "copyResponse")}
                    onClick={() => void copy(text)}
                    className="border-transparent [&_svg:not([class*='size-'])]:size-4"
                >
                    {status === "copied" ? (
                        <Check aria-hidden="true" />
                    ) : (
                        <Copy aria-hidden="true" />
                    )}
                </Button>
                <span role="status" className="sr-only">
                    {status === "idle" ? "" : common(COPY_LABELS[status])}
                </span>
            </div>
            <div role="tabpanel" id={panelId} aria-labelledby={tabId(panelId, view)}>
                {view === "curl" ? (
                    <pre
                        tabIndex={0}
                        className="overflow-x-auto px-5 pt-1.5 pb-4 font-mono text-[12.5px]/[1.75]"
                    >
                        <Tokens lines={lines} />
                    </pre>
                ) : null}
                {view === "response" && handle.response ? (
                    <ResponseBody
                        response={handle.response}
                        retry={handle.retry}
                        dim={handle.phase === "loading"}
                    />
                ) : null}
                {view === "response" && !handle.response ? (
                    <p className="px-5 pt-2 pb-2 text-xs text-code-dim">{t("empty")}</p>
                ) : null}
            </div>
        </div>
    );
}

/**
 * Body of the phone "Try it" sheet: a bottom drawer with a grab handle and a scrim, shown while
 * the shared sheet state is open. It holds the head (title, method, versioned path, close), the
 * same form as the desktop panel and the dark output area.
 *
 * @param version - Documentation version, which is also the API version of the request
 * @param op - Operation of the sheet, with try true
 * @param name - Endpoint name read in the dialog label ("Try the Hash endpoint")
 * @param handle - State machine of the form, owned by the Sheet so that closing keeps it
 */
export function SheetPanel({ version, op, name, handle }: SheetPanelProps) {
    const t = useTranslations("try");
    const aria = useTranslations("aria");
    const common = useTranslations("common");
    const { open, setOpen } = useSheet();
    const [view, setView] = useState<SheetView>("response");
    const [phase, setPhase] = useState(handle.phase);

    if (phase !== handle.phase) {
        setPhase(handle.phase);
        if (handle.phase === "loading") setView("response");
    }

    return (
        <Drawer open={open} onOpenChange={setOpen} autoFocus>
            <DrawerContent
                aria-describedby={undefined}
                onCloseAutoFocus={restoreOpener}
                className="bg-surface shadow-sheet data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-[calc(100dvh-3rem)] data-[vaul-drawer-direction=bottom]:rounded-t-sheet data-[vaul-drawer-direction=bottom]:border-t-0 desk:hidden"
            >
                <div className="flex shrink-0 items-center gap-2 pt-1 pr-1.5 pb-2 pl-5">
                    <DrawerTitle className="text-[17px] font-semibold text-ink">
                        <span aria-hidden="true">{t("title")}</span>
                        <span className="sr-only">{aria("trySheet", { name })}</span>
                    </DrawerTitle>
                    <MethodChip method={op.method} />
                    <span className="truncate font-mono text-xs text-muted">{`/${version}${op.path}`}</span>
                    <span className="grow" />
                    <DrawerClose asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-lg"
                            aria-label={common("close")}
                        >
                            <X aria-hidden="true" />
                        </Button>
                    </DrawerClose>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <RequestForm
                        op={op}
                        handle={handle}
                        touch
                        className="border-b border-line-soft px-5 pb-4"
                    />
                    <Output handle={handle} view={view} onView={setView} />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
