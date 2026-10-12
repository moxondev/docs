# Tic-Tac-Toe Forfait

L'endpoint `/tic-tac-toe/forfeit` permet d'abandonner une partie (forfait).

<Endpoint method="post" path="/tic-tac-toe/forfeit" baseUrl="https://api.moxon.dev" />

::: warning Changement en 6.0.0
Cet endpoint passe de `DELETE` à `POST`, et son identifiant sort de l'URL : `game` est désormais envoyé dans le corps JSON. Les méthodes `PATCH` et `DELETE` n'existent plus nulle part dans l'API.
:::

## Paramètres

| Paramètre  | Requis | Description                               |
| ---------- | ------ | ----------------------------------------- |
| `game`     | Oui    | L'identifiant de la partie                |
| `username` | Oui    | Le nom d'utilisateur qui abandonne        |
| `session`  | Oui    | L'identifiant de session de l'utilisateur |

::: info À savoir
Tous les paramètres sont envoyés dans un body JSON avec `Content-Type: application/json`.
:::

## Champs de réponse

| Champ     | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `message` | `string` | Confirmation du forfait                   |
| `winner`  | `string` | Nom d'utilisateur du gagnant (adversaire) |
| `loser`   | `string` | Nom d'utilisateur du joueur qui abandonne |

## Exemples de code

<Examples method="post" path="/tic-tac-toe/forfeit" :body="{ game: 'VWXYZ', username: 'alice', session: 'abc123' }" />

## Essayer

<Try name="Tic-Tac-Toe Forfeit" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur      | Description                            |
| --------------------- | -------------------------------------- |
| `Session ID mismatch` | La session ne correspond pas au joueur |

## Endpoints associés

- <Method type="post" sm /> [/v6/tic-tac-toe](../tic-tac-toe) - Endpoint principal du jeu pour effectuer des coups
- <Method type="post" sm /> [/v6/tic-tac-toe/play](./play) - Jouer un coup
- <Method type="post" sm /> [/v6/tic-tac-toe/fetch](./fetch) - Récupérer les informations de la partie
- <Method type="post" sm /> [/v6/tic-tac-toe/list](./list) - Lister toutes les parties publiques
