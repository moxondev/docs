import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "dice",
    kind: "endpoint",
    title: { en: "Dice", fr: "Dés" },
    lead: {
        en: "The `/dice` endpoint rolls dice using RPG notation (NdX or NdX+M).",
        fr: "L'endpoint `/dice` lance des dés en notation RPG (NdX ou NdX+M).",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/dice",
            try: true,
            params: [
                { name: "roll", type: "string", in: "query", required: true, placeholder: "2d6+3" },
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
                            name: "roll",
                            required: true,
                            description: {
                                en: "Dice notation (e.g. `2d6+3`, `1d20`, `4d8`). 1–100 dice, 2–1000 sides. The `+` can be encoded as a space.",
                                fr: "Notation de dés (ex : `2d6+3`, `1d20`, `4d8`). 1–100 dés, 2–1000 faces. Le `+` peut être encodé en espace.",
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
                            name: "roll",
                            type: "`string`",
                            description: {
                                en: "The parsed dice notation",
                                fr: "La notation de dés analysée",
                            },
                        },
                        {
                            name: "count",
                            type: "`number`",
                            description: {
                                en: "Number of dice rolled",
                                fr: "Nombre de dés lancés",
                            },
                        },
                        {
                            name: "sides",
                            type: "`number`",
                            description: {
                                en: "Number of sides per die",
                                fr: "Nombre de faces par dé",
                            },
                        },
                        {
                            name: "modifier",
                            type: "`number`",
                            description: {
                                en: "Added modifier (0 if none)",
                                fr: "Modificateur ajouté (0 si aucun)",
                            },
                        },
                        {
                            name: "results",
                            type: "`number[]`",
                            description: {
                                en: "Individual die results",
                                fr: "Résultats individuels de chaque dé",
                            },
                        },
                        {
                            name: "total",
                            type: "`number`",
                            description: {
                                en: "Sum of all dice results + modifier",
                                fr: "Somme de tous les dés + modificateur",
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
                { type: "examples", op: "default", query: { roll: "2d6+3" } },
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
                            message: "Please provide a valid dice roll (?roll={NdX|NdX+M})",
                            description: {
                                en: "The `roll` parameter is missing or invalid",
                                fr: "Le paramètre `roll` est manquant ou invalide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
