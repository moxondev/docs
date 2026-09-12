# Text

The `/text` endpoint provides text manipulation and generation utilities.

<Endpoint method="get" path="/text" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                                          |
| --------- | -------- | ---------------------------------------------------- |
| `method`  | Yes      | Text method (see available methods below)            |
| `value`   | No       | Source text (required for `stats`, `slug`, `number`) |
| `type`    | No       | Lorem type: `words`, `sentences`, `paragraphs`       |
| `count`   | No       | Number of elements for `lorem` (1–500, default: 5)   |
| `lang`    | No       | Language for `number`: `en` or `fr`                  |

## Available Methods

| Method   | Description          | Required Parameters |
| -------- | -------------------- | ------------------- |
| `stats`  | Text statistics      | `value`             |
| `slug`   | Convert to URL slug  | `value`             |
| `lorem`  | Generate Lorem Ipsum | `type`, `count`     |
| `number` | Number to words      | `value`, `lang`     |

## Response Fields

| Field    | Type             | Description          |
| -------- | ---------------- | -------------------- |
| `method` | `string`         | The text method used |
| `result` | `string\|object` | The processed result |

When using `stats`, the `result` field is an object with the following properties:

| Field                | Type     | Description                           |
| -------------------- | -------- | ------------------------------------- |
| `characters`         | `number` | Total number of characters            |
| `charactersNoSpaces` | `number` | Number of characters excluding spaces |
| `words`              | `number` | Number of words                       |
| `sentences`          | `number` | Number of sentences                   |
| `paragraphs`         | `number` | Number of paragraphs                  |
| `readingTime`        | `string` | Estimated reading time                |
| `mostFrequentChar`   | `string` | Most frequently used character        |

> For `number`, the maximum supported value is 999,999,999.

## Code Examples

<Examples method="get" path="/text" :params="{ method: 'slug', value: 'Hello World' }" />

## Try It

<Try name="Text" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                                          | Description                                    |
| ---------------------------------------------------------------------- | ---------------------------------------------- |
| `Please provide a valid method (?method={slug\|stats\|lorem\|number})` | The `method` parameter is missing or invalid   |
| `A value is required`                                                  | The `value` parameter is missing when required |
