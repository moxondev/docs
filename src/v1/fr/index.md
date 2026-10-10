# Pour Commencer

<Banner />

Bienvenue dans la documentation de l'**API moxon v1**. Ceci est la version historique de l'API.

## URL de Base

Toutes les requêtes API doivent être effectuées vers :

```
https://api.sylvain.sh/v1
```

## Exemple Rapide

```bash
curl -X GET "https://api.sylvain.sh/v1/infos"
```

```json
{
    "endpoints": 11,
    "last_version": "v1",
    "documentation": "https://docs.sylvain.sh",
    "github": "https://github.com/20syldev/api",
    "creation": "November 25th 2024"
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
- [Documentation v2](/v2/fr/) - Ancienne version
