import type { Page } from "@/types/content";

export const page: Page = {
    version: "v1",
    id: "algorithms",
    kind: "endpoint",
    title: { en: "Algorithms", fr: "Algorithmes" },
    lead: {
        en: "The `/algorithms` endpoint provides several algorithms to use as parameters. You can input one or two values depending on the algorithm.",
        fr: "L'endpoint `/algorithms` propose plusieurs algorithmes à entrer en paramètre. Il est possible d'entrer une ou deux valeurs en fonction de l'algorithme.",
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
                                fr: "La valeur à utiliser dans l'algorithme. Doit contenir au minimum un caractère",
                            },
                        },
                        {
                            name: "value2",
                            required: false,
                            description: {
                                en: "The second value to use if necessary. Must contain at least one character",
                                fr: "La seconde valeur à utiliser si nécessaire. Doit contenir au minimum un caractère",
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
                                fr: "Calcule la factorielle d'un nombre situé entre 0 et 170",
                            },
                            { en: "No", fr: "Non" },
                        ],
                        [
                            "`gcd`",
                            {
                                en: "Computes the greatest common divisor of two numbers",
                                fr: "Calcule le plus grand diviseur commun de deux nombres",
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
                            { en: "Reverses a string", fr: "Inverse une chaîne de caractères" },
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
                    text: "GET /v1/algorithms?method=gcd&value=17&value2=493",
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
                    text: 'curl -X GET "https://api.moxon.dev/v1/algorithms?method=gcd&value=17&value2=493"',
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
                        en: "If the value of `method` or `value` is empty or invalid, or if `value2` is required but empty, an error will be returned.",
                        fr: "Si la valeur de `method` ou `value` est vide ou invalide, ou que `value2` est nécessaire mais vide, une erreur sera renvoyée.",
                    },
                },
            ],
        },
    ],
};
