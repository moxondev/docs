# Readability Analysis

The `/read` endpoint analyzes a text and returns its word, sentence and syllable counts, its Flesch readability scores and an estimated reading time.

<Endpoint method="post" path="/read" baseUrl="https://api.sylvain.sh" />

::: info How it works?
English uses the original Flesch coefficients, which also give a Flesch-Kincaid grade level. French uses the Kandel & Moles adaptation, which has no grade-level counterpart, so `fleschKincaidGrade` is `null`.

Syllables are estimated with a per-language heuristic: groups of vowels, minus the silent trailing `e` (`e` or `es` in French), with a minimum of one syllable per word. Sentences are split on `.`, `!`, `?` and `…`, and a text without any of them counts as a single sentence. Reading time is based on 200 words per minute.
:::

## Parameters

The request body must be JSON:

| Parameter | Required | Description                                       |
| --------- | -------- | ------------------------------------------------- |
| `text`    | Yes      | Text to analyze, 50000 characters maximum         |
| `lang`    | No       | Language of the text: `en` or `fr`. Default: `en` |

## Response Fields

| Field                | Type           | Description                                                                    |
| -------------------- | -------------- | ------------------------------------------------------------------------------ |
| `lang`               | `string`       | Language used for the analysis                                                 |
| `words`              | `number`       | Number of words — tokens containing at least one letter or digit               |
| `sentences`          | `number`       | Number of sentences, always at least `1`                                       |
| `syllables`          | `number`       | Estimated total number of syllables                                            |
| `fleschReadingEase`  | `number`       | Flesch reading ease, rounded to 2 decimals — the higher, the easier to read    |
| `fleschKincaidGrade` | `number\|null` | Flesch-Kincaid grade level, rounded to 2 decimals — `null` when `lang` is `fr` |
| `readingTime`        | `string`       | Estimated reading time, in seconds below a minute (e.g. `45s`, `3min`)         |

## Code Examples

<Examples method="post" path="/read" :body="{ text: 'The cat sat on the mat. It was happy.', lang: 'en' }" />

## Try It

<Try name="Read" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                            | Description                                                 |
| ---------------------------------------- | ----------------------------------------------------------- |
| `Please provide a text`                  | The `text` parameter is missing, empty, or contains no word |
| `Text must be 50000 characters or fewer` | The `text` exceeds the maximum length                       |
| `Language must be one of: en, fr`        | The `lang` value is neither `en` nor `fr`                   |
