import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "algorithms",
    kind: "endpoint",
    title: { en: "Algorithms", fr: "Algorithmes" },
    lead: {
        en: "The `/algorithms` endpoint provides several algorithms to use as parameters. You can input one or two values depending on the algorithm.",
        fr: "L'endpoint `/algorithms` fournit plusieurs algorithmes à utiliser comme paramètres. Vous pouvez entrer une ou deux valeurs selon l'algorithme.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/algorithms",
            try: false,
            params: [
                { name: "method", type: "string", in: "query", required: true },
                { name: "value", type: "string", in: "query", required: true },
                { name: "value2", type: "string", in: "query", required: false },
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
                                en: "The algorithm to use (see available methods below)",
                                fr: "L'algorithme à utiliser (voir les méthodes disponibles ci-dessous)",
                            },
                        },
                        {
                            name: "value",
                            required: true,
                            description: {
                                en: "The value to use in the algorithm. Must contain at least one character",
                                fr: "La valeur à utiliser dans l'algorithme. Doit contenir au moins un caractère",
                            },
                        },
                        {
                            name: "value2",
                            required: false,
                            description: {
                                en: "The second value to use if necessary. Must contain at least one character",
                                fr: "La deuxième valeur à utiliser si nécessaire. Doit contenir au moins un caractère",
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
                        en: ["Method", "Description", "Requires `value2`"],
                        fr: ["Méthode", "Description", "Nécessite `value2`"],
                    },
                    rows: [
                        [
                            "`anagram`",
                            {
                                en: "Checks if two strings are anagrams",
                                fr: "Vérifie si deux chaînes sont des anagrammes",
                            },
                            { en: "Yes", fr: "Oui" },
                        ],
                        [
                            "`bubblesort`",
                            {
                                en: "Sorts an array of numbers, separated by commas",
                                fr: "Trie un tableau de nombres, séparés par des virgules",
                            },
                            { en: "No", fr: "Non" },
                        ],
                        [
                            "`factorial`",
                            {
                                en: "Calculates the factorial of a number between 0 and 170",
                                fr: "Calcule la factorielle d'un nombre entre 0 et 170",
                            },
                            { en: "No", fr: "Non" },
                        ],
                        [
                            "`gcd`",
                            {
                                en: "Computes the greatest common divisor of two numbers",
                                fr: "Calcule le plus grand commun diviseur de deux nombres",
                            },
                            { en: "Yes", fr: "Oui" },
                        ],
                        [
                            "`isprime`",
                            {
                                en: "Checks if a number is prime",
                                fr: "Vérifie si un nombre est premier",
                            },
                            { en: "No", fr: "Non" },
                        ],
                        [
                            "`fibonacci`",
                            {
                                en: "Calculates a Fibonacci sequence up to a given number",
                                fr: "Calcule une séquence de Fibonacci jusqu'à un nombre donné",
                            },
                            { en: "No", fr: "Non" },
                        ],
                        [
                            "`palindrome`",
                            {
                                en: "Checks if a string is a palindrome",
                                fr: "Vérifie si une chaîne est un palindrome",
                            },
                            { en: "No", fr: "Non" },
                        ],
                        [
                            "`primelist`",
                            {
                                en: "Returns a list of prime numbers up to a given number",
                                fr: "Retourne une liste de nombres premiers jusqu'à un nombre donné",
                            },
                            { en: "No", fr: "Non" },
                        ],
                        [
                            "`primefactors`",
                            {
                                en: "Returns the list of prime factors of a number",
                                fr: "Retourne la liste des facteurs premiers d'un nombre",
                            },
                            { en: "No", fr: "Non" },
                        ],
                        [
                            "`reverse`",
                            { en: "Reverses a string", fr: "Inverse une chaîne" },
                            { en: "No", fr: "Non" },
                        ],
                    ],
                    kind: "matrix",
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
                    text: "GET /v3/algorithms?method=gcd&value=17&value2=493",
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
                { type: "code", lang: "json", text: '{\n    "answer": 17\n}', role: "response" },
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
                    text: 'curl -X GET "https://api.moxon.dev/v3/algorithms?method=gcd&value=17&value2=493"',
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
                            message: "Please provide a valid algorithm (?method={algorithm})",
                            description: {
                                en: "The `method` parameter is missing or invalid",
                                fr: "Le paramètre `method` est manquant ou invalide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
