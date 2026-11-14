import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "tic-tac-toe",
    kind: "endpoint",
    title: { en: "Online Tic-Tac-Toe", fr: "Morpion en ligne" },
    lead: {
        en: "The `/tic-tac-toe` endpoint allows playing and storing an online Tic-Tac-Toe game. Games are stored for 1 hour and support both public and private modes.",
        fr: "L'endpoint `/tic-tac-toe` permet de jouer et de stocker une partie de morpion en ligne. Les parties sont stockées pendant 1 heure et supportent les modes public et privé.",
    },
    updated: "2026-11-14",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/tic-tac-toe",
            try: true,
            params: [
                {
                    name: "username",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "john",
                },
                { name: "move", type: "string", in: "body", required: true, placeholder: "5" },
                {
                    name: "session",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "my-session",
                },
                { name: "game", type: "string", in: "body", required: true, placeholder: "abc123" },
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
                            name: "username",
                            required: true,
                            description: {
                                en: "The username making the move (max 100 characters)",
                                fr: "Le nom d'utilisateur effectuant le mouvement (max 100 caractères)",
                            },
                        },
                        {
                            name: "move",
                            required: true,
                            description: {
                                en: "The move played in `row-column` format (e.g., `1-1`, `2-2`, `3-3`)",
                                fr: "Le coup joué au format `ligne-colonne` (ex. : `1-1`, `2-2`, `3-3`)",
                            },
                        },
                        {
                            name: "session",
                            required: true,
                            description: {
                                en: "The user's session identifier (max 256 characters)",
                                fr: "L'identifiant de session de l'utilisateur (max 256 caractères)",
                            },
                        },
                        {
                            name: "game",
                            required: true,
                            description: {
                                en: "The game identifier for connection. If the game does not exist, it will be created. Max 256 characters",
                                fr: "L'identifiant de la partie permettant la connexion. Si la partie n'existe pas, elle sera créée. Max 256 caractères",
                            },
                        },
                    ],
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Bounded inputs", fr: "Entrées bornées" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Since 6.2.0, the identifiers are bounded: `username` up to 100 characters, `session` and `game` up to 256. A longer value, or one that is an object or an array, is refused with the usual `400` error.",
                            },
                            {
                                type: "p",
                                text: "Names such as `constructor`, `__proto__` or `toString` are ordinary usernames and game identifiers: such a game is created and found like any other, and forfeiting one that does not exist answers `Game not found`.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Depuis la 6.2.0, les identifiants sont bornés : `username` jusqu'à 100 caractères, `session` et `game` jusqu'à 256. Une valeur plus longue, ou qui est un objet ou un tableau, est refusée avec l'erreur `400` habituelle.",
                            },
                            {
                                type: "p",
                                text: "Les noms tels que `constructor`, `__proto__` ou `toString` sont des noms d'utilisateur et des identifiants de partie ordinaires : une telle partie est créée et retrouvée comme les autres, et abandonner une partie qui n'existe pas répond `Game not found`.",
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: "move-format",
            level: 2,
            title: { en: "Move Format", fr: "Format des coups" },
            aliases: ["format-des-coups"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The board is a 3x3 grid with positions numbered as follows:",
                        fr: "Le plateau est une grille 3x3 avec des positions numérotées comme suit :",
                    },
                },
                {
                    type: "code",
                    text: "1-1 | 1-2 | 1-3\n----|-----|----\n2-1 | 2-2 | 2-3\n----|-----|----\n3-1 | 3-2 | 3-3",
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
                    body: {
                        en: { username: "User1", move: "2-2", session: "abc123", game: "VWXYZ" },
                        fr: {
                            username: "Utilisateur1",
                            move: "2-2",
                            session: "abc123",
                            game: "VWXYZ",
                        },
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
            id: "error-responses",
            level: 2,
            title: { en: "Error Responses", fr: "Réponses d'erreur" },
            aliases: ["reponses-d-erreur"],
            blocks: [
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Global rate limit exceeded.",
                            description: {
                                en: "Global API rate limit reached",
                                fr: "Limite globale de l'API atteinte",
                            },
                            status: 429,
                        },
                        {
                            message: "You have exceeded the limit of X requests per hour.",
                            description: {
                                en: "Hourly IP/token limit reached",
                                fr: "Limite horaire IP/token atteinte",
                            },
                            status: 429,
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
                    short: true,
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
                                en: "The `move` parameter is missing or invalid",
                                fr: "Le paramètre `move` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid session ID (&session={ID})",
                            description: {
                                en: "The `session` parameter is missing or invalid",
                                fr: "Le paramètre `session` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid game ID (&game={ID})",
                            description: {
                                en: "The `game` parameter is missing or invalid",
                                fr: "Le paramètre `game` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Username cannot exceed 100 characters",
                            description: {
                                en: "The `username` parameter is longer than 100 characters (since 6.2.0)",
                                fr: "Le paramètre `username` dépasse 100 caractères (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                        {
                            message: "Session ID cannot exceed 256 characters",
                            description: {
                                en: "The `session` parameter is longer than 256 characters (since 6.2.0)",
                                fr: "Le paramètre `session` dépasse 256 caractères (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                        {
                            message: "Game ID cannot exceed 256 characters",
                            description: {
                                en: "The `game` parameter is longer than 256 characters (since 6.2.0)",
                                fr: "Le paramètre `game` dépasse 256 caractères (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid username",
                            description: {
                                en: "The `username` parameter is an object or an array (since 6.2.0)",
                                fr: "Le paramètre `username` est un objet ou un tableau (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid session ID",
                            description: {
                                en: "The `session` parameter is an object or an array (since 6.2.0)",
                                fr: "Le paramètre `session` est un objet ou un tableau (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid game ID",
                            description: {
                                en: "The `game` parameter is an object or an array (since 6.2.0)",
                                fr: "Le paramètre `game` est un objet ou un tableau (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                    ],
                },
                {
                    type: "p",
                    text: {
                        en: "When a game is over, the request will return the winner and loser names, as well as whether there is a tie.",
                        fr: "Lorsqu'une partie est terminée, la requête retournera les noms du gagnant et du perdant, ainsi que s'il y a égalité.",
                    },
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
                            label: "/v4/tic-tac-toe/fetch",
                            to: "tic-tac-toe/fetch",
                            description: {
                                en: "Retrieve current game information",
                                fr: "Récupérer les informations de la partie en cours",
                            },
                        },
                        {
                            label: "/v4/tic-tac-toe/list",
                            to: "tic-tac-toe/list",
                            description: {
                                en: "List all public games",
                                fr: "Lister toutes les parties publiques",
                            },
                        },
                        {
                            label: "/v4/tic-tac-toe/:game",
                            to: "tic-tac-toe/play",
                            description: { en: "Play a move", fr: "Jouer un coup" },
                        },
                        {
                            label: "/v4/tic-tac-toe/:game",
                            to: "tic-tac-toe/forfeit",
                            description: { en: "Forfeit a game", fr: "Abandonner une partie" },
                        },
                    ],
                },
            ],
        },
    ],
};
