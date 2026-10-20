import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "levenshtein",
    kind: "endpoint",
    title: { en: "Levenshtein Distance", fr: "Distance de Levenshtein" },
    lead: {
        en: "The `/levenshtein` endpoint allows you to calculate the Levenshtein distance between two strings. This distance represents the minimum number of operations required to transform one string into another.",
        fr: "L'endpoint `/levenshtein` permet de calculer la distance de Levenshtein entre deux chaînes de caractères. Cette distance représente le nombre minimum d'opérations nécessaires pour transformer une chaîne en une autre.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/levenshtein",
            try: false,
            params: [
                { name: "str1", type: "string", in: "query", required: true },
                { name: "str2", type: "string", in: "query", required: true },
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
                            name: "str1",
                            required: true,
                            description: { en: "The first string", fr: "La première chaîne" },
                        },
                        {
                            name: "str2",
                            required: true,
                            description: { en: "The second string", fr: "La deuxième chaîne" },
                        },
                    ],
                },
            ],
        },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [
                {
                    type: "code",
                    text: "GET /v3/levenshtein?str1=example&str2=samples",
                    role: "request",
                },
            ],
        },
        {
            id: "response",
            level: 2,
            title: { en: "Response", fr: "Réponse" },
            aliases: ["reponse"],
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "str1": "example",\n    "str2": "samples",\n    "distance": 3\n}',
                    role: "response",
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
                    type: "table",
                    head: { en: ["Field", "Description"], fr: ["Champ", "Description"] },
                    rows: [
                        [
                            "`str1`",
                            { en: "The first input string", fr: "La première chaîne d'entrée" },
                        ],
                        [
                            "`str2`",
                            { en: "The second input string", fr: "La deuxième chaîne d'entrée" },
                        ],
                        [
                            "`distance`",
                            {
                                en: "The Levenshtein distance between the two strings",
                                fr: "La distance de Levenshtein entre les deux chaînes",
                            },
                        ],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "curl",
            level: 2,
            title: { en: "cURL", fr: "cURL" },
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X GET "https://api.moxon.dev/v3/levenshtein?str1=example&str2=samples"',
                    role: "curl",
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
                            message: "Please provide a first string (?str1={string})",
                            description: {
                                en: "The `str1` parameter is missing",
                                fr: "Le paramètre `str1` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a second string (&str2={string})",
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
        {
            id: "about-levenshtein-distance",
            level: 2,
            title: {
                en: "About Levenshtein Distance",
                fr: "À propos de la distance de Levenshtein",
            },
            aliases: ["a-propos-de-la-distance-de-levenshtein"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The Levenshtein distance is a measure of the similarity between two strings. It counts the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into the other. This is useful for:",
                        fr: "La distance de Levenshtein est une mesure de la similarité entre deux chaînes. Elle compte le nombre minimum d'éditions de caractères uniques (insertions, suppressions ou substitutions) nécessaires pour transformer une chaîne en une autre. Cela est utile pour :",
                    },
                },
                {
                    type: "list",
                    items: [
                        { en: "Spell checking", fr: "Vérification orthographique" },
                        { en: "DNA sequence analysis", fr: "Analyse de séquences ADN" },
                        {
                            en: "Fuzzy string matching",
                            fr: "Correspondance de chaînes approximative",
                        },
                        { en: "Plagiarism detection", fr: "Détection de plagiat" },
                    ],
                },
            ],
        },
    ],
};
