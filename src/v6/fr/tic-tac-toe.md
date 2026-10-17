# Morpion en ligne

Les endpoints `/tic-tac-toe` permettent de jouer au morpion en ligne à deux joueurs. Les parties supportent les modes public et privé. Une partie en cours est supprimée après 1 heure sans coup, et une partie terminée 10 minutes après sa fin.

::: warning Changement en 6.0.0
`POST /tic-tac-toe` n'existe plus en v6 : il répond `404` (`Endpoint not available in v6.`). Chaque action a son propre endpoint, listé ci-dessous. Pour jouer un coup, utilisez [`POST /tic-tac-toe/play`](./tic-tac-toe/play) avec le même corps JSON (`username`, `move`, `session`, `game`).
:::

## Endpoints

- <Method type="post" sm /> [/v6/tic-tac-toe/fetch](./tic-tac-toe/fetch) - Créer une partie ou récupérer ses informations
- <Method type="post" sm /> [/v6/tic-tac-toe/list](./tic-tac-toe/list) - Lister toutes les parties publiques
- <Method type="post" sm /> [/v6/tic-tac-toe/play](./tic-tac-toe/play) - Jouer un coup
- <Method type="post" sm /> [/v6/tic-tac-toe/forfeit](./tic-tac-toe/forfeit) - Abandonner une partie

## Déroulement d'une partie

1. Créez une partie avec `/tic-tac-toe/fetch`, publique par défaut ou privée avec `private`. Vous pouvez aussi jouer directement avec `/tic-tac-toe/play` : si l'identifiant `game` n'existe pas, la partie est créée.
2. Un second joueur rejoint la partie avec son identifiant, via `/tic-tac-toe/fetch` ou `/tic-tac-toe/play`. Les parties publiques sont listées par `/tic-tac-toe/list`. Une partie accepte deux joueurs au maximum.
3. Les joueurs jouent chacun leur tour avec `/tic-tac-toe/play`.
4. La partie prend fin lorsqu'un joueur gagne, que la grille est pleine (égalité) ou qu'un joueur abandonne avec `/tic-tac-toe/forfeit`.

## Format des coups

Le plateau est une grille 3x3 avec des positions numérotées comme suit :

```
1-1 | 1-2 | 1-3
----|-----|----
2-1 | 2-2 | 2-3
----|-----|----
3-1 | 3-2 | 3-3
```

## Depuis la v4 et la v5

| Action                                    | Version 4 et 5              | Version 6                   |
| ----------------------------------------- | --------------------------- | --------------------------- |
| Jouer un coup (`game` dans le corps)      | `POST /tic-tac-toe`         | `POST /tic-tac-toe/play`    |
| Jouer un coup (`game` dans l'URL)         | `PATCH /tic-tac-toe/:game`  | `POST /tic-tac-toe/play`    |
| Abandonner une partie (`game` dans l'URL) | `DELETE /tic-tac-toe/:game` | `POST /tic-tac-toe/forfeit` |

Pour `POST /tic-tac-toe`, seul le chemin change : le corps de la requête reste le même. Pour `PATCH` et `DELETE`, l'identifiant `game` passe de l'URL au corps JSON.
