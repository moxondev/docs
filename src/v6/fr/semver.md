# Versions sémantiques

L'endpoint `/semver` analyse, incrémente et compare des versions sémantiques selon la spécification semver.org.

<Endpoint method="get" path="/semver" baseUrl="https://api.sylvain.sh" />

::: info Comment ça marche ?
Une version doit respecter la grammaire officielle `MAJOR.MINOR.PATCH`, suivie éventuellement de `-prerelease` et `+build`. Les zéros initiaux sont refusés, donc `01.2.3` est invalide.

La comparaison suit la précédence semver : les parties numériques d'abord, puis la prerelease. Une version portant une prerelease est classée sous la même version sans prerelease, les identifiants numériques de prerelease sont comparés comme des nombres (`alpha.2` est inférieur à `alpha.10`), et les métadonnées de build sont entièrement ignorées.

Une incrémentation remet les parties inférieures à zéro et supprime la prerelease ainsi que les métadonnées de build : `1.0.0-alpha+build.1` incrémenté sur `patch` donne `1.0.1`.

Le signe `+` est décodé comme une espace dans une chaîne de requête, l'API le restaure donc avant l'analyse — les métadonnées de build peuvent être envoyées telles quelles ou encodées en pourcentage.
:::

## Paramètres

| Paramètre | Requis | Description                                                                                 |
| --------- | ------ | ------------------------------------------------------------------------------------------- |
| `version` | Oui    | Version à traiter (ex. `1.2.3-beta.1+build.42`)                                             |
| `action`  | Non    | Action à effectuer : `parse`, `bump` ou `compare`. Par défaut : `parse`                     |
| `part`    | Non    | `bump` uniquement : partie à incrémenter, `major`, `minor` ou `patch`. Par défaut : `patch` |
| `other`   | Cond.  | Seconde version à comparer (requis pour `compare`)                                          |

## Actions disponibles

| Action    | Description                                               |
| --------- | --------------------------------------------------------- |
| `parse`   | Décompose la version en ses composants                    |
| `bump`    | Incrémente `part` et remet les parties inférieures à zéro |
| `compare` | Compare `version` à `other` selon la précédence semver    |

## Champs de réponse

**Action `parse` :**

| Champ        | Type           | Description                                                       |
| ------------ | -------------- | ----------------------------------------------------------------- |
| `version`    | `string`       | La version d'entrée originale                                     |
| `major`      | `number`       | Numéro majeur                                                     |
| `minor`      | `number`       | Numéro mineur                                                     |
| `patch`      | `number`       | Numéro de correctif                                               |
| `prerelease` | `string\|null` | Identifiants de prerelease sans le `-` initial, `null` si absents |
| `build`      | `string\|null` | Métadonnées de build sans le `+` initial, `null` si absentes      |

**Action `bump` :**

| Champ     | Type     | Description                   |
| --------- | -------- | ----------------------------- |
| `version` | `string` | La version d'entrée originale |
| `action`  | `string` | `bump`                        |
| `part`    | `string` | Partie qui a été incrémentée  |
| `result`  | `string` | La version incrémentée        |

**Action `compare` :**

| Champ         | Type     | Description                                                       |
| ------------- | -------- | ----------------------------------------------------------------- |
| `version`     | `string` | La version d'entrée originale                                     |
| `action`      | `string` | `compare`                                                         |
| `other`       | `string` | La version à laquelle la comparaison est faite                    |
| `result`      | `number` | `-1` si `version` est inférieure, `0` si égale, `1` si supérieure |
| `description` | `string` | Comparaison lisible (ex. `1.2.3 < 1.3.0`)                         |

## Exemples de code

<Examples method="get" path="/semver" :params="{ version: '1.2.3-beta.1', action: 'parse' }" />

## Essayer

<Try name="Semver" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                     | Description                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `Please provide a version (?version={version})`      | Le paramètre `version` est manquant                                |
| `Action must be one of: parse, bump, compare`        | La valeur de `action` n'est pas valide                             |
| `Version must be 256 characters or fewer`            | La valeur `version` ou `other` dépasse la longueur maximale        |
| `Invalid semver version`                             | La valeur `version` ou `other` ne respecte pas la grammaire semver |
| `Part must be one of: major, minor, patch`           | La valeur de `part` n'est pas valide pour `bump`                   |
| `Please provide a second version (&other={version})` | Le paramètre `other` est manquant pour `compare`                   |
