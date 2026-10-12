# Génération de QR Code

L'endpoint `/qrcode` génère un QR Code à partir d'une URL fournie en paramètre. Cet endpoint est pratique pour générer rapidement une image au format PNG.

<Endpoint method="get" path="/qrcode" />

## Paramètres

| Paramètre | Requis | Description                                                       |
| --------- | ------ | ----------------------------------------------------------------- |
| `url`     | Oui    | L'URL à encoder dans le QR Code. Doit contenir l'adresse complète |

## Exemple de requête

```
GET /v3/qrcode?url=https://moxon.dev
```

## Réponse

```json
{
    "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOaSURBVO3BQY5jBxYDwcwH3f/KnF7MgqsPCFKV7..."
}
```

## Champs de réponse

| Champ | Description                            |
| ----- | -------------------------------------- |
| `qr`  | Image PNG du QR Code encodée en Base64 |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/qrcode?url=https://moxon.dev"
```

## Utilisation de la réponse

La réponse contient une image PNG encodée en base64. Vous pouvez l'utiliser directement en HTML :

```html
<img src="data:image/png;base64,iVBORw0KGgo..." alt="QR Code" />
```

Ou la décoder et l'enregistrer en tant que fichier dans votre application.

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                          | Description                                 |
| ----------------------------------------- | ------------------------------------------- |
| `Please provide a valid url (?url={URL})` | Le paramètre `url` est manquant ou invalide |
