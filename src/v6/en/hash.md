# Hash

The `/hash` endpoint converts a string into a hash, i.e. a string of characters that cannot be reversed into the original string.

<Endpoint method="post" path="/hash" baseUrl="https://api.sylvain.sh" />

## Parameters

| Parameter  | Required | Description                                             |
| ---------- | -------- | ------------------------------------------------------- |
| `text`     | Yes      | The string to hash (word, sentence, paragraph, etc.)    |
| `method`   | Yes      | The hashing method to use (see available methods below) |
| `encoding` | No       | Output encoding: `hex` (default) or `base64`            |

## Available Methods

::: details Click to expand all available hashing methods

**RSA Methods:**

- `RSA-MD5`
- `RSA-RIPEMD160`
- `RSA-SHA1`
- `RSA-SHA1-2`
- `RSA-SHA224`
- `RSA-SHA256`
- `RSA-SHA3-224`
- `RSA-SHA3-256`
- `RSA-SHA3-384`
- `RSA-SHA3-512`
- `RSA-SHA384`
- `RSA-SHA512`
- `RSA-SHA512/224`
- `RSA-SHA512/256`
- `RSA-SM3`

**Blake Methods:**

- `blake2b512`
- `blake2s256`

**SHA Methods:**

- `sha1`
- `sha224`
- `sha256`
- `sha384`
- `sha512`
- `sha512-224`
- `sha512-256`
- `sha3-224`
- `sha3-256`
- `sha3-384`
- `sha3-512`

**MD5 Methods:**

- `md5`
- `md5-sha1`
- `md5WithRSAEncryption`

**RIPEMD Methods:**

- `ripemd`
- `ripemd160`
- `ripemd160WithRSA`
- `rmd160`

**Other Methods:**

- `shake128`
- `shake256`
- `sm3`
- `sm3WithRSAEncryption`
- `ssl3-md5`
- `ssl3-sha1`

**RSA Encryption Methods:**

- `sha1WithRSAEncryption`
- `sha224WithRSAEncryption`
- `sha256WithRSAEncryption`
- `sha384WithRSAEncryption`
- `sha512WithRSAEncryption`
- `sha512-224WithRSAEncryption`
- `sha512-256WithRSAEncryption`

**PKCS Methods:**

- `id-rsassa-pkcs1-v1_5-with-sha3-224`
- `id-rsassa-pkcs1-v1_5-with-sha3-256`
- `id-rsassa-pkcs1-v1_5-with-sha3-384`
- `id-rsassa-pkcs1-v1_5-with-sha3-512`

:::

## Code Examples

<Examples method="post" path="/hash" :body="{ text: 'hello', method: 'sha256', encoding: 'base64' }" />

## Response Fields

| Field    | Type     | Description                                          |
| -------- | -------- | ---------------------------------------------------- |
| `method` | `string` | Hashing method used                                  |
| `hash`   | `string` | Resulting hash string (hex or base64 encoded digest) |

## Try It

<Try name="Hash" />

## Error Handling

If parameters are missing or invalid, the API will return an error:

| Error Message                                                 | Description                                  |
| ------------------------------------------------------------- | -------------------------------------------- |
| `Please provide a text (?text={text})`                        | The `text` parameter is missing              |
| `Text is required`                                            | The `text` parameter is empty                |
| `Please provide a valid hash algorithm (&method={algorithm})` | The `method` parameter is missing or invalid |
| `Unsupported method. Use one of: {methods}`                   | The method is not a supported hash algorithm |
| `Encoding must be one of: hex, base64`                        | Invalid `encoding` value                     |
