# Symmetric

L'endpoint `/symmetric` chiffre et déchiffre du texte par chiffrement symétrique AES.

<Endpoint method="post" path="/symmetric" baseUrl="https://api.sylvain.sh" />

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre   | Requis | Description                                                                        |
| ----------- | ------ | ---------------------------------------------------------------------------------- |
| `action`    | Oui    | Action à effectuer : `encrypt` ou `decrypt`                                        |
| `text`      | Oui    | Texte à chiffrer, ou blob base64 à déchiffrer                                      |
| `key`       | Oui    | Clé de chiffrement (minimum 8 caractères)                                          |
| `algorithm` | Non    | Algorithme de chiffrement : `aes-256-gcm` (défaut), `aes-256-cbc` ou `aes-128-gcm` |

## Dérivation de clé

La clé brute n'est jamais utilisée directement. Elle est dérivée avec `scryptSync` à partir d'un sel aléatoire de 16 octets, produisant une clé de longueur fixe sécurisée quelle que soit la longueur de l'entrée.

## Format du blob

Le résultat chiffré est retourné sous forme de chaîne base64 avec une structure binaire qui dépend de l'algorithme :

```
GCM : [16 octets sel][12 octets IV][16 octets tag d'authentification][texte chiffré]
CBC : [16 octets sel][16 octets IV][32 octets MAC HMAC-SHA256][texte chiffré]
```

- **Sel** (16 octets) : utilisé pour dériver la clé (et, pour CBC, une clé HMAC séparée)
- **IV** : vecteur d'initialisation (12 octets en GCM, 16 octets en CBC)
- **Tag d'authentification / MAC** : vérification d'intégrité — un tag GCM natif (16 octets) en GCM, ou un MAC HMAC-SHA256 (32 octets) en CBC, vérifié par comparaison à temps constant
- **Texte chiffré** : le contenu chiffré

Passer ce blob comme valeur de `text` pour déchiffrer.

::: warning Changement cassant en 5.4.0
Les blobs CBC embarquent désormais un MAC d'intégrité. Les blobs produits par `aes-256-cbc` avant la 5.4.0 (sans MAC) ne peuvent plus être déchiffrés — il faut les rechiffrer avec la version actuelle. Les blobs GCM ne sont pas affectés.
:::

## Exemples de code

<Examples method="post" path="/symmetric" :body="{ action: 'encrypt', text: 'hello', key: 'mysecretkey' }" />

## Champs de réponse

| Champ       | Type     | Description                                  |
| ----------- | -------- | -------------------------------------------- |
| `action`    | `string` | Action effectuée (`encrypt` ou `decrypt`)    |
| `algorithm` | `string` | Algorithme de chiffrement utilisé            |
| `result`    | `string` | Blob base64 chiffré, ou texte brut déchiffré |

## Essayer

<Try name="Symmetric" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                                  | Description                                      |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| `Action is required`                                              | Le paramètre `action` est manquant               |
| `Action must be one of: encrypt, decrypt`                         | La valeur de `action` n'est pas valide           |
| `Text is required`                                                | Le paramètre `text` est manquant ou vide         |
| `Text exceeds maximum allowed length`                             | Le `text` dépasse la longueur maximale autorisée |
| `Key is required`                                                 | Le paramètre `key` est manquant                  |
| `Key must be at least 8 characters`                               | La `key` fait moins de 8 caractères              |
| `Algorithm must be one of: aes-256-gcm, aes-256-cbc, aes-128-gcm` | L'`algorithm` n'est pas supporté                 |
