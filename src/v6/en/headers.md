# Headers Inspector

The `/headers` endpoint returns the HTTP headers sent by the client. It is useful for debugging proxies, CORS configurations, and request pipelines. Sensitive headers are automatically redacted.

<Endpoint method="get" path="/headers" baseUrl="https://api.sylvain.sh" />

::: tip Use Cases
Inspect what headers your client sends to the server, debug reverse proxy configurations, verify CORS headers, or check if authentication headers are being forwarded correctly.
:::

## Parameters

| Parameter | Required | Description                                                                     |
| --------- | -------- | ------------------------------------------------------------------------------- |
| `filter`  | No       | Comma-separated list of header names to return. Returns all headers if omitted. |

## Redacted Headers

The following headers are always returned as `[redacted]` to prevent sensitive data exposure:

| Header                |
| --------------------- |
| `authorization`       |
| `cookie`              |
| `set-cookie`          |
| `proxy-authorization` |

## Response Fields

| Field     | Type     | Description                                                |
| --------- | -------- | ---------------------------------------------------------- |
| `count`   | `number` | Number of headers returned                                 |
| `headers` | `object` | Key-value map of request headers (sensitive ones redacted) |
| `ip`      | `string` | Client IP address                                          |
| `method`  | `string` | HTTP method of the request                                 |
| `url`     | `string` | Full request URL                                           |

## Code Examples

<Examples method="get" path="/headers" />

## Try It

<Try name="Headers" />

::: info Note
This endpoint does not throw errors for invalid filter names — unknown names simply return no matching headers.
:::
