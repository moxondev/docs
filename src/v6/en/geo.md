# Geo

The `/geo` endpoint calculates the distance and bearing between two GPS coordinates using the Haversine formula.

<Endpoint method="get" path="/geo" baseUrl="https://api.sylvain.sh" />

::: info How it works?
The Haversine formula computes the great-circle distance between two points on a sphere — the shortest path over the Earth's surface, ignoring elevation. Bearing is the initial compass heading from point A to point B, expressed in degrees (0° = North) and as a cardinal direction.
:::

## Parameters

| Parameter | Required | Description                      |
| --------- | -------- | -------------------------------- |
| `lat1`    | Yes      | Latitude of point A (-90/+90)    |
| `lon1`    | Yes      | Longitude of point A (-180/+180) |
| `lat2`    | Yes      | Latitude of point B (-90/+90)    |
| `lon2`    | Yes      | Longitude of point B (-180/+180) |

## Response Fields

| Field                    | Type     | Description                                   |
| ------------------------ | -------- | --------------------------------------------- |
| `distance.km`            | `number` | Distance in kilometers                        |
| `distance.miles`         | `number` | Distance in miles                             |
| `distance.nauticalMiles` | `number` | Distance in nautical miles                    |
| `bearing.degrees`        | `number` | Bearing in degrees (0–360)                    |
| `bearing.cardinal`       | `string` | Cardinal direction (N, NNE, NE, ENE, E, etc.) |
| `from.lat`               | `number` | Parsed latitude of point A                    |
| `from.lon`               | `number` | Parsed longitude of point A                   |
| `to.lat`                 | `number` | Parsed latitude of point B                    |
| `to.lon`                 | `number` | Parsed longitude of point B                   |

## Code Examples

<Examples method="get" path="/geo" :params="{ lat1: '48.8566', lon1: '2.3522', lat2: '43.2965', lon2: '5.3698' }" />

## Try It

<Try name="Geo" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                       | Description                        |
| ----------------------------------- | ---------------------------------- |
| `lat1 must be a number`             | A coordinate is not a valid number |
| `lat1 must be between -90 and 90`   | Latitude is out of range           |
| `lon1 must be between -180 and 180` | Longitude is out of range          |
