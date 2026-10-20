import type { Page } from "@/types/content";

export const page: Page = {
    version: "v2",
    id: "index",
    kind: "index",
    title: { en: "Getting Started", fr: "Pour Commencer" },
    lead: {
        en: "Welcome to the **moxon API v2** documentation. This is an older version of the API, kept for compatibility.",
        fr: "Bienvenue dans la documentation de l'**API moxon v2**. Ancienne version de l'API, conservée pour compatibilité.",
    },
    banner: true,
    updated: "2026-10-17",
    sections: [
        { id: "", blocks: [] },
        {
            id: "base-url",
            level: 2,
            title: { en: "Base URL", fr: "URL de Base" },
            aliases: ["url-de-base"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "All API requests should be made to:",
                        fr: "Toutes les requêtes API doivent être effectuées vers :",
                    },
                },
                { type: "code", text: "https://api.moxon.dev/v2" },
            ],
        },
        {
            id: "quick-example",
            level: 2,
            title: { en: "Quick Example", fr: "Exemple Rapide" },
            aliases: ["exemple-rapide"],
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X GET "https://api.moxon.dev/v2/infos"',
                },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "endpoints": 17,\n    "last_version": "v2",\n    "documentation": "https://docs.sylvain.sh",\n    "github": "https://github.com/moxondev/api",\n    "creation": "November 25th 2024"\n}',
                },
            ],
        },
        {
            id: "rate-limiting",
            level: 2,
            title: { en: "Rate Limiting", fr: "Limitation de Débit" },
            aliases: ["limitation-de-debit"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Some endpoints have rate limiting to prevent abuse. If you exceed the [rate limit](ref:v3/pricing), you'll receive an error response:",
                        fr: "Certains points d'accès ont une [limitation de débit](ref:v3/pricing) pour prévenir les abus. Si vous dépassez la limite, vous recevrez une réponse d'erreur :",
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "error": "Rate limit exceeded. Try again in X seconds."\n}',
                },
            ],
        },
        {
            id: "error-handling",
            level: 2,
            title: { en: "Error Handling", fr: "Gestion des Erreurs" },
            aliases: ["gestion-des-erreurs"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "All endpoints return consistent error responses:",
                        fr: "Tous les points d'accès retournent des réponses d'erreur cohérentes :",
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: {
                        en: '{\n    "error": "Description of the error"\n}',
                        fr: '{\n    "error": "Description de l\'erreur"\n}',
                    },
                },
            ],
        },
        {
            id: "other-versions",
            level: 2,
            title: { en: "Other Versions", fr: "Autres Versions" },
            aliases: ["autres-versions"],
            blocks: [
                {
                    type: "list",
                    items: [
                        {
                            en: "[v4 Documentation](ref:v4/index) - Latest version (recommended)",
                            fr: "[Documentation v4](ref:v4/index) - Dernière version (recommandée)",
                        },
                        {
                            en: "[v3 Documentation](ref:v3/index) - Previous stable version",
                            fr: "[Documentation v3](ref:v3/index) - Version stable précédente",
                        },
                        {
                            en: "[v1 Documentation](ref:v1/index) - Legacy version",
                            fr: "[Documentation v1](ref:v1/index) - Version historique",
                        },
                    ],
                },
            ],
        },
    ],
};
