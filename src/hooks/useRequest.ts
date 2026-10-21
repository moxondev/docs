import {
    type KeyboardEvent,
    useCallback,
    useEffect,
    useEffectEvent,
    useMemo,
    useReducer,
    useRef,
} from "react";

import {
    type FieldLike,
    isTextInput,
    type KeyPress,
    matches,
    SHORTCUT,
} from "@/hooks/useShortcuts";
import {
    type ApiResponse,
    firstMissing,
    type FormValues,
    initialValues,
    isComplete,
    type PreparedRequest,
    prepareRequest,
    retryAfter,
    send as sendRequest,
} from "@/lib/request";
import type { Operation, Version } from "@/types/content";

export type RequestPhase = "idle" | "loading" | "done" | "error";

export type FieldIssue = "required" | "json";

export interface FieldFocus {
    name: string;
    seq: number;
}

export interface RequestState {
    phase: RequestPhase;
    values: FormValues;
    touched: readonly string[];
    focus: FieldFocus | null;
    response: ApiResponse | null;
    retry?: number;
}

export type RequestAction =
    | { type: "edit"; name: string; value: string }
    | { type: "load"; values: FormValues }
    | { type: "flag"; name: string }
    | { type: "start" }
    | { type: "finish"; response: ApiResponse; retry?: number }
    | { type: "reset" };

export interface RequestOptions {
    autoSend?: boolean;
}

