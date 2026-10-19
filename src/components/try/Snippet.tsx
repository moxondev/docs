"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useMemo } from "react";

import { tabId, TabList } from "@/components/try/Tabs";
import { Tokens } from "@/components/try/Tokens";
import { Button } from "@/components/ui/button";
import { useCodeLang } from "@/hooks/useCodeLang";
import { COPY_LABELS, useCopy } from "@/hooks/useCopy";
import { highlight, SNIPPET_HIGHLIGHT } from "@/lib/highlight";
import type { PreparedRequest } from "@/lib/request";
import { generateSnippet, isSnippetLang, SNIPPET_LANGS } from "@/lib/snippets";
import { cn } from "@/lib/utils";

export type SnippetVariant = "block" | "panel";

export interface SnippetProps {
    request: PreparedRequest;
    variant?: SnippetVariant;
    className?: string;
}

/**
 * Dark code area with the language tabs and the copy button, generated from the very request that
 * Send would make. The chosen language is shared by every Snippet and kept across pages under
 * moxon-code-lang (the static HTML shows cURL).
 *
 * @param request - Prepared request the snippets print; a new object re-renders the code
 * @param variant - "block" for the rounded Code examples block, "panel" for the flat area under
 * the form of the Try panel
 * @param className - Extra classes for the root, for its place in a column
 */
export function Snippet({ request, variant = "block", className }: SnippetProps) {
    const aria = useTranslations("aria");
    const common = useTranslations("common");
    const t = useTranslations("snippet");
    const [lang, setLang] = useCodeLang();
    const { status, copy } = useCopy();
    const code = useMemo(() => generateSnippet(lang, request), [lang, request]);
    const lines = useMemo(() => highlight(code, SNIPPET_HIGHLIGHT[lang]), [code, lang]);
    const panelId = useId();
    const items = useMemo(
        () => SNIPPET_LANGS.map((id) => ({ id, label: t(`languages.${id}`) })),
        [t],
    );

    return (
        <div
            className={cn(
                "scroll-dark bg-code-bg text-code-text",
                variant === "block" && "overflow-hidden rounded-table",
                className,
            )}
        >
            <div className="flex h-10.5 items-center gap-0.5 border-b border-code-line px-2">
                <TabList
                    items={items}
                    value={lang}
                    onChange={(id) => {
                        if (isSnippetLang(id)) setLang(id);
                    }}
                    label={aria("codeLanguage")}
                    panelId={panelId}
                    className="flex grow gap-0.5"
                    tabClassName="h-7 rounded-row px-2.25 text-xs text-code-punct transition-colors hover:text-code-sel aria-selected:bg-code-tab aria-selected:text-code-sel"
                />
                <Button
                    type="button"
                    variant="code"
                    size="icon-xs"
                    aria-label={aria("copyCode")}
                    onClick={() => void copy(code)}
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
            <div role="tabpanel" id={panelId} aria-labelledby={tabId(panelId, lang)}>
                <pre
                    tabIndex={0}
                    className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px]/[1.7]"
                >
                    <Tokens lines={lines} />
                </pre>
            </div>
        </div>
    );
}
