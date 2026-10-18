import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "case",
    kind: "endpoint",
    title: { en: "Case", fr: "Casse" },
    lead: {
        en: "The `/case` endpoint converts text between 9 case formats using universal tokenization (camelCase splitting, `_`, `-`, `.`, spaces).",
        fr: "L'endpoint `/case` convertit un texte entre 9 formats de casse avec une tokenisation universelle (split camelCase, `_`, `-`, `.`, espaces).",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/case",
            try: true,
            params: [
                {
                    name: "text",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "hello_world",
                },
                {
                    name: "to",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: [
                        "camel",
                        "pascal",
                        "snake",
                        "kebab",
                        "constant",
                        "title",
                        "sentence",
                        "upper",
                        "lower",
                    ],
                },
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
                            name: "text",
                            required: true,
                            default: "—",
                            description: { en: "Text to convert", fr: "Texte à convertir" },
                        },
                        {
                            name: "to",
                            required: false,
                            default: "`camel`",
                            description: { en: "Target case format", fr: "Format cible" },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-targets",
            level: 2,
            title: { en: "Available Targets", fr: "Formats disponibles" },
            aliases: ["formats-disponibles"],
            blocks: [
                {
                    type: "table",
                    head: {
                        en: ["Target", "Description", "Example (`hello_world`)"],
                        fr: ["Format", "Description", "Exemple (`hello_world`)"],
                    },
                    rows: [
                        ["`camel`", "camelCase", "`helloWorld`"],
                        ["`pascal`", "PascalCase", "`HelloWorld`"],
                        ["`snake`", "snake_case", "`hello_world`"],
                        ["`kebab`", "kebab-case", "`hello-world`"],
                        ["`constant`", "CONSTANT_CASE", "`HELLO_WORLD`"],
                        ["`title`", "Title Case", "`Hello World`"],
                        ["`sentence`", "Sentence case", "`Hello world`"],
                        ["`upper`", { en: "UPPERCASE", fr: "MAJUSCULES" }, "`HELLO_WORLD`"],
                        ["`lower`", { en: "lowercase", fr: "minuscules" }, "`hello_world`"],
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
                            name: "text",
                            type: "`string`",
                            description: { en: "The original input text", fr: "Le texte d'entrée" },
                        },
                        {
                            name: "to",
                            type: "`string`",
                            description: { en: "The target case format", fr: "Le format cible" },
                        },
                        {
                            name: "result",
                            type: "`string`",
                            description: { en: "The converted text", fr: "Le texte converti" },
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
                { type: "examples", op: "default", query: { text: "hello_world", to: "pascal" } },
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
                            message: "Please provide a text (?text={text})",
                            description: {
                                en: "The `text` parameter is missing",
                                fr: "Le paramètre `text` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Text cannot exceed 1000 characters",
                            description: {
                                en: "The `text` exceeds the maximum length",
                                fr: "Le `text` dépasse la longueur maximale",
                            },
                            status: 400,
                        },
                        {
                            message: "Text must contain at least one alphanumeric character",
                            description: {
                                en: "The `text` contains only separators/punctuation (e.g. `---`), leaving nothing to convert",
                                fr: "Le `text` ne contient que des séparateurs/de la ponctuation (ex. `---`), sans rien à convertir",
                            },
                            status: 400,
                        },
                        {
                            message:
                                "Invalid target case. Valid values: camel, pascal, snake, kebab, constant, title, sentence, upper, lower",
                            description: {
                                en: "The `to` value is not valid",
                                fr: "La valeur de `to` n'est pas valide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
