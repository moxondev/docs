# Changelog

## Migration Guide

### Use `/latest` (recommended)

Use `api.moxon.dev/latest` to always point to the latest version:

```
https://api.moxon.dev/latest/infos
https://api.moxon.dev/latest/token
```

### Manual Migration

Replace all occurrences of `/v3/` with `/v4/` in your API requests:

```
# Before
https://api.moxon.dev/v3/infos

# After
https://api.moxon.dev/v4/infos
```

### Endpoint Compatibility

Most endpoints are compatible. Some response fields changed shape (username, personal, domain) and some parameter defaults changed (convert, time, token) — check the individual endpoint pages if something breaks.

## Versions

| Version                         | Highlights                                                           |
| ------------------------------- | -------------------------------------------------------------------- |
| [4.9.0](/v4/en/changelog/4.9.0) | Added Credit, Avatar, Barcode endpoints                              |
| [4.8.0](/v4/en/changelog/4.8.0) | Added Cron, Regex endpoints; countdown on Time                       |
| [4.7.0](/v4/en/changelog/4.7.0) | Added Address, Password endpoints; overhauled Token                  |
| [4.6.0](/v4/en/changelog/4.6.0) | Added Agent, IP, Headers endpoints; security hardening               |
| [4.5.0](/v4/en/changelog/4.5.0) | Security audit, rate limiting, input hardening                       |
| [4.4.0](/v4/en/changelog/4.4.0) | Added QR Code, Captcha, Color, Convert, Hash                         |
| [4.3.0](/v4/en/changelog/4.3.0) | Added Geo, Palette, Placeholder; REST standardization                |
| [4.2.0](/v4/en/changelog/4.2.0) | Added Encode, Text, Validate endpoints                               |
| [4.1.0](/v4/en/changelog/4.1.0) | Added Dice, Statistics; Roman numeral support                        |
| [4.0.0](/v4/en/changelog/4.0.0) | Full TypeScript rewrite; new Algorithms, Levenshtein, Username, Chat |

## Previous Versions

- [v3 Documentation](/v3/en/) - Previous stable version
- [v2 Documentation](/v2/en/) - Legacy version
