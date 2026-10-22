import type { MetadataRoute } from "next";

import { NAV } from "@/data/nav";
import { sitemapEntries } from "@/lib/sitemap";

// The export writes sitemap.xml once, at build time
export const dynamic = "force-static";

/**
 * Builds /sitemap.xml: the two homes and every documentation page in both languages, with the
 * hreflang alternates of each and the update date of the page.
 *
 * @returns The sitemap entries read from the navigation index
 */
export default function sitemap(): MetadataRoute.Sitemap {
    return sitemapEntries(NAV);
}
