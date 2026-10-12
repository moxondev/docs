# Hachage

L'endpoint `/hash` permet de convertir un texte en hash, c'est-à-dire en un code unique et crypté.

<Endpoint method="post" path="/hash" />

## Paramètres

| Paramètre | Requis | Description                                                           |
| --------- | ------ | --------------------------------------------------------------------- |
| `text`    | Oui    | Le texte à hasher, peut être un mot, une phrase, un texte complet...  |
| `method`  | Oui    | Le type de hash à utiliser (voir les méthodes disponibles ci-dessous) |

## Méthodes disponibles

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
- `blake2b512`
- `blake2s256`
- `id-rsassa-pkcs1-v1_5-with-sha3-224`
- `id-rsassa-pkcs1-v1_5-with-sha3-256`
- `id-rsassa-pkcs1-v1_5-with-sha3-384`
- `id-rsassa-pkcs1-v1_5-with-sha3-512`
- `md5`
- `md5-sha1`
- `md5WithRSAEncryption`
- `ripemd`
- `ripemd160`
- `ripemd160WithRSA`
- `rmd160`
- `sha1`
- `sha1WithRSAEncryption`
- `sha224`
- `sha224WithRSAEncryption`
- `sha256`
- `sha256WithRSAEncryption`
- `sha3-224`
- `sha3-256`
- `sha3-384`
- `sha3-512`
- `sha384`
- `sha384WithRSAEncryption`
- `sha512`
- `sha512-224`
- `sha512-224WithRSAEncryption`
- `sha512-256`
- `sha512-256WithRSAEncryption`
- `sha512WithRSAEncryption`
- `shake128`
- `shake256`
- `sm3`
- `sm3WithRSAEncryption`
- `ssl3-md5`
- `ssl3-sha1`

## Exemple de requête

```bash
curl -X POST -d "text=hello&method=sha512" "https://api.moxon.dev/v2/hash"
```

## Réponse

```json
{
    "method": "sha512",
    "hash": "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043"
}
```

## Gestion des erreurs

Si la valeur de `text` ou `method` est vide ou invalide, une erreur sera renvoyée.
