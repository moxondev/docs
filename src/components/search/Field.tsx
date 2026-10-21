import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";

import type { FilterMethod } from "@/components/search/entries";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

export interface FieldProps {
    query: string;
    onQuery: (value: string) => void;
    count: number | null;
    onClear: () => void;
    onCancel: () => void;
}

export interface FiltersProps {
    method: FilterMethod | null;
    count: number | null;
    onMethod: (method: FilterMethod | null) => void;
}

// Chips of the phone filter, where null stands for All
const CHIPS: readonly (FilterMethod | null)[] = [null, "post", "get"];

/**
 * Search field of the palette: on desktop the line at the top of the dialog, with the result count
 * and the Esc key at its right; on a phone the boxed field with a clear and a Cancel button. The
 * input is the cmdk one, so the list gets its ARIA relations (combobox, active descendant).
 *
 * @param query - Current text of the field; the input is controlled, so the caller owns it
 * @param onQuery - Called with the new text on each key
 * @param count - Number of results to print at the right on desktop, null to print nothing; the
 *   live region that holds it is always in the page, so each new count is announced
 * @param onClear - Empties the field (phone)
 * @param onCancel - Closes the palette (phone)
 */
export function Field({ query, onQuery, count, onClear, onCancel }: FieldProps) {
    const t = useTranslations("search");
    const aria = useTranslations("aria");
    const common = useTranslations("common");
    const input = useRef<HTMLInputElement>(null);

    return (
        <div className="flex shrink-0 items-center gap-1 pt-1.5 pr-1 pb-1.5 pl-3 desk:h-15 desk:gap-3 desk:border-b desk:border-line desk:p-0 desk:pr-4 desk:pl-5">
            <div className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-table border border-focus-line bg-search pl-3.5 ring-3 ring-focus-ring desk:h-full desk:gap-3 desk:rounded-none desk:border-0 desk:bg-transparent desk:pl-0 desk:ring-0">
                <SearchIcon aria-hidden="true" className="size-5 shrink-0 text-muted" />
                <CommandPrimitive.Input
                    ref={input}
                    value={query}
                    onValueChange={onQuery}
                    placeholder={t("placeholder")}
                    enterKeyHint="search"
                    className="h-full min-w-0 flex-1 bg-transparent text-[17px] text-ink outline-none placeholder:text-faint"
                />
                {query ? (
                    <button
                        type="button"
                        aria-label={aria("searchClear")}
                        onClick={() => {
                            onClear();
                            input.current?.focus();
                        }}
                        className="flex size-11 shrink-0 cursor-pointer items-center justify-center text-muted desk:hidden"
                    >
                        <XIcon aria-hidden="true" className="size-4" />
                    </button>
                ) : null}
            </div>
            <span role="status" className="hidden shrink-0 text-[14px] text-muted desk:block">
                {count === null ? "" : t("count", { count })}
            </span>
            <Kbd className="hidden desk:inline-flex">{common("keys.escape")}</Kbd>
            <button
                type="button"
                onClick={onCancel}
                className="h-11 shrink-0 cursor-pointer px-3 text-[16px] font-medium text-ink desk:hidden"
            >
                {common("cancel")}
            </button>
        </div>
    );
}

/**
 * Method filter of the phone palette: the chips All, POST and GET, the current one on the yellow
 * ground, and the result count at the right. A chip writes the method prefix into the query, the
 * same filter as typing it. Each chip gets a larger touch target through its pseudo element.
 *
 * @param method - Method currently filtered, null for all
 * @param count - Number of results, null when the field is empty
 * @param onMethod - Called with the chosen method, null for All
 */
export function Filters({ method, count, onMethod }: FiltersProps) {
    const t = useTranslations("search");
    const aria = useTranslations("aria");

    return (
        <div
            role="group"
            aria-label={aria("methodFilter")}
            className="flex shrink-0 items-center gap-1.5 px-4 pt-2 pb-1.5 desk:hidden"
        >
            {CHIPS.map((chip) => (
                <button
                    key={chip ?? "all"}
                    type="button"
                    aria-pressed={method === chip}
                    onClick={() => onMethod(chip)}
                    className={cn(
                        "relative h-8.5 cursor-pointer rounded-full border px-3.25 text-[14px] text-text after:absolute after:inset-x-[-2px] after:inset-y-[-6px]",
                        method === chip
                            ? "border-chip-on-line bg-chip-on font-medium text-ink"
                            : "border-field bg-transparent",
                    )}
                >
                    {chip ? chip.toUpperCase() : t("filters.all")}
                </button>
            ))}
            <span role="status" className="ml-auto text-[14px] text-muted">
                {count === null ? "" : t("count", { count })}
            </span>
        </div>
    );
}
