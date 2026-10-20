import type { Page } from "@/types/content";

export const page: Page = {
    version: "v1",
    id: "index",
    kind: "index",
    title: { en: "Getting Started", fr: "Pour Commencer" },
    lead: {
        en: "Welcome to the **moxon API v1** documentation. This is the legacy version of the API.",
        fr: "Bienvenue dans la documentation de l'**API moxon v1**. Ceci est la version historique de l'API.",
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
                { type: "code", text: "https://api.moxon.dev/v1" },
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
                    text: 'curl -X GET "https://api.moxon.dev/v1/infos"',
                },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "endpoints": 11,\n    "last_version": "v1",\n    "documentation": "https://docs.sylvain.sh",\n    "github": "https://github.com/moxondev/api",\n    "creation": "November 25th 2024"\n}',
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
                            en: "[v2 Documentation](ref:v2/index) - Legacy version",
                            fr: "[Documentation v2](ref:v2/index) - Ancienne version",
                        },
                    ],
                },
            ],
        },
    ],
};
