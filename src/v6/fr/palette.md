# Palette

L'endpoint `/palette` génère une palette de couleurs harmonieuse à partir d'une couleur HEX.

<Endpoint method="get" path="/palette" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Description                        |
| --------- | ------ | ---------------------------------- |
| `color`   | Oui    | Couleur de base en HEX (`#RRGGBB`) |
| `type`    | Oui    | Type de palette (voir ci-dessous)  |

## Types de palette

| Type                  | Couleurs générées        |
| --------------------- | ------------------------ |
| `complementary`       | 2 couleurs (opposées)    |
| `triadic`             | 3 couleurs (120°)        |
| `analogous`           | 5 couleurs (-60° à +60°) |
| `tetradic`            | 4 couleurs (90°)         |
| `split-complementary` | 3 couleurs               |

## Champs de réponse

| Champ          | Type     | Description             |
| -------------- | -------- | ----------------------- |
| `base.hex`     | `string` | Couleur de base en HEX  |
| `base.rgb`     | `string` | Couleur de base en RGB  |
| `base.hsl`     | `string` | Couleur de base en HSL  |
| `type`         | `string` | Type de palette utilisé |
| `colors`       | `array`  | Couleurs générées       |
| `colors[].hex` | `string` | Couleur en format HEX   |
| `colors[].rgb` | `string` | Couleur en format RGB   |
| `colors[].hsl` | `string` | Couleur en format HSL   |

## Exemples de code

<Examples method="get" path="/palette" :params="{ color: '#ff6600', type: 'triadic' }" />

## Essayer

<Try name="Palette" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                                                        | Description                       |
| --------------------------------------------------------------------------------------- | --------------------------------- |
| `A base color is required`                                                              | Le paramètre `color` est manquant |
| `A palette type is required`                                                            | Le paramètre `type` est manquant  |
| `Invalid HEX color (use #RRGGBB)`                                                       | Le format de couleur est invalide |
| `Type must be one of: complementary, triadic, analogous, tetradic, split-complementary` | Type de palette invalide          |
