import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "tic-tac-toe/list",
    kind: "endpoint",
    title: { en: "Tic-Tac-Toe List", fr: "Liste des morpions" },
    lead: {
        en: "The `/tic-tac-toe/list` endpoint lists all public games currently in progress.",
        fr: "L'endpoint `/tic-tac-toe/list` permet de récupérer toutes les parties de morpion publiques actuellement en cours. Cet endpoint ne retourne pas les parties privées ni les parties terminées.",
    },
    updated: "2026-04-08",
    operations: [
        { id: "default", method: "post", path: "/tic-tac-toe/list", try: false, params: [] },
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
                    type: "p",
                    text: {
                        en: "This endpoint does not require any parameters.",
                        fr: "Cet endpoint ne nécessite aucun paramètre. Il retourne toutes les parties publiques actuellement actives.",
                    },
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
                    lang: "bash",
                    text: 'curl -X POST "https://api.moxon.dev/v3/tic-tac-toe/list"',
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
                    text: {
                        en: '{\n    "games": [\n        {\n            "game": "VWXYZ",\n            "players": ["User1", "User2"],\n            "status": "in_progress",\n            "created_at": "2025-01-21T10:30:00.000Z"\n        },\n        {\n            "game": "ABCDE",\n            "players": ["User3"],\n            "status": "waiting",\n            "created_at": "2025-01-21T10:35:00.000Z"\n        }\n    ],\n    "total": 2\n}',
                        fr: '{\n    "message": "Public games available",\n    "count": 2,\n    "games": [\n        {\n            "id": "ABCDE",\n            "players": ["Utilisateur1", "Utilisateur2"],\n            "playersCount": 2,\n            "moves": 3,\n            "turn": "Utilisateur1",\n            "status": "ready",\n            "creation": 1696204800000\n        },\n        {\n            "id": "FGHIJ",\n            "players": ["Utilisateur3"],\n            "playersCount": 1,\n            "moves": 1,\n            "turn": "Utilisateur3",\n            "status": "waiting",\n            "creation": 1696204700000\n        }\n    ]\n}',
                    },
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
                    type: "split",
                    en: [
                        {
                            type: "table",
                            head: ["Field", "Description"],
                            rows: [
                                ["`games`", "Array of public game objects"],
                                ["`games[].game`", "Game identifier"],
                                ["`games[].players`", "Array of player usernames"],
                                ["`games[].status`", "Game status (`waiting`, `in_progress`)"],
                                ["`games[].created_at`", "Game creation timestamp"],
                                ["`total`", "Total number of public games"],
                            ],
                            kind: "definition",
                        },
                    ],
                    fr: [
                        {
                            type: "table",
                            head: ["Champ", "Description"],
                            rows: [
                                ["`message`", "Message de confirmation"],
                                ["`count`", "Nombre de parties publiques disponibles"],
                                [
                                    "`games`",
                                    "Tableau d'objets de partie avec les propriétés suivantes :",
                                ],
                                ["`games[].id`", "Identifiant unique de la partie"],
                                [
                                    "`games[].players`",
                                    "Tableau des noms d'utilisateur des joueurs dans la partie",
                                ],
                                [
                                    "`games[].playersCount`",
                                    "Nombre de joueurs actuellement dans la partie (0-2)",
                                ],
                                ["`games[].moves`", "Nombre de coups joués dans la partie"],
                                [
                                    "`games[].turn`",
                                    "Nom d'utilisateur du joueur dont c'est le tour",
                                ],
                                [
                                    "`games[].status`",
                                    "Statut actuel de la partie (`waiting` ou `ready`)",
                                ],
                                ["`games[].creation`", "Horodatage de création de la partie"],
                            ],
                            kind: "definition",
                        },
                    ],
                },
            ],
        },
        {
            id: "game-statuses",
            level: 2,
            title: { en: "Game Statuses", fr: "Valeurs de statut de partie" },
            aliases: ["valeurs-de-statut-de-partie"],
            blocks: [
                {
                    type: "table",
                    head: { en: ["Status", "Description"], fr: ["Statut", "Description"] },
                    rows: [
                        [
                            "`waiting`",
                            {
                                en: "Game has one player, waiting for opponent",
                                fr: "La partie a moins de 2 joueurs et attend que d'autres joueurs la rejoignent",
                            },
                        ],
                        [
                            { en: "`in_progress`", fr: "`ready`" },
                            {
                                en: "Game has two players and is active",
                                fr: "La partie a 2 joueurs et est prête à être jouée",
                            },
                        ],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "error-handling",
            level: 2,
            title: { en: "Error Handling", fr: "" },
            only: "en",
            blocks: [
                {
                    type: "p",
                    text: "This endpoint does not require parameters and will not return parameter-related errors.",
                },
            ],
        },
        {
            id: "reponse-de-liste-vide",
            level: 2,
            title: { en: "", fr: "Réponse de liste vide" },
            only: "fr",
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "message": "Public games available",\n    "count": 0,\n    "games": []\n}',
                },
            ],
        },
        {
            id: "notes",
            level: 2,
            title: { en: "", fr: "Notes" },
            only: "fr",
            blocks: [
                {
                    type: "p",
                    text: "La liste inclut uniquement les parties publiques actuellement en cours (pas terminées). Les parties sont triées par heure de création avec les plus récentes en premier. Les parties privées ne sont jamais incluses dans cette liste pour des raisons de confidentialité. Vous pouvez rejoindre n'importe quelle partie listée en utilisant son ID avec l'endpoint [/tic-tac-toe](ref:tic-tac-toe).",
                },
            ],
        },
        {
            id: "related-endpoints",
            level: 2,
            title: { en: "Related Endpoints", fr: "Endpoints associés" },
            aliases: ["endpoints-associes"],
            blocks: [
                {
                    type: "list",
                    items: [
                        {
                            en: "[/v3/tic-tac-toe](ref:tic-tac-toe) - Main game endpoint for making moves",
                            fr: "[/v3/tic-tac-toe](ref:tic-tac-toe) - Endpoint principal du jeu pour effectuer des coups",
                        },
                        {
                            en: "[/v3/tic-tac-toe/fetch](ref:tic-tac-toe/fetch) - Fetch specific game details",
                            fr: "[/v3/tic-tac-toe/fetch](ref:tic-tac-toe/fetch) - Récupérer les détails d'une partie spécifique",
                        },
                    ],
                },
            ],
        },
    ],
};
