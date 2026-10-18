import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "semver",
    kind: "endpoint",
    title: { en: "Semantic Versioning", fr: "Versions sémantiques" },
    lead: {
        en: "The `/semver` endpoint parses, bumps, and compares semantic versions following the semver.org specification.",
        fr: "L'endpoint `/semver` analyse, incrémente et compare des versions sémantiques selon la spécification semver.org.",
    },
    updated: "2026-09-07",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/semver",
            try: true,
            params: [
                {
                    name: "version",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "1.2.3-beta.1+build.42",
                },
                {
                    name: "action",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["parse", "bump", "compare"],
                },
                {
                    name: "part",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["major", "minor", "patch"],
                },
                {
                    name: "other",
                    type: "string",
                    in: "query",
                    required: "conditional",
                    placeholder: "1.3.0",
                },
            ],
        },
    ],
    sections: [
        {
            id: "",
            blocks: [
                { type: "endpoint", op: "default" },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "How it works?", fr: "Comment ça marche ?" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "A version must match the official grammar `MAJOR.MINOR.PATCH`, optionally followed by `-prerelease` and `+build`. Leading zeros are rejected, so `01.2.3` is invalid.",
                            },
                            {
                                type: "p",
                                text: "Comparison follows semver precedence: numeric parts first, then the prerelease. A version carrying a prerelease ranks below the same version without one, numeric prerelease identifiers are compared as numbers (`alpha.2` is lower than `alpha.10`), and build metadata is ignored entirely.",
                            },
                            {
                                type: "p",
                                text: "A bump resets the lower parts to zero and drops both the prerelease and the build metadata, so `1.0.0-alpha+build.1` bumped on `patch` gives `1.0.1`.",
                            },
                            {
                                type: "p",
                                text: "A `+` sign decodes as a space in a query string, so the API restores it before parsing — build metadata can be sent as-is or percent-encoded.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Une version doit respecter la grammaire officielle `MAJOR.MINOR.PATCH`, suivie éventuellement de `-prerelease` et `+build`. Les zéros initiaux sont refusés, donc `01.2.3` est invalide.",
                            },
                            {
                                type: "p",
                                text: "La comparaison suit la précédence semver : les parties numériques d'abord, puis la prerelease. Une version portant une prerelease est classée sous la même version sans prerelease, les identifiants numériques de prerelease sont comparés comme des nombres (`alpha.2` est inférieur à `alpha.10`), et les métadonnées de build sont entièrement ignorées.",
                            },
                            {
                                type: "p",
                                text: "Une incrémentation remet les parties inférieures à zéro et supprime la prerelease ainsi que les métadonnées de build : `1.0.0-alpha+build.1` incrémenté sur `patch` donne `1.0.1`.",
                            },
                            {
                                type: "p",
                                text: "Le signe `+` est décodé comme une espace dans une chaîne de requête, l'API le restaure donc avant l'analyse — les métadonnées de build peuvent être envoyées telles quelles ou encodées en pourcentage.",
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Paramètres" },
            aliases: ["parametres"],
            blocks: [
                {
                    type: "params",
                    rows: [
                        {
                            name: "version",
                            required: true,
                            description: {
                                en: "Version to work with (e.g. `1.2.3-beta.1+build.42`)",
                                fr: "Version à traiter (ex. `1.2.3-beta.1+build.42`)",
                            },
                        },
                        {
                            name: "action",
                            required: false,
                            description: {
                                en: "Action to perform: `parse`, `bump` or `compare`. Default: `parse`",
                                fr: "Action à effectuer : `parse`, `bump` ou `compare`. Par défaut : `parse`",
                            },
                        },
                        {
                            name: "part",
                            required: false,
                            description: {
                                en: "`bump` only: part to increment, `major`, `minor` or `patch`. Default: `patch`",
                                fr: "`bump` uniquement : partie à incrémenter, `major`, `minor` ou `patch`. Par défaut : `patch`",
                            },
                        },
                        {
                            name: "other",
                            required: "conditional",
                            description: {
                                en: "Second version to compare against (required for `compare`)",
                                fr: "Seconde version à comparer (requis pour `compare`)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-actions",
            level: 2,
            title: { en: "Available Actions", fr: "Actions disponibles" },
            aliases: ["actions-disponibles"],
            blocks: [
                {
                    type: "table",
                    head: ["Action", "Description"],
                    rows: [
                        [
                            "`parse`",
                            {
                                en: "Splits the version into its components",
                                fr: "Décompose la version en ses composants",
                            },
                        ],
                        [
                            "`bump`",
                            {
                                en: "Increments `part` and resets the lower parts to zero",
                                fr: "Incrémente `part` et remet les parties inférieures à zéro",
                            },
                        ],
                        [
                            "`compare`",
                            {
                                en: "Compares `version` against `other` using semver precedence",
                                fr: "Compare `version` à `other` selon la précédence semver",
                            },
                        ],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "response-fields",
            level: 2,
            title: { en: "Response Fields", fr: "Champs de réponse" },
            aliases: ["champs-de-reponse"],
            blocks: [
                { type: "label", text: { en: "`parse` action:", fr: "Action `parse` :" } },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "version",
                            type: "`string`",
                            description: {
                                en: "The original input version",
                                fr: "La version d'entrée originale",
                            },
                        },
                        {
                            name: "major",
                            type: "`number`",
                            description: { en: "Major number", fr: "Numéro majeur" },
                        },
                        {
                            name: "minor",
                            type: "`number`",
                            description: { en: "Minor number", fr: "Numéro mineur" },
                        },
                        {
                            name: "patch",
                            type: "`number`",
                            description: { en: "Patch number", fr: "Numéro de correctif" },
                        },
                        {
                            name: "prerelease",
                            type: "`string|null`",
                            description: {
                                en: "Prerelease identifiers without the leading `-`, `null` if absent",
                                fr: "Identifiants de prerelease sans le `-` initial, `null` si absents",
                            },
                        },
                        {
                            name: "build",
                            type: "`string|null`",
                            description: {
                                en: "Build metadata without the leading `+`, `null` if absent",
                                fr: "Métadonnées de build sans le `+` initial, `null` si absentes",
                            },
                        },
                    ],
                },
                { type: "label", text: { en: "`bump` action:", fr: "Action `bump` :" } },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "version",
                            type: "`string`",
                            description: {
                                en: "The original input version",
                                fr: "La version d'entrée originale",
                            },
                        },
                        { name: "action", type: "`string`", description: "`bump`" },
                        {
                            name: "part",
                            type: "`string`",
                            description: {
                                en: "Part that was incremented",
                                fr: "Partie qui a été incrémentée",
                            },
                        },
                        {
                            name: "result",
                            type: "`string`",
                            description: { en: "The bumped version", fr: "La version incrémentée" },
                        },
                    ],
                },
                { type: "label", text: { en: "`compare` action:", fr: "Action `compare` :" } },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "version",
                            type: "`string`",
                            description: {
                                en: "The original input version",
                                fr: "La version d'entrée originale",
                            },
                        },
                        { name: "action", type: "`string`", description: "`compare`" },
                        {
                            name: "other",
                            type: "`string`",
                            description: {
                                en: "The version compared against",
                                fr: "La version à laquelle la comparaison est faite",
                            },
                        },
                        {
                            name: "result",
                            type: "`number`",
                            description: {
                                en: "`-1` if `version` is lower, `0` if equal, `1` if higher",
                                fr: "`-1` si `version` est inférieure, `0` si égale, `1` si supérieure",
                            },
                        },
                        {
                            name: "description",
                            type: "`string`",
                            description: {
                                en: "Human-readable comparison (e.g. `1.2.3 < 1.3.0`)",
                                fr: "Comparaison lisible (ex. `1.2.3 < 1.3.0`)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [
                {
                    type: "examples",
                    op: "default",
                    query: { version: "1.2.3-beta.1", action: "parse" },
                },
                { type: "try", op: "default" },
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
                        en: "If parameters are missing or invalid, the API will return an error:",
                        fr: "Si les paramètres sont manquants ou invalides, l'API retournera une erreur :",
                    },
                },
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Please provide a version (?version={version})",
                            description: {
                                en: "The `version` parameter is missing",
                                fr: "Le paramètre `version` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Action must be one of: parse, bump, compare",
                            description: {
                                en: "The `action` value is not valid",
                                fr: "La valeur de `action` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Version must be 256 characters or fewer",
                            description: {
                                en: "The `version` or `other` value exceeds the maximum length",
                                fr: "La valeur `version` ou `other` dépasse la longueur maximale",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid semver version",
                            description: {
                                en: "The `version` or `other` value does not match the semver grammar",
                                fr: "La valeur `version` ou `other` ne respecte pas la grammaire semver",
                            },
                            status: 400,
                        },
                        {
                            message: "Part must be one of: major, minor, patch",
                            description: {
                                en: "The `part` value is not valid for `bump`",
                                fr: "La valeur de `part` n'est pas valide pour `bump`",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a second version (&other={version})",
                            description: {
                                en: "The `other` parameter is missing for `compare`",
                                fr: "Le paramètre `other` est manquant pour `compare`",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
