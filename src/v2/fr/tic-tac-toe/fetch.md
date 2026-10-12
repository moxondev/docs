# Récupération du morpion

L'endpoint `/tic-tac-toe/fetch` permet d'afficher une partie de morpion en cours. Vous pouvez utiliser l'identifiant de la partie en cours pour l'afficher.

<Endpoint method="post" path="/tic-tac-toe/fetch" />

## Paramètres

| Paramètre  | Requis | Description                                                                                               |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------- |
| `username` | Oui    | Le nom d'utilisateur effectuant la requête                                                                |
| `game`     | Non    | L'identifiant de la partie à afficher. S'il n'est pas fourni, un nouvel identifiant de partie sera généré |

## Exemple de requête

```bash
curl -X POST -d "username=Utilisateur1&game=VWXYZ" "https://api.moxon.dev/v2/tic-tac-toe/fetch"
```

## Réponse

```json
{
    "id": "VWXYZ",
    "moves": [
        {
            "username": "Utilisateur1",
            "move": "2-2",
            "session": "abc123"
        },
        {
            "username": "Utilisateur2",
            "move": "1-3",
            "session": "def456"
        },
        {
            "username": "Utilisateur1",
            "move": "1-2",
            "session": "abc123"
        },
        {
            "username": "Utilisateur2",
            "move": "2-3",
            "session": "def456"
        }
    ],
    "players": ["utilisateur1", "utilisateur2"],
    "turn": "utilisateur1",
    "status": "ready",
    "winner": null,
    "loser": null,
    "tie": false
}
```

## Gestion des erreurs

Si une valeur de `username` est vide, une erreur sera renvoyée. Lorsque la partie est créée, un identifiant de session est généré et renvoyé dans la réponse. Vous pouvez utiliser cet identifiant pour effectuer des mouvements dans la partie. Si la partie est terminée, le gagnant et le perdant sont renvoyés dans la réponse.
