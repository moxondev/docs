# API Information

The `/infos` endpoint provides general information about the [API](https://api.moxon.dev). This endpoint does not require any options.

<Endpoint method="get" path="/infos" baseUrl="https://api.moxon.dev" />

## Parameters

This endpoint does not require any parameters. It returns the API metadata: endpoint count and current version. The documentation link, GitHub repository and creation date are only returned when the instance is configured with them.

## Response Fields

| Field           | Type     | Description                                                                 |
| --------------- | -------- | --------------------------------------------------------------------------- |
| `endpoints`     | `number` | Number of endpoints of the requested version (see below for what it counts) |
| `last_version`  | `string` | Latest API version, whatever the version requested                          |
| `documentation` | `string` | Documentation URL — absent if the instance does not set `DOCS_URL`          |
| `github`        | `string` | GitHub repository URL — absent if the instance does not set `REPO_URL`      |
| `creation`      | `string` | API creation date — absent if the instance does not set `INSTANCE_CREATED`  |

::: info What the endpoint count includes
`endpoints` counts the **distinct paths** of the requested version, whatever the method. A path shared by a `GET` and a `POST` with exactly the same form is counted once, like `/chat`. It is therefore not the number of method + path pairs: in v6, `/infos` announces 56 endpoints while 57 method + path pairs are served, because `GET /chat` and `POST /chat` count as one.

Paths are compared as the API declares them, query parameters included: `GET /pow` and `POST /pow` therefore count as two.
:::

## Code Examples

<Examples method="get" path="/infos" />

## Try It

<Try name="Infos" />
