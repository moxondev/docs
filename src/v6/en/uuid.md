# UUID Generation

The `/uuid` endpoint generates random UUID v4 values, or parses an existing UUID to extract its version and variant.

<Endpoint method="get" path="/uuid" baseUrl="https://api.sylvain.sh" />

::: info How it works?
The endpoint has two modes. When `uuid` is provided, it switches to parsing and `count` is ignored. Otherwise it generates `count` random UUID v4 values (a single one by default). A malformed UUID is not an error: it is returned with `valid: false` and `null` components.
:::

## Parameters

| Parameter | Required | Description                                                               |
| --------- | -------- | ------------------------------------------------------------------------- |
| `uuid`    | No       | UUID to parse. When provided, nothing is generated and `count` is ignored |
| `count`   | No       | Number of UUIDs to generate, an integer between 1 and 50. Default: `1`    |

## UUID Variants

The variant is derived from the first character of the fourth group:

| Character | Variant     |
| --------- | ----------- |
| `0` – `7` | `NCS`       |
| `8` – `b` | `RFC 4122`  |
| `c` – `d` | `Microsoft` |
| `e` – `f` | `Future`    |

## Response Fields

**Single UUID (generated, or `count` of 1):**

| Field     | Type     | Description                              |
| --------- | -------- | ---------------------------------------- |
| `uuid`    | `string` | The generated UUID                       |
| `version` | `number` | UUID version — always `4` when generated |
| `variant` | `string` | Always `RFC 4122` when generated         |

**Batch (`count` greater than 1):**

| Field   | Type       | Description                       |
| ------- | ---------- | --------------------------------- |
| `uuids` | `string[]` | Array of generated UUID v4 values |
| `count` | `number`   | Number of UUIDs returned          |

**Parsing (`uuid` provided):**

| Field     | Type           | Description                                           |
| --------- | -------------- | ----------------------------------------------------- |
| `uuid`    | `string`       | The original input UUID                               |
| `version` | `number\|null` | UUID version, `null` if the input is not a valid UUID |
| `variant` | `string\|null` | UUID variant, `null` if the input is not a valid UUID |
| `valid`   | `boolean`      | Whether the input matches the UUID format             |

## Code Examples

<Examples method="get" path="/uuid" :params="{ count: '3' }" />

## Try It

<Try name="UUID" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                | Description                                          |
| -------------------------------------------- | ---------------------------------------------------- |
| `Please provide a valid UUID (?uuid={uuid})` | The `uuid` parameter is not a single string value    |
| `Count must be a number`                     | The `count` value is not a number                    |
| `Count must be between 1 and 50`             | The `count` value is not an integer between 1 and 50 |
