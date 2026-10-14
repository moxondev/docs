# Informations sur l'API

L'endpoint `/infos` permet d'afficher les informations générales à propos de l'[API](https://api.moxon.dev). Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/infos" />

## Exemple de requête

```
GET /v1/infos
```

## Réponse

```json
{
    "endpoints": 11,
    "last_version": "v1",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/moxondev/api",
    "creation": "November 25th 2024"
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v1/infos"
```
