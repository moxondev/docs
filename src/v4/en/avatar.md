# Avatar Generation

The `/avatar` endpoint generates deterministic avatar images from a seed string. The same seed always produces the same image, making it useful for consistent user representations.

<Endpoint method="get" path="/avatar" baseUrl="https://api.moxon.dev" />

## Parameters

| Parameter | Required | Default     | Description                                                         |
| --------- | -------- | ----------- | ------------------------------------------------------------------- |
| `seed`    | No       | random UUID | Seed string for deterministic generation — same seed, same image    |
| `type`    | No       | `identicon` | Avatar type: `identicon` (5×5 symmetric grid) or `pixel` (8×8 grid) |
| `format`  | No       | `png`       | Output format: `png` or `svg`                                       |
| `size`    | No       | `200`       | Image size in pixels (50–2000)                                      |
| `bg`      | No       | `#f0f0f0`   | Background color in hexadecimal (e.g. `f0f0f0`)                     |

## Response

By default (`format=png`), the endpoint returns a **direct PNG image** (`Content-Type: image/png`), usable in an `<img>` tag:

```html
<img src="https://api.moxon.dev/v4/avatar?seed=alice" alt="Avatar" />
```

With `format=svg`, the response is an inline SVG (`Content-Type: image/svg+xml`):

```html
<img src="https://api.moxon.dev/v4/avatar?seed=alice&format=svg" alt="Avatar" />
```

## Code Examples

<Examples method="get" path="/avatar" :params="{ seed: 'claude', type: 'identicon', size: '200' }" />

## Try It

<Try name="Avatar" />

## Error Handling

| Error Message                           | Description                                      |
| --------------------------------------- | ------------------------------------------------ |
| `Size must be between 50 and 2000`      | The `size` parameter is out of the allowed range |
| `Type must be one of: identicon, pixel` | The `type` value is not valid                    |
| `Format must be one of: png, svg`       | The `format` value is not valid                  |
| `Invalid color (use hex like ff6600)`   | The `bg` color is not a valid hexadecimal value  |
