# Levenshtein Distance

The `/levenshtein` endpoint allows you to calculate the Levenshtein distance between two strings. This distance represents the minimum number of operations required to transform one string into another.

<Endpoint method="get" path="/levenshtein" />

## Parameters

| Parameter | Required | Description       |
| --------- | -------- | ----------------- |
| `str1`    | Yes      | The first string  |
| `str2`    | Yes      | The second string |

## Request Example

```
GET /v3/levenshtein?str1=example&str2=samples
```

## Response

```json
{
    "str1": "example",
    "str2": "samples",
    "distance": 3
}
```

## Response Fields

| Field      | Description                                      |
| ---------- | ------------------------------------------------ |
| `str1`     | The first input string                           |
| `str2`     | The second input string                          |
| `distance` | The Levenshtein distance between the two strings |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/levenshtein?str1=example&str2=samples"
```

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                     | Description                     |
| ------------------------------------------------- | ------------------------------- |
| `Please provide a first string (?str1={string})`  | The `str1` parameter is missing |
| `Please provide a second string (&str2={string})` | The `str2` parameter is missing |

## About Levenshtein Distance

The Levenshtein distance is a measure of the similarity between two strings. It counts the minimum number of single-character edits (insertions, deletions, or substitutions) required to change one string into the other. This is useful for:

- Spell checking
- DNA sequence analysis
- Fuzzy string matching
- Plagiarism detection
