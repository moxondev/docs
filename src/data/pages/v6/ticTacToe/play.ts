import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "tic-tac-toe/play",
    kind: "endpoint",
    title: { en: "Tic-Tac-Toe Play", fr: "Tic-Tac-Toe Jouer" },
    lead: {
        en: "The `/tic-tac-toe/play` endpoint plays a move in a game. If the `game` identifier does not exist, the game is created.",
        fr: "L'endpoint `/tic-tac-toe/play` permet de jouer un coup dans une partie. Si l'identifiant `game` n'existe pas, la partie est créée.",
    },
    updated: "2026-10-17",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/tic-tac-toe/play",
            try: true,
            params: [
                { name: "game", type: "string", in: "body", required: true, placeholder: "VWXYZ" },
                {
                    name: "username",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "alice",
                },
                { name: "move", type: "string", in: "body", required: true, placeholder: "1-1" },
                {
                    name: "session",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "abc123",
                },
            ],
        },
    ],
    sections: [
        {
            id: "",
            blocks: [
                { type: "endpoint", op: "default" },
                {
                    type: "callout",
                    kind: "warning",
                    title: { en: "Changed in 6.0.0", fr: "Changement en 6.0.0" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "This endpoint moved from `PATCH` to `POST`, and its identifier left the URL: `game` is now sent in the JSON body. `PATCH` and `DELETE` no longer exist anywhere in the API.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Cet endpoint passe de `PATCH` à `POST`, et son identifiant sort de l'URL : `game` est désormais envoyé dans le corps JSON. Les méthodes `PATCH` et `DELETE` n'existent plus nulle part dans l'API.",
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
                    type: "params",
                    rows: [
                        {
                            name: "game",
                            required: true,
                            description: {
                                en: "The game identifier. If the game does not exist, it is created",
                                fr: "L'identifiant de la partie. Si la partie n'existe pas, elle est créée",
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
                                en: "The move played in `row-column` format (e.g., `1-1`, `2-2`, `3-3`), see [Move Format](ref:tic-tac-toe#move-format)",
                                fr: "Le coup joué au format `ligne-colonne` (ex. : `1-1`, `2-2`, `3-3`), voir [Format des coups](ref:tic-tac-toe#move-format)",
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
                                text: "All parameters are sent as a JSON body with `Content-Type: application/json`.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Tous les paramètres sont envoyés dans un body JSON avec `Content-Type: application/json`.",
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
                {
                    type: "p",
                    text: {
                        en: "While the game goes on, the response only contains `message` (`Move sent successfully`). The `winner`, `loser` and `tie` fields are only present when the move ends the game.",
                        fr: "Tant que la partie continue, la réponse ne contient que `message` (`Move sent successfully`). Les champs `winner`, `loser` et `tie` ne sont présents que lorsque le coup termine la partie.",
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
                {
                    type: "examples",
                    op: "default",
                    body: { game: "VWXYZ", username: "alice", move: "1-1", session: "abc123" },
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
                            message: "Please provide a username (?username={username})",
                            description: {
                                en: "The `username` parameter is missing",
                                fr: "Le paramètre `username` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid move (&move={move})",
                            description: {
                                en: "The `move` parameter is missing",
                                fr: "Le paramètre `move` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid session ID (&session={ID})",
                            description: {
                                en: "The `session` parameter is missing",
                                fr: "Le paramètre `session` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a game ID (&game={ID})",
                            description: {
                                en: "The `game` parameter is missing",
                                fr: "Le paramètre `game` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Rate limit exceeded. Try again in X seconds.",
                            description: {
                                en: "Per-user short-window limit",
                                fr: "Limite courte durée par utilisateur",
                            },
                            status: 400,
                        },
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
                    type: "split",
                    en: [
                        {
                            type: "related",
                            items: [
                                {
                                    label: "Online Tic-Tac-Toe",
                                    to: "tic-tac-toe",
                                    description: "How a game works and migrating from v4 and v5",
                                },
                                {
                                    label: "/v6/tic-tac-toe/forfeit",
                                    to: "tic-tac-toe/forfeit",
                                    description: "Forfeit a game",
                                },
                                {
                                    label: "/v6/tic-tac-toe/fetch",
                                    to: "tic-tac-toe/fetch",
                                    description: "Retrieve current game information",
                                },
                                {
                                    label: "/v6/tic-tac-toe/list",
                                    to: "tic-tac-toe/list",
                                    description: "List all public games",
                                },
                            ],
                        },
                    ],
                    fr: [
                        {
                            type: "related",
                            items: [
                                {
                                    label: "Morpion en ligne",
                                    to: "tic-tac-toe",
                                    description:
                                        "Déroulement d'une partie et migration depuis la v4 et la v5",
                                },
                                {
                                    label: "/v6/tic-tac-toe/forfeit",
                                    to: "tic-tac-toe/forfeit",
                                    description: "Abandonner une partie",
                                },
                                {
                                    label: "/v6/tic-tac-toe/fetch",
                                    to: "tic-tac-toe/fetch",
                                    description: "Récupérer les informations de la partie",
                                },
                                {
                                    label: "/v6/tic-tac-toe/list",
                                    to: "tic-tac-toe/list",
                                    description: "Lister toutes les parties publiques",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
