# JWT

The `/jwt` endpoint decodes a JSON Web Token without verifying the signature. Expiration is detected via the `exp` claim.

<Endpoint method="post" path="/jwt" baseUrl="https://api.sylvain.sh" />

## Parameters

The request body must be JSON:

| Parameter | Required | Description         |
| --------- | -------- | ------------------- |
| `token`   | Yes      | JWT token to decode |

## Response Fields

| Field       | Type      | Description                                               |
| ----------- | --------- | --------------------------------------------------------- |
| `header`    | `object`  | Decoded JWT header (algorithm, type, etc.)                |
| `payload`   | `object`  | Decoded JWT payload (claims)                              |
| `signature` | `string`  | Raw signature string (not verified)                       |
| `expired`   | `boolean` | `true` if `exp` is in the past — absent if no `exp` claim |

## Code Examples

<Examples method="post" path="/jwt" :body="{ token: 'eyJ...' }" />

## Try It

<Try name="JWT" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                                    | Description                                                                                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Please provide a token (?token={token})`                        | The `token` parameter is missing                                                                                    |
| `Token cannot exceed 8192 characters`                            | The token exceeds the maximum length                                                                                |
| `Invalid JWT format. Expected 3 parts separated by "."`          | The token does not have 3 dot-separated parts                                                                       |
| `Invalid JWT header: not a valid base64url-encoded JSON object`  | The header part is not valid base64url JSON, or decodes to something other than an object (e.g. an array or string) |
| `Invalid JWT payload: not a valid base64url-encoded JSON object` | The payload part is not valid base64url JSON, or decodes to something other than an object                          |
