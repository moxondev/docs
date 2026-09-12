# Génération de couleur

L'endpoint `/color` génère une couleur en plusieurs formats. Vous pouvez fournir une couleur HEX à convertir, ou l'omettre pour obtenir une couleur aléatoire.

<Endpoint method="get" path="/color" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Description                                                   |
| --------- | ------ | ------------------------------------------------------------- |
| `hex`     | Non    | Une couleur HEX à convertir (ex. `ff6600`). Aléatoire si omis |

## Champs de réponse

| Champ  | Type     | Description                                         |
| ------ | -------- | --------------------------------------------------- |
| `hex`  | `string` | Code couleur hexadécimal                            |
| `rgb`  | `string` | Format couleur RGB                                  |
| `hsl`  | `string` | Format couleur HSL (Teinte, Saturation, Luminosité) |
| `hsv`  | `string` | Format couleur HSV (Teinte, Saturation, Valeur)     |
| `hwb`  | `string` | Format couleur HWB (Teinte, Blancheur, Noirceur)    |
| `cmyk` | `string` | Format couleur CMYK (Cyan, Magenta, Jaune, Noir)    |

## Exemples de code

<Examples method="get" path="/color" :params="{ hex: '1a1a2e' }" />

## Essayer

<Try name="Color" />

## Gestion des erreurs

Si les paramètres sont invalides, l'API retournera une erreur :

| Message d'erreur                  | Description                                |
| --------------------------------- | ------------------------------------------ |
| `Invalid HEX color (use #RRGGBB)` | Le paramètre `hex` n'est pas un hex valide |
