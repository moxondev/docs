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
 * The Try panel of an operation, or nothing when the operation has no live Try (try false). See
 * Panel for the panel itself.
 *
 * @param version - Documentation version, which is also the API version printed before the path
 * @param op - Operation of the panel; nothing renders unless its try flag is true
 * @param variant - "panel" for the sticky desktop column, "inline" inside the content column
 * @param autoSend - True for the Getting Started form that sends itself once on mount
 */
export function Try({ version, op, variant, autoSend }: TryProps) {
    if (!op.try) return null;
    return <Panel version={version} op={op} variant={variant} autoSend={autoSend} />;
}
