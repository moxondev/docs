import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "text",
    kind: "endpoint",
    title: { en: "Text", fr: "Texte" },
    lead: {
        en: "The `/text` endpoint provides text manipulation and generation utilities.",
        fr: "L'endpoint `/text` fournit des utilitaires de manipulation et de génération de texte.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/text",
            try: true,
            params: [
                {
                    name: "method",
                    type: "enum",
                    in: "query",
                    required: true,
                    options: ["stats", "slug", "lorem", "number"],
                },
                {
                    name: "value",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "Hello World",
                },
                {
                    name: "type",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["words", "sentences", "paragraphs"],
                },
                { name: "count", type: "number", in: "query", required: false, placeholder: "5" },
                { name: "lang", type: "enum", in: "query", required: false, options: ["en", "fr"] },
            ],
        },
    ],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
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
                            name: "method",
                            required: true,
                            description: {
                                en: "Text method (see available methods below)",
                                fr: "Méthode de texte (voir les méthodes ci-dessous)",
                            },
                        },
                        {
                            name: "value",
                            required: false,
                            description: {
                                en: "Source text (required for `stats`, `slug`, `number`)",
                                fr: "Texte source (requis pour `stats`, `slug`, `number`)",
                            },
                        },
                        {
                            name: "type",
                            required: false,
                            description: {
                                en: "Lorem type: `words`, `sentences`, `paragraphs`",
                                fr: "Type de Lorem : `words`, `sentences`, `paragraphs`",
                            },
                        },
                        {
                            name: "count",
                            required: false,
                            description: {
                                en: "Number of elements for `lorem` (1–500, default: 5)",
                                fr: "Nombre d'éléments pour `lorem` (défaut : 5)",
                            },
                        },
                        {
                            name: "lang",
                            required: false,
                            description: {
                                en: "Language for `number`: `en` or `fr`",
                                fr: "Langue pour `number` : `en` ou `fr`",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-methods",
            level: 2,
            title: { en: "Available Methods", fr: "Méthodes disponibles" },
            aliases: ["methodes-disponibles"],
            blocks: [
                {
                    type: "table",
                    head: {
                        en: ["Method", "Description", "Required Parameters"],
                        fr: ["Méthode", "Description", "Paramètres requis"],
                    },
                    rows: [
                        [
                            "`stats`",
                            { en: "Text statistics", fr: "Statistiques du texte" },
                            "`value`",
                        ],
                        [
                            "`slug`",
                            { en: "Convert to URL slug", fr: "Convertir en slug URL" },
                            "`value`",
                        ],
                        [
                            "`lorem`",
                            { en: "Generate Lorem Ipsum", fr: "Générer du Lorem Ipsum" },
                            "`type`, `count`",
                        ],
                        [
                            "`number`",
                            { en: "Number to words", fr: "Nombre en lettres" },
                            "`value`, `lang`",
                        ],
                    ],
                    kind: "matrix",
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
                    type: "fields",
                    rows: [
                        {
                            name: "method",
                            type: "`string`",
                            description: {
                                en: "The text method used",
                                fr: "La méthode de texte utilisée",
                            },
                        },
                        {
                            name: "result",
                            type: "`string|object`",
                            description: { en: "The processed result", fr: "Le résultat traité" },
                        },
                    ],
                },
                {
                    type: "p",
                    text: {
                        en: "When using `stats`, the `result` field is an object with the following properties:",
                        fr: "**Limites :** `lorem` count 1–500, `number` max 999 999 999.",
                    },
                },
                {
                    type: "split",
                    en: [
                        {
                            type: "fields",
                            rows: [
                                {
                                    name: "characters",
                                    type: "`number`",
                                    description: "Total number of characters",
                                },
                                {
                                    name: "charactersNoSpaces",
                                    type: "`number`",
                                    description: "Number of characters excluding spaces",
                                },
                                { name: "words", type: "`number`", description: "Number of words" },
                                {
                                    name: "sentences",
                                    type: "`number`",
                                    description: "Number of sentences",
                                },
                                {
                                    name: "paragraphs",
                                    type: "`number`",
                                    description: "Number of paragraphs",
                                },
                                {
                                    name: "readingTime",
                                    type: "`string`",
                                    description: "Estimated reading time",
                                },
                                {
                                    name: "mostFrequentChar",
                                    type: "`string`",
                                    description: "Most frequently used character",
                                },
                            ],
                        },
                        {
                            type: "quote",
                            text: "For `number`, the maximum supported value is 999,999,999.",
                        },
                    ],
                    fr: [],
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
                    query: { method: "slug", value: "Hello World" },
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
                            message:
                                "Please provide a valid method (?method={slug|stats|lorem|number})",
                            description: {
                                en: "The `method` parameter is missing or invalid",
                                fr: "Le paramètre `method` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "A value is required",
                            description: {
                                en: "The `value` parameter is missing when required",
                                fr: "Le paramètre `value` est manquant quand requis",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
