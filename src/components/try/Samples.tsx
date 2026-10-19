"use client";

import dynamic from "next/dynamic";

import type { SamplesProps } from "@/types/try";

/**
 * The code area, loaded as its own chunk and rendered on the server for the static HTML.
 */
const Snippet = dynamic(() => import("@/components/try/Snippet").then((m) => m.Snippet));

/**
 * The "Code examples" block of an endpoint page, on every viewport: the language tabs and the
 * copy button over the documented request. It is a Snippet, so the language chosen here is the
 * one the Try panel opens with, on this page and the next.
 *
 * @param request - Request of the examples block, prepared on the server by exampleRequest
 */
export function Samples({ request }: SamplesProps) {
    return <Snippet request={request} variant="block" />;
}
