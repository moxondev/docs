import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "base",
    kind: "endpoint",
    title: { en: "Base Conversion", fr: "Conversion de base" },
    lead: {
        en: "The `/base` endpoint converts a number from one numeric base to another, anywhere between base 2 and base 36.",
        fr: "L'endpoint `/base` convertit un nombre d'une base numérique vers une autre, entre la base 2 et la base 36.",
    },
    updated: "2026-09-07",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/base",
            try: true,
            params: [
                { name: "value", type: "string", in: "query", required: true, placeholder: "255" },
                { name: "from", type: "string", in: "query", required: false, placeholder: "10" },
                { name: "to", type: "string", in: "query", required: false, placeholder: "16" },
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
                                text: "Digits are read as `0-9` then `a-z`, representing the values 0 to 35, so input is case-insensitive and the result is always lowercase. The conversion uses arbitrary-precision integers: values far beyond `Number.MAX_SAFE_INTEGER` keep every digit intact. A leading minus sign is preserved, except when the value is zero (`-0` returns `0`).",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Les chiffres sont lus comme `0-9` puis `a-z`, représentant les valeurs de 0 à 35 : l'entrée est donc insensible à la casse et le résultat est toujours en minuscules. La conversion utilise des entiers à précision arbitraire, ce qui permet de conserver tous les chiffres bien au-delà de `Number.MAX_SAFE_INTEGER`. Le signe moins est conservé, sauf lorsque la valeur vaut zéro (`-0` retourne `0`).",
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
                            name: "value",
                            required: true,
                            description: {
                                en: "Number to convert, optionally prefixed with `-`. Up to 100 characters, valid for the `from` base",
                                fr: "Nombre à convertir, éventuellement précédé de `-`. Jusqu'à 100 caractères, valides dans la base `from`",
                            },
                        },
                        {
                            name: "from",
                            required: false,
                            description: {
                                en: "Input base, an integer between 2 and 36. Default: `10`",
                                fr: "Base d'entrée, un entier entre 2 et 36. Par défaut : `10`",
                            },
                        },
                        {
                            name: "to",
                            required: false,
                            description: {
                                en: "Output base, an integer between 2 and 36. Default: `16`",
                                fr: "Base de sortie, un entier entre 2 et 36. Par défaut : `16`",
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
                    type: "fields",
                    rows: [
                        {
                            name: "value",
                            type: "`string`",
                            description: {
                                en: "The original input value, as provided",
                                fr: "La valeur d'entrée d'origine, telle quelle",
                            },
                        },
                        {
                            name: "from",
                            type: "`number`",
                            description: {
                                en: "Input base used for the conversion",
                                fr: "Base d'entrée utilisée pour la conversion",
                            },
                        },
                        {
                            name: "to",
                            type: "`number`",
                            description: {
                                en: "Output base used for the conversion",
                                fr: "Base de sortie utilisée pour la conversion",
                            },
                        },
                        {
                            name: "result",
                            type: "`string`",
                            description: {
                                en: "The converted value, in lowercase digits",
                                fr: "La valeur convertie, en minuscules",
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
                { type: "examples", op: "default", query: { value: "255", from: "10", to: "16" } },
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
                            message: "Please provide a value (?value={value})",
                            description: {
                                en: "The `value` parameter is missing",
                                fr: "Le paramètre `value` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Value must be 100 characters or fewer",
                            description: {
                                en: "The `value` exceeds the maximum length",
                                fr: "La valeur `value` dépasse la longueur maximale",
                            },
                            status: 400,
                        },
                        {
                            message: "Base must be a number",
                            description: {
                                en: "`from` or `to` is not an integer",
                                fr: "`from` ou `to` n'est pas un entier",
                            },
                            status: 400,
                        },
                        {
                            message: "Base must be between 2 and 36",
                            description: {
                                en: "`from` or `to` is outside the supported range",
                                fr: "`from` ou `to` est en dehors de la plage supportée",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid value for base {from}",
                            description: {
                                en: "A digit of `value` does not exist in the input base, or `value` is only a minus sign",
                                fr: "Un chiffre de `value` n'existe pas dans la base d'entrée, ou `value` ne contient qu'un signe moins",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
