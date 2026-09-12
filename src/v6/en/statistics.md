# Statistics

The `/statistics` endpoint calculates descriptive statistics on a list of numbers.

<Endpoint method="get" path="/statistics" baseUrl="https://api.sylvain.sh" />

::: info How it works?
All measures are computed on the full population (not a sample). `variance` and `stddev` use population formulas (divide by N). `mode` returns all values tied for the highest frequency. `mean`, `median`, `variance`, and `stddev` are rounded to 6 decimal places.
:::

## Parameters

| Parameter | Required | Description                                       |
| --------- | -------- | ------------------------------------------------- |
| `values`  | Yes      | Comma-separated list of numbers (max 1000 values) |

## Response Fields

| Field      | Type       | Description                    |
| ---------- | ---------- | ------------------------------ |
| `count`    | `number`   | Number of values               |
| `sum`      | `number`   | Sum of all values              |
| `min`      | `number`   | Minimum value                  |
| `max`      | `number`   | Maximum value                  |
| `range`    | `number`   | Difference between max and min |
| `mean`     | `number`   | Arithmetic mean                |
| `median`   | `number`   | Median value                   |
| `mode`     | `number[]` | Most frequent value(s)         |
| `variance` | `number`   | Population variance            |
| `stddev`   | `number`   | Standard deviation             |

> `mean`, `median`, `variance`, and `stddev` are returned with up to 6 decimal places of precision.

## Code Examples

<Examples method="get" path="/statistics" :params="{ values: '1,2,3,4,5' }" />

## Try It

<Try name="Statistics" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                                  | Description                                  |
| -------------------------------------------------------------- | -------------------------------------------- |
| `Please provide a comma-separated list of numbers (?values=…)` | The `values` parameter is missing or invalid |
