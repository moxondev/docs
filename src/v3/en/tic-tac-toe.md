# Online Tic-Tac-Toe

The `/tic-tac-toe` endpoint allows playing and storing an online Tic-Tac-Toe game. Games are stored for 1 hour and support both public and private modes.

<Endpoint method="post" path="/tic-tac-toe" />

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

## Request Example

```bash
curl -X POST -d "username=User1&move=2-2&session=abc123&game=VWXYZ" "https://api.moxon.dev/v3/tic-tac-toe"
```

## Response

### Move Success

```json
{
    "message": "Move sent successfully"
}
```

### Game Win

```json
{
    "message": "Move sent successfully. User1 wins. User2 loses.",
    "winner": "User1",
    "loser": "User2",
    "tie": false
}
```

### Game Tie

```json
{
    "message": "Game over. It's a tie!",
    "winner": null,
    "loser": null,
    "tie": true
}
```

## Error Responses

| Error                                                              | Description                      |
| ------------------------------------------------------------------ | -------------------------------- |
| `Rate limit exceeded. Try again in X seconds.`                     | Too many requests                |
| `Invalid move. Please provide a valid move (e.g., 1-1, 2-2, 3-3).` | Invalid move format              |
| `Game is full, you can only watch.`                                | Game already has two players     |
| `Please wait for the other player to make a move.`                 | Not your turn                    |
| `Move already made. Please choose a different move.`               | Cell already occupied            |
| `Session ID mismatch`                                              | Session doesn't match the player |

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

- [/v3/tic-tac-toe/fetch](./tic-tac-toe/fetch) - Retrieve current game information
- [/v3/tic-tac-toe/list](./tic-tac-toe/list) - List all public games in progress
