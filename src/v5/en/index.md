# Getting Started

<Banner />

Welcome to the **moxon API v5** documentation. This API provides a comprehensive collection of utility endpoints for developers.

## Base URL

All API requests should be made to:

```
https://api.sylvain.sh/v5
```

## Quick Example

<Try name="Infos" auto-send />

## Rate Limiting

Some endpoints have rate limiting to prevent abuse. If you exceed the [rate limit](/v5/en/pricing), you'll receive an error response:

```json
{
    "message": "Too Many Requests",
    "error": "You have exceeded the limit of 2000 requests per hour.",
    "status": "429"
}
```

Depending on the endpoint and limiter, the error message may also be:

- `Global rate limit exceeded.`
- `Rate limit exceeded. Try again in X seconds.`

## Error Handling

All endpoints return consistent error responses:

```json
{
    "message": "Bad Request",
    "error": "Description of the error",
    "status": "400"
}
```

Requesting an endpoint that doesn't exist also returns a structured JSON error:

```json
{
    "message": "Not Found",
    "error": "Endpoint '/v5/doesnotexist' does not exist.",
    "status": "404"
}
```

## Other Versions

- [v4 Documentation](/v4/en/) - Previous stable version
- [v3 Documentation](/v3/en/) - Legacy version
