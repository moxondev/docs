# Chat en ligne

L'endpoint `/chat` permet de récupérer et d'envoyer des messages dans un chat global ou privé.

## Récupérer les messages

<Endpoint method="get" path="/chat" />

L'endpoint `/chat` récupère tous les messages envoyés durant la dernière heure. Cet endpoint ne nécessite aucune option.

### Exemple de requête

```
GET /v2/chat
```

### Réponse

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

### cURL

```bash
curl -X GET "https://api.moxon.dev/v2/chat"
```

---

## Envoyer un message

<Endpoint method="post" path="/chat" />

L'endpoint `/chat` permet l'envoi d'un message vers le chat global ou un chat privé.

### Paramètres

| Paramètre  | Requis | Description                                                                                                           |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------- |
| `username` | Oui    | Le nom d'utilisateur qui a envoyé le message                                                                          |
| `message`  | Oui    | Le message à envoyer                                                                                                  |
| `session`  | Oui    | L'identifiant de session de l'utilisateur                                                                             |
| `token`    | Non    | La clé permettant la connexion à un chat privé. Si elle n'est pas fournie, le message sera envoyé dans le chat global |

### Exemple de requête

```bash
curl -X POST -d "username=Utilisateur3&message=Ça va ?&session=abc123&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v2/chat"
```

### Réponse

```json
{
    "message": "Message sent successfully"
}
```

### Gestion des erreurs

Si la valeur de `username`, `message` ou `session` est vide, une erreur sera renvoyée.
