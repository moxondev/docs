# Tic-Tac-Toe Forfeit

The `/tic-tac-toe/:game` endpoint forfeits (abandons) a game.

<Endpoint method="delete" path="/tic-tac-toe/:game" baseUrl="https://api.moxon.dev" />

## Parameters

| Parameter  | Required | Description                         |
| ---------- | -------- | ----------------------------------- |
| `game`     | Yes      | The game identifier (URL parameter) |
| `username` | Yes      | The username forfeiting             |
| `session`  | Yes      | The user's session identifier       |

::: info Good to know
The `game` parameter is part of the URL path. The other parameters are sent as a JSON body with `Content-Type: application/json`.
:::

## Response Fields

| Field     | Type     | Description                        |
| --------- | -------- | ---------------------------------- |
| `message` | `string` | Confirmation of the forfeit        |
| `winner`  | `string` | Username of the winner (opponent)  |
| `loser`   | `string` | Username of the player who forfeit |

## Code Examples

<Examples method="delete" path="/tic-tac-toe/VWXYZ" :body="{ username: 'alice', session: 'abc123' }" />

## Try It

<Try method="delete" path="/tic-tac-toe/VWXYZ" :params="[{ name: 'username', required: true }, { name: 'session', required: true }]" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message         | Description                      |
| --------------------- | -------------------------------- |
| `Session ID mismatch` | Session doesn't match the player |

## Related Endpoints

- <Method type="post" sm /> [/v4/tic-tac-toe](../tic-tac-toe) - Main game endpoint for making moves
- <Method type="patch" sm /> [/v4/tic-tac-toe/:game](./play) - Play a move
- <Method type="post" sm /> [/v4/tic-tac-toe/fetch](./fetch) - Retrieve current game information
- <Method type="post" sm /> [/v4/tic-tac-toe/list](./list) - List all public games
