import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "index",
    kind: "index",
    title: { en: "Getting Started", fr: "Commencer" },
    lead: {
        en: "Welcome to the **moxon API v3** documentation. This is an outdated version of the API, kept for reference.",
        fr: "Bienvenue dans la documentation de l'**API moxon v3**. Version obsolète de l'API, conservée à titre de référence.",
    },
    banner: true,
    updated: "2026-10-17",
    sections: [
        { id: "", blocks: [] },
        {
            id: "base-url",
            level: 2,
            title: { en: "Base URL", fr: "URL de base" },
            aliases: ["url-de-base"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "All API requests should be made to:",
                        fr: "Toutes les requêtes API doivent être effectuées vers :",
                    },
                },
                { type: "code", text: "https://api.moxon.dev/v3" },
            ],
        },
        {
            id: "quick-example",
            level: 2,
            title: { en: "Quick Example", fr: "Exemple rapide" },
            aliases: ["exemple-rapide"],
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X GET "https://api.moxon.dev/v3/infos"',
                },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "endpoints": 20,\n    "last_version": "v3",\n    "documentation": "https://docs.sylvain.sh",\n    "github": "https://github.com/moxondev/api",\n    "creation": "November 25th 2024"\n}',
                },
            ],
        },
        {
            id: "rate-limiting",
            level: 2,
            title: { en: "Rate Limiting", fr: "Limitation de débit" },
            aliases: ["limitation-de-debit"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Some endpoints have rate limiting to prevent abuse. If you exceed the [rate limit](ref:pricing), you'll receive an error response:",
                        fr: "Certains endpoints ont une [limitation de débit](ref:pricing) pour éviter les abus. Si vous dépassez la limite, vous recevrez une réponse d'erreur :",
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
            title: { en: "Error Handling", fr: "Gestion des erreurs" },
            aliases: ["gestion-des-erreurs"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "All endpoints return consistent error responses:",
                        fr: "Tous les endpoints retournent des réponses d'erreur cohérentes :",
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
            title: { en: "Other Versions", fr: "Autres versions" },
            aliases: ["autres-versions"],
            blocks: [
                {
                    type: "list",
                    items: [
                        {
                            en: "[v2 Documentation](ref:v2/index) - Previous stable version",
                            fr: "[Documentation v2](ref:v2/index) - Version stable précédente",
                        },
                        {
                            en: "[v1 Documentation](ref:v1/index) - Legacy version",
                            fr: "[Documentation v1](ref:v1/index) - Version ancienne",
                        },
                    ],
                },
            ],
        },
    ],
};
