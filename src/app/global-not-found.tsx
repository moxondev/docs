import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { layoutMetadata } from "@/app/root";
import { Header } from "@/components/chrome/Header";
import { Topbar } from "@/components/chrome/Topbar";
import { countEntries, homeCatalogue } from "@/components/home/model";
import { NotFound, type NotFoundCopy } from "@/components/NotFound";
import { CONTENT_ID, Shell } from "@/components/Shell";
import { NAV } from "@/data/nav";
import { LATEST } from "@/data/versions";
import { loadMessages } from "@/i18n/request";
import { VIEWPORT } from "@/lib/metadata";

// Browser chrome colors of both color schemes, as in the root layouts, which this document lacks
export const viewport = VIEWPORT;

/**
 * Builds the metadata of the 404: the root defaults (icons, manifest, social card) with the
 * title in the site template and the not found description, since this document has no layout.
 *
 * @returns The metadata of the English 404 page
 */
export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations({ locale: "en", namespace: "meta" });
    return {
        ...(await layoutMetadata("en")),
        title: t("template").replace("%s", t("notFound.title")),
        description: t("notFound.description"),
    };
}

/**
 * The 404 of the static export, exported as 404.html: the English document under the same Shell
 * and headers as every page, whose NotFound island runs the smart redirect. The counts of the
 * places to go are read here, on the server, so that the page ships no navigation index.
 */
export default async function GlobalNotFound() {
    setRequestLocale("en");
    const messages = await loadMessages("en");
    const french = await loadMessages("fr");
    const categories = homeCatalogue(NAV, LATEST, "en");
    const stats = { count: countEntries(categories), categories: categories.length };
    const copy = {
        en: messages.notfound as unknown as NotFoundCopy,
        fr: french.notfound as unknown as NotFoundCopy,
    };

    return (
        <Shell
            locale="en"
            messages={messages}
            alternate={{ locale: "fr", messages: french }}
            header={
                <>
                    <Header />
                    <Topbar />
                </>
            }
        >
            <NotFound copy={copy} stats={stats} contentId={CONTENT_ID} />
        </Shell>
    );
}
