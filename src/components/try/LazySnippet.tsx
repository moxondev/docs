"use client";

import { lazy, Suspense } from "react";

import type { SnippetProps } from "@/components/try/Snippet";
import { cn } from "@/lib/utils";

/**
 * The code area as its own chunk: neither a script tag nor a preload of the page (React.lazy, not
 * next/dynamic, which would preload it). The browser fetches the chunk when hydration reaches it.
 *
 * @param request - Prepared request the snippets print; a new object re-renders the code
 * @param variant - "block" for the rounded Code examples block, "panel" for the flat dark area,
 * "quiet" for the flat area that follows the theme
 * @param className - Extra classes for the root, for its place in a column
 */
const Snippet = lazy(() =>
    import("@/components/try/Snippet").then((m) => ({ default: m.Snippet })),
);

/**
 * Empty dark frame shown in place of the code area while its chunk is fetched: after a client
 * navigation, and for a moment on a hard load, where React streams the boundary as a hidden
 * block. It has the bar height and room for a few lines, so the page does not jump.
 *
 * @param variant - Same variant as the Snippet it stands for, which decides the rounded corners
 * @param className - Same extra classes as the Snippet, for its place in a column
 */
function SnippetFrame({ variant, className }: Pick<SnippetProps, "variant" | "className">) {
    return (
        <div
            aria-hidden="true"
            className={cn(
                "bg-code-bg",
                variant === "block" && "overflow-hidden rounded-table",
                className,
            )}
        >
            <div className="h-10.5 border-b border-code-line" />
            <div className="h-26" />
        </div>
    );
}

/**
 * The Snippet, loaded after hydration instead of with the page, so that its code (the generators,
 * the highlighter, the tabs) stays out of the first load. Inside a chunk that is already lazy, such
 * as the Try panel, use the Snippet itself rather than this wrapper.
 *
 * @param request - Prepared request the snippets print; a new object re-renders the code
 * @param variant - "block" for the rounded Code examples block, "panel" for the flat area
 * @param className - Extra classes for the root, for its place in a column
 */
export function LazySnippet({ request, variant = "block", className }: SnippetProps) {
    return (
        <Suspense fallback={<SnippetFrame variant={variant} className={className} />}>
            <Snippet request={request} variant={variant} className={className} />
        </Suspense>
    );
}
