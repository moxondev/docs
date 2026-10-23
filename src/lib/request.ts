import { SITE } from "@/data/site";
import { pick } from "@/lib/inline";
import type {
    Block,
    JsonValue,
    Lang,
    Method,
    Operation,
    ParamSpec,
    Version,
} from "@/types/content";

export type FormValues = Record<string, string>;

export type ExamplesBlock = Extract<Block, { type: "examples" }>;

export interface PreparedRequest {
    method: Method;
    url: string;
    body?: Record<string, JsonValue>;
}

export type ResponseKind = "json" | "text" | "image" | "error";

export type RequestFailure = "network" | "timeout";

export interface ApiResponse {
    status: number;
    statusText: string;
    ms: number;
    kind: ResponseKind;
    body: string;
    blobUrl?: string;
    headers: Record<string, string>;
    error?: RequestFailure;
}

// Abort delay of a live request: a slow answer ends as a visible timeout
export const TIMEOUT_MS = 20_000;

// Reason phrases of the statuses the API sends; HTTP/2 answers carry none
export const STATUS_TEXT: Readonly<Record<number, string>> = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    204: "No Content",
    301: "Moved Permanently",
    302: "Found",
    304: "Not Modified",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    413: "Content Too Large",
    415: "Unsupported Media Type",
    422: "Unprocessable Content",
    429: "Too Many Requests",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
};

// Methods whose parameters travel as a JSON body; a GET puts them in the query string
const BODY_METHODS: ReadonlySet<Method> = new Set(["post", "put", "patch", "delete"]);

/**
 * Tells whether a method sends its parameters as a JSON body.
 *
 * @param method - HTTP method of the operation
 * @returns True for post, put, patch and delete
 */
export function hasBody(method: Method): boolean {
    return BODY_METHODS.has(method);
}

/**
 * Lists the names of the ":name" placeholders of an operation path.
 *
 * @param path - Unversioned path such as "/chat/:token"
 * @returns The placeholder names in order of appearance
 */
export function pathParams(path: string): string[] {
    return [...path.matchAll(/:([A-Za-z][A-Za-z0-9_]*)/g)].map((match) => match[1]);
}

/**
 * Gives the initial form values of an operation: the preset of a literal-id example, else the
 * default of the parameter, else an empty field.
 *
 * @param op - Operation whose parameters give the presets and the defaults
 * @returns One value per parameter
 */
export function initialValues(op: Operation): FormValues {
    return Object.fromEntries(op.params.map((p) => [p.name, p.value ?? p.default ?? ""]));
}

/**
 * Finds the first required parameter that has no value, in the order of the form. A conditional
 * parameter does not count: the API answers with the rule it broke.
 *
 * @param op - Operation whose parameters say which values are required
 * @param values - Current form values; an absent key counts as empty
 * @returns The name of the first missing required parameter, null when none is missing
 */
export function firstMissing(op: Operation, values: FormValues): string | null {
    const missing = op.params.find((p) => p.required === true && (values[p.name] ?? "") === "");
    return missing?.name ?? null;
}

/**
 * Tells whether every required parameter has a value, which lets a send go through. A conditional
 * parameter does not block: the API answers with the rule it broke.
 *
 * @param op - Operation whose parameters say which values are required
 * @param values - Current form values; an absent key counts as empty
 * @returns True when the request can be sent
 */
export function isComplete(op: Operation, values: FormValues): boolean {
    return firstMissing(op, values) === null;
}

/**
 * Gives the path of an operation as the API serves it: after the version, or alone for a route of
 * the root of the API such as /health.
 *
 * @param version - Documentation version, which is also the API version
 * @param op - Operation whose root flag is read
 * @param path - Path to place, the path of the operation by default
 * @returns The path with its version prefix, or without it for a root route
 */
export function apiPath(version: Version, op: Operation, path: string = op.path): string {
    return op.root ? path : `/${version}${path}`;
}

/**
 * Builds the live URL of an operation: API base, version, then the path with its ":name"
 * placeholders replaced by the encoded form values; an empty placeholder stays visible.
 *
 * @param version - Documentation version, which is also the API version
 * @param op - Operation whose path holds the ":name" placeholders
 * @param values - Form values, placeholders included
 * @returns The URL without query string
 */
export function buildUrl(version: Version, op: Operation, values: FormValues): string {
    const path = op.path.replace(/:([A-Za-z][A-Za-z0-9_]*)/g, (whole, name: string) => {
        const value = values[name] ?? "";
        return value === "" ? whole : encodeURIComponent(value);
    });
    return `${SITE.api}${apiPath(version, op, path)}`;
}

/**
 * Converts a form value to the JSON value the body carries: a boolean parameter becomes a real
 * boolean, a json parameter is parsed (the raw string is kept when it is not valid JSON), any
 * other value stays the string typed, numbers included (the API accepts both).
 *
 * @param type - Type of the parameter: boolean and json are converted, the others sent as typed
 * @param value - Non-empty form value
 * @returns The value written under the parameter name in the JSON body
 */
function typedValue(type: ParamSpec["type"], value: string): JsonValue {
    if (type === "boolean") return value === "true";
    if (type !== "json") return value;
    try {
        return JSON.parse(value) as JsonValue;
    } catch {
        return value;
    }
}

/**
 * Prepares the request of the Try panel: placeholders go into the path, the filled parameters
 * into the query string of a GET or into the JSON body of the other methods, empty values are
 * left out. The snippets read the same object, so the code shown is what is sent.
 *
 * @param version - Documentation version, which is also the API version
 * @param op - Operation: method, path, and the type and place (path, query, body) of each parameter
 * @param values - Form values keyed by parameter name; an absent key counts as empty
 * @returns Method, URL (with its query string) and, for a body method, the body (possibly empty)
 */
