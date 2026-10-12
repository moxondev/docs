# Proof of Work Verification

The `/pow` endpoint verifies a solved proof-of-work challenge: send back the token issued with the challenge, along with the nonce you found.

<Endpoint method="post" path="/pow" baseUrl="https://api.moxon.dev" />

## Parameters

The request body must be JSON:

| Parameter | Required | Description                   |
| --------- | -------- | ----------------------------- |
| `token`   | Yes      | Token issued by the challenge |
| `nonce`   | Yes      | Nonce found by the client     |

## Response Fields

| Field    | Type      | Description                                         |
| -------- | --------- | --------------------------------------------------- |
| `valid`  | `boolean` | `true` if the proof is accepted                     |
| `reason` | `string`  | Why it was rejected — absent when `valid` is `true` |

## Rejection Reasons

| Reason    | Meaning                                                       |
| --------- | ------------------------------------------------------------- |
| `wrong`   | The nonce does not produce a digest with enough leading zeros |
| `expired` | The token is older than 5 minutes                             |
| `used`    | The token was already redeemed — each one works exactly once  |
| `invalid` | The token is malformed or not a proof-of-work token           |

## Code Examples

<Examples method="post" path="/pow" :body="{ token: 'eyJ...', nonce: '48123' }" />

## Try It

<Try name="Pow Verify" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                             | Description            |
| ----------------------------------------- | ---------------------- |
| `Please provide a token (?token={token})` | The `token` is missing |
| `Please provide a nonce (&nonce={nonce})` | The `nonce` is missing |

## Related Endpoints

- <Method type="get" sm /> [/v6/pow](../pow) - Request a challenge to solve
