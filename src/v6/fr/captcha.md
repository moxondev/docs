# Génération de captcha

L'endpoint `/captcha` génère une image CAPTCHA. Il propose deux modes : `image`, qui retourne la réponse en même temps que l'image, et `challenge`, qui garde la réponse côté serveur pour la vérifier ensuite.

<Endpoint method="get" path="/captcha" baseUrl="https://api.sylvain.sh" />

::: tip Préférez la preuve de travail
Un captcha visuel n'arrête plus un robot déterminé : les modèles de vision les lisent bien, souvent mieux que les humains. Pour une protection anti-bot, préférez **[/pow](/v6/fr/pow)**, qu'aucun modèle ne peut contourner — le seul moyen de passer est de dépenser le calcul.
:::

## Paramètres

| Paramètre | Requis | Description                                                                                |
| --------- | ------ | ------------------------------------------------------------------------------------------ |
| `mode`    | Non    | `image` (défaut) ou `challenge`                                                            |
| `text`    | Non    | Le texte du captcha. Si omis, une chaîne aléatoire est générée. Refusé en mode `challenge` |
| `length`  | Non    | Longueur du texte auto-généré, de 1 à 20. Par défaut : `6`                                 |
| `width`   | Non    | Largeur de l'image en pixels, de 100 à 800. Par défaut : 60 × la longueur du texte         |
| `height`  | Non    | Hauteur de l'image en pixels, de 50 à 400. Par défaut : `120`                              |
| `noise`   | Non    | Niveau de bruit : `low`, `medium` (défaut) ou `high`                                       |
| `bg`      | Non    | Couleur de fond en hexadécimal (ex. `ffffff`)                                              |
| `color`   | Non    | Couleur du texte en hexadécimal (ex. `000000`)                                             |

## Modes disponibles

| Mode        | Réponse                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------- |
| `image`     | Image PNG, avec la réponse dans l'en-tête `X-Captcha-Text`                                          |
| `challenge` | Image PNG, avec un jeton signé dans l'en-tête `X-Captcha-Token` — la réponse n'est jamais transmise |

Les deux modes retournent une image PNG (`Content-Type: image/png`), utilisable dans une balise `<img>`.

En mode `challenge`, la réponse ne quitte jamais le serveur : elle n'existe que dans la signature du jeton, donc intercepter la réponse ne la révèle pas. Le rendu est également durci contre la lecture automatique — les glyphes se chevauchent pour empêcher leur découpage, suivent une ligne de base sinusoïdale, mélangent plusieurs polices, et sont traversés par des traits de la couleur même du texte, qu'aucun filtre ne peut retirer. Le mode `image` par défaut ne change pas. Envoyez le jeton et la réponse de l'utilisateur à [/v6/captcha](./captcha/verify) pour la vérifier.

::: info À savoir
Les deux en-têtes sont exposés au JavaScript des navigateurs via CORS, donc une page web peut les lire dans la réponse.

La chaîne auto-générée évite les caractères ambigus (ex. `0`/`O`, `1`/`l`).
:::

## Exemples de code

<Examples method="get" path="/captcha" :params="{ length: '8', width: '400', noise: 'high', bg: 'f0f0f0' }" />

::: tip Exemple
[Voir un exemple avec un texte auto-généré](https://api.sylvain.sh/v6/captcha?length=8&noise=high)
:::

## Essayer

<Try name="Captcha" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                 | Description                                |
| ------------------------------------------------ | ------------------------------------------ |
| `Mode must be one of: image, challenge`          | La valeur de `mode` n'est pas valide       |
| `A custom text cannot be used in challenge mode` | `text` a été fourni avec `mode=challenge`  |
| `length must be a number`                        | Le paramètre `length` n'est pas un nombre  |
| `length must be between 1 and 20`                | La `length` est hors de la plage autorisée |
| `width must be a number`                         | Le paramètre `width` n'est pas un nombre   |
| `width must be between 100 and 800`              | La `width` est hors de la plage autorisée  |
| `height must be a number`                        | Le paramètre `height` n'est pas un nombre  |
| `height must be between 50 and 400`              | La `height` est hors de la plage autorisée |
| `Noise must be one of: low, medium, high`        | Valeur de `noise` invalide                 |
| `Invalid color (use hex like ff6600)`            | Un paramètre `bg` ou `color` est malformé  |

## Endpoints associés

- <Method type="post" sm /> [/v6/captcha](./captcha/verify) - Vérifier la réponse à un challenge
- <Method type="get" sm /> [/v6/pow](./pow) - Preuve de travail, l'alternative recommandée
