import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "tic-tac-toe/forfeit",
    kind: "endpoint",
    title: { en: "Tic-Tac-Toe Forfeit", fr: "Tic-Tac-Toe Forfait" },
    lead: {
        en: "The `/tic-tac-toe/forfeit` endpoint forfeits (abandons) a game.",
        fr: "L'endpoint `/tic-tac-toe/forfeit` permet d'abandonner une partie (forfait).",
    },
    updated: "2026-10-17",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/tic-tac-toe/forfeit",
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
                                text: "This endpoint moved from `DELETE` to `POST`, and its identifier left the URL: `game` is now sent in the JSON body. `PATCH` and `DELETE` no longer exist anywhere in the API.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Cet endpoint passe de `DELETE` à `POST`, et son identifiant sort de l'URL : `game` est désormais envoyé dans le corps JSON. Les méthodes `PATCH` et `DELETE` n'existent plus nulle part dans l'API.",
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
                                en: "The game identifier",
                                fr: "L'identifiant de la partie",
                            },
                        },
                        {
                            name: "username",
                            required: true,
                            description: {
                                en: "The username forfeiting",
                                fr: "Le nom d'utilisateur qui abandonne",
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
                                en: "Confirmation of the forfeit",
                                fr: "Confirmation du forfait",
                            },
                        },
                        {
                            name: "winner",
                            type: "`string|null`",
                            description: {
                                en: "Username of the winner (opponent), `null` if the player was alone in the game",
                                fr: "Nom d'utilisateur du gagnant (adversaire), `null` si le joueur était seul dans la partie",
                            },
                        },
                        {
                            name: "loser",
                            type: "`string`",
                            description: {
                                en: "Username of the player who forfeit",
                                fr: "Nom d'utilisateur du joueur qui abandonne",
                            },
                        },
                    ],
                },
                {
                    type: "p",
                    text: {
                        en: "The game is deleted after a forfeit.",
                        fr: "La partie est supprimée après un forfait.",
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
                    body: { game: "VWXYZ", username: "alice", session: "abc123" },
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
                            message: "Game not found",
                            description: {
                                en: "The game does not exist",
                                fr: "La partie n'existe pas",
                            },
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
                        {
                            message: "You are not a player in this game",
                            description: {
                                en: "The player is not part of this game",
                                fr: "Le joueur ne participe pas à cette partie",
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
                                    label: "/v6/tic-tac-toe/play",
                                    to: "tic-tac-toe/play",
                                    description: "Play a move",
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
                                    label: "/v6/tic-tac-toe/play",
                                    to: "tic-tac-toe/play",
                                    description: "Jouer un coup",
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
