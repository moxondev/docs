# Chat en ligne

L'endpoint `/chat` fournit un système de messagerie en temps réel avec support pour les canaux publics et privés.

## GET /v3/chat

<Endpoint method="get" path="/chat" />

Récupère tous les messages envoyés durant la dernière heure. Cet endpoint ne nécessite aucune option.

### Exemple de requête

```
GET /v3/chat
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
        "message": "Comment ça va ?",
        "timestamp": "2025-01-21T08:28:43.070Z"
    },
    {
        "username": "Utilisateur8",
        "message": "Très bien, et toi ?",
        "timestamp": "2025-01-21T08:32:07.215Z"
    }
]
```

### cURL

```bash
curl -X GET "https://api.moxon.dev/v3/chat"
```

---

## POST /v3/chat

<Endpoint method="post" path="/chat" />

Permet d'envoyer un message au chat global ou à un chat privé.

### Paramètres

| Paramètre  | Requis | Description                                                                                              |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------- |
| `username` | Oui    | Le nom d'utilisateur de l'utilisateur qui envoie le message                                              |
| `message`  | Oui    | Le message à envoyer                                                                                     |
| `session`  | Oui    | L'identifiant de session de l'utilisateur                                                                |
| `token`    | Non    | La clé utilisée pour se connecter à un chat privé. Si non fournie, le message sera envoyé au chat global |

### Exemple de requête

```bash
curl -X POST -d "username=Utilisateur3&message=Comment ça va ?&session=abc123&token=41a43360-9874-4c7a-9ca8-eec29e765a0e" "https://api.moxon.dev/v3/chat"
```

### Réponse

```json
{
    "message": "Message sent successfully"
}
```

### Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                    | Description                                     |
| --------------------------------------------------- | ----------------------------------------------- |
| `Please provide a username (?username={username})`  | Le paramètre `username` est manquant            |
| `Please provide a message (&message={message})`     | Le paramètre `message` est manquant             |
| `Please provide a valid session ID (&session={ID})` | Le paramètre `session` est manquant ou invalide |

## Endpoints associés

- [/v3/chat/private](./chat/private) - Créer et gérer des canaux de chat privés
