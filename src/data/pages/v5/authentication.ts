import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "authentication",
    kind: "article",
    title: { en: "Authentication", fr: "Authentification" },
    lead: {
        en: "The moxon API uses Bearer token authentication to identify users with premium plans.",
        fr: "L'API moxon utilise l'authentification par token Bearer pour identifier les utilisateurs avec des plans premium.",
    },
    updated: "2026-07-31",
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
                        en: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.moxon.dev/v5/infos',
                        fr: 'curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.moxon.dev/v5/infos',
                    },
                },
            ],
        },
        {
            id: "checking-your-plan",
            level: 2,
            title: { en: "Checking Your Plan", fr: "Vérifier son offre" },
            aliases: ["verifier-son-offre"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Use `GET /auth` to check which tier a token resolves to, along with its limits:",
                        fr: "Utilisez `GET /auth` pour vérifier le tier auquel un token correspond, ainsi que ses limites :",
                    },
                },
                {
                    type: "code",
                    lang: "bash",
                    text: {
                        en: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.moxon.dev/auth',
                        fr: 'curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.moxon.dev/auth',
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "authenticated": true,\n    "tier": "pro",\n    "limits": {\n        "hourly": 6000,\n        "burst": 120\n    }\n}',
                },
                {
                    type: "p",
                    text: {
                        en: "Without a token, it returns the `default` tier instead of an error:",
                        fr: "Sans token, elle retourne le tier `default` au lieu d'une erreur :",
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "authenticated": false,\n    "tier": "default",\n    "limits": {\n        "hourly": 2000,\n        "burst": 50\n    }\n}',
                },
                {
                    type: "p",
                    text: {
                        en: "An invalid token returns the same `401` shown below.",
                        fr: "Un token invalide retourne la même erreur `401` que ci-dessous.",
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
                    head: {
                        en: ["Plan", "Requests/hour", "Burst/10s"],
                        fr: ["Plan", "Requêtes/heure", "Burst/10s"],
                    },
                    rows: [
                        ["Free", { en: "2,000", fr: "2 000" }, "50"],
                        ["Advanced", { en: "3,500", fr: "3 500" }, "80"],
                        ["Pro", { en: "6,000", fr: "6 000" }, "120"],
                        ["Business", { en: "10,000", fr: "10 000" }, "200"],
                    ],
                    kind: "matrix",
                },
                {
                    type: "callout",
                    kind: "tip",
                    title: { en: "Burst Limit", fr: "Limite de burst" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "The burst limit prevents sending too many requests in a short window. If you exceed the burst limit, you will receive a `429 Too Many Requests` response.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "La limite de burst empêche l'envoi de trop de requêtes dans un court laps de temps. Si vous dépassez la limite de burst, vous recevrez une réponse `429 Too Many Requests`.",
                            },
                        ],
                    },
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
                    type: "callout",
                    kind: "warning",
                    title: "Note",
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "If no token is provided, the request is treated as unauthenticated and uses the [Free](ref:pricing#plans) tier limits (2,000 requests/hour).",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Si aucun token n'est fourni, la requête est traitée comme non authentifiée et utilise les limites de l'offre [Gratuit](ref:pricing#plans) (2 000 requêtes/heure).",
                            },
                        ],
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
