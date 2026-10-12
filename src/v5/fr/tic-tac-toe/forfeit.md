# Tic-Tac-Toe Forfait

L'endpoint `/tic-tac-toe/:game` permet d'abandonner une partie (forfait).

<Endpoint method="delete" path="/tic-tac-toe/:game" baseUrl="https://api.moxon.dev" />

## Paramètres

| Paramètre  | Requis | Description                                  |
| ---------- | ------ | -------------------------------------------- |
| `game`     | Oui    | L'identifiant de la partie (paramètre d'URL) |
| `username` | Oui    | Le nom d'utilisateur qui abandonne           |
| `session`  | Oui    | L'identifiant de session de l'utilisateur    |

::: info À savoir
Le paramètre `game` fait partie du chemin de l'URL. Les autres paramètres sont envoyés dans un body JSON avec `Content-Type: application/json`.
:::

## Champs de réponse

| Champ     | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `message` | `string` | Confirmation du forfait                   |
| `winner`  | `string` | Nom d'utilisateur du gagnant (adversaire) |
| `loser`   | `string` | Nom d'utilisateur du joueur qui abandonne |

## Exemples de code

<Examples method="delete" path="/tic-tac-toe/VWXYZ" :body="{ username: 'alice', session: 'abc123' }" />

## Essayer

<Try method="delete" path="/tic-tac-toe/VWXYZ" :params="[{ name: 'username', required: true }, { name: 'session', required: true }]" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur      | Description                            |
| --------------------- | -------------------------------------- |
| `Session ID mismatch` | La session ne correspond pas au joueur |

## Endpoints associés

- <Method type="post" sm /> [/v5/tic-tac-toe](../tic-tac-toe) - Endpoint principal du jeu pour effectuer des coups
- <Method type="patch" sm /> [/v5/tic-tac-toe/:game](./play) - Jouer un coup
- <Method type="post" sm /> [/v5/tic-tac-toe/fetch](./fetch) - Récupérer les informations de la partie
- <Method type="post" sm /> [/v5/tic-tac-toe/list](./list) - Lister toutes les parties publiques