export interface RequestHandle {
    phase: RequestPhase;
    values: FormValues;
    response: ApiResponse | null;
    retry?: number;
    request: PreparedRequest;
    complete: boolean;
    issues: Readonly<Partial<Record<string, FieldIssue>>>;
    focus: FieldFocus | null;
    setValue: (name: string, value: string) => void;
    load: (values: FormValues) => void;
    send: () => void;
    reset: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

interface Live {
    controller: AbortController | null;
    blob: string | null;
}

/**
 * Answer used when send itself throws for another reason than an abort: shown as ERR, like a
 * network failure.
 */
const FAILED: ApiResponse = {
    status: 0,
    statusText: "",
    ms: 0,
    kind: "error",
    body: "",
    headers: {},
    error: "network",
};

/**
 * Gives the first state of a Try form: the presets and defaults of the operation, and the
 * loading phase right away when the form sends itself on mount and can (Getting Started).
 *
 * @param op - Operation whose parameters give the initial values
 * @param autoSend - True for the inline Try of Getting Started
 * @returns The state of the first render, the same on the server and in the browser
 */
export function initialRequest(op: Operation, autoSend = false): RequestState {
    const values = initialValues(op);
    const phase = autoSend && isComplete(op, values) ? "loading" : "idle";
    return { phase, values, touched: [], focus: null, response: null };
}

/**
 * Advances the Try state machine. An answer with a status is done, whatever the status (4xx and
 * 5xx included); only a network failure or a timeout (status 0) is error. A flag marks a required
 * field the reader tried to skip as touched and asks the form to move the focus there.
 *
 * @param state - State before the action, never mutated
 * @param action - Field edit, values reload, field flag, send start, answer, or reset
 * @returns The next state, the same object when nothing changes
 */
export function requestReducer(state: RequestState, action: RequestAction): RequestState {
    switch (action.type) {
        case "edit": {
            if (state.values[action.name] === action.value) return state;
            const values = { ...state.values, [action.name]: action.value };
            const touched = state.touched.includes(action.name)
                ? state.touched
                : [...state.touched, action.name];
            return { ...state, values, touched };
        }
        case "load":
            return { ...state, values: { ...action.values }, touched: [] };
        case "flag": {
            const touched = state.touched.includes(action.name)
                ? state.touched
                : [...state.touched, action.name];
            return {
                ...state,
                touched,
                focus: { name: action.name, seq: (state.focus?.seq ?? 0) + 1 },
            };
        }
        case "start":
            return state.phase === "loading" ? state : { ...state, phase: "loading" };
        case "finish":
            return {
                ...state,
                phase: action.response.kind === "error" ? "error" : "done",
                response: action.response,
                retry: action.retry,
            };
        case "reset":
            if (state.phase === "idle" && state.response === null) return state;
            return { ...state, phase: "idle", response: null, retry: undefined };
    }
}

/**
 * Lists what is wrong with the fields: a required parameter emptied by the reader, a json
 * parameter whose text does not parse (it is still sent as typed).
 *
 * @param op - Operation whose parameters say what is required and what is json
 * @param values - Text of every field by parameter name; a json value is parsed to be checked
 * @param touched - Names of the fields the reader edited; untouched empty fields are not flagged
 * @returns One issue per flagged parameter name
 */
export function fieldIssues(
    op: Operation,
    values: FormValues,
    touched: readonly string[],
): Partial<Record<string, FieldIssue>> {
    const issues: Partial<Record<string, FieldIssue>> = {};
    for (const param of op.params) {
        const value = values[param.name] ?? "";
        if (value === "") {
            if (param.required === true && touched.includes(param.name)) {
                issues[param.name] = "required";
            }
            continue;
        }
        if (param.type !== "json") continue;
        try {
            JSON.parse(value);
        } catch {
            issues[param.name] = "json";
        }
    }
    return issues;
}

/**
 * Tells whether a key press in the Try form sends the request: Ctrl or Cmd+Enter anywhere in
 * the form, a plain Enter in a single-line text input (a textarea keeps its new line).
 *
 * @param press - Key event, only the key, the code and the modifiers are read
 * @param target - Element that received the press, read structurally
 * @returns True when the form should send
 */
export function shouldSend(press: KeyPress, target: FieldLike | EventTarget | null): boolean {
    if (matches(press, SHORTCUT.send)) return true;
    const plain = !(press.altKey || press.ctrlKey || press.metaKey || press.shiftKey);
    return press.key === "Enter" && plain && isTextInput(target);
}

/**
 * Releases the blob URL of an image answer.
 *
 * @param url - Blob URL of an ApiResponse, nothing happens when absent
 */
function revoke(url: string | null | undefined): void {
    if (url) URL.revokeObjectURL(url);
}

/**
 * Runs the state machine of a Try panel, inline Try or Playground form: values, required checks,
 * send and abort, auto-send once on mount, and the blob URL released on reset, on a new answer
 * and on unmount. Key the component by operation so another one starts from its presets.
 *
 * @param version - Documentation version, which is also the API version
 * @param op - Operation of the form; only operations with try true reach a panel
 * @param options - autoSend: send once on mount when the required values are preset
 * @returns The state, the request the snippets print, the derived checks and the actions
 */
export function useRequest(
    version: Version,
    op: Operation,
    options: RequestOptions = {},
): RequestHandle {
    const { autoSend = false } = options;
    const [state, dispatch] = useReducer(requestReducer, op, (first: Operation) =>
        initialRequest(first, autoSend),
    );
    const live = useRef<Live>({ controller: null, blob: null });

    const run = useCallback(async (req: PreparedRequest) => {
        const current = live.current;
        current.controller?.abort();
        const controller = new AbortController();
        current.controller = controller;

        let response = FAILED;
        try {
            response = await sendRequest(req, controller.signal);
        } catch {
            if (controller.signal.aborted) return;
        }

        // A newer send, a reset or the unmount replaced this request: drop its answer
        if (current.controller !== controller) {
            revoke(response.blobUrl);
            return;
        }
        current.controller = null;
        revoke(current.blob);
        current.blob = response.blobUrl ?? null;
        const retry = response.status === 429 ? retryAfter(response.headers) : undefined;
        dispatch({ type: "finish", response, retry });
    }, []);

    const send = useCallback(() => {
        if (state.phase === "loading") return;

        // An incomplete form still takes the click: it flags and focuses the first missing field
        const missing = firstMissing(op, state.values);
        if (missing !== null) {
            dispatch({ type: "flag", name: missing });
            return;
        }

        // Two presses in one task both see the old render: the live request is the real guard
        if (live.current.controller) return;
        dispatch({ type: "start" });
        void run(prepareRequest(version, op, state.values));
    }, [op, run, state.phase, state.values, version]);

    const reset = useCallback(() => {
        const current = live.current;
        current.controller?.abort();
        current.controller = null;
        revoke(current.blob);
        current.blob = null;
        dispatch({ type: "reset" });
    }, []);

    const setValue = useCallback(
        (name: string, value: string) => dispatch({ type: "edit", name, value }),
        [],
    );
    const load = useCallback((values: FormValues) => dispatch({ type: "load", values }), []);

    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLElement>) => {
            if (event.defaultPrevented || event.nativeEvent.isComposing) return;
            if (!shouldSend(event, event.target)) return;
            event.preventDefault();
            send();
        },
        [send],
    );

    const autoStart = useEffectEvent(() => {
        if (state.phase === "loading") void run(prepareRequest(version, op, state.values));
    });

    useEffect(() => {
        const current = live.current;
        autoStart();
        return () => {
            current.controller?.abort();
            current.controller = null;
            revoke(current.blob);
            current.blob = null;
        };
    }, []);

    const request = useMemo(
        () => prepareRequest(version, op, state.values),
        [op, state.values, version],
    );
    const issues = useMemo(
        () => fieldIssues(op, state.values, state.touched),
        [op, state.values, state.touched],
    );
    const complete = isComplete(op, state.values);

    return {
        phase: state.phase,
        values: state.values,
        response: state.response,
        retry: state.retry,
        request,
        complete,
        issues,
        focus: state.focus,
        setValue,
        load,
        send,
        reset,
        onKeyDown,
    };
}
