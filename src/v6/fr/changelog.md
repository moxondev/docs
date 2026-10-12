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
https://api.moxon.dev/v5/infos

# Après
https://api.moxon.dev/v6/infos
```

### Compatibilité des endpoints

La v6 n'est **pas** un remplacement transparent de la v5. Quatre endpoints changent de méthode ou de chemin, le captcha change de mode par défaut, et le champ `status` des réponses d'erreur change de type. Lisez le [changelog 6.0.0](/v6/fr/changelog/6.0.0) avant de migrer.

| Ce qui change             | v5                          | v6                          |
| ------------------------- | --------------------------- | --------------------------- |
| Effacer un chat privé     | `DELETE /chat/:token`       | `POST /chat/clear`          |
| Jouer un coup             | `PATCH /tic-tac-toe/:game`  | `POST /tic-tac-toe/play`    |
| Abandonner une partie     | `DELETE /tic-tac-toe/:game` | `POST /tic-tac-toe/forfeit` |
| Comparer deux chaînes     | `GET /levenshtein`          | `POST /levenshtein`         |
| Mode captcha par défaut   | `image`                     | `challenge`                 |
| `status` dans les erreurs | chaîne (`"400"`)            | nombre (`400`)              |

`/hyperplanning` est déprécié et n'est plus listé en v6 ; il répond encore, et disparaîtra en 7.0.0.

## Versions précédentes

- [Changelog v5](/v5/fr/changelog) - Voir toutes les versions v5
- [Documentation v4](/v4/fr/) - Ancienne version
