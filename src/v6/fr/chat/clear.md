# Chat Effacer

L'endpoint `/chat/clear` efface tous les messages d'un chat privé.

<Endpoint method="post" path="/chat/clear" baseUrl="https://api.moxon.dev" />

::: warning Changement en 6.0.0
Cet endpoint passe de `DELETE` à `POST`, et son identifiant sort de l'URL : `token` est désormais envoyé dans le corps JSON. Les méthodes `PATCH` et `DELETE` n'existent plus nulle part dans l'API.
:::

## Paramètres

| Paramètre  | Requis | Description                               |
| ---------- | ------ | ----------------------------------------- |
| `token`    | Oui    | Le token du chat privé                    |
| `username` | Oui    | Le nom de l'utilisateur                   |
| `session`  | Oui    | L'identifiant de session de l'utilisateur |

::: info À savoir
Tous les paramètres sont envoyés dans un body JSON avec `Content-Type: application/json`.
:::

## Champs de réponse

| Champ     | Type     | Description             |
| --------- | -------- | ----------------------- |
| `message` | `string` | Message de confirmation |

## Exemples de code

<Examples method="post" path="/chat/clear" :body="{ token: '41a43360-9874-4c7a-9ca8-eec29e765a0e', username: 'alice', session: 'abc123' }" />

## Essayer

<Try name="Chat Clear" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur           | Description                                  |
| -------------------------- | -------------------------------------------- |
| `Invalid or expired token` | Le token est invalide ou a expiré            |
| `Session ID mismatch`      | La session ne correspond pas à l'utilisateur |
| `Rate limit exceeded`      | Limite de requêtes atteinte                  |

## Endpoints associés

- <Method type="post" sm /> [/v6/chat](../chat) - Envoyer un message
- <Method type="get" sm /> [/v6/chat](./messages) - Récupérer les messages récents
- <Method type="post" sm /> [/v6/chat/private](./private) - Créer et gérer des canaux de chat privés
