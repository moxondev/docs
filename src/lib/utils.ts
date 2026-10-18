import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class lists, letting later utilities override conflicting ones.
 *
 * @param inputs - Class values in any shape clsx accepts (strings, arrays, conditional maps)
 * @returns A single deduplicated class string
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}
