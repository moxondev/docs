# Online Chat

The `/chat` endpoint provides a real-time messaging system with support for public and private channels. Messages are stored for 1 hour.

<Endpoint method="post" path="/chat" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter  | Required | Description                                                                                             |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `username` | Yes      | The username of the user who sends the message                                                          |
| `message`  | Yes      | The message to send                                                                                     |
| `session`  | Yes      | The session ID of the user                                                                              |
| `token`    | No       | The key used to connect to a private chat. If not provided, the message will be sent to the global chat |

## Code Examples

<Examples method="post" path="/chat" :body="{ username: 'User3', message: 'How are you?', session: 'abc123' }" />

## Response Fields

| Field     | Type     | Description          |
| --------- | -------- | -------------------- |
| `message` | `string` | Confirmation message |

## Error Responses

| Error                                                 | Description                     |
| ----------------------------------------------------- | ------------------------------- |
| `Global rate limit exceeded.`                         | Global API rate limit reached   |
| `You have exceeded the limit of X requests per hour.` | Hourly IP/token limit reached   |
| `Rate limit exceeded. Try again in X seconds.`        | Per-user short-window limit     |
| `Session ID mismatch`                                 | Session does not match the user |

## Try It

<Try name="Chat (POST)" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                       | Description                                   |
| --------------------------------------------------- | --------------------------------------------- |
| `Please provide a username (?username={username})`  | The `username` parameter is missing           |
| `Please provide a message (&message={message})`     | The `message` parameter is missing            |
| `Please provide a valid session ID (&session={ID})` | The `session` parameter is missing or invalid |

## Related Endpoints

- <Method type="get" sm /> [/v6/chat](./chat/messages) - Retrieve all recent messages
- <Method type="post" sm /> [/v6/chat/private](./chat/private) - Create and manage private chat channels
- <Method type="delete" sm /> [/v6/chat/:token](./chat/clear) - Clear all messages from a private chat
