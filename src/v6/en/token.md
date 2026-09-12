# Token Generation

The `/token` endpoint generates secure strings called _tokens_. This endpoint is particularly useful for creating random identifiers for various applications.

<Endpoint method="post" path="/token" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                                         |
| --------- | -------- | --------------------------------------------------- |
| `len`     | No       | Token length (12-4096). Default: 24                 |
| `type`    | No       | Token type (see options below). Default: `alphanum` |

## Token Types

| Type       | Description             | Example                                |
| ---------- | ----------------------- | -------------------------------------- |
| `alpha`    | Letters only (a-z, A-Z) | `AbCdEfGhIjKl`                         |
| `alphanum` | Letters and numbers     | `6tMdlDV90x4S`                         |
| `base64`   | Base64 encoding         | `dGVzdDEyMzQ=`                         |
| `hex`      | Hexadecimal digits      | `a1b2c3d4e5f6`                         |
| `num`      | Numbers only            | `123456789012`                         |
| `punct`    | Punctuation characters  | `!@#$%^&*()_+`                         |
| `urlsafe`  | URL-safe characters     | `abc-123_XYZ`                          |
| `uuid`     | UUID format             | `550e8400-e29b-41d4-a716-446655440000` |

## Code Examples

<Examples method="post" path="/token" :body="{ len: '24', type: 'alphanum' }" />

## Response Fields

| Field   | Type     | Description                |
| ------- | -------- | -------------------------- |
| `token` | `string` | The generated secure token |

## Try It

<Try name="Token" />

## Error Handling

If parameters are invalid, the API will return an error:

| Error Message                    | Description                               |
| -------------------------------- | ----------------------------------------- |
| `Invalid number.`                | The `len` parameter is not a valid number |
| `Length cannot exceed 4096.`     | The `len` parameter is greater than 4096  |
| `Length cannot be less than 12.` | The `len` parameter is less than 12       |
