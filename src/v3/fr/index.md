# Commencer

<Banner />

Bienvenue dans la documentation de l'**API moxon v3**. Version obsolète de l'API, conservée à titre de référence.

## URL de base

Toutes les requêtes API doivent être effectuées vers :

```
https://api.moxon.dev/v3
```

## Exemple rapide

```bash
curl -X GET "https://api.moxon.dev/v3/infos"
```

```json
{
    "endpoints": 20,
    "last_version": "v3",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/20syldev/api",
    "creation": "November 25th 2024"
}
```

## Limitation de débit

Certains endpoints ont une [limitation de débit](/v3/fr/pricing) pour éviter les abus. Si vous dépassez la limite, vous recevrez une réponse d'erreur :

```json
{
    "error": "Rate limit exceeded. Try again in X seconds."
}
```

## Gestion des erreurs

Tous les endpoints retournent des réponses d'erreur cohérentes :

```json
{
    "error": "Description de l'erreur"
}
```

## Autres versions

- [Documentation v2](/v2/fr/) - Version stable précédente
- [Documentation v1](/v1/fr/) - Version ancienne
