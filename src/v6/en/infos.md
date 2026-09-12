# API Information

The `/infos` endpoint provides general information about the [API](https://api.sylvain.sh). This endpoint does not require any options.

<Endpoint method="get" path="/infos" baseUrl="https://api.sylvain.sh" />

## Parameters

This endpoint does not require any parameters. It returns the API metadata: endpoint count and current version. The documentation link, GitHub repository and creation date are only returned when the instance is configured with them.

## Response Fields

| Field           | Type     | Description                                                                |
| --------------- | -------- | -------------------------------------------------------------------------- |
| `endpoints`     | `number` | Total number of available endpoints                                        |
| `last_version`  | `string` | Current API version                                                        |
| `documentation` | `string` | Documentation URL — absent if the instance does not set `DOCS_URL`         |
| `github`        | `string` | GitHub repository URL — absent if the instance does not set `REPO_URL`     |
| `creation`      | `string` | API creation date — absent if the instance does not set `INSTANCE_CREATED` |

## Code Examples

<Examples method="get" path="/infos" />

## Try It

<Try name="Infos" />
