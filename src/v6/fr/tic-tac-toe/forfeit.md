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

| Champ     | Type           | Description                                                                              |
| --------- | -------------- | ---------------------------------------------------------------------------------------- |
| `message` | `string`       | Confirmation du forfait                                                                  |
| `winner`  | `string\|null` | Nom d'utilisateur du gagnant (adversaire), `null` si le joueur était seul dans la partie |
| `loser`   | `string`       | Nom d'utilisateur du joueur qui abandonne                                                |

La partie est supprimée après un forfait.

## Exemples de code

<Examples method="post" path="/tic-tac-toe/forfeit" :body="{ game: 'VWXYZ', username: 'alice', session: 'abc123' }" />

## Essayer

<Try name="Tic-Tac-Toe Forfeit" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                    | Description                               |
| --------------------------------------------------- | ----------------------------------------- |
| `Please provide a username (?username={username})`  | Le paramètre `username` est manquant      |
| `Please provide a valid session ID (&session={ID})` | Le paramètre `session` est manquant       |
| `Please provide a game ID (&game={ID})`             | Le paramètre `game` est manquant          |
| `Game not found`                                    | La partie n'existe pas                    |
| `Session ID mismatch`                               | La session ne correspond pas au joueur    |
| `You are not a player in this game`                 | Le joueur ne participe pas à cette partie |

## Endpoints associés

- [Morpion en ligne](../tic-tac-toe) - Déroulement d'une partie et migration depuis la v4 et la v5
- <Method type="post" sm /> [/v6/tic-tac-toe/play](./play) - Jouer un coup
- <Method type="post" sm /> [/v6/tic-tac-toe/fetch](./fetch) - Récupérer les informations de la partie
- <Method type="post" sm /> [/v6/tic-tac-toe/list](./list) - Lister toutes les parties publiques
