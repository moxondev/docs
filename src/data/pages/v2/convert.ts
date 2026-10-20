import type { Page } from "@/types/content";

export const page: Page = {
    version: "v2",
    id: "convert",
    kind: "endpoint",
    title: { en: "Temperature Conversion", fr: "Conversion de température" },
    lead: {
        en: "The `/convert` endpoint allows you to convert multiple temperature units between each other. You need to provide a value to convert, a source unit, and the unit you want to convert to.",
        fr: "L'endpoint `/convert` permet de convertir plusieurs unités de température entre elles. Il faut entrer une valeur à convertir, une unité de départ, et l'unité dans laquelle vous souhaitez la convertir.",
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
                                en: "The source unit (`celsius`, `fahrenheit`, or `kelvin`)",
                                fr: "L'unité de départ (`celsius`, `fahrenheit`, ou `kelvin`)",
                            },
                        },
                        {
                            name: "to",
                            required: true,
                            description: {
                                en: "The unit to convert to (`celsius`, `fahrenheit`, or `kelvin`)",
                                fr: "L'unité dans laquelle vous souhaitez convertir (`celsius`, `fahrenheit`, ou `kelvin`)",
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
                    type: "list",
                    items: [
                        { en: "`celsius`: Degrees Celsius", fr: "`celsius` : Degrés Celsius" },
                        {
                            en: "`fahrenheit`: Degrees Fahrenheit",
                            fr: "`fahrenheit` : Degrés Fahrenheit",
                        },
                        { en: "`kelvin`: Kelvin", fr: "`kelvin` : Kelvin" },
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
                    text: "GET /v2/convert?value=30&from=celsius&to=kelvin",
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
                    text: 'curl -X GET "https://api.moxon.dev/v2/convert?value=30&from=celsius&to=kelvin"',
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
                        en: "If the `value`, `from`, or `to` field is empty or invalid, an error will be returned.",
                        fr: "Si la valeur de `value`, `from` ou `to` est vide ou invalide, une erreur sera renvoyée.",
                    },
                },
            ],
        },
    ],
};
