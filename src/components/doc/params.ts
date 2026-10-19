import { pick } from "@/lib/inline";
import type { Inline, Lang, Lx, ParamSpec } from "@/types/content";

export interface ValuesRef {
    id: string;
    total: number;
}

export interface ParamView {
    type: string;
    chips: string[];
    more: number;
    moreTo?: string;
}

// An enum with at most this many options is told in its type, as a union of quoted values
const UNION_MAX = 3;

// Text of a Default cell that says there is no default, an em dash
export const NO_DEFAULT = String.fromCodePoint(0x2014);

/**
 * Describes how a parameter row shows its type and its values: the type word, the chips of the
 * values and the overflow. A short enum is a quoted union; a long one has chips (the featured
 * values if any, else every option), the rest counted over the Values section when there is one.
 *
 * @param spec - Parameter of the operation that the row documents, undefined when the table
 *   names a parameter the operation does not list
 * @param values - Values section of the page, whose id the overflow link targets and whose
 *   total counts the values behind it; absent when the page has none
 * @returns The type word ("" when unknown), the chips, how many values are not shown and the
 *   section id the overflow links to (absent when no section holds them)
 */
export function paramView(spec: ParamSpec | undefined, values?: ValuesRef): ParamView {
    if (!spec) return { type: "", chips: [], more: 0 };
    const options = spec.options ?? [];
    if (spec.type !== "enum" || options.length === 0) {
        return { type: spec.type, chips: [], more: 0 };
    }
    if (options.length <= UNION_MAX) {
        return {
            type: options.map((option) => `"${option}"`).join(" | "),
            chips: [],
            more: 0,
        };
    }
    if (!spec.featured || spec.featured.length === 0) {
        return { type: "string", chips: options, more: 0 };
    }
    const behind = values ? values.total : options.length;
    return {
        type: "string",
        chips: spec.featured,
        more: Math.max(0, behind - spec.featured.length),
        moreTo: values?.id,
    };
}

/**
 * Picks the default value that a parameter row announces: the Default cell of the table, else
 * the default of the operation, and nothing for a hyphen or an empty cell. The em dash cell comes
 * back as it is, so that the row keeps it for the text of the page.
 *
 * @param cell - Default cell of the row, absent when the table has no Default column
 * @param spec - Parameter of the operation, whose default is the fallback
 * @param lang - Language that picks the text of the Default cell
 * @returns The inline text of the default, or undefined when there is none to tell
 */
export function defaultText(
    cell: Lx<Inline> | undefined,
    spec: ParamSpec | undefined,
    lang: Lang,
): Inline | undefined {
    const raw = cell === undefined ? spec?.default : pick(cell, lang);
    const text = raw?.trim();
    if (!text || text === "-") return undefined;
    return text;
}
