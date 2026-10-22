import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { HOME_CARDS } from "@/data/home";
import { SITE } from "@/data/site";
import { LATEST } from "@/data/versions";
import { linkAttrs, resolveRef } from "@/lib/routes";
import type { Lang } from "@/types/content";

export interface FurtherProps {
    lang: Lang;
}

/**
 * The "Go further" band at the end of the home page: one bordered card per place worth a visit,
 * each with its title, an arrow that says whether it stays on the site, and one sentence. The cards
 * that leave the site open in a new tab and say so to screen readers.
 *
 * @param lang - Language of the page, which resolves the links of the site
 */
export function Further({ lang }: FurtherProps) {
    const t = useTranslations("home");
    const aria = useTranslations("aria");

    return (
        <section
            aria-labelledby="further-title"
            className="border-t border-line-soft pt-9 pb-10 home:pt-14 home:pb-16"
        >
            <h2
                id="further-title"
                className="mb-4 text-[21px]/tight font-semibold tracking-[-0.015em] text-ink home:mb-5 home:text-[22px]/tight"
            >
                {t("further.title")}
            </h2>
            <ul className="grid gap-2.5 home:grid-cols-2 home:gap-3 wide:grid-cols-5">
                {HOME_CARDS.map((card) => {
                    const Arrow = card.icon === "arrow-right" ? ArrowRightIcon : ArrowUpRightIcon;
                    const attrs = linkAttrs(resolveRef(card.to, { lang, version: LATEST }));

                    return (
                        <li key={card.id} className="home:last:max-wide:col-span-2">
                            <a
                                {...attrs}
                                className="group flex h-full flex-col gap-1.5 rounded-box border border-line px-4 py-3.5 text-ink hover:border-field hover:bg-soft home:min-h-24 home:p-4"
                            >
                                <span className="flex items-center justify-between gap-2 text-[16px] font-medium">
                                    {t(`further.${card.id}.title`)}
                                    <Arrow
                                        aria-hidden="true"
                                        className="size-3.75 shrink-0 text-faint group-hover:text-ink"
                                    />
                                </span>
                                <span className="text-[14px]/[1.5] text-muted">
                                    {t(`further.${card.id}.text`, { release: SITE.version })}
                                </span>
                                {attrs.target ? (
                                    <span className="sr-only">{aria("newTab")}</span>
                                ) : null}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
