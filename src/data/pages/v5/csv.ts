import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "csv",
    kind: "endpoint",
    title: { en: "CSV Conversion", fr: "Conversion CSV" },
    lead: {
        en: "The `/csv` endpoint converts between CSV and JSON: `parse` turns CSV text into an array of objects, `format` does the reverse.",
        fr: "L'endpoint `/csv` convertit entre CSV et JSON : `parse` transforme un texte CSV en tableau d'objets, `format` fait l'inverse.",
    },
    updated: "2026-08-18",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/csv",
            try: true,
            params: [
                {
                    name: "action",
                    type: "enum",
                    in: "body",
                    required: true,
                    options: ["parse", "format"],
                },
                {
                    name: "csv",
                    type: "string",
                    in: "body",
                    required: "conditional",
                    placeholder: "name,age\nAlice,30",
                },
                {
                    name: "json",
                    type: "json",
                    in: "body",
                    required: "conditional",
                    placeholder: '[{"name":"Alice","age":30}]',
                },
                {
                    name: "delimiter",
                    type: "string",
                    in: "body",
                    required: false,
                    placeholder: ",",
                },
                {
                    name: "headers",
                    type: "boolean",
                    in: "body",
                    required: false,
                    options: ["true", "false"],
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
                                text: 'The parser respects quoted fields, including escaped quotes (`""`) and newlines inside a quoted field. CRLF and CR line endings are normalized to LF before parsing.',
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Le parseur respecte les champs entre guillemets, y compris les guillemets échappés (`\"\"`) et les sauts de ligne à l'intérieur d'un champ entre guillemets. Les fins de ligne CRLF et CR sont normalisées en LF avant l'analyse.",
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
                    type: "p",
                    text: {
                        en: "The request body must be JSON:",
                        fr: "Le corps de la requête doit être en JSON :",
                    },
                },
                {
                    type: "params",
                    rows: [
                        {
                            name: "action",
                            required: true,
                            description: {
                                en: "Action to perform: `parse` or `format`",
                                fr: "Action à effectuer : `parse` ou `format`",
                            },
                        },
                        {
                            name: "csv",
                            required: "conditional",
                            description: {
                                en: "CSV text to convert (required for `parse`)",
                                fr: "Texte CSV à convertir (requis pour `parse`)",
                            },
                        },
                        {
                            name: "json",
                            required: "conditional",
                            description: {
                                en: "Array of objects to convert (required for `format`)",
                                fr: "Tableau d'objets à convertir (requis pour `format`)",
                            },
                        },
                        {
                            name: "delimiter",
                            required: false,
                            description: {
                                en: "Field separator, a single character. Default: `,`",
                                fr: "Séparateur de champ, un seul caractère. Par défaut : `,`",
                            },
                        },
                        {
                            name: "headers",
                            required: false,
                            description: {
                                en: "`parse` only: use the first row as object keys. Default: `true`",
                                fr: "`parse` uniquement : utilise la première ligne comme clés. Par défaut : `true`",
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
                                en: "Converts CSV text into an array of objects",
                                fr: "Convertit un texte CSV en tableau d'objets",
                            },
                        ],
                        [
                            "`format`",
                            {
                                en: "Converts an array of objects into CSV text",
                                fr: "Convertit un tableau d'objets en texte CSV",
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
                        { name: "action", type: "`string`", description: "`parse`" },
                        {
                            name: "rows",
                            type: "`object[]`",
                            description: {
                                en: "Array of parsed row objects",
                                fr: "Tableau des lignes analysées",
                            },
                        },
                        {
                            name: "count",
                            type: "`number`",
                            description: {
                                en: "Number of rows returned",
                                fr: "Nombre de lignes retournées",
                            },
                        },
                    ],
                },
                { type: "label", text: { en: "`format` action:", fr: "Action `format` :" } },
                {
                    type: "fields",
                    rows: [
                        { name: "action", type: "`string`", description: "`format`" },
                        {
                            name: "csv",
                            type: "`string`",
                            description: {
                                en: "The generated CSV text",
                                fr: "Le texte CSV généré",
                            },
                        },
                        {
                            name: "count",
                            type: "`number`",
                            description: {
                                en: "Number of rows converted",
                                fr: "Nombre de lignes converties",
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
                    body: { action: "parse", csv: "name,age\nAlice,30" },
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
                            message: "Please provide an action (?action=parse|format)",
                            description: {
                                en: "The `action` parameter is missing",
                                fr: "Le paramètre `action` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid action (?action=parse|format)",
                            description: {
                                en: "The `action` value is not `parse` or `format`",
                                fr: "La valeur de `action` n'est ni `parse` ni `format`",
                            },
                            status: 400,
                        },
                        {
                            message: "Delimiter must be a single character",
                            description: {
                                en: "The `delimiter` is not exactly one character",
                                fr: "Le `delimiter` ne fait pas exactement un caractère",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide CSV data (?csv={data})",
                            description: {
                                en: "The `csv` parameter is missing for `parse`",
                                fr: "Le paramètre `csv` est manquant pour `parse`",
                            },
                            status: 400,
                        },
                        {
                            message: "CSV cannot exceed 50000 characters",
                            description: {
                                en: "The `csv` text exceeds the maximum length",
                                fr: "Le texte `csv` dépasse la longueur maximale",
                            },
                            status: 400,
                        },
                        {
                            message: "CSV cannot exceed 1000 rows",
                            description: {
                                en: "The parsed data has more rows than the limit",
                                fr: "Les données analysées dépassent la limite de lignes",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a JSON array (?json=[...])",
                            description: {
                                en: "The `json` parameter is missing, not an array, or empty for `format`",
                                fr: "Le paramètre `json` est manquant, n'est pas un tableau, ou est vide pour `format`",
                            },
                            status: 400,
                        },
                        {
                            message: "JSON cannot exceed 1000 rows",
                            description: {
                                en: "The `json` array has more rows than the limit",
                                fr: "Le tableau `json` dépasse la limite de lignes",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
