# CSV Conversion

The `/csv` endpoint converts between CSV and JSON: `parse` turns CSV text into an array of objects, `format` does the reverse.

<Endpoint method="post" path="/csv" baseUrl="https://api.sylvain.sh" />

::: info How it works?
The parser respects quoted fields, including escaped quotes (`""`) and newlines inside a quoted field. CRLF and CR line endings are normalized to LF before parsing.
:::

## Parameters

The request body must be JSON:

| Parameter   | Required | Description                                                     |
| ----------- | -------- | --------------------------------------------------------------- |
| `action`    | Yes      | Action to perform: `parse` or `format`                          |
| `csv`       | Cond.    | CSV text to convert (required for `parse`)                      |
| `json`      | Cond.    | Array of objects to convert (required for `format`)             |
| `delimiter` | No       | Field separator, a single character. Default: `,`               |
| `headers`   | No       | `parse` only: use the first row as object keys. Default: `true` |

## Available Actions

| Action   | Description                                |
| -------- | ------------------------------------------ |
| `parse`  | Converts CSV text into an array of objects |
| `format` | Converts an array of objects into CSV text |

## Response Fields

**`parse` action:**

| Field    | Type       | Description                 |
| -------- | ---------- | --------------------------- |
| `action` | `string`   | `parse`                     |
| `rows`   | `object[]` | Array of parsed row objects |
| `count`  | `number`   | Number of rows returned     |

**`format` action:**

| Field    | Type     | Description              |
| -------- | -------- | ------------------------ |
| `action` | `string` | `format`                 |
| `csv`    | `string` | The generated CSV text   |
| `count`  | `number` | Number of rows converted |

## Code Examples

<Examples method="post" path="/csv" :body="{ action: 'parse', csv: 'name,age\nAlice,30' }" />

## Try It

<Try name="CSV" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                           | Description                                                          |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| `Please provide an action (?action=parse\|format)`      | The `action` parameter is missing                                    |
| `Please provide a valid action (?action=parse\|format)` | The `action` value is not `parse` or `format`                        |
| `Delimiter must be a single character`                  | The `delimiter` is not exactly one character                         |
| `Please provide CSV data (?csv={data})`                 | The `csv` parameter is missing for `parse`                           |
| `CSV cannot exceed 50000 characters`                    | The `csv` text exceeds the maximum length                            |
| `CSV cannot exceed 1000 rows`                           | The parsed data has more rows than the limit                         |
| `Please provide a JSON array (?json=[...])`             | The `json` parameter is missing, not an array, or empty for `format` |
| `JSON cannot exceed 1000 rows`                          | The `json` array has more rows than the limit                        |
