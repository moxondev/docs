# Commencer

<Banner />

Bienvenue dans la documentation de l'**API moxon v4**. Ceci est la version stable précédente de l'API.

## URL de base

Toutes les requêtes API doivent être effectuées vers :

```
https://api.moxon.dev/v4
```

## Exemple rapide

<Try name="Infos" auto-send />

## Limitation de débit

Certains endpoints ont une [limitation de débit](/v4/fr/pricing) pour éviter les abus. Si vous dépassez la limite, vous recevrez une réponse d'erreur :

```json
{
    "message": "Too Many Requests",
    "error": "You have exceeded the limit of 2000 requests per hour.",
    "documentation": "https://docs.sylvain.sh",
    "status": "429"
}
```

Selon l'endpoint et le limiteur appliqué, le message d'erreur peut aussi être :

- `Global rate limit exceeded.`
- `Rate limit exceeded. Try again in X seconds.`

## Gestion des erreurs

Tous les endpoints retournent des réponses d'erreur cohérentes :

```json
{
    "message": "Bad Request",
    "error": "Description de l'erreur",
    "documentation": "https://docs.sylvain.sh/v4/{endpoint}",
    "status": "400"
}
```

## Autres versions

- [Documentation v3](/v3/fr/) - Version stable précédente
- [Documentation v2](/v2/fr/) - Ancienne version
