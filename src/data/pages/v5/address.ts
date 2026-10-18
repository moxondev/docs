import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "address",
    kind: "endpoint",
    title: { en: "Address Generation", fr: "Génération d'adresses" },
    lead: {
        en: "The `/address` endpoint generates one or more fictional postal addresses for a given country. Each address includes a street, city, zip code, region, and country name. If no country is specified, one is picked at random.",
        fr: "L'endpoint `/address` génère une ou plusieurs adresses postales fictives pour un pays donné. Chaque adresse inclut une rue, une ville, un code postal, une région et un pays. Si aucun pays n'est spécifié, l'un d'eux est choisi aléatoirement.",
    },
    updated: "2026-07-26",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/address",
            try: true,
            params: [
                {
                    name: "country",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["fr", "us", "uk", "de", "es"],
                },
                {
                    name: "count",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "1-10",
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
                            name: "country",
                            required: false,
                            description: {
                                en: "Country code: `fr`, `us`, `uk`, `de`, or `es`. Case-insensitive. Random if omitted.",
                                fr: "Code pays : `fr`, `us`, `uk`, `de` ou `es`. Insensible à la casse. Aléatoire si omis.",
                            },
                        },
                        {
                            name: "count",
                            required: false,
                            description: {
                                en: "Number of addresses to generate (1–10). Default: `1`.",
                                fr: "Nombre d'adresses à générer (1–10). Par défaut : `1`.",
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
                            name: "addresses",
                            type: "`object[]`",
                            description: {
                                en: "List of generated address objects",
                                fr: "Liste des objets d'adresse générés",
                            },
                        },
                        {
                            name: "addresses[].street",
                            type: "`string`",
                            description: {
                                en: "House number, street name and type — word order depends on country (see below)",
                                fr: "Numéro, nom et type de voie — l'ordre dépend du pays (voir ci-dessous)",
                            },
                        },
                        {
                            name: "addresses[].city",
                            type: "`string`",
                            description: { en: "City name", fr: "Nom de la ville" },
                        },
                        {
                            name: "addresses[].zip",
                            type: "`string`",
                            description: {
                                en: "Postal/zip code formatted for the country",
                                fr: "Code postal formaté pour le pays",
                            },
                        },
                        {
                            name: "addresses[].state",
                            type: "`string`",
                            description: {
                                en: "Region or state name",
                                fr: "Nom de la région ou de l'état",
                            },
                        },
                        {
                            name: "addresses[].country",
                            type: "`string`",
                            description: {
                                en: "Full country name (e.g. `France`, `United States`)",
                                fr: "Nom complet du pays (ex. `France`, `United States`)",
                            },
                        },
                        {
                            name: "addresses[].countryCode",
                            type: "`string`",
                            description: {
                                en: "Uppercased country code (e.g. `FR`, `US`)",
                                fr: "Code pays en majuscules (ex. `FR`, `US`)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "supported-countries",
            level: 2,
            title: { en: "Supported Countries", fr: "Pays supportés" },
            aliases: ["pays-supportes"],
            blocks: [
                {
                    type: "table",
                    head: {
                        en: ["Code", "Country", "Zip format example", "Street word order"],
                        fr: ["Code", "Pays", "Exemple de code postal", "Ordre des mots de la rue"],
                    },
                    rows: [
                        [
                            "`fr`",
                            "France",
                            "`75001`",
                            { en: "number + type + name", fr: "numéro + type + nom" },
                        ],
                        [
                            "`us`",
                            { en: "United States", fr: "États-Unis" },
                            "`90210`",
                            { en: "number + name + type", fr: "numéro + nom + type" },
                        ],
                        [
                            "`uk`",
                            { en: "United Kingdom", fr: "Royaume-Uni" },
                            "`AB1 2CD`",
                            { en: "number + name + type", fr: "numéro + nom + type" },
                        ],
                        [
                            "`de`",
                            { en: "Germany", fr: "Allemagne" },
                            "`10115`",
                            { en: "number + name + type", fr: "numéro + nom + type" },
                        ],
                        [
                            "`es`",
                            { en: "Spain", fr: "Espagne" },
                            "`28001`",
                            { en: "number + type + name", fr: "numéro + type + nom" },
                        ],
                    ],
                    kind: "matrix",
                },
                {
                    type: "p",
                    text: {
                        en: "`us`, `uk`, and `de` addresses put the street type last (e.g. `42 Main Street`), while `fr` and `es` put it right after the number (e.g. `12 Rue de Paris`).",
                        fr: "Pour `us`, `uk` et `de`, le type de voie est placé en dernier (ex. `42 Main Street`), tandis que `fr` et `es` le placent juste après le numéro (ex. `12 Rue de Paris`).",
                    },
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [
                { type: "examples", op: "default" },
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
                            message: 'Unknown country code "xx". Supported: fr, us, uk, de, es',
                            description: {
                                en: "The `country` parameter is not a supported code",
                                fr: "Le paramètre `country` n'est pas un code supporté",
                            },
                            status: 400,
                        },
                        {
                            message: "Count must be between 1 and 10",
                            description: {
                                en: "The `count` parameter is out of the allowed range",
                                fr: "Le paramètre `count` est hors de la plage autorisée",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid count (&count={n})",
                            description: {
                                en: "The `count` parameter is not a valid number",
                                fr: "Le paramètre `count` n'est pas un nombre valide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
