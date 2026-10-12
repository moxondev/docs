# Génération d'adresses

L'endpoint `/address` génère une ou plusieurs adresses postales fictives pour un pays donné. Chaque adresse inclut une rue, une ville, un code postal, une région et un pays. Si aucun pays n'est spécifié, l'un d'eux est choisi aléatoirement.

<Endpoint method="get" path="/address" baseUrl="https://api.moxon.dev" />

## Paramètres

| Paramètre | Requis | Description                                                                           |
| --------- | ------ | ------------------------------------------------------------------------------------- |
| `country` | Non    | Code pays : `fr`, `us`, `uk`, `de` ou `es`. Insensible à la casse. Aléatoire si omis. |
| `count`   | Non    | Nombre d'adresses à générer (1–10). Par défaut : `1`.                                 |

## Champs de réponse

| Champ                     | Type       | Description                                         |
| ------------------------- | ---------- | --------------------------------------------------- |
| `addresses`               | `object[]` | Liste des objets d'adresse générés                  |
| `addresses[].street`      | `string`   | Numéro + type de voie + nom de la rue               |
| `addresses[].city`        | `string`   | Nom de la ville                                     |
| `addresses[].zip`         | `string`   | Code postal formaté pour le pays                    |
| `addresses[].state`       | `string`   | Nom de la région ou de l'état                       |
| `addresses[].country`     | `string`   | Nom complet du pays (ex. `France`, `United States`) |
| `addresses[].countryCode` | `string`   | Code pays en majuscules (ex. `FR`, `US`)            |

## Pays supportés

| Code | Pays        | Exemple de code postal |
| ---- | ----------- | ---------------------- |
| `fr` | France      | `75001`                |
| `us` | États-Unis  | `90210`                |
| `uk` | Royaume-Uni | `AB1 2CD`              |
| `de` | Allemagne   | `10115`                |
| `es` | Espagne     | `28001`                |

## Exemples de code

<Examples method="get" path="/address" />

## Essayer

<Try name="Address" />

## Gestion des erreurs

| Message d'erreur                                           | Description                                         |
| ---------------------------------------------------------- | --------------------------------------------------- |
| `Unknown country code "xx". Supported: fr, us, uk, de, es` | Le paramètre `country` n'est pas un code supporté   |
| `Count must be between 1 and 10`                           | Le paramètre `count` est hors de la plage autorisée |
