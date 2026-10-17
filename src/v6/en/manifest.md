# Manifest (experimental)

The **`@moxon/api/manifest`** subpath of the [npm package](/v6/en/#using-the-npm-package) describes the HTTP endpoints as data: method, path, category, parameters and a request example. It is meant for tools that document or call the API, such as a documentation sidebar, parameter lists or a playground.

::: warning Experimental
The manifest is experimental: its shape may still change in a minor version. For now it only lists the endpoints already declared as contracts (`hash` for now), so it must not be mistaken for the complete list of the API.
:::

## Import

```js
import { manifest } from '@moxon/api/manifest';
```

`manifest` is an array of `ManifestEntry`, one per declared endpoint. Like the library imports, it works from ESM and from CommonJS (Node.js 22.12 or newer).

## Entry Fields

Each entry describes one endpoint, without its run function (`run`): the manifest only holds data.

| Field      | Type                                                                                     | Description                                                                       |
| ---------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `name`     | `string`                                                                                 | Endpoint identifier (for example `hash`)                                          |
| `method`   | `'get' \| 'post'`                                                                        | HTTP method, in lowercase                                                         |
| `path`     | `string`                                                                                 | Path without the version prefix (for example `/hash`)                             |
| `category` | `'security' \| 'text' \| 'images' \| 'compute' \| 'fakeData' \| 'network' \| 'realtime'` | Documentation category                                                            |
| `since`    | `number`                                                                                 | First API version serving the endpoint (for example `5`) — absent if all serve it |
| `params`   | `Record<string, Param>`                                                                  | Endpoint parameters, keyed by name                                                |
| `example`  | `Record<string, string>`                                                                 | Sample input, whose values are strings                                            |

Each parameter in `params` is a `Param` object, all of whose fields are optional:

| Field      | Type                | Description                                                               |
| ---------- | ------------------- | ------------------------------------------------------------------------- |
| `required` | `boolean`           | The parameter is mandatory                                                |
| `missing`  | `string`            | Exact `400` error message returned when this required parameter is absent |
| `options`  | `readonly string[]` | Accepted values                                                           |
| `default`  | `string`            | Value used when the parameter is omitted                                  |

The `Category` and `Param` types are not exported by name: in TypeScript, reach them through `ManifestEntry['category']` and `ManifestEntry['params'][string]`.

## Current Content

Only the [POST /hash](/v6/en/hash) endpoint is declared for now. Here is the entry as the package exports it:

```json
[
    {
        "name": "hash",
        "method": "post",
        "path": "/hash",
        "category": "security",
        "params": {
            "text": { "required": true, "missing": "Please provide a text (?text={text})" },
            "method": { "required": true, "missing": "Please provide a valid hash algorithm (&method={algorithm})" },
            "encoding": { "options": ["hex", "base64"], "default": "hex" }
        },
        "example": { "text": "hello", "method": "sha256" }
    }
]
```

This entry has no `since` field: the endpoint is served by every version, from v4 to v6.

Declaring an endpoint as a contract does not change its behavior: the HTTP routes and the manifest are built from the same declaration, so they cannot drift apart, and `/hash` answers exactly the same from v4 to v6. The other endpoints are still hand-written and will join the manifest one by one.

## Usage Examples

Find the `hash` entry and read its information:

```js
import { manifest } from '@moxon/api/manifest';

const hash = manifest.find((entry) => entry.name === 'hash');
console.log(hash.method, hash.path); // 'post' '/hash'
console.log(Object.keys(hash.params)); // ['text', 'method', 'encoding']
console.log(hash.example); // { text: 'hello', method: 'sha256' }
```

Call the API from an entry. The parameters of a `post` endpoint go in the JSON body; for a `get` endpoint, they would go in the query string.

```js
import { manifest } from '@moxon/api/manifest';

const entry = manifest.find((item) => item.name === 'hash');

const response = await fetch(`https://api.moxon.dev/v6${entry.path}`, {
    method: entry.method.toUpperCase(),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry.example),
});

console.log(await response.json());
// {
//     method: 'sha256',
//     hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
//     encoding: 'hex'
// }
```

## See Also

- [POST /hash](/v6/en/hash) - The endpoint currently described by the manifest
- [Using the npm package](/v6/en/#using-the-npm-package) - Installation and available imports
