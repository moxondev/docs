# Tic-Tac-Toe Fetch

The `/tic-tac-toe/fetch` endpoint retrieves information about a current Tic-Tac-Toe game.

<Endpoint method="post" path="/tic-tac-toe/fetch" />

## Parameters

| Parameter  | Required | Description                               |
| ---------- | -------- | ----------------------------------------- |
| `username` | Yes      | The username of the player                |
| `game`     | No       | The game identifier to fetch              |
| `private`  | No       | Set to `true` to fetch only private games |

## Request Example

```bash
curl -X POST -d "username=User1&game=VWXYZ" "https://api.moxon.dev/v3/tic-tac-toe/fetch"
```

## Response

```json
{
    "game": "VWXYZ",
    "players": ["User1", "User2"],
    "board": [
        ["X", "", "O"],
        ["", "X", ""],
        ["O", "", ""]
    ],
    "current_turn": "User2",
    "status": "in_progress",
    "private": false,
    "created_at": "2025-01-21T10:30:00.000Z"
}
```

## Response Fields

| Field          | Description                                        |
| -------------- | -------------------------------------------------- |
| `game`         | Game identifier                                    |
| `players`      | Array of player usernames                          |
| `board`        | 3x3 array representing the game board              |
| `current_turn` | Username of the player whose turn it is            |
| `status`       | Game status (`waiting`, `in_progress`, `finished`) |
| `private`      | Whether the game is private                        |
| `created_at`   | Game creation timestamp                            |

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                      | Description                         |
| -------------------------------------------------- | ----------------------------------- |
| `Please provide a username (?username={username})` | The `username` parameter is missing |

## Related Endpoints

- [/v3/tic-tac-toe](../tic-tac-toe) - Main game endpoint for making moves
- [/v3/tic-tac-toe/list](./list) - List all public games
