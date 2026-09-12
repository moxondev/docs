# Text Comparison

The `/diff` endpoint compares two texts and returns an ordered list of changes, line by line or word by word.

<Endpoint method="post" path="/diff" baseUrl="https://api.sylvain.sh" />

::: info How it works?
The comparison relies on the Longest Common Subsequence (LCS) algorithm: it finds the largest set of segments shared by both texts in the same order, and everything outside that set is reported as added or removed. In `line` mode the texts are split on newlines, keeping empty lines; in `word` mode they are split on whitespace runs and empty segments are dropped.
:::

## Parameters

The request body must be JSON:

| Parameter | Required | Description                                               |
| --------- | -------- | --------------------------------------------------------- |
| `a`       | Yes      | Original text                                             |
| `b`       | Yes      | Modified text, compared against `a`                       |
| `mode`    | No       | Comparison granularity: `line` or `word`. Default: `line` |

## Available Modes

| Mode   | Description                                               |
| ------ | --------------------------------------------------------- |
| `line` | Splits both texts on newlines and compares line by line   |
| `word` | Splits both texts on whitespace and compares word by word |

## Response Fields

| Field     | Type       | Description                             |
| --------- | ---------- | --------------------------------------- |
| `mode`    | `string`   | Granularity used: `line` or `word`      |
| `added`   | `number`   | Number of segments present only in `b`  |
| `removed` | `number`   | Number of segments present only in `a`  |
| `changes` | `object[]` | Ordered changes rebuilding `b` from `a` |

**`changes` entries:**

| Field   | Type     | Description                             |
| ------- | -------- | --------------------------------------- |
| `type`  | `string` | `equal`, `add` or `del`                 |
| `value` | `string` | The line or word this change applies to |

## Code Examples

<Examples method="post" path="/diff" :body="{ a: 'line1\nline2', b: 'line1\nline2 edited' }" />

## Try It

<Try name="Diff" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                             | Description                                         |
| ----------------------------------------- | --------------------------------------------------- |
| `Please provide a first text (a={text})`  | The `a` parameter is missing or is not a string     |
| `Please provide a second text (b={text})` | The `b` parameter is missing or is not a string     |
| `Texts must be 10000 characters or fewer` | `a` or `b` exceeds the maximum length               |
| `Mode must be one of: line, word`         | The `mode` value is not `line` or `word`            |
| `Texts must contain 2000 lines or fewer`  | A text has more lines than the limit in `line` mode |
| `Texts must contain 2000 words or fewer`  | A text has more words than the limit in `word` mode |
