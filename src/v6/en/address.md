# Address Generation

The `/address` endpoint generates one or more fictional postal addresses for a given country. Each address includes a street, city, zip code, region, and country name. If no country is specified, one is picked at random.

<Endpoint method="get" path="/address" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                                                                         |
| --------- | -------- | ----------------------------------------------------------------------------------- |
| `country` | No       | Country code: `fr`, `us`, `uk`, `de`, or `es`. Case-insensitive. Random if omitted. |
| `count`   | No       | Number of addresses to generate (1–10). Default: `1`.                               |

## Response Fields

| Field                     | Type       | Description                                                                    |
| ------------------------- | ---------- | ------------------------------------------------------------------------------ |
| `addresses`               | `object[]` | List of generated address objects                                              |
| `addresses[].street`      | `string`   | House number, street name and type — word order depends on country (see below) |
| `addresses[].city`        | `string`   | City name                                                                      |
| `addresses[].zip`         | `string`   | Postal/zip code formatted for the country                                      |
| `addresses[].state`       | `string`   | Region or state name                                                           |
| `addresses[].country`     | `string`   | Full country name (e.g. `France`, `United States`)                             |
| `addresses[].countryCode` | `string`   | Uppercased country code (e.g. `FR`, `US`)                                      |

## Supported Countries

| Code | Country        | Zip format example | Street word order    |
| ---- | -------------- | ------------------ | -------------------- |
| `fr` | France         | `75001`            | number + type + name |
| `us` | United States  | `90210`            | number + name + type |
| `uk` | United Kingdom | `AB1 2CD`          | number + name + type |
| `de` | Germany        | `10115`            | number + name + type |
| `es` | Spain          | `28001`            | number + type + name |

`us`, `uk`, and `de` addresses put the street type last (e.g. `42 Main Street`), while `fr` and `es` put it right after the number (e.g. `12 Rue de Paris`).

## Code Examples

<Examples method="get" path="/address" />

## Try It

<Try name="Address" />

## Error Handling

| Error Message                                              | Description                                       |
| ---------------------------------------------------------- | ------------------------------------------------- |
| `Unknown country code "xx". Supported: fr, us, uk, de, es` | The `country` parameter is not a supported code   |
| `Count must be between 1 and 10`                           | The `count` parameter is out of the allowed range |
| `Please provide a valid count (&count={n})`                | The `count` parameter is not a valid number       |
