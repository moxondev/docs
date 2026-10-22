import Link from "next/link";
import { hasLocale, useLocale, useTranslations } from "next-intl";

import { localePath, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export type LogoSize = "header" | "phone";

export interface WordmarkProps {
    size?: LogoSize;
}

export interface LogoProps {
    size?: LogoSize;
}

// Font size of the wordmark: one for both forms of the desktop header, one for the phone headers
const SIZES: Record<LogoSize, string> = {
    header: "text-[23px]/none",
    phone: "text-[22px]/none",
};

// Invisible 44 px hit area of the phone logo, drawn around its link
const PHONE_HIT = "relative after:absolute after:-inset-x-2 after:-inset-y-3 after:content-['']";

// The two halves of the wordmark, on each side of the clamp that draws the x
const HALVES = ["mo", "on"] as const;

/**
 * Two-jaw clamp drawn in place of the x of the wordmark, in units where the Bricolage x-height is
 * 100 (0.528 em, which sets the em sizes) so that the shape sits on the baseline. It takes the
 * text color, yellow in the dark theme.
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
 * The moxon wordmark alone, live text in Bricolage Grotesque 800 with the clamp for the x. The
 * letters are a picture for assistive technologies (they would read "mo on"), so they are hidden
 * from them: whatever holds the wordmark names itself.
 *
 * @param size - Place of the wordmark, "header" for the desktop header or "phone", which picks its
 *   font size
 */
export function Wordmark({ size = "header" }: WordmarkProps) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "inline-flex shrink-0 items-baseline font-brand font-extrabold tracking-[-0.035em] text-ink",
                SIZES[size],
            )}
        >
            <span className="rounded-xs bg-[linear-gradient(transparent_38%,var(--hl)_38%,var(--hl)_88%,transparent_88%)] px-[0.07em] box-decoration-clone dark:rounded-none dark:bg-none dark:px-[0.04em] dark:pt-[0.02em]">
                {HALVES[0]}
                <Clamp />
                {HALVES[1]}
            </span>
        </span>
    );
}

/**
 * The moxon wordmark as a link to the home of the reader's language, for the slim header and the
 * phone headers (the header of a wide screen folds it into the version trigger, see Versions). A
 * visually hidden text names the link, so its name contains the word that the logo shows.
 *
 * @param size - Place of the logo, "header" for the slim desktop header or "phone" for the phone
 *   headers, whose link gets a larger hit area
 */
export function Logo({ size = "header" }: LogoProps) {
    const locale = useLocale();
    const aria = useTranslations("aria");
    const home = hasLocale(routing.locales, locale) ? localePath(locale) : "/";

    return (
        <Link
            href={home}
            className={cn("inline-flex shrink-0 hover:text-ink", size === "phone" && PHONE_HIT)}
        >
            <span className="sr-only">{aria("home")}</span>
            <Wordmark size={size} />
        </Link>
    );
}
