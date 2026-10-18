import { useMemo, useSyncExternalStore } from "react";

export interface SectionBox {
    id: string;
    top: number;
}

export interface SectionSpy {
    get: () => string | null;
    subscribe: (listener: () => void) => () => void;
}

// Share of the viewport height that a heading must cross to become the current section
const LINE_SHARE = 0.2;

// Margin under the scroll padding, so a heading scrolled to by its Toc link is already current
const PADDING_SLACK = 8;

/**
 * Picks the current section from the positions of its headings: the last one whose top crossed
 * the reading line. Once the page is scrolled to its end, the last visible heading wins, so a
 * short final section can still become current.
 *
 * @param boxes - Heading tops in document order, in px from the top of the viewport
 * @param line - Reading line, in px from the top of the viewport
 * @param end - Viewport height when the page is scrolled to its end, undefined otherwise
 * @returns The id of the current section, or null above the first heading
 */
export function currentSection(
    boxes: readonly SectionBox[],
    line: number,
    end?: number,
): string | null {
    let current: string | null = null;
    for (const box of boxes) {
        if (box.top > line && (end === undefined || box.top >= end)) break;
        current = box.id;
    }
    return current;
}

/**
 * Creates the scroll spy of one list of section ids: an external store whose value is the
 * current section, measured at most once per frame while the page scrolls or resizes. Headings
 * are looked up at each measure, so one replaced by a navigation is followed.
 *
 * @param ids - Section ids in document order; ids without an element are skipped
 * @returns The store, listening to the window only while it has subscribers
 */
export function createSectionSpy(ids: readonly string[]): SectionSpy {
    let current: string | null = null;
    let frame = 0;
    const listeners = new Set<() => void>();

    const measure = () => {
        frame = 0;
        const root = document.documentElement;
        const padding = Number.parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
        const line = Math.max(window.innerHeight * LINE_SHARE, padding + PADDING_SLACK);
        const scrolled = window.scrollY > 0;
        const atEnd = scrolled && window.scrollY + window.innerHeight >= root.scrollHeight - 2;
        const boxes = ids.flatMap((id) => {
            const heading = document.getElementById(id);
            return heading ? [{ id, top: heading.getBoundingClientRect().top }] : [];
        });
        const next = currentSection(boxes, line, atEnd ? window.innerHeight : undefined);
        if (next === current) return;
        current = next;
        for (const listener of [...listeners]) listener();
    };
    const schedule = () => {
        if (!frame) frame = window.requestAnimationFrame(measure);
    };

    return {
        get: () => current,
        subscribe: (listener) => {
            listeners.add(listener);
            if (listeners.size === 1) {
                window.addEventListener("scroll", schedule, { passive: true });
                window.addEventListener("resize", schedule, { passive: true });
                schedule();
            }
            return () => {
                listeners.delete(listener);
                if (listeners.size > 0) return;
                window.removeEventListener("scroll", schedule);
                window.removeEventListener("resize", schedule);
                window.cancelAnimationFrame(frame);
                frame = 0;
            };
        },
    };
}

/**
 * Gives the snapshot of the server render, which knows no scroll position.
 *
 * @returns Null: no section is current in the static HTML
 */
function getServerSnapshot(): string | null {
    return null;
}

/**
 * Tracks the section the reader is in, for the current pill of the phone Toc and the ink and
 * weight mark of the desktop Toc. No state is set in an effect: the spy is an
 * external store created per list of ids.
 *
 * @param ids - Ids of the Toc entries in document order (level 2 and level 3 sections)
 * @returns The id of the current section, null above the first one and in the static HTML
 */
export function useActiveSection(ids: readonly string[]): string | null {
    const key = ids.join(" ");
    const spy = useMemo(() => createSectionSpy(key === "" ? [] : key.split(" ")), [key]);
    return useSyncExternalStore(spy.subscribe, spy.get, getServerSnapshot);
}
