import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "tic-tac-toe/list",
    kind: "endpoint",
    title: { en: "Tic-Tac-Toe List", fr: "Liste des morpions" },
    lead: {
        en: "The `/tic-tac-toe/list` endpoint lists all public games currently in progress. This endpoint does not return private or finished games.",
        fr: "L'endpoint `/tic-tac-toe/list` permet de récupérer toutes les parties de morpion publiques actuellement en cours. Cet endpoint ne retourne pas les parties privées ni les parties terminées.",
    },
    updated: "2026-05-25",
    operations: [
        { id: "default", method: "post", path: "/tic-tac-toe/list", try: true, params: [] },
    ],
    sections: [
        {
            id: "",
            blocks: [
                { type: "endpoint", op: "default" },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Good to know", fr: "À savoir" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "The list only includes public games currently in progress (not finished). Games are sorted by creation time with the most recent first. Private games are never included in this list for privacy reasons. You can join any listed game using its ID with the [/tic-tac-toe](ref:tic-tac-toe) endpoint.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "La liste inclut uniquement les parties publiques actuellement en cours (pas terminées). Les parties sont triées par heure de création avec les plus récentes en premier. Les parties privées ne sont jamais incluses dans cette liste pour des raisons de confidentialité. Vous pouvez rejoindre n'importe quelle partie listée en utilisant son ID avec l'endpoint [/tic-tac-toe](ref:tic-tac-toe).",
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
                    type: "p",
                    text: {
                        en: "This endpoint does not require any parameters. It returns all currently active public games.",
                        fr: "Cet endpoint ne nécessite aucun paramètre. Il retourne toutes les parties publiques actuellement actives.",
                    },
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [{ type: "examples", op: "default" }],
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
                            name: "message",
                            type: "`string`",
                            description: { en: "Status message", fr: "Message de confirmation" },
                        },
                        {
                            name: "count",
                            type: "`number`",
                            description: {
                                en: "Total number of public games",
                                fr: "Nombre de parties publiques disponibles",
                            },
                        },
                        {
                            name: "games",
                            type: "`object[]`",
                            description: {
                                en: "Array of public game objects",
                                fr: "Tableau d'objets de partie",
                            },
                        },
                        {
                            name: "games[].id",
                            type: "`string`",
                            description: {
                                en: "Game identifier",
                                fr: "Identifiant unique de la partie",
                            },
                        },
                        {
                            name: "games[].players",
                            type: "`string[]`",
                            description: {
                                en: "Array of player usernames",
                                fr: "Tableau des noms d'utilisateur des joueurs",
                            },
                        },
                        {
                            name: "games[].playersCount",
                            type: "`number`",
                            description: {
                                en: "Number of players in the game",
                                fr: "Nombre de joueurs actuellement dans la partie (0-2)",
                            },
                        },
                        {
                            name: "games[].moves",
                            type: "`number`",
                            description: {
                                en: "Array of moves made in the game",
                                fr: "Nombre de coups joués dans la partie",
                            },
                        },
                        {
                            name: "games[].turn",
                            type: "`string`",
                            description: {
                                en: "Username of the player whose turn it is",
                                fr: "Nom d'utilisateur du joueur dont c'est le tour",
                            },
                        },
                        {
                            name: "games[].status",
                            type: "`string`",
                            description: {
                                en: "Game status (`waiting`, `ready`)",
                                fr: "Statut actuel de la partie (`waiting` ou `ready`)",
                            },
                        },
                        {
                            name: "games[].creation",
                            type: "`number`",
                            description: {
                                en: "Game creation timestamp",
                                fr: "Horodatage de création de la partie",
                            },
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
                            "`ready`",
                            {
                                en: "Game has two players and is active",
                                fr: "La partie a 2 joueurs et est prête à être jouée",
                            },
                        ],
                    ],
                    kind: "definition",
                },
                { type: "try", op: "default" },
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
            id: "related-endpoints",
            level: 2,
            title: { en: "Related Endpoints", fr: "Endpoints associés" },
            aliases: ["endpoints-associes"],
            blocks: [
                {
                    type: "related",
                    items: [
                        {
                            label: "/v5/tic-tac-toe",
                            to: "tic-tac-toe",
                            description: {
                                en: "Main game endpoint for making moves",
                                fr: "Endpoint principal du jeu pour effectuer des coups",
                            },
                        },
                        {
                            label: "/v5/tic-tac-toe/fetch",
                            to: "tic-tac-toe/fetch",
                            description: {
                                en: "Fetch specific game details",
                                fr: "Récupérer les détails d'une partie spécifique",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
