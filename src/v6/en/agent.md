# User-Agent Parser

The `/agent` endpoint parses a User-Agent string and returns structured information about the browser, operating system, device, rendering engine, and whether the client is a bot. If no UA is provided, the request's own `User-Agent` header is used.

<Endpoint method="get" path="/agent" baseUrl="https://api.sylvain.sh" />

::: tip Use Cases
Detect the browser and OS of your visitors, identify bots and crawlers, serve device-specific content (mobile vs desktop), or log structured client metadata from raw User-Agent strings.
:::

## Parameters

| Parameter | Required | Description                                                                    |
| --------- | -------- | ------------------------------------------------------------------------------ |
| `ua`      | No       | Raw User-Agent string to parse. Defaults to the request's `User-Agent` header. |

## Response Fields

| Field             | Type      | Description                                                  |
| ----------------- | --------- | ------------------------------------------------------------ |
| `raw`             | `string`  | The original User-Agent string                               |
| `browser.name`    | `string`  | Detected browser name (e.g. `Chrome`, `Firefox`, `Safari`)   |
| `browser.version` | `string`  | Full browser version                                         |
| `browser.major`   | `string`  | Major version number only                                    |
| `os.name`         | `string`  | Operating system name (e.g. `macOS`, `Windows 10/11`, `iOS`) |
| `os.version`      | `string`  | OS version string                                            |
| `device.type`     | `string`  | Device category: `desktop`, `mobile`, or `tablet`            |
| `device.vendor`   | `string`  | Device manufacturer (e.g. `Apple`, `Samsung`, `Google`)      |
| `engine.name`     | `string`  | Rendering engine (e.g. `Blink`, `Gecko`, `WebKit`)           |
| `engine.version`  | `string`  | Engine version                                               |
| `bot`             | `boolean` | `true` if the UA matches a known bot or crawler pattern      |

## Code Examples

<Examples method="get" path="/agent" />

## Try It

<Try name="Agent" />

## Error Handling

| Error Message                      | Description                                                     |
| ---------------------------------- | --------------------------------------------------------------- |
| `A User-Agent string is required.` | The `ua` parameter is empty and no `User-Agent` header was sent |
