# Pour Commencer

<Banner />

Bienvenue dans la documentation de l'**API moxon v2**. Ancienne version de l'API, conservée pour compatibilité.

## URL de Base

Toutes les requêtes API doivent être effectuées vers :

```
https://api.sylvain.sh/v2
```

## Exemple Rapide

```bash
curl -X GET "https://api.sylvain.sh/v2/infos"
```

```json
{
    "endpoints": 17,
    "last_version": "v2",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/20syldev/api",
    "creation": "November 25th 2024"
}
```

## Limitation de Débit

Certains points d'accès ont une [limitation de débit](/v3/fr/pricing) pour prévenir les abus. Si vous dépassez la limite, vous recevrez une réponse d'erreur :

```json
{
    "error": "Rate limit exceeded. Try again in X seconds."
}
```

## Gestion des Erreurs

Tous les points d'accès retournent des réponses d'erreur cohérentes :

```json
{
    "error": "Description de l'erreur"
}
```

## Autres Versions

- [Documentation v4](/v4/fr/) - Dernière version (recommandée)
- [Documentation v3](/v3/fr/) - Version stable précédente
- [Documentation v1](/v1/fr/) - Version historique
