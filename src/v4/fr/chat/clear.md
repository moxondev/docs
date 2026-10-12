# Chat Effacer

L'endpoint `/chat/:token` efface tous les messages d'un chat privé.

<Endpoint method="delete" path="/chat/:token" baseUrl="https://api.moxon.dev" />

## Paramètres

| Paramètre  | Requis | Description                               |
| ---------- | ------ | ----------------------------------------- |
| `token`    | Oui    | Le token du chat privé (paramètre d'URL)  |
| `username` | Oui    | Le nom de l'utilisateur                   |
| `session`  | Oui    | L'identifiant de session de l'utilisateur |

::: info À savoir
Le paramètre `token` fait partie du chemin de l'URL. Les autres paramètres sont envoyés dans un body JSON avec `Content-Type: application/json`.
:::

## Champs de réponse

| Champ     | Type     | Description             |
| --------- | -------- | ----------------------- |
| `message` | `string` | Message de confirmation |

## Exemples de code

<Examples method="delete" path="/chat/41a43360-9874-4c7a-9ca8-eec29e765a0e" :body="{ username: 'alice', session: 'abc123' }" />

## Essayer

<Try method="delete" path="/chat/41a43360-9874-4c7a-9ca8-eec29e765a0e" :params="[{ name: 'username', required: true }, { name: 'session', required: true }]" />

## Gestion des erreurs

Si les paramètres sont manquants ou invalides, l'API retournera une erreur :

| Message d'erreur           | Description                                  |
| -------------------------- | -------------------------------------------- |
| `Invalid or expired token` | Le token est invalide ou a expiré            |
| `Session ID mismatch`      | La session ne correspond pas à l'utilisateur |
| `Rate limit exceeded`      | Limite de requêtes atteinte                  |

## Endpoints associés

- <Method type="post" sm /> [/v4/chat](../chat) - Envoyer un message
- <Method type="get" sm /> [/v4/chat](./messages) - Récupérer les messages récents
- <Method type="post" sm /> [/v4/chat/private](./private) - Créer et gérer des canaux de chat privés
