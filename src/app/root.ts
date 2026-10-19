import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { CATALOGUE } from "@/data/catalogue";
import { LATEST } from "@/data/versions";
import { type MetaText, rootMetadata } from "@/lib/metadata";
import { isListed } from "@/lib/nav";
import type { Lang } from "@/types/content";

type MetaTranslate = Awaited<ReturnType<typeof getTranslations<"meta">>>;

/**
 * Counts the endpoints that the latest version lists, the figure of the home lead and of the
 * default meta description (computed from the catalogue, never typed).
 *
 * @returns The number of catalogue entries listed in the latest version
 */
export function listedCount(): number {
    return CATALOGUE.filter((entry) => isListed(entry, LATEST)).length;
}

/**
 * Reads the site-wide words of the meta messages that every metadata builder needs.
 *
 * @param t - Translator of the meta namespace of a language
 * @returns The site name and the title template
 */
function metaText(t: MetaTranslate): MetaText {
    return { siteName: t("siteName"), template: t("template") };
}

/**
 * Builds the metadata that every page of a root layout inherits: base URL, title template,
 * default title and description of the home, icons, manifest and social card defaults.
 *
 * @param lang - Language of the root layout, which picks the meta messages
 * @returns The base URL, title template, icons and social card defaults
 */
export async function layoutMetadata(lang: Lang): Promise<Metadata> {
    const t = await getTranslations({ locale: lang, namespace: "meta" });
    return rootMetadata(lang, metaText(t), {
        title: t("home.title"),
        description: t("home.description", { count: listedCount() }),
    });
}
