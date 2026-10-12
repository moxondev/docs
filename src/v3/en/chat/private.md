# Private Chat

The `/chat/private` endpoint retrieves all messages sent during the last hour, belonging to a private chat.

<Endpoint method="post" path="/chat/private" />

## Parameters

| Parameter  | Required | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| `username` | Yes      | The username of the user who sends the message      |
| `token`    | Yes      | The key used to connect to the desired private chat |

## Request Example

```bash
curl -X POST -d "username=User3&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v3/chat/private"
```

## Response

```json
[
    {
        "username": "User1",
        "message": "Hi!",
        "timestamp": "2025-01-21T08:27:11.068Z"
    },
    {
        "username": "User3",
        "message": "How are you?",
        "timestamp": "2025-01-21T08:28:43.070Z"
    }
]
```

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                      | Description                                 |
| -------------------------------------------------- | ------------------------------------------- |
| `Please provide a username (?username={username})` | The `username` parameter is missing         |
| `Please provide a valid token (&token={key}).`     | The `token` parameter is missing or invalid |

## Related Endpoints

- [/v3/chat](../chat) - Main chat endpoint for sending and receiving messages
