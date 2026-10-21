import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export interface TipProps {
    sample: string;
    children: ReactNode;
}

// What each tip has the reader type: query syntax, the same in every language
const SAMPLES = {
    method: "post: hash",
    route: "/uuid",
    status: "400",
    param: "count",
} as const;

/**
 * One tip: a sample of what to type in a code chip, and what it does.
 *
 * @param sample - Text to type, printed in monospace
 * @param children - Explanation, in the language of the page
 */
function Tip({ sample, children }: TipProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <dt>
                <code className="rounded-tag bg-chip px-1.5 py-0.5 font-mono text-[13.5px] text-ink">
                    {sample}
                </code>
            </dt>
            <dd className="text-[14px]/[1.45] text-text">{children}</dd>
        </div>
    );
}

/**
 * Search tips of the preview pane, shown while no result is selected (nothing found, a suggestion
 * or another option selected), each with a sample to type.
 */
export function Tips() {
    const t = useTranslations("search");

    return (
        <section>
            <h3 className="mb-3.5 text-xs font-medium text-faint">{t("tips.title")}</h3>
            <dl className="flex flex-col gap-3.5">
                <Tip sample={SAMPLES.method}>
                    {t.rich("tips.method", {
                        code: (chunks) => (
                            <code className="rounded-tag bg-chip px-1 font-mono text-[13.5px] text-ink">
                                {chunks}
                            </code>
                        ),
                    })}
                </Tip>
                <Tip sample={SAMPLES.route}>{t("tips.route")}</Tip>
                <Tip sample={SAMPLES.status}>{t("tips.status")}</Tip>
                <Tip sample={SAMPLES.param}>{t("tips.param")}</Tip>
            </dl>
        </section>
    );
}
