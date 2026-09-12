# Analyse d'adresse IP

L'endpoint `/ip` analyse une adresse IPv4 ou IPv6 et retourne son type, sa classe, sa représentation binaire, sa valeur décimale et sa notation DNS inversé. Si aucune adresse n'est fournie, l'IP du client est analysée.

<Endpoint method="get" path="/ip" baseUrl="https://api.sylvain.sh" />

::: tip Cas d'utilisation
Déterminez si une IP est publique ou privée, inspectez la forme binaire et décimale d'une adresse, générez l'enregistrement DNS inversé pour les lookups PTR, ou identifiez la classe d'adresse pour la planification réseau.
:::

## Paramètres

| Paramètre | Requis | Description                                                      |
| --------- | ------ | ---------------------------------------------------------------- |
| `address` | Non    | Adresse IPv4 ou IPv6 à analyser. Utilise l'IP du client si omis. |

## Champs de réponse

| Champ     | Type                 | Description                                                                                |
| --------- | -------------------- | ------------------------------------------------------------------------------------------ |
| `ip`      | `string`             | L'adresse IP analysée                                                                      |
| `version` | `"IPv4"` \| `"IPv6"` | Version du protocole IP                                                                    |
| `type`    | `string`             | Type d'adresse : `public`, `private`, `loopback`, `link-local`, `multicast` ou `broadcast` |
| `class`   | `string`             | Classe IPv4 uniquement : `A`, `B`, `C`, `D` ou `E`                                         |
| `range`   | `string`             | Plage CIDR à laquelle appartient l'adresse (plages privées/spéciales IPv4)                 |
| `binary`  | `string`             | Représentation binaire de l'adresse                                                        |
| `decimal` | `number`             | Représentation décimale (IPv4 uniquement)                                                  |
| `reverse` | `string`             | Notation DNS inversé (`.in-addr.arpa` pour IPv4, `.ip6.arpa` pour IPv6)                    |

## Exemples de code

<Examples method="get" path="/ip" />

## Essayer

<Try name="IP" />

## Gestion des erreurs

| Message d'erreur      | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `Invalid IP address.` | Le paramètre `address` n'est pas une adresse IPv4 ou IPv6 valide |
