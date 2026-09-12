# Chart

The `/chart` endpoint generates charts from data. It supports bar, line, pie, and donut chart types, and returns either an SVG image or raw JSON data.

<Endpoint method="post" path="/chart" baseUrl="https://api.sylvain.sh" />

## Parameters

The request body must be JSON:

| Parameter | Required | Description                                                                |
| --------- | -------- | -------------------------------------------------------------------------- |
| `type`    | Yes      | Chart type: `bar`, `line`, `pie`, or `donut`                               |
| `data`    | Yes      | Chart data object (see structure below)                                    |
| `title`   | No       | Chart title displayed above the chart                                      |
| `width`   | No       | SVG width in pixels (responsive if omitted)                                |
| `height`  | No       | SVG height in pixels (responsive if omitted)                               |
| `colors`  | No       | Array of hex colors for datasets (defaults to a built-in palette)          |
| `bg`      | No       | Background fill color (hex, transparent if omitted)                        |
| `legend`  | No       | Show legend: `true` (default) or `false`                                   |
| `mode`    | No       | Response format: `"svg"` (default, returns SVG) or `"data"` (returns JSON) |

## Data Format

`data` must be a **JSON object** (not a string) in the request body. The structure depends on the chart type.

**Bar and line charts:**

```json
{
    "labels": ["Jan", "Feb", "Mar"],
    "datasets": [
        { "label": "Sales", "values": [120, 200, 150] },
        { "label": "Costs", "values": [80, 95, 110] }
    ]
}
```

**Pie and donut charts:**

```json
{
    "labels": ["Jan", "Feb", "Mar"],
    "values": [120, 200, 150]
}
```

- `labels`: array of strings — max **20** labels
- `datasets` (bar/line): array of dataset objects — max **5** datasets, each with a `label` and a `values` array matching the length of `labels`
- `values` (pie/donut): single array of non-negative numbers matching the length of `labels`

> The `data` field must be a JSON object, not a JSON string. Send the request with `Content-Type: application/json`.

## Response

- When `mode` is `"svg"` (default): returns `Content-Type: image/svg+xml` with the SVG body
- When `mode` is `"data"`: returns a JSON object with the chart data

## Code Examples

<Examples method="post" path="/chart" :body="{ type: 'bar', data: { labels: ['Jan','Feb','Mar'], datasets: [{ label: 'Sales', values: [120,200,150] }] }, title: 'Monthly Sales' }" />

## Try It

<Try name="Chart" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                                     | Description                                |
| ----------------------------------------------------------------- | ------------------------------------------ |
| `Please provide a valid chart type (?type=bar\|line\|pie\|donut)` | The `type` parameter is missing or invalid |
| `data must contain a labels array`                                | The `data.labels` field is missing         |
| `data must contain a datasets array`                              | The `data.datasets` field is missing       |
| `Too many labels (max 20)`                                        | The labels array exceeds 20 entries        |
| `Too many datasets (max 5)`                                       | The datasets array exceeds 5 entries       |
| `Each dataset must have the same number of values as labels`      | Dataset length mismatch                    |
