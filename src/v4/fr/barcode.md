# Génération de codes-barres

L'endpoint `/barcode` génère des images de codes-barres à partir d'une chaîne de données. Il supporte plusieurs formats standards et retourne le résultat en SVG ou PNG.

<Endpoint method="get" path="/barcode" baseUrl="https://api.moxon.dev" />

::: info Détails des formats

- **Code 128** : Encode tout caractère ASCII imprimable (codes 32–126).
- **EAN-13 / EAN-8 / UPC-A** : Numérique uniquement. Le chiffre de contrôle est calculé automatiquement s'il est absent, ou validé s'il est fourni.
- **Code 39** : Alphanumérique (`A-Z`, `0-9`, espace, `- . $ / + %`). La saisie est automatiquement mise en majuscules ; les caractères de début/fin sont ajoutés automatiquement.
  :::

## Paramètres

| Paramètre | Requis | Défaut    | Description                                                          |
| --------- | ------ | --------- | -------------------------------------------------------------------- |
| `data`    | Oui    |           | Chaîne de données à encoder dans le code-barres                      |
| `type`    | Non    | `code128` | Format du code-barres : `code128`, `ean13`, `ean8`, `upca`, `code39` |
| `format`  | Non    | `svg`     | Format de sortie : `svg` ou `png`                                    |
| `width`   | Non    | `2`       | Largeur unitaire des barres en pixels (1–5)                          |
| `height`  | Non    | `100`     | Hauteur des barres en pixels (50–300)                                |
| `color`   | Non    | `#000000` | Couleur des barres en hexadécimal (ex. `000000`)                     |
| `bg`      | Non    | `#ffffff` | Couleur de fond en hexadécimal (ex. `ffffff`)                        |

## Réponse

Par défaut (`format=svg`), l'endpoint retourne une **image SVG inline** (`Content-Type: image/svg+xml`), utilisable dans une balise `<img>` :

```html
<img src="https://api.moxon.dev/v4/barcode?data=Hello123" alt="Code-barres" />
```

Avec `format=png`, la réponse est un buffer PNG brut (`Content-Type: image/png`) :

```html
<img src="https://api.moxon.dev/v4/barcode?data=Hello123&format=png" alt="Code-barres" />
```

## Exemples de code

<Examples method="get" path="/barcode" :params="{ data: 'Hello123', type: 'code128' }" />

## Essayer

<Try name="Barcode" />

## Gestion des erreurs

| Message d'erreur                                                           | Description                                                                 |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `Please provide data to encode (?data={string})`                           | Le paramètre `data` est manquant                                            |
| `Type must be one of: code128, ean13, ean8, upca, code39`                  | La valeur de `type` n'est pas valide                                        |
| `Format must be one of: svg, png`                                          | La valeur de `format` n'est pas valide                                      |
| `Width must be between 1 and 5`                                            | Le paramètre `width` est hors de la plage autorisée                         |
| `Height must be between 50 and 300`                                        | Le paramètre `height` est hors de la plage autorisée                        |
| `Code 128 only supports ASCII 32-126 (invalid char: "{ch}")`               | Un caractère dans `data` est hors de la plage Code 128 supportée            |
| `EAN-13 requires 12 or 13 digits`                                          | La chaîne `data` n'a pas le bon nombre de chiffres                          |
| `Invalid EAN-13 check digit (expected {expected}, got {actual})`           | Le chiffre de contrôle EAN-13 fourni ne correspond pas à la valeur calculée |
| `EAN-8 requires 7 or 8 digits`                                             | La chaîne `data` n'a pas le bon nombre de chiffres                          |
| `Invalid EAN-8 check digit (expected {expected}, got {actual})`            | Le chiffre de contrôle EAN-8 fourni ne correspond pas à la valeur calculée  |
| `UPC-A requires 11 or 12 digits`                                           | La chaîne `data` n'a pas le bon nombre de chiffres                          |
| `Code 39 invalid character: "{ch}". Allowed: A-Z, 0-9, space, - . $ / + %` | Un caractère dans `data` n'est pas autorisé en Code 39                      |
| `Invalid color (use hex like ff6600)`                                      | Une valeur `color` ou `bg` n'est pas une couleur hexadécimale valide        |
