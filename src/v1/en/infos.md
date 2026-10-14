# API Information

The `/infos` endpoint provides general information about the [API](https://api.moxon.dev). This endpoint does not require any options.

<Endpoint method="get" path="/infos" />

## Request Example

```
GET /v1/infos
```

## Response

```json
{
    "endpoints": 11,
    "last_version": "v1",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/moxondev/api",
    "creation": "November 25th 2024"
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v1/infos"
```
