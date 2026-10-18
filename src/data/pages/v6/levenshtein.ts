import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "levenshtein",
    kind: "endpoint",
    title: { en: "Levenshtein Distance", fr: "Distance de Levenshtein" },
    lead: {
        en: "The `/levenshtein` endpoint allows you to calculate the Levenshtein distance between two strings. This distance represents the minimum number of operations required to transform one string into another.",
        fr: "L'endpoint `/levenshtein` permet de calculer la distance de Levenshtein entre deux chaînes de caractères. Cette distance représente le nombre minimum d'opérations nécessaires pour transformer une chaîne en une autre.",
    },
    updated: "2026-09-13",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/levenshtein",
            try: true,
            params: [
                { name: "str1", type: "string", in: "body", required: true, placeholder: "kitten" },
                {
                    name: "str2",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "sitting",
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
                    kind: "warning",
                    title: { en: "Changed in 6.0.0", fr: "Changement en 6.0.0" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "This endpoint moved from `GET` to `POST`. The two strings are now sent as a JSON body instead of query parameters, so they no longer appear in the URL — and therefore no longer in browser history or in the logs of any intermediary.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Cet endpoint passe de `GET` à `POST`. Les deux chaînes comparées sont désormais envoyées dans un corps JSON plutôt qu'en paramètres d'URL : elles ne transitent donc plus par l'URL, ni par l'historique de navigation, ni par les journaux d'un intermédiaire.",
                            },
                        ],
                    },
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "How it works?", fr: "Comment ça marche ?" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "The Levenshtein distance counts the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into another. Useful for spell checking, fuzzy matching, DNA analysis, and plagiarism detection.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "La distance de Levenshtein compte le nombre minimum d'éditions (insertions, suppressions, substitutions) pour transformer une chaîne en une autre. Utile pour la vérification orthographique, la correspondance approximative, l'analyse ADN et la détection de plagiat.",
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
                            name: "str1",
                            required: true,
                            description: {
                                en: "The first string (max 1000 characters)",
                                fr: "La première chaîne (max 1000 caractères)",
                            },
                        },
                        {
                            name: "str2",
                            required: true,
                            description: {
                                en: "The second string (max 1000 characters)",
                                fr: "La deuxième chaîne (max 1000 caractères)",
                            },
                        },
                    ],
                },
                {
                    type: "p",
                    text: {
                        en: "Both parameters are sent as a JSON body with `Content-Type: application/json`.",
                        fr: "Les deux paramètres sont envoyés dans un corps JSON avec `Content-Type: application/json`.",
                    },
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
                            name: "str1",
                            type: "`string`",
                            description: {
                                en: "The first input string",
                                fr: "La première chaîne d'entrée",
                            },
                        },
                        {
                            name: "str2",
                            type: "`string`",
                            description: {
                                en: "The second input string",
                                fr: "La deuxième chaîne d'entrée",
                            },
                        },
                        {
                            name: "distance",
                            type: "`number`",
                            description: {
                                en: "The Levenshtein distance between the two strings",
                                fr: "La distance de Levenshtein entre les deux chaînes",
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
                { type: "examples", op: "default", body: { str1: "example", str2: "samples" } },
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
                            message: "Please provide a first string (str1)",
                            description: {
                                en: "The `str1` parameter is missing",
                                fr: "Le paramètre `str1` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a second string (str2)",
                            description: {
                                en: "The `str2` parameter is missing",
                                fr: "Le paramètre `str2` est manquant",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
