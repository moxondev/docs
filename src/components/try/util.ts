import type { ApiResponse } from "@/lib/request";

export interface Hang {
    lead: number;
    hang: number;
}

export type StatusTone = "ok" | "warn";

// Lines this long or shorter never wrap in a panel, so they keep the plain layout
const LONG_LINE = 40;

// A JSON line that opens with a key and a string value: indentation, then "key": and the quote
const KEY_STRING = /^(\s*)("(?:[^"\\]|\\.)*":\s*)"/;

// A JSON line that is a bare string (an array item): indentation, then the quote
const BARE_STRING = /^(\s*)"(?:[^"\\]|\\.)*",?$/;

// Units of a size, from the byte up; the API never answers more than a few MB
const UNITS: readonly string[] = ["B", "kB", "MB"];

/**
 * Computes the hanging indent of a long JSON string line, so that its wrapped rows line up under
 * the first character of the string instead of under the key.
 *
 * @param line - Text of one line of a pretty-printed JSON answer, indentation included
 * @returns The indentation and the column where the wrapped rows start (inside the opening
 * quote), or null for a line that is short or is not a string value
 */
export function hangingIndent(line: string): Hang | null {
    if (line.length <= LONG_LINE) return null;
    const keyed = KEY_STRING.exec(line);
    if (keyed) return { lead: keyed[1].length, hang: keyed[1].length + keyed[2].length + 1 };
    const bare = BARE_STRING.exec(line);
    return bare ? { lead: bare[1].length, hang: bare[1].length + 1 } : null;
}

/**
 * Formats a byte count for the response bar: whole bytes below 1 kB, one decimal above.
 *
 * @param bytes - Size in bytes, zero or more
 * @returns The size with its unit ("143 B", "1.4 kB")
 */
export function formatBytes(bytes: number): string {
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < UNITS.length - 1) {
        value /= 1024;
        unit += 1;
    }
    return unit === 0 ? `${bytes} B` : `${value.toFixed(1)} ${UNITS[unit]}`;
}

/**
 * Measures the body of an answer: the content-length header for an image (the blob is not read
 * here), the UTF-8 length of the text otherwise.
 *
 * @param response - Answer whose kind picks the measure; a failure has no size
 * @returns The size in bytes, or null when it is unknown
 */
export function responseSize(response: ApiResponse): number | null {
    if (response.kind === "image") {
        const length = Number(response.headers["content-length"]);
        return Number.isFinite(length) && length > 0 ? length : null;
    }
    if (response.kind === "error") return null;
    return new TextEncoder().encode(response.body).length;
}

/**
 * Picks the color family of a status: green for a success, amber for everything else, including
 * the status 0 of a network failure.
 *
 * @param status - HTTP status of the answer, 0 when there was none
 * @returns "ok" for a success, "warn" otherwise
 */
export function statusTone(status: number): StatusTone {
    return status >= 200 && status < 300 ? "ok" : "warn";
}

/**
 * Finds the tab that an arrow or a Home or End key press moves to in a tab list, wrapping around
 * at both ends (the keyboard model of the ARIA tabs pattern).
 *
 * @param count - Number of tabs in the list, at least one
 * @param index - Index of the focused tab
 * @param key - Value of KeyboardEvent.key
 * @returns The index to focus and select, or null for a key that moves nothing
 */
export function nextTab(count: number, index: number, key: string): number | null {
    switch (key) {
        case "ArrowRight":
            return (index + 1) % count;
        case "ArrowLeft":
            return (index - 1 + count) % count;
        case "Home":
            return 0;
        case "End":
            return count - 1;
        default:
            return null;
    }
}
