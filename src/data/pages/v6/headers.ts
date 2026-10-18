import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "headers",
    kind: "endpoint",
    title: { en: "Headers Inspector", fr: "Inspection des en-têtes" },
    lead: {
        en: "The `/headers` endpoint returns the HTTP headers sent by the client. It is useful for debugging proxies, CORS configurations, and request pipelines. Sensitive headers are automatically redacted.",
        fr: "L'endpoint `/headers` retourne les en-têtes HTTP envoyés par le client. Il est utile pour déboguer les proxies, les configurations CORS et les pipelines de requêtes. Les en-têtes sensibles sont automatiquement masqués.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/headers",
            try: true,
            params: [
                {
                    name: "filter",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "host,user-agent",
                },
            ],
        },
    ],
    sections: [
        {
            id: "",
            blocks: [
                { type: "endpoint", op: "default" },
                {
                    type: "callout",
                    kind: "tip",
                    title: { en: "Use Cases", fr: "Cas d'utilisation" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Inspect what headers your client sends to the server, debug reverse proxy configurations, verify CORS headers, or check if authentication headers are being forwarded correctly.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Inspectez les en-têtes envoyés par votre client au serveur, déboguez les configurations de reverse proxy, vérifiez les en-têtes CORS, ou contrôlez si les en-têtes d'authentification sont bien transmis.",
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: "parameters",
            level: 2,
            title: { en: "Parameters", fr: "Paramètres" },
            aliases: ["parametres"],
            blocks: [
                {
                    type: "params",
                    rows: [
                        {
                            name: "filter",
                            required: false,
                            description: {
                                en: "Comma-separated list of header names to return. Returns all headers if omitted.",
                                fr: "Liste de noms d'en-têtes séparés par des virgules. Retourne tous les en-têtes si omis.",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "redacted-headers",
            level: 2,
            title: { en: "Redacted Headers", fr: "En-têtes masqués" },
            aliases: ["en-tetes-masques"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The following headers are always returned as `[redacted]` to prevent sensitive data exposure:",
                        fr: "Les en-têtes suivants sont toujours retournés sous la valeur `[redacted]` pour éviter l'exposition de données sensibles :",
                    },
                },
                {
                    type: "table",
                    head: { en: ["Header"], fr: ["En-tête"] },
                    rows: [
                        ["`authorization`"],
                        ["`cookie`"],
                        ["`set-cookie`"],
                        ["`proxy-authorization`"],
                    ],
                    kind: "list",
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
                            name: "count",
                            type: "`number`",
                            description: {
                                en: "Number of headers returned",
                                fr: "Nombre d'en-têtes retournés",
                            },
                        },
                        {
                            name: "headers",
                            type: "`object`",
                            description: {
                                en: "Key-value map of request headers (sensitive ones redacted)",
                                fr: "Map clé-valeur des en-têtes de la requête (sensibles masqués)",
                            },
                        },
                        {
                            name: "ip",
                            type: "`string`",
                            description: { en: "Client IP address", fr: "Adresse IP du client" },
                        },
                        {
                            name: "method",
                            type: "`string`",
                            description: {
                                en: "HTTP method of the request",
                                fr: "Méthode HTTP de la requête",
                            },
                        },
                        {
                            name: "url",
                            type: "`string`",
                            description: {
                                en: "Full request URL",
                                fr: "URL complète de la requête",
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
                {
                    type: "callout",
                    kind: "info",
                    title: "Note",
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "This endpoint does not throw errors for invalid filter names — unknown names simply return no matching headers.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Cet endpoint ne retourne pas d'erreur pour les noms de filtre invalides — les noms inconnus ne retournent simplement aucun en-tête correspondant.",
                            },
                        ],
                    },
                },
            ],
        },
    ],
};
