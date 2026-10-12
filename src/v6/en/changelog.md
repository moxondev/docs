# Changelog

## Migration Guide

### Use `/latest` (recommended)

Use `api.moxon.dev/latest` to always point to the latest version:

```
https://api.moxon.dev/latest/infos
https://api.moxon.dev/latest/evaluate
```

Nested paths and query strings are preserved through the redirect:

```
https://api.moxon.dev/latest/chat/private?session=abc
# redirects to /v6/chat/private?session=abc
```

The redirect works for any HTTP method (`GET`, `POST`, `PATCH`, `DELETE`...) via a `307 Temporary Redirect`, which preserves the original method and body — so `POST /latest/token` redirects to `POST /v6/token` with its body intact.

::: tip Tip
Most HTTP clients don't follow redirects by default. With `curl`, add the `-L` (`--location`) flag, or you'll get the `307` response without ever reaching `/v6`.
:::

### Manual Migration

Replace all occurrences of `/v5/` with `/v6/` in your API requests:

```
# Before
https://api.moxon.dev/v5/infos

# After
https://api.moxon.dev/v6/infos
```

### Endpoint Compatibility

v6 is **not** a drop-in replacement for v5. Four endpoints changed method or path, the captcha changed its default mode, and the `status` field of error responses changed type. Read the [6.0.0 changelog](/v6/en/changelog/6.0.0) before migrating.

| What changed                | v5                          | v6                          |
| --------------------------- | --------------------------- | --------------------------- |
| Clear a private chat        | `DELETE /chat/:token`       | `POST /chat/clear`          |
| Play a move                 | `PATCH /tic-tac-toe/:game`  | `POST /tic-tac-toe/play`    |
| Forfeit a game              | `DELETE /tic-tac-toe/:game` | `POST /tic-tac-toe/forfeit` |
| Compare two strings         | `GET /levenshtein`          | `POST /levenshtein`         |
| Captcha default mode        | `image`                     | `challenge`                 |
| `status` in error responses | string (`"400"`)            | number (`400`)              |

`/hyperplanning` is deprecated and no longer listed in v6; it still answers, and disappears in 7.0.0.

## Previous Versions

- [v5 Changelog](/v5/en/changelog) - View all v5 releases
- [v4 Documentation](/v4/en/) - Legacy version
