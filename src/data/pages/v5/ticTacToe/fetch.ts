import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "tic-tac-toe/fetch",
    kind: "endpoint",
    title: { en: "Tic-Tac-Toe Fetch", fr: "Récupération du morpion" },
    lead: {
        en: "The `/tic-tac-toe/fetch` endpoint retrieves information about a current Tic-Tac-Toe game.",
        fr: "L'endpoint `/tic-tac-toe/fetch` permet de récupérer les informations d'une partie de morpion en cours. Vous pouvez utiliser l'identifiant de la partie en cours pour l'afficher ou créer une nouvelle partie si aucun ID n'est fourni.",
    },
    updated: "2026-05-25",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/tic-tac-toe/fetch",
            try: true,
            params: [
                {
                    name: "username",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "john",
                },
                {
                    name: "game",
                    type: "string",
                    in: "body",
                    required: false,
                    placeholder: "abc123",
                },
                {
                    name: "private",
                    type: "boolean",
                    in: "body",
                    required: false,
                    options: ["true", "false"],
                },
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
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [
                {
                    type: "examples",
                    op: "default",
                    body: {
                        en: { username: "User1", game: "VWXYZ" },
                        fr: { username: "Utilisateur1", game: "VWXYZ" },
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
                            name: "id",
                            type: "`string`",
                            description: { en: "Game identifier", fr: "Identifiant de la partie" },
                        },
                        {
                            name: "moves",
                            type: { en: "`array`", fr: "`object[]`" },
                            description: {
                                en: "Array of moves made in the game",
                                fr: "Tableau des coups joués",
                            },
                        },
                        {
                            name: "players",
                            type: "`string[]`",
                            description: {
                                en: "Array of player usernames",
                                fr: "Tableau des noms d'utilisateur des joueurs",
                            },
                        },
                        {
                            name: "turn",
                            type: "`string|null`",
                            description: {
                                en: "Username of the player whose turn it is",
                                fr: "Nom d'utilisateur du joueur dont c'est le tour",
                            },
                        },
                        {
                            name: "status",
                            type: "`string`",
                            description: {
                                en: "Game status (`waiting` or `ready`)",
                                fr: "Statut de la partie (`waiting`, `ready`)",
                            },
                        },
                        {
                            name: "private",
                            type: "`boolean`",
                            description: {
                                en: "Whether the game is private",
                                fr: "Si la partie est privée",
                            },
                        },
                        {
                            name: "winner",
                            type: "`string|null`",
                            description: {
                                en: "Username of the winner (if game is over)",
                                fr: "Nom d'utilisateur du gagnant (partie terminée)",
                            },
                        },
                        {
                            name: "loser",
                            type: "`string|null`",
                            description: {
                                en: "Username of the loser (if game is over)",
                                fr: "Nom d'utilisateur du perdant (partie terminée)",
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
                { type: "split", en: [{ type: "try", op: "default" }], fr: [] },
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
