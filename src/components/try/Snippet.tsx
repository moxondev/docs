"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useMemo } from "react";

import { QUIET_TAB, tabId, TabList } from "@/components/try/Tabs";
import { Tokens } from "@/components/try/Tokens";
import { Button } from "@/components/ui/button";
import { useCodeLang } from "@/hooks/useCodeLang";
import { COPY_LABELS, useCopy } from "@/hooks/useCopy";
import { highlight, SNIPPET_HIGHLIGHT } from "@/lib/highlight";
import type { PreparedRequest } from "@/lib/request";
import { generateSnippet, isSnippetLang, SNIPPET_LANGS } from "@/lib/snippets";
import { cn } from "@/lib/utils";

export type SnippetVariant = "block" | "panel" | "quiet";

export interface SnippetProps {
    request: PreparedRequest;
    variant?: SnippetVariant;
    className?: string;
}

/**
 * Code area with the language tabs and the copy button, generated from the very request that Send
 * would make. The chosen language is shared by every Snippet and kept across pages under
 * moxon-code-lang (the static HTML shows cURL).
 *
 * @param request - Prepared request the snippets print; a new object re-renders the code
 * @param variant - "block" for the dark rounded block, "panel" for the dark flat area, "quiet" for
 * the flat area that follows the theme (see .code-quiet): grey tabs with the yellow underline, an
 * outlined copy button
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
    const quiet = variant === "quiet";
    const items = useMemo(
        () => SNIPPET_LANGS.map((id) => ({ id, label: t(`languages.${id}`) })),
        [t],
    );

    return (
        <div
            className={cn(
                quiet ? "code-quiet text-code-text" : "scroll-dark bg-code-bg text-code-text",
                variant === "block" && "overflow-hidden rounded-table",
                className,
            )}
        >
            <div
                className={cn(
                    "flex h-10.5 border-b border-code-line",
                    quiet ? "items-stretch pr-2 pl-1.5" : "items-center gap-0.5 px-2",
                )}
            >
                <TabList
                    items={items}
                    value={lang}
                    onChange={(id) => {
                        if (isSnippetLang(id)) setLang(id);
                    }}
                    label={aria("codeLanguage")}
                    panelId={panelId}
                    className={cn("flex grow", !quiet && "gap-0.5")}
                    tabClassName={
                        quiet
                            ? QUIET_TAB
                            : "relative h-7 min-w-11 rounded-row px-2.25 text-xs text-code-punct after:absolute after:inset-x-0 after:-inset-y-2.25 desk:min-w-0 desk:after:hidden transition-colors hover:text-code-sel aria-selected:bg-code-tab aria-selected:text-code-sel"
                    }
                />
                <Button
                    type="button"
                    variant={quiet ? "ghost" : "code"}
                    size="icon-xs"
                    aria-label={aria("copyCode")}
                    onClick={() => void copy(code)}
                    className={cn(
                        "relative after:absolute after:-inset-2.5 desk:after:hidden",
                        quiet && "self-center border border-field",
                    )}
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
                    className="overflow-x-auto px-4 py-3.5 font-mono text-[13.5px]/[1.7]"
                >
                    <Tokens lines={lines} />
                </pre>
            </div>
        </div>
    );
}
