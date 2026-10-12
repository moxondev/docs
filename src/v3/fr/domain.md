# Génération de nom de domaine

L'endpoint `/domain` génère diverses données aléatoires sur un domaine pour créer un profil complet. Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/domain" />

## Paramètres

Cet endpoint ne nécessite aucun paramètre.

## Exemple de requête

```
GET /v3/domain
```

## Réponse

```json
{
    "domain": "sylvain.sh",
    "full_domain": "api.moxon.dev",
    "ip_address": ["216.24.57.4", "216.24.57.252"],
    "ssl_certified": true,
    "hosting_provider": "Render",
    "dns_servers": ["dns1.registrar-servers.com", "dns2.registrar-servers.com"],
    "dns_provider": "Namecheap",
    "traffic": "1000 visits/day",
    "seo_score": 70,
    "page_rank": 2,
    "country": "France",
    "website_type": "Portfolio",
    "random_name": "sylvain",
    "random_subdomain": "api",
    "random_tld": "pro",
    "backlinks_count": 14,
    "creation_date": "2024-03-17T20:49:00.000Z",
    "expiration_date": "2026-03-17T20:49:00.000Z"
}
```

## Champs de réponse

| Champ              | Description                       |
| ------------------ | --------------------------------- |
| `domain`           | Nom de domaine principal          |
| `full_domain`      | Domaine complet avec sous-domaine |
| `ip_address`       | Tableau d'adresses IP             |
| `ssl_certified`    | Statut du certificat SSL          |
| `hosting_provider` | Nom du fournisseur d'hébergement  |
| `dns_servers`      | Tableau des serveurs DNS          |
| `dns_provider`     | Nom du fournisseur DNS            |
| `traffic`          | Trafic quotidien estimé           |
| `seo_score`        | Score SEO (0-100)                 |
| `page_rank`        | Valeur du PageRank                |
| `country`          | Pays d'origine                    |
| `website_type`     | Type de site web                  |
| `random_name`      | Nom de domaine généré             |
| `random_subdomain` | Sous-domaine généré               |
| `random_tld`       | Extension de domaine générée      |
| `backlinks_count`  | Nombre de backlinks               |
| `creation_date`    | Date de création du domaine       |
| `expiration_date`  | Date d'expiration du domaine      |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/domain"
```
