# Génération de tokens

L'endpoint `/token` permet de générer des chaînes sécurisées appelées _tokens_. Cet endpoint est particulièrement utile pour créer des identifiants aléatoires pour diverses applications.

<Endpoint method="post" path="/token" />

## Paramètres

| Paramètre | Requis | Description                                                       |
| --------- | ------ | ----------------------------------------------------------------- |
| `len`     | Non    | Longueur du token (12-4096). Par défaut : 24                      |
| `type`    | Non    | Type de token (voir les options ci-dessous). Par défaut : `alpha` |

## Types disponibles

| Type       | Description                                   |
| ---------- | --------------------------------------------- |
| `alpha`    | Lettres uniquement (minuscules et majuscules) |
| `alphanum` | Lettres et chiffres                           |
| `base64`   | Encodage Base64                               |
| `hex`      | Chiffres hexadécimaux                         |
| `num`      | Nombres uniquement                            |
| `punct`    | Caractères de ponctuation                     |
| `urlsafe`  | Caractères sûrs pour les URLs                 |
| `uuid`     | Identifiant universel unique (UUID)           |

## Exemple de requête

```
POST /v1/token
Content-Type: application/x-www-form-urlencoded

len=24&type=alphanum
```

## Réponse

```json
{
    "token": "6tMdlDV90x4Sm52dRS7MuGyn"
}
```

## cURL

```bash
curl -X POST -d "len=24&type=alphanum" "https://api.moxon.dev/v1/token"
```

## Gestion des erreurs

Si la valeur de `len` est hors limites, ou que le `type` est invalide, un token de 12 caractères alphanumériques sera généré.
