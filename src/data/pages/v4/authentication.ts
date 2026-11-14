import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "authentication",
    kind: "article",
    title: { en: "Authentication", fr: "Authentification" },
    lead: {
        en: "The moxon API uses Bearer token authentication to identify users with premium plans.",
        fr: "L'API moxon utilise l'authentification par token Bearer pour identifier les utilisateurs avec des plans premium.",
    },
    updated: "2026-11-14",
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
                        en: 'curl -H "Authorization: Bearer YOUR_API_KEY" https://api.moxon.dev/v4/infos',
                        fr: 'curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.moxon.dev/v4/infos',
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
                    type: "callout",
                    kind: "info",
                    title: {
                        en: "How requests are counted",
                        fr: "Comment les requêtes sont comptées",
                    },
                    body: {
                        en: [
                            { type: "p", text: "Limits apply per client address:" },
                            {
                                type: "list",
                                items: [
                                    "An IPv6 client is counted by its `/64` block, so changing address inside it does not reset the quota. An IPv4-mapped IPv6 address counts as its IPv4 address.",
                                    "All the `/64` blocks of one `/48` network share four times the hourly quota of the plan (8,000 requests per hour on Free). Beyond it, the API answers `429` with `Too many requests from your network.` and a `Retry-After` header.",
                                    "The limiter runs before the body is read, so a request with a malformed body or a body larger than 10 KB counts against your quota like any other. The instance-wide limit counts only the requests that were admitted.",
                                ],
                            },
                        ],
                        fr: [
                            { type: "p", text: "Les limites s'appliquent par adresse de client :" },
                            {
                                type: "list",
                                items: [
                                    "Un client IPv6 est compté par son bloc `/64` : changer d'adresse à l'intérieur de ce bloc ne remet pas le quota à zéro. Une adresse IPv6 mappée IPv4 compte comme son adresse IPv4.",
                                    "Tous les blocs `/64` d'un même réseau `/48` se partagent quatre fois le quota horaire de l'offre (8 000 requêtes par heure en Gratuit). Au-delà, l'API répond `429` avec `Too many requests from your network.` et un en-tête `Retry-After`.",
                                    "Le limiteur s'exécute avant la lecture du corps : une requête dont le corps est mal formé ou dépasse 10 Ko est comptée dans votre quota comme n'importe quelle autre. La limite globale de l'instance ne compte que les requêtes admises.",
                                ],
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
