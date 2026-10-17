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

### Migrer depuis @20syldev/api

Le paquet `@20syldev/api` devient `@moxon/api` et n'évolue plus. Les exports et l'API HTTP `/v6` sont inchangés : migrer ne demande qu'un renommage.

```bash
npm uninstall @20syldev/api
npm install @moxon/api
```

Remplacez ensuite le nom du paquet dans vos imports. Les sous-chemins sont identiques :

```diff
- import { evaluate } from '@20syldev/api/v6';
+ import { evaluate } from '@moxon/api/v6';
```

| Avant                  | Après               |
| ---------------------- | ------------------- |
| `@20syldev/api`        | `@moxon/api`        |
| `@20syldev/api/v4`     | `@moxon/api/v4`     |
| `@20syldev/api/v5`     | `@moxon/api/v5`     |
| `@20syldev/api/v6`     | `@moxon/api/v6`     |
| `@20syldev/api/server` | `@moxon/api/server` |

Le sous-chemin `@moxon/api/manifest` est nouveau et expérimental : voir la page [Manifest](/v6/fr/manifest).

::: warning Versions v1 à v3
`v1`, `v2` et `v3` ont été retirées en 6.0.0. Elles ne restent disponibles que via `@20syldev/api@5.9.0`.
:::

### Compatibilité des endpoints

La v6 n'est **pas** un remplacement transparent de la v5. Cinq endpoints changent de méthode ou de chemin, le captcha change de mode par défaut, et le champ `status` des réponses d'erreur change de type. Lisez le [changelog 6.0.0](/v6/fr/changelog/6.0.0) avant de migrer.

| Ce qui change             | v5                          | v6                          |
| ------------------------- | --------------------------- | --------------------------- |
| Effacer un chat privé     | `DELETE /chat/:token`       | `POST /chat/clear`          |
| Jouer un coup (corps)     | `POST /tic-tac-toe`         | `POST /tic-tac-toe/play`    |
| Jouer un coup (URL)       | `PATCH /tic-tac-toe/:game`  | `POST /tic-tac-toe/play`    |
| Abandonner une partie     | `DELETE /tic-tac-toe/:game` | `POST /tic-tac-toe/forfeit` |
| Comparer deux chaînes     | `GET /levenshtein`          | `POST /levenshtein`         |
| Mode captcha par défaut   | `image`                     | `challenge`                 |
| `status` dans les erreurs | chaîne (`"400"`)            | nombre (`400`)              |

`/hyperplanning` est déprécié et n'est plus listé en v6 ; il répond encore, et disparaîtra en 7.0.0.

## Versions précédentes

- [Changelog v5](/v5/fr/changelog) - Voir toutes les versions v5
- [Documentation v4](/v4/fr/) - Ancienne version
