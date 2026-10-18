import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "changelog",
    kind: "changelog",
    title: { en: "Changelog", fr: "Changelog" },
    updated: "2026-07-31",
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
                    text: "https://api.moxon.dev/latest/infos\nhttps://api.moxon.dev/latest/evaluate",
                },
                {
                    type: "p",
                    text: {
                        en: "Nested paths and query strings are preserved through the redirect:",
                        fr: "Les chemins imbriqués et les paramètres de requête sont préservés par la redirection :",
                    },
                },
                {
                    type: "code",
                    text: {
                        en: "https://api.moxon.dev/latest/chat/private?session=abc\n# redirects to /v5/chat/private?session=abc",
                        fr: "https://api.moxon.dev/latest/chat/private?session=abc\n# redirige vers /v5/chat/private?session=abc",
                    },
                },
                {
                    type: "p",
                    text: {
                        en: "The redirect works for any HTTP method (`GET`, `POST`, `PATCH`, `DELETE`...) via a `307 Temporary Redirect`, which preserves the original method and body — so `POST /latest/token` redirects to `POST /v5/token` with its body intact.",
                        fr: "La redirection fonctionne avec n'importe quelle méthode HTTP (`GET`, `POST`, `PATCH`, `DELETE`...) via un `307 Temporary Redirect`, qui préserve la méthode et le corps d'origine — ainsi `POST /latest/token` redirige vers `POST /v5/token` avec son corps intact.",
                    },
                },
                {
                    type: "callout",
                    kind: "tip",
                    title: { en: "Tip", fr: "Astuce" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Most HTTP clients don't follow redirects by default. With `curl`, add the `-L` (`--location`) flag, or you'll get the `307` response without ever reaching `/v5`.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "La plupart des clients HTTP ne suivent pas les redirections par défaut. Avec `curl`, ajoutez l'option `-L` (`--location`), sinon vous recevrez la réponse `307` sans jamais atteindre `/v5`.",
                            },
                        ],
                    },
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
                        en: "Replace all occurrences of `/v4/` with `/v5/` in your API requests:",
                        fr: "Remplacez `/v4/` par `/v5/` dans vos requêtes :",
                    },
                },
                {
                    type: "code",
                    text: {
                        en: "# Before\nhttps://api.moxon.dev/v4/infos\n\n# After\nhttps://api.moxon.dev/v5/infos",
                        fr: "# Avant\nhttps://api.moxon.dev/v4/infos\n\n# Après\nhttps://api.moxon.dev/v5/infos",
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
                        en: "All v4 endpoints are fully compatible in v5. New endpoints are listed in the [5.0.0 changelog](ref:changelog/5.0.0).",
                        fr: "Tous les endpoints v4 sont entièrement compatibles en v5. Les nouveaux endpoints sont listés dans le [changelog 5.0.0](ref:changelog/5.0.0).",
                    },
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
                            en: "[v4 Changelog](ref:v4/changelog) - View all v4 releases",
                            fr: "[Changelog v4](ref:v4/changelog) - Voir toutes les versions v4",
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
