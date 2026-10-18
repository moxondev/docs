import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "infos",
    kind: "endpoint",
    title: { en: "API Information", fr: "Informations sur l'API" },
    lead: {
        en: "The `/infos` endpoint provides general information about the [API](https://api.moxon.dev). This endpoint does not require any options.",
        fr: "L'endpoint `/infos` fournit des informations générales sur l'[API](https://api.moxon.dev). Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-04-21",
    operations: [{ id: "default", method: "get", path: "/infos", try: true, params: [] }],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Paramètres" },
            aliases: ["parametres"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "This endpoint does not require any parameters. It returns the API metadata: endpoint count, current version, documentation link and creation date.",
                        fr: "Cet endpoint ne nécessite aucun paramètre. Il retourne les métadonnées de l'API : nombre d'endpoints, version actuelle, lien de documentation et date de création.",
                    },
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
                            name: "endpoints",
                            type: "`number`",
                            description: {
                                en: "Total number of available endpoints",
                                fr: "Nombre total d'endpoints disponibles",
                            },
                        },
                        {
                            name: "last_version",
                            type: "`string`",
                            description: {
                                en: "Current API version",
                                fr: "Version actuelle de l'API",
                            },
                        },
                        {
                            name: "documentation",
                            type: "`string`",
                            description: { en: "Documentation URL", fr: "URL de la documentation" },
                        },
                        {
                            name: "github",
                            type: "`string`",
                            description: { en: "GitHub repository URL", fr: "URL du dépôt GitHub" },
                        },
                        {
                            name: "creation",
                            type: "`string`",
                            description: {
                                en: "API creation date",
                                fr: "Date de création de l'API",
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
                { type: "examples", op: "default" },
                { type: "try", op: "default" },
            ],
        },
    ],
};
