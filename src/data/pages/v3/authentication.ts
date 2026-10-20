import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "authentication",
    kind: "article",
    title: { en: "Authentication", fr: "Authentification" },
    lead: {
        en: "The moxon API uses Bearer token authentication to identify users with premium plans.",
        fr: "L'API moxon utilise l'authentification par token Bearer pour identifier les utilisateurs avec des plans premium.",
    },
    updated: "2026-04-08",
    sections: [
        { id: "", blocks: [] },
        {
            id: "usage",
            level: 2,
            title: { en: "Usage", fr: "Utilisation" },
            aliases: ["utilisation"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "To authenticate your requests, include your API key in the `Authorization` header:",
                        fr: "Pour authentifier vos requêtes, incluez votre clé API dans le header `Authorization` :",
                    },
                },
                {
                    type: "code",
                    lang: "bash",
                    text: {
                        en: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.moxon.dev/v3/infos',
                        fr: 'curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.moxon.dev/v3/infos',
                    },
                },
            ],
        },
        {
            id: "rate-limits",
            level: 2,
            title: { en: "Rate Limits", fr: "Limites de requêtes" },
            aliases: ["limites-de-requetes"],
            blocks: [
                {
                    type: "table",
                    head: { en: ["Plan", "Requests/hour"], fr: ["Plan", "Requêtes/heure"] },
                    rows: [
                        ["Free", { en: "2,000", fr: "2 000" }],
                        ["Advanced", { en: "3,500", fr: "3 500" }],
                        ["Pro", { en: "6,000", fr: "6 000" }],
                        ["Business", { en: "10,000", fr: "10 000" }],
                    ],
                    kind: "definition",
                },
                {
                    type: "p",
                    text: {
                        en: "See the [Pricing](ref:pricing) page for more details.",
                        fr: "Voir la page [Tarification](ref:pricing) pour plus de détails.",
                    },
                },
            ],
        },
        {
            id: "error-responses",
            level: 2,
            title: { en: "Error Responses", fr: "Réponses d'erreur" },
            aliases: ["reponses-d-erreur"],
            blocks: [],
        },
        {
            id: "invalid-token",
            level: 3,
            title: { en: "Invalid Token", fr: "Token invalide" },
            aliases: ["token-invalide"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "If the provided token is incorrect or expired:",
                        fr: "Si le token fourni est incorrect ou expiré :",
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "message": "Unauthorized",\n    "error": "Invalid token.",\n    "status": "401"\n}',
                },
            ],
        },
        {
            id: "no-token",
            level: 3,
            title: { en: "No Token", fr: "Aucun token" },
            aliases: ["aucun-token"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "If no token is provided, the request uses the FREE tier limits (2,000 requests/hour).",
                        fr: "Si aucun token n'est fourni, la requête utilise les limites du tier FREE (2 000 requêtes/heure).",
                    },
                },
            ],
        },
        {
            id: "getting-an-api-key",
            level: 2,
            title: { en: "Getting an API Key", fr: "Obtenir une clé API" },
            aliases: ["obtenir-une-cle-api"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "To obtain an API key, purchase a plan on the [Pricing](ref:pricing) page. Your unique token will be sent to your email after purchase.",
                        fr: "Pour obtenir une clé API, achetez un plan sur la page [Tarification](ref:pricing). Votre token unique sera envoyé à votre email après l'achat.",
                    },
                },
            ],
        },
    ],
};
