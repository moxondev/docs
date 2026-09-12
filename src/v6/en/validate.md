# Validate

The `/validate` endpoint validates various data formats.

<Endpoint method="get" path="/validate" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter | Required | Description                              |
| --------- | -------- | ---------------------------------------- |
| `type`    | Yes      | Validation type: `luhn`, `iban`, `email` |
| `value`   | Yes      | Value to validate                        |

## Validation Types

| Type    | Description                          | Limits           |
| ------- | ------------------------------------ | ---------------- |
| `luhn`  | Luhn algorithm (credit card numbers) | 12–19 digits     |
| `iban`  | International Bank Account Number    | 15–34 characters |
| `email` | Email address format                 |                  |

## Response Fields

| Field     | Type      | Description                |
| --------- | --------- | -------------------------- |
| `valid`   | `boolean` | Whether the value is valid |
| `value`   | `string`  | The validated value        |
| `country` | `string`  | Country code (IBAN only)   |

## Code Examples

<Examples method="get" path="/validate" :params="{ type: 'email', value: 'user@example.com' }" />

## Try It

<Try name="Validate" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                             | Description                                |
| --------------------------------------------------------- | ------------------------------------------ |
| `Please provide a valid type (?type={luhn\|iban\|email})` | The `type` parameter is missing or invalid |
| `A value is required`                                     | The `value` parameter is missing           |
