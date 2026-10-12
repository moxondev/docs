# Captcha Verification

The `/captcha` endpoint verifies an answer submitted for a challenge-mode captcha: send back the token from the `X-Captcha-Token` header, along with the text the user typed.

<Endpoint method="post" path="/captcha" baseUrl="https://api.moxon.dev" />

## Parameters

The request body must be JSON:

| Parameter | Required | Description                                       |
| --------- | -------- | ------------------------------------------------- |
| `token`   | Yes      | Token from the `X-Captcha-Token` header           |
| `answer`  | Yes      | Text typed by the user. Case-insensitive, trimmed |

## Response Fields

| Field    | Type      | Description                                         |
| -------- | --------- | --------------------------------------------------- |
| `valid`  | `boolean` | `true` if the answer matches                        |
| `reason` | `string`  | Why it was rejected — absent when `valid` is `true` |

## Rejection Reasons

| Reason    | Meaning                                                      |
| --------- | ------------------------------------------------------------ |
| `wrong`   | The answer does not match the image                          |
| `expired` | The token is older than 5 minutes                            |
| `used`    | The token was already redeemed — each one works exactly once |
| `invalid` | The token is malformed                                       |

## Code Examples

<Examples method="post" path="/captcha" :body="{ token: 'eyJ...', answer: 'a4Kf2p' }" />

## Try It

<Try name="Captcha Verify" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                 | Description             |
| --------------------------------------------- | ----------------------- |
| `Please provide a token (?token={token})`     | The `token` is missing  |
| `Please provide an answer (&answer={answer})` | The `answer` is missing |

## Related Endpoints

- <Method type="get" sm /> [/v5/captcha](../captcha) - Generate a captcha in challenge mode
- <Method type="get" sm /> [/v5/pow](../pow) - Proof of work, the recommended alternative
