import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { homeJsonLd, homeMetadata } from "@/app/root";
import { Home } from "@/components/home/Home";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * Builds the metadata of the English home: title, description with the endpoint count, canonical
 * URL, hreflang alternates and social cards.
 *
 * @returns The metadata of the home route
 */
export function generateMetadata(): Promise<Metadata> {
    return homeMetadata("en");
}

/**
 * English home page: the hero with the static example, the catalogue of the latest version, the
 * "Go further" cards and the footer, drawn by the Home component, with the WebSite structured data.
 */
export default async function Page() {
    setRequestLocale("en");

    return (
        <>
            <JsonLd data={await homeJsonLd("en")} />
            <Home lang="en" />
        </>
    );
}
