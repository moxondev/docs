import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "tic-tac-toe",
    kind: "article",
    title: { en: "Online Tic-Tac-Toe", fr: "Morpion en ligne" },
    lead: {
        en: "The `/tic-tac-toe` endpoints allow playing online Tic-Tac-Toe between two players. Games support both public and private modes. A game in progress is deleted after 1 hour without a move, and a finished game 10 minutes after it ends.",
        fr: "Les endpoints `/tic-tac-toe` permettent de jouer au morpion en ligne à deux joueurs. Les parties supportent les modes public et privé. Une partie en cours est supprimée après 1 heure sans coup, et une partie terminée 10 minutes après sa fin.",
    },
    updated: "2026-10-17",
    sections: [
        {
            id: "",
            blocks: [
                {
                    type: "callout",
                    kind: "warning",
                    title: { en: "Changed in 6.0.0", fr: "Changement en 6.0.0" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "`POST /tic-tac-toe` no longer exists in v6: it answers `404` (`Endpoint not available in v6.`). Each action has its own endpoint, listed below. To play a move, use [`POST /tic-tac-toe/play`](ref:tic-tac-toe/play) with the same JSON body (`username`, `move`, `session`, `game`).",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "`POST /tic-tac-toe` n'existe plus en v6 : il répond `404` (`Endpoint not available in v6.`). Chaque action a son propre endpoint, listé ci-dessous. Pour jouer un coup, utilisez [`POST /tic-tac-toe/play`](ref:tic-tac-toe/play) avec le même corps JSON (`username`, `move`, `session`, `game`).",
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: "endpoints",
            level: 2,
            title: { en: "Endpoints", fr: "Endpoints" },
            blocks: [
                {
                    type: "related",
                    items: [
                        {
                            label: "/v6/tic-tac-toe/fetch",
                            to: "tic-tac-toe/fetch",
                            description: {
                                en: "Create a game or retrieve its information",
                                fr: "Créer une partie ou récupérer ses informations",
                            },
                        },
                        {
                            label: "/v6/tic-tac-toe/list",
                            to: "tic-tac-toe/list",
                            description: {
                                en: "List all public games",
                                fr: "Lister toutes les parties publiques",
                            },
                        },
                        {
                            label: "/v6/tic-tac-toe/play",
                            to: "tic-tac-toe/play",
                            description: { en: "Play a move", fr: "Jouer un coup" },
                        },
                        {
                            label: "/v6/tic-tac-toe/forfeit",
                            to: "tic-tac-toe/forfeit",
                            description: { en: "Forfeit a game", fr: "Abandonner une partie" },
                        },
                    ],
                },
            ],
        },
        {
            id: "how-a-game-works",
            level: 2,
            title: { en: "How a Game Works", fr: "Déroulement d'une partie" },
            aliases: ["deroulement-d-une-partie"],
            blocks: [
                {
                    type: "list",
                    ordered: true,
                    items: [
                        {
                            en: "Create a game with `/tic-tac-toe/fetch`, public by default or private with `private`. You can also play right away with `/tic-tac-toe/play`: if the `game` identifier does not exist, the game is created.",
                            fr: "Créez une partie avec `/tic-tac-toe/fetch`, publique par défaut ou privée avec `private`. Vous pouvez aussi jouer directement avec `/tic-tac-toe/play` : si l'identifiant `game` n'existe pas, la partie est créée.",
                        },
                        {
                            en: "A second player joins the game with its identifier, through `/tic-tac-toe/fetch` or `/tic-tac-toe/play`. Public games are listed by `/tic-tac-toe/list`. A game accepts two players at most.",
                            fr: "Un second joueur rejoint la partie avec son identifiant, via `/tic-tac-toe/fetch` ou `/tic-tac-toe/play`. Les parties publiques sont listées par `/tic-tac-toe/list`. Une partie accepte deux joueurs au maximum.",
                        },
                        {
                            en: "Players take turns with `/tic-tac-toe/play`.",
                            fr: "Les joueurs jouent chacun leur tour avec `/tic-tac-toe/play`.",
                        },
                        {
                            en: "The game ends when a player wins, when the board is full (tie), or when a player forfeits with `/tic-tac-toe/forfeit`.",
                            fr: "La partie prend fin lorsqu'un joueur gagne, que la grille est pleine (égalité) ou qu'un joueur abandonne avec `/tic-tac-toe/forfeit`.",
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
            id: "from-v4-and-v5",
            level: 2,
            title: { en: "From v4 and v5", fr: "Depuis la v4 et la v5" },
            aliases: ["depuis-la-v4-et-la-v5"],
            blocks: [
                {
                    type: "table",
                    head: {
                        en: ["Action", "Version 4 and 5", "Version 6"],
                        fr: ["Action", "Version 4 et 5", "Version 6"],
                    },
                    rows: [
                        [
                            {
                                en: "Play a move (`game` in the body)",
                                fr: "Jouer un coup (`game` dans le corps)",
                            },
                            "`POST /tic-tac-toe`",
                            "`POST /tic-tac-toe/play`",
                        ],
                        [
                            {
                                en: "Play a move (`game` in the URL)",
                                fr: "Jouer un coup (`game` dans l'URL)",
                            },
                            "`PATCH /tic-tac-toe/:game`",
                            "`POST /tic-tac-toe/play`",
                        ],
                        [
                            {
                                en: "Forfeit a game (`game` in the URL)",
                                fr: "Abandonner une partie (`game` dans l'URL)",
                            },
                            "`DELETE /tic-tac-toe/:game`",
                            "`POST /tic-tac-toe/forfeit`",
                        ],
                    ],
                    kind: "matrix",
                },
                {
                    type: "p",
                    text: {
                        en: "For `POST /tic-tac-toe`, only the path changes: the request body stays the same. For `PATCH` and `DELETE`, the `game` identifier moves from the URL to the JSON body.",
                        fr: "Pour `POST /tic-tac-toe`, seul le chemin change : le corps de la requête reste le même. Pour `PATCH` et `DELETE`, l'identifiant `game` passe de l'URL au corps JSON.",
                    },
                },
            ],
        },
    ],
};
