# Changelog

## Guide de migration

### Utiliser `/latest` (recommandé)

Utilisez `api.moxon.dev/latest` pour toujours pointer vers la dernière version :

```
https://api.moxon.dev/latest/infos
https://api.moxon.dev/latest/evaluate
```

Les chemins imbriqués et les paramètres de requête sont préservés par la redirection :

```
https://api.moxon.dev/latest/chat/private?session=abc
# redirige vers /v5/chat/private?session=abc
```

La redirection fonctionne avec n'importe quelle méthode HTTP (`GET`, `POST`, `PATCH`, `DELETE`...) via un `307 Temporary Redirect`, qui préserve la méthode et le corps d'origine — ainsi `POST /latest/token` redirige vers `POST /v5/token` avec son corps intact.

::: tip Astuce
La plupart des clients HTTP ne suivent pas les redirections par défaut. Avec `curl`, ajoutez l'option `-L` (`--location`), sinon vous recevrez la réponse `307` sans jamais atteindre `/v5`.
:::

### Migration manuelle

Remplacez `/v4/` par `/v5/` dans vos requêtes :

```
# Avant
https://api.moxon.dev/v4/infos

# Après
https://api.moxon.dev/v5/infos
```

### Compatibilité des endpoints

Tous les endpoints v4 sont entièrement compatibles en v5. Les nouveaux endpoints sont listés dans le [changelog 5.0.0](/v5/fr/changelog/5.0.0).

## Versions précédentes

- [Changelog v4](/v4/fr/changelog) - Voir toutes les versions v4
- [Documentation v3](/v3/fr/) - Ancienne version
