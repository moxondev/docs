# Token Generation

The `/token` endpoint generates secure strings called _tokens_. This endpoint is particularly useful for creating random identifiers for various applications.

<Endpoint method="post" path="/token" />

## Parameters

| Parameter | Required | Description                                      |
| --------- | -------- | ------------------------------------------------ |
| `len`     | No       | Token length (12-4096). Default: 24              |
| `type`    | No       | Token type (see options below). Default: `alpha` |

## Available Types

| Type       | Description                            |
| ---------- | -------------------------------------- |
| `alpha`    | Letters only (lowercase and uppercase) |
| `alphanum` | Letters and numbers                    |
| `base64`   | Base64 encoding                        |
| `hex`      | Hexadecimal digits                     |
| `num`      | Numbers only                           |
| `punct`    | Punctuation characters                 |
| `urlsafe`  | URL-safe characters                    |
| `uuid`     | Universally Unique Identifier (UUID)   |

## Request Example

```bash
curl -X POST -d "len=24&type=alphanum" "https://api.moxon.dev/v2/token"
```

## Response

```json
{
    "token": "6tMdlDV90x4Sm52dRS7MuGyn"
}
```

## Error Handling

If the `len` value is out of bounds or the `type` is invalid, a 12-character alphanumeric token will be generated.
