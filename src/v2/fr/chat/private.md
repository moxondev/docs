# Chats privés

L'endpoint `/chat/private` récupère tous les messages envoyés durant la dernière heure, faisant partie d'un chat privé.

<Endpoint method="post" path="/chat/private" />

## Paramètres

| Paramètre  | Requis | Description                                         |
| ---------- | ------ | --------------------------------------------------- |
| `username` | Oui    | Le nom d'utilisateur qui a envoyé le message        |
| `token`    | Oui    | La clé permettant la connexion au chat privé désiré |

## Exemple de requête

```bash
curl -X POST -d "username=Utilisateur3&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v2/chat/private"
```

## Réponse

```json
[
    {
        "username": "Utilisateur1",
        "message": "Salut !",
        "timestamp": "2025-01-21T08:27:11.068Z"
    },
    {
        "username": "Utilisateur3",
        "message": "Ça va ?",
        "timestamp": "2025-01-21T08:28:43.070Z"
    },
    {
        "username": "Utilisateur8",
        "message": "Ouais super et vous ?",
        "timestamp": "2025-01-21T08:32:07.215Z"
    }
]
```

## Gestion des erreurs

Si la valeur de `username` ou `token` est vide, que le token est invalide ou que le chat n'existe pas, une erreur sera renvoyée.
