# Password Generation

The `/password` endpoint generates one or more passwords using cryptographically secure randomness (`crypto.randomInt`). Supports two modes: `random` (character-based) and `passphrase` (word-based). Each response includes the generated passwords along with their strength rating and entropy score.

<Endpoint method="get" path="/password" baseUrl="https://api.sylvain.sh" />

::: tip Use Cases
Generate secure passwords for users during account creation, produce passphrases for easier memorization, test password strength UI, or seed test fixtures with realistic credentials.
:::

## Parameters

| Parameter   | Required | Default  | Description                                                                            |
| ----------- | -------- | -------- | -------------------------------------------------------------------------------------- |
| `type`      | No       | `random` | Generation mode: `random` (character-based) or `passphrase` (word-based).              |
| `length`    | No       | `16`     | Character count for `random` mode (8–128), or word count for `passphrase` mode (3–10). |
| `uppercase` | No       | `true`   | Include uppercase letters (`A–Z`). Set to `false` to disable.                          |
| `lowercase` | No       | `true`   | Include lowercase letters (`a–z`). Set to `false` to disable.                          |
| `digits`    | No       | `true`   | Include digits (`0–9`). Set to `false` to disable.                                     |
| `symbols`   | No       | `false`  | Include symbols (`!@#$%^&*()-_=+[]{}\|;:,.<>?`). Set to `true` to enable.              |
| `exclude`   | No       | `""`     | Characters to remove from the charset (e.g. `exclude=0Ol1`).                           |
| `count`     | No       | `1`      | Number of passwords to generate (1–20).                                                |
| `separator` | No       | `-`      | Word separator for `passphrase` mode.                                                  |

## Response Fields

| Field       | Type       | Description                                                     |
| ----------- | ---------- | --------------------------------------------------------------- |
| `passwords` | `string[]` | List of generated passwords or passphrases                      |
| `type`      | `string`   | Generation mode used: `random` or `passphrase`                  |
| `length`    | `number`   | Character count (random) or word count (passphrase)             |
| `strength`  | `string`   | Strength rating: `weak`, `moderate`, `strong`, or `very_strong` |
| `entropy`   | `number`   | Shannon entropy in bits (rounded to 1 decimal place)            |

## Strength Thresholds

| Strength      | Entropy range |
| ------------- | ------------- |
| `weak`        | < 40 bits     |
| `moderate`    | 40 – 59.9     |
| `strong`      | 60 – 79.9     |
| `very_strong` | ≥ 80 bits     |

## Code Examples

<Examples method="get" path="/password" />

## Try It

<Try name="Password" />

## Error Handling

| Error Message                                | Description                                                         |
| -------------------------------------------- | ------------------------------------------------------------------- |
| `Type must be "random" or "passphrase"`      | The `type` parameter is not a supported value                       |
| `Length must be between 8 and 128`           | The `length` parameter is out of range for `random` mode            |
| `At least one character set must be enabled` | All character sets are disabled or `exclude` removed all characters |
| `Count must be between 1 and 20`             | The `count` parameter is out of the allowed range                   |
