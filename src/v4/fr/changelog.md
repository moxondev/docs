# Changelog

## Guide de migration

### Utiliser `/latest` (recommandé)

Utilisez `api.moxon.dev/latest` pour toujours pointer vers la dernière version :

```
https://api.moxon.dev/latest/infos
https://api.moxon.dev/latest/token
```

### Migration manuelle

Remplacez `/v3/` par `/v4/` dans vos requêtes :

```
# Avant
https://api.moxon.dev/v3/infos

# Après
https://api.moxon.dev/v4/infos
```

### Compatibilité des endpoints

La plupart des endpoints sont compatibles. Certains champs de réponse ont changé de structure (username, personal, domain) et certains paramètres par défaut ont évolué (convert, time, token) — consultez les pages d'endpoints concernées en cas de problème.

## Versions

| Version                         | Points clés                                                                                    |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| [4.9.0](/v4/fr/changelog/4.9.0) | Ajout des endpoints Credit, Avatar, Barcode                                                    |
| [4.8.0](/v4/fr/changelog/4.8.0) | Ajout des endpoints Cron, Regex ; compte à rebours sur Time                                    |
| [4.7.0](/v4/fr/changelog/4.7.0) | Ajout des endpoints Address, Password ; refonte de Token                                       |
| [4.6.0](/v4/fr/changelog/4.6.0) | Ajout des endpoints Agent, IP, Headers ; sécurité renforcée                                    |
| [4.5.0](/v4/fr/changelog/4.5.0) | Audit de sécurité, rate limiting, durcissement des entrées                                     |
| [4.4.0](/v4/fr/changelog/4.4.0) | Ajout des endpoints QR Code, Captcha, Color, Convert, Hash                                     |
| [4.3.0](/v4/fr/changelog/4.3.0) | Ajout des endpoints Geo, Palette, Placeholder ; standardisation REST                           |
| [4.2.0](/v4/fr/changelog/4.2.0) | Ajout des endpoints Encode, Text, Validate                                                     |
| [4.1.0](/v4/fr/changelog/4.1.0) | Ajout des endpoints Dice, Statistics ; support des chiffres romains                            |
| [4.0.0](/v4/fr/changelog/4.0.0) | Réécriture complète en TypeScript ; nouveaux endpoints Algorithms, Levenshtein, Username, Chat |

## Versions précédentes

- [Documentation v3](/v3/fr/) - Version stable précédente
- [Documentation v2](/v2/fr/) - Ancienne version
