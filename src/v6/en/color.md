# Color Generation

The `/color` endpoint generates a color in multiple formats. You can provide a HEX color to convert, or omit it to get a random color.

<Endpoint method="get" path="/color" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                                               |
| --------- | -------- | --------------------------------------------------------- |
| `hex`     | No       | A HEX color to convert (e.g. `ff6600`). Random if omitted |

## Response Fields

| Field  | Type     | Description                                          |
| ------ | -------- | ---------------------------------------------------- |
| `hex`  | `string` | Hexadecimal color code                               |
| `rgb`  | `string` | RGB color format                                     |
| `hsl`  | `string` | HSL color format (Hue, Saturation, Lightness)        |
| `hsv`  | `string` | HSV color format (Hue, Saturation, Value)            |
| `hwb`  | `string` | HWB color format (Hue, Whiteness, Blackness)         |
| `cmyk` | `string` | CMYK color format (Cyan, Magenta, Yellow, Key/Black) |

## Code Examples

<Examples method="get" path="/color" :params="{ hex: '1a1a2e' }" />

## Try It

<Try name="Color" />

## Error Handling

If parameters are invalid, the API will return an error:

| Error Message                     | Description                          |
| --------------------------------- | ------------------------------------ |
| `Invalid HEX color (use #RRGGBB)` | The `hex` parameter is not valid hex |
