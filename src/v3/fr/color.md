# Génération de couleur

L'endpoint `/color` génère une couleur aléatoire en plusieurs formats. Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/color" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre.

## Exemple de requête

```
GET /v3/color
```

## Réponse

```json
{
    "hex": "#517fff",
    "rgb": "rgb(81, 127, 255)",
    "hsl": "hsl(224, 100%, 66%)",
    "hsv": "hsv(224, 68.2%, 100%)",
    "hwb": "hwb(224, 32%, 0%)",
    "cmyk": "cmyk(68.24%, 50.2%, 0%, 0%)"
}
```

## Champs de réponse

| Champ  | Description                                         |
| ------ | --------------------------------------------------- |
| `hex`  | Code couleur hexadécimal                            |
| `rgb`  | Format couleur RGB                                  |
| `hsl`  | Format couleur HSL (Teinte, Saturation, Luminosité) |
| `hsv`  | Format couleur HSV (Teinte, Saturation, Valeur)     |
| `hwb`  | Format couleur HWB (Teinte, Blancheur, Noirceur)    |
| `cmyk` | Format couleur CMYK (Cyan, Magenta, Jaune, Noir)    |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/color"
```
