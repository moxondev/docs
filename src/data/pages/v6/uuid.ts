import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "uuid",
    kind: "endpoint",
    title: { en: "UUID Generation", fr: "Génération d'UUID" },
    lead: {
        en: "The `/uuid` endpoint generates random UUID v4 values, or parses an existing UUID to extract its version and variant.",
        fr: "L'endpoint `/uuid` génère des UUID v4 aléatoires, ou analyse un UUID existant pour en extraire la version et la variante.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/uuid",
            try: true,
            params: [
                {
                    name: "uuid",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "41a43360-9874-4c7a-9ca8-eec29e765a0e",
                },
                {
                    name: "count",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "1-50",
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
                                text: "The endpoint has two modes. When `uuid` is provided, it switches to parsing and `count` is ignored. Otherwise it generates `count` random UUID v4 values (a single one by default). A malformed UUID is not an error: it is returned with `valid: false` and `null` components.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "L'endpoint a deux modes. Lorsque `uuid` est fourni, il passe en analyse et `count` est ignoré. Sinon, il génère `count` UUID v4 aléatoires (un seul par défaut). Un UUID mal formé n'est pas une erreur : il est retourné avec `valid: false` et des composants à `null`.",
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
                            name: "uuid",
                            required: false,
                            description: {
                                en: "UUID to parse. When provided, nothing is generated and `count` is ignored",
                                fr: "UUID à analyser. S'il est fourni, rien n'est généré et `count` est ignoré",
                            },
                        },
                        {
                            name: "count",
                            required: false,
                            description: {
                                en: "Number of UUIDs to generate, an integer between 1 and 50. Default: `1`",
                                fr: "Nombre d'UUID à générer, un entier entre 1 et 50. Par défaut : `1`",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "uuid-variants",
            level: 2,
            title: { en: "UUID Variants", fr: "Variantes d'UUID" },
            aliases: ["variantes-d-uuid"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The variant is derived from the first character of the fourth group:",
                        fr: "La variante est déduite du premier caractère du quatrième groupe :",
                    },
                },
                {
                    type: "table",
                    head: { en: ["Character", "Variant"], fr: ["Caractère", "Variante"] },
                    rows: [
                        ["`0` – `7`", "`NCS`"],
                        ["`8` – `b`", "`RFC 4122`"],
                        ["`c` – `d`", "`Microsoft`"],
                        ["`e` – `f`", "`Future`"],
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
                {
                    type: "label",
                    text: {
                        en: "Single UUID (generated, or `count` of 1):",
                        fr: "UUID unique (généré, ou `count` à 1) :",
                    },
                },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "uuid",
                            type: "`string`",
                            description: { en: "The generated UUID", fr: "L'UUID généré" },
                        },
                        {
                            name: "version",
                            type: "`number`",
                            description: {
                                en: "UUID version — always `4` when generated",
                                fr: "Version de l'UUID — toujours `4` à la génération",
                            },
                        },
                        {
                            name: "variant",
                            type: "`string`",
                            description: {
                                en: "Always `RFC 4122` when generated",
                                fr: "Toujours `RFC 4122` à la génération",
                            },
                        },
                    ],
                },
                {
                    type: "label",
                    text: {
                        en: "Batch (`count` greater than 1):",
                        fr: "Lot (`count` supérieur à 1) :",
                    },
                },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "uuids",
                            type: "`string[]`",
                            description: {
                                en: "Array of generated UUID v4 values",
                                fr: "Tableau des UUID v4 générés",
                            },
                        },
                        {
                            name: "count",
                            type: "`number`",
                            description: {
                                en: "Number of UUIDs returned",
                                fr: "Nombre d'UUID retournés",
                            },
                        },
                    ],
                },
                {
                    type: "label",
                    text: { en: "Parsing (`uuid` provided):", fr: "Analyse (`uuid` fourni) :" },
                },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "uuid",
                            type: "`string`",
                            description: {
                                en: "The original input UUID",
                                fr: "L'UUID fourni en entrée",
                            },
                        },
                        {
                            name: "version",
                            type: "`number|null`",
                            description: {
                                en: "UUID version, `null` if the input is not a valid UUID",
                                fr: "Version de l'UUID, `null` si l'entrée n'est pas un UUID valide",
                            },
                        },
                        {
                            name: "variant",
                            type: "`string|null`",
                            description: {
                                en: "UUID variant, `null` if the input is not a valid UUID",
                                fr: "Variante de l'UUID, `null` si l'entrée n'est pas un UUID valide",
                            },
                        },
                        {
                            name: "valid",
                            type: "`boolean`",
                            description: {
                                en: "Whether the input matches the UUID format",
                                fr: "Indique si l'entrée respecte le format UUID",
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
                { type: "examples", op: "default", query: { count: "3" } },
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
                            message: "Please provide a valid UUID (?uuid={uuid})",
                            description: {
                                en: "The `uuid` parameter is not a single string value",
                                fr: "Le paramètre `uuid` n'est pas une simple valeur textuelle",
                            },
                            status: 400,
                        },
                        {
                            message: "Count must be a number",
                            description: {
                                en: "The `count` value is not a number",
                                fr: "La valeur de `count` n'est pas un nombre",
                            },
                            status: 400,
                        },
                        {
                            message: "Count must be between 1 and 50",
                            description: {
                                en: "The `count` value is not an integer between 1 and 50",
                                fr: "La valeur de `count` n'est pas un entier entre 1 et 50",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
