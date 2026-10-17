# Tic-Tac-Toe Fetch

The `/tic-tac-toe/fetch` endpoint retrieves information about a Tic-Tac-Toe game. You can use the identifier of a game in progress to display it, or create a new game if no ID is provided.

<Endpoint method="post" path="/tic-tac-toe/fetch" baseUrl="https://api.moxon.dev" />

## Parameters

| Parameter  | Required | Description                                                                                                        |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `username` | Yes      | The username of the player                                                                                         |
| `game`     | No       | The identifier of the game to display. If it is not provided, a new game identifier is generated                   |
| `private`  | No       | JSON boolean: `true` to create a private game (default: `false`). Only taken into account when the game is created |

## Code Examples

<Examples method="post" path="/tic-tac-toe/fetch" :body="{ username: 'User1', game: 'VWXYZ' }" />

## Response Fields

| Field     | Type           | Description                              |
| --------- | -------------- | ---------------------------------------- |
| `id`      | `string`       | Game identifier                          |
| `moves`   | `object[]`     | Array of moves made in the game          |
| `players` | `string[]`     | Array of player usernames                |
| `turn`    | `string\|null` | Username of the player whose turn it is  |
| `status`  | `string`       | Game status (`waiting` or `ready`)       |
| `private` | `boolean`      | Whether the game is private              |
| `winner`  | `string\|null` | Username of the winner (if game is over) |
| `loser`   | `string\|null` | Username of the loser (if game is over)  |
| `tie`     | `boolean`      | Whether the game ended in a tie          |

## Game Statuses

| Status    | Description                                      |
| --------- | ------------------------------------------------ |
| `waiting` | The game has fewer than 2 players                |
| `ready`   | The game has 2 players and is ready to be played |

## Try It

<Try name="Tic-Tac-Toe Fetch" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                      | Description                         |
| -------------------------------------------------- | ----------------------------------- |
| `Please provide a username (?username={username})` | The `username` parameter is missing |

When a new game is created, the user is automatically added to the list of players. Private games are not shown in the public game list but can still be joined if you know the game ID.

## Related Endpoints

- [Online Tic-Tac-Toe](../tic-tac-toe) - How a game works and migrating from v4 and v5
- <Method type="post" sm /> [/v6/tic-tac-toe/list](./list) - List all public games
