import type { Page } from "@/types/content";

export const page: Page = {
    version: "v2",
    id: "tic-tac-toe",
    kind: "endpoint",
    title: { en: "Online Tic-Tac-Toe", fr: "Morpion en ligne" },
    lead: {
        en: "The `/tic-tac-toe` endpoint allows playing and storing an online Tic-Tac-Toe game. Games are stored for 1 hour and can be accessed via a unique identifier.",
        fr: "L'endpoint `/tic-tac-toe` permet de jouer et de stocker une partie de morpion en ligne. Les parties sont stockées 1 heure et sont accessibles via un identifiant unique.",
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
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: {
                        en: 'curl -X POST -d "username=User1&move=2-2&session=abc123&game=VWXYZ" "https://api.moxon.dev/v2/tic-tac-toe"',
                        fr: 'curl -X POST -d "username=Utilisateur1&move=2-2&session=abc123&game=VWXYZ" "https://api.moxon.dev/v2/tic-tac-toe"',
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
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "message": "Move sent successfully"\n}',
                    role: "response",
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
                        en: "If a `username`, `move`, `session`, or `game` value is empty or invalid, if the game is full, if the same player plays twice in a row, or if the move has already been played, an error will be returned.",
                        fr: "Si une valeur de `username`, `move`, `session` ou `game` est vide ou invalide, que la partie est pleine, que le même joueur joue deux fois de suite ou si le coup est déjà joué, une erreur sera renvoyée.",
                    },
                },
                {
                    type: "p",
                    text: {
                        en: "When a game is over, the request will return the winner and loser names, as well as whether there is a tie. The [/tic-tac-toe/fetch](ref:tic-tac-toe/fetch) endpoint allows retrieving more information about the current game.",
                        fr: "Lorsqu'une partie est terminée, la requête renverra le nom du gagnant et du perdant, ainsi que s'il y a égalité. L'endpoint [/tic-tac-toe/fetch](ref:tic-tac-toe/fetch) permet de récupérer plus d'informations sur la partie en cours.",
                    },
                },
            ],
        },
    ],
};
