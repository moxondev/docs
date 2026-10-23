import { useEffect, useState } from "react";

import { SITE } from "@/data/site";

export type ApiStatus = "unknown" | "up" | "down";

export interface ApiState {
    status: ApiStatus;
    since: number | null;
}

export interface StoredCheck {
    status: "up" | "down";
    at: number;
}

// Time a check stays valid in the tab: browsing the documentation costs one request per period
export const CHECK_TTL = 5 * 60_000;

// Delay between two checks while the API is down, so that the alert leaves once it is back
export const RETRY_DELAY = 60_000;

// Longest wait for the answer of /health before the API counts as down
const TIMEOUT = 8000;

// Delay before the first check of a tab, so that it never competes with the page itself
const START_DELAY = 1500;

// Delay before the request that confirms a failure, so that one dropped request raises no alert
const CONFIRM_DELAY = 4000;

// Key of the last check in sessionStorage
const STORAGE_KEY = "moxon-api-status";

/**
 * Tells from the answer of /health whether the API is down: anything but a 200 whose status is
 * "ok", no answer at all included (network error, timeout, wrong address). Only a rate limit
 * still proves that the API answers.
 *
 * @param answer - HTTP status and parsed body of the answer, or null when none came back
 * @returns "down" or "up"
 */
export function healthStatus(answer: { status: number; body: unknown } | null): "up" | "down" {
    if (answer === null) return "down";
    if (answer.status === 429) return "up";
    if (answer.status !== 200) return "down";
    const body = answer.body as { status?: unknown } | null;
    return body?.status === "ok" ? "up" : "down";
}

/**
 * Reads the last check of the tab when it is still valid.
 *
 * @param raw - Stored value, null when there is none
 * @param now - Current time in ms
 * @returns The stored check, or null when it is missing, malformed or older than CHECK_TTL
 */
export function freshCheck(raw: string | null, now: number): StoredCheck | null {
    if (raw === null) return null;
    try {
        const check = JSON.parse(raw) as Partial<StoredCheck>;
        if (check.status !== "up" && check.status !== "down") return null;
        if (typeof check.at !== "number" || now - check.at >= CHECK_TTL || check.at > now) {
            return null;
        }
        return { status: check.status, at: check.at };
    } catch {
        return null;
    }
}

/**
 * Asks /health once, with a timeout.
 *
 * @returns "up" or "down", from healthStatus
 */
async function checkHealth(): Promise<"up" | "down"> {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT);
    try {
        const response = await fetch(`${SITE.api}/health`, {
            cache: "no-store",
            signal: controller.signal,
        });
        const body: unknown = await response.json().catch(() => null);
        return healthStatus({ status: response.status, body });
    } catch {
        return "down";
    } finally {
        window.clearTimeout(timer);
    }
}

/**
 * Reads sessionStorage, which can be missing or refuse access.
 *
 * @returns The stored value, or null
 */
function readStored(): string | null {
    try {
        return window.sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

/**
 * Writes the outcome of a check to sessionStorage; a refusal only costs a request on the next page.
 *
 * @param status - Outcome of the check
 */
function store(status: "up" | "down"): void {
    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ status, at: Date.now() }));
    } catch {
        // Nothing to do: the next page checks again
    }
}

/**
 * Waits for a delay.
 *
 * @param ms - Delay in milliseconds
 * @returns A promise settled after the delay
 */
function wait(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/**
 * Follows whether the API answers, for the outage alert: one check of /health at a time, at most
 * once per CHECK_TTL and every RETRY_DELAY while it is down. A failure counts once a second request
 * confirms it, and an offline reader is never told that the API is down.
 *
 * @returns The status, "unknown" until a check is known, and since when the current outage lasts
 */
export function useApiStatus(): ApiState {
    const [state, setState] = useState<ApiState>({ status: "unknown", since: null });

    useEffect(() => {
        let live = true;
        let running = false;
        let timer = 0;

        const show = (status: "up" | "down", at: number) =>
            setState((previous) =>
                previous.status === status
                    ? previous
                    : { status, since: status === "down" ? at : null },
            );

        const later = (ms: number) => {
            window.clearTimeout(timer);
            if (live) timer = window.setTimeout(() => void run(), ms);
        };

        const run = async () => {
            if (running || !live) return;
            if (!navigator.onLine) return later(RETRY_DELAY);
            running = true;
            let next = await checkHealth();
            if (next === "down" && live && navigator.onLine) {
                await wait(CONFIRM_DELAY);
                if (live && navigator.onLine) next = await checkHealth();
            }
            running = false;
            if (!live) return;
            if (next === "down" && !navigator.onLine) return later(RETRY_DELAY);
            store(next);
            show(next, Date.now());
            later(next === "down" ? RETRY_DELAY : CHECK_TTL);
        };

        const schedule = () => {
            if (running) return;
            const stored = freshCheck(readStored(), Date.now());
            if (stored === null) return later(START_DELAY);
            show(stored.status, stored.at);
            const delay = stored.status === "down" ? RETRY_DELAY : CHECK_TTL;
            later(Math.max(0, stored.at + delay - Date.now()));
        };

        const onVisible = () => {
            if (document.visibilityState === "visible") schedule();
        };

        timer = window.setTimeout(schedule, 0);
        document.addEventListener("visibilitychange", onVisible);
        return () => {
            live = false;
            window.clearTimeout(timer);
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, []);

    return state;
}
