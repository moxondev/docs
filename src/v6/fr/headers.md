# Inspection des en-têtes

L'endpoint `/headers` retourne les en-têtes HTTP envoyés par le client. Il est utile pour déboguer les proxies, les configurations CORS et les pipelines de requêtes. Les en-têtes sensibles sont automatiquement masqués.

<Endpoint method="get" path="/headers" baseUrl="https://api.sylvain.sh" />

::: tip Cas d'utilisation
Inspectez les en-têtes envoyés par votre client au serveur, déboguez les configurations de reverse proxy, vérifiez les en-têtes CORS, ou contrôlez si les en-têtes d'authentification sont bien transmis.
:::

## Paramètres

| Paramètre | Requis | Description                                                                            |
| --------- | ------ | -------------------------------------------------------------------------------------- |
| `filter`  | Non    | Liste de noms d'en-têtes séparés par des virgules. Retourne tous les en-têtes si omis. |

## En-têtes masqués

Les en-têtes suivants sont toujours retournés sous la valeur `[redacted]` pour éviter l'exposition de données sensibles :

| En-tête               |
| --------------------- |
| `authorization`       |
| `cookie`              |
| `set-cookie`          |
| `proxy-authorization` |

## Champs de réponse

| Champ     | Type     | Description                                                   |
| --------- | -------- | ------------------------------------------------------------- |
| `count`   | `number` | Nombre d'en-têtes retournés                                   |
| `headers` | `object` | Map clé-valeur des en-têtes de la requête (sensibles masqués) |
| `ip`      | `string` | Adresse IP du client                                          |
| `method`  | `string` | Méthode HTTP de la requête                                    |
| `url`     | `string` | URL complète de la requête                                    |

## Exemples de code

<Examples method="get" path="/headers" />

## Essayer

<Try name="Headers" />

::: info Note
Cet endpoint ne retourne pas d'erreur pour les noms de filtre invalides — les noms inconnus ne retournent simplement aucun en-tête correspondant.
:::
