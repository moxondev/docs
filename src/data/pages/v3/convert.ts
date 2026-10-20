import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "convert",
    kind: "endpoint",
    title: { en: "Temperature Conversion", fr: "Conversion de température" },
    lead: {
        en: "The `/convert` endpoint allows you to convert multiple temperature units between each other. You need to provide a value to convert, a source unit, and the unit you want to convert to.",
        fr: "L'endpoint `/convert` permet de convertir plusieurs unités de température entre elles. Vous devez fournir une valeur à convertir, une unité source et l'unité vers laquelle vous souhaitez convertir.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/convert",
            try: false,
            params: [
                { name: "value", type: "string", in: "query", required: true },
                { name: "from", type: "string", in: "query", required: true },
                { name: "to", type: "string", in: "query", required: true },
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
                                en: "The value to convert",
                                fr: "La valeur à convertir",
                            },
                        },
                        {
                            name: "from",
                            required: true,
                            description: {
                                en: "The source unit (`celsius`, `fahrenheit`, `kelvin`)",
                                fr: "L'unité source (`celsius`, `fahrenheit`, `kelvin`)",
                            },
                        },
                        {
                            name: "to",
                            required: true,
                            description: {
                                en: "The target unit (`celsius`, `fahrenheit`, `kelvin`)",
                                fr: "L'unité cible (`celsius`, `fahrenheit`, `kelvin`)",
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
                    text: "GET /v3/convert?value=30&from=celsius&to=kelvin",
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
                    text: '{\n    "from": "celsius",\n    "to": "kelvin",\n    "value": 30,\n    "result": 303.15\n}',
                    role: "response",
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
                    text: 'curl -X GET "https://api.moxon.dev/v3/convert?value=30&from=celsius&to=kelvin"',
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
                    ],
                },
            ],
        },
    ],
};
