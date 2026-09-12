# Asymmetric

The `/asymmetric` endpoint performs RSA asymmetric key generation, encryption, and decryption.

<Endpoint method="post" path="/asymmetric" baseUrl="https://api.sylvain.sh" />

## Parameters

The request body must be JSON:

| Parameter       | Required | Description                                                                                                                            |
| --------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `action`        | Yes      | Action to perform: `keygen`, `encrypt`, or `decrypt`                                                                                   |
| `text`          | Cond.    | Text to encrypt, or base64 ciphertext to decrypt                                                                                       |
| `publicKey`     | Cond.    | PEM public key (required for `encrypt`)                                                                                                |
| `privateKey`    | Cond.    | PEM private key (required for `decrypt`)                                                                                               |
| `modulusLength` | No       | RSA key size for `keygen`: `2048` (default) or `4096`. Ignored for `encrypt`/`decrypt` — the size limit is derived from the actual key |
| `algorithm`     | No       | Padding algorithm: `rsa-oaep-sha256` (default) or `rsa-oaep-sha1`                                                                      |

## Available Actions

| Action    | Description                                                                           |
| --------- | ------------------------------------------------------------------------------------- |
| `keygen`  | Generates an RSA key pair and returns both PEM-encoded public and private keys        |
| `encrypt` | Encrypts text with the public key using OAEP padding and returns the result as base64 |
| `decrypt` | Decrypts a base64 ciphertext with the private key and returns the original plaintext  |

## Plaintext Size Limit

OAEP padding reserves space inside each RSA block, so the maximum plaintext size depends on the key size and hash algorithm:

| Key Size | Algorithm         | Max Plaintext |
| -------- | ----------------- | ------------- |
| 2048     | `rsa-oaep-sha256` | 190 bytes     |
| 2048     | `rsa-oaep-sha1`   | 214 bytes     |
| 4096     | `rsa-oaep-sha256` | 446 bytes     |
| 4096     | `rsa-oaep-sha1`   | 470 bytes     |

The formula is: `modulusLength / 8 − 2 × hashLength − 2`.

## Code Examples

<Examples method="post" path="/asymmetric" :body="{ action: 'keygen' }" />

## Response Fields

**`keygen` action:**

| Field           | Type     | Description                      |
| --------------- | -------- | -------------------------------- |
| `action`        | `string` | `keygen`                         |
| `algorithm`     | `string` | Padding algorithm used           |
| `modulusLength` | `number` | RSA key size in bits             |
| `publicKey`     | `string` | PEM-encoded public key (SPKI)    |
| `privateKey`    | `string` | PEM-encoded private key (PKCS#8) |

**`encrypt` / `decrypt` action:**

| Field       | Type     | Description                               |
| ----------- | -------- | ----------------------------------------- |
| `action`    | `string` | Action performed (`encrypt` or `decrypt`) |
| `algorithm` | `string` | Padding algorithm used                    |
| `result`    | `string` | Base64 ciphertext, or decrypted plaintext |

## Try It

<Try name="Asymmetric" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                                           | Description                                                                            |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `Action must be "keygen", "encrypt", or "decrypt"`                      | The `action` value is not valid                                                        |
| `Unsupported algorithm. Use one of: rsa-oaep-sha256, rsa-oaep-sha1`     | The `algorithm` value is not supported                                                 |
| `Modulus length must be 2048 or 4096`                                   | The `modulusLength` is not 2048 or 4096                                                |
| `Text is required`                                                      | The `text` parameter is missing for encrypt                                            |
| `Public key is required`                                                | The `publicKey` is missing for encrypt                                                 |
| `Invalid public key format`                                             | The `publicKey` does not start with the PEM header, or cannot be parsed as a valid key |
| `Text exceeds maximum length for this key size and algorithm (N bytes)` | The plaintext is too large for the key/algorithm                                       |
| `Encryption failed: invalid key or data too large`                      | The encryption failed                                                                  |
| `Encrypted data is required`                                            | The `text` parameter is missing for decrypt                                            |
| `Private key is required`                                               | The `privateKey` is missing for decrypt                                                |
| `Invalid private key format`                                            | The `privateKey` does not start with the PEM header                                    |
| `Invalid key or corrupted data`                                         | The decryption failed                                                                  |
