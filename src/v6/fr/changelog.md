# Changelog

## Guide de migration

### Utiliser `/latest` (recommandé)

Utilisez `api.sylvain.sh/latest` pour toujours pointer vers la dernière version :

```
https://api.sylvain.sh/latest/infos
https://api.sylvain.sh/latest/evaluate
```

Les chemins imbriqués et les paramètres de requête sont préservés par la redirection :

```
https://api.sylvain.sh/latest/chat/private?session=abc
# redirige vers /v6/chat/private?session=abc
```

La redirection fonctionne avec n'importe quelle méthode HTTP (`GET`, `POST`, `PATCH`, `DELETE`...) via un `307 Temporary Redirect`, qui préserve la méthode et le corps d'origine — ainsi `POST /latest/token` redirige vers `POST /v6/token` avec son corps intact.

::: tip Astuce
La plupart des clients HTTP ne suivent pas les redirections par défaut. Avec `curl`, ajoutez l'option `-L` (`--location`), sinon vous recevrez la réponse `307` sans jamais atteindre `/v6`.
:::

### Migration manuelle

Remplacez `/v5/` par `/v6/` dans vos requêtes :

```
# Avant
https://api.sylvain.sh/v5/infos

# Après
https://api.sylvain.sh/v6/infos
```

### Compatibilité des endpoints

Tous les endpoints v5 sont entièrement compatibles en v6. Les nouveaux endpoints sont listés dans le [changelog 6.0.0](/v6/fr/changelog/6.0.0).

## Versions précédentes

- [Changelog v5](/v5/fr/changelog) - Voir toutes les versions v5
- [Documentation v4](/v4/fr/) - Ancienne version
