# Tic-Tac-Toe List

The `/tic-tac-toe/list` endpoint lists all public games currently in progress.

<Endpoint method="post" path="/tic-tac-toe/list" />

## Parameters

This endpoint does not require any parameters.

## Request Example

```bash
curl -X POST "https://api.moxon.dev/v3/tic-tac-toe/list"
```

## Response

```json
{
    "games": [
        {
            "game": "VWXYZ",
            "players": ["User1", "User2"],
            "status": "in_progress",
            "created_at": "2025-01-21T10:30:00.000Z"
        },
        {
            "game": "ABCDE",
            "players": ["User3"],
            "status": "waiting",
            "created_at": "2025-01-21T10:35:00.000Z"
        }
    ],
    "total": 2
}
```

## Response Fields

| Field                | Description                            |
| -------------------- | -------------------------------------- |
| `games`              | Array of public game objects           |
| `games[].game`       | Game identifier                        |
| `games[].players`    | Array of player usernames              |
| `games[].status`     | Game status (`waiting`, `in_progress`) |
| `games[].created_at` | Game creation timestamp                |
| `total`              | Total number of public games           |

## Game Statuses

| Status        | Description                               |
| ------------- | ----------------------------------------- |
| `waiting`     | Game has one player, waiting for opponent |
| `in_progress` | Game has two players and is active        |

## Error Handling

This endpoint does not require parameters and will not return parameter-related errors.

## Related Endpoints

- [/v3/tic-tac-toe](../tic-tac-toe) - Main game endpoint for making moves
- [/v3/tic-tac-toe/fetch](./fetch) - Fetch specific game details
