# Authentification

L'API moxon utilise l'authentification par token Bearer pour identifier les utilisateurs avec des plans premium.

## Utilisation

Pour authentifier vos requêtes, incluez votre clé API dans le header `Authorization` :

```bash
curl -H "Authorization: Bearer VOTRE_CLE_API" https://api.sylvain.sh/v3/infos
```

## Limites de requêtes

| Plan     | Requêtes/heure |
| -------- | -------------- |
| Free     | 2 000          |
| Advanced | 3 500          |
| Pro      | 6 000          |
| Business | 10 000         |

Voir la page [Tarification](/v3/fr/pricing) pour plus de détails.

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

## Obtenir une clé API

Pour obtenir une clé API, achetez un plan sur la page [Tarification](/v3/fr/pricing). Votre token unique sera envoyé à votre email après l'achat.
