# Getting Started

<Banner />

Welcome to the **moxon API v1** documentation. This is the legacy version of the API.

## Base URL

All API requests should be made to:

```
https://api.sylvain.sh/v1
```

## Quick Example

```bash
curl -X GET "https://api.sylvain.sh/v1/infos"
```

```json
{
    "endpoints": 11,
    "last_version": "v1",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/20syldev/api",
    "creation": "November 25th 2024"
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
- [v2 Documentation](/v2/en/) - Legacy version
