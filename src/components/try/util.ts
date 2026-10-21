import type { RequestPhase } from "@/hooks/useRequest";
import type { ApiResponse } from "@/lib/request";
import type { ParamSpec } from "@/types/content";

export interface Hang {
    lead: number;
    hang: number;
}

export type StatusTone = "ok" | "warn";

export type StatusAccent = "ink" | "req";

export type ControlSpan = "half" | "full";

export interface ParamGroups {
    required: ParamSpec[];
    optional: ParamSpec[];
}

export interface StatusLabels {
    sending: string;
    error: string;
}

// Enum parameters with at most this many options are a segmented control, the others a select
export const SEGMENT_MAX = 3;

/**
 * A segmented control whose option names add up to this many characters or fewer pairs up with its
 * neighbour in the bench form; a longer one keeps a row of its own.
 */
export const SHORT_OPTIONS = 16;

/**
 * A text parameter whose placeholder, or failing that its default or preset value, is this long or
 * shorter expects a short value and can share a row; a field with none of them keeps the full row.
 */
export const SHORT_TEXT = 10;

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
 * Picks the one semantic accent of the quiet status line: red for an error or a request that got
 * no answer, ink for everything else.
 *
 * @param status - HTTP status of the answer, 0 when there was none
 * @returns "req" for a failure, "ink" otherwise
 */
export function statusAccent(status: number): StatusAccent {
    return status === 0 || status >= 400 ? "req" : "ink";
}

/**
 * Decides how many rows the text area of a parameter has: a JSON value gets more than a string
 * whose placeholder holds a line break (a CSV or a PEM sample, glued together in a one-line
 * input). Any other parameter stays a one-line field.
 *
 * @param param - Parameter whose type and placeholder decide the rows
 * @returns The number of rows, or null when the parameter is not drawn as a text area
 */
export function textareaRows(param: ParamSpec): number | null {
    if (param.type === "json") return 4;
    if (param.type === "string" && param.placeholder?.includes("\n")) return 2;
    return null;
}

/**
 * Names the type of a parameter when it tells something the field does not: a number or a JSON
 * value. A string, a boolean and an enum are told by their own control, and a parameter called
 * after its type (json) would repeat itself.
 *
 * @param param - Parameter whose type and name decide the hint
 * @returns The type to print next to the name, or null when nothing is worth saying
 */
export function typeHint(param: ParamSpec): string | null {
    if (param.type !== "number" && param.type !== "json") return null;
    return param.type === param.name ? null : param.type;
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

/**
 * Says in words where a request stands: the sending label while in flight, the code with its
 * reason phrase once an answer came, the error label otherwise. The response bar draws it and the
 * live region reads it.
 *
 * @param phase - State of the request machine
 * @param response - Last answer, null before the first one
 * @param labels - Translated words for the two cases that have no code
 * @returns The words, never empty
 */
export function statusLabel(
    phase: RequestPhase,
    response: ApiResponse | null,
    labels: StatusLabels,
): string {
    if (phase === "loading") return labels.sending;
    if (response && response.kind !== "error")
        return `${response.status} ${response.statusText}`.trim();
    return labels.error;
}

/**
 * Picks the scroll behavior to pass to scrollIntoView: smooth unless the reader asked for less
 * motion. The CSS rule that drops smooth scrolling does not reach an explicit option of a script
 * call.
 *
 * @returns "auto" under prefers-reduced-motion, "smooth" otherwise; browser only
 */
export function scrollBehavior(): ScrollBehavior {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

/**
 * Decides whether a control takes half a row or the whole row of the bench form, so that short
 * controls sit two by two. The thresholds are SHORT_OPTIONS and SHORT_TEXT.
 *
 * @param param - Parameter whose type, options or placeholder decide the width
 * @returns "half" for a short control, "full" for one that needs the whole row
 */
export function controlSpan(param: ParamSpec): ControlSpan {
    switch (param.type) {
        case "boolean":
        case "number":
            return "half";
        case "enum": {
            const options = param.options ?? [];
            const chars = options.reduce((sum, option) => sum + option.length, 0);
            const segmented = options.length > 0 && options.length <= SEGMENT_MAX;
            return segmented && chars <= SHORT_OPTIONS ? "half" : "full";
        }
        case "string": {
            const hint = (param.placeholder ?? param.default ?? param.value ?? "").length;
            return hint > 0 && hint <= SHORT_TEXT ? "half" : "full";
        }
        default:
            return "full";
    }
}

/**
 * Splits the parameters of an operation into the two groups of the bench form, each in its
 * original order: the ones that must be given (required, or conditional on another one) and the
 * optional ones. An empty group is left out by the form, so it never prints a bare heading.
 *
 * @param params - Operation.params
 * @returns The required (including conditional) and the optional parameters
 */
export function splitParams(params: readonly ParamSpec[]): ParamGroups {
    return {
        required: params.filter((param) => param.required !== false),
        optional: params.filter((param) => param.required === false),
    };
}

/**
 * Counts the values an enum parameter offers, for the figure printed in its field.
 *
 * @param param - Enum parameter whose options are counted
 * @returns The number of options, zero for a parameter without any
 */
export function optionCount(param: ParamSpec): number {
    return param.options?.length ?? 0;
}

/**
 * Lists the values of an enum parameter that the form offers as one-click chips: the featured
 * ones that are really among its options, in the order of the data.
 *
 * @param param - Enum parameter whose featured values become chips; any other type gives none
 * @returns The featured values, empty for a parameter that is not an enum or has none
 */
export function featuredOptions(param: ParamSpec): string[] {
    if (param.type !== "enum") return [];
    const options = param.options ?? [];
    return (param.featured ?? []).filter((value) => options.includes(value));
}
