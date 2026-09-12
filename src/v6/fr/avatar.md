# Génération d'avatars

L'endpoint `/avatar` génère des images d'avatars déterministes à partir d'une chaîne seed. Le même seed produit toujours la même image, ce qui permet des représentations d'utilisateurs cohérentes.

<Endpoint method="get" path="/avatar" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Défaut         | Description                                                                 |
| --------- | ------ | -------------- | --------------------------------------------------------------------------- |
| `seed`    | Non    | UUID aléatoire | Chaîne seed pour la génération déterministe — même seed, même image         |
| `type`    | Non    | `identicon`    | Type d'avatar : `identicon` (grille symétrique 5×5) ou `pixel` (grille 8×8) |
| `format`  | Non    | `png`          | Format de sortie : `png` ou `svg`                                           |
| `size`    | Non    | `200`          | Taille de l'image en pixels (50–2000)                                       |
| `bg`      | Non    | `#f0f0f0`      | Couleur de fond en hexadécimal (ex. `f0f0f0`)                               |

## Réponse

Par défaut (`format=png`), l'endpoint retourne une **image PNG directe** (`Content-Type: image/png`), utilisable dans une balise `<img>` :

```html
<img src="https://api.sylvain.sh/v6/avatar?seed=alice" alt="Avatar" />
```

Avec `format=svg`, la réponse est un SVG inline (`Content-Type: image/svg+xml`) :

```html
<img src="https://api.sylvain.sh/v6/avatar?seed=alice&format=svg" alt="Avatar" />
```

## Exemples de code

<Examples method="get" path="/avatar" :params="{ seed: 'claude', type: 'identicon', size: '200' }" />

## Essayer

<Try name="Avatar" />

## Gestion des erreurs

| Message d'erreur                                | Description                                              |
| ----------------------------------------------- | -------------------------------------------------------- |
| `Size must be between 50 and 2000`              | Le paramètre `size` est hors de la plage autorisée       |
| `Please provide a valid size (&size={50-2000})` | Le paramètre `size` n'est pas un nombre valide           |
| `Type must be one of: identicon, pixel`         | La valeur de `type` n'est pas valide                     |
| `Format must be one of: png, svg`               | La valeur de `format` n'est pas valide                   |
| `Invalid color (use hex like ff6600)`           | La couleur `bg` n'est pas une valeur hexadécimale valide |
