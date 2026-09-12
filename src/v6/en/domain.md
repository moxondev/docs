# Domain Name Generation

The `/domain` endpoint generates various random data about a domain to create a complete profile. This endpoint does not require any options.

<Endpoint method="get" path="/domain" baseUrl="https://api.sylvain.sh" />

## Parameters

This endpoint does not require any parameters. It returns a randomly generated domain profile with IP, DNS, registrar and WHOIS data.

## Response Fields

| Field              | Type       | Description                |
| ------------------ | ---------- | -------------------------- |
| `domain`           | `string`   | Main domain name           |
| `full_domain`      | `string`   | Full domain with subdomain |
| `ip_address`       | `string[]` | Array of IP addresses      |
| `ssl_certified`    | `boolean`  | SSL certificate status     |
| `hosting_provider` | `string`   | Hosting provider name      |
| `dns_servers`      | `string[]` | DNS servers array          |
| `dns_provider`     | `string`   | DNS provider name          |
| `traffic`          | `string`   | Estimated daily traffic    |
| `seo_score`        | `number`   | SEO score (0-100)          |
| `page_rank`        | `number`   | Page rank value            |
| `country`          | `string`   | Country of origin          |
| `website_type`     | `string`   | Type of website            |
| `random_name`      | `string`   | Generated domain name      |
| `random_subdomain` | `string`   | Generated subdomain        |
| `random_tld`       | `string`   | Generated top-level domain |
| `backlinks_count`  | `number`   | Number of backlinks        |
| `creation_date`    | `string`   | Domain creation date       |
| `expiration_date`  | `string`   | Domain expiration date     |

## Code Examples

<Examples method="get" path="/domain" />

## Try It

<Try name="Domain" />
