# Génération de QR Codes

L'endpoint `/qrcode` génère un QR Code à partir d'une URL entrée en paramètre. Cet endpoint est pratique pour générer rapidement une image au format PNG.

<Endpoint method="get" path="/qrcode" />

## Paramètres

| Paramètre | Requis | Description                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| `url`     | Oui    | L'URL du QR Code à générer. Doit contenir l'adresse complète |

## Exemple de requête

```
GET /v2/qrcode?url=https://moxon.dev
```

## Réponse

```json
{
    "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOaSURBVO3BQY5jBxYDwcwH3f/KnF7MgqsPCFKV7..."
}
```

## cURL

```bash
curl -X GET "https://api.moxon.dev/v2/qrcode?url=https://moxon.dev"
```

## Gestion des erreurs

Si la valeur de `url` est vide, une erreur sera renvoyée.
