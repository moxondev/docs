import { ArrowDownIcon, ArrowUpIcon, CornerDownLeftIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Kbd } from "@/components/ui/kbd";

/**
 * Footer of the desktop palette: the keys that move, open and close, and at the right the two
 * method prefixes that filter the search. The keys are icons and words, never glyphs.
 */
export function Hints() {
    const t = useTranslations("search");
    const common = useTranslations("common");

    return (
        <div className="hidden h-11 shrink-0 items-center gap-4.5 border-t border-line bg-side pr-4 pl-5 text-[13.5px] text-muted desk:flex">
            <span className="flex items-center gap-1.5">
                <Kbd aria-hidden="true">
                    <ArrowUpIcon />
                </Kbd>
                <Kbd aria-hidden="true">
                    <ArrowDownIcon />
                </Kbd>
                {t("footer.navigate")}
            </span>
            <span className="flex items-center gap-1.5">
                <Kbd aria-hidden="true">
                    <CornerDownLeftIcon />
                </Kbd>
                {t("footer.open")}
            </span>
            <span className="flex items-center gap-1.5">
                <Kbd aria-hidden="true">{common("keys.escape")}</Kbd>
                {t("footer.close")}
            </span>
            <span className="ml-auto flex items-center gap-2">
                {t("footer.methodFilter")}
                <code className="font-mono text-xs text-ink">post:</code>
                <code className="font-mono text-xs text-ink">get:</code>
            </span>
        </div>
    );
}
