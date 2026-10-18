import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "index",
    kind: "index",
    title: { en: "Getting Started", fr: "Commencer" },
    lead: {
        en: "Welcome to the **moxon API v5** documentation. This API provides a comprehensive collection of utility endpoints for developers.",
        fr: "Bienvenue dans la documentation de l'**API moxon v5**. Cette API fournit une collection complète d'endpoints utilitaires pour les développeurs.",
    },
    banner: true,
    updated: "2026-09-07",
    operations: [{ id: "default", method: "get", path: "/infos", try: true, params: [] }],
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
                { type: "code", text: "https://api.moxon.dev/v5" },
            ],
        },
        {
            id: "quick-example",
            level: 2,
            title: { en: "Quick Example", fr: "Exemple rapide" },
            aliases: ["exemple-rapide"],
            blocks: [{ type: "try", op: "default", autoSend: true }],
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
                    text: '{\n    "message": "Too Many Requests",\n    "error": "You have exceeded the limit of 2000 requests per hour.",\n    "status": "429"\n}',
                },
                {
                    type: "p",
                    text: {
                        en: "Depending on the endpoint and limiter, the error message may also be:",
                        fr: "Selon l'endpoint et le limiteur appliqué, le message d'erreur peut aussi être :",
                    },
                },
                {
                    type: "list",
                    items: [
                        "`Global rate limit exceeded.`",
                        "`Rate limit exceeded. Try again in X seconds.`",
                    ],
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
                        en: '{\n    "message": "Bad Request",\n    "error": "Description of the error",\n    "status": "400"\n}',
                        fr: '{\n    "message": "Bad Request",\n    "error": "Description de l\'erreur",\n    "status": "400"\n}',
                    },
                },
                {
                    type: "p",
                    text: {
                        en: "Requesting an endpoint that doesn't exist also returns a structured JSON error:",
                        fr: "Requêter un endpoint qui n'existe pas retourne aussi une erreur JSON structurée :",
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "message": "Not Found",\n    "error": "Endpoint \'/v5/doesnotexist\' does not exist.",\n    "status": "404"\n}',
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
                            en: "[v4 Documentation](ref:v4/index) - Previous stable version",
                            fr: "[Documentation v4](ref:v4/index) - Version stable précédente",
                        },
                        {
                            en: "[v3 Documentation](ref:v3/index) - Legacy version",
                            fr: "[Documentation v3](ref:v3/index) - Ancienne version",
                        },
                    ],
                },
            ],
        },
    ],
};
