import Link from "next/link";
import { hasLocale, useLocale, useTranslations } from "next-intl";

import { localePath, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export type LogoSize = "header" | "slim" | "phone";

export interface LogoProps {
    size?: LogoSize;
    href?: string;
    className?: string;
}

// Font size of the wordmark per place; the phone one gets an invisible 44 px hit area
const SIZES: Record<LogoSize, string> = {
    header: "text-[23px]/none",
    slim: "text-[20px]/none",
    phone: "relative text-[22px]/none after:absolute after:-inset-x-2 after:-inset-y-3 after:content-['']",
};

// The two halves of the wordmark, on each side of the clamp that draws the x
const HALVES = ["mo", "on"] as const;

/**
 * Two-jaw clamp drawn in place of the x of the wordmark, in units where the Bricolage x-height is
 * 100 (0.528 em) so that it sits on the baseline. It takes the text color, yellow in dark theme.
 */
function Clamp() {
    return (
        <svg
            viewBox="0 -34 140 134"
            fill="currentColor"
            aria-hidden="true"
            className="mx-[0.035em] inline-block h-[0.7075em] w-[0.7392em] align-baseline dark:text-hl"
        >
            <polygon points="0,0 32.69,0 50,40 50,60 32.69,100 0,100 21.64,50" />
            <rect x="59" y="-34" width="22" height="134" />
            <polygon points="140,0 107.31,0 90,40 90,60 107.31,100 140,100 118.36,50" />
        </svg>
    );
}

/**
 * The moxon wordmark, live text in Bricolage Grotesque 800 with the clamp for the x, linking to
 * the home of the reader's language: ink letters on a yellow swipe, or light letters and a
 * yellow clamp in dark theme. A visually hidden text names the link, as the letters read "mo on".
 *
 * @param size - Place of the logo: "header" (23 px), "slim" (20 px) or "phone" (22 px, with a
 *   44 px hit area)
 * @param href - Link target; the home of the current locale when omitted
 * @param className - Extra classes for the link, for its spacing in a header
 */
export function Logo({ size = "header", href, className }: LogoProps) {
    const locale = useLocale();
    const aria = useTranslations("aria");
    const home = hasLocale(routing.locales, locale) ? localePath(locale) : "/";

    return (
        <Link
            href={href ?? home}
            className={cn(
                "inline-flex shrink-0 items-baseline font-brand font-extrabold tracking-[-0.035em] text-ink hover:text-ink",
                SIZES[size],
                className,
            )}
        >
            <span className="sr-only">{aria("home")}</span>
            <span
                aria-hidden="true"
                className="rounded-xs bg-[linear-gradient(transparent_38%,var(--hl)_38%,var(--hl)_88%,transparent_88%)] px-[0.07em] box-decoration-clone dark:rounded-none dark:bg-none dark:px-[0.04em] dark:pt-[0.02em]"
            >
                {HALVES[0]}
                <Clamp />
                {HALVES[1]}
            </span>
        </Link>
    );
}
