import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "tic-tac-toe/play",
    kind: "endpoint",
    title: { en: "Tic-Tac-Toe Play", fr: "Tic-Tac-Toe Jouer" },
    lead: {
        en: "The `/tic-tac-toe/:game` endpoint plays a move in an existing game using a REST method.",
        fr: "L'endpoint `/tic-tac-toe/:game` permet de jouer un coup dans une partie existante via une méthode REST.",
    },
    updated: "2026-05-25",
    operations: [
        {
            id: "default",
            method: "patch",
            path: "/tic-tac-toe/:game",
            try: true,
            params: [
                { name: "game", type: "string", in: "path", required: true, value: "VWXYZ" },
                { name: "username", type: "string", in: "body", required: true },
                { name: "move", type: "string", in: "body", required: true },
                { name: "session", type: "string", in: "body", required: true },
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
                            name: "game",
                            required: true,
                            description: {
                                en: "The game identifier (URL parameter)",
                                fr: "L'identifiant de la partie (paramètre d'URL)",
                            },
                        },
                        {
                            name: "username",
                            required: true,
                            description: {
                                en: "The username making the move",
                                fr: "Le nom d'utilisateur effectuant le coup",
                            },
                        },
                        {
                            name: "move",
                            required: true,
                            description: {
                                en: "The move played (e.g., `1-1`, `2-2`, `3-3`)",
                                fr: "Le coup joué (ex. : `1-1`, `2-2`, `3-3`)",
                            },
                        },
                        {
                            name: "session",
                            required: true,
                            description: {
                                en: "The user's session identifier",
                                fr: "L'identifiant de session de l'utilisateur",
                            },
                        },
                    ],
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Good to know", fr: "À savoir" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "The `game` parameter is part of the URL path. The other parameters are sent as a JSON body with `Content-Type: application/json`.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Le paramètre `game` fait partie du chemin de l'URL. Les autres paramètres sont envoyés dans un body JSON avec `Content-Type: application/json`.",
                            },
                        ],
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
                            name: "message",
                            type: "`string`",
                            description: {
                                en: "Status message about the move",
                                fr: "Message de statut du coup",
                            },
                        },
                        {
                            name: "winner",
                            type: "`string|null`",
                            description: {
                                en: "Username of the winner (if game is over)",
                                fr: "Nom d'utilisateur du gagnant (si la partie est terminée)",
                            },
                        },
                        {
                            name: "loser",
                            type: "`string|null`",
                            description: {
                                en: "Username of the loser (if game is over)",
                                fr: "Nom d'utilisateur du perdant (si la partie est terminée)",
                            },
                        },
                        {
                            name: "tie",
                            type: "`boolean`",
                            description: {
                                en: "Whether the game ended in a tie",
                                fr: "Si la partie s'est terminée par une égalité",
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
                {
                    type: "examples",
                    op: "default",
                    path: "/tic-tac-toe/VWXYZ",
                    body: { username: "alice", move: "1-1", session: "abc123" },
                },
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
                            message:
                                "Invalid move. Please provide a valid move (e.g., 1-1, 2-2, 3-3).",
                            description: {
                                en: "Invalid move format",
                                fr: "Format de coup invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Game is full, you can only watch.",
                            description: {
                                en: "Game already has two players",
                                fr: "La partie a déjà deux joueurs",
                            },
                            status: 400,
                        },
                        {
                            message: "Please wait for the other player to make a move.",
                            description: { en: "Not your turn", fr: "Ce n'est pas votre tour" },
                            status: 400,
                        },
                        {
                            message: "Move already made. Please choose a different move.",
                            description: { en: "Cell already occupied", fr: "Case déjà occupée" },
                            status: 400,
                        },
                        {
                            message: "Session ID mismatch",
                            description: {
                                en: "Session doesn't match the player",
                                fr: "La session ne correspond pas au joueur",
                            },
                            status: 400,
                        },
                    ],
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
                            label: "/v5/tic-tac-toe/:game",
                            to: "tic-tac-toe/forfeit",
                            description: { en: "Forfeit a game", fr: "Abandonner une partie" },
                        },
                        {
                            label: "/v5/tic-tac-toe/fetch",
                            to: "tic-tac-toe/fetch",
                            description: {
                                en: "Retrieve current game information",
                                fr: "Récupérer les informations de la partie",
                            },
                        },
                        {
                            label: "/v5/tic-tac-toe/list",
                            to: "tic-tac-toe/list",
                            description: {
                                en: "List all public games",
                                fr: "Lister toutes les parties publiques",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
