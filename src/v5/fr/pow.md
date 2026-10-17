# Preuve de travail

L'endpoint `/pow` émet un défi de preuve de travail, une protection anti-bot destinée à remplacer le captcha visuel. Le serveur fournit un `salt` et une difficulté ; le client cherche un `nonce` dont l'empreinte `sha256` commence par autant de zéros hexadécimaux, puis le renvoie pour vérification.

<Endpoint method="get" path="/pow" baseUrl="https://api.moxon.dev" />

::: info Comment ça marche ?
À la difficulté par défaut de `4`, la résolution demande en moyenne environ 65 000 hachages (16⁴) — moins d'une seconde dans un navigateur, imperceptible pour une personne, mais ruineuse pour un robot qui la répète des milliers de fois. Contrairement à un captcha visuel, aucun modèle de vision ne peut la contourner : le seul moyen de passer est de dépenser le calcul.

La réponse attendue ne voyage jamais jusqu'au client. Le jeton transporte le `salt` et la difficulté en clair, mais sa signature est calculée côté serveur avec un secret : elle ne peut être ni forgée, ni relue.
:::

## Paramètres

| Paramètre    | Requis | Description                                                            |
| ------------ | ------ | ---------------------------------------------------------------------- |
| `difficulty` | Non    | Nombre de zéros hexadécimaux exigés, entier de 1 à 6. Par défaut : `4` |

## Champs de réponse

| Champ          | Type     | Description                                                   |
| -------------- | -------- | ------------------------------------------------------------- |
| `algorithm`    | `string` | Algorithme de hachage utilisé, toujours `sha256`              |
| `salt`         | `string` | Sel aléatoire à préfixer au nonce                             |
| `difficulty`   | `number` | Nombre de zéros hexadécimaux initiaux exigés dans l'empreinte |
| `expires`      | `number` | Horodatage d'expiration du jeton, en millisecondes            |
| `token`        | `string` | Jeton signé à renvoyer pour la vérification                   |
| `instructions` | `string` | Description lisible du travail à effectuer                    |

## Exemples de code

<Examples method="get" path="/pow" :params="{ difficulty: '4' }" />

Résoudre le défi est une boucle, donc inexprimable en une seule requête. Incrémentez un compteur jusqu'à ce que l'empreinte corresponde au préfixe exigé :

```js
const { salt, difficulty, token } = await (await fetch('https://api.moxon.dev/v5/pow')).json();
const target = '0'.repeat(difficulty);

let nonce = 0;
while (true) {
    const bytes = new TextEncoder().encode(salt + nonce);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    const hex = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
    if (hex.startsWith(target)) break;
    nonce++;
}
```

Envoyez ensuite `token` et `nonce` à [/v5/pow](./pow/verify) pour faire vérifier la preuve.

## Essayer

<Try name="Pow" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                     | Description                                    |
| ------------------------------------ | ---------------------------------------------- |
| `Difficulty must be a number`        | Le paramètre `difficulty` n'est pas un nombre  |
| `Difficulty must be between 1 and 6` | La `difficulty` est hors de la plage autorisée |

## Endpoints associés

- <Method type="post" sm /> [/v5/pow](./pow/verify) - Vérifier un défi résolu
- <Method type="get" sm /> [/v5/captcha](./captcha) - Captcha visuel, l'alternative qu'il remplace
