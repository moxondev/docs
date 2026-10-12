# Proof of Work

The `/pow` endpoint issues a proof-of-work challenge, an anti-bot protection meant to replace the visual captcha. The server hands out a `salt` and a difficulty; the client looks for a `nonce` whose `sha256` fingerprint starts with that many hexadecimal zeros, then posts it back for verification.

<Endpoint method="get" path="/pow" baseUrl="https://api.moxon.dev" />

::: info How it works?
At the default difficulty of `4`, solving takes about 32,000 hashes — under a second in a browser and imperceptible to a person, but ruinous for a bot repeating it thousands of times. Unlike a visual captcha, no vision model can shortcut it: the only way through is to spend the computation.

The expected answer never travels to the client. The token carries the `salt` and difficulty in clear, but its signature is computed server-side with a secret, so it cannot be forged or read back.
:::

## Parameters

| Parameter    | Required | Description                                                              |
| ------------ | -------- | ------------------------------------------------------------------------ |
| `difficulty` | No       | Leading hexadecimal zeros required, an integer from 1 to 6. Default: `4` |

## Response Fields

| Field          | Type     | Description                                                    |
| -------------- | -------- | -------------------------------------------------------------- |
| `algorithm`    | `string` | Hash algorithm used, always `sha256`                           |
| `salt`         | `string` | Random salt to prefix the nonce with                           |
| `difficulty`   | `number` | Number of leading hexadecimal zeros the digest must start with |
| `expires`      | `number` | Expiry timestamp of the token, in milliseconds                 |
| `token`        | `string` | Signed token to send back for verification                     |
| `instructions` | `string` | Human-readable description of the work to perform              |

## Code Examples

<Examples method="get" path="/pow" :params="{ difficulty: '4' }" />

Solving the challenge is a loop, so it cannot be expressed as a single request. Increment a counter until the digest matches the required prefix:

```js
const { salt, difficulty, token } = await (await fetch('https://api.moxon.dev/v5/pow')).json();
const target = '0'.repeat(difficulty);

let nonce = 0;
while (true) {
    const bytes = new TextEncoder().encode(salt + nonce);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    const hex = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
    if (hex.startsWith(target)) break;
    nonce++;
}
```

Then send `token` and `nonce` to [/v5/pow](./pow/verify) to have the proof checked.

## Try It

<Try name="Pow" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                        | Description                                  |
| ------------------------------------ | -------------------------------------------- |
| `Difficulty must be a number`        | The `difficulty` parameter is not a number   |
| `Difficulty must be between 1 and 6` | The `difficulty` is out of the allowed range |

## Related Endpoints

- <Method type="post" sm /> [/v5/pow](./pow/verify) - Verify a solved challenge
- <Method type="get" sm /> [/v5/captcha](./captcha) - Visual captcha, the alternative this replaces
