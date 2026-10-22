import { FlaskConicalIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Base } from "@/components/home/Base";
import { Demo } from "@/components/home/Demo";
import { Button } from "@/components/ui/button";
import { SITE } from "@/data/site";
import { LATEST } from "@/data/versions";
import { href } from "@/lib/routes";
import type { Lang } from "@/types/content";

export interface HeroProps {
    lang: Lang;
    count: number;
}

/**
 * First screen of the home page: the title in the brand face, the lead with the number of
 * endpoints, the two calls to action, the base URL and the static example. The grid has two
 * columns on a wide screen and stacks below.
 *
 * @param lang - Language of the page, which picks the links
 * @param count - Number of endpoints the catalogue lists, computed from the data
 */
export function Hero({ lang, count }: HeroProps) {
    const t = useTranslations("home");

    return (
        <section className="pt-6.5 pb-10 home:pt-18 home:pb-20">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-8 wide:grid-cols-[minmax(0,1fr)_minmax(0,33.75rem)] wide:items-center wide:gap-18">
                <div>
                    <h1 className="font-brand text-[52px]/none font-extrabold tracking-[-0.04em] text-ink home:text-[72px]/none">
                        {t("title")}
                    </h1>
                    <p className="mt-3.5 max-w-130 text-[16px]/[1.6] text-text home:mt-5 home:text-[17px]/[1.65]">
                        {t("lead", { count })}
                    </p>
                    <div className="mt-5.5 flex flex-col gap-2.5 home:mt-7.5 home:flex-row home:flex-wrap">
                        <Button
                            asChild
                            size="phone"
                            className="home:h-11 home:rounded-box home:px-5.5"
                        >
                            <a href={href(lang, LATEST)}>{t("start")}</a>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="phone"
                            className="home:h-11 home:rounded-box home:px-4.5 [&_svg]:text-muted"
                        >
                            <a href={href(lang, LATEST, "playground")}>
                                <FlaskConicalIcon aria-hidden="true" />
                                {t("playground")}
                            </a>
                        </Button>
                    </div>
                    <Base host={SITE.api} path={`/${LATEST}`} />
                </div>
                <Demo />
            </div>
        </section>
    );
}
