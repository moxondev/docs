# IP Analyzer

The `/ip` endpoint analyzes an IPv4 or IPv6 address and returns its type, class, binary representation, decimal value, and reverse DNS notation. If no address is provided, the client's own IP is analyzed.

<Endpoint method="get" path="/ip" baseUrl="https://api.sylvain.sh" />

::: tip Use Cases
Determine whether an IP is public or private, inspect the binary and decimal form of an address, generate the reverse DNS record for PTR lookups, or identify the address class for network planning.
:::

## Parameters

| Parameter | Required | Description                                                   |
| --------- | -------- | ------------------------------------------------------------- |
| `address` | No       | IPv4 or IPv6 address to analyze. Defaults to the client's IP. |

## Response Fields

| Field     | Type                 | Description                                                                              |
| --------- | -------------------- | ---------------------------------------------------------------------------------------- |
| `ip`      | `string`             | The analyzed IP address                                                                  |
| `version` | `"IPv4"` \| `"IPv6"` | IP protocol version                                                                      |
| `type`    | `string`             | Address type: `public`, `private`, `loopback`, `link-local`, `multicast`, or `broadcast` |
| `class`   | `string`             | IPv4 address class only: `A`, `B`, `C`, `D`, or `E`                                      |
| `range`   | `string`             | CIDR range the address belongs to (IPv4 private/special ranges)                          |
| `binary`  | `string`             | Binary representation of the address                                                     |
| `decimal` | `number`             | Decimal representation (IPv4 only)                                                       |
| `reverse` | `string`             | Reverse DNS notation (`.in-addr.arpa` for IPv4, `.ip6.arpa` for IPv6)                    |

## Code Examples

<Examples method="get" path="/ip" />

## Try It

<Try name="IP" />

## Error Handling

| Error Message         | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| `Invalid IP address.` | The `address` parameter is not a valid IPv4 or IPv6 address |
