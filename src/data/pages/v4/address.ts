import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "address",
    kind: "endpoint",
    title: { en: "Address Generation", fr: "Génération d'adresses" },
    lead: {
        en: "The `/address` endpoint generates one or more fictional postal addresses for a given country. Each address includes a street, city, zip code, region, and country name. If no country is specified, one is picked at random.",
        fr: "L'endpoint `/address` génère une ou plusieurs adresses postales fictives pour un pays donné. Chaque adresse inclut une rue, une ville, un code postal, une région et un pays. Si aucun pays n'est spécifié, l'un d'eux est choisi aléatoirement.",
    },
    updated: "2026-05-12",
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
                                en: "House number + street type + street name",
                                fr: "Numéro + type de voie + nom de la rue",
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
                        en: ["Code", "Country", "Zip format example"],
                        fr: ["Code", "Pays", "Exemple de code postal"],
                    },
                    rows: [
                        ["`fr`", "France", "`75001`"],
                        ["`us`", { en: "United States", fr: "États-Unis" }, "`90210`"],
                        ["`uk`", { en: "United Kingdom", fr: "Royaume-Uni" }, "`AB1 2CD`"],
                        ["`de`", { en: "Germany", fr: "Allemagne" }, "`10115`"],
                        ["`es`", { en: "Spain", fr: "Espagne" }, "`28001`"],
                    ],
                    kind: "matrix",
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
                    ],
                },
            ],
        },
    ],
};
