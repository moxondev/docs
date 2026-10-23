import { type RefObject, useEffect } from "react";

// Largest extra scale of the stretched row: it never grows past 1 + this
export const STRETCH_MAX = 0.05;

// Drag distance in px at which the stretch has covered about 63 percent of its way to the maximum
const STRETCH_REACH = 90;

// Movement in px that decides whether a touch is a sideways scroll or a vertical pull
const AXIS_SLOP = 6;

/**
 * Turns the distance of a vertical pull into the extra scale of the stretched row: it follows the
 * finger at first and slows down towards a ceiling, like the stretch of the browser but capped.
 *
 * @param distance - Distance the finger has moved along the axis, in px, either sign
 * @returns The extra scale, between 0 and STRETCH_MAX
 */
export function pullStretch(distance: number): number {
    return STRETCH_MAX * (1 - Math.exp(-Math.abs(distance) / STRETCH_REACH));
}

/**
 * Gives a row that scrolls sideways an elastic stretch, with a ceiling, when it is pulled up or
 * down by touch. The row gives up the browser's own stretch (touch-action: pan-x), which has no
 * limit, and this hook draws one instead; it does nothing with reduced motion.
 *
 * @param row - Ref of the scrolling row
 */
export function usePullStretch(row: RefObject<HTMLElement | null>): void {
    useEffect(() => {
        const element = row.current;
        if (!element) return;
        let origin: { x: number; y: number } | null = null;
        let pulling = false;
        let sideways = false;

        const release = () => {
            if (pulling) {
                element.style.transition = "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)";
                element.style.transform = "";
            }
            origin = null;
            pulling = false;
            sideways = false;
        };
        const down = (event: PointerEvent) => {
            const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (event.pointerType !== "touch" || still) return;
            if (element.scrollWidth <= element.clientWidth) return;
            origin = { x: event.clientX, y: event.clientY };
            element.style.transition = "none";
        };
        const move = (event: PointerEvent) => {
            if (origin === null || sideways) return;
            const dx = event.clientX - origin.x;
            const dy = event.clientY - origin.y;
            if (!pulling) {
                if (Math.hypot(dx, dy) < AXIS_SLOP) return;
                if (Math.abs(dx) >= Math.abs(dy)) {
                    sideways = true;
                    return;
                }
                pulling = true;
            }
            element.style.transformOrigin = dy > 0 ? "top" : "bottom";
            element.style.transform = `scaleY(${1 + pullStretch(dy)})`;
        };

        element.addEventListener("pointerdown", down);
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerup", release);
        element.addEventListener("pointercancel", release);
        return () => {
            element.removeEventListener("pointerdown", down);
            element.removeEventListener("pointermove", move);
            element.removeEventListener("pointerup", release);
            element.removeEventListener("pointercancel", release);
        };
    }, [row]);
}
