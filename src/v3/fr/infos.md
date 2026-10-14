# Informations sur l'API

L'endpoint `/infos` fournit des informations générales sur l'[API](https://api.moxon.dev). Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/infos" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre.

## Exemple de requête

```
GET /v3/infos
```

## Réponse

```json
{
    "endpoints": 20,
    "last_version": "v3",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/moxondev/api",
    "creation": "November 25th 2024"
}
```

## Champs de réponse

| Champ           | Description                          |
| --------------- | ------------------------------------ |
| `endpoints`     | Nombre total d'endpoints disponibles |
| `last_version`  | Version actuelle de l'API            |
| `documentation` | URL de la documentation              |
| `github`        | URL du dépôt GitHub                  |
| `creation`      | Date de création de l'API            |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/infos"
```
