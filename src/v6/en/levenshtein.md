# Levenshtein Distance

The `/levenshtein` endpoint allows you to calculate the Levenshtein distance between two strings. This distance represents the minimum number of operations required to transform one string into another.

<Endpoint method="post" path="/levenshtein" baseUrl="https://api.sylvain.sh" />

::: warning Changed in 6.0.0
This endpoint moved from `GET` to `POST`. The two strings are now sent as a JSON body instead of query parameters, so they no longer appear in the URL — and therefore no longer in browser history or in the logs of any intermediary.
:::

::: info How it works ?
The Levenshtein distance counts the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into another. Useful for spell checking, fuzzy matching, DNA analysis, and plagiarism detection.
:::

## Parameters

| Parameter | Required | Description                             |
| --------- | -------- | --------------------------------------- |
| `str1`    | Yes      | The first string (max 1000 characters)  |
| `str2`    | Yes      | The second string (max 1000 characters) |

Both parameters are sent as a JSON body with `Content-Type: application/json`.

## Response Fields

| Field      | Type     | Description                                      |
| ---------- | -------- | ------------------------------------------------ |
| `str1`     | `string` | The first input string                           |
| `str2`     | `string` | The second input string                          |
| `distance` | `number` | The Levenshtein distance between the two strings |

## Code Examples

<Examples method="post" path="/levenshtein" :body="{ str1: 'example', str2: 'samples' }" />

## Try It

<Try name="Levenshtein" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                           | Description                     |
| --------------------------------------- | ------------------------------- |
| `Please provide a first string (str1)`  | The `str1` parameter is missing |
| `Please provide a second string (str2)` | The `str2` parameter is missing |
