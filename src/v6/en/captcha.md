# Captcha Generation

The `/captcha` endpoint generates a CAPTCHA image. It offers two modes: `challenge`, the default, which keeps the answer server-side so it can be verified later, and `image`, which returns the answer alongside the picture.

<Endpoint method="get" path="/captcha" baseUrl="https://api.sylvain.sh" />

::: warning Changed in 6.0.0
`challenge` is now the **default** mode: the image comes with a signed token in `X-Captcha-Token` instead of the answer in clear. Code that read `X-Captcha-Text` without passing `mode` will no longer find it — pass `?mode=image` to keep the previous behaviour.
:::

::: tip Prefer proof of work
A visual captcha no longer stops a determined bot: vision models read them well, often better than people do. For anti-bot protection, prefer **[/pow](/v6/en/pow)**, which cannot be shortcut by a model — the only way through is to spend the computation.
:::

## Parameters

| Parameter | Required | Description                                                                              |
| --------- | -------- | ---------------------------------------------------------------------------------------- |
| `mode`    | No       | `challenge` (default) or `image`                                                         |
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
| `challenge` | PNG image, with a signed token in the `X-Captcha-Token` header — the answer is never sent |
| `image`     | PNG image, with the answer in the `X-Captcha-Text` header                                 |

Both modes return a PNG image (`Content-Type: image/png`), usable in an `<img>` tag.

In `challenge` mode the answer never leaves the server: it exists only inside the token's signature, so intercepting the response does not reveal it. The rendering is also hardened against automated reading — glyphs overlap so they cannot be segmented, ride a sine baseline, mix font families, and are crossed by strokes drawn in the text's own colors, which no filter can subtract. Send the token and the user's answer to [/v6/captcha](./captcha/verify) to check it.

::: info Good to know
Both headers are exposed to browser JavaScript through CORS, so a web page can read them from the response.

The auto-generated string avoids ambiguous characters (e.g. `0`/`O`, `1`/`l`).
:::

## Code Examples

<Examples method="get" path="/captcha" :params="{ length: '8', width: '400', noise: 'high', bg: 'f0f0f0' }" />

::: tip Example
[See an example with auto-generated text](https://api.sylvain.sh/v6/captcha?length=8&noise=high)
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

- <Method type="post" sm /> [/v6/captcha](./captcha/verify) - Verify a challenge answer
- <Method type="get" sm /> [/v6/pow](./pow) - Proof of work, the recommended alternative
