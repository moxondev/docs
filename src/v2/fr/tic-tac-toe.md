# Morpion en ligne

L'endpoint `/tic-tac-toe` permet de jouer et de stocker une partie de morpion en ligne. Les parties sont stockées 1 heure et sont accessibles via un identifiant unique.

<Endpoint method="post" path="/tic-tac-toe" />

## Paramètres

| Paramètre  | Requis | Description                                                                                    |
| ---------- | ------ | ---------------------------------------------------------------------------------------------- |
| `username` | Oui    | Le nom d'utilisateur effectuant le mouvement                                                   |
| `move`     | Oui    | Le coup joué au format `ligne-colonne` (ex. : `1-1`, `2-2`, `3-3`)                             |
| `session`  | Oui    | L'identifiant de session de l'utilisateur                                                      |
| `game`     | Oui    | L'identifiant de la partie permettant la connexion. Si la partie n'existe pas, elle sera créée |

## Exemple de requête

```bash
curl -X POST -d "username=Utilisateur1&move=2-2&session=abc123&game=VWXYZ" "https://api.moxon.dev/v2/tic-tac-toe"
```

## Réponse

```json
{
    "message": "Move sent successfully"
}
```

## Gestion des erreurs

Si une valeur de `username`, `move`, `session` ou `game` est vide ou invalide, que la partie est pleine, que le même joueur joue deux fois de suite ou si le coup est déjà joué, une erreur sera renvoyée.

Lorsqu'une partie est terminée, la requête renverra le nom du gagnant et du perdant, ainsi que s'il y a égalité. L'endpoint [/tic-tac-toe/fetch](/v2/fr/tic-tac-toe/fetch) permet de récupérer plus d'informations sur la partie en cours.
