import { LOCALE_TAGS } from "@/i18n/routing";
import type { Lang } from "@/types/content";

/**
 * Thousands separator: a plain space in French and a comma in English, never the narrow no-break
 * space of Intl, so that the figures read as on the former site.
 */
const GROUP: Readonly<Record<Lang, string>> = { en: ",", fr: " " };

/**
 * Formats a count with the thousands separator of the pricing cards and tables.
 *
 * @param n - Number to print; a fraction keeps its decimal point
 * @param lang - Language, which picks the separator
 * @returns "2,000" in English, "2 000" in French
 */
export function formatCount(n: number, lang: Lang): string {
    const [whole, fraction] = String(Math.abs(n)).split(".");
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP[lang]);
    return `${n < 0 ? "-" : ""}${grouped}${fraction ? `.${fraction}` : ""}`;
}

/**
 * Formats a large count as a rounded figure in millions (the monthly quota).
 *
 * @param n - Number of requests
 * @returns "~1.4M" style, one decimal at most, the same in both languages
 */
export function formatApprox(n: number): string {
    return `~${Math.round(n / 1e5) / 10}M`;
}

/**
 * Formats a price in euros the way each language reads it: in French a decimal comma and the euro
 * sign after a no-break space, in English the sign first. Only the rendering changes: the amount
 * of the plans catalog stays a plain number.
 *
 * @param amount - Price in euros, such as 2.99; two decimals unless it is a whole number
 * @param lang - Language, which picks the decimal mark and places the euro sign
 * @returns The price text, to which the caller appends the period ("/month")
 */
export function formatPrice(amount: number, lang: Lang): string {
    const euro = String.fromCodePoint(0x20ac);
    const figure = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
    if (lang === "fr") return `${figure.replace(".", ",")}${String.fromCodePoint(0xa0)}${euro}`;
    return `${euro}${figure}`;
}

/**
 * Formats a calendar date of the content (the last updated line) in UTC, so that the time zone of
 * the build machine never shifts the day.
 *
 * @param iso - Date as YYYY-MM-DD, as stored in Page.updated
 * @param lang - Language of the page, which picks the month names and the order of the parts
 * @returns "October 17, 2026" or "17 octobre 2026"; the input itself when it is not a date of
 * the calendar (a 30 February is not moved to March)
 */
export function formatDate(iso: string, lang: Lang): string {
    const date = new Date(`${iso}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || Number.isNaN(date.getTime())) return iso;
    if (date.toISOString().slice(0, 10) !== iso) return iso;
    return new Intl.DateTimeFormat(LOCALE_TAGS[lang], {
        dateStyle: "long",
        timeZone: "UTC",
    }).format(date);
}
