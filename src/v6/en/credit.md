# Credit Card Generation

The `/credit` endpoint generates fictitious credit card numbers for testing purposes. All numbers pass the Luhn checksum algorithm and use correct IIN prefixes per brand.

<Endpoint method="get" path="/credit" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Default  | Description                                                                    |
| --------- | -------- | -------- | ------------------------------------------------------------------------------ |
| `brand`   | No       | `random` | Card brand: `visa`, `mastercard`, `amex`, `discover`                           |
| `count`   | No       | `1`      | Number of cards to generate (1–10)                                             |
| `format`  | No       | `masked` | Output format: `full` (all digits) or `masked` (middle digits hidden with `*`) |

## Response Fields

The response contains a `cards` array. Each card object has the following fields:

| Field       | Type      | Description                                                         |
| ----------- | --------- | ------------------------------------------------------------------- |
| `number`    | `string`  | Card number, masked or full depending on `format`                   |
| `formatted` | `string`  | Human-readable card number with spaces (e.g. `4532 **** **** 1234`) |
| `brand`     | `string`  | Card brand (`visa`, `mastercard`, `amex`, `discover`)               |
| `expiry`    | `string`  | Expiration date in `MM/YY` format                                   |
| `cvv`       | `string`  | Security code (3 digits, 4 for Amex)                                |
| `luhn`      | `boolean` | Always `true` — the number passes the Luhn checksum                 |

## Code Examples

<Examples method="get" path="/credit" :params="{ brand: 'visa', count: '2', format: 'full' }" />

## Try It

<Try name="Credit" />

## Error Handling

| Error Message                                                              | Description                                       |
| -------------------------------------------------------------------------- | ------------------------------------------------- |
| `Unknown brand "{brand}". Valid options: visa, mastercard, amex, discover` | The `brand` value is not recognized               |
| `Count must be an integer between 1 and 10`                                | The `count` parameter is out of the allowed range |
| `Format must be "full" or "masked"`                                        | The `format` value is not valid                   |
