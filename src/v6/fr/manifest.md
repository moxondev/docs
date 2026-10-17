# Manifest (expérimental)

Le sous-chemin **`@moxon/api/manifest`** du [paquet npm](/v6/fr/#utiliser-le-paquet-npm) décrit les endpoints HTTP sous forme de données : méthode, chemin, catégorie, paramètres et exemple de requête. Il s'adresse aux outils qui documentent ou appellent l'API, comme une barre latérale de documentation, des listes de paramètres ou un playground.

::: warning Expérimental
Le manifest est expérimental : sa forme peut encore changer dans une version mineure. Il ne liste pour l'instant que les endpoints déjà déclarés comme contrats (`hash` pour l'instant) et ne doit donc pas être pris pour la liste complète de l'API.
:::

## Import

```js
import { manifest } from '@moxon/api/manifest';
```

`manifest` est un tableau de `ManifestEntry`, un par endpoint déclaré. Comme les imports de la bibliothèque, il fonctionne en ESM comme en CommonJS (Node.js 22.12 ou plus récent).

## Champs d'une entrée

Chaque entrée décrit un endpoint, sans sa fonction d'exécution (`run`) : le manifest ne contient que des données.

| Champ      | Type                                                                                     | Description                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `name`     | `string`                                                                                 | Identifiant de l'endpoint (par exemple `hash`)                                                |
| `method`   | `'get' \| 'post'`                                                                        | Méthode HTTP, en minuscules                                                                   |
| `path`     | `string`                                                                                 | Chemin sans préfixe de version (par exemple `/hash`)                                          |
| `category` | `'security' \| 'text' \| 'images' \| 'compute' \| 'fakeData' \| 'network' \| 'realtime'` | Catégorie de documentation                                                                    |
| `since`    | `number`                                                                                 | Première version de l'API qui sert l'endpoint (par exemple `5`) — absent si toutes le servent |
| `params`   | `Record<string, Param>`                                                                  | Paramètres de l'endpoint, indexés par leur nom                                                |
| `example`  | `Record<string, string>`                                                                 | Exemple d'entrée, dont les valeurs sont des chaînes de caractères                             |

Chaque paramètre de `params` est un objet `Param`, dont tous les champs sont optionnels :

| Champ      | Type                | Description                                                                        |
| ---------- | ------------------- | ---------------------------------------------------------------------------------- |
| `required` | `boolean`           | Le paramètre est obligatoire                                                       |
| `missing`  | `string`            | Message exact de l'erreur `400` renvoyée quand ce paramètre obligatoire est absent |
| `options`  | `readonly string[]` | Valeurs acceptées                                                                  |
| `default`  | `string`            | Valeur utilisée quand le paramètre est omis                                        |

Les types `Category` et `Param` ne sont pas exportés sous leur nom : en TypeScript, on y accède par `ManifestEntry['category']` et `ManifestEntry['params'][string]`.

## Contenu actuel

Seul l'endpoint [POST /hash](/v6/fr/hash) est déclaré pour l'instant. Voici l'entrée telle que l'exporte le paquet :

```json
[
    {
        "name": "hash",
        "method": "post",
        "path": "/hash",
        "category": "security",
        "params": {
            "text": { "required": true, "missing": "Please provide a text (?text={text})" },
            "method": { "required": true, "missing": "Please provide a valid hash algorithm (&method={algorithm})" },
            "encoding": { "options": ["hex", "base64"], "default": "hex" }
        },
        "example": { "text": "hello", "method": "sha256" }
    }
]
```

Cette entrée n'a pas de champ `since` : l'endpoint est servi par toutes les versions, de la v4 à la v6.

Déclarer un endpoint comme contrat n'en change pas le comportement : les routes HTTP et le manifest sont construits à partir de la même déclaration, donc ils ne peuvent pas diverger, et `/hash` répond exactement de la même façon de la v4 à la v6. Les autres endpoints sont encore écrits à la main et rejoindront le manifest un par un.

## Exemples d'utilisation

Retrouver l'entrée de `hash` et lire ses informations :

```js
import { manifest } from '@moxon/api/manifest';

const hash = manifest.find((entry) => entry.name === 'hash');
console.log(hash.method, hash.path); // 'post' '/hash'
console.log(Object.keys(hash.params)); // ['text', 'method', 'encoding']
console.log(hash.example); // { text: 'hello', method: 'sha256' }
```

Appeler l'API à partir d'une entrée. Les paramètres d'un endpoint `post` partent dans le corps JSON ; pour un endpoint `get`, ils iraient dans la chaîne de requête.

```js
import { manifest } from '@moxon/api/manifest';

const entry = manifest.find((item) => item.name === 'hash');

const response = await fetch(`https://api.moxon.dev/v6${entry.path}`, {
    method: entry.method.toUpperCase(),
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry.example),
});

console.log(await response.json());
// {
//     method: 'sha256',
//     hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
//     encoding: 'hex'
// }
```

## Voir aussi

- [POST /hash](/v6/fr/hash) - L'endpoint actuellement décrit par le manifest
- [Utiliser le paquet npm](/v6/fr/#utiliser-le-paquet-npm) - Installation et imports disponibles
