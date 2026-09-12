# Hyperplanning

The `/hyperplanning` endpoint allows you to display a Hyperplanning schedule information in JSON format from an ICS (calendar) file.

<Endpoint method="post" path="/hyperplanning" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                                                                       |
| --------- | -------- | --------------------------------------------------------------------------------- |
| `url`     | Yes      | The URL of the ICS file to use and display. Must be URL-encoded before being sent |
| `detail`  | No       | Level of detail for events (`full` or `list`)                                     |

## Detail Options

| Option | Description                                                            |
| ------ | ---------------------------------------------------------------------- |
| `full` | Displays a complete summary with subject, teacher, classes, date, etc. |
| `list` | Displays all data in a list                                            |

## Code Examples

<Examples method="post" path="/hyperplanning" :body="{ url: 'https%3A%2F%2Fexample.com%2Ffile.ics', detail: 'full' }" />

## Response Fields

The response format depends on the `detail` parameter:

### `detail=full`

| Field     | Type       | Description                 |
| --------- | ---------- | --------------------------- |
| `summary` | `string[]` | Array of summary elements   |
| `subject` | `string`   | Subject name                |
| `teacher` | `string`   | Teacher name                |
| `classes` | `string[]` | Array of class names        |
| `type`    | `string`   | Event type                  |
| `start`   | `string`   | Event start time (ISO 8601) |
| `end`     | `string`   | Event end time (ISO 8601)   |

### `detail=list`

| Field     | Type       | Description                 |
| --------- | ---------- | --------------------------- |
| `summary` | `string[]` | Array of summary elements   |
| `start`   | `string`   | Event start time (ISO 8601) |
| `end`     | `string`   | Event end time (ISO 8601)   |

### Default (no `detail` parameter)

| Field     | Type     | Description                 |
| --------- | -------- | --------------------------- |
| `summary` | `string` | Event summary               |
| `start`   | `string` | Event start time (ISO 8601) |
| `end`     | `string` | Event end time (ISO 8601)   |

## Try It

<Try name="Hyperplanning" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                      | Description                               |
| -------------------------------------------------- | ----------------------------------------- |
| `Please provide a valid ICS file URL (?url={URL})` | The `url` parameter is missing or invalid |
