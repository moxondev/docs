# Online Tic-Tac-Toe

The `/tic-tac-toe` endpoint allows playing and storing an online Tic-Tac-Toe game. Games are stored for 1 hour and support both public and private modes.

<Endpoint method="post" path="/tic-tac-toe" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter  | Required | Description                                                                        |
| ---------- | -------- | ---------------------------------------------------------------------------------- |
| `username` | Yes      | The username making the move                                                       |
| `move`     | Yes      | The move played in `row-column` format (e.g., `1-1`, `2-2`, `3-3`)                 |
| `session`  | Yes      | The user's session identifier                                                      |
| `game`     | Yes      | The game identifier for connection. If the game does not exist, it will be created |

## Move Format

The board is a 3x3 grid with positions numbered as follows:

```
1-1 | 1-2 | 1-3
----|-----|----
2-1 | 2-2 | 2-3
----|-----|----
3-1 | 3-2 | 3-3
```

## Code Examples

<Examples method="post" path="/tic-tac-toe" :body="{ username: 'User1', move: '2-2', session: 'abc123', game: 'VWXYZ' }" />

## Response Fields

| Field     | Type           | Description                              |
| --------- | -------------- | ---------------------------------------- |
| `message` | `string`       | Status message about the move            |
| `winner`  | `string\|null` | Username of the winner (if game is over) |
| `loser`   | `string\|null` | Username of the loser (if game is over)  |
| `tie`     | `boolean`      | Whether the game ended in a tie          |

## Error Responses

| Error                                                              | Description                      |
| ------------------------------------------------------------------ | -------------------------------- |
| `Global rate limit exceeded.`                                      | Global API rate limit reached    |
| `You have exceeded the limit of X requests per hour.`              | Hourly IP/token limit reached    |
| `Rate limit exceeded. Try again in X seconds.`                     | Per-user short-window limit      |
| `Invalid move. Please provide a valid move (e.g., 1-1, 2-2, 3-3).` | Invalid move format              |
| `Game is full, you can only watch.`                                | Game already has two players     |
| `Please wait for the other player to make a move.`                 | Not your turn                    |
| `Move already made. Please choose a different move.`               | Cell already occupied            |
| `Session ID mismatch`                                              | Session doesn't match the player |

## Try It

<Try name="Tic-Tac-Toe" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                       | Description                                   |
| --------------------------------------------------- | --------------------------------------------- |
| `Please provide a username (?username={username})`  | The `username` parameter is missing           |
| `Please provide a valid move (&move={move})`        | The `move` parameter is missing or invalid    |
| `Please provide a valid session ID (&session={ID})` | The `session` parameter is missing or invalid |
| `Please provide a valid game ID (&game={ID})`       | The `game` parameter is missing or invalid    |

When a game is over, the request will return the winner and loser names, as well as whether there is a tie.

## Related Endpoints

- <Method type="post" sm /> [/v6/tic-tac-toe/fetch](./tic-tac-toe/fetch) - Retrieve current game information
- <Method type="post" sm /> [/v6/tic-tac-toe/list](./tic-tac-toe/list) - List all public games
- <Method type="post" sm /> [/v6/tic-tac-toe/play](./tic-tac-toe/play) - Play a move
- <Method type="post" sm /> [/v6/tic-tac-toe/forfeit](./tic-tac-toe/forfeit) - Forfeit a game
