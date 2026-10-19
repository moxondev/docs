import { useTranslations } from "next-intl";

import type { DocContext } from "@/components/doc/context";
import { NEW_TAB_ID } from "@/components/doc/context";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/data/plans";
import { formatApprox, formatCount, formatPrice } from "@/lib/format";
import { linkAttrs } from "@/lib/routes";
import { cn } from "@/lib/utils";

export interface PlansProps {
    ctx: DocContext;
}

/**
 * Pricing plans of the pricing page, read from the plans catalog: name, price, the request limits
 * per hour, day, week, month and per 10 seconds, and the button of the plan. The recommended plan
 * is told by an ink border and a plain sentence, never by a pill.
 *
 * @param ctx - Context of the page: its language picks the names, the figures and the labels
 */
export function Plans({ ctx }: PlansProps) {
    const t = useTranslations("pricing");
    const { lang } = ctx;

    return (
        <ul className="grid gap-3 home:grid-cols-2 wide:grid-cols-4">
            {PLANS.map((plan) => {
                const limits = [
                    t("hour", { count: formatCount(plan.hour, lang) }),
                    t("day", { count: formatCount(plan.day, lang) }),
                    t("week", { count: formatCount(plan.week, lang) }),
                    t("month", { count: formatApprox(plan.month) }),
                    t("burst", { count: formatCount(plan.burst, lang) }),
                ];

                return (
                    <li
                        key={plan.id}
                        className={cn(
                            "flex flex-col gap-3 rounded-box border p-4",
                            plan.featured ? "border-ink" : "border-line",
                        )}
                    >
                        <p className="text-[13px] font-semibold tracking-[0.04em] text-ink">
                            {plan.name[lang]}
                        </p>
                        <p className="text-2xl/none font-semibold tracking-[-0.02em] text-ink">
                            {plan.price
                                ? `${formatPrice(plan.price.amount, lang)}${t("perMonth")}`
                                : t("free")}
                        </p>
                        <ul className="flex flex-col gap-1 text-[13px]/[1.5] text-text">
                            {limits.map((limit) => (
                                <li key={limit}>{limit}</li>
                            ))}
                        </ul>
                        {plan.featured ? (
                            <p className="text-[13px]/[1.5] text-muted">{t("featured")}</p>
                        ) : null}
                        <Button asChild className="mt-auto">
                            <a {...linkAttrs(plan.cta.href)} aria-describedby={NEW_TAB_ID}>
                                {plan.cta.label[lang]}
                            </a>
                        </Button>
                    </li>
                );
            })}
        </ul>
    );
}
