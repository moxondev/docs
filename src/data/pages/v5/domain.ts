import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "domain",
    kind: "endpoint",
    title: { en: "Domain Name Generation", fr: "Génération de nom de domaine" },
    lead: {
        en: "The `/domain` endpoint generates various random data about a domain to create a complete profile. This endpoint does not require any options.",
        fr: "L'endpoint `/domain` génère diverses données aléatoires sur un domaine pour créer un profil complet. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-05-25",
    operations: [{ id: "default", method: "get", path: "/domain", try: true, params: [] }],
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
                        en: "This endpoint does not require any parameters. It returns a randomly generated domain profile with IP, DNS, registrar and WHOIS data.",
                        fr: "Cet endpoint ne nécessite aucun paramètre. Il retourne un profil de domaine généré aléatoirement avec IP, DNS, registrar et données WHOIS.",
                    },
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
                    type: "fields",
                    rows: [
                        {
                            name: "domain",
                            type: "`string`",
                            description: { en: "Main domain name", fr: "Nom de domaine principal" },
                        },
                        {
                            name: "full_domain",
                            type: "`string`",
                            description: {
                                en: "Full domain with subdomain",
                                fr: "Domaine complet avec sous-domaine",
                            },
                        },
                        {
                            name: "ip_address",
                            type: "`string[]`",
                            description: {
                                en: "Array of IP addresses",
                                fr: "Tableau d'adresses IP",
                            },
                        },
                        {
                            name: "ssl_certified",
                            type: "`boolean`",
                            description: {
                                en: "SSL certificate status",
                                fr: "Statut du certificat SSL",
                            },
                        },
                        {
                            name: "hosting_provider",
                            type: "`string`",
                            description: {
                                en: "Hosting provider name",
                                fr: "Nom du fournisseur d'hébergement",
                            },
                        },
                        {
                            name: "dns_servers",
                            type: "`string[]`",
                            description: {
                                en: "DNS servers array",
                                fr: "Tableau des serveurs DNS",
                            },
                        },
                        {
                            name: "dns_provider",
                            type: "`string`",
                            description: { en: "DNS provider name", fr: "Nom du fournisseur DNS" },
                        },
                        {
                            name: "traffic",
                            type: "`string`",
                            description: {
                                en: "Estimated daily traffic",
                                fr: "Trafic quotidien estimé",
                            },
                        },
                        {
                            name: "seo_score",
                            type: "`number`",
                            description: { en: "SEO score (0-100)", fr: "Score SEO (0-100)" },
                        },
                        {
                            name: "page_rank",
                            type: "`number`",
                            description: { en: "Page rank value", fr: "Valeur du PageRank" },
                        },
                        {
                            name: "country",
                            type: "`string`",
                            description: { en: "Country of origin", fr: "Pays d'origine" },
                        },
                        {
                            name: "website_type",
                            type: "`string`",
                            description: { en: "Type of website", fr: "Type de site web" },
                        },
                        {
                            name: "random_name",
                            type: "`string`",
                            description: {
                                en: "Generated domain name",
                                fr: "Nom de domaine généré",
                            },
                        },
                        {
                            name: "random_subdomain",
                            type: "`string`",
                            description: { en: "Generated subdomain", fr: "Sous-domaine généré" },
                        },
                        {
                            name: "random_tld",
                            type: "`string`",
                            description: {
                                en: "Generated top-level domain",
                                fr: "Extension de domaine générée",
                            },
                        },
                        {
                            name: "backlinks_count",
                            type: "`number`",
                            description: { en: "Number of backlinks", fr: "Nombre de backlinks" },
                        },
                        {
                            name: "creation_date",
                            type: "`string`",
                            description: {
                                en: "Domain creation date",
                                fr: "Date de création du domaine",
                            },
                        },
                        {
                            name: "expiration_date",
                            type: "`string`",
                            description: {
                                en: "Domain expiration date",
                                fr: "Date d'expiration du domaine",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [
                { type: "examples", op: "default" },
                { type: "try", op: "default" },
            ],
        },
    ],
};
