# Conversion

The `/convert` endpoint allows you to convert multiple temperature units between each other. You need to provide a value to convert, a source unit, and the unit you want to convert to.

<Endpoint method="get" path="/convert" />

## Parameters

| Parameter | Required | Description                                                   |
| --------- | -------- | ------------------------------------------------------------- |
| `value`   | Yes      | The value to convert                                          |
| `from`    | Yes      | The source unit (`celsius`, `fahrenheit`, or `kelvin`)        |
| `to`      | Yes      | The unit to convert to (`celsius`, `fahrenheit`, or `kelvin`) |

## Available Units

| Unit         | Description                       |
| ------------ | --------------------------------- |
| `celsius`    | Temperature in Celsius degrees    |
| `fahrenheit` | Temperature in Fahrenheit degrees |
| `kelvin`     | Temperature in Kelvin             |

## Request Example

```
GET /v1/convert?value=30&from=celsius&to=kelvin
```

## Response

```json
{
    "from": "celsius",
    "to": "kelvin",
    "value": 30,
    "result": 303.15
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v1/convert?value=30&from=celsius&to=kelvin"
```

## Error Handling

If the `value`, `from`, or `to` field is empty or invalid, an error will be returned.
