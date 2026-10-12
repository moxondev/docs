# API Information

The `/infos` endpoint provides general information about the [API](https://api.moxon.dev). This endpoint does not require any options.

<Endpoint method="get" path="/infos" />

## Request Example

```
GET /v2/infos
```

## Response

```json
{
    "endpoints": 17,
    "last_version": "v2",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/20syldev/api",
    "creation": "November 25th 2024"
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v2/infos"
```
