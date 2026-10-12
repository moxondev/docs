# Online Tic-Tac-Toe

The `/tic-tac-toe` endpoint allows playing and storing an online Tic-Tac-Toe game. Games are stored for 1 hour and can be accessed via a unique identifier.

<Endpoint method="post" path="/tic-tac-toe" />

## Parameters

| Parameter  | Required | Description                                                                        |
| ---------- | -------- | ---------------------------------------------------------------------------------- |
| `username` | Yes      | The username making the move                                                       |
| `move`     | Yes      | The move played in `row-column` format (e.g., `1-1`, `2-2`, `3-3`)                 |
| `session`  | Yes      | The user's session identifier                                                      |
| `game`     | Yes      | The game identifier for connection. If the game does not exist, it will be created |

## Request Example

```bash
curl -X POST -d "username=User1&move=2-2&session=abc123&game=VWXYZ" "https://api.moxon.dev/v2/tic-tac-toe"
```

## Response

```json
{
    "message": "Move sent successfully"
}
```

## Error Handling

If a `username`, `move`, `session`, or `game` value is empty or invalid, if the game is full, if the same player plays twice in a row, or if the move has already been played, an error will be returned.

When a game is over, the request will return the winner and loser names, as well as whether there is a tie. The [/tic-tac-toe/fetch](/v2/en/tic-tac-toe/fetch) endpoint allows retrieving more information about the current game.
