import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "domain",
    kind: "endpoint",
    title: { en: "Domain Name Generation", fr: "Génération de nom de domaine" },
    lead: {
        en: "The `/domain` endpoint generates various random data about a domain to create a complete profile. This endpoint does not require any options.",
        fr: "L'endpoint `/domain` génère diverses données aléatoires sur un domaine pour créer un profil complet. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-04-08",
    operations: [{ id: "default", method: "get", path: "/domain", try: false, params: [] }],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Paramètres" },
            aliases: ["parametres"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "This endpoint does not require any parameters.",
                        fr: "Cet endpoint ne nécessite aucun paramètre.",
                    },
                },
            ],
        },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v3/domain", role: "request" }],
        },
        {
            id: "response",
            level: 2,
            title: { en: "Response", fr: "Réponse" },
            aliases: ["reponse"],
            blocks: [
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "domain": "sylvain.sh",\n    "full_domain": "api.moxon.dev",\n    "ip_address": ["216.24.57.4", "216.24.57.252"],\n    "ssl_certified": true,\n    "hosting_provider": "Render",\n    "dns_servers": ["dns1.registrar-servers.com", "dns2.registrar-servers.com"],\n    "dns_provider": "Namecheap",\n    "traffic": "1000 visits/day",\n    "seo_score": 70,\n    "page_rank": 2,\n    "country": "France",\n    "website_type": "Portfolio",\n    "random_name": "sylvain",\n    "random_subdomain": "api",\n    "random_tld": "pro",\n    "backlinks_count": 14,\n    "creation_date": "2024-03-17T20:49:00.000Z",\n    "expiration_date": "2026-03-17T20:49:00.000Z"\n}',
                    role: "response",
                },
            ],
        },
        {
            id: "response-fields",
            level: 2,
            title: { en: "Response Fields", fr: "Champs de réponse" },
            aliases: ["champs-de-reponse"],
            blocks: [
                {
                    type: "table",
                    head: { en: ["Field", "Description"], fr: ["Champ", "Description"] },
                    rows: [
                        ["`domain`", { en: "Main domain name", fr: "Nom de domaine principal" }],
                        [
                            "`full_domain`",
                            {
                                en: "Full domain with subdomain",
                                fr: "Domaine complet avec sous-domaine",
                            },
                        ],
                        [
                            "`ip_address`",
                            { en: "Array of IP addresses", fr: "Tableau d'adresses IP" },
                        ],
                        [
                            "`ssl_certified`",
                            { en: "SSL certificate status", fr: "Statut du certificat SSL" },
                        ],
                        [
                            "`hosting_provider`",
                            { en: "Hosting provider name", fr: "Nom du fournisseur d'hébergement" },
                        ],
                        [
                            "`dns_servers`",
                            { en: "DNS servers array", fr: "Tableau des serveurs DNS" },
                        ],
                        [
                            "`dns_provider`",
                            { en: "DNS provider name", fr: "Nom du fournisseur DNS" },
                        ],
                        [
                            "`traffic`",
                            { en: "Estimated daily traffic", fr: "Trafic quotidien estimé" },
                        ],
                        ["`seo_score`", { en: "SEO score (0-100)", fr: "Score SEO (0-100)" }],
                        ["`page_rank`", { en: "Page rank value", fr: "Valeur du PageRank" }],
                        ["`country`", { en: "Country of origin", fr: "Pays d'origine" }],
                        ["`website_type`", { en: "Type of website", fr: "Type de site web" }],
                        [
                            "`random_name`",
                            { en: "Generated domain name", fr: "Nom de domaine généré" },
                        ],
                        [
                            "`random_subdomain`",
                            { en: "Generated subdomain", fr: "Sous-domaine généré" },
                        ],
                        [
                            "`random_tld`",
                            {
                                en: "Generated top-level domain",
                                fr: "Extension de domaine générée",
                            },
                        ],
                        [
                            "`backlinks_count`",
                            { en: "Number of backlinks", fr: "Nombre de backlinks" },
                        ],
                        [
                            "`creation_date`",
                            { en: "Domain creation date", fr: "Date de création du domaine" },
                        ],
                        [
                            "`expiration_date`",
                            { en: "Domain expiration date", fr: "Date d'expiration du domaine" },
                        ],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "curl",
            level: 2,
            title: { en: "cURL", fr: "cURL" },
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X GET "https://api.moxon.dev/v3/domain"',
                    role: "curl",
                },
            ],
        },
    ],
};
