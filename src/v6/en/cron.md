# Cron Expression Parser

The `/cron` endpoint parses a 5-field cron expression and returns a human-readable description along with the next scheduled execution timestamps.

<Endpoint method="get" path="/cron" baseUrl="https://api.sylvain.sh" />

::: tip Use Cases
Preview upcoming job runs before scheduling a task, display a human-readable description of a cron expression in a UI, debug cron timing issues across time zones, or validate that an expression fires at the expected intervals.
:::

## Parameters

| Parameter  | Required | Default | Description                                                                    |
| ---------- | -------- | ------- | ------------------------------------------------------------------------------ |
| `expr`     | Yes      |         | 5-field cron expression (`minute hour dom month dow`). Example: `*/5 * * * *`. |
| `count`    | No       | `5`     | Number of upcoming execution timestamps to return (1–20).                      |
| `from`     | No       | now     | Start date for computing next runs (ISO 8601). Defaults to the current time.   |
| `timezone` | No       | `UTC`   | IANA timezone for computing and formatting timestamps (e.g. `Europe/Paris`).   |

## Response Fields

| Field         | Type       | Description                                                           |
| ------------- | ---------- | --------------------------------------------------------------------- |
| `expression`  | `string`   | The cron expression as provided                                       |
| `description` | `string`   | Human-readable description (e.g. `Every 5 minutes`, `At 09:00 daily`) |
| `timezone`    | `string`   | Timezone used for computation                                         |
| `next`        | `string[]` | Array of next execution timestamps in ISO 8601 format                 |

## Code Examples

<Examples method="get" path="/cron" :params="{ expr: '0 9 * * 1-5' }" />

## Try It

<Try name="Cron" />

## Error Handling

| Error Message                                      | Description                                           |
| -------------------------------------------------- | ----------------------------------------------------- |
| `Please provide a cron expression (?expr=...)`     | The `expr` parameter is missing                       |
| `Invalid cron expression`                          | The expression does not match the 5-field cron format |
| `Count must be between 1 and 20`                   | The `count` parameter is out of the allowed range     |
| `Please provide a valid count (&count={n})`        | The `count` parameter is not a valid number           |
| `Please provide a valid ISO 8601 date (?from=...)` | The `from` parameter is not a valid ISO 8601 date     |
| `Please provide a valid timezone (?timezone=...)`  | The `timezone` parameter is not a valid IANA timezone |
