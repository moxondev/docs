# Palette

The `/palette` endpoint generates a harmonious color palette from a base HEX color.

<Endpoint method="get" path="/palette" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                          |
| --------- | -------- | ------------------------------------ |
| `color`   | Yes      | Base color in HEX format (`#RRGGBB`) |
| `type`    | Yes      | Palette type (see below)             |

## Palette Types

| Type                  | Colors Generated        |
| --------------------- | ----------------------- |
| `complementary`       | 2 colors (opposite)     |
| `triadic`             | 3 colors (120°)         |
| `analogous`           | 5 colors (-60° to +60°) |
| `tetradic`            | 4 colors (90°)          |
| `split-complementary` | 3 colors                |

## Response Fields

| Field          | Type     | Description         |
| -------------- | -------- | ------------------- |
| `base.hex`     | `string` | Base color in HEX   |
| `base.rgb`     | `string` | Base color in RGB   |
| `base.hsl`     | `string` | Base color in HSL   |
| `type`         | `string` | Palette type used   |
| `colors`       | `array`  | Generated colors    |
| `colors[].hex` | `string` | Color in HEX format |
| `colors[].rgb` | `string` | Color in RGB format |
| `colors[].hsl` | `string` | Color in HSL format |

## Code Examples

<Examples method="get" path="/palette" :params="{ color: '#ff6600', type: 'triadic' }" />

## Try It

<Try name="Palette" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                                                           | Description                      |
| --------------------------------------------------------------------------------------- | -------------------------------- |
| `A base color is required`                                                              | The `color` parameter is missing |
| `A palette type is required`                                                            | The `type` parameter is missing  |
| `Invalid HEX color (use #RRGGBB)`                                                       | The color format is invalid      |
| `Type must be one of: complementary, triadic, analogous, tetradic, split-complementary` | Invalid palette type             |
