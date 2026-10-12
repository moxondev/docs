# Captcha Generation

The `/captcha` endpoint generates a CAPTCHA image. You can provide your own text or let the API generate a random one automatically.

<Endpoint method="get" path="/captcha" baseUrl="https://api.moxon.dev" />

## Parameters

| Parameter | Required | Description                                                |
| --------- | -------- | ---------------------------------------------------------- |
| `text`    | No       | The captcha text. If omitted, a random string is generated |
| `length`  | No       | Length of the auto-generated text (default 6)              |
| `width`   | No       | Image width in pixels (default 300)                        |
| `height`  | No       | Image height in pixels (default 150)                       |
| `noise`   | No       | Number of noise lines (default 5)                          |
| `bg`      | No       | Background color in hexadecimal (e.g. `ffffff`)            |
| `color`   | No       | Text color in hexadecimal (e.g. `000000`)                  |

## Response

The endpoint returns a PNG image of the generated captcha.

::: info Good to know
The response includes an `X-Captcha-Text` header containing the captcha answer, useful for server-side verification.
When no `text` is provided, the auto-generated string avoids ambiguous characters (e.g. `0`/`O`, `1`/`l`).
:::

## Code Examples

<Examples method="get" path="/captcha" :params="{ length: '8', width: '400', noise: 'high', bg: 'f0f0f0' }" />

::: tip Example
[See an example with auto-generated text](https://api.moxon.dev/v4/captcha?length=8&noise=high)
:::

## Try It

<Try name="Captcha" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                             | Description                              |
| ----------------------------------------- | ---------------------------------------- |
| `length must be a number`                 | The `length` parameter is not a number   |
| `length must be between 1 and 20`         | The `length` is out of range             |
| `width must be a number`                  | The `width` parameter is not a number    |
| `width must be between 100 and 800`       | The `width` is out of range              |
| `height must be a number`                 | The `height` parameter is not a number   |
| `height must be between 50 and 400`       | The `height` is out of range             |
| `noise must be one of: low, medium, high` | Invalid `noise` value                    |
| `Invalid color (use hex like ff6600)`     | A `bg` or `color` parameter is malformed |
