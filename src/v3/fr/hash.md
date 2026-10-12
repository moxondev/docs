# Hash

L'endpoint `/hash` convertit une chaîne de caractères en hash, c'est-à-dire une chaîne de caractères qui ne peut pas être inversée vers la chaîne originale.

<Endpoint method="post" path="/hash" />

## Paramètres

| Paramètre | Requis | Description                                                                 |
| --------- | ------ | --------------------------------------------------------------------------- |
| `text`    | Oui    | La chaîne à hacher (mot, phrase, paragraphe, etc.)                          |
| `method`  | Oui    | La méthode de hachage à utiliser (voir les méthodes disponibles ci-dessous) |

## Méthodes disponibles

::: details Cliquez pour voir toutes les méthodes de hachage disponibles

**Méthodes RSA :**

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

**Méthodes Blake :**

- `blake2b512`
- `blake2s256`

**Méthodes SHA :**

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

**Méthodes MD5 :**

- `md5`
- `md5-sha1`
- `md5WithRSAEncryption`

**Méthodes RIPEMD :**

- `ripemd`
- `ripemd160`
- `ripemd160WithRSA`
- `rmd160`

**Autres méthodes :**

- `shake128`
- `shake256`
- `sm3`
- `sm3WithRSAEncryption`
- `ssl3-md5`
- `ssl3-sha1`

**Méthodes de chiffrement RSA :**

- `sha1WithRSAEncryption`
- `sha224WithRSAEncryption`
- `sha256WithRSAEncryption`
- `sha384WithRSAEncryption`
- `sha512WithRSAEncryption`
- `sha512-224WithRSAEncryption`
- `sha512-256WithRSAEncryption`

**Méthodes PKCS :**

- `id-rsassa-pkcs1-v1_5-with-sha3-224`
- `id-rsassa-pkcs1-v1_5-with-sha3-256`
- `id-rsassa-pkcs1-v1_5-with-sha3-384`
- `id-rsassa-pkcs1-v1_5-with-sha3-512`

:::

## Exemple de requête

```bash
curl -X POST -d "text=hello&method=sha512" "https://api.moxon.dev/v3/hash"
```

## Réponse

```json
{
    "method": "sha512",
    "hash": "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043"
}
```

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                              | Description                                    |
| ------------------------------------------------------------- | ---------------------------------------------- |
| `Please provide a text (?text={text})`                        | Le paramètre `text` est manquant               |
| `Please provide a valid hash algorithm (&method={algorithm})` | Le paramètre `method` est manquant ou invalide |
