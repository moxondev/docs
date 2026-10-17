# Getting Started

<Banner />

Welcome to the **moxon API v6** documentation. This API provides a comprehensive collection of utility endpoints for developers.

## Base URL

All API requests should be made to:

```
https://api.moxon.dev/v6
```

## Quick Example

<Try name="Infos" auto-send />

## Using the npm package

The HTTP API available at `https://api.moxon.dev` needs no package: a plain request is enough. The **`@moxon/api`** npm package is useful to call the same utilities straight from Node.js, without going through the network.

```bash
npm install @moxon/api
```

The package requires **Node.js 22.12 or newer**. It ships as ESM, but remains usable from CommonJS: Node has been able to `require()` an ESM module since 22.12, which is why that is the floor.

```js
import { evaluate } from '@moxon/api'; // ESM
const { evaluate } = require('@moxon/api'); // CommonJS
```

### Available imports

The root import always resolves to the latest version. Use a subpath (`/v4` to `/v6`) to pin a specific one.

| Import                | Contents                                                        |
| --------------------- | --------------------------------------------------------------- |
| `@moxon/api`          | Latest version, equivalent to `@moxon/api/v6`                   |
| `@moxon/api/v4`       | The v4 functions                                                |
| `@moxon/api/v5`       | The v5 functions                                                |
| `@moxon/api/v6`       | The v6 functions                                                |
| `@moxon/api/server`   | The API's HTTP server, with all its versions, started on import |
| `@moxon/api/manifest` | Description of the endpoints as data (**experimental**)         |

The server loads its plugins asynchronously: from CommonJS, it must be imported rather than required.

```js
await import('@moxon/api/server'); // from CommonJS
```

### Usage example

```js
// Latest version, equivalent to '@moxon/api/v6'
import { color, evaluate, username } from '@moxon/api';

// Or a specific version
import { color as colorV4 } from '@moxon/api/v4';

// Evaluate a math expression
const expr = evaluate('sin(pi / 2) + sqrt(4)', 5);
console.log(expr.result); // 3
console.log(expr.expression); // 'sin(pi / 2) + sqrt(4)'

// Generate a random color, converted to every common notation
const c = color();
console.log(c.hex, c.rgb, c.hsl, c.hsv, c.hwb, c.cmyk);

// Generate a random username
const user = username();
console.log(user.username);
```

::: tip Tip
To describe the endpoints as data (method, path, parameters, example), see the [Manifest](/v6/en/manifest), an experimental export of the package. If your project still uses the former package name, the [migration guide](/v6/en/changelog#migrating-from-20syldev-api) explains the rename.
:::

## Rate Limiting

Some endpoints have rate limiting to prevent abuse. If you exceed the [rate limit](/v6/en/pricing), you'll receive an error response:

```json
{
    "message": "Too Many Requests",
    "error": "You have exceeded the limit of 2000 requests per hour.",
    "status": 429
}
```

Depending on the endpoint and limiter, the error message may also be:

- `Global rate limit exceeded.`
- `Rate limit exceeded. Try again in X seconds.`

## Error Handling

::: warning Changed in 6.0.0
`status` is now a **number**. It used to be a string (`"400"`), it is now `400`. A client comparing it to a string will stop matching.
:::

All endpoints return consistent error responses:

```json
{
    "message": "Bad Request",
    "error": "Description of the error",
    "status": 400
}
```

Requesting an endpoint that doesn't exist also returns a structured JSON error:

```json
{
    "message": "Not Found",
    "error": "Endpoint '/v6/doesnotexist' does not exist.",
    "status": 404
}
```

## Other Versions

- [v5 Documentation](/v5/en/) - Previous stable version
- [v4 Documentation](/v4/en/) - Legacy version
