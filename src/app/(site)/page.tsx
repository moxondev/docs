import { getTranslations, setRequestLocale } from "next-intl/server";

import { listedCount } from "@/app/root";
import { CONTENT_ID } from "@/components/Shell";
import { LATEST } from "@/data/versions";
import { href } from "@/lib/routes";

/**
 * Placeholder of the English home: the title, the lead with the computed number of endpoints and
 * the link to the first page of the latest version.
 */
export default async function Page() {
    setRequestLocale("en");
    const t = await getTranslations({ locale: "en", namespace: "home" });

    return (
        <main
            id={CONTENT_ID}
            tabIndex={-1}
            className="mx-auto max-w-205 px-6 pt-16 pb-18 desk:px-12"
        >
            <h1 className="text-[40px]/[1.1] font-semibold tracking-[-0.025em] text-ink">
                {t("title")}
            </h1>
            <p className="mt-4.5 text-base/[1.65] text-text">
                {t("lead", { count: listedCount() })}
            </p>
            <a className="prose-link mt-6 inline-block" href={href("en", LATEST)}>
                {t("start")}
            </a>
        </main>
    );
}
