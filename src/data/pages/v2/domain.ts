import type { Page } from "@/types/content";

export const page: Page = {
    version: "v2",
    id: "domain",
    kind: "endpoint",
    title: { en: "Domain Name Generation", fr: "Génération de noms de domaine" },
    lead: {
        en: "The `/domain` endpoint generates various random data about a domain to create a complete profile. This endpoint does not require any options.",
        fr: "L'endpoint `/domain` génère plusieurs données aléatoires à propos d'un domaine afin de créer un profil complet. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-04-08",
    operations: [{ id: "default", method: "get", path: "/domain", try: false, params: [] }],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v2/domain", role: "request" }],
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
            id: "curl",
            level: 2,
            title: { en: "cURL", fr: "cURL" },
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X GET "https://api.moxon.dev/v2/domain"',
                    role: "curl",
                },
            ],
        },
    ],
};
