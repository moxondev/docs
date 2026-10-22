import { type JsonLd as JsonLdData, jsonLdText } from "@/lib/metadata";

export interface JsonLdProps {
    data: JsonLdData;
}

/**
 * Structured data of a page as a JSON-LD script, which search engines read for the site name and
 * the breadcrumb. The text is escaped by jsonLdText, so nothing in the data can close the element.
 *
 * @param data - JSON-LD object from websiteJsonLd or breadcrumbJsonLd
 */
export function JsonLd({ data }: JsonLdProps) {
    return (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdText(data) }} />
    );
}
