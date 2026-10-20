import type { Page } from "@/types/content";

export const page: Page = {
    version: "v1",
    id: "infos",
    kind: "endpoint",
    title: { en: "API Information", fr: "Informations sur l'API" },
    lead: {
        en: "The `/infos` endpoint provides general information about the [API](https://api.moxon.dev). This endpoint does not require any options.",
        fr: "L'endpoint `/infos` permet d'afficher les informations générales à propos de l'[API](https://api.moxon.dev). Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-10-17",
    operations: [{ id: "default", method: "get", path: "/infos", try: false, params: [] }],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v1/infos", role: "request" }],
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
                    text: '{\n    "endpoints": 11,\n    "last_version": "v1",\n    "documentation": "https://docs.sylvain.sh",\n    "github": "https://github.com/moxondev/api",\n    "creation": "November 25th 2024"\n}',
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
                    text: 'curl -X GET "https://api.moxon.dev/v1/infos"',
                    role: "curl",
                },
            ],
        },
    ],
};
