# Temperature Conversion

The `/convert` endpoint allows you to convert multiple temperature units between each other. You need to provide a value to convert, a source unit, and the unit you want to convert to.

<Endpoint method="get" path="/convert" />

## Parameters

| Parameter | Required | Description                                         |
| --------- | -------- | --------------------------------------------------- |
| `value`   | Yes      | The value to convert                                |
| `from`    | Yes      | The source unit (`celsius`, `fahrenheit`, `kelvin`) |
| `to`      | Yes      | The target unit (`celsius`, `fahrenheit`, `kelvin`) |

## Available Units

| Unit         | Description        |
| ------------ | ------------------ |
| `celsius`    | Celsius degrees    |
| `fahrenheit` | Fahrenheit degrees |
| `kelvin`     | Kelvin             |

## Request Example

```
GET /v3/convert?value=30&from=celsius&to=kelvin
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
curl -X GET "https://api.moxon.dev/v3/convert?value=30&from=celsius&to=kelvin"
```

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                       | Description                                 |
| --------------------------------------------------- | ------------------------------------------- |
| `Please provide a valid value (?value={value})`     | The `value` parameter is missing or invalid |
| `Please provide a valid source unit (&from={unit})` | The `from` parameter is missing or invalid  |
| `Please provide a valid target unit (&to={unit})`   | The `to` parameter is missing or invalid    |
