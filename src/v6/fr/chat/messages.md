# Chat Messages

L'endpoint `/chat` récupère tous les messages envoyés durant la dernière heure. Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/chat" baseUrl="https://api.moxon.dev" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre. Il retourne tous les messages de la dernière heure.

## Champs de réponse

| Champ       | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `username`  | `string` | Nom d'utilisateur de l'expéditeur |
| `message`   | `string` | Contenu du message                |
| `timestamp` | `string` | Horodatage du message (ISO 8601)  |

## Exemples de code

<Examples method="get" path="/chat" />

## Essayer

<Try name="Chat (GET)" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur     | Description                       |
| -------------------- | --------------------------------- |
| `No messages stored` | Aucun message stocké dans le chat |

## Endpoints associés

- <Method type="post" sm /> [/v6/chat](../chat) - Envoyer un message
- <Method type="post" sm /> [/v6/chat/private](./private) - Créer et gérer des canaux de chat privés
- <Method type="post" sm /> [/v6/chat/clear](./clear) - Effacer les messages d'un chat privé
