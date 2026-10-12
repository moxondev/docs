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
# redirects to /v5/chat/private?session=abc
```

The redirect works for any HTTP method (`GET`, `POST`, `PATCH`, `DELETE`...) via a `307 Temporary Redirect`, which preserves the original method and body — so `POST /latest/token` redirects to `POST /v5/token` with its body intact.

::: tip Tip
Most HTTP clients don't follow redirects by default. With `curl`, add the `-L` (`--location`) flag, or you'll get the `307` response without ever reaching `/v5`.
:::

### Manual Migration

Replace all occurrences of `/v4/` with `/v5/` in your API requests:

```
# Before
https://api.moxon.dev/v4/infos

# After
https://api.moxon.dev/v5/infos
```

### Endpoint Compatibility

All v4 endpoints are fully compatible in v5. New endpoints are listed in the [5.0.0 changelog](/v5/en/changelog/5.0.0).

## Previous Versions

- [v4 Changelog](/v4/en/changelog) - View all v4 releases
- [v3 Documentation](/v3/en/) - Legacy version
