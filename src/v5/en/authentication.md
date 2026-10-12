# Authentication

The moxon API uses Bearer token authentication to identify users with premium plans.

## Usage

To authenticate your requests, include your API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.moxon.dev/v5/infos
```

## Checking Your Plan

Use `GET /auth` to check which tier a token resolves to, along with its limits:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.moxon.dev/auth
```

```json
{
    "authenticated": true,
    "tier": "pro",
    "limits": {
        "hourly": 6000,
        "burst": 120
    }
}
```

Without a token, it returns the `default` tier instead of an error:

```json
{
    "authenticated": false,
    "tier": "default",
    "limits": {
        "hourly": 2000,
        "burst": 50
    }
}
```

An invalid token returns the same `401` shown below.

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

See the [Pricing](/v5/en/pricing) page for more details.

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

::: warning Note
If no token is provided, the request is treated as unauthenticated and uses the [Free](/v5/en/pricing#plans) tier limits (2,000 requests/hour).
:::

## Getting an API Key

To obtain an API key, purchase a plan on the [Pricing](/v5/en/pricing) page. Your unique token will be sent to your email after purchase.
