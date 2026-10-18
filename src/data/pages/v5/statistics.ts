import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "statistics",
    kind: "endpoint",
    title: { en: "Statistics", fr: "Statistiques" },
    lead: {
        en: "The `/statistics` endpoint calculates descriptive statistics on a list of numbers.",
        fr: "L'endpoint `/statistics` calcule des statistiques descriptives sur une liste de nombres.",
    },
    updated: "2026-05-25",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/statistics",
            try: true,
            params: [
                {
                    name: "values",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "1,2,3,4,5",
                },
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
                                text: "All measures are computed on the full population (not a sample). `variance` and `stddev` use population formulas (divide by N). `mode` returns all values tied for the highest frequency. `mean`, `median`, `variance`, and `stddev` are rounded to 6 decimal places.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Toutes les mesures sont calculées sur la population complète (et non un échantillon). `variance` et `stddev` utilisent les formules populationnelles (division par N). `mode` retourne toutes les valeurs à égalité pour la fréquence la plus haute. `mean`, `median`, `variance` et `stddev` sont arrondis à 6 décimales.",
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
                            name: "values",
                            required: true,
                            description: {
                                en: "Comma-separated list of numbers (max 1000 values)",
                                fr: "Liste de nombres séparés par des virgules (max 1000 valeurs)",
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
                            name: "count",
                            type: "`number`",
                            description: { en: "Number of values", fr: "Nombre de valeurs" },
                        },
                        {
                            name: "sum",
                            type: "`number`",
                            description: {
                                en: "Sum of all values",
                                fr: "Somme de toutes les valeurs",
                            },
                        },
                        {
                            name: "min",
                            type: "`number`",
                            description: { en: "Minimum value", fr: "Valeur minimale" },
                        },
                        {
                            name: "max",
                            type: "`number`",
                            description: { en: "Maximum value", fr: "Valeur maximale" },
                        },
                        {
                            name: "range",
                            type: "`number`",
                            description: {
                                en: "Difference between max and min",
                                fr: "Différence entre max et min",
                            },
                        },
                        {
                            name: "mean",
                            type: "`number`",
                            description: {
                                en: "Arithmetic mean",
                                fr: "Moyenne arithmétique (précision 6 décimales)",
                            },
                        },
                        {
                            name: "median",
                            type: "`number`",
                            description: {
                                en: "Median value",
                                fr: "Valeur médiane (précision 6 décimales)",
                            },
                        },
                        {
                            name: "mode",
                            type: "`number[]`",
                            description: {
                                en: "Most frequent value(s)",
                                fr: "Valeur(s) la/les plus fréquente(s)",
                            },
                        },
                        {
                            name: "variance",
                            type: "`number`",
                            description: {
                                en: "Population variance",
                                fr: "Variance de la population (précision 6 décimales)",
                            },
                        },
                        {
                            name: "stddev",
                            type: "`number`",
                            description: {
                                en: "Standard deviation",
                                fr: "Écart-type (précision 6 décimales)",
                            },
                        },
                    ],
                },
                {
                    type: "split",
                    en: [
                        {
                            type: "quote",
                            text: "`mean`, `median`, `variance`, and `stddev` are returned with up to 6 decimal places of precision.",
                        },
                    ],
                    fr: [],
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [
                { type: "examples", op: "default", query: { values: "1,2,3,4,5" } },
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
                            message: "Please provide a comma-separated list of numbers (?values=…)",
                            description: {
                                en: "The `values` parameter is missing or invalid",
                                fr: "Le paramètre `values` est manquant ou invalide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
