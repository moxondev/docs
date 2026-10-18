import { useEffect } from "react";

import { createStore, useStore } from "@/hooks/useStore";
import type { Method } from "@/types/content";

export interface SlimMeta {
    name: string;
    category?: string;
    back?: string;
    methods: Method[];
}

export interface SlimState {
    slim: boolean;
    meta: SlimMeta | null;
}

export interface SentinelOptions {
    target?: string;
    offset?: number;
}

// State of a page without a sentinel: the full headers, desktop and phone, never a slim one
export const SLIM_NONE: SlimState = { slim: false, meta: null };

// Height of the full desktop header in px: the title counts as gone once it slides under it
export const HEADER_OFFSET = 60;

// Slim state, written by the Sentinel of a Try endpoint page and read by Header, Topbar and Bench
export const slimStore = createStore<SlimState>(SLIM_NONE);

/**
 * Tells whether an observed title has scrolled past the top edge of the visible area, as
 * opposed to being out of view below it.
 *
 * @param bottom - Bottom of the title, in px from the top of the viewport
 * @param edge - Top of the visible area in px: the bottom of the sticky header
 * @returns True once the whole title sits above the edge
 */
export function scrolledPast(bottom: number, edge: number): boolean {
    return bottom <= edge;
}

/**
 * Reads the header state published by the page: whether the title has left the view (slim
 * headers, desktop and phone) and what those headers show (crumb, method mark, back link).
 *
 * @returns The current state, SLIM_NONE in the static HTML and on pages without a sentinel
 */
export function useSlim(): SlimState {
    return useStore(slimStore);
}

/**
 * Observes the page title and publishes the slim state with the page facts, for the Sentinel
 * island of endpoint pages (it renders nothing). Unmounting restores SLIM_NONE, so the next
 * page starts with the full header.
 *
 * @param meta - Facts the slim headers show, built by the page on the server
 * @param options - Selector of the observed title ("main h1" by default) and the height of the
 * sticky header in px (HEADER_OFFSET by default)
 */
export function useSentinel(meta: SlimMeta, options: SentinelOptions = {}): void {
    const { target = "main h1", offset = HEADER_OFFSET } = options;

    useEffect(() => {
        slimStore.set({ slim: false, meta });
        const title = document.querySelector(target);
        if (!title || typeof IntersectionObserver === "undefined") {
            return () => slimStore.set(SLIM_NONE);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                const edge = entry.rootBounds?.top ?? offset;
                const slim =
                    !entry.isIntersecting && scrolledPast(entry.boundingClientRect.bottom, edge);
                slimStore.set((state) =>
                    state.slim === slim && state.meta === meta ? state : { slim, meta },
                );
            },
            { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 },
        );
        observer.observe(title);
        return () => {
            observer.disconnect();
            slimStore.set(SLIM_NONE);
        };
    }, [meta, target, offset]);
}
