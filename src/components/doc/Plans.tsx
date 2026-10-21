import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useId } from "react";

import type { DocContext } from "@/components/doc/context";
import { NEW_TAB_ID } from "@/components/doc/context";
import { barPercent } from "@/components/doc/scale";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/data/plans";
import { PLANS } from "@/data/plans";
import { formatApprox, formatCount, formatPrice } from "@/lib/format";
import { linkAttrs } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { Lang } from "@/types/content";

export interface PlansProps {
    ctx: DocContext;
}

interface StepProps {
    plan: Plan;
    base: string;
    lang: Lang;
    hasBurst: boolean;
    max: number;
}

interface CompareProps {
    base: string;
    lang: Lang;
    hasBurst: boolean;
}

type Limit = "hour" | "day" | "week" | "month" | "burst";

// Limits printed under the quota of each step, in reading order; the burst only exists from v4 on
const STEP_LIMITS: readonly Limit[] = ["day", "week", "month"];

// Rows of the comparison table, in reading order
const TABLE_LIMITS: readonly Limit[] = ["hour", "day", "week", "month"];

/**
 * Puts the figure of a quota sentence in its own element, so that the stylesheet can enlarge it
 * while a screen reader still reads the whole sentence in one piece.
 *
 * @param chunks - The figure, as the message writes it between the n tags
 * @returns The figure wrapped for the stylesheet
 */
function figure(chunks: ReactNode) {
    return <span className="plans-n">{chunks}</span>;
}

/**
 * Prints one limit of a plan: the count with the thousands separator of the language, the
 * monthly quota as the rounded figure.
 *
 * @param plan - Plan whose limit is printed
 * @param limit - Limit to print; "month" gives the rounded quota, the others the exact count with
 *   the thousands separator
 * @param lang - Language that picks the thousands separator
 * @returns The figure as text
 */
function count(plan: Plan, limit: Limit, lang: Lang): string {
    return limit === "month" ? formatApprox(plan.month) : formatCount(plan[limit], lang);
}

/**
 * Price of a priced plan, with the period in a small run so that the amount stays the loud part.
 *
 * @param plan - Plan whose price amount is printed; a plan without a price gives nothing
 * @param lang - Language that picks the decimal mark and the place of the euro sign
 */
function Price({ plan, lang }: { plan: Plan; lang: Lang }) {
    const t = useTranslations("pricing");
    if (!plan.price) return null;

    return (
        <>
            {formatPrice(plan.price.amount, lang)}
            <small>{t("perMonth")}</small>
        </>
    );
}

/**
 * One step of the ladder: the plan name and price, the recommended sentence, the button, the
 * hourly quota with a bar proportional to the largest quota, and the other limits as sentences.
 * The recommended sentence stays right after the name in the page order.
 *
 * @param plan - Plan whose name, price, quota and limits the step draws
 * @param base - Prefix of the ids of the page, so that two instances never share one
 * @param lang - Language of the names, the figures and the labels
 * @param hasBurst - Whether the burst limit is documented in this version
 * @param max - Largest hourly quota of the list, the length of a full bar
 */
function Step({ plan, base, lang, hasBurst, max }: StepProps) {
    const t = useTranslations("pricing");
    const free = !plan.price;
    const nameId = `${base}-name-${plan.id}`;
    const ctaId = `${base}-cta-${plan.id}`;
    const limits: readonly Limit[] = hasBurst ? [...STEP_LIMITS, "burst"] : STEP_LIMITS;

    return (
        <li className={cn("plans-step", free && "is-free", plan.featured && "is-pro")}>
            <div className="plans-head">
                {free ? (
                    <h3 id={nameId} className="plans-price">
                        {t("free")}
                    </h3>
                ) : (
                    <>
                        <h3 id={nameId} className="plans-name">
                            {plan.name[lang]}
                        </h3>
                        <p className="plans-price">
                            <Price plan={plan} lang={lang} />
                        </p>
                    </>
                )}
            </div>
            {plan.featured ? (
                <p className="plans-reco">
                    <span>{t("featured")}</span>
                </p>
            ) : null}
            <Button
                asChild
                variant={plan.featured ? "default" : "outline"}
                size="lg"
                className={
                    plan.featured
                        ? "plans-cta h-12 min-w-32 rounded-cta px-4 text-sm font-semibold desk:h-10"
                        : "plans-cta min-w-29 rounded-cta px-4 text-sm desk:h-9"
                }
            >
                <a
                    {...linkAttrs(plan.cta.href)}
                    aria-labelledby={`${ctaId} ${nameId}`}
                    aria-describedby={NEW_TAB_ID}
                >
                    <span id={ctaId}>{plan.cta.label[lang]}</span>
                    <ArrowUpRight aria-hidden="true" className="size-3.5 opacity-70" />
                </a>
            </Button>
            <p className="plans-hero">
                {t.rich("hour", { count: formatCount(plan.hour, lang), n: figure })}
            </p>
            <div className="plans-bar" aria-hidden="true">
                <svg>
                    <rect width={`${barPercent(plan.hour, max)}%`} height="100%" rx="6" />
                </svg>
            </div>
            <ul className="plans-sub">
                {limits.map((limit) => (
                    <li key={limit}>
                        {t.rich(limit, { count: count(plan, limit, lang), n: figure })}
                    </li>
                ))}
            </ul>
        </li>
    );
}

