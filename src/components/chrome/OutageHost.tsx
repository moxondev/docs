"use client";

import { lazy, Suspense } from "react";

/**
 * The outage alert as its own chunk: neither a script tag nor a preload of the page (React.lazy,
 * not next/dynamic, which would preload it), fetched when hydration reaches it.
 */
const Outage = lazy(() =>
    import("@/components/chrome/Outage").then((module) => ({ default: module.Outage })),
);

/**
 * Mounts the outage alert after hydration, so that the health check and its alert stay out of the
 * first load of every page; it draws nothing while the API answers.
 */
export function OutageHost() {
    return (
        <Suspense fallback={null}>
            <Outage />
        </Suspense>
    );
}
