import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "algorithms",
    kind: "endpoint",
    title: { en: "Algorithms", fr: "Algorithmes" },
    lead: {
        en: "The `/algorithms` endpoint provides several algorithms to use as parameters. You can input one or two values depending on the algorithm.",
        fr: "L'endpoint `/algorithms` fournit plusieurs algorithmes à utiliser comme paramètres. Vous pouvez entrer une ou deux valeurs selon l'algorithme.",
    },
    updated: "2026-07-26",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/algorithms",
            try: true,
            params: [
                {
                    name: "method",
                    type: "enum",
                    in: "query",
                    required: true,
                    options: [
                        "anagram",
                        "bubblesort",
                        "factorial",
                        "gcd",
                        "isprime",
                        "fibonacci",
                        "palindrome",
                        "primelist",
                        "primefactors",
                        "reverse",
                        "roman",
                    ],
                },
                { name: "value", type: "string", in: "query", required: true, placeholder: "42" },
                { name: "value2", type: "string", in: "query", required: false, placeholder: "24" },
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
                        en: ["Method", "Description", "Requires `value2`", "Limits"],
                        fr: ["Méthode", "Description", "Nécessite `value2`", "Limites"],
                    },
                    rows: [
                        [
                            "`anagram`",
                            {
                                en: "Checks if two strings are anagrams",
                                fr: "Vérifie si deux chaînes sont des anagrammes",
                            },
                            { en: "Yes", fr: "Oui" },
                            { en: "Max 1000 chars", fr: "Max 1000 caractères" },
                        ],
                        [
                            "`bubblesort`",
                            {
                                en: "Sorts an array of numbers, separated by commas",
                                fr: "Trie un tableau de nombres, séparés par des virgules",
                            },
                            { en: "No", fr: "Non" },
                            { en: "Max 1000 elements", fr: "Max 1000 éléments" },
                        ],
                        [
                            "`factorial`",
                            {
                                en: "Calculates the factorial of a number between 0 and 170",
                                fr: "Calcule la factorielle d'un nombre entre 0 et 170",
                            },
                            { en: "No", fr: "Non" },
                            "0–170",
                        ],
                        [
                            { en: "`gcd`", fr: "`fibonacci`" },
                            {
                                en: "Computes the greatest common divisor of two numbers",
                                fr: "Calcule une séquence de Fibonacci jusqu'à un nombre donné",
                            },
                            { en: "Yes", fr: "Non" },
                            { en: "1–100,000", fr: "0–1000" },
                        ],
                        [
                            { en: "`isprime`", fr: "`gcd`" },
                            {
                                en: "Checks if a number is prime",
                                fr: "Calcule le plus grand commun diviseur de deux nombres",
                            },
                            { en: "No", fr: "Oui" },
                            { en: "1–100,000", fr: "1–100 000" },
                        ],
                        [
                            { en: "`fibonacci`", fr: "`isprime`" },
                            {
                                en: "Calculates a Fibonacci sequence up to a given number",
                                fr: "Vérifie si un nombre est premier",
                            },
                            { en: "No", fr: "Non" },
                            { en: "0–1000", fr: "1–100 000" },
                        ],
                        [
                            "`palindrome`",
                            {
                                en: "Checks if a string is a palindrome",
                                fr: "Vérifie si une chaîne est un palindrome",
                            },
                            { en: "No", fr: "Non" },
                            { en: "Max 1000 chars", fr: "Max 1000 caractères" },
                        ],
                        [
                            "`primelist`",
                            {
                                en: "Returns a list of prime numbers up to a given number",
                                fr: "Retourne une liste de nombres premiers jusqu'à un nombre donné",
                            },
                            { en: "No", fr: "Non" },
                            { en: "2–10,000", fr: "2–10 000" },
                        ],
                        [
                            "`primefactors`",
                            {
                                en: "Returns the list of prime factors of a number",
                                fr: "Retourne la liste des facteurs premiers d'un nombre",
                            },
                            { en: "No", fr: "Non" },
                            { en: "1–100,000", fr: "1–100 000" },
                        ],
                        [
                            "`reverse`",
                            { en: "Reverses a string", fr: "Inverse une chaîne" },
                            { en: "No", fr: "Non" },
                            { en: "Max 1000 chars", fr: "Max 1000 caractères" },
                        ],
                        [
                            "`roman`",
                            {
                                en: "Converts between Roman numerals and numbers (1–3999)",
                                fr: "Convertit entre chiffres romains et nombres (1–3999)",
                            },
                            { en: "No", fr: "Non" },
                            "1–3999",
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
                            name: "answer",
                            type: "`number|string|boolean|number[]`",
                            description: {
                                en: "The algorithm result",
                                fr: "Le résultat de l'algorithme",
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
                    query: { method: "gcd", value: "17", value2: "493" },
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
                    type: "split",
                    en: [
                        {
                            type: "errors",
                            rows: [
                                {
                                    message:
                                        "Please provide a valid algorithm (?method={algorithm})",
                                    description: "The `method` parameter is missing or invalid",
                                    status: 400,
                                },
                                {
                                    message: "Invalid input",
                                    description:
                                        "The value exceeds the method's constraints or limits",
                                    status: 400,
                                },
                                {
                                    message: "Value must be a number",
                                    description: "`factorial`/`isprime`: `value` is not numeric",
                                    status: 400,
                                },
                                {
                                    message: "Value must be an integer",
                                    description:
                                        "`factorial`/`isprime`: `value` is not a whole number",
                                    status: 400,
                                },
                                {
                                    message: "Number must be positive",
                                    description:
                                        "`factorial`/`isprime`: `value` is negative (or zero for `isprime`)",
                                    status: 400,
                                },
                                {
                                    message: "Number must be between 0 and 170",
                                    description: "`factorial`: `value` is out of range",
                                    status: 400,
                                },
                                {
                                    message: "Number must be between 1 and 100000",
                                    description: "`isprime`: `value` is out of range",
                                    status: 400,
                                },
                            ],
                        },
                    ],
                    fr: [
                        {
                            type: "errors",
                            rows: [
                                {
                                    message:
                                        "Please provide a valid algorithm (?method={algorithm})",
                                    description: "Le paramètre `method` est manquant ou invalide",
                                    status: 400,
                                },
                                {
                                    message: "Value must be a number",
                                    description:
                                        "`factorial`/`isprime` : `value` n'est pas numérique",
                                    status: 400,
                                },
                                {
                                    message: "Value must be an integer",
                                    description:
                                        "`factorial`/`isprime` : `value` n'est pas un nombre entier",
                                    status: 400,
                                },
                                {
                                    message: "Number must be positive",
                                    description:
                                        "`factorial`/`isprime` : `value` est négatif (ou nul pour `isprime`)",
                                    status: 400,
                                },
                                {
                                    message: "Number must be between 0 and 170",
                                    description:
                                        "`factorial` : `value` est hors de la plage autorisée",
                                    status: 400,
                                },
                                {
                                    message: "Number must be between 1 and 100000",
                                    description:
                                        "`isprime` : `value` est hors de la plage autorisée",
                                    status: 400,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
