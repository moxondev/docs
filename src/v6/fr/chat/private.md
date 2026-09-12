# Chat Privé

L'endpoint `/chat/private` récupère tous les messages envoyés durant la dernière heure, appartenant à un chat privé.

<Endpoint method="post" path="/chat/private" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre  | Requis | Description                                         |
| ---------- | ------ | --------------------------------------------------- |
| `username` | Oui    | Le nom d'utilisateur qui a envoyé le message        |
| `token`    | Oui    | La clé permettant la connexion au chat privé désiré |

## Exemples de code

<Examples method="post" path="/chat/private" :body="{ username: 'Utilisateur3', token: '41a43360-9874-4c7a-9ca8-eec29e765a0e' }" />

## Champs de réponse

Retourne un tableau d'objets message.

| Champ       | Type     | Description                       |
| ----------- | -------- | --------------------------------- |
| `username`  | `string` | Nom d'utilisateur de l'expéditeur |
| `message`   | `string` | Contenu du message                |
| `timestamp` | `string` | Horodatage du message (ISO 8601)  |

## Essayer

<Try name="Chat Private" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                   | Description                                   |
| -------------------------------------------------- | --------------------------------------------- |
| `Please provide a username (?username={username})` | Le paramètre `username` est manquant          |
| `Please provide a valid token (&token={key}).`     | Le paramètre `token` est manquant ou invalide |
| `Invalid or expired token`                         | Le token est invalide ou expiré               |
| `Rate limit exceeded`                              | Limite de requêtes atteinte                   |

## Endpoints associés

- <Method type="post" sm /> [/v6/chat](../chat) - Envoyer un message
- <Method type="get" sm /> [/v6/chat](./messages) - Récupérer les messages récents
- <Method type="delete" sm /> [/v6/chat/:token](./clear) - Effacer les messages d'un chat privé
