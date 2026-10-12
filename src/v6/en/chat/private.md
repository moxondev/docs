# Private Chat

The `/chat/private` endpoint retrieves all messages sent during the last hour, belonging to a private chat.

<Endpoint method="post" path="/chat/private" baseUrl="https://api.moxon.dev" />

## Parameters

| Parameter  | Required | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| `username` | Yes      | The username of the user who sends the message      |
| `token`    | Yes      | The key used to connect to the desired private chat |

## Code Examples

<Examples method="post" path="/chat/private" :body="{ username: 'User3', token: '41a43360-9874-4c7a-9ca8-eec29e765a0e' }" />

## Response Fields

| Field       | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `username`  | `string` | Username of the message sender    |
| `message`   | `string` | Content of the message            |
| `timestamp` | `string` | ISO 8601 timestamp of the message |

## Try It

<Try name="Chat Private" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                      | Description                                 |
| -------------------------------------------------- | ------------------------------------------- |
| `Please provide a username (?username={username})` | The `username` parameter is missing         |
| `Please provide a valid token (&token={key}).`     | The `token` parameter is missing or invalid |
| `Invalid or expired token`                         | The token is invalid or has expired         |
| `Rate limit exceeded`                              | Too many requests in a short period         |

## Related Endpoints

- <Method type="post" sm /> [/v6/chat](../chat) - Send a message
- <Method type="get" sm /> [/v6/chat](./messages) - Retrieve all recent messages
- <Method type="post" sm /> [/v6/chat/clear](./clear) - Clear all messages from a private chat
