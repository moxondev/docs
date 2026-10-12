# Tic-Tac-Toe Fetch

The `/tic-tac-toe/fetch` endpoint retrieves information about a current Tic-Tac-Toe game.

<Endpoint method="post" path="/tic-tac-toe/fetch" baseUrl="https://api.moxon.dev" />

## Parameters

| Parameter  | Required | Description                               |
| ---------- | -------- | ----------------------------------------- |
| `username` | Yes      | The username of the player                |
| `game`     | No       | The game identifier to fetch              |
| `private`  | No       | Set to `true` to fetch only private games |

## Code Examples

<Examples method="post" path="/tic-tac-toe/fetch" :body="{ username: 'User1', game: 'VWXYZ' }" />

## Response Fields

| Field     | Type           | Description                              |
| --------- | -------------- | ---------------------------------------- |
| `id`      | `string`       | Game identifier                          |
| `moves`   | `array`        | Array of moves made in the game          |
| `players` | `string[]`     | Array of player usernames                |
| `turn`    | `string\|null` | Username of the player whose turn it is  |
| `status`  | `string`       | Game status (`waiting` or `ready`)       |
| `private` | `boolean`      | Whether the game is private              |
| `winner`  | `string\|null` | Username of the winner (if game is over) |
| `loser`   | `string\|null` | Username of the loser (if game is over)  |
| `tie`     | `boolean`      | Whether the game ended in a tie          |

## Try It

<Try name="Tic-Tac-Toe Fetch" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                      | Description                         |
| -------------------------------------------------- | ----------------------------------- |
| `Please provide a username (?username={username})` | The `username` parameter is missing |

## Related Endpoints

- <Method type="post" sm /> [/v5/tic-tac-toe](../tic-tac-toe) - Main game endpoint for making moves
- <Method type="post" sm /> [/v5/tic-tac-toe/list](./list) - List all public games
