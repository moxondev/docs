import type { ComponentType } from "react";

// Delay in ms before the idle fallback of browsers without requestIdleCallback runs
const IDLE_FALLBACK_MS = 2000;

/**
 * Runs a loader once the browser is idle, so a lazy chunk (the response view, the phone sheet) is
 * already in the cache when the reader needs it, without counting in the first load of the page.
 *
 * @param load - Function that starts the dynamic import and ignores the result
 * @returns A function that cancels the pending run, for an effect cleanup
 */
export function whenIdle(load: () => void): () => void {
    if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(load);
        return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(load, IDLE_FALLBACK_MS);
    return () => window.clearTimeout(timer);
}

/**
 * Wraps the loader of a lazy component so that a chunk that cannot be fetched (the reader went
 * offline before the chunk was cached) renders a fallback instead of throwing a ChunkLoadError,
 * which would otherwise take the whole page down to its error boundary.
 *
 * @param load - Dynamic import that resolves to the component
 * @param fallback - Component rendered in place of the lazy one when the import fails
 * @returns A loader for React.lazy that never rejects, which idle prefetching can call as well
 */
export function orFallback<P>(
    load: () => Promise<ComponentType<P>>,
    fallback: ComponentType<P>,
): () => Promise<{ default: ComponentType<P> }> {
    return () =>
        load().then(
            (component) => ({ default: component }),
            () => ({ default: fallback }),
        );
}
