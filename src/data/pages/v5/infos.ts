import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "infos",
    kind: "endpoint",
    title: { en: "API Information", fr: "Informations sur l'API" },
    lead: {
        en: "The `/infos` endpoint provides general information about the [API](https://api.moxon.dev). This endpoint does not require any options.",
        fr: "L'endpoint `/infos` fournit des informations générales sur l'[API](https://api.moxon.dev). Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-09-07",
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
                        en: "This endpoint does not require any parameters. It returns the API metadata: endpoint count and current version. The documentation link, GitHub repository and creation date are only returned when the instance is configured with them.",
                        fr: "Cet endpoint ne nécessite aucun paramètre. Il retourne les métadonnées de l'API : nombre d'endpoints et version actuelle. Le lien de documentation, le dépôt GitHub et la date de création ne sont retournés que si l'instance est configurée avec ces informations.",
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
                            description: {
                                en: "Documentation URL — absent if the instance does not set `DOCS_URL`",
                                fr: "URL de la documentation — absent si l'instance ne définit pas `DOCS_URL`",
                            },
                        },
                        {
                            name: "github",
                            type: "`string`",
                            description: {
                                en: "GitHub repository URL — absent if the instance does not set `REPO_URL`",
                                fr: "URL du dépôt GitHub — absent si l'instance ne définit pas `REPO_URL`",
                            },
                        },
                        {
                            name: "creation",
                            type: "`string`",
                            description: {
                                en: "API creation date — absent if the instance does not set `INSTANCE_CREATED`",
                                fr: "Date de création de l'API — absent si l'instance ne définit pas `INSTANCE_CREATED`",
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
