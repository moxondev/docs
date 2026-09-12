# Génération de nom de domaine

L'endpoint `/domain` génère diverses données aléatoires sur un domaine pour créer un profil complet. Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/domain" baseUrl="https://api.sylvain.sh" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre. Il retourne un profil de domaine généré aléatoirement avec IP, DNS, registrar et données WHOIS.

## Champs de réponse

| Champ              | Type       | Description                       |
| ------------------ | ---------- | --------------------------------- |
| `domain`           | `string`   | Nom de domaine principal          |
| `full_domain`      | `string`   | Domaine complet avec sous-domaine |
| `ip_address`       | `string[]` | Tableau d'adresses IP             |
| `ssl_certified`    | `boolean`  | Statut du certificat SSL          |
| `hosting_provider` | `string`   | Nom du fournisseur d'hébergement  |
| `dns_servers`      | `string[]` | Tableau des serveurs DNS          |
| `dns_provider`     | `string`   | Nom du fournisseur DNS            |
| `traffic`          | `string`   | Trafic quotidien estimé           |
| `seo_score`        | `number`   | Score SEO (0-100)                 |
| `page_rank`        | `number`   | Valeur du PageRank                |
| `country`          | `string`   | Pays d'origine                    |
| `website_type`     | `string`   | Type de site web                  |
| `random_name`      | `string`   | Nom de domaine généré             |
| `random_subdomain` | `string`   | Sous-domaine généré               |
| `random_tld`       | `string`   | Extension de domaine générée      |
| `backlinks_count`  | `number`   | Nombre de backlinks               |
| `creation_date`    | `string`   | Date de création du domaine       |
| `expiration_date`  | `string`   | Date d'expiration du domaine      |

## Exemples de code

<Examples method="get" path="/domain" />

## Essayer

<Try name="Domain" />
