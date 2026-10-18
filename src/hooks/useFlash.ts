import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { segments } from "@/lib/routes";

export interface FlashTarget {
    path: string;
    id: string;
}

export interface FlashElement {
    classList: Pick<DOMTokenList, "add" | "contains" | "remove">;
    getBoundingClientRect: () => unknown;
}

/**
 * Utilities that make the anchor flash: the --animate-flash token of globals.css, and under
 * reduced motion the --active-bg ground of both themes held still until the timer ends.
 */
export const FLASH_CLASSES: readonly string[] = [
    "relative",
    "rounded-lg",
    "animate-flash",
    "motion-reduce:animate-none",
    "motion-reduce:bg-active",
    "motion-reduce:shadow-[0_0_0_10px_var(--active-bg)]",
];

// Length of the flash in ms, the duration of --animate-flash and of the reduced-motion ground
export const FLASH_MS = 1500;

// A flash asked for another page expires after this many ms (an aborted or slow navigation)
const PENDING_MS = 10_000;

// Frames to wait for the target element of a flash to be rendered, about one second
const FRAMES = 60;

// Search result waiting for its page: set before the navigation, taken once the page renders
const PENDING: { target: FlashTarget | null; until: number } = { target: null, until: 0 };

// Flash running on each element, so a second flash restarts it instead of overlapping
const RUNNING = new WeakMap<FlashElement, () => void>();

/**
 * Splits a link into its page and its fragment.
 *
 * @param href - Site path such as "/fr/v6/hash/#p-method", query allowed
 * @returns The part before "#" and the fragment id without "#" ("" when there is none)
 */
export function splitHref(href: string): FlashTarget {
    const cut = href.indexOf("#");
    return cut === -1
        ? { path: href, id: "" }
        : { path: href.slice(0, cut), id: href.slice(cut + 1) };
}

/**
 * Tells whether two paths name the same page, ignoring the trailing slash (dotted release pages
 * lose it in dev), the query and the fragment.
 *
 * @param a - Pathname, possibly with a query or a fragment
 * @param b - Pathname to compare with a, in the same forms
 * @returns True when the segments are equal
 */
export function samePath(a: string, b: string): boolean {
    return segments(a).join("/") === segments(b).join("/");
}

/**
 * Plays the flash on an element: adds the flash utilities it does not already carry, then
 * removes exactly those after the delay. A flash already running there is stopped first and the
 * layout is read once, so the animation starts again.
 *
 * @param element - Target row or heading (a Field, an error row, a section h2)
 * @param classes - Utilities to add, FLASH_CLASSES by default
 * @param ms - Delay before the utilities are removed, FLASH_MS by default
 * @returns A function that stops the flash at once
 */
export function flashElement(
    element: FlashElement,
    classes: readonly string[] = FLASH_CLASSES,
    ms = FLASH_MS,
): () => void {
    RUNNING.get(element)?.();
    element.getBoundingClientRect();
    const added = classes.filter((name) => !element.classList.contains(name));
    element.classList.add(...added);

    let timer: ReturnType<typeof setTimeout> | undefined = undefined;
    const stop = () => {
        clearTimeout(timer);
        element.classList.remove(...added);
        if (RUNNING.get(element) === stop) RUNNING.delete(element);
    };
    timer = setTimeout(stop, ms);
    RUNNING.set(element, stop);
    return stop;
}

/**
 * Scrolls to an element of the page and flashes it, retrying on the next frames while the page
 * is still rendering. The scroll follows the CSS scroll behavior (smooth, instant under reduced
 * motion) and the scroll padding under the sticky header.
 *
 * @param id - Fragment id of the target: a derived row id (p-, f-, e-) or a section id
 * @returns A function that stops waiting; the flash itself ends on its own
 */
function flashWhenReady(id: string): () => void {
    let frame = 0;
    let left = FRAMES;
    const attempt = () => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ block: "start" });
            flashElement(element);
            return;
        }
        left -= 1;
        if (left > 0) frame = window.requestAnimationFrame(attempt);
    };
    attempt();
    return () => window.cancelAnimationFrame(frame);
}

/**
 * Opens a search result and flashes its target: at once on the current page, else once the page
 * it routes to has rendered. A shared link never flashes. Call it from a component that stays
 * mounted across navigations (the Palette).
 *
 * @returns The function opening a site path, with or without a fragment
 */
export function useFlash(): (href: string) => void {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const { target, until } = PENDING;
        if (!target || pathname === null || !samePath(target.path, pathname)) return;
        PENDING.target = null;
        if (Date.now() > until) return;
        return flashWhenReady(target.id);
    }, [pathname]);

    return useCallback(
        (href: string) => {
            const { path, id } = splitHref(href);
            if (id && samePath(path, window.location.pathname)) {
                router.push(href, { scroll: false });
                flashWhenReady(id);
                return;
            }
            PENDING.target = id ? { path, id } : null;
            PENDING.until = Date.now() + PENDING_MS;
            router.push(href);
        },
        [router],
    );
}
