import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { layoutMetadata } from "@/app/root";
import { Header } from "@/components/chrome/Header";
import { CONTENT_ID, Shell } from "@/components/Shell";
import { loadMessages } from "@/i18n/request";
import { localePath } from "@/i18n/routing";

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
 * Minimal 404 of the static export: the English copy of the notfound messages under the same
 * Shell and header as every page, with a link home. It is exported as 404.html, which GitHub
 * Pages serves for every unknown address.
 */
export default async function GlobalNotFound() {
    setRequestLocale("en");
    const messages = await loadMessages("en");
    const copy = messages.notfound as Record<string, string>;

    return (
        <Shell locale="en" messages={messages} header={<Header />}>
            <main id={CONTENT_ID} tabIndex={-1} className="mx-auto max-w-205 px-6 pt-16 pb-18">
                <p className="font-mono text-sm text-faint">{copy.code}</p>
                <h1 className="mt-2 text-[36px]/[1.1] font-semibold text-ink">{copy.title}</h1>
                <p className="mt-4.5 text-base/[1.65] text-text">{copy.message}</p>
                <a className="prose-link mt-6 inline-block" href={localePath("en")}>
                    {copy.link}
                </a>
            </main>
        </Shell>
    );
}
