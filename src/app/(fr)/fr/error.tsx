"use client";

import { ErrorPage, type ErrorPageProps } from "@/components/ErrorPage";

/**
 * Error boundary of the French pages: a page that fails to render shows the error screen under
 * the site header instead of a blank document.
 *
 * @param error - Error thrown while rendering the page
 * @param reset - Renders the page again
 */
export default function ErrorBoundary({ error, reset }: ErrorPageProps) {
    return <ErrorPage error={error} reset={reset} />;
}
