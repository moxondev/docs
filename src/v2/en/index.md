# Getting Started

<Banner />

Welcome to the **moxon API v2** documentation. This is an older version of the API, kept for compatibility.

## Base URL

All API requests should be made to:

```
https://api.moxon.dev/v2
```

## Quick Example

```bash
curl -X GET "https://api.moxon.dev/v2/infos"
```

```json
{
    "endpoints": 17,
    "last_version": "v2",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/moxondev/api",
    "creation": "November 25th 2024"
}
```

## Rate Limiting

Some endpoints have rate limiting to prevent abuse. If you exceed the [rate limit](/v3/en/pricing), you'll receive an error response:

```json
{
    "error": "Rate limit exceeded. Try again in X seconds."
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
    "error": "Description of the error"
}
```

## Other Versions

- [v4 Documentation](/v4/en/) - Latest version (recommended)
- [v3 Documentation](/v3/en/) - Previous stable version
- [v1 Documentation](/v1/en/) - Legacy version
