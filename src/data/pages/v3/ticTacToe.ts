import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "tic-tac-toe",
    kind: "endpoint",
    title: { en: "Online Tic-Tac-Toe", fr: "Morpion en ligne" },
    lead: {
        en: "The `/tic-tac-toe` endpoint allows playing and storing an online Tic-Tac-Toe game. Games are stored for 1 hour and support both public and private modes.",
        fr: "L'endpoint `/tic-tac-toe` permet de jouer et de stocker une partie de morpion en ligne. Les parties sont stockées pendant 1 heure et supportent les modes public et privé.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/tic-tac-toe",
            try: false,
            params: [
                { name: "username", type: "string", in: "body", required: true },
                { name: "move", type: "string", in: "body", required: true },
                { name: "session", type: "string", in: "body", required: true },
                { name: "game", type: "string", in: "body", required: true },
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
                                en: "The username making the move",
                                fr: "Le nom d'utilisateur effectuant le mouvement",
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
                                en: "The user's session identifier",
                                fr: "L'identifiant de session de l'utilisateur",
                            },
                        },
                        {
                            name: "game",
                            required: true,
                            description: {
                                en: "The game identifier for connection. If the game does not exist, it will be created",
                                fr: "L'identifiant de la partie permettant la connexion. Si la partie n'existe pas, elle sera créée",
                            },
                        },
                    ],
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
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: {
                        en: 'curl -X POST -d "username=User1&move=2-2&session=abc123&game=VWXYZ" "https://api.moxon.dev/v3/tic-tac-toe"',
                        fr: 'curl -X POST -d "username=Utilisateur1&move=2-2&session=abc123&game=VWXYZ" "https://api.moxon.dev/v3/tic-tac-toe"',
                    },
                    role: "request",
                },
            ],
        },
        {
            id: "response",
            level: 2,
            title: { en: "Response", fr: "Réponse" },
            aliases: ["reponse"],
            blocks: [],
        },
        {
            id: "move-success",
            level: 3,
            title: { en: "Move Success", fr: "Coup réussi" },
            aliases: ["coup-reussi"],
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "message": "Move sent successfully"\n}',
                },
            ],
        },
        {
            id: "game-win",
            level: 3,
            title: { en: "Game Win", fr: "Victoire" },
            aliases: ["victoire"],
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: {
                        en: '{\n    "message": "Move sent successfully. User1 wins. User2 loses.",\n    "winner": "User1",\n    "loser": "User2",\n    "tie": false\n}',
                        fr: '{\n    "message": "Move sent successfully. Utilisateur1 wins. Utilisateur2 loses.",\n    "winner": "Utilisateur1",\n    "loser": "Utilisateur2",\n    "tie": false\n}',
                    },
                },
            ],
        },
        {
            id: "game-tie",
            level: 3,
            title: { en: "Game Tie", fr: "Égalité" },
            aliases: ["egalite"],
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "message": "Game over. It\'s a tie!",\n    "winner": null,\n    "loser": null,\n    "tie": true\n}',
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
                            message: "Rate limit exceeded. Try again in X seconds.",
                            description: { en: "Too many requests", fr: "Trop de requêtes" },
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
                    type: "list",
                    items: [
                        {
                            en: "[/v3/tic-tac-toe/fetch](ref:tic-tac-toe/fetch) - Retrieve current game information",
                            fr: "[/v3/tic-tac-toe/fetch](ref:tic-tac-toe/fetch) - Récupérer les informations de la partie en cours",
                        },
                        {
                            en: "[/v3/tic-tac-toe/list](ref:tic-tac-toe/list) - List all public games in progress",
                            fr: "[/v3/tic-tac-toe/list](ref:tic-tac-toe/list) - Lister toutes les parties publiques en cours",
                        },
                    ],
                },
            ],
        },
    ],
};
