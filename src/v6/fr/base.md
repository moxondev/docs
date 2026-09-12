# Conversion de base

L'endpoint `/base` convertit un nombre d'une base numérique vers une autre, entre la base 2 et la base 36.

<Endpoint method="get" path="/base" baseUrl="https://api.sylvain.sh" />

::: info Comment ça marche ?
Les chiffres sont lus comme `0-9` puis `a-z`, représentant les valeurs de 0 à 35 : l'entrée est donc insensible à la casse et le résultat est toujours en minuscules. La conversion utilise des entiers à précision arbitraire, ce qui permet de conserver tous les chiffres bien au-delà de `Number.MAX_SAFE_INTEGER`. Le signe moins est conservé, sauf lorsque la valeur vaut zéro (`-0` retourne `0`).
:::

## Paramètres

| Paramètre | Requis | Description                                                                                            |
| --------- | ------ | ------------------------------------------------------------------------------------------------------ |
| `value`   | Oui    | Nombre à convertir, éventuellement précédé de `-`. Jusqu'à 100 caractères, valides dans la base `from` |
| `from`    | Non    | Base d'entrée, un entier entre 2 et 36. Par défaut : `10`                                              |
| `to`      | Non    | Base de sortie, un entier entre 2 et 36. Par défaut : `16`                                             |

## Champs de réponse

| Champ    | Type     | Description                                |
| -------- | -------- | ------------------------------------------ |
| `value`  | `string` | La valeur d'entrée d'origine, telle quelle |
| `from`   | `number` | Base d'entrée utilisée pour la conversion  |
| `to`     | `number` | Base de sortie utilisée pour la conversion |
| `result` | `string` | La valeur convertie, en minuscules         |

## Exemples de code

<Examples method="get" path="/base" :params="{ value: '255', from: '10', to: '16' }" />

## Essayer

<Try name="Base" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                          | Description                                                                                        |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `Please provide a value (?value={value})` | Le paramètre `value` est manquant                                                                  |
| `Value must be 100 characters or fewer`   | La valeur `value` dépasse la longueur maximale                                                     |
| `Base must be a number`                   | `from` ou `to` n'est pas un entier                                                                 |
| `Base must be between 2 and 36`           | `from` ou `to` est en dehors de la plage supportée                                                 |
| `Invalid value for base {from}`           | Un chiffre de `value` n'existe pas dans la base d'entrée, ou `value` ne contient qu'un signe moins |
