# Informations sur l'API

L'endpoint `/infos` permet d'afficher les informations générales à propos de l'[API](https://api.moxon.dev). Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/infos" />

## Exemple de requête

```
GET /v2/infos
```

## Réponse

```json
{
    "endpoints": 17,
    "last_version": "v2",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/moxondev/api",
    "creation": "November 25th 2024"
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v2/infos"
```
