# Tic-Tac-Toe Fetch

The `/tic-tac-toe/fetch` endpoint allows you to retrieve an ongoing Tic-Tac-Toe game. You can use the current game ID to display it.

<Endpoint method="post" path="/tic-tac-toe/fetch" />

## Parameters

| Parameter  | Required | Description                                                                     |
| ---------- | -------- | ------------------------------------------------------------------------------- |
| `username` | Yes      | The username making the request                                                 |
| `game`     | No       | The ID of the game to display. If not provided, a new game ID will be generated |

## Request Example

```bash
curl -X POST -d "username=User1&game=VWXYZ" "https://api.moxon.dev/v2/tic-tac-toe/fetch"
```

## Response

```json
{
    "id": "VWXYZ",
    "moves": [
        {
            "username": "User1",
            "move": "2-2",
            "session": "abc123"
        },
        {
            "username": "User2",
            "move": "1-3",
            "session": "def456"
        },
        {
            "username": "User1",
            "move": "1-2",
            "session": "abc123"
        },
        {
            "username": "User2",
            "move": "2-3",
            "session": "def456"
        }
    ],
    "players": ["user1", "user2"],
    "turn": "user1",
    "status": "ready",
    "winner": null,
    "loser": null,
    "tie": false
}
```

## Error Handling

If the `username` value is empty, an error will be returned. When the game is created, a session ID is generated and returned in the response. You can use this session ID to make moves in the game. If the game is over, the winner and loser will be included in the response.
