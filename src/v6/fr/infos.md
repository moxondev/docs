# Informations sur l'API

L'endpoint `/infos` fournit des informations générales sur l'[API](https://api.moxon.dev). Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/infos" baseUrl="https://api.moxon.dev" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre. Il retourne les métadonnées de l'API : nombre d'endpoints et version actuelle. Le lien de documentation, le dépôt GitHub et la date de création ne sont retournés que si l'instance est configurée avec ces informations.

## Champs de réponse

| Champ           | Type     | Description                                                                        |
| --------------- | -------- | ---------------------------------------------------------------------------------- |
| `endpoints`     | `number` | Nombre d'endpoints de la version demandée (voir ci-dessous ce qu'il compte)        |
| `last_version`  | `string` | Dernière version de l'API, quelle que soit la version demandée                     |
| `documentation` | `string` | URL de la documentation — absent si l'instance ne définit pas `DOCS_URL`           |
| `github`        | `string` | URL du dépôt GitHub — absent si l'instance ne définit pas `REPO_URL`               |
| `creation`      | `string` | Date de création de l'API — absent si l'instance ne définit pas `INSTANCE_CREATED` |

::: info Ce que compte le nombre d'endpoints
`endpoints` compte les **chemins distincts** de la version demandée, toutes méthodes confondues. Un chemin partagé par un `GET` et un `POST` avec exactement la même forme n'est compté qu'une fois, comme `/chat`. Ce n'est donc pas le nombre de couples méthode + chemin : en v6, `/infos` annonce 56 endpoints alors que 57 couples méthode + chemin sont servis, parce que `GET /chat` et `POST /chat` ne comptent que pour un.

Les chemins sont comparés tels que l'API les déclare, paramètres de requête compris : `GET /pow` et `POST /pow` comptent donc pour deux.
:::

## Exemples de code

<Examples method="get" path="/infos" />

## Essayer

<Try name="Infos" />
