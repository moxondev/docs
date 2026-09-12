# Time Information

The `/time` endpoint allows you to retrieve time information based on various parameters. You can get the current time or a random time between a specified range, in different formats and time zones.

<Endpoint method="get" path="/time" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter  | Required | Description                                                                                        |
| ---------- | -------- | -------------------------------------------------------------------------------------------------- |
| `type`     | No       | `live` (default) for current time, `random` for a random time, `countdown` for time until a target |
| `start`    | No       | Start date for `random` range (format: `YYYY-MM-DD`)                                               |
| `end`      | No       | End date for `random` range (format: `YYYY-MM-DD`)                                                 |
| `target`   | No       | Target date for `countdown` mode (format: `YYYY-MM-DD` or ISO 8601)                                |
| `format`   | No       | Response format (see options below)                                                                |
| `timezone` | No       | Time zone to use (see options below)                                                               |

## Format Options

| Format       | Description                 |
| ------------ | --------------------------- |
| `iso`        | ISO 8601 format (default)   |
| `utc`        | UTC format                  |
| `timestamp`  | Unix timestamp              |
| `locale`     | Local format                |
| `date`       | Date in `MM/DD/YYYY` format |
| `time`       | Time in `HH:MM:SS` format   |
| `year`       | Year only                   |
| `month`      | Month only                  |
| `day`        | Day only                    |
| `hour`       | Hour only                   |
| `minute`     | Minutes only                |
| `second`     | Seconds only                |
| `ms`         | Milliseconds only           |
| `dayOfWeek`  | Day of the week (0-6)       |
| `dayOfYear`  | Day of the year (1-365/366) |
| `weekNumber` | Week number                 |
| `timezone`   | Time zone name              |

## Timezone Options

| Timezone           | Description                          |
| ------------------ | ------------------------------------ |
| `UTC`              | Coordinated Universal Time (default) |
| `Europe/Paris`     | Paris time zone                      |
| `America/New_York` | New York time zone                   |
| `Asia/Tokyo`       | Tokyo time zone                      |
| `Australia/Sydney` | Sydney time zone                     |

## Response Fields

| Field            | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `iso`            | `string` | Date in ISO 8601 format        |
| `utc`            | `string` | Date in UTC string format      |
| `timestamp`      | `number` | Unix timestamp                 |
| `locale`         | `string` | Localized date and time string |
| `date`           | `string` | Date in MM/DD/YYYY format      |
| `time`           | `string` | Time in HH:MM:SS format        |
| `year`           | `number` | Year                           |
| `month`          | `number` | Month (1-12)                   |
| `day`            | `number` | Day of the month               |
| `hour`           | `number` | Hour (0-23)                    |
| `minute`         | `number` | Minutes                        |
| `second`         | `number` | Seconds                        |
| `ms`             | `number` | Milliseconds                   |
| `dayOfWeek`      | `number` | Day of the week (0-6)          |
| `dayOfYear`      | `number` | Day of the year (1-365/366)    |
| `weekNumber`     | `number` | Week number of the year        |
| `timezone`       | `string` | Time zone name                 |
| `timezoneOffset` | `string` | UTC offset of the time zone    |

## Code Examples

<Examples method="get" path="/time" :params="{ type: 'random', format: 'locale', timezone: 'America/New_York' }" />

## Try It

<Try name="Time" />

## Error Handling

If parameters are invalid, the API will return an error:

| Error Message                                             | Description                         |
| --------------------------------------------------------- | ----------------------------------- |
| `Please provide a valid type (?type={type})`              | The `type` parameter is invalid     |
| `Please provide a valid start date (?start={YYYY-MM-DD})` | The `start` parameter is invalid    |
| `Please provide a valid end date (?end={YYYY-MM-DD})`     | The `end` parameter is invalid      |
| `Please provide a valid target date (?target=...)`        | The `target` parameter is invalid   |
| `Please provide a valid format (?format={format})`        | The `format` parameter is invalid   |
| `Please provide a valid timezone (?timezone={timezone})`  | The `timezone` parameter is invalid |
