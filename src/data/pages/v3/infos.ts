import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "infos",
    kind: "endpoint",
    title: { en: "API Information", fr: "Informations sur l'API" },
    lead: {
        en: "The `/infos` endpoint provides general information about the [API](https://api.moxon.dev). This endpoint does not require any options.",
        fr: "L'endpoint `/infos` fournit des informations générales sur l'[API](https://api.moxon.dev). Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-10-17",
    operations: [{ id: "default", method: "get", path: "/infos", try: false, params: [] }],
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
                        en: "This endpoint does not require any parameters.",
                        fr: "Cet endpoint ne nécessite aucun paramètre.",
                    },
                },
            ],
        },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v3/infos", role: "request" }],
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
                    text: '{\n    "endpoints": 20,\n    "last_version": "v3",\n    "documentation": "https://docs.sylvain.sh",\n    "github": "https://github.com/moxondev/api",\n    "creation": "November 25th 2024"\n}',
                    role: "response",
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
                    type: "table",
                    head: { en: ["Field", "Description"], fr: ["Champ", "Description"] },
                    rows: [
                        [
                            "`endpoints`",
                            {
                                en: "Total number of available endpoints",
                                fr: "Nombre total d'endpoints disponibles",
                            },
                        ],
                        [
                            "`last_version`",
                            { en: "Current API version", fr: "Version actuelle de l'API" },
                        ],
                        [
                            "`documentation`",
                            { en: "Documentation URL", fr: "URL de la documentation" },
                        ],
                        ["`github`", { en: "GitHub repository URL", fr: "URL du dépôt GitHub" }],
                        [
                            "`creation`",
                            { en: "API creation date", fr: "Date de création de l'API" },
                        ],
                    ],
                    kind: "definition",
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
                    text: 'curl -X GET "https://api.moxon.dev/v3/infos"',
                    role: "curl",
                },
            ],
        },
    ],
};
