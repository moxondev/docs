import type { Page } from "@/types/content";

export const page: Page = {
    version: "v2",
    id: "tic-tac-toe/fetch",
    kind: "endpoint",
    title: { en: "Tic-Tac-Toe Fetch", fr: "Récupération du morpion" },
    lead: {
        en: "The `/tic-tac-toe/fetch` endpoint allows you to retrieve an ongoing Tic-Tac-Toe game. You can use the current game ID to display it.",
        fr: "L'endpoint `/tic-tac-toe/fetch` permet d'afficher une partie de morpion en cours. Vous pouvez utiliser l'identifiant de la partie en cours pour l'afficher.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/tic-tac-toe/fetch",
            try: false,
            params: [
                { name: "username", type: "string", in: "body", required: true },
                { name: "game", type: "string", in: "body", required: false },
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
                                en: "The username making the request",
                                fr: "Le nom d'utilisateur effectuant la requête",
                            },
                        },
                        {
                            name: "game",
                            required: false,
                            description: {
                                en: "The ID of the game to display. If not provided, a new game ID will be generated",
                                fr: "L'identifiant de la partie à afficher. S'il n'est pas fourni, un nouvel identifiant de partie sera généré",
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
                        en: 'curl -X POST -d "username=User1&game=VWXYZ" "https://api.moxon.dev/v2/tic-tac-toe/fetch"',
                        fr: 'curl -X POST -d "username=Utilisateur1&game=VWXYZ" "https://api.moxon.dev/v2/tic-tac-toe/fetch"',
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
                    text: {
                        en: '{\n    "id": "VWXYZ",\n    "moves": [\n        {\n            "username": "User1",\n            "move": "2-2",\n            "session": "abc123"\n        },\n        {\n            "username": "User2",\n            "move": "1-3",\n            "session": "def456"\n        },\n        {\n            "username": "User1",\n            "move": "1-2",\n            "session": "abc123"\n        },\n        {\n            "username": "User2",\n            "move": "2-3",\n            "session": "def456"\n        }\n    ],\n    "players": ["user1", "user2"],\n    "turn": "user1",\n    "status": "ready",\n    "winner": null,\n    "loser": null,\n    "tie": false\n}',
                        fr: '{\n    "id": "VWXYZ",\n    "moves": [\n        {\n            "username": "Utilisateur1",\n            "move": "2-2",\n            "session": "abc123"\n        },\n        {\n            "username": "Utilisateur2",\n            "move": "1-3",\n            "session": "def456"\n        },\n        {\n            "username": "Utilisateur1",\n            "move": "1-2",\n            "session": "abc123"\n        },\n        {\n            "username": "Utilisateur2",\n            "move": "2-3",\n            "session": "def456"\n        }\n    ],\n    "players": ["utilisateur1", "utilisateur2"],\n    "turn": "utilisateur1",\n    "status": "ready",\n    "winner": null,\n    "loser": null,\n    "tie": false\n}',
                    },
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
                        en: "If the `username` value is empty, an error will be returned. When the game is created, a session ID is generated and returned in the response. You can use this session ID to make moves in the game. If the game is over, the winner and loser will be included in the response.",
                        fr: "Si une valeur de `username` est vide, une erreur sera renvoyée. Lorsque la partie est créée, un identifiant de session est généré et renvoyé dans la réponse. Vous pouvez utiliser cet identifiant pour effectuer des mouvements dans la partie. Si la partie est terminée, le gagnant et le perdant sont renvoyés dans la réponse.",
                    },
                },
            ],
        },
    ],
};
