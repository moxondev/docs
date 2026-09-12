# Username Generation

The `/username` endpoint generates random usernames. This endpoint is useful for creating placeholder usernames or suggesting names to users.

<Endpoint method="get" path="/username" baseUrl="https://api.sylvain.sh" />

## Parameters

This endpoint does not require any parameters. It returns a randomly generated username using an adjective + animal pattern.

## Response Fields

| Field       | Type     | Description                             |
| ----------- | -------- | --------------------------------------- |
| `username`  | `string` | A randomly generated username           |
| `number`    | `number` | A random number used in generation      |
| `adjective` | `string` | The adjective component of the username |
| `animal`    | `string` | The animal component of the username    |
| `job`       | `string` | A randomly associated job               |

## Code Examples

<Examples method="get" path="/username" />

## Try It

<Try name="Username" />
