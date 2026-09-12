# Génération d'UUID

L'endpoint `/uuid` génère des UUID v4 aléatoires, ou analyse un UUID existant pour en extraire la version et la variante.

<Endpoint method="get" path="/uuid" baseUrl="https://api.sylvain.sh" />

::: info Comment ça marche ?
L'endpoint a deux modes. Lorsque `uuid` est fourni, il passe en analyse et `count` est ignoré. Sinon, il génère `count` UUID v4 aléatoires (un seul par défaut). Un UUID mal formé n'est pas une erreur : il est retourné avec `valid: false` et des composants à `null`.
:::

## Paramètres

| Paramètre | Requis | Description                                                               |
| --------- | ------ | ------------------------------------------------------------------------- |
| `uuid`    | Non    | UUID à analyser. S'il est fourni, rien n'est généré et `count` est ignoré |
| `count`   | Non    | Nombre d'UUID à générer, un entier entre 1 et 50. Par défaut : `1`        |

## Variantes d'UUID

La variante est déduite du premier caractère du quatrième groupe :

| Caractère | Variante    |
| --------- | ----------- |
| `0` – `7` | `NCS`       |
| `8` – `b` | `RFC 4122`  |
| `c` – `d` | `Microsoft` |
| `e` – `f` | `Future`    |

## Champs de réponse

**UUID unique (généré, ou `count` à 1) :**

| Champ     | Type     | Description                                      |
| --------- | -------- | ------------------------------------------------ |
| `uuid`    | `string` | L'UUID généré                                    |
| `version` | `number` | Version de l'UUID — toujours `4` à la génération |
| `variant` | `string` | Toujours `RFC 4122` à la génération              |

**Lot (`count` supérieur à 1) :**

| Champ   | Type       | Description                 |
| ------- | ---------- | --------------------------- |
| `uuids` | `string[]` | Tableau des UUID v4 générés |
| `count` | `number`   | Nombre d'UUID retournés     |

**Analyse (`uuid` fourni) :**

| Champ     | Type           | Description                                                     |
| --------- | -------------- | --------------------------------------------------------------- |
| `uuid`    | `string`       | L'UUID fourni en entrée                                         |
| `version` | `number\|null` | Version de l'UUID, `null` si l'entrée n'est pas un UUID valide  |
| `variant` | `string\|null` | Variante de l'UUID, `null` si l'entrée n'est pas un UUID valide |
| `valid`   | `boolean`      | Indique si l'entrée respecte le format UUID                     |

## Exemples de code

<Examples method="get" path="/uuid" :params="{ count: '3' }" />

## Essayer

<Try name="UUID" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                             | Description                                               |
| -------------------------------------------- | --------------------------------------------------------- |
| `Please provide a valid UUID (?uuid={uuid})` | Le paramètre `uuid` n'est pas une simple valeur textuelle |
| `Count must be a number`                     | La valeur de `count` n'est pas un nombre                  |
| `Count must be between 1 and 50`             | La valeur de `count` n'est pas un entier entre 1 et 50    |
