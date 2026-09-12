# Génération d'adresses

L'endpoint `/address` génère une ou plusieurs adresses postales fictives pour un pays donné. Chaque adresse inclut une rue, une ville, un code postal, une région et un pays. Si aucun pays n'est spécifié, l'un d'eux est choisi aléatoirement.

<Endpoint method="get" path="/address" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Description                                                                           |
| --------- | ------ | ------------------------------------------------------------------------------------- |
| `country` | Non    | Code pays : `fr`, `us`, `uk`, `de` ou `es`. Insensible à la casse. Aléatoire si omis. |
| `count`   | Non    | Nombre d'adresses à générer (1–10). Par défaut : `1`.                                 |

## Champs de réponse

| Champ                     | Type       | Description                                                            |
| ------------------------- | ---------- | ---------------------------------------------------------------------- |
| `addresses`               | `object[]` | Liste des objets d'adresse générés                                     |
| `addresses[].street`      | `string`   | Numéro, nom et type de voie — l'ordre dépend du pays (voir ci-dessous) |
| `addresses[].city`        | `string`   | Nom de la ville                                                        |
| `addresses[].zip`         | `string`   | Code postal formaté pour le pays                                       |
| `addresses[].state`       | `string`   | Nom de la région ou de l'état                                          |
| `addresses[].country`     | `string`   | Nom complet du pays (ex. `France`, `United States`)                    |
| `addresses[].countryCode` | `string`   | Code pays en majuscules (ex. `FR`, `US`)                               |

## Pays supportés

| Code | Pays        | Exemple de code postal | Ordre des mots de la rue |
| ---- | ----------- | ---------------------- | ------------------------ |
| `fr` | France      | `75001`                | numéro + type + nom      |
| `us` | États-Unis  | `90210`                | numéro + nom + type      |
| `uk` | Royaume-Uni | `AB1 2CD`              | numéro + nom + type      |
| `de` | Allemagne   | `10115`                | numéro + nom + type      |
| `es` | Espagne     | `28001`                | numéro + type + nom      |

Pour `us`, `uk` et `de`, le type de voie est placé en dernier (ex. `42 Main Street`), tandis que `fr` et `es` le placent juste après le numéro (ex. `12 Rue de Paris`).

## Exemples de code

<Examples method="get" path="/address" />

## Essayer

<Try name="Address" />

## Gestion des erreurs

| Message d'erreur                                           | Description                                         |
| ---------------------------------------------------------- | --------------------------------------------------- |
| `Unknown country code "xx". Supported: fr, us, uk, de, es` | Le paramètre `country` n'est pas un code supporté   |
| `Count must be between 1 and 10`                           | Le paramètre `count` est hors de la plage autorisée |
| `Please provide a valid count (&count={n})`                | Le paramètre `count` n'est pas un nombre valide     |
