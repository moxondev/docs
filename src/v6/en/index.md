# Getting Started

<Banner />

Welcome to the **moxon API v6** documentation. This API provides a comprehensive collection of utility endpoints for developers.

## Base URL

All API requests should be made to:

```
https://api.sylvain.sh/v6
```

## Quick Example

<Try name="Infos" auto-send />

## Rate Limiting

Some endpoints have rate limiting to prevent abuse. If you exceed the [rate limit](/v6/en/pricing), you'll receive an error response:

```json
{
    "message": "Too Many Requests",
    "error": "You have exceeded the limit of 2000 requests per hour.",
    "status": 429
}
```

Depending on the endpoint and limiter, the error message may also be:

- `Global rate limit exceeded.`
- `Rate limit exceeded. Try again in X seconds.`

## Error Handling

::: warning Changed in 6.0.0
`status` is now a **number**. It used to be a string (`"400"`), it is now `400`. A client comparing it to a string will stop matching.
:::

All endpoints return consistent error responses:

```json
{
    "message": "Bad Request",
    "error": "Description of the error",
    "status": 400
}
```

Requesting an endpoint that doesn't exist also returns a structured JSON error:

```json
{
    "message": "Not Found",
    "error": "Endpoint '/v6/doesnotexist' does not exist.",
    "status": 404
}
```

## Other Versions

- [v5 Documentation](/v5/en/) - Previous stable version
- [v4 Documentation](/v4/en/) - Legacy version
