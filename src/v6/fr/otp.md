# OTP

L'endpoint `/otp` génère et vérifie des mots de passe à usage unique (TOTP/HOTP), compatibles avec Google Authenticator et Aegis.

<Endpoint method="post" path="/otp" baseUrl="https://api.sylvain.sh" />

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre   | Requis | Description                                                                    |
| ----------- | ------ | ------------------------------------------------------------------------------ |
| `action`    | Oui    | Action à effectuer : `secret`, `generate` ou `verify`                          |
| `secret`    | Selon  | Clé secrète base32 (requise pour `generate` et `verify`)                       |
| `code`      | Selon  | Code OTP à vérifier (requis pour `verify`)                                     |
| `label`     | Non    | Libellé du compte pour l'URI `otpauth://` (utilisé avec l'action `secret`)     |
| `issuer`    | Non    | Nom de l'émetteur pour l'URI `otpauth://` (utilisé avec l'action `secret`)     |
| `algorithm` | Non    | Algorithme HMAC : `sha1` (défaut), `sha256` ou `sha512`                        |
| `digits`    | Non    | Longueur du code : `6` (défaut) ou `8`                                         |
| `period`    | Non    | Période TOTP en secondes : `15`, `30` (défaut) ou `60`                         |
| `counter`   | Non    | Compteur HOTP (entier). Si fourni, le mode HOTP est utilisé à la place du TOTP |

## Actions disponibles

| Action     | Description                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| `secret`   | Génère un nouveau secret base32 aléatoire et retourne un URI `otpauth://` prêt à être scanné en QR code               |
| `generate` | Génère le code OTP courant. Sans `counter` : mode TOTP (basé sur le temps). Avec `counter` : mode HOTP (déterministe) |
| `verify`   | Vérifie un code avec une fenêtre de tolérance de ±1 période. Retourne `valid` et un décalage `drift` (0, +1 ou -1)    |

## Conformité RFC

Implémente la **RFC 4226** (HOTP) et la **RFC 6238** (TOTP). Compatible avec Google Authenticator et Aegis.

## Exemples de code

<Examples method="post" path="/otp" :body="{ action: 'secret', label: 'alice', issuer: 'Demo' }" />

## Champs de réponse

**Action `secret` :**

| Champ    | Type     | Description                                    |
| -------- | -------- | ---------------------------------------------- |
| `secret` | `string` | Clé secrète encodée en base32                  |
| `uri`    | `string` | URI `otpauth://` pour la génération de QR code |

**Action `generate` :**

| Champ  | Type     | Description      |
| ------ | -------- | ---------------- |
| `code` | `string` | Code OTP généré  |
| `type` | `string` | `totp` ou `hotp` |

**Action `verify` :**

| Champ   | Type      | Description                             |
| ------- | --------- | --------------------------------------- |
| `valid` | `boolean` | Indique si le code est valide           |
| `drift` | `number`  | Décalage temporel détecté (0, +1 ou -1) |

## Essayer

<Try name="OTP" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                  | Description                                    |
| ------------------------------------------------- | ---------------------------------------------- |
| `Action is required`                              | Le paramètre `action` est manquant             |
| `Action must be one of: secret, generate, verify` | La valeur de `action` n'est pas valide         |
| `Secret is required`                              | Le paramètre `secret` est manquant             |
| `Code is required`                                | Le paramètre `code` est manquant pour `verify` |
| `Digits must be 6 or 8`                           | La valeur de `digits` n'est pas valide         |
| `Period must be one of: 15, 30, 60`               | La valeur de `period` n'est pas valide         |
| `Algorithm must be one of: sha1, sha256, sha512`  | L'`algorithm` n'est pas supporté               |
| `Counter must be a non-negative integer`          | La valeur de `counter` est invalide            |
