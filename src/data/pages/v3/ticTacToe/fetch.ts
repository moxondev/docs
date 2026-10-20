import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "tic-tac-toe/fetch",
    kind: "endpoint",
    title: { en: "Tic-Tac-Toe Fetch", fr: "Récupération du morpion" },
    lead: {
        en: "The `/tic-tac-toe/fetch` endpoint retrieves information about a current Tic-Tac-Toe game.",
        fr: "L'endpoint `/tic-tac-toe/fetch` permet de récupérer les informations d'une partie de morpion en cours. Vous pouvez utiliser l'identifiant de la partie en cours pour l'afficher ou créer une nouvelle partie si aucun ID n'est fourni.",
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
                { name: "private", type: "string", in: "body", required: false },
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
                                en: "The username of the player",
                                fr: "Le nom d'utilisateur effectuant la requête",
                            },
                        },
                        {
                            name: "game",
                            required: false,
                            description: {
                                en: "The game identifier to fetch",
                                fr: "L'identifiant de la partie à afficher. S'il n'est pas fourni, un nouvel identifiant de partie sera généré",
                            },
                        },
                        {
                            name: "private",
                            required: false,
                            description: {
                                en: "Set to `true` to fetch only private games",
                                fr: "Définir à `true` pour créer une partie privée (défaut : `false`)",
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
                        en: 'curl -X POST -d "username=User1&game=VWXYZ" "https://api.moxon.dev/v3/tic-tac-toe/fetch"',
                        fr: 'curl -X POST -d "username=Utilisateur1&game=VWXYZ" "https://api.moxon.dev/v3/tic-tac-toe/fetch"',
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
                        en: '{\n    "game": "VWXYZ",\n    "players": ["User1", "User2"],\n    "board": [\n        ["X", "", "O"],\n        ["", "X", ""],\n        ["O", "", ""]\n    ],\n    "current_turn": "User2",\n    "status": "in_progress",\n    "private": false,\n    "created_at": "2025-01-21T10:30:00.000Z"\n}',
                        fr: '{\n    "id": "VWXYZ",\n    "moves": [\n        {\n            "username": "Utilisateur1",\n            "move": "2-2",\n            "session": "abc123"\n        },\n        {\n            "username": "Utilisateur2",\n            "move": "1-3",\n            "session": "def456"\n        }\n    ],\n    "players": ["Utilisateur1", "Utilisateur2"],\n    "turn": "Utilisateur1",\n    "status": "ready",\n    "private": false\n}',
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
                                ["`game`", "Game identifier"],
                                ["`players`", "Array of player usernames"],
                                ["`board`", "3x3 array representing the game board"],
                                ["`current_turn`", "Username of the player whose turn it is"],
                                ["`status`", "Game status (`waiting`, `in_progress`, `finished`)"],
                                ["`private`", "Whether the game is private"],
                                ["`created_at`", "Game creation timestamp"],
                            ],
                            kind: "definition",
                        },
                    ],
                    fr: [
                        {
                            type: "table",
                            head: ["Champ", "Description"],
                            rows: [
                                ["`id`", "Identifiant de la partie"],
                                ["`moves`", "Tableau des coups joués"],
                                ["`players`", "Tableau des noms d'utilisateur des joueurs"],
                                ["`turn`", "Nom d'utilisateur du joueur dont c'est le tour"],
                                [
                                    "`status`",
                                    "Statut de la partie (`waiting`, `ready`, `finished`)",
                                ],
                                ["`private`", "Si la partie est privée"],
                            ],
                            kind: "definition",
                        },
                    ],
                },
            ],
        },
        {
            id: "valeurs-de-statut-de-partie",
            level: 2,
            title: { en: "", fr: "Valeurs de statut de partie" },
            only: "fr",
            blocks: [
                {
                    type: "table",
                    head: ["Statut", "Description"],
                    rows: [
                        ["`waiting`", "La partie a moins de 2 joueurs"],
                        ["`ready`", "La partie a 2 joueurs et est prête à être jouée"],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "reponse-de-partie-terminee",
            level: 2,
            title: { en: "", fr: "Réponse de partie terminée" },
            only: "fr",
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: '{\n  "id": "VWXYZ",\n  "moves": [...],\n  "players": ["Utilisateur1", "Utilisateur2"],\n  "turn": null,\n  "status": "finished",\n  "private": false,\n  "winner": "Utilisateur1",\n  "loser": "Utilisateur2",\n  "tie": false\n}',
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
                    ],
                },
                {
                    type: "split",
                    en: [],
                    fr: [
                        {
                            type: "p",
                            text: "Lorsqu'une nouvelle partie est créée, l'utilisateur est automatiquement ajouté à la liste des joueurs. Les parties privées ne sont pas visibles dans la liste publique des parties mais peuvent toujours être rejointes si vous connaissez l'ID de la partie.",
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
                    type: "list",
                    items: [
                        {
                            en: "[/v3/tic-tac-toe](ref:tic-tac-toe) - Main game endpoint for making moves",
                            fr: "[/v3/tic-tac-toe](ref:tic-tac-toe) - Endpoint principal du jeu pour effectuer des coups",
                        },
                        {
                            en: "[/v3/tic-tac-toe/list](ref:tic-tac-toe/list) - List all public games",
                            fr: "[/v3/tic-tac-toe/list](ref:tic-tac-toe/list) - Lister toutes les parties publiques",
                        },
                    ],
                },
            ],
        },
    ],
};
