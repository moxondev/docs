"use client";

import { type SlimMeta, useSentinel } from "@/hooks/useSlim";

export interface SentinelProps {
    meta: SlimMeta;
}

/**
 * Invisible island of an endpoint page that has a Try operation: it watches the page title and
 * tells the headers to take their slim form, with the facts they print, once the title has
 * scrolled under the header. Other pages do not render it and keep the full header.
 *
 * @param meta - Name, category, back link and methods of the page, built by the server page so
 *   that the object keeps its identity across client renders
 */
export function Sentinel({ meta }: SentinelProps) {
    useSentinel(meta);
    return null;
}
