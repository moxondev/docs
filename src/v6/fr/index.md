# Commencer

<Banner />

Bienvenue dans la documentation de l'**API moxon v6**. Cette API fournit une collection complète d'endpoints utilitaires pour les développeurs.

## URL de base

Toutes les requêtes API doivent être effectuées vers :

```
https://api.moxon.dev/v6
```

## Exemple rapide

<Try name="Infos" auto-send />

## Utiliser le paquet npm

L'API HTTP disponible sur `https://api.moxon.dev` n'a besoin d'aucun paquet : une simple requête suffit. Le paquet npm **`@moxon/api`** est utile pour appeler les mêmes utilitaires directement depuis Node.js, sans passer par le réseau.

```bash
npm install @moxon/api
```

Le paquet demande **Node.js 22.12 ou plus récent**. Il est distribué en ESM, mais reste utilisable depuis CommonJS : Node sait charger un module ESM avec `require()` depuis la 22.12, d'où cette version minimale.

```js
import { evaluate } from '@moxon/api'; // ESM
const { evaluate } = require('@moxon/api'); // CommonJS
```

### Imports disponibles

L'import racine pointe toujours vers la dernière version. Utilisez un sous-chemin (`/v4` à `/v6`) pour figer une version précise.

| Import                | Contenu                                                                |
| --------------------- | ---------------------------------------------------------------------- |
| `@moxon/api`          | Dernière version, équivalent à `@moxon/api/v6`                         |
| `@moxon/api/v4`       | Fonctions de la v4                                                     |
| `@moxon/api/v5`       | Fonctions de la v5                                                     |
| `@moxon/api/v6`       | Fonctions de la v6                                                     |
| `@moxon/api/server`   | Le serveur HTTP de l'API, avec toutes ses versions, démarré à l'import |
| `@moxon/api/manifest` | Description des endpoints sous forme de données (**expérimental**)     |

Le serveur charge ses plugins de façon asynchrone : depuis CommonJS, il faut l'importer plutôt que le `require()`.

```js
await import('@moxon/api/server'); // depuis CommonJS
```

### Exemple d'utilisation

```js
// Dernière version, équivalent à '@moxon/api/v6'
import { color, evaluate, username } from '@moxon/api';

// Ou une version précise
import { color as colorV4 } from '@moxon/api/v4';

// Évaluer une expression mathématique
const expr = evaluate('sin(pi / 2) + sqrt(4)', 5);
console.log(expr.result); // 3
console.log(expr.expression); // 'sin(pi / 2) + sqrt(4)'

// Générer une couleur aléatoire, convertie dans toutes les notations courantes
const c = color();
console.log(c.hex, c.rgb, c.hsl, c.hsv, c.hwb, c.cmyk);

// Générer un nom d'utilisateur aléatoire
const user = username();
console.log(user.username);
```

::: tip Astuce
Pour décrire les endpoints sous forme de données (méthode, chemin, paramètres, exemple), découvrez le [Manifest](/v6/fr/manifest), un export expérimental du paquet. Si votre projet utilise encore l'ancien nom du paquet, le [guide de migration](/v6/fr/changelog#migrer-depuis-20syldev-api) explique le renommage.
:::

## Limitation de débit

Certains endpoints ont une [limitation de débit](/v6/fr/pricing) pour éviter les abus. Si vous dépassez la limite, vous recevrez une réponse d'erreur :

```json
{
    "message": "Too Many Requests",
    "error": "You have exceeded the limit of 2000 requests per hour.",
    "status": 429
}
```

Selon l'endpoint et le limiteur appliqué, le message d'erreur peut aussi être :

- `Global rate limit exceeded.`
- `Rate limit exceeded. Try again in X seconds.`

## Gestion des erreurs

::: warning Changement en 6.0.0
`status` est désormais un **nombre**. C'était une chaîne (`"400"`), c'est maintenant `400`. Un client qui le compare à une chaîne cessera de correspondre.
:::

Tous les endpoints retournent des réponses d'erreur cohérentes :

```json
{
    "message": "Bad Request",
    "error": "Description de l'erreur",
    "status": 400
}
```

Requêter un endpoint qui n'existe pas retourne aussi une erreur JSON structurée :

```json
{
    "message": "Not Found",
    "error": "Endpoint '/v6/doesnotexist' does not exist.",
    "status": 404
}
```

## Autres versions

- [Documentation v5](/v5/fr/) - Version stable précédente
- [Documentation v4](/v4/fr/) - Ancienne version
