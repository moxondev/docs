# Regex Tester

The `/regex` endpoint tests a regular expression pattern against a text string and returns structured match results including capture groups and named groups.

<Endpoint method="get" path="/regex" baseUrl="https://api.sylvain.sh" />

::: tip Use Cases
Validate regex patterns during development, extract structured data from raw text, debug complex capture groups, or build regex-powered search previews without running server-side code.
:::

## Parameters

| Parameter | Required | Description                                                                         |
| --------- | -------- | ----------------------------------------------------------------------------------- |
| `pattern` | Yes      | The regular expression pattern to test (max 200 characters).                        |
| `text`    | Yes      | The text to test the pattern against (max 1000 characters).                         |
| `flags`   | No       | Regex flags to apply. Accepted: `i`, `m`, `s`, `u`. The `g` flag is always applied. |

## Response Fields

| Field                   | Type       | Description                                                        |
| ----------------------- | ---------- | ------------------------------------------------------------------ |
| `valid`                 | `boolean`  | `true` if the pattern is a valid regex                             |
| `pattern`               | `string`   | The pattern as provided                                            |
| `flags`                 | `string`   | The effective flags used (always includes `g`)                     |
| `count`                 | `number`   | Total number of matches found                                      |
| `matches`               | `object[]` | Array of match objects                                             |
| `matches[].match`       | `string`   | The full matched string                                            |
| `matches[].index`       | `number`   | Start index of the match in the text                               |
| `matches[].groups`      | `string[]` | Array of numbered capture group values (empty string if unmatched) |
| `matches[].namedGroups` | `object`   | Key-value map of named capture groups (`(?<name>...)`)             |

## Code Examples

<Examples method="get" path="/regex" :params="{ pattern: '\\d+', text: 'Order 42 and item 7' }" />

## Try It

<Try name="Regex" />

## Error Handling

| Error Message                                         | Description                                   |
| ----------------------------------------------------- | --------------------------------------------- |
| `Please provide a pattern (?pattern=...)`             | The `pattern` parameter is missing            |
| `Please provide a text (?text=...)`                   | The `text` parameter is missing               |
| `Pattern must be at most 200 characters`              | The `pattern` exceeds the maximum length      |
| `Text must be at most 1000 characters`                | The `text` exceeds the maximum length         |
| `Invalid flag: {flag}. Accepted flags: g, i, m, s, u` | One or more flags are not supported           |
| `Invalid regular expression`                          | The pattern is not a valid regular expression |
