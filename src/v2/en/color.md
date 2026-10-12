# Color Generation

The `/color` endpoint generates a random color in multiple formats. This endpoint does not require any options.

<Endpoint method="get" path="/color" />

## Request Example

```
GET /v2/color
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

## cURL

```bash
curl -X GET "https://api.moxon.dev/v2/color"
```
