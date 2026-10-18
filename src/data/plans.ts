import { LINKS } from "@/data/links";
import type { Loc } from "@/types/content";

export type PlanId = "free" | "advanced" | "pro" | "business";

export interface Plan {
    id: PlanId;
    name: Loc<string>;
    price?: { amount: number; currency: "EUR"; per: "month" };
    hour: number;
    day: number;
    week: number;
    month: number;
    burst: number;
    cta: { label: Loc<string>; href: string };
    featured?: true;
}

/**
 * The pricing grid, cheapest first: names, prices, limits and buttons (month is the rounded figure
 * the cards print after a tilde), burst from the rate-limit tables.
 */
export const PLANS: Plan[] = [
    {
        id: "free",
        name: { en: "FREE", fr: "GRATUIT" },
        hour: 2_000,
        day: 48_000,
        week: 336_000,
        month: 1_400_000,
        burst: 50,
        cta: { label: { en: "Get Started", fr: "Commencer" }, href: LINKS.api },
    },
    {
        id: "advanced",
        name: { en: "ADVANCED", fr: "ADVANCED" },
        price: { amount: 2.99, currency: "EUR", per: "month" },
        hour: 3_500,
        day: 84_000,
        week: 588_000,
        month: 2_500_000,
        burst: 80,
        cta: { label: { en: "Purchase", fr: "Acheter" }, href: LINKS.store },
    },
    {
        id: "pro",
        name: { en: "PRO", fr: "PRO" },
        price: { amount: 4.99, currency: "EUR", per: "month" },
        hour: 6_000,
        day: 144_000,
        week: 1_008_000,
        month: 4_200_000,
        burst: 120,
        cta: { label: { en: "Purchase", fr: "Acheter" }, href: LINKS.store },
        featured: true,
    },
    {
        id: "business",
        name: { en: "BUSINESS", fr: "BUSINESS" },
        price: { amount: 9.99, currency: "EUR", per: "month" },
        hour: 10_000,
        day: 240_000,
        week: 1_680_000,
        month: 7_000_000,
        burst: 200,
        cta: { label: { en: "Purchase", fr: "Acheter" }, href: LINKS.store },
    },
];
