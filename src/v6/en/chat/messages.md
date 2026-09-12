# Chat Messages

The `/chat` endpoint retrieves all messages sent during the last hour. This endpoint does not require any options.

<Endpoint method="get" path="/chat" baseUrl="https://api.sylvain.sh" />

## Parameters

This endpoint does not require any parameters. It returns all messages from the last hour.

## Response Fields

| Field       | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `username`  | `string` | Username of the message sender    |
| `message`   | `string` | Content of the message            |
| `timestamp` | `string` | ISO 8601 timestamp of the message |

## Code Examples

<Examples method="get" path="/chat" />

## Try It

<Try name="Chat (GET)" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message        | Description                                 |
| -------------------- | ------------------------------------------- |
| `No messages stored` | No messages have been sent in the last hour |

## Related Endpoints

- <Method type="post" sm /> [/v6/chat](../chat) - Send a message
- <Method type="post" sm /> [/v6/chat/private](./private) - Create and manage private chat channels
- <Method type="delete" sm /> [/v6/chat/:token](./clear) - Clear all messages from a private chat
