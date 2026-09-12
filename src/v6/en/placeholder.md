# Placeholder

The `/placeholder` endpoint generates SVG placeholders: simple images or animated skeleton loaders.

<Endpoint method="get" path="/placeholder" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                                           | Default               |
| --------- | -------- | ----------------------------------------------------- | --------------------- |
| `type`    | Yes      | `image` or `skeleton`                                 | —                     |
| `width`   | No       | Width in pixels (1–4000)                              | 800                   |
| `height`  | No       | Height in pixels (1–4000)                             | 600                   |
| `bg`      | No       | Background color (hex)                                | `#cccccc` / `#e5e5e5` |
| `color`   | No       | Text / highlight color (hex)                          | `#333333` / `#f5f5f5` |
| `text`    | No       | Displayed text (`image` only)                         | `800×600`             |
| `rows`    | No       | Number of lines (`skeleton` only, 0–20)               | 3                     |
| `avatar`  | No       | Avatar shape: `circle`, `rounded`, `square` or `true` | —                     |
| `lines`   | No       | Text lines next to avatar (`skeleton` only)           | 2                     |
| `animate` | No       | Animation: `shimmer`, `pulse`, `none`                 | `shimmer`             |
| `speed`   | No       | Animation speed (0.1–10)                              | 1.5                   |
| `radius`  | No       | Border radius of blocks (0–50)                        | 4                     |

::: info Good to know
The `bg` and `color` defaults differ between types: `image` uses `#cccccc`/`#333333`, `skeleton` uses `#e5e5e5`/`#f5f5f5`.
:::

## Response

The response is an `image/svg+xml` file for both types.

## Code Examples

<Examples method="get" path="/placeholder" :params="{ type: 'image', width: '400', height: '300', text: 'Hello' }" />

## Try It

<Try name="Placeholder" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                    | Description                     |
| ------------------------------------------------ | ------------------------------- |
| `Type must be one of: image, skeleton`           | The `type` parameter is invalid |
| `width must be a number`                         | Width is not a valid number     |
| `width must be between 1 and 4000`               | Width is out of range           |
| `Invalid color (use hex like #ff6600)`           | A color parameter is malformed  |
| `avatar must be one of: circle, rounded, square` | Invalid avatar shape            |
| `animate must be one of: shimmer, pulse, none`   | Invalid animation mode          |
| `speed must be between 0.1 and 10`               | Speed is out of range           |
| `radius must be between 0 and 50`                | Radius is out of range          |
