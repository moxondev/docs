import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "convert",
    kind: "endpoint",
    title: { en: "Unit Conversion", fr: "Conversion d'unités" },
    lead: {
        en: "The `/convert` endpoint allows you to convert values between units of the same category. You need to provide a value to convert, a source unit, and the target unit.",
        fr: "L'endpoint `/convert` permet de convertir des valeurs entre unités de la même catégorie. Vous devez fournir une valeur à convertir, une unité source et l'unité cible.",
    },
    updated: "2026-04-21",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/convert",
            try: true,
            params: [
                { name: "value", type: "string", in: "query", required: true, placeholder: "100" },
                {
                    name: "from",
                    type: "enum",
                    in: "query",
                    required: true,
                    options: [
                        "celsius",
                        "fahrenheit",
                        "kelvin",
                        "km",
                        "mi",
                        "m",
                        "ft",
                        "cm",
                        "in",
                        "yd",
                        "kg",
                        "lb",
                        "oz",
                        "g",
                        "ton",
                        "b",
                        "kb",
                        "mb",
                        "gb",
                        "tb",
                        "km/h",
                        "mph",
                        "m/s",
                        "knots",
                    ],
                },
                {
                    name: "to",
                    type: "enum",
                    in: "query",
                    required: true,
                    options: [
                        "celsius",
                        "fahrenheit",
                        "kelvin",
                        "km",
                        "mi",
                        "m",
                        "ft",
                        "cm",
                        "in",
                        "yd",
                        "kg",
                        "lb",
                        "oz",
                        "g",
                        "ton",
                        "b",
                        "kb",
                        "mb",
                        "gb",
                        "tb",
                        "km/h",
                        "mph",
                        "m/s",
                        "knots",
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
                            name: "value",
                            required: true,
                            description: {
                                en: "The numeric value to convert",
                                fr: "La valeur numérique à convertir",
                            },
                        },
                        {
                            name: "from",
                            required: true,
                            description: {
                                en: "The source unit (see available units below)",
                                fr: "L'unité source (voir les unités disponibles ci-dessous)",
                            },
                        },
                        {
                            name: "to",
                            required: true,
                            description: {
                                en: "The target unit (must be in the same category as `from`)",
                                fr: "L'unité cible (doit être de la même catégorie que `from`)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-units",
            level: 2,
            title: { en: "Available Units", fr: "Unités disponibles" },
            aliases: ["unites-disponibles"],
            blocks: [
                { type: "label", text: { en: "Temperature:", fr: "Température :" } },
                {
                    type: "table",
                    head: { en: ["Unit", "Description"], fr: ["Unité", "Description"] },
                    rows: [
                        ["`celsius`", { en: "Celsius degrees", fr: "Degrés Celsius" }],
                        ["`fahrenheit`", { en: "Fahrenheit degrees", fr: "Degrés Fahrenheit" }],
                        ["`kelvin`", "Kelvin"],
                    ],
                    kind: "definition",
                },
                { type: "label", text: { en: "Length:", fr: "Longueur :" } },
                {
                    type: "table",
                    head: { en: ["Unit", "Description"], fr: ["Unité", "Description"] },
                    rows: [
                        ["`km`", { en: "Kilometers", fr: "Kilomètres" }],
                        ["`mi`", "Miles"],
                        ["`m`", { en: "Meters", fr: "Mètres" }],
                        ["`ft`", { en: "Feet", fr: "Pieds" }],
                        ["`cm`", { en: "Centimeters", fr: "Centimètres" }],
                        ["`in`", { en: "Inches", fr: "Pouces" }],
                        ["`yd`", "Yards"],
                    ],
                    kind: "definition",
                },
                { type: "label", text: { en: "Weight:", fr: "Poids :" } },
                {
                    type: "table",
                    head: { en: ["Unit", "Description"], fr: ["Unité", "Description"] },
                    rows: [
                        ["`kg`", { en: "Kilograms", fr: "Kilogrammes" }],
                        ["`lb`", { en: "Pounds", fr: "Livres" }],
                        ["`oz`", { en: "Ounces", fr: "Onces" }],
                        ["`g`", { en: "Grams", fr: "Grammes" }],
                        ["`ton`", { en: "Metric tons", fr: "Tonnes métriques" }],
                    ],
                    kind: "definition",
                },
                { type: "label", text: { en: "Data:", fr: "Données :" } },
                {
                    type: "table",
                    head: { en: ["Unit", "Description"], fr: ["Unité", "Description"] },
                    rows: [
                        ["`b`", { en: "Bytes", fr: "Octets" }],
                        ["`kb`", { en: "Kilobytes", fr: "Kilooctets" }],
                        ["`mb`", { en: "Megabytes", fr: "Mégaoctets" }],
                        ["`gb`", { en: "Gigabytes", fr: "Gigaoctets" }],
                        ["`tb`", { en: "Terabytes", fr: "Téraoctets" }],
                    ],
                    kind: "definition",
                },
                { type: "label", text: { en: "Speed:", fr: "Vitesse :" } },
                {
                    type: "table",
                    head: { en: ["Unit", "Description"], fr: ["Unité", "Description"] },
                    rows: [
                        ["`km/h`", { en: "Kilometers/hour", fr: "Kilomètres/heure" }],
                        ["`mph`", { en: "Miles/hour", fr: "Miles/heure" }],
                        ["`m/s`", { en: "Meters/second", fr: "Mètres/seconde" }],
                        ["`knots`", { en: "Knots", fr: "Nœuds" }],
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
                            name: "from",
                            type: "`string`",
                            description: { en: "Source unit", fr: "Unité source" },
                        },
                        {
                            name: "to",
                            type: "`string`",
                            description: { en: "Target unit", fr: "Unité cible" },
                        },
                        {
                            name: "value",
                            type: "`number`",
                            description: {
                                en: "Original value to convert",
                                fr: "Valeur originale à convertir",
                            },
                        },
                        {
                            name: "result",
                            type: "`number`",
                            description: { en: "Converted value", fr: "Valeur convertie" },
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
                { type: "examples", op: "default", query: { value: "100", from: "km", to: "mi" } },
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
                            message: "Please provide a valid value (?value={value})",
                            description: {
                                en: "The `value` parameter is missing or invalid",
                                fr: "Le paramètre `value` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid source unit (&from={unit})",
                            description: {
                                en: "The `from` parameter is missing or invalid",
                                fr: "Le paramètre `from` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid target unit (&to={unit})",
                            description: {
                                en: "The `to` parameter is missing or invalid",
                                fr: "Le paramètre `to` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Value must be a number",
                            description: {
                                en: "The value is not a valid number",
                                fr: "La valeur n'est pas un nombre valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid conversion unit",
                            description: {
                                en: "The `from`/`to` combination is not valid",
                                fr: "La combinaison `from`/`to` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Value must be greater than absolute zero",
                            description: {
                                en: "The value is below absolute zero (temperature only)",
                                fr: "La valeur est en dessous du zéro absolu (température uniquement)",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
