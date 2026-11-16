import type { Page } from "@/types/content";

/**
 * The algorithms of the API by subject: the Try panel lists them under their titles, apart by a
 * rule.
 */
const GROUPS = [
    {
        label: { en: "Text", fr: "Texte" },
        options: ["anagram", "palindrome", "reverse"],
    },
    {
        label: { en: "Numbers", fr: "Nombres" },
        options: [
            "bubblesort",
            "factorial",
            "fibonacci",
            "gcd",
            "isprime",
            "primefactors",
            "primelist",
            "roman",
        ],
    },
];

/**
 * Every algorithm of the groups, in their order, as the options of the method field.
 */
const METHODS = GROUPS.flatMap((group) => group.options);

export const page: Page = {
    version: "v6",
    id: "algorithms",
    kind: "endpoint",
    title: { en: "Algorithms", fr: "Algorithmes" },
    lead: {
        en: "The `/algorithms` endpoint provides several algorithms to use as parameters. You can input one or two values depending on the algorithm.",
        fr: "L'endpoint `/algorithms` fournit plusieurs algorithmes à utiliser comme paramètres. Vous pouvez entrer une ou deux valeurs selon l'algorithme.",
    },
    updated: "2026-11-16",
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
                    options: METHODS,
                    groups: GROUPS,
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
                { type: "label", text: { en: "Text:", fr: "Texte :" } },
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
                        ],
                        [
                            "`palindrome`",
                            {
                                en: "Checks if a string is a palindrome",
                                fr: "Vérifie si une chaîne est un palindrome",
                            },
                        ],
                        ["`reverse`", { en: "Reverses a string", fr: "Inverse une chaîne" }],
                    ],
                    kind: "matrix",
                },
                { type: "label", text: { en: "Numbers:", fr: "Nombres :" } },
                {
                    type: "table",
                    head: {
                        en: ["Method", "Description", "Requires `value2`", "Limits"],
                        fr: ["Méthode", "Description", "Nécessite `value2`", "Limites"],
                    },
                    rows: [
                        [
                            "`bubblesort`",
                            {
                                en: "Sorts an array of numbers, separated by commas",
                                fr: "Trie un tableau de nombres, séparés par des virgules",
                            },
                        ],
                        [
                            "`factorial`",
                            {
                                en: "Calculates the factorial of a number between 0 and 170",
                                fr: "Calcule la factorielle d'un nombre entre 0 et 170",
                            },
                        ],
                        [
                            "`fibonacci`",
                            {
                                en: "Calculates a Fibonacci sequence up to a given number",
                                fr: "Vérifie si un nombre est premier",
                            },
                        ],
                        [
                            "`gcd`",
                            {
                                en: "Computes the greatest common divisor of two numbers",
                                fr: "Calcule une séquence de Fibonacci jusqu'à un nombre donné",
                            },
                        ],
                        [
                            "`isprime`",
                            {
                                en: "Checks if a number is prime",
                                fr: "Calcule le plus grand commun diviseur de deux nombres",
                            },
                        ],
                        [
                            "`primefactors`",
                            {
                                en: "Returns the list of prime factors of a number",
                                fr: "Retourne la liste des facteurs premiers d'un nombre",
                            },
                        ],
                        [
                            "`primelist`",
                            {
                                en: "Returns a list of prime numbers up to a given number",
                                fr: "Retourne une liste de nombres premiers jusqu'à un nombre donné",
                            },
                        ],
                        [
                            "`roman`",
                            {
                                en: "Converts between Roman numerals and numbers (1–3999)",
                                fr: "Convertit entre chiffres romains et nombres (1–3999)",
                            },
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