export function prepareRequest(
    version: Version,
    op: Operation,
    values: FormValues,
): PreparedRequest {
    const placeholders = new Set(pathParams(op.path));
    const url = buildUrl(version, op, values);
    const query = new URLSearchParams();
    const body: Record<string, JsonValue> = {};
    const withBody = hasBody(op.method);

    for (const p of op.params) {
        const value = values[p.name] ?? "";
        if (value === "" || p.in === "path" || placeholders.has(p.name)) continue;
        if (withBody && p.in !== "query") body[p.name] = typedValue(p.type, value);
        else query.append(p.name, value);
    }

    const search = query.toString();
    const full = search ? `${url}?${search}` : url;
    return withBody ? { method: op.method, url: full, body } : { method: op.method, url: full };
}

/**
 * Prepares the request of a Code Examples block: the literal path of the block when it has one,
 * the sample as query string for a GET and as JSON body for the other methods.
 *
 * @param version - Documentation version, which is also the API version
 * @param op - Operation the block illustrates
 * @param block - Examples block: an optional literal path, a query or a body sample
 * @param lang - Language whose sample is shown when the sample differs per language
 * @returns The request the code samples print
 */
export function exampleRequest(
    version: Version,
    op: Operation,
    block: ExamplesBlock,
    lang: Lang,
): PreparedRequest {
    const url = `${SITE.api}${apiPath(version, op, block.path ?? op.path)}`;
    if (hasBody(op.method)) {
        return { method: op.method, url, body: block.body ? pick(block.body, lang) : {} };
    }
    const sample = block.query ? pick(block.query, lang) : {};
    const query = new URLSearchParams(
        Object.entries(sample).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)]),
    ).toString();
    return { method: op.method, url: query ? `${url}?${query}` : url };
}

/**
 * Gives the fetch options of a prepared request: the method, and the JSON body with its
 * Content-Type header only when the body has a key. No other header is ever sent (no API key).
 *
 * @param req - Request from prepareRequest or exampleRequest
 * @returns Options for fetch, without a signal
 */
export function requestInit(req: PreparedRequest): RequestInit {
    const init: RequestInit = { method: req.method.toUpperCase() };
    if (req.body && Object.keys(req.body).length > 0) {
        init.headers = { "Content-Type": "application/json" };
        init.body = JSON.stringify(req.body);
    }
    return init;
}

/**
 * Reads the Retry-After header of a 429 answer as a number of seconds.
 *
 * @param headers - Response headers, lowercase names
 * @param now - Current time in milliseconds, for the HTTP-date form of the header
 * @returns Seconds to wait, or undefined when the header is absent or unreadable
 */
export function retryAfter(headers: Record<string, string>, now = Date.now()): number | undefined {
    const value = headers["retry-after"]?.trim();
    if (!value) return undefined;
    if (/^\d+$/.test(value)) return Number(value);
    const at = Date.parse(value);
    return Number.isNaN(at) ? undefined : Math.max(0, Math.ceil((at - now) / 1000));
}

/**
 * Sends a prepared request to the live API and reads the answer: an image becomes a blob URL
 * (revoked by the caller on reset), JSON is pretty-printed, anything else is text. A network
 * failure or the timeout resolves with status 0; an abort by the caller rejects.
 *
 * @param req - Request from prepareRequest, the same object the snippets print
 * @param signal - Abort signal of the caller (reset, unmount); its abort rejects with AbortError
 * @param fetcher - Fetch implementation, the global one by default (tests inject a fake)
 * @param timeout - Delay in ms before the request is abandoned as a timeout
 * @returns The answer with its status, reason phrase, duration in ms and exposed headers
 */
export async function send(
    req: PreparedRequest,
    signal?: AbortSignal,
    fetcher: typeof fetch = fetch,
    timeout = TIMEOUT_MS,
): Promise<ApiResponse> {
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
    }, timeout);
    const forward = () => controller.abort();
    if (signal?.aborted) controller.abort();
    signal?.addEventListener("abort", forward, { once: true });
    const start = performance.now();
    const elapsed = () => Math.round(performance.now() - start);

    try {
        const res = await fetcher(req.url, { ...requestInit(req), signal: controller.signal });
        const headers = Object.fromEntries(res.headers.entries());
        const type = headers["content-type"] ?? "";
        const head = {
            status: res.status,
            statusText: STATUS_TEXT[res.status] ?? res.statusText,
            headers,
        };
        if (type.startsWith("image/")) {
            const blobUrl = URL.createObjectURL(await res.blob());
            return { ...head, ms: elapsed(), kind: "image", body: "", blobUrl };
        }
        const text = await res.text();
        if (type.includes("json")) {
            try {
                const pretty = JSON.stringify(JSON.parse(text), null, 2);
                return { ...head, ms: elapsed(), kind: "json", body: pretty };
            } catch {
                return { ...head, ms: elapsed(), kind: "text", body: text };
            }
        }
        return { ...head, ms: elapsed(), kind: "text", body: text };
    } catch (error) {
        if (signal?.aborted && !timedOut) throw error;
        return {
            status: 0,
            statusText: "",
            ms: elapsed(),
            kind: "error",
            body: "",
            headers: {},
            error: timedOut ? "timeout" : "network",
        };
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", forward);
    }
}
