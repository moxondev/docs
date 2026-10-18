import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "index",
    kind: "index",
    title: { en: "Getting Started", fr: "Commencer" },
    lead: {
        en: "Welcome to the **moxon API v6** documentation. This API provides a comprehensive collection of utility endpoints for developers.",
        fr: "Bienvenue dans la documentation de l'**API moxon v6**. Cette API fournit une collection complète d'endpoints utilitaires pour les développeurs.",
    },
    banner: true,
    updated: "2026-10-18",
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
                { type: "code", text: "https://api.moxon.dev/v6" },
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
            id: "using-the-npm-package",
            level: 2,
            title: { en: "Using the npm package", fr: "Utiliser le paquet npm" },
            aliases: ["utiliser-le-paquet-npm"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The HTTP API available at `https://api.moxon.dev` needs no package: a plain request is enough. The **`@moxon/api`** npm package is useful to call the same utilities straight from Node.js, without going through the network.",
                        fr: "L'API HTTP disponible sur `https://api.moxon.dev` n'a besoin d'aucun paquet : une simple requête suffit. Le paquet npm **`@moxon/api`** est utile pour appeler les mêmes utilitaires directement depuis Node.js, sans passer par le réseau.",
                    },
                },
                { type: "code", lang: "bash", text: "npm install @moxon/api" },
                {
                    type: "p",
                    text: {
                        en: "The package requires **Node.js 22.12 or newer**. It ships as ESM, but remains usable from CommonJS: Node has been able to `require()` an ESM module since 22.12, which is why that is the floor.",
                        fr: "Le paquet demande **Node.js 22.12 ou plus récent**. Il est distribué en ESM, mais reste utilisable depuis CommonJS : Node sait charger un module ESM avec `require()` depuis la 22.12, d'où cette version minimale.",
                    },
                },
                {
                    type: "code",
                    lang: "js",
                    text: "import { evaluate } from '@moxon/api'; // ESM\nconst { evaluate } = require('@moxon/api'); // CommonJS",
                },
            ],
        },
        {
            id: "available-imports",
            level: 3,
            title: { en: "Available imports", fr: "Imports disponibles" },
            aliases: ["imports-disponibles"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The root import always resolves to the latest version. Use a subpath (`/v4` to `/v6`) to pin a specific one.",
                        fr: "L'import racine pointe toujours vers la dernière version. Utilisez un sous-chemin (`/v4` à `/v6`) pour figer une version précise.",
                    },
                },
                {
                    type: "table",
                    head: { en: ["Import", "Contents"], fr: ["Import", "Contenu"] },
                    rows: [
                        [
                            "`@moxon/api`",
                            {
                                en: "Latest version, equivalent to `@moxon/api/v6`",
                                fr: "Dernière version, équivalent à `@moxon/api/v6`",
                            },
                        ],
                        ["`@moxon/api/v4`", { en: "The v4 functions", fr: "Fonctions de la v4" }],
                        ["`@moxon/api/v5`", { en: "The v5 functions", fr: "Fonctions de la v5" }],
                        ["`@moxon/api/v6`", { en: "The v6 functions", fr: "Fonctions de la v6" }],
                        [
                            "`@moxon/api/server`",
                            {
                                en: "The API's HTTP server, with all its versions, started on import",
                                fr: "Le serveur HTTP de l'API, avec toutes ses versions, démarré à l'import",
                            },
                        ],
                        [
                            "`@moxon/api/manifest`",
                            {
                                en: "Description of the endpoints as data (**experimental**)",
                                fr: "Description des endpoints sous forme de données (**expérimental**)",
                            },
                        ],
                    ],
                    kind: "definition",
                },
                {
                    type: "p",
                    text: {
                        en: "The server loads its plugins asynchronously: from CommonJS, it must be imported rather than required.",
                        fr: "Le serveur charge ses plugins de façon asynchrone : depuis CommonJS, il faut l'importer plutôt que le `require()`.",
                    },
                },
                {
                    type: "code",
                    lang: "js",
                    text: {
                        en: "await import('@moxon/api/server'); // from CommonJS",
                        fr: "await import('@moxon/api/server'); // depuis CommonJS",
                    },
                },
            ],
        },
        {
            id: "usage-example",
            level: 3,
            title: { en: "Usage example", fr: "Exemple d'utilisation" },
            aliases: ["exemple-d-utilisation"],
            blocks: [
                {
                    type: "code",
                    lang: "js",
                    text: {
                        en: "// Latest version, equivalent to '@moxon/api/v6'\nimport { color, evaluate, username } from '@moxon/api';\n\n// Or a specific version\nimport { color as colorV4 } from '@moxon/api/v4';\n\n// Evaluate a math expression\nconst expr = evaluate('sin(pi / 2) + sqrt(4)', 5);\nconsole.log(expr.result); // 3\nconsole.log(expr.expression); // 'sin(pi / 2) + sqrt(4)'\n\n// Generate a random color, converted to every common notation\nconst c = color();\nconsole.log(c.hex, c.rgb, c.hsl, c.hsv, c.hwb, c.cmyk);\n\n// Generate a random username\nconst user = username();\nconsole.log(user.username);",
                        fr: "// Dernière version, équivalent à '@moxon/api/v6'\nimport { color, evaluate, username } from '@moxon/api';\n\n// Ou une version précise\nimport { color as colorV4 } from '@moxon/api/v4';\n\n// Évaluer une expression mathématique\nconst expr = evaluate('sin(pi / 2) + sqrt(4)', 5);\nconsole.log(expr.result); // 3\nconsole.log(expr.expression); // 'sin(pi / 2) + sqrt(4)'\n\n// Générer une couleur aléatoire, convertie dans toutes les notations courantes\nconst c = color();\nconsole.log(c.hex, c.rgb, c.hsl, c.hsv, c.hwb, c.cmyk);\n\n// Générer un nom d'utilisateur aléatoire\nconst user = username();\nconsole.log(user.username);",
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
                                text: "To describe the endpoints as data (method, path, parameters, example), see the [Manifest](ref:manifest), an experimental export of the package. If your project still uses the former package name, the [migration guide](ref:changelog#migrating-from-20syldev-api) explains the rename.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Pour décrire les endpoints sous forme de données (méthode, chemin, paramètres, exemple), découvrez le [Manifest](ref:manifest), un export expérimental du paquet. Si votre projet utilise encore l'ancien nom du paquet, le [guide de migration](ref:changelog#migrating-from-20syldev-api) explique le renommage.",
                            },
                        ],
                    },
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
                    text: '{\n    "message": "Too Many Requests",\n    "error": "You have exceeded the limit of 2000 requests per hour.",\n    "status": 429\n}',
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
                    type: "callout",
                    kind: "warning",
                    title: { en: "Changed in 6.0.0", fr: "Changement en 6.0.0" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: '`status` is now a **number**. It used to be a string (`"400"`), it is now `400`. A client comparing it to a string will stop matching.',
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "`status` est désormais un **nombre**. C'était une chaîne (`\"400\"`), c'est maintenant `400`. Un client qui le compare à une chaîne cessera de correspondre.",
                            },
                        ],
                    },
                },
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
                        en: '{\n    "message": "Bad Request",\n    "error": "Description of the error",\n    "status": 400\n}',
                        fr: '{\n    "message": "Bad Request",\n    "error": "Description de l\'erreur",\n    "status": 400\n}',
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
                    text: '{\n    "message": "Not Found",\n    "error": "Endpoint \'/v6/doesnotexist\' does not exist.",\n    "status": 404\n}',
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
                            en: "[v5 Documentation](ref:v5/index) - Previous stable version",
                            fr: "[Documentation v5](ref:v5/index) - Version stable précédente",
                        },
                        {
                            en: "[v4 Documentation](ref:v4/index) - Legacy version",
                            fr: "[Documentation v4](ref:v4/index) - Ancienne version",
                        },
                    ],
                },
                {
                    type: "callout",
                    kind: "tip",
                    title: { en: "New in 6.1.0", fr: "Nouveau en 6.1.0" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Every documentation page has one address per version and language: `/v6/hash` for the Hash page in English, `/fr/v6/hash` in French, `/v5/hash` for v5. Old addresses such as `/v6/en/hash` or `/v6/fr/hash` redirect automatically to the new ones, anchors included.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Chaque page de la documentation a une adresse par version et par langue : `/v6/hash` pour la page Hash en anglais, `/fr/v6/hash` en français, `/v5/hash` pour la v5. Les anciennes adresses comme `/v6/en/hash` ou `/v6/fr/hash` redirigent automatiquement vers les nouvelles, ancres comprises.",
                            },
                        ],
                    },
                },
            ],
        },
    ],
};
