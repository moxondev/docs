# Semantic Versioning

The `/semver` endpoint parses, bumps, and compares semantic versions following the semver.org specification.

<Endpoint method="get" path="/semver" baseUrl="https://api.sylvain.sh" />

::: info How it works?
A version must match the official grammar `MAJOR.MINOR.PATCH`, optionally followed by `-prerelease` and `+build`. Leading zeros are rejected, so `01.2.3` is invalid.

Comparison follows semver precedence: numeric parts first, then the prerelease. A version carrying a prerelease ranks below the same version without one, numeric prerelease identifiers are compared as numbers (`alpha.2` is lower than `alpha.10`), and build metadata is ignored entirely.

A bump resets the lower parts to zero and drops both the prerelease and the build metadata, so `1.0.0-alpha+build.1` bumped on `patch` gives `1.0.1`.

A `+` sign decodes as a space in a query string, so the API restores it before parsing — build metadata can be sent as-is or percent-encoded.
:::

## Parameters

| Parameter | Required | Description                                                                   |
| --------- | -------- | ----------------------------------------------------------------------------- |
| `version` | Yes      | Version to work with (e.g. `1.2.3-beta.1+build.42`)                           |
| `action`  | No       | Action to perform: `parse`, `bump` or `compare`. Default: `parse`             |
| `part`    | No       | `bump` only: part to increment, `major`, `minor` or `patch`. Default: `patch` |
| `other`   | Cond.    | Second version to compare against (required for `compare`)                    |

## Available Actions

| Action    | Description                                                |
| --------- | ---------------------------------------------------------- |
| `parse`   | Splits the version into its components                     |
| `bump`    | Increments `part` and resets the lower parts to zero       |
| `compare` | Compares `version` against `other` using semver precedence |

## Response Fields

**`parse` action:**

| Field        | Type           | Description                                                      |
| ------------ | -------------- | ---------------------------------------------------------------- |
| `version`    | `string`       | The original input version                                       |
| `major`      | `number`       | Major number                                                     |
| `minor`      | `number`       | Minor number                                                     |
| `patch`      | `number`       | Patch number                                                     |
| `prerelease` | `string\|null` | Prerelease identifiers without the leading `-`, `null` if absent |
| `build`      | `string\|null` | Build metadata without the leading `+`, `null` if absent         |

**`bump` action:**

| Field     | Type     | Description                |
| --------- | -------- | -------------------------- |
| `version` | `string` | The original input version |
| `action`  | `string` | `bump`                     |
| `part`    | `string` | Part that was incremented  |
| `result`  | `string` | The bumped version         |

**`compare` action:**

| Field         | Type     | Description                                             |
| ------------- | -------- | ------------------------------------------------------- |
| `version`     | `string` | The original input version                              |
| `action`      | `string` | `compare`                                               |
| `other`       | `string` | The version compared against                            |
| `result`      | `number` | `-1` if `version` is lower, `0` if equal, `1` if higher |
| `description` | `string` | Human-readable comparison (e.g. `1.2.3 < 1.3.0`)        |

## Code Examples

<Examples method="get" path="/semver" :params="{ version: '1.2.3-beta.1', action: 'parse' }" />

## Try It

<Try name="Semver" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                        | Description                                                      |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| `Please provide a version (?version={version})`      | The `version` parameter is missing                               |
| `Action must be one of: parse, bump, compare`        | The `action` value is not valid                                  |
| `Version must be 256 characters or fewer`            | The `version` or `other` value exceeds the maximum length        |
| `Invalid semver version`                             | The `version` or `other` value does not match the semver grammar |
| `Part must be one of: major, minor, patch`           | The `part` value is not valid for `bump`                         |
| `Please provide a second version (&other={version})` | The `other` parameter is missing for `compare`                   |
