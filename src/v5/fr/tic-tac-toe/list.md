# Liste des morpions

L'endpoint `/tic-tac-toe/list` permet de récupérer toutes les parties de morpion publiques actuellement en cours. Cet endpoint ne retourne pas les parties privées ni les parties terminées.

<Endpoint method="post" path="/tic-tac-toe/list" baseUrl="https://api.moxon.dev" />

::: info À savoir
La liste inclut uniquement les parties publiques actuellement en cours (pas terminées). Les parties sont triées par heure de création avec les plus récentes en premier. Les parties privées ne sont jamais incluses dans cette liste pour des raisons de confidentialité. Vous pouvez rejoindre n'importe quelle partie listée en utilisant son ID avec l'endpoint [/tic-tac-toe](../tic-tac-toe).
:::

## Paramètres

Cet endpoint ne nécessite aucun paramètre. Il retourne toutes les parties publiques actuellement actives.

## Exemples de code

<Examples method="post" path="/tic-tac-toe/list" />

## Champs de réponse

| Champ                  | Type       | Description                                         |
| ---------------------- | ---------- | --------------------------------------------------- |
| `message`              | `string`   | Message de confirmation                             |
| `count`                | `number`   | Nombre de parties publiques disponibles             |
| `games`                | `object[]` | Tableau d'objets de partie                          |
| `games[].id`           | `string`   | Identifiant unique de la partie                     |
| `games[].players`      | `string[]` | Tableau des noms d'utilisateur des joueurs          |
| `games[].playersCount` | `number`   | Nombre de joueurs actuellement dans la partie (0-2) |
| `games[].moves`        | `number`   | Nombre de coups joués dans la partie                |
| `games[].turn`         | `string`   | Nom d'utilisateur du joueur dont c'est le tour      |
| `games[].status`       | `string`   | Statut actuel de la partie (`waiting` ou `ready`)   |
| `games[].creation`     | `number`   | Horodatage de création de la partie                 |

## Valeurs de statut de partie

| Statut    | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `waiting` | La partie a moins de 2 joueurs et attend que d'autres joueurs la rejoignent |
| `ready`   | La partie a 2 joueurs et est prête à être jouée                             |

## Essayer

<Try name="Tic-Tac-Toe List" />

## Endpoints associés

- <Method type="post" sm /> [/v5/tic-tac-toe](../tic-tac-toe) - Endpoint principal du jeu pour effectuer des coups
- <Method type="post" sm /> [/v5/tic-tac-toe/fetch](./fetch) - Récupérer les détails d'une partie spécifique
