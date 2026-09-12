# Statistiques

L'endpoint `/statistics` calcule des statistiques descriptives sur une liste de nombres.

<Endpoint method="get" path="/statistics" baseUrl="https://api.sylvain.sh" />

::: info Comment ça marche ?
Toutes les mesures sont calculées sur la population complète (et non un échantillon). `variance` et `stddev` utilisent les formules populationnelles (division par N). `mode` retourne toutes les valeurs à égalité pour la fréquence la plus haute. `mean`, `median`, `variance` et `stddev` sont arrondis à 6 décimales.
:::

## Paramètres

| Paramètre | Requis | Description                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| `values`  | Oui    | Liste de nombres séparés par des virgules (max 1000 valeurs) |

## Champs de réponse

| Champ      | Type       | Description                                       |
| ---------- | ---------- | ------------------------------------------------- |
| `count`    | `number`   | Nombre de valeurs                                 |
| `sum`      | `number`   | Somme de toutes les valeurs                       |
| `min`      | `number`   | Valeur minimale                                   |
| `max`      | `number`   | Valeur maximale                                   |
| `range`    | `number`   | Différence entre max et min                       |
| `mean`     | `number`   | Moyenne arithmétique (précision 6 décimales)      |
| `median`   | `number`   | Valeur médiane (précision 6 décimales)            |
| `mode`     | `number[]` | Valeur(s) la/les plus fréquente(s)                |
| `variance` | `number`   | Variance de la population (précision 6 décimales) |
| `stddev`   | `number`   | Écart-type (précision 6 décimales)                |

## Exemples de code

<Examples method="get" path="/statistics" :params="{ values: '1,2,3,4,5' }" />

## Essayer

<Try name="Statistics" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                               | Description                                    |
| -------------------------------------------------------------- | ---------------------------------------------- |
| `Please provide a comma-separated list of numbers (?values=…)` | Le paramètre `values` est manquant ou invalide |
