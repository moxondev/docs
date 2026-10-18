import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "changelog",
    kind: "changelog",
    title: { en: "Changelog", fr: "Changelog" },
    updated: "2026-10-17",
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
                        en: "https://api.moxon.dev/latest/chat/private?session=abc\n# redirects to /v6/chat/private?session=abc",
                        fr: "https://api.moxon.dev/latest/chat/private?session=abc\n# redirige vers /v6/chat/private?session=abc",
                    },
                },
                {
                    type: "p",
                    text: {
                        en: "The redirect works for any HTTP method (`GET`, `POST`, `PATCH`, `DELETE`...) via a `307 Temporary Redirect`, which preserves the original method and body — so `POST /latest/token` redirects to `POST /v6/token` with its body intact.",
                        fr: "La redirection fonctionne avec n'importe quelle méthode HTTP (`GET`, `POST`, `PATCH`, `DELETE`...) via un `307 Temporary Redirect`, qui préserve la méthode et le corps d'origine — ainsi `POST /latest/token` redirige vers `POST /v6/token` avec son corps intact.",
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
                                text: "Most HTTP clients don't follow redirects by default. With `curl`, add the `-L` (`--location`) flag, or you'll get the `307` response without ever reaching `/v6`.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "La plupart des clients HTTP ne suivent pas les redirections par défaut. Avec `curl`, ajoutez l'option `-L` (`--location`), sinon vous recevrez la réponse `307` sans jamais atteindre `/v6`.",
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
                        en: "Replace all occurrences of `/v5/` with `/v6/` in your API requests:",
                        fr: "Remplacez `/v5/` par `/v6/` dans vos requêtes :",
                    },
                },
                {
                    type: "code",
                    text: {
                        en: "# Before\nhttps://api.moxon.dev/v5/infos\n\n# After\nhttps://api.moxon.dev/v6/infos",
                        fr: "# Avant\nhttps://api.moxon.dev/v5/infos\n\n# Après\nhttps://api.moxon.dev/v6/infos",
                    },
                },
            ],
        },
        {
            id: "migrating-from-20syldev-api",
            level: 3,
            title: { en: "Migrating from @20syldev/api", fr: "Migrer depuis @20syldev/api" },
            aliases: ["migrer-depuis-20syldev-api"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The `@20syldev/api` package becomes `@moxon/api` and no longer evolves. The exports and the `/v6` HTTP API are unchanged: migrating only takes a rename.",
                        fr: "Le paquet `@20syldev/api` devient `@moxon/api` et n'évolue plus. Les exports et l'API HTTP `/v6` sont inchangés : migrer ne demande qu'un renommage.",
                    },
                },
                {
                    type: "code",
                    lang: "bash",
                    text: "npm uninstall @20syldev/api\nnpm install @moxon/api",
                },
                {
                    type: "p",
                    text: {
                        en: "Then replace the package name in your imports. The sub-paths are identical:",
                        fr: "Remplacez ensuite le nom du paquet dans vos imports. Les sous-chemins sont identiques :",
                    },
                },
                {
                    type: "code",
                    lang: "diff",
                    text: "- import { evaluate } from '@20syldev/api/v6';\n+ import { evaluate } from '@moxon/api/v6';",
                },
                {
                    type: "table",
                    head: { en: ["Before", "After"], fr: ["Avant", "Après"] },
                    rows: [
                        ["`@20syldev/api`", "`@moxon/api`"],
                        ["`@20syldev/api/v4`", "`@moxon/api/v4`"],
                        ["`@20syldev/api/v5`", "`@moxon/api/v5`"],
                        ["`@20syldev/api/v6`", "`@moxon/api/v6`"],
                        ["`@20syldev/api/server`", "`@moxon/api/server`"],
                    ],
                    kind: "definition",
                },
                {
                    type: "p",
                    text: {
                        en: "The `@moxon/api/manifest` sub-path is new and experimental: see the [Manifest](ref:manifest) page.",
                        fr: "Le sous-chemin `@moxon/api/manifest` est nouveau et expérimental : voir la page [Manifest](ref:manifest).",
                    },
                },
                {
                    type: "callout",
                    kind: "warning",
                    title: { en: "Versions v1 to v3", fr: "Versions v1 à v3" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "`v1`, `v2` and `v3` were retired in 6.0.0. They remain available only through `@20syldev/api@5.9.0`.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "`v1`, `v2` et `v3` ont été retirées en 6.0.0. Elles ne restent disponibles que via `@20syldev/api@5.9.0`.",
                            },
                        ],
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
                        en: "v6 is **not** a drop-in replacement for v5. Five endpoints changed method or path, the captcha changed its default mode, and the `status` field of error responses changed type. Read the [6.0.0 changelog](ref:changelog/6.0.0) before migrating.",
                        fr: "La v6 n'est **pas** un remplacement transparent de la v5. Cinq endpoints changent de méthode ou de chemin, le captcha change de mode par défaut, et le champ `status` des réponses d'erreur change de type. Lisez le [changelog 6.0.0](ref:changelog/6.0.0) avant de migrer.",
                    },
                },
                {
                    type: "table",
                    head: { en: ["What changed", "v5", "v6"], fr: ["Ce qui change", "v5", "v6"] },
                    rows: [
                        [
                            { en: "Clear a private chat", fr: "Effacer un chat privé" },
                            "`DELETE /chat/:token`",
                            "`POST /chat/clear`",
                        ],
                        [
                            { en: "Play a move (body)", fr: "Jouer un coup (corps)" },
                            "`POST /tic-tac-toe`",
                            "`POST /tic-tac-toe/play`",
                        ],
                        [
                            { en: "Play a move (URL)", fr: "Jouer un coup (URL)" },
                            "`PATCH /tic-tac-toe/:game`",
                            "`POST /tic-tac-toe/play`",
                        ],
                        [
                            { en: "Forfeit a game", fr: "Abandonner une partie" },
                            "`DELETE /tic-tac-toe/:game`",
                            "`POST /tic-tac-toe/forfeit`",
                        ],
                        [
                            { en: "Compare two strings", fr: "Comparer deux chaînes" },
                            "`GET /levenshtein`",
                            "`POST /levenshtein`",
                        ],
                        [
                            { en: "Captcha default mode", fr: "Mode captcha par défaut" },
                            "`image`",
                            "`challenge`",
                        ],
                        [
                            { en: "`status` in error responses", fr: "`status` dans les erreurs" },
                            { en: 'string (`"400"`)', fr: 'chaîne (`"400"`)' },
                            { en: "number (`400`)", fr: "nombre (`400`)" },
                        ],
                    ],
                    kind: "matrix",
                },
                {
                    type: "p",
                    text: {
                        en: "`/hyperplanning` is deprecated and no longer listed in v6; it still answers, and disappears in 7.0.0.",
                        fr: "`/hyperplanning` est déprécié et n'est plus listé en v6 ; il répond encore, et disparaîtra en 7.0.0.",
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
                            en: "[v5 Changelog](ref:v5/changelog) - View all v5 releases",
                            fr: "[Changelog v5](ref:v5/changelog) - Voir toutes les versions v5",
                        },
                        {
                            en: "[v4 Documentation](ref:v4/index) - Legacy version",
                            fr: "[Documentation v4](ref:v4/index) - Ancienne version",
                        },
                    ],
                },
            ],
        },
    ],
};
