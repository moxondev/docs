# Base Conversion

The `/base` endpoint converts a number from one numeric base to another, anywhere between base 2 and base 36.

<Endpoint method="get" path="/base" baseUrl="https://api.sylvain.sh" />

::: info How it works?
Digits are read as `0-9` then `a-z`, representing the values 0 to 35, so input is case-insensitive and the result is always lowercase. The conversion uses arbitrary-precision integers: values far beyond `Number.MAX_SAFE_INTEGER` keep every digit intact. A leading minus sign is preserved, except when the value is zero (`-0` returns `0`).
:::

## Parameters

| Parameter | Required | Description                                                                                      |
| --------- | -------- | ------------------------------------------------------------------------------------------------ |
| `value`   | Yes      | Number to convert, optionally prefixed with `-`. Up to 100 characters, valid for the `from` base |
| `from`    | No       | Input base, an integer between 2 and 36. Default: `10`                                           |
| `to`      | No       | Output base, an integer between 2 and 36. Default: `16`                                          |

## Response Fields

| Field    | Type     | Description                              |
| -------- | -------- | ---------------------------------------- |
| `value`  | `string` | The original input value, as provided    |
| `from`   | `number` | Input base used for the conversion       |
| `to`     | `number` | Output base used for the conversion      |
| `result` | `string` | The converted value, in lowercase digits |

## Code Examples

<Examples method="get" path="/base" :params="{ value: '255', from: '10', to: '16' }" />

## Try It

<Try name="Base" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                             | Description                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------ |
| `Please provide a value (?value={value})` | The `value` parameter is missing                                                     |
| `Value must be 100 characters or fewer`   | The `value` exceeds the maximum length                                               |
| `Base must be a number`                   | `from` or `to` is not an integer                                                     |
| `Base must be between 2 and 36`           | `from` or `to` is outside the supported range                                        |
| `Invalid value for base {from}`           | A digit of `value` does not exist in the input base, or `value` is only a minus sign |
