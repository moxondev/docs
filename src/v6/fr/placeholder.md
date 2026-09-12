# Placeholder

L'endpoint `/placeholder` génère des placeholders SVG : images simples ou squelettes de chargement animés.

<Endpoint method="get" path="/placeholder" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Description                                              | Défaut                |
| --------- | ------ | -------------------------------------------------------- | --------------------- |
| `type`    | Oui    | `image` ou `skeleton`                                    | —                     |
| `width`   | Non    | Largeur en pixels (1–4000)                               | 800                   |
| `height`  | Non    | Hauteur en pixels (1–4000)                               | 600                   |
| `bg`      | Non    | Couleur de fond (hex)                                    | `#cccccc` / `#e5e5e5` |
| `color`   | Non    | Couleur texte / highlight (hex)                          | `#333333` / `#f5f5f5` |
| `text`    | Non    | Texte affiché (`image` uniquement)                       | `800×600`             |
| `rows`    | Non    | Nombre de lignes (`skeleton` uniquement, 0–20)           | 3                     |
| `avatar`  | Non    | Forme d'avatar : `circle`, `rounded`, `square` ou `true` | —                     |
| `lines`   | Non    | Lignes de texte à côté de l'avatar (`skeleton`)          | 2                     |
| `animate` | Non    | Animation : `shimmer`, `pulse`, `none`                   | `shimmer`             |
| `speed`   | Non    | Vitesse d'animation (0.1–10)                             | 1.5                   |
| `radius`  | Non    | Border radius des blocs (0–50)                           | 4                     |

::: info À savoir
Les valeurs par défaut de `bg` et `color` diffèrent selon le type : `image` utilise `#cccccc`/`#333333`, `skeleton` utilise `#e5e5e5`/`#f5f5f5`.
:::

## Réponse

La réponse est un fichier `image/svg+xml` pour les deux types.

## Exemples de code

<Examples method="get" path="/placeholder" :params="{ type: 'image', width: '400', height: '300', text: 'Hello' }" />

## Essayer

<Try name="Placeholder" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                 | Description                           |
| ------------------------------------------------ | ------------------------------------- |
| `Type must be one of: image, skeleton`           | Le paramètre `type` est invalide      |
| `width must be a number`                         | La largeur n'est pas un nombre valide |
| `width must be between 1 and 4000`               | La largeur est hors limites           |
| `Invalid color (use hex like #ff6600)`           | Un paramètre couleur est mal formaté  |
| `avatar must be one of: circle, rounded, square` | Forme d'avatar invalide               |
| `animate must be one of: shimmer, pulse, none`   | Mode d'animation invalide             |
| `speed must be between 0.1 and 10`               | La vitesse est hors limites           |
| `radius must be between 0 and 50`                | Le radius est hors limites            |
