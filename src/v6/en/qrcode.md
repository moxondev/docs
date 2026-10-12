# QR Code Generation

The `/qrcode` endpoint generates a QR Code from a URL provided as a parameter. This endpoint is useful for quickly generating an image in PNG format.

<Endpoint method="get" path="/qrcode" baseUrl="https://api.moxon.dev" />

## Parameters

| Parameter     | Required | Description                                                                      |
| ------------- | -------- | -------------------------------------------------------------------------------- |
| `url`         | Yes      | The URL to encode in the QR Code. Must contain the full address                  |
| `format`      | No       | Response format: `png` (default, direct image) or `base64` (JSON data URL)       |
| `size`        | No       | Image size in pixels (50-2000, default 200)                                      |
| `margin`      | No       | Quiet zone in modules (0-10, default 4)                                          |
| `correction`  | No       | Error correction level: `L`, `M`, `Q` or `H` (default `M`)                       |
| `dark`        | No       | Module color in hexadecimal (e.g. `000000`)                                      |
| `light`       | No       | Background color in hexadecimal (e.g. `ffffff`)                                  |
| `icon`        | No       | HTTPS URL of an image to overlay at the center of the QR Code                    |
| `iconSize`    | No       | Icon size in pixels (default 20% of `size`, max 40% of `size`)                   |
| `iconPadding` | No       | White padding around the icon in pixels (default 5, 0-50)                        |
| `iconRadius`  | No       | Border radius of the icon background in pixels (default 0, max = perfect circle) |

::: info Good to know
When an `icon` is provided, the error correction level is automatically set to `H` to ensure readability.
The icon URL must use HTTPS, with a 5s timeout and a 2MB size limit.
:::

::: tip Keep the icon small
A large `iconSize` combined with generous `iconPadding` covers more QR Code modules, making it harder to scan. Keep the icon + padding area well below 40% of the total `size` for reliable results.
:::

## Response

By default (`format=png`), the endpoint returns a **direct PNG image** (`Content-Type: image/png`), usable in an `<img>` tag:

```html
<img src="https://api.moxon.dev/v6/qrcode?url=https://moxon.dev" alt="QR Code" />
```

With `format=base64`, the response is a JSON object:

| Field    | Type     | Description                        |
| -------- | -------- | ---------------------------------- |
| `result` | `string` | Base64 PNG data URI of the QR Code |

## Code Examples

<Examples method="get" path="/qrcode" :params="{ url: 'https://moxon.dev', size: '300', margin: '2', dark: '1a1a2e', light: 'eaeaea' }" />

## Try It

<Try name="QR Code" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                            | Description                                        |
| ---------------------------------------- | -------------------------------------------------- |
| `Please provide a valid URL`             | The `url` parameter is missing or invalid          |
| `format must be one of: png, base64`     | Invalid `format` value                             |
| `size must be a number`                  | The `size` parameter is not a number               |
| `size must be between 50 and 2000`       | The `size` is out of range                         |
| `margin must be a number`                | The `margin` parameter is not a number             |
| `margin must be between 0 and 10`        | The `margin` is out of range                       |
| `correction must be one of: L, M, Q, H`  | Invalid error correction level                     |
| `Invalid color (use hex like ff6600)`    | A `dark` or `light` color is malformed             |
| `Icon URL must use HTTPS`                | The `icon` URL does not use HTTPS                  |
| `Failed to fetch icon: HTTP {status}`    | The icon URL returned a non-OK response            |
| `Icon URL must point to an image`        | The icon content-type is not an image              |
| `Icon must be under 2MB`                 | The icon exceeds the 2MB size limit                |
| `iconSize must be a number`              | The `iconSize` parameter is not a number           |
| `iconSize must be between 10 and {max}`  | The `iconSize` is out of range (max = 40% of size) |
| `iconPadding must be a number`           | The `iconPadding` parameter is not a number        |
| `iconPadding must be between 0 and 50`   | The `iconPadding` is out of range                  |
| `iconRadius must be a number`            | The `iconRadius` parameter is not a number         |
| `iconRadius must be between 0 and {max}` | The `iconRadius` is out of range                   |
