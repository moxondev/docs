# Changelog

## Migration Guide

### Use `/latest` (recommended)

Use `api.sylvain.sh/latest` to always point to the latest version:

```
https://api.sylvain.sh/latest/infos
https://api.sylvain.sh/latest/evaluate
```

Nested paths and query strings are preserved through the redirect:

```
https://api.sylvain.sh/latest/chat/private?session=abc
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
https://api.sylvain.sh/v5/infos

# After
https://api.sylvain.sh/v6/infos
```

### Endpoint Compatibility

All v5 endpoints are fully compatible in v6. New endpoints are listed in the [6.0.0 changelog](/v6/en/changelog/6.0.0).

## Previous Versions

- [v5 Changelog](/v5/en/changelog) - View all v5 releases
- [v4 Documentation](/v4/en/) - Legacy version
