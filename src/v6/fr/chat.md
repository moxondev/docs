# Chat en ligne

L'endpoint `/chat` fournit un système de messagerie en temps réel avec support pour les canaux publics et privés. Les messages sont stockés pendant 1 heure.

<Endpoint method="post" path="/chat" baseUrl="https://api.sylvain.sh" />

## Paramètres

| Paramètre  | Requis | Description                                                                                                  |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| `username` | Oui    | Le nom d'utilisateur de l'expéditeur                                                                         |
| `message`  | Oui    | Le message à envoyer                                                                                         |
| `session`  | Oui    | L'identifiant de session de l'utilisateur                                                                    |
| `token`    | Non    | La clé utilisée pour se connecter à un chat privé. Si non fourni, le message sera envoyé dans le chat global |

## Exemples de code

<Examples method="post" path="/chat" :body="{ username: 'Utilisateur3', message: 'Comment ça va ?', session: 'abc123' }" />

## Champs de réponse

| Champ     | Type     | Description             |
| --------- | -------- | ----------------------- |
| `message` | `string` | Message de confirmation |

## Réponses d'erreur

| Erreur                                                | Description                                  |
| ----------------------------------------------------- | -------------------------------------------- |
| `Global rate limit exceeded.`                         | Limite globale de l'API atteinte             |
| `You have exceeded the limit of X requests per hour.` | Limite horaire IP/token atteinte             |
| `Rate limit exceeded. Try again in X seconds.`        | Limite courte durée par utilisateur          |
| `Session ID mismatch`                                 | La session ne correspond pas à l'utilisateur |

## Essayer

<Try name="Chat (POST)" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur                                    | Description                                     |
| --------------------------------------------------- | ----------------------------------------------- |
| `Please provide a username (?username={username})`  | Le paramètre `username` est manquant            |
| `Please provide a message (&message={message})`     | Le paramètre `message` est manquant             |
| `Please provide a valid session ID (&session={ID})` | Le paramètre `session` est manquant ou invalide |

## Endpoints associés

- <Method type="get" sm /> [/v6/chat](./chat/messages) - Récupérer les messages récents
- <Method type="post" sm /> [/v6/chat/private](./chat/private) - Créer et gérer des canaux de chat privés
- <Method type="post" sm /> [/v6/chat/clear](./chat/clear) - Effacer les messages d'un chat privé
