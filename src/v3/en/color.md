# Color Generation

The `/color` endpoint generates a random color in multiple formats. This endpoint does not require any options.

<Endpoint method="get" path="/color" />

## Parameters

This endpoint does not require any parameters.

## Request Example

```
GET /v3/color
```

## Response

```json
{
    "hex": "#517fff",
    "rgb": "rgb(81, 127, 255)",
    "hsl": "hsl(224, 100%, 66%)",
    "hsv": "hsv(224, 68.2%, 100%)",
    "hwb": "hwb(224, 32%, 0%)",
    "cmyk": "cmyk(68.24%, 50.2%, 0%, 0%)"
}
```

## Response Fields

| Field  | Description                                          |
| ------ | ---------------------------------------------------- |
| `hex`  | Hexadecimal color code                               |
| `rgb`  | RGB color format                                     |
| `hsl`  | HSL color format (Hue, Saturation, Lightness)        |
| `hsv`  | HSV color format (Hue, Saturation, Value)            |
| `hwb`  | HWB color format (Hue, Whiteness, Blackness)         |
| `cmyk` | CMYK color format (Cyan, Magenta, Yellow, Key/Black) |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/color"
```
