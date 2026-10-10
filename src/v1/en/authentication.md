# Authentication

The moxon API uses Bearer token authentication to identify users with premium plans.

## Usage

To authenticate your requests, include your API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.sylvain.sh/v1/infos
```

## Rate Limits

| Plan     | Requests/hour |
| -------- | ------------- |
| Free     | 2,000         |
| Advanced | 3,500         |
| Pro      | 6,000         |
| Business | 10,000        |

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
