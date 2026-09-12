# Asymmetric

L'endpoint `/asymmetric` effectue la génération de clés RSA asymétriques, le chiffrement et le déchiffrement.

<Endpoint method="post" path="/asymmetric" baseUrl="https://api.sylvain.sh" />

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre       | Requis | Description                                                                                                                                        |
| --------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`        | Oui    | Action à effectuer : `keygen`, `encrypt` ou `decrypt`                                                                                              |
| `text`          | Cond.  | Texte à chiffrer, ou texte chiffré en base64 à déchiffrer                                                                                          |
| `publicKey`     | Cond.  | Clé publique PEM (requise pour `encrypt`)                                                                                                          |
| `privateKey`    | Cond.  | Clé privée PEM (requise pour `decrypt`)                                                                                                            |
| `modulusLength` | Non    | Taille de la clé RSA pour `keygen` : `2048` (défaut) ou `4096`. Ignoré pour `encrypt`/`decrypt` — la limite de taille est dérivée de la clé réelle |
| `algorithm`     | Non    | Algorithme de padding : `rsa-oaep-sha256` (défaut) ou `rsa-oaep-sha1`                                                                              |

## Actions disponibles

| Action    | Description                                                                                          |
| --------- | ---------------------------------------------------------------------------------------------------- |
| `keygen`  | Génère une paire de clés RSA et retourne les clés publique et privée encodées en PEM                 |
| `encrypt` | Chiffre un texte avec la clé publique en utilisant le padding OAEP et retourne le résultat en base64 |
| `decrypt` | Déchiffre un texte chiffré en base64 avec la clé privée et retourne le texte original                |

## Limite de taille du texte

Le padding OAEP réserve de l'espace dans chaque bloc RSA, donc la taille maximale du texte dépend de la taille de la clé et de l'algorithme de hachage :

| Taille de clé | Algorithme        | Texte max  |
| ------------- | ----------------- | ---------- |
| 2048          | `rsa-oaep-sha256` | 190 octets |
| 2048          | `rsa-oaep-sha1`   | 214 octets |
| 4096          | `rsa-oaep-sha256` | 446 octets |
| 4096          | `rsa-oaep-sha1`   | 470 octets |

La formule est : `modulusLength / 8 − 2 × hashLength − 2`.

## Exemples de code

<Examples method="post" path="/asymmetric" :body="{ action: 'keygen' }" />

## Champs de réponse

**Action `keygen` :**

| Champ           | Type     | Description                        |
| --------------- | -------- | ---------------------------------- |
| `action`        | `string` | `keygen`                           |
| `algorithm`     | `string` | Algorithme de padding utilisé      |
| `modulusLength` | `number` | Taille de la clé RSA en bits       |
| `publicKey`     | `string` | Clé publique encodée en PEM (SPKI) |
| `privateKey`    | `string` | Clé privée encodée en PEM (PKCS#8) |

**Action `encrypt` / `decrypt` :**

| Champ       | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `action`    | `string` | Action effectuée (`encrypt` ou `decrypt`)        |
| `algorithm` | `string` | Algorithme de padding utilisé                    |
| `result`    | `string` | Texte chiffré en base64, ou texte brut déchiffré |

## Essayer

<Try name="Asymmetric" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                                        | Description                                                                                         |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `Action must be "keygen", "encrypt", or "decrypt"`                      | La valeur de `action` n'est pas valide                                                              |
| `Unsupported algorithm. Use one of: rsa-oaep-sha256, rsa-oaep-sha1`     | L'`algorithm` n'est pas supporté                                                                    |
| `Modulus length must be 2048 or 4096`                                   | Le `modulusLength` n'est ni 2048 ni 4096                                                            |
| `Text is required`                                                      | Le paramètre `text` est manquant pour encrypt                                                       |
| `Public key is required`                                                | La `publicKey` est manquante pour encrypt                                                           |
| `Invalid public key format`                                             | La `publicKey` ne commence pas par l'en-tête PEM, ou ne peut pas être analysée comme une clé valide |
| `Text exceeds maximum length for this key size and algorithm (N bytes)` | Le texte est trop long pour la clé et l'algorithme                                                  |
| `Encryption failed: invalid key or data too large`                      | Le chiffrement a échoué                                                                             |
| `Encrypted data is required`                                            | Le paramètre `text` est manquant pour decrypt                                                       |
| `Private key is required`                                               | La `privateKey` est manquante pour decrypt                                                          |
| `Invalid private key format`                                            | La `privateKey` ne commence pas par l'en-tête PEM                                                   |
| `Invalid key or corrupted data`                                         | Le déchiffrement a échoué                                                                           |
