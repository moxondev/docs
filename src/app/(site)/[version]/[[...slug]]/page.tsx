import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { DocPage } from "@/components/doc/Page";
import { docMetadata, docParams, type DocProps, type DocRoute } from "@/lib/pages";

// Only the pages of the registry exist: any other version or slug is a 404 of the export
export const dynamicParams = false;

/**
 * Lists every documentation route to prerender, read from the registry of published pages.
 *
 * @returns One version and slug per page; the version home has an empty slug
 */
export function generateStaticParams(): DocRoute[] {
    return docParams();
}

/**
 * Builds the metadata of the English page: title, description, canonical URL and alternates.
 *
 * @param props - Route props of Next, whose params name the page
 * @returns The page metadata, empty for an unknown route
 */
export function generateMetadata(props: DocProps): Promise<Metadata> {
    return docMetadata("en", props);
}

/**
 * Route of every English documentation page: /vN/ and /vN/<page id>/.
 *
 * @param props - Route props of Next, whose params name the version and the page
 */
export default function Page(props: DocProps) {
    setRequestLocale("en");
    return <DocPage lang="en" params={props.params} />;
}
