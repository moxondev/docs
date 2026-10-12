# Commencer

<Banner />

Bienvenue dans la documentation de l'**API moxon v6**. Cette API fournit une collection complète d'endpoints utilitaires pour les développeurs.

## URL de base

Toutes les requêtes API doivent être effectuées vers :

```
https://api.moxon.dev/v6
```

## Exemple rapide

<Try name="Infos" auto-send />

## Limitation de débit

Certains endpoints ont une [limitation de débit](/v6/fr/pricing) pour éviter les abus. Si vous dépassez la limite, vous recevrez une réponse d'erreur :

```json
{
    "message": "Too Many Requests",
    "error": "You have exceeded the limit of 2000 requests per hour.",
    "status": 429
}
```

Selon l'endpoint et le limiteur appliqué, le message d'erreur peut aussi être :

- `Global rate limit exceeded.`
- `Rate limit exceeded. Try again in X seconds.`

## Gestion des erreurs

::: warning Changement en 6.0.0
`status` est désormais un **nombre**. C'était une chaîne (`"400"`), c'est maintenant `400`. Un client qui le compare à une chaîne cessera de correspondre.
:::

Tous les endpoints retournent des réponses d'erreur cohérentes :

```json
{
    "message": "Bad Request",
    "error": "Description de l'erreur",
    "status": 400
}
```

Requêter un endpoint qui n'existe pas retourne aussi une erreur JSON structurée :

```json
{
    "message": "Not Found",
    "error": "Endpoint '/v6/doesnotexist' does not exist.",
    "status": 404
}
```

## Autres versions

- [Documentation v5](/v5/fr/) - Version stable précédente
- [Documentation v4](/v4/fr/) - Ancienne version
