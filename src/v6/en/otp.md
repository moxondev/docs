# OTP

The `/otp` endpoint generates and verifies one-time passwords (TOTP/HOTP), compatible with Google Authenticator and Aegis.

<Endpoint method="post" path="/otp" baseUrl="https://api.sylvain.sh" />

## Parameters

The request body must be JSON:

| Parameter   | Required | Description                                                            |
| ----------- | -------- | ---------------------------------------------------------------------- |
| `action`    | Yes      | Action to perform: `secret`, `generate`, or `verify`                   |
| `secret`    | Depends  | Base32 secret key (required for `generate` and `verify`)               |
| `code`      | Depends  | OTP code to verify (required for `verify`)                             |
| `label`     | No       | Account label for the `otpauth://` URI (used with `secret` action)     |
| `issuer`    | No       | Issuer name for the `otpauth://` URI (used with `secret` action)       |
| `algorithm` | No       | HMAC algorithm: `sha1` (default), `sha256`, or `sha512`                |
| `digits`    | No       | Code length: `6` (default) or `8`                                      |
| `period`    | No       | TOTP period in seconds: `15`, `30` (default), or `60`                  |
| `counter`   | No       | HOTP counter (integer). If provided, HOTP mode is used instead of TOTP |

## Available Actions

| Action     | Description                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `secret`   | Generates a new random base32 secret and returns an `otpauth://` URI ready for QR code scanning            |
| `generate` | Generates the current OTP code. Without `counter`: TOTP (time-based). With `counter`: HOTP (deterministic) |
| `verify`   | Verifies a code with a ±1 period tolerance window. Returns `valid` and a `drift` offset (0, +1, or -1)     |

## RFC Compliance

Implements **RFC 4226** (HOTP) and **RFC 6238** (TOTP). Compatible with Google Authenticator and Aegis.

## Code Examples

<Examples method="post" path="/otp" :body="{ action: 'secret', label: 'alice', issuer: 'Demo' }" />

## Response Fields

**`secret` action:**

| Field    | Type     | Description                             |
| -------- | -------- | --------------------------------------- |
| `secret` | `string` | Base32-encoded secret key               |
| `uri`    | `string` | `otpauth://` URI for QR code generation |

**`generate` action:**

| Field  | Type     | Description        |
| ------ | -------- | ------------------ |
| `code` | `string` | Generated OTP code |
| `type` | `string` | `totp` or `hotp`   |

**`verify` action:**

| Field   | Type      | Description                        |
| ------- | --------- | ---------------------------------- |
| `valid` | `boolean` | Whether the code is valid          |
| `drift` | `number`  | Time drift detected (0, +1, or -1) |

## Try It

<Try name="OTP" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                     | Description                                  |
| ------------------------------------------------- | -------------------------------------------- |
| `Action is required`                              | The `action` parameter is missing            |
| `Action must be one of: secret, generate, verify` | The `action` value is not valid              |
| `Secret is required`                              | The `secret` parameter is missing            |
| `Code is required`                                | The `code` parameter is missing for `verify` |
| `Digits must be 6 or 8`                           | The `digits` value is not valid              |
| `Period must be one of: 15, 30, 60`               | The `period` value is not valid              |
| `Algorithm must be one of: sha1, sha256, sha512`  | The `algorithm` value is not supported       |
| `Counter must be a non-negative integer`          | The `counter` value is invalid               |
