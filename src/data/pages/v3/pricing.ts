import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
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
            blocks: [{ type: "plans" }],
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
                        en: "To use your API key, include it in the `Authorization` header:",
                        fr: "Pour utiliser votre clé API, incluez-la dans l'en-tête `Authorization` :",
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
            id: "error-response",
            level: 3,
            title: { en: "Error Response", fr: "Réponse d'erreur" },
            aliases: ["reponse-d-erreur"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "If the provided token is incorrect or expired, you will receive a 401 error:",
                        fr: "Si le token fourni est incorrect ou expiré, vous obtiendrez une erreur 401 :",
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "message": "Unauthorized",\n    "error": "Invalid token.",\n    "status": "401"\n}',
                },
                {
                    type: "callout",
                    kind: "warning",
                    title: "Note",
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "If no token is provided, the request is treated as unauthenticated and uses the [FREE](#plans) tier limits.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Si aucun token n'est fourni, la requête est traitée comme non authentifiée et utilise les limites de l'offre [GRATUIT](#plans).",
                            },
                        ],
                    },
                },
            ],
        },
    ],
};
