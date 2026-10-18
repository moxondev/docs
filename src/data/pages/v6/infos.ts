import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "infos",
    kind: "endpoint",
    title: { en: "API Information", fr: "Informations sur l'API" },
    lead: {
        en: "The `/infos` endpoint provides general information about the [API](https://api.moxon.dev). This endpoint does not require any options.",
        fr: "L'endpoint `/infos` fournit des informations générales sur l'[API](https://api.moxon.dev). Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-10-17",
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
                                en: "Number of endpoints of the requested version (see below for what it counts)",
                                fr: "Nombre d'endpoints de la version demandée (voir ci-dessous ce qu'il compte)",
                            },
                        },
                        {
                            name: "last_version",
                            type: "`string`",
                            description: {
                                en: "Latest API version, whatever the version requested",
                                fr: "Dernière version de l'API, quelle que soit la version demandée",
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
                {
                    type: "callout",
                    kind: "info",
                    title: {
                        en: "What the endpoint count includes",
                        fr: "Ce que compte le nombre d'endpoints",
                    },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "`endpoints` counts the **distinct paths** of the requested version, whatever the method. A path shared by a `GET` and a `POST` with exactly the same form is counted once, like `/chat`. It is therefore not the number of method + path pairs: in v6, `/infos` announces 56 endpoints while 57 method + path pairs are served, because `GET /chat` and `POST /chat` count as one.",
                            },
                            {
                                type: "p",
                                text: "Paths are compared as the API declares them, query parameters included: `GET /pow` and `POST /pow` therefore count as two.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "`endpoints` compte les **chemins distincts** de la version demandée, toutes méthodes confondues. Un chemin partagé par un `GET` et un `POST` avec exactement la même forme n'est compté qu'une fois, comme `/chat`. Ce n'est donc pas le nombre de couples méthode + chemin : en v6, `/infos` annonce 56 endpoints alors que 57 couples méthode + chemin sont servis, parce que `GET /chat` et `POST /chat` ne comptent que pour un.",
                            },
                            {
                                type: "p",
                                text: "Les chemins sont comparés tels que l'API les déclare, paramètres de requête compris : `GET /pow` et `POST /pow` comptent donc pour deux.",
                            },
                        ],
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
    ],
};
