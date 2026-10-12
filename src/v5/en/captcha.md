# Captcha Generation

The `/captcha` endpoint generates a CAPTCHA image. It offers two modes: `image`, which returns the answer alongside the picture, and `challenge`, which keeps the answer server-side so it can be verified later.

<Endpoint method="get" path="/captcha" baseUrl="https://api.moxon.dev" />

::: tip Prefer proof of work
A visual captcha no longer stops a determined bot: vision models read them well, often better than people do. For anti-bot protection, prefer **[/pow](/v5/en/pow)**, which cannot be shortcut by a model — the only way through is to spend the computation.
:::

## Parameters

| Parameter | Required | Description                                                                              |
| --------- | -------- | ---------------------------------------------------------------------------------------- |
| `mode`    | No       | `image` (default) or `challenge`                                                         |
| `text`    | No       | The captcha text. If omitted, a random string is generated. Rejected in `challenge` mode |
| `length`  | No       | Length of the auto-generated text, 1 to 20. Default: `6`                                 |
| `width`   | No       | Image width in pixels, 100 to 800. Default: 60 × the text length                         |
| `height`  | No       | Image height in pixels, 50 to 400. Default: `120`                                        |
| `noise`   | No       | Noise level: `low`, `medium` (default) or `high`                                         |
| `bg`      | No       | Background color in hexadecimal (e.g. `ffffff`)                                          |
| `color`   | No       | Text color in hexadecimal (e.g. `000000`)                                                |

## Available Modes

| Mode        | Response                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------- |
| `image`     | PNG image, with the answer in the `X-Captcha-Text` header                                 |
| `challenge` | PNG image, with a signed token in the `X-Captcha-Token` header — the answer is never sent |

Both modes return a PNG image (`Content-Type: image/png`), usable in an `<img>` tag.

In `challenge` mode the answer never leaves the server: it exists only inside the token's signature, so intercepting the response does not reveal it. The rendering is also hardened against automated reading — glyphs overlap so they cannot be segmented, ride a sine baseline, mix font families, and are crossed by strokes drawn in the text's own colors, which no filter can subtract. The default `image` mode is unchanged. Send the token and the user's answer to [/v5/captcha](./captcha/verify) to check it.

::: info Good to know
Both headers are exposed to browser JavaScript through CORS, so a web page can read them from the response.

The auto-generated string avoids ambiguous characters (e.g. `0`/`O`, `1`/`l`).
:::

## Code Examples

<Examples method="get" path="/captcha" :params="{ length: '8', width: '400', noise: 'high', bg: 'f0f0f0' }" />

::: tip Example
[See an example with auto-generated text](https://api.moxon.dev/v5/captcha?length=8&noise=high)
:::

## Try It

<Try name="Captcha" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                    | Description                                        |
| ------------------------------------------------ | -------------------------------------------------- |
| `Mode must be one of: image, challenge`          | The `mode` value is not valid                      |
| `A custom text cannot be used in challenge mode` | `text` was provided together with `mode=challenge` |
| `length must be a number`                        | The `length` parameter is not a number             |
| `length must be between 1 and 20`                | The `length` is out of range                       |
| `width must be a number`                         | The `width` parameter is not a number              |
| `width must be between 100 and 800`              | The `width` is out of range                        |
| `height must be a number`                        | The `height` parameter is not a number             |
| `height must be between 50 and 400`              | The `height` is out of range                       |
| `Noise must be one of: low, medium, high`        | Invalid `noise` value                              |
| `Invalid color (use hex like ff6600)`            | A `bg` or `color` parameter is malformed           |

## Related Endpoints

- <Method type="post" sm /> [/v5/captcha](./captcha/verify) - Verify a challenge answer
- <Method type="get" sm /> [/v5/pow](./pow) - Proof of work, the recommended alternative
