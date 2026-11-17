import { ArchiveIcon, FlaskConicalIcon, type LucideIcon, SproutIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PageStatus } from "@/types/content";

export interface StatusProps {
    status: PageStatus;
    variant?: "mark" | "icon";
    titled?: boolean;
    className?: string;
}

const ICONS: Record<PageStatus, LucideIcon> = {
    experimental: FlaskConicalIcon,
    beta: SproutIcon,
    deprecated: ArchiveIcon,
};

// Marker that carries the word: the yellow stays the mark of what is new, Deprecated is muted
const MARKS: Record<PageStatus, string> = {
    experimental: "bg-mark text-mark-ink",
    beta: "bg-mark-beta text-mark-ink shadow-[inset_0_-2px_0_var(--mark-beta-line)]",
    deprecated: "bg-dep-bg text-dep",
};

// Faint tint of the ink as ground, so the square shows on the yellow current row and in dark
const TONES: Record<PageStatus, string> = {
    experimental: "bg-exp/16 text-exp",
    beta: "bg-beta/16 text-beta",
    deprecated: "bg-dep/16 text-dep",
};

/**
 * Status of a page: the word on a marker where there is room, or the pictogram alone in dense
 * lists. The pictogram keeps the word as its accessible name and shows it in the site tooltip,
 * never the native title, which looks and times differently.
 *
 * @param status - "experimental", "beta" or "deprecated", the Page.status of the page
 * @param variant - "icon" for the pictogram in its square (default), "mark" for the word on a
 *   marker
 * @param titled - False where the surrounding row already names the status (a tooltip of the
 *   whole row, the preview pane of the search), so that no second tooltip shows
 * @param className - Extra classes for the wrapper, its margin, its size or its alignment in a row
 */
export function Status({ status, variant = "icon", titled = true, className }: StatusProps) {
    const t = useTranslations("common");
    const label = t(`status.${status}`);

    if (variant === "mark") {
        return (
            <span
                className={cn(
                    "inline-flex shrink-0 items-center rounded-tag px-1.75 py-0.75 align-middle text-[12.5px]/none font-medium whitespace-nowrap",
                    MARKS[status],
                    className,
                )}
            >
                {label}
            </span>
        );
    }

    const Glyph = ICONS[status];
    const icon = (
        <span
            role="img"
            aria-label={label}
            className={cn(
                "inline-flex size-4.5 shrink-0 items-center justify-center rounded-chip",
                TONES[status],
                className,
            )}
        >
            <Glyph aria-hidden="true" strokeWidth={2.25} className="size-3.5 text-current" />
        </span>
    );

    if (!titled) return icon;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{icon}</TooltipTrigger>
                <TooltipContent sideOffset={6}>{label}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
