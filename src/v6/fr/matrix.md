# Matrix

L'endpoint `/matrix` effectue des opérations mathématiques sur des matrices. Il supporte l'arithmétique, la multiplication scalaire, la transposition et les opérations d'algèbre linéaire sur des matrices allant jusqu'à 20×20.

<Endpoint method="post" path="/matrix" baseUrl="https://api.sylvain.sh" />

::: info Comment ça marche ?
Le déterminant est calculé par élimination gaussienne avec pivot partiel. L'inverse utilise l'élimination de Gauss-Jordan sur une matrice augmentée. Toutes les entrées sont validées : les valeurs doivent être des nombres finis, les lignes doivent avoir une longueur uniforme, et la matrice ne doit pas dépasser 20×20.
:::

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre   | Requis       | Description                                                      |
| ----------- | ------------ | ---------------------------------------------------------------- |
| `operation` | Oui          | L'opération à effectuer (voir les opérations disponibles)        |
| `matrix`    | Oui          | La matrice d'entrée (tableau 2D de nombres)                      |
| `matrix2`   | Conditionnel | Deuxième matrice — requise pour `add`, `subtract`, `multiply`    |
| `scalar`    | Conditionnel | Valeur scalaire — requise pour `scalar`, utilisée par `identity` |

## Opérations disponibles

| Opération     | Description                                              | Nécessite |
| ------------- | -------------------------------------------------------- | --------- |
| `add`         | Addition élément par élément                             | `matrix2` |
| `subtract`    | Soustraction élément par élément                         | `matrix2` |
| `multiply`    | Multiplication matricielle                               | `matrix2` |
| `scalar`      | Multiplier tous les éléments par un scalaire             | `scalar`  |
| `transpose`   | Transposer lignes et colonnes                            | —         |
| `determinant` | Calculer le déterminant (matrices carrées uniquement)    | —         |
| `inverse`     | Calculer l'inverse (matrices carrées non singulières)    | —         |
| `identity`    | Générer une matrice identité de taille `scalar`×`scalar` | `scalar`  |

## Champs de réponse

Le format de réponse dépend de l'opération :

| Opération                                                                   | Type de `result` |
| --------------------------------------------------------------------------- | ---------------- |
| `add`, `subtract`, `multiply`, `scalar`, `transpose`, `inverse`, `identity` | `number[][]`     |
| `determinant`                                                               | `number`         |

## Exemples de code

<Examples method="post" path="/matrix" :body="{ operation: 'determinant', matrix: [[1,2],[3,4]] }" />

## Essayer

<Try name="Matrix" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                    | Description                                                                                                                                                     |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Please provide a valid operation`                  | Le paramètre `operation` est manquant ou invalide. Valeurs valides : `add`, `subtract`, `multiply`, `scalar`, `transpose`, `determinant`, `inverse`, `identity` |
| `Matrix must be a non-empty 2D array`               | La matrice est manquante ou malformée                                                                                                                           |
| `All rows must have the same length`                | Les lignes de la matrice ne sont pas uniformes                                                                                                                  |
| `Matrix values must be finite numbers`              | La matrice contient des valeurs non numériques                                                                                                                  |
| `Matrix exceeds maximum size of 20×20`              | La matrice dépasse 20×20                                                                                                                                        |
| `Both matrices must have the same dimensions`       | Dimensions incompatibles pour add/subtract                                                                                                                      |
| `Matrix dimensions incompatible for multiplication` | Nombre de colonnes de A ≠ nombre de lignes de B                                                                                                                 |
| `Matrix must be square`                             | L'opération nécessite une matrice carrée                                                                                                                        |
| `Matrix is singular and cannot be inverted`         | La matrice n'est pas inversible                                                                                                                                 |
