# Tic-Tac-Toe Jouer

L'endpoint `/tic-tac-toe/play` permet de jouer un coup dans une partie. Si l'identifiant `game` n'existe pas, la partie est créée.

<Endpoint method="post" path="/tic-tac-toe/play" baseUrl="https://api.moxon.dev" />

::: warning Changement en 6.0.0
Cet endpoint passe de `PATCH` à `POST`, et son identifiant sort de l'URL : `game` est désormais envoyé dans le corps JSON. Les méthodes `PATCH` et `DELETE` n'existent plus nulle part dans l'API.
:::

## Paramètres

| Paramètre  | Requis | Description                                                                                                                  |
| ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `game`     | Oui    | L'identifiant de la partie. Si la partie n'existe pas, elle est créée                                                        |
| `username` | Oui    | Le nom d'utilisateur effectuant le coup                                                                                      |
| `move`     | Oui    | Le coup joué au format `ligne-colonne` (ex. : `1-1`, `2-2`, `3-3`), voir [Format des coups](../tic-tac-toe#format-des-coups) |
| `session`  | Oui    | L'identifiant de session de l'utilisateur                                                                                    |

::: info À savoir
Tous les paramètres sont envoyés dans un body JSON avec `Content-Type: application/json`.
:::

## Champs de réponse

| Champ     | Type           | Description                                              |
| --------- | -------------- | -------------------------------------------------------- |
| `message` | `string`       | Message de statut du coup                                |
| `winner`  | `string\|null` | Nom d'utilisateur du gagnant (si la partie est terminée) |
| `loser`   | `string\|null` | Nom d'utilisateur du perdant (si la partie est terminée) |
| `tie`     | `boolean`      | Si la partie s'est terminée par une égalité              |

Tant que la partie continue, la réponse ne contient que `message` (`Move sent successfully`). Les champs `winner`, `loser` et `tie` ne sont présents que lorsque le coup termine la partie.

## Exemples de code

<Examples method="post" path="/tic-tac-toe/play" :body="{ game: 'VWXYZ', username: 'alice', move: '1-1', session: 'abc123' }" />

## Essayer

<Try name="Tic-Tac-Toe Play" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                                   | Description                            |
| ------------------------------------------------------------------ | -------------------------------------- |
| `Please provide a username (?username={username})`                 | Le paramètre `username` est manquant   |
| `Please provide a valid move (&move={move})`                       | Le paramètre `move` est manquant       |
| `Please provide a valid session ID (&session={ID})`                | Le paramètre `session` est manquant    |
| `Please provide a game ID (&game={ID})`                            | Le paramètre `game` est manquant       |
| `Rate limit exceeded. Try again in X seconds.`                     | Limite courte durée par utilisateur    |
| `Invalid move. Please provide a valid move (e.g., 1-1, 2-2, 3-3).` | Format de coup invalide                |
| `Game is full, you can only watch.`                                | La partie a déjà deux joueurs          |
| `Please wait for the other player to make a move.`                 | Ce n'est pas votre tour                |
| `Move already made. Please choose a different move.`               | Case déjà occupée                      |
| `Session ID mismatch`                                              | La session ne correspond pas au joueur |

## Endpoints associés

- [Morpion en ligne](../tic-tac-toe) - Déroulement d'une partie et migration depuis la v4 et la v5
- <Method type="post" sm /> [/v6/tic-tac-toe/forfeit](./forfeit) - Abandonner une partie
- <Method type="post" sm /> [/v6/tic-tac-toe/fetch](./fetch) - Récupérer les informations de la partie
- <Method type="post" sm /> [/v6/tic-tac-toe/list](./list) - Lister toutes les parties publiques
