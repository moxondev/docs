// Narrowest bar of the ladder, in percent of the track, so that a small plan stays visible
const MIN_PERCENT = 4;

/**
 * Computes the width of the bar of a plan on the ladder of the pricing page: its hourly quota
 * relative to the largest quota of the plan list, never narrower than a visible stub.
 *
 * @param value - Hourly quota of the plan
 * @param max - Largest hourly quota of the plan list
 * @returns A percentage between MIN_PERCENT and 100, rounded to one decimal; 100 when the list
 *   has no quota
 */
export function barPercent(value: number, max: number): number {
    if (!(max > 0)) return 100;
    const percent = Math.round((value / max) * 1000) / 10;
    return Math.min(100, Math.max(MIN_PERCENT, percent));
}
