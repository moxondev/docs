# Domain Name Generation

The `/domain` endpoint generates various random data about a domain to create a complete profile. This endpoint does not require any options.

<Endpoint method="get" path="/domain" />

## Parameters

This endpoint does not require any parameters.

## Request Example

```
GET /v3/domain
```

## Response

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

## Response Fields

| Field              | Description                |
| ------------------ | -------------------------- |
| `domain`           | Main domain name           |
| `full_domain`      | Full domain with subdomain |
| `ip_address`       | Array of IP addresses      |
| `ssl_certified`    | SSL certificate status     |
| `hosting_provider` | Hosting provider name      |
| `dns_servers`      | DNS servers array          |
| `dns_provider`     | DNS provider name          |
| `traffic`          | Estimated daily traffic    |
| `seo_score`        | SEO score (0-100)          |
| `page_rank`        | Page rank value            |
| `country`          | Country of origin          |
| `website_type`     | Type of website            |
| `random_name`      | Generated domain name      |
| `random_subdomain` | Generated subdomain        |
| `random_tld`       | Generated top-level domain |
| `backlinks_count`  | Number of backlinks        |
| `creation_date`    | Domain creation date       |
| `expiration_date`  | Domain expiration date     |

## cURL

```bash
curl -X GET "https://api.moxon.dev/v3/domain"
```
