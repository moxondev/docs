# Time Information

The `/time` endpoint allows you to retrieve time information based on various parameters. You can get the current time or a random time between a specified range, in different formats and time zones.

<Endpoint method="get" path="/time" />

## Parameters

| Parameter  | Required | Description                                                 |
| ---------- | -------- | ----------------------------------------------------------- |
| `type`     | No       | `live` (default) for current time, `random` for random time |
| `start`    | No       | Start date for random range (format: `YYYY-MM-DD`)          |
| `end`      | No       | End date for random range (format: `YYYY-MM-DD`)            |
| `format`   | No       | Response format (see options below)                         |
| `timezone` | No       | Time zone to use (see options below)                        |

## Format Options

| Format           | Description                 |
| ---------------- | --------------------------- |
| `iso`            | ISO 8601 format (default)   |
| `timestamp`      | Unix timestamp              |
| `locale`         | Local format                |
| `date`           | Date in `MM/DD/YYYY` format |
| `time`           | Time in `HH:MM:SS` format   |
| `year`           | Year only                   |
| `month`          | Month only                  |
| `day`            | Day only                    |
| `hour`           | Hour only                   |
| `minute`         | Minutes only                |
| `second`         | Seconds only                |
| `ms`             | Milliseconds only           |
| `dayOfWeek`      | Day of the week (0-6)       |
| `dayOfYear`      | Day of the year (1-365/366) |
| `weekNumber`     | Week number                 |
| `timezone`       | Time zone name              |
| `timezoneOffset` | Time zone offset            |

## Timezone Options

| Timezone           | Description                          |
| ------------------ | ------------------------------------ |
| `UTC`              | Coordinated Universal Time (default) |
| `Europe/Paris`     | Paris time zone                      |
| `America/New_York` | New York time zone                   |
| `Asia/Tokyo`       | Tokyo time zone                      |
| `Australia/Sydney` | Sydney time zone                     |

## Request Examples

### Current Time (All Formats)

```
GET /v3/time
```

```json
{
    "iso": "2000-01-01T12:00:00.000Z",
    "utc": "Sat, 01 Jan 2000 12:00:00 GMT",
    "timestamp": 946724400,
    "locale": "1/1/2000, 12:00:00 PM Coordinated Universal Time",
    "date": "3/3/2000",
    "time": "12:00:00 PM",
    "year": 2000,
    "month": 1,
    "day": 1,
    "hour": 12,
    "minute": 0,
    "second": 0,
    "ms": 0,
    "dayOfWeek": 6,
    "dayOfYear": 1,
    "weekNumber": 1,
    "timezone": "UTC",
    "timezoneOffset": 0
}
```

### Random Time with Specific Format

```bash
curl -X GET "https://api.moxon.dev/v3/time?type=random&format=locale&timezone=America/New_York"
```

```json
{
    "date": "7/28/2024, 5:06:52 AM Eastern Standard Time"
}
```

## Error Handling

If parameters are invalid, the API will return an error:

| Error Message                                             | Description                         |
| --------------------------------------------------------- | ----------------------------------- |
| `Please provide a valid type (?type={type})`              | The `type` parameter is invalid     |
| `Please provide a valid start date (?start={YYYY-MM-DD})` | The `start` parameter is invalid    |
| `Please provide a valid end date (?end={YYYY-MM-DD})`     | The `end` parameter is invalid      |
| `Please provide a valid format (?format={format})`        | The `format` parameter is invalid   |
| `Please provide a valid timezone (?timezone={timezone})`  | The `timezone` parameter is invalid |
