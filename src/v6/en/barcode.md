# Barcode Generation

The `/barcode` endpoint generates barcode images from a data string. It supports several standard barcode formats and renders the result as SVG or PNG.

<Endpoint method="get" path="/barcode" baseUrl="https://api.sylvain.sh" />

::: info Format details

- **Code 128**: Encodes any printable ASCII character (codes 32–126).
- **EAN-13 / EAN-8 / UPC-A**: Numeric only. The check digit is computed automatically if omitted, or validated if provided.
- **Code 39**: Alphanumeric (`A-Z`, `0-9`, space, `- . $ / + %`). Input is auto-uppercased; start/stop characters are added automatically.
  :::

## Parameters

| Parameter | Required | Default   | Description                                                  |
| --------- | -------- | --------- | ------------------------------------------------------------ |
| `data`    | Yes      |           | Data string to encode in the barcode                         |
| `type`    | No       | `code128` | Barcode format: `code128`, `ean13`, `ean8`, `upca`, `code39` |
| `format`  | No       | `svg`     | Output format: `svg` or `png`                                |
| `width`   | No       | `2`       | Bar unit width in pixels (1–5)                               |
| `height`  | No       | `100`     | Bar height in pixels (50–300)                                |
| `color`   | No       | `#000000` | Bar color in hexadecimal (e.g. `000000`)                     |
| `bg`      | No       | `#ffffff` | Background color in hexadecimal (e.g. `ffffff`)              |

## Response

By default (`format=svg`), the endpoint returns an **inline SVG image** (`Content-Type: image/svg+xml`), usable in an `<img>` tag:

```html
<img src="https://api.sylvain.sh/v6/barcode?data=Hello123" alt="Barcode" />
```

With `format=png`, the response is a raw PNG buffer (`Content-Type: image/png`):

```html
<img src="https://api.sylvain.sh/v6/barcode?data=Hello123&format=png" alt="Barcode" />
```

## Code Examples

<Examples method="get" path="/barcode" :params="{ data: 'Hello123', type: 'code128' }" />

## Try It

<Try name="Barcode" />

## Error Handling

| Error Message                                                              | Description                                                       |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `Please provide data to encode (?data={string})`                           | The `data` parameter is missing                                   |
| `Type must be one of: code128, ean13, ean8, upca, code39`                  | The `type` value is not valid                                     |
| `Format must be one of: svg, png`                                          | The `format` value is not valid                                   |
| `Width must be between 1 and 5`                                            | The `width` parameter is out of the allowed range                 |
| `Height must be between 50 and 300`                                        | The `height` parameter is out of the allowed range                |
| `Please provide valid dimensions (&width={px}&height={px})`                | The `width` or `height` parameter is not a valid number           |
| `Code 128 only supports ASCII 32-126 (invalid char: "{ch}")`               | A character in `data` is outside the Code 128 supported range     |
| `EAN-13 requires 12 or 13 digits`                                          | The `data` string does not have the correct number of digits      |
| `Invalid EAN-13 check digit (expected {expected}, got {actual})`           | The provided EAN-13 check digit does not match the computed value |
| `EAN-8 requires 7 or 8 digits`                                             | The `data` string does not have the correct number of digits      |
| `Invalid EAN-8 check digit (expected {expected}, got {actual})`            | The provided EAN-8 check digit does not match the computed value  |
| `UPC-A requires 11 or 12 digits`                                           | The `data` string does not have the correct number of digits      |
| `Code 39 invalid character: "{ch}". Allowed: A-Z, 0-9, space, - . $ / + %` | A character in `data` is not allowed in Code 39                   |
| `Invalid color (use hex like ff6600)`                                      | A `color` or `bg` value is not a valid hexadecimal color          |
