# API Information

The `/infos` endpoint provides general information about the [API](https://api.moxon.dev). This endpoint does not require any options.

<Endpoint method="get" path="/infos" baseUrl="https://api.moxon.dev" />

## Parameters

This endpoint does not require any parameters. It returns the API metadata: endpoint count, current version, documentation link and creation date.

## Response Fields

| Field           | Type     | Description                         |
| --------------- | -------- | ----------------------------------- |
| `endpoints`     | `number` | Total number of available endpoints |
| `last_version`  | `string` | Current API version                 |
| `documentation` | `string` | Documentation URL                   |
| `github`        | `string` | GitHub repository URL               |
| `creation`      | `string` | API creation date                   |

## Code Examples

<Examples method="get" path="/infos" />

## Try It

<Try name="Infos" />
