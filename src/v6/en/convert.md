# Unit Conversion

The `/convert` endpoint allows you to convert values between units of the same category. You need to provide a value to convert, a source unit, and the target unit.

<Endpoint method="get" path="/convert" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                                              |
| --------- | -------- | -------------------------------------------------------- |
| `value`   | Yes      | The numeric value to convert                             |
| `from`    | Yes      | The source unit (see available units below)              |
| `to`      | Yes      | The target unit (must be in the same category as `from`) |

## Available Units

**Temperature:**

| Unit         | Description        |
| ------------ | ------------------ |
| `celsius`    | Celsius degrees    |
| `fahrenheit` | Fahrenheit degrees |
| `kelvin`     | Kelvin             |

**Length:**

| Unit | Description |
| ---- | ----------- |
| `km` | Kilometers  |
| `mi` | Miles       |
| `m`  | Meters      |
| `ft` | Feet        |
| `cm` | Centimeters |
| `in` | Inches      |
| `yd` | Yards       |

**Weight:**

| Unit  | Description |
| ----- | ----------- |
| `kg`  | Kilograms   |
| `lb`  | Pounds      |
| `oz`  | Ounces      |
| `g`   | Grams       |
| `ton` | Metric tons |

**Data:**

| Unit | Description |
| ---- | ----------- |
| `b`  | Bytes       |
| `kb` | Kilobytes   |
| `mb` | Megabytes   |
| `gb` | Gigabytes   |
| `tb` | Terabytes   |

**Speed:**

| Unit    | Description     |
| ------- | --------------- |
| `km/h`  | Kilometers/hour |
| `mph`   | Miles/hour      |
| `m/s`   | Meters/second   |
| `knots` | Knots           |

## Response Fields

| Field    | Type     | Description               |
| -------- | -------- | ------------------------- |
| `from`   | `string` | Source unit               |
| `to`     | `string` | Target unit               |
| `value`  | `number` | Original value to convert |
| `result` | `number` | Converted value           |

## Code Examples

<Examples method="get" path="/convert" :params="{ value: '100', from: 'km', to: 'mi' }" />

## Try It

<Try name="Convert" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                       | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- |
| `Please provide a valid value (?value={value})`     | The `value` parameter is missing or invalid         |
| `Please provide a valid source unit (&from={unit})` | The `from` parameter is missing or invalid          |
| `Please provide a valid target unit (&to={unit})`   | The `to` parameter is missing or invalid            |
| `Value must be a number`                            | The value is not a valid number                     |
| `Invalid conversion unit`                           | The `from`/`to` combination is not valid            |
| `Value must be greater than absolute zero`          | The value is below absolute zero (temperature only) |
