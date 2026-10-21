"use client";

import dynamic from "next/dynamic";

import type { TryProps } from "@/types/try";

/**
 * The Try island (form, request machine and code samples) as its own chunk.
 * It is rendered on the server for the static HTML and fetched only by the pages that mount it,
 * so the pages without a Try carry none of its script.
 *
 * @param version - Documentation version, which is also the API version printed before the path
 * @param op - Operation of the panel, with try true; its method, path and params build the form
 * @param variant - "panel" for the sticky desktop column, "inline" inside the content column
 * @param autoSend - True for the Getting Started form that sends itself once on mount
 */
const Panel = dynamic(() => import("@/components/try/Panel").then((m) => m.Panel));

/**
 * The Playground bench, an island of its own.
 * The pages with a plain panel do not carry its layout.
 *
 * @param version - Documentation version, which is also the API version printed before the path
 * @param op - Operation of the bench, with try true
 * @param docsHref - Address of the documentation page of the operation
 */
const Bench = dynamic(() => import("@/components/try/Bench").then((m) => m.Bench));

/**
 * The Try panel of an operation, or nothing when the operation has no live Try (try false). See
 * Panel for the panel itself.
 *
 * @param version - Documentation version, which is also the API version printed before the path
 * @param op - Operation of the panel; nothing renders unless its try flag is true
 * @param variant - "panel" for the sticky desktop column, "inline" inside the content column,
 * "bench" for the two-column Playground
 * @param autoSend - True for the Getting Started form that sends itself once on mount
 * @param docsHref - The "bench" variant only: address of the documentation page of the operation
 */
export function Try({ version, op, variant, autoSend, docsHref }: TryProps) {
    if (!op.try) return null;
    if (variant === "bench") {
        return <Bench version={version} op={op} docsHref={docsHref ?? ""} />;
    }
    return <Panel version={version} op={op} variant={variant} autoSend={autoSend} />;
}
