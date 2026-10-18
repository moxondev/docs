import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "diff",
    kind: "endpoint",
    title: { en: "Text Comparison", fr: "Comparaison de textes" },
    lead: {
        en: "The `/diff` endpoint compares two texts and returns an ordered list of changes, line by line or word by word.",
        fr: "L'endpoint `/diff` compare deux textes et retourne une liste ordonnée des changements, ligne par ligne ou mot par mot.",
    },
    updated: "2026-09-07",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/diff",
            try: true,
            params: [
                {
                    name: "a",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "line1\nline2",
                },
                {
                    name: "b",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "line1\nline2 edited",
                },
                {
                    name: "mode",
                    type: "enum",
                    in: "body",
                    required: false,
                    options: ["line", "word"],
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
                                text: "The comparison relies on the Longest Common Subsequence (LCS) algorithm: it finds the largest set of segments shared by both texts in the same order, and everything outside that set is reported as added or removed. In `line` mode the texts are split on newlines, keeping empty lines; in `word` mode they are split on whitespace runs and empty segments are dropped.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "La comparaison repose sur l'algorithme de la plus longue sous-séquence commune (LCS) : il recherche le plus grand ensemble de segments partagés par les deux textes dans le même ordre, et tout ce qui en sort est signalé comme ajouté ou supprimé. En mode `line`, les textes sont découpés aux sauts de ligne, les lignes vides étant conservées ; en mode `word`, ils sont découpés sur les espaces et les segments vides sont ignorés.",
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
                            name: "a",
                            required: true,
                            description: { en: "Original text", fr: "Texte original" },
                        },
                        {
                            name: "b",
                            required: true,
                            description: {
                                en: "Modified text, compared against `a`",
                                fr: "Texte modifié, comparé à `a`",
                            },
                        },
                        {
                            name: "mode",
                            required: false,
                            description: {
                                en: "Comparison granularity: `line` or `word`. Default: `line`",
                                fr: "Granularité de la comparaison : `line` ou `word`. Par défaut : `line`",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-modes",
            level: 2,
            title: { en: "Available Modes", fr: "Modes disponibles" },
            aliases: ["modes-disponibles"],
            blocks: [
                {
                    type: "table",
                    head: ["Mode", "Description"],
                    rows: [
                        [
                            "`line`",
                            {
                                en: "Splits both texts on newlines and compares line by line",
                                fr: "Découpe les deux textes aux sauts de ligne et compare ligne par ligne",
                            },
                        ],
                        [
                            "`word`",
                            {
                                en: "Splits both texts on whitespace and compares word by word",
                                fr: "Découpe les deux textes sur les espaces et compare mot par mot",
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
                {
                    type: "fields",
                    rows: [
                        {
                            name: "mode",
                            type: "`string`",
                            description: {
                                en: "Granularity used: `line` or `word`",
                                fr: "Granularité utilisée : `line` ou `word`",
                            },
                        },
                        {
                            name: "added",
                            type: "`number`",
                            description: {
                                en: "Number of segments present only in `b`",
                                fr: "Nombre de segments présents uniquement dans `b`",
                            },
                        },
                        {
                            name: "removed",
                            type: "`number`",
                            description: {
                                en: "Number of segments present only in `a`",
                                fr: "Nombre de segments présents uniquement dans `a`",
                            },
                        },
                        {
                            name: "changes",
                            type: "`object[]`",
                            description: {
                                en: "Ordered changes rebuilding `b` from `a`",
                                fr: "Changements ordonnés reconstruisant `b` à partir de `a`",
                            },
                        },
                    ],
                },
                { type: "label", text: { en: "`changes` entries:", fr: "Entrées de `changes` :" } },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "type",
                            type: "`string`",
                            description: {
                                en: "`equal`, `add` or `del`",
                                fr: "`equal`, `add` ou `del`",
                            },
                        },
                        {
                            name: "value",
                            type: "`string`",
                            description: {
                                en: "The line or word this change applies to",
                                fr: "La ligne ou le mot concerné",
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
                    body: { a: "line1\nline2", b: "line1\nline2 edited" },
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
                            message: "Please provide a first text (a={text})",
                            description: {
                                en: "The `a` parameter is missing or is not a string",
                                fr: "Le paramètre `a` est manquant ou n'est pas une chaîne",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a second text (b={text})",
                            description: {
                                en: "The `b` parameter is missing or is not a string",
                                fr: "Le paramètre `b` est manquant ou n'est pas une chaîne",
                            },
                            status: 400,
                        },
                        {
                            message: "Texts must be 10000 characters or fewer",
                            description: {
                                en: "`a` or `b` exceeds the maximum length",
                                fr: "`a` ou `b` dépasse la longueur maximale",
                            },
                            status: 400,
                        },
                        {
                            message: "Mode must be one of: line, word",
                            description: {
                                en: "The `mode` value is not `line` or `word`",
                                fr: "La valeur de `mode` n'est ni `line` ni `word`",
                            },
                            status: 400,
                        },
                        {
                            message: "Texts must contain 2000 lines or fewer",
                            description: {
                                en: "A text has more lines than the limit in `line` mode",
                                fr: "Un texte dépasse la limite de lignes en mode `line`",
                            },
                            status: 400,
                        },
                        {
                            message: "Texts must contain 2000 words or fewer",
                            description: {
                                en: "A text has more words than the limit in `word` mode",
                                fr: "Un texte dépasse la limite de mots en mode `word`",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
