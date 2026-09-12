# Analyse d'URL

L'endpoint `/url` décompose une URL en ses composants structurels : schéma, hôte, port, chemin, paramètres de requête et fragment. Les paramètres de requête dupliqués sont regroupés dans un tableau.

<Endpoint method="get" path="/url" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre | Requis | Description                                                                      |
| --------- | ------ | -------------------------------------------------------------------------------- |
| `url`     | Oui    | URL absolue à analyser, incluant son schéma (ex. `https://example.com/path?a=1`) |

## Ports par défaut

Lorsque l'URL omet le port, le port par défaut du schéma est retourné :

| Schéma  | Port |
| ------- | ---- |
| `ftp`   | 21   |
| `http`  | 80   |
| `https` | 443  |
| `ws`    | 80   |
| `wss`   | 443  |

Tout autre schéma retourne `null`.

## Champs de réponse

| Champ      | Type           | Description                                                                                                                    |
| ---------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `url`      | `string`       | L'URL d'entrée originale                                                                                                       |
| `scheme`   | `string`       | Schéma de l'URL sans le `:` final (ex. `https`)                                                                                |
| `host`     | `string`       | Nom d'hôte                                                                                                                     |
| `port`     | `number\|null` | Numéro de port — le port par défaut du schéma si l'URL ne le précise pas, `null` si le schéma n'a pas de port par défaut connu |
| `path`     | `string`       | Composant chemin                                                                                                               |
| `params`   | `object`       | Paramètres de requête — les clés dupliquées sont regroupées en tableau                                                         |
| `fragment` | `string`       | Identifiant de fragment sans le `#` initial                                                                                    |
| `valid`    | `boolean`      | Toujours `true` pour une URL analysée avec succès                                                                              |

## Exemples de code

<Examples method="get" path="/url" :params="{ url: 'https://example.com/path?tag=js&tag=ts#section' }" />

## Essayer

<Try name="URL" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                    | Description                                             |
| ----------------------------------- | ------------------------------------------------------- |
| `Please provide a URL (?url={URL})` | Le paramètre `url` est manquant                         |
| `URL cannot exceed 2048 characters` | L'`url` dépasse la longueur maximale                    |
| `Invalid URL`                       | La valeur `url` ne peut pas être analysée comme une URL |
