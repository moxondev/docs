import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "pricing",
    kind: "pricing",
    title: { en: "Pricing", fr: "Tarification" },
    lead: {
        en: "The moxon API is free and allows a maximum of **2,000 requests per hour**.",
        fr: "L'API moxon est gratuite et permet un maximum de **2 000 requêtes par heure**.",
    },
    updated: "2026-09-22",
    sections: [
        {
            id: "",
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "If you wish to exceed this limit, you must use an authentication token. The authentication token is unique, assigned to your email, and allows you to exceed this limit.",
                        fr: "Si vous souhaitez dépasser cette limite, vous devez utiliser un token d'authentification. Le token d'authentification est unique, attribué à votre email, et vous permet de dépasser cette limite.",
                    },
                },
            ],
        },
        {
            id: "plans",
            level: 2,
            title: { en: "Plans", fr: "Offres" },
            aliases: ["offres"],
            blocks: [
                { type: "plans" },
                {
                    type: "callout",
                    kind: "tip",
                    title: { en: "Burst Limit", fr: "Limite de burst" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Each plan also includes a burst limit (requests per 10 seconds) to prevent spam. See the [Authentication](ref:authentication#rate-limits) page for details.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Chaque offre inclut également une limite de burst (requêtes par 10 secondes) pour éviter le spam. Voir la page [Authentification](ref:authentication#rate-limits) pour les détails.",
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: "custom-plans",
            level: 2,
            title: { en: "Custom Plans", fr: "Offres personnalisées" },
            aliases: ["offres-personnalisees"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "If you need more than 10,000 requests per hour or a custom pricing plan, send an email to [contact@sylvain.sh](mailto:contact@sylvain.sh).",
                        fr: "Si vous souhaitez un nombre de requêtes supérieur à 10 000 par heure ou un tarif personnalisé, envoyez un email à [contact@sylvain.sh](mailto:contact@sylvain.sh).",
                    },
                },
            ],
        },
        {
            id: "authentication",
            level: 2,
            title: { en: "Authentication", fr: "Authentification" },
            aliases: ["authentification"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "See the [Authentication](ref:authentication) page for how to send your API key, check your plan with `GET /auth`, and handle error responses.",
                        fr: "Voir la page [Authentification](ref:authentication) pour inclure votre clé API, vérifier votre offre avec `GET /auth`, et gérer les réponses d'erreur.",
                    },
                },
            ],
        },
    ],
};
