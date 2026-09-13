# Tic-Tac-Toe Forfeit

The `/tic-tac-toe/forfeit` endpoint forfeits (abandons) a game.

<Endpoint method="post" path="/tic-tac-toe/forfeit" baseUrl="https://api.sylvain.sh" />

::: warning Changed in 6.0.0
This endpoint moved from `DELETE` to `POST`, and its identifier left the URL: `game` is now sent in the JSON body. `PATCH` and `DELETE` no longer exist anywhere in the API.
:::

## Parameters

| Parameter  | Required | Description                   |
| ---------- | -------- | ----------------------------- |
| `game`     | Yes      | The game identifier           |
| `username` | Yes      | The username forfeiting       |
| `session`  | Yes      | The user's session identifier |

::: info Good to know
All parameters are sent as a JSON body with `Content-Type: application/json`.
:::

## Response Fields

| Field     | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `message` | `string` | Confirmation of the forfeit        |
| `winner`  | `string` | Username of the winner (opponent)  |
| `loser`   | `string` | Username of the player who forfeit |

## Code Examples

<Examples method="post" path="/tic-tac-toe/forfeit" :body="{ game: 'VWXYZ', username: 'alice', session: 'abc123' }" />

## Try It

<Try name="Tic-Tac-Toe Forfeit" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message         | Description                      |
| --------------------- | -------------------------------- |
| `Session ID mismatch` | Session doesn't match the player |

## Related Endpoints

- <Method type="post" sm /> [/v6/tic-tac-toe](../tic-tac-toe) - Main game endpoint for making moves
- <Method type="post" sm /> [/v6/tic-tac-toe/play](./play) - Play a move
- <Method type="post" sm /> [/v6/tic-tac-toe/fetch](./fetch) - Retrieve current game information
- <Method type="post" sm /> [/v6/tic-tac-toe/list](./list) - List all public games