/**
 * Comparison of all the plans in one table, folded under a native disclosure: the limits are
 * named once in the first column and the figures line up on the right. The table scrolls inside
 * a focusable region when a long list of plans does not fit the column.
 *
 * @param base - Prefix of the ids of the page
 * @param lang - Language of the names, the figures and the labels
 * @param hasBurst - Whether the burst row is part of the table in this version
 */
function Compare({ base, lang, hasBurst }: CompareProps) {
    const t = useTranslations("pricing");
    const captionId = `${base}-caption`;
    const rows: readonly Limit[] = hasBurst ? [...TABLE_LIMITS, "burst"] : TABLE_LIMITS;

    return (
        <details className="plans-more">
            <summary className="plans-sum">
                <ChevronDown aria-hidden="true" className="plans-chev" />
                <span>{t("compare")}</span>
            </summary>
            <div className="plans-region" role="region" tabIndex={0} aria-labelledby={captionId}>
                <table className="plans-table">
                    <caption id={captionId} className="sr-only">
                        {t("caption")}
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col" className="plans-corner">
                                {t("requests")}
                            </th>
                            {PLANS.map((plan) => (
                                <th
                                    key={plan.id}
                                    scope="col"
                                    className={plan.featured ? "is-pro" : undefined}
                                >
                                    <span className="plans-pn">{plan.name[lang]}</span>
                                    {plan.price ? (
                                        <span className="plans-pp">
                                            <Price plan={plan} lang={lang} />
                                        </span>
                                    ) : null}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((limit) => (
                            <tr
                                key={limit}
                                className={
                                    limit === "hour"
                                        ? "is-hero"
                                        : limit === "burst"
                                          ? "is-burst"
                                          : undefined
                                }
                            >
                                <th scope="row">
                                    {t(`columns.${limit}`)}
                                    {limit === "burst" ? (
                                        <span className="plans-tag">{t("burstTag")}</span>
                                    ) : null}
                                </th>
                                {PLANS.map((plan) => (
                                    <td
                                        key={plan.id}
                                        className={plan.featured ? "is-pro" : undefined}
                                    >
                                        {count(plan, limit, lang)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </details>
    );
}

/**
 * Pricing plans of the pricing page, read from the plans catalog and drawn as a ladder of steps
 * with a comparison table folded under it. The recommended plan is told by a tinted ground, a
 * yellow bar and a plain sentence, never by a pill or a frame; burst figures exist only from v4.
 *
 * @param ctx - Context of the page: its language picks the names and figures, its version the burst
 */
export function Plans({ ctx }: PlansProps) {
    const t = useTranslations("pricing");
    const base = useId();
    const { lang, version } = ctx;
    const hasBurst = version !== "v1" && version !== "v2" && version !== "v3";
    const max = Math.max(...PLANS.map((plan) => plan.hour));

    return (
        <div className="plans">
            <div className="plans-frame">
                <ol className="plans-scale" role="list" aria-label={t("scale")}>
                    {PLANS.map((plan) => (
                        <Step
                            key={plan.id}
                            plan={plan}
                            base={base}
                            lang={lang}
                            hasBurst={hasBurst}
                            max={max}
                        />
                    ))}
                </ol>
                <Compare base={base} lang={lang} hasBurst={hasBurst} />
            </div>
        </div>
    );
}
