# Génération de mots de passe

L'endpoint `/password` génère un ou plusieurs mots de passe à l'aide d'une randomisation cryptographiquement sécurisée (`crypto.randomInt`). Deux modes sont disponibles : `random` (basé sur des caractères) et `passphrase` (basé sur des mots). Chaque réponse inclut les mots de passe générés ainsi que leur niveau de force et leur score d'entropie.

<Endpoint method="get" path="/password" baseUrl="https://api.sylvain.sh" />

::: tip Cas d'utilisation
Générez des mots de passe sécurisés lors de la création de comptes, produisez des passphrases pour une mémorisation facilitée, testez une interface de force de mot de passe, ou alimentez des fixtures de test avec de vrais identifiants réalistes.
:::

## Paramètres

| Paramètre   | Requis | Défaut   | Description                                                                              |
| ----------- | ------ | -------- | ---------------------------------------------------------------------------------------- |
| `type`      | Non    | `random` | Mode de génération : `random` (caractères) ou `passphrase` (mots).                       |
| `length`    | Non    | `16`     | Nombre de caractères pour le mode `random` (8–128), ou de mots pour `passphrase` (3–10). |
| `uppercase` | Non    | `true`   | Inclure les majuscules (`A–Z`). Mettre à `false` pour désactiver.                        |
| `lowercase` | Non    | `true`   | Inclure les minuscules (`a–z`). Mettre à `false` pour désactiver.                        |
| `digits`    | Non    | `true`   | Inclure les chiffres (`0–9`). Mettre à `false` pour désactiver.                          |
| `symbols`   | Non    | `false`  | Inclure les symboles (`!@#$%^&*()-_=+[]{}\|;:,.<>?`). Mettre à `true` pour activer.      |
| `exclude`   | Non    | `""`     | Caractères à exclure du jeu de caractères (ex. `exclude=0Ol1`).                          |
| `count`     | Non    | `1`      | Nombre de mots de passe à générer (1–20).                                                |
| `separator` | Non    | `-`      | Séparateur de mots pour le mode `passphrase`.                                            |

## Champs de réponse

| Champ       | Type       | Description                                                     |
| ----------- | ---------- | --------------------------------------------------------------- |
| `passwords` | `string[]` | Liste des mots de passe ou passphrases générés                  |
| `type`      | `string`   | Mode de génération utilisé : `random` ou `passphrase`           |
| `length`    | `number`   | Nombre de caractères (random) ou de mots (passphrase)           |
| `strength`  | `string`   | Niveau de force : `weak`, `moderate`, `strong` ou `very_strong` |
| `entropy`   | `number`   | Entropie de Shannon en bits (arrondie à 1 décimale)             |

## Niveaux de force

| Niveau        | Plage d'entropie |
| ------------- | ---------------- |
| `weak`        | < 40 bits        |
| `moderate`    | 40 – 59,9        |
| `strong`      | 60 – 79,9        |
| `very_strong` | ≥ 80 bits        |

## Exemples de code

<Examples method="get" path="/password" />

## Essayer

<Try name="Password" />

## Gestion des erreurs

| Message d'erreur                             | Description                                                                             |
| -------------------------------------------- | --------------------------------------------------------------------------------------- |
| `Type must be "random" or "passphrase"`      | Le paramètre `type` n'est pas une valeur supportée                                      |
| `Length must be between 8 and 128`           | Le paramètre `length` est hors de la plage autorisée pour le mode `random`              |
| `At least one character set must be enabled` | Tous les jeux de caractères sont désactivés ou `exclude` a supprimé tous les caractères |
| `Count must be between 1 and 20`             | Le paramètre `count` est hors de la plage autorisée                                     |
