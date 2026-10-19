import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Tailwind class merger that knows the named radius, shadow and animation scales of
 * src/app/globals.css, so that a later class of one of those scales replaces an earlier one.
 * Keep its lists in sync with the radius, shadow and animate tokens of that file.
 *
 * @param classes - Space separated class list
 * @returns The list without the classes overridden by a later conflicting one
 */
const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            radius: ["tag", "chip", "row", "btn", "field", "cta", "box", "table", "panel", "sheet"],
            shadow: ["panel", "demo", "palette", "bar", "sheet", "seg"],
            animate: [
                "flash",
                "swap",
                "palette-in",
                "palette-out",
                "scrim-in",
                "scrim-out",
                "sheet-in",
                "sheet-out",
                "spinner",
                "pulse-dot",
            ],
        },
    },
});

/**
 * Merges Tailwind class lists, letting later utilities override conflicting ones.
 *
 * @param inputs - Class values in any shape clsx accepts (strings, arrays, conditional maps)
 * @returns A single deduplicated class string
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
