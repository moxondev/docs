# Online Tic-Tac-Toe

The `/tic-tac-toe` endpoints allow playing online Tic-Tac-Toe between two players. Games support both public and private modes. A game in progress is deleted after 1 hour without a move, and a finished game 10 minutes after it ends.

::: warning Changed in 6.0.0
`POST /tic-tac-toe` no longer exists in v6: it answers `404` (`Endpoint not available in v6.`). Each action has its own endpoint, listed below. To play a move, use [`POST /tic-tac-toe/play`](./tic-tac-toe/play) with the same JSON body (`username`, `move`, `session`, `game`).
:::

## Endpoints

- <Method type="post" sm /> [/v6/tic-tac-toe/fetch](./tic-tac-toe/fetch) - Create a game or retrieve its information
- <Method type="post" sm /> [/v6/tic-tac-toe/list](./tic-tac-toe/list) - List all public games
- <Method type="post" sm /> [/v6/tic-tac-toe/play](./tic-tac-toe/play) - Play a move
- <Method type="post" sm /> [/v6/tic-tac-toe/forfeit](./tic-tac-toe/forfeit) - Forfeit a game

## How a Game Works

1. Create a game with `/tic-tac-toe/fetch`, public by default or private with `private`. You can also play right away with `/tic-tac-toe/play`: if the `game` identifier does not exist, the game is created.
2. A second player joins the game with its identifier, through `/tic-tac-toe/fetch` or `/tic-tac-toe/play`. Public games are listed by `/tic-tac-toe/list`. A game accepts two players at most.
3. Players take turns with `/tic-tac-toe/play`.
4. The game ends when a player wins, when the board is full (tie), or when a player forfeits with `/tic-tac-toe/forfeit`.

## Move Format

The board is a 3x3 grid with positions numbered as follows:

```
1-1 | 1-2 | 1-3
----|-----|----
2-1 | 2-2 | 2-3
----|-----|----
3-1 | 3-2 | 3-3
```

## From v4 and v5

| Action                             | Version 4 and 5             | Version 6                   |
| ---------------------------------- | --------------------------- | --------------------------- |
| Play a move (`game` in the body)   | `POST /tic-tac-toe`         | `POST /tic-tac-toe/play`    |
| Play a move (`game` in the URL)    | `PATCH /tic-tac-toe/:game`  | `POST /tic-tac-toe/play`    |
| Forfeit a game (`game` in the URL) | `DELETE /tic-tac-toe/:game` | `POST /tic-tac-toe/forfeit` |

For `POST /tic-tac-toe`, only the path changes: the request body stays the same. For `PATCH` and `DELETE`, the `game` identifier moves from the URL to the JSON body.
