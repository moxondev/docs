# URL Parsing

The `/url` endpoint parses a URL into its structural components: scheme, host, port, path, query parameters, and fragment. Duplicate query parameters are grouped into an array.

<Endpoint method="get" path="/url" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                                                                       |
| --------- | -------- | --------------------------------------------------------------------------------- |
| `url`     | Yes      | Absolute URL to parse, including its scheme (e.g. `https://example.com/path?a=1`) |

## Default Ports

When the URL omits the port, the scheme's default port is returned:

| Scheme  | Port |
| ------- | ---- |
| `ftp`   | 21   |
| `http`  | 80   |
| `https` | 443  |
| `ws`    | 80   |
| `wss`   | 443  |

Any other scheme returns `null`.

## Response Fields

| Field      | Type           | Description                                                                                              |
| ---------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| `url`      | `string`       | The original input URL                                                                                   |
| `scheme`   | `string`       | URL scheme without the trailing colon (e.g. `https`)                                                     |
| `host`     | `string`       | Hostname                                                                                                 |
| `port`     | `number\|null` | Port number — the scheme's default port when the URL omits it, `null` if the scheme has no known default |
| `path`     | `string`       | Path component                                                                                           |
| `params`   | `object`       | Query parameters — duplicate keys are grouped into an array                                              |
| `fragment` | `string`       | Fragment identifier without the leading `#`                                                              |
| `valid`    | `boolean`      | Always `true` for a successfully parsed URL                                                              |

## Code Examples

<Examples method="get" path="/url" :params="{ url: 'https://example.com/path?tag=js&tag=ts#section' }" />

## Try It

<Try name="URL" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                       | Description                               |
| ----------------------------------- | ----------------------------------------- |
| `Please provide a URL (?url={URL})` | The `url` parameter is missing            |
| `URL cannot exceed 2048 characters` | The `url` exceeds the maximum length      |
| `Invalid URL`                       | The `url` value cannot be parsed as a URL |
