# JWT

L'endpoint `/jwt` décode un JSON Web Token sans vérifier la signature. L'expiration est détectée via le claim `exp`.

<Endpoint method="post" path="/jwt" baseUrl="https://api.sylvain.sh" />

## Paramètres

Le corps de la requête doit être en JSON :

| Paramètre | Requis | Description   |
| --------- | ------ | ------------- |
| `token`   | Oui    | JWT à décoder |

## Champs de réponse

| Champ       | Type      | Description                                               |
| ----------- | --------- | --------------------------------------------------------- |
| `header`    | `object`  | Header JWT décodé (algorithme, type, etc.)                |
| `payload`   | `object`  | Payload JWT décodé (claims)                               |
| `signature` | `string`  | Signature brute (non vérifiée)                            |
| `expired`   | `boolean` | `true` si `exp` est dépassé — absent si aucun claim `exp` |

## Exemples de code

<Examples method="post" path="/jwt" :body="{ token: 'eyJ...' }" />

## Essayer

<Try name="JWT" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                                 | Description                                                                                                 |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `Please provide a token (?token={token})`                        | Le paramètre `token` est manquant                                                                           |
| `Token cannot exceed 8192 characters`                            | Le token dépasse la longueur maximale                                                                       |
| `Invalid JWT format. Expected 3 parts separated by "."`          | Le token n'a pas 3 parties séparées par des `.`                                                             |
| `Invalid JWT header: not a valid base64url-encoded JSON object`  | Le header n'est pas un JSON base64url valide, ou ne décode pas vers un objet (ex. un tableau ou une chaîne) |
| `Invalid JWT payload: not a valid base64url-encoded JSON object` | Le payload n'est pas un JSON base64url valide, ou ne décode pas vers un objet                               |
