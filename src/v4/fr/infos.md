# Informations sur l'API

L'endpoint `/infos` fournit des informations générales sur l'[API](https://api.moxon.dev). Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/infos" baseUrl="https://api.moxon.dev" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre. Il retourne les métadonnées de l'API : nombre d'endpoints, version actuelle, lien de documentation et date de création.

## Champs de réponse

| Champ           | Type     | Description                          |
| --------------- | -------- | ------------------------------------ |
| `endpoints`     | `number` | Nombre total d'endpoints disponibles |
| `last_version`  | `string` | Version actuelle de l'API            |
| `documentation` | `string` | URL de la documentation              |
| `github`        | `string` | URL du dépôt GitHub                  |
| `creation`      | `string` | Date de création de l'API            |

## Exemples de code

<Examples method="get" path="/infos" />

## Essayer

<Try name="Infos" />
