# Chat Privé

L'endpoint `/chat/private` récupère tous les messages envoyés durant la dernière heure, appartenant à un chat privé.

<Endpoint method="post" path="/chat/private" />

## Paramètres

| Paramètre  | Requis | Description                                         |
| ---------- | ------ | --------------------------------------------------- |
| `username` | Oui    | Le nom d'utilisateur qui a envoyé le message        |
| `token`    | Oui    | La clé permettant la connexion au chat privé désiré |

## Exemple de requête

```bash
curl -X POST -d "username=Utilisateur3&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v3/chat/private"
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
        "message": "Comment ça va ?",
        "timestamp": "2025-01-21T08:28:43.070Z"
    }
]
```

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                   | Description                                   |
| -------------------------------------------------- | --------------------------------------------- |
| `Please provide a username (?username={username})` | Le paramètre `username` est manquant          |
| `Please provide a valid token (&token={key}).`     | Le paramètre `token` est manquant ou invalide |

## Endpoints associés

- [/v3/chat](../chat) - Endpoint principal du chat pour envoyer et recevoir des messages
