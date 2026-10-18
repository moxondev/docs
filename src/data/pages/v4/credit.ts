import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "credit",
    kind: "endpoint",
    title: { en: "Credit Card Generation", fr: "Génération de cartes bancaires" },
    lead: {
        en: "The `/credit` endpoint generates fictitious credit card numbers for testing purposes. All numbers pass the Luhn checksum algorithm and use correct IIN prefixes per brand.",
        fr: "L'endpoint `/credit` génère des numéros de cartes bancaires fictifs à des fins de test. Tous les numéros passent l'algorithme de checksum Luhn et utilisent les préfixes IIN corrects pour chaque marque.",
    },
    updated: "2026-05-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/credit",
            try: true,
            params: [
                {
                    name: "brand",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["random", "visa", "mastercard", "amex", "discover"],
                },
                { name: "count", type: "number", in: "query", required: false, placeholder: "1" },
                {
                    name: "format",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["masked", "full"],
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
                            name: "brand",
                            required: false,
                            default: "`random`",
                            description: {
                                en: "Card brand: `visa`, `mastercard`, `amex`, `discover`",
                                fr: "Marque de la carte : `visa`, `mastercard`, `amex`, `discover`",
                            },
                        },
                        {
                            name: "count",
                            required: false,
                            default: "`1`",
                            description: {
                                en: "Number of cards to generate (1–10)",
                                fr: "Nombre de cartes à générer (1–10)",
                            },
                        },
                        {
                            name: "format",
                            required: false,
                            default: "`masked`",
                            description: {
                                en: "Output format: `full` (all digits) or `masked` (middle digits hidden with `*`)",
                                fr: "Format de sortie : `full` (tous les chiffres) ou `masked` (chiffres du milieu masqués avec `*`)",
                            },
                        },
                    ],
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
                    type: "p",
                    text: {
                        en: "The response contains a `cards` array. Each card object has the following fields:",
                        fr: "La réponse contient un tableau `cards`. Chaque objet carte possède les champs suivants :",
                    },
                },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "number",
                            type: "`string`",
                            description: {
                                en: "Card number, masked or full depending on `format`",
                                fr: "Numéro de carte, masqué ou complet selon le `format`",
                            },
                        },
                        {
                            name: "formatted",
                            type: "`string`",
                            description: {
                                en: "Human-readable card number with spaces (e.g. `4532 **** **** 1234`)",
                                fr: "Numéro de carte lisible avec espaces (ex. `4532 **** **** 1234`)",
                            },
                        },
                        {
                            name: "brand",
                            type: "`string`",
                            description: {
                                en: "Card brand (`visa`, `mastercard`, `amex`, `discover`)",
                                fr: "Marque de la carte (`visa`, `mastercard`, `amex`, `discover`)",
                            },
                        },
                        {
                            name: "expiry",
                            type: "`string`",
                            description: {
                                en: "Expiration date in `MM/YY` format",
                                fr: "Date d'expiration au format `MM/AA`",
                            },
                        },
                        {
                            name: "cvv",
                            type: "`string`",
                            description: {
                                en: "Security code (3 digits, 4 for Amex)",
                                fr: "Code de sécurité (3 chiffres, 4 pour Amex)",
                            },
                        },
                        {
                            name: "luhn",
                            type: "`boolean`",
                            description: {
                                en: "Always `true` — the number passes the Luhn checksum",
                                fr: "Toujours `true` — le numéro passe le checksum Luhn",
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
                    query: { brand: "visa", count: "2", format: "full" },
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
                    type: "errors",
                    rows: [
                        {
                            message:
                                'Unknown brand "{brand}". Valid options: visa, mastercard, amex, discover',
                            description: {
                                en: "The `brand` value is not recognized",
                                fr: "La valeur de `brand` n'est pas reconnue",
                            },
                            status: 400,
                        },
                        {
                            message: "Count must be an integer between 1 and 10",
                            description: {
                                en: "The `count` parameter is out of the allowed range",
                                fr: "Le paramètre `count` est hors de la plage autorisée",
                            },
                            status: 400,
                        },
                        {
                            message: 'Format must be "full" or "masked"',
                            description: {
                                en: "The `format` value is not valid",
                                fr: "La valeur de `format` n'est pas valide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
