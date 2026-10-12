# Chat Clear

The `/chat/:token` endpoint clears all messages from a private chat.

<Endpoint method="delete" path="/chat/:token" baseUrl="https://api.moxon.dev" />

## Parameters

| Parameter  | Required | Description                            |
| ---------- | -------- | -------------------------------------- |
| `token`    | Yes      | The private chat token (URL parameter) |
| `username` | Yes      | The username                           |
| `session`  | Yes      | The user's session identifier          |

::: info Good to know
The `token` parameter is part of the URL path. The other parameters are sent as a JSON body with `Content-Type: application/json`.
:::

## Response Fields

| Field     | Type     | Description          |
| --------- | -------- | -------------------- |
| `message` | `string` | Confirmation message |

## Code Examples

<Examples method="delete" path="/chat/41a43360-9874-4c7a-9ca8-eec29e765a0e" :body="{ username: 'alice', session: 'abc123' }" />

## Try It

<Try method="delete" path="/chat/41a43360-9874-4c7a-9ca8-eec29e765a0e" :params="[{ name: 'username', required: true }, { name: 'session', required: true }]" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message              | Description                         |
| -------------------------- | ----------------------------------- |
| `Invalid or expired token` | The token is invalid or has expired |
| `Session ID mismatch`      | Session does not match the user     |
| `Rate limit exceeded`      | Too many requests in a short period |

## Related Endpoints

- <Method type="post" sm /> [/v4/chat](../chat) - Send a message
- <Method type="get" sm /> [/v4/chat](./messages) - Retrieve all recent messages
- <Method type="post" sm /> [/v4/chat/private](./private) - Create and manage private chat channels
