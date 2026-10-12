# Chat Clear

The `/chat/clear` endpoint clears all messages from a private chat.

<Endpoint method="post" path="/chat/clear" baseUrl="https://api.moxon.dev" />

::: warning Changed in 6.0.0
This endpoint moved from `DELETE` to `POST`, and its identifier left the URL: `token` is now sent in the JSON body. `PATCH` and `DELETE` no longer exist anywhere in the API.
:::

## Parameters

| Parameter  | Required | Description                   |
| ---------- | -------- | ----------------------------- |
| `token`    | Yes      | The private chat token        |
| `username` | Yes      | The username                  |
| `session`  | Yes      | The user's session identifier |

::: info Good to know
All parameters are sent as a JSON body with `Content-Type: application/json`.
:::

## Response Fields

| Field     | Type     | Description          |
| --------- | -------- | -------------------- |
| `message` | `string` | Confirmation message |

## Code Examples

<Examples method="post" path="/chat/clear" :body="{ token: '41a43360-9874-4c7a-9ca8-eec29e765a0e', username: 'alice', session: 'abc123' }" />

## Try It

<Try name="Chat Clear" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message              | Description                         |
| -------------------------- | ----------------------------------- |
| `Invalid or expired token` | The token is invalid or has expired |
| `Session ID mismatch`      | Session does not match the user     |
| `Rate limit exceeded`      | Too many requests in a short period |

## Related Endpoints

- <Method type="post" sm /> [/v6/chat](../chat) - Send a message
- <Method type="get" sm /> [/v6/chat](./messages) - Retrieve all recent messages
- <Method type="post" sm /> [/v6/chat/private](./private) - Create and manage private chat channels
