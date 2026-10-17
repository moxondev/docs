# Tic-Tac-Toe Play

The `/tic-tac-toe/play` endpoint plays a move in a game. If the `game` identifier does not exist, the game is created.

<Endpoint method="post" path="/tic-tac-toe/play" baseUrl="https://api.moxon.dev" />

::: warning Changed in 6.0.0
This endpoint moved from `PATCH` to `POST`, and its identifier left the URL: `game` is now sent in the JSON body. `PATCH` and `DELETE` no longer exist anywhere in the API.
:::

## Parameters

| Parameter  | Required | Description                                                                                                       |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `game`     | Yes      | The game identifier. If the game does not exist, it is created                                                    |
| `username` | Yes      | The username making the move                                                                                      |
| `move`     | Yes      | The move played in `row-column` format (e.g., `1-1`, `2-2`, `3-3`), see [Move Format](../tic-tac-toe#move-format) |
| `session`  | Yes      | The user's session identifier                                                                                     |

::: info Good to know
All parameters are sent as a JSON body with `Content-Type: application/json`.
:::

## Response Fields

| Field     | Type           | Description                              |
| --------- | -------------- | ---------------------------------------- |
| `message` | `string`       | Status message about the move            |
| `winner`  | `string\|null` | Username of the winner (if game is over) |
| `loser`   | `string\|null` | Username of the loser (if game is over)  |
| `tie`     | `boolean`      | Whether the game ended in a tie          |

While the game goes on, the response only contains `message` (`Move sent successfully`). The `winner`, `loser` and `tie` fields are only present when the move ends the game.

## Code Examples

<Examples method="post" path="/tic-tac-toe/play" :body="{ game: 'VWXYZ', username: 'alice', move: '1-1', session: 'abc123' }" />

## Try It

<Try name="Tic-Tac-Toe Play" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                                      | Description                         |
| ------------------------------------------------------------------ | ----------------------------------- |
| `Please provide a username (?username={username})`                 | The `username` parameter is missing |
| `Please provide a valid move (&move={move})`                       | The `move` parameter is missing     |
| `Please provide a valid session ID (&session={ID})`                | The `session` parameter is missing  |
| `Please provide a game ID (&game={ID})`                            | The `game` parameter is missing     |
| `Rate limit exceeded. Try again in X seconds.`                     | Per-user short-window limit         |
| `Invalid move. Please provide a valid move (e.g., 1-1, 2-2, 3-3).` | Invalid move format                 |
| `Game is full, you can only watch.`                                | Game already has two players        |
| `Please wait for the other player to make a move.`                 | Not your turn                       |
| `Move already made. Please choose a different move.`               | Cell already occupied               |
| `Session ID mismatch`                                              | Session doesn't match the player    |

## Related Endpoints

- [Online Tic-Tac-Toe](../tic-tac-toe) - How a game works and migrating from v4 and v5
- <Method type="post" sm /> [/v6/tic-tac-toe/forfeit](./forfeit) - Forfeit a game
- <Method type="post" sm /> [/v6/tic-tac-toe/fetch](./fetch) - Retrieve current game information
- <Method type="post" sm /> [/v6/tic-tac-toe/list](./list) - List all public games
