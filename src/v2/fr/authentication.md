# Authentification

L'API moxon utilise l'authentification par token Bearer pour identifier les utilisateurs avec des plans premium.

## Utilisation

Pour authentifier vos requêtes, incluez votre clé API dans le header `Authorization` :

```bash
curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.moxon.dev/v2/infos
```

## Limites de requêtes

| Plan     | Requêtes/heure |
| -------- | -------------- |
| Free     | 2 000          |
| Advanced | 3 500          |
| Pro      | 6 000          |
| Business | 10 000         |

## Réponses d'erreur

### Token invalide

Si le token fourni est incorrect ou expiré :

```json
{
    "message": "Unauthorized",
    "error": "Invalid token.",
    "status": "401"
}
```

### Aucun token

Si aucun token n'est fourni, la requête utilise les limites du tier FREE (2 000 requêtes/heure).
