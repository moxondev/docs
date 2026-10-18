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
 * Formats a price in euros as the legacy pricing cards print it.
 *
 * @param amount - Price in euros, such as 2.99
 * @param lang - Language, which places the euro sign
 * @returns "2.99" followed by the euro sign in French, preceded by it in English
 */
export function formatPrice(amount: number, lang: Lang): string {
    const euro = String.fromCodePoint(0x20ac);
    return lang === "fr" ? `${amount}${euro}` : `${euro}${amount}`;
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
