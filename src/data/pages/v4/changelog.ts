import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "changelog",
    kind: "changelog",
    title: { en: "Changelog", fr: "Changelog" },
    updated: "2026-05-25",
    sections: [
        { id: "", blocks: [] },
        {
            id: "migration-guide",
            level: 2,
            title: { en: "Migration Guide", fr: "Guide de migration" },
            aliases: ["guide-de-migration"],
            blocks: [],
        },
        {
            id: "use-latest-recommended",
            level: 3,
            title: { en: "Use `/latest` (recommended)", fr: "Utiliser `/latest` (recommandé)" },
            aliases: ["utiliser-latest-recommande"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Use `api.moxon.dev/latest` to always point to the latest version:",
                        fr: "Utilisez `api.moxon.dev/latest` pour toujours pointer vers la dernière version :",
                    },
                },
                {
                    type: "code",
                    text: "https://api.moxon.dev/latest/infos\nhttps://api.moxon.dev/latest/token",
                },
            ],
        },
        {
            id: "manual-migration",
            level: 3,
            title: { en: "Manual Migration", fr: "Migration manuelle" },
            aliases: ["migration-manuelle"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Replace all occurrences of `/v3/` with `/v4/` in your API requests:",
                        fr: "Remplacez `/v3/` par `/v4/` dans vos requêtes :",
                    },
                },
                {
                    type: "code",
                    text: {
                        en: "# Before\nhttps://api.moxon.dev/v3/infos\n\n# After\nhttps://api.moxon.dev/v4/infos",
                        fr: "# Avant\nhttps://api.moxon.dev/v3/infos\n\n# Après\nhttps://api.moxon.dev/v4/infos",
                    },
                },
            ],
        },
        {
            id: "endpoint-compatibility",
            level: 3,
            title: { en: "Endpoint Compatibility", fr: "Compatibilité des endpoints" },
            aliases: ["compatibilite-des-endpoints"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Most endpoints are compatible. Some response fields changed shape (username, personal, domain) and some parameter defaults changed (convert, time, token) — check the individual endpoint pages if something breaks.",
                        fr: "La plupart des endpoints sont compatibles. Certains champs de réponse ont changé de structure (username, personal, domain) et certains paramètres par défaut ont évolué (convert, time, token) — consultez les pages d'endpoints concernées en cas de problème.",
                    },
                },
            ],
        },
        {
            id: "versions",
            level: 2,
            title: { en: "Versions", fr: "Versions" },
            blocks: [
                {
                    type: "table",
                    head: { en: ["Version", "Highlights"], fr: ["Version", "Points clés"] },
                    rows: [
                        [
                            "[4.9.0](ref:changelog/4.9.0)",
                            {
                                en: "Added Credit, Avatar, Barcode endpoints",
                                fr: "Ajout des endpoints Credit, Avatar, Barcode",
                            },
                        ],
                        [
                            "[4.8.0](ref:changelog/4.8.0)",
                            {
                                en: "Added Cron, Regex endpoints; countdown on Time",
                                fr: "Ajout des endpoints Cron, Regex ; compte à rebours sur Time",
                            },
                        ],
                        [
                            "[4.7.0](ref:changelog/4.7.0)",
                            {
                                en: "Added Address, Password endpoints; overhauled Token",
                                fr: "Ajout des endpoints Address, Password ; refonte de Token",
                            },
                        ],
                        [
                            "[4.6.0](ref:changelog/4.6.0)",
                            {
                                en: "Added Agent, IP, Headers endpoints; security hardening",
                                fr: "Ajout des endpoints Agent, IP, Headers ; sécurité renforcée",
                            },
                        ],
                        [
                            "[4.5.0](ref:changelog/4.5.0)",
                            {
                                en: "Security audit, rate limiting, input hardening",
                                fr: "Audit de sécurité, rate limiting, durcissement des entrées",
                            },
                        ],
                        [
                            "[4.4.0](ref:changelog/4.4.0)",
                            {
                                en: "Added QR Code, Captcha, Color, Convert, Hash",
                                fr: "Ajout des endpoints QR Code, Captcha, Color, Convert, Hash",
                            },
                        ],
                        [
                            "[4.3.0](ref:changelog/4.3.0)",
                            {
                                en: "Added Geo, Palette, Placeholder; REST standardization",
                                fr: "Ajout des endpoints Geo, Palette, Placeholder ; standardisation REST",
                            },
                        ],
                        [
                            "[4.2.0](ref:changelog/4.2.0)",
                            {
                                en: "Added Encode, Text, Validate endpoints",
                                fr: "Ajout des endpoints Encode, Text, Validate",
                            },
                        ],
                        [
                            "[4.1.0](ref:changelog/4.1.0)",
                            {
                                en: "Added Dice, Statistics; Roman numeral support",
                                fr: "Ajout des endpoints Dice, Statistics ; support des chiffres romains",
                            },
                        ],
                        [
                            "[4.0.0](ref:changelog/4.0.0)",
                            {
                                en: "Full TypeScript rewrite; new Algorithms, Levenshtein, Username, Chat",
                                fr: "Réécriture complète en TypeScript ; nouveaux endpoints Algorithms, Levenshtein, Username, Chat",
                            },
                        ],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "previous-versions",
            level: 2,
            title: { en: "Previous Versions", fr: "Versions précédentes" },
            aliases: ["versions-precedentes"],
            blocks: [
                {
                    type: "list",
                    items: [
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
