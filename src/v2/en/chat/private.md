# Private Chats

The `/chat/private` endpoint retrieves all messages sent during the last hour, belonging to a private chat.

<Endpoint method="post" path="/chat/private" />

## Parameters

| Parameter  | Required | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| `username` | Yes      | The username of the user who sends the message      |
| `token`    | Yes      | The key used to connect to the desired private chat |

## Request Example

```bash
curl -X POST -d "username=User3&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v2/chat/private"
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
    },
    {
        "username": "User8",
        "message": "Yeah great, and you?",
        "timestamp": "2025-01-21T08:32:07.215Z"
    }
]
```

## Error Handling

If the value of `username` or `token` is empty, the token is invalid or the chat doesn't exist, an error will be returned.
