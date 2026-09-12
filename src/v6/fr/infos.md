# Informations sur l'API

L'endpoint `/infos` fournit des informations générales sur l'[API](https://api.sylvain.sh). Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/infos" baseUrl="https://api.sylvain.sh" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre. Il retourne les métadonnées de l'API : nombre d'endpoints et version actuelle. Le lien de documentation, le dépôt GitHub et la date de création ne sont retournés que si l'instance est configurée avec ces informations.

## Champs de réponse

| Champ           | Type     | Description                                                                        |
| --------------- | -------- | ---------------------------------------------------------------------------------- |
| `endpoints`     | `number` | Nombre total d'endpoints disponibles                                               |
| `last_version`  | `string` | Version actuelle de l'API                                                          |
| `documentation` | `string` | URL de la documentation — absent si l'instance ne définit pas `DOCS_URL`           |
| `github`        | `string` | URL du dépôt GitHub — absent si l'instance ne définit pas `REPO_URL`               |
| `creation`      | `string` | Date de création de l'API — absent si l'instance ne définit pas `INSTANCE_CREATED` |

## Exemples de code

<Examples method="get" path="/infos" />

## Essayer

<Try name="Infos" />
