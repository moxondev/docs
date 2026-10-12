# API Information

The `/infos` endpoint provides general information about the [API](https://api.moxon.dev). This endpoint does not require any options.

<Endpoint method="get" path="/infos" />

## Parameters

This endpoint does not require any parameters.

## Request Example

```
GET /v3/infos
```

## Response

```json
{
    "endpoints": 20,
    "last_version": "v3",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/20syldev/api",
    "creation": "November 25th 2024"
}
```

## Response Fields

| Field           | Description                         |
| --------------- | ----------------------------------- |
| `endpoints`     | Total number of available endpoints |
| `last_version`  | Current API version                 |
| `documentation` | Documentation URL                   |
| `github`        | GitHub repository URL               |
| `creation`      | API creation date                   |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/infos"
```
