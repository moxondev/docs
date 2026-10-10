# Authentication

The moxon API uses Bearer token authentication to identify users with premium plans.

## Usage

To authenticate your requests, include your API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.sylvain.sh/v4/infos
```

## Rate Limits

| Plan     | Requests/hour | Burst/10s |
| -------- | ------------- | --------- |
| Free     | 2,000         | 50        |
| Advanced | 3,500         | 80        |
| Pro      | 6,000         | 120       |
| Business | 10,000        | 200       |

::: tip Burst Limit
The burst limit prevents sending too many requests in a short window. If you exceed the burst limit, you will receive a `429 Too Many Requests` response.
:::

See the [Pricing](/v4/en/pricing) page for more details.

## Error Responses

### Invalid Token

If the provided token is incorrect or expired:

```json
{
    "message": "Unauthorized",
    "error": "Invalid token.",
    "status": "401"
}
```

### No Token

If no token is provided, the request uses the FREE tier limits (2,000 requests/hour).

## Getting an API Key

To obtain an API key, purchase a plan on the [Pricing](/v4/en/pricing) page. Your unique token will be sent to your email after purchase.
