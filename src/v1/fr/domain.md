# Génération de noms de domaine

L'endpoint `/domain` génère plusieurs données aléatoires à propos d'un domaine afin de créer un profil complet. Cet endpoint ne nécessite aucune option.

<Endpoint method="get" path="/domain" />

## Exemple de requête

```
GET /v1/domain
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

## cURL

```bash
curl -X GET "https://api.moxon.dev/v1/domain"
```
