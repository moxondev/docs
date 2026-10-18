import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "ip",
    kind: "endpoint",
    title: { en: "IP Analyzer", fr: "Analyse d'adresse IP" },
    lead: {
        en: "The `/ip` endpoint analyzes an IPv4 or IPv6 address and returns its type, class, binary representation, decimal value, and reverse DNS notation. If no address is provided, the client's own IP is analyzed.",
        fr: "L'endpoint `/ip` analyse une adresse IPv4 ou IPv6 et retourne son type, sa classe, sa représentation binaire, sa valeur décimale et sa notation DNS inversé. Si aucune adresse n'est fournie, l'IP du client est analysée.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/ip",
            try: true,
            params: [
                {
                    name: "address",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "8.8.8.8",
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
                                text: "Determine whether an IP is public or private, inspect the binary and decimal form of an address, generate the reverse DNS record for PTR lookups, or identify the address class for network planning.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Déterminez si une IP est publique ou privée, inspectez la forme binaire et décimale d'une adresse, générez l'enregistrement DNS inversé pour les lookups PTR, ou identifiez la classe d'adresse pour la planification réseau.",
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
                            name: "address",
                            required: false,
                            description: {
                                en: "IPv4 or IPv6 address to analyze. Defaults to the client's IP.",
                                fr: "Adresse IPv4 ou IPv6 à analyser. Utilise l'IP du client si omis.",
                            },
                        },
                    ],
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
                            name: "ip",
                            type: "`string`",
                            description: {
                                en: "The analyzed IP address",
                                fr: "L'adresse IP analysée",
                            },
                        },
                        {
                            name: "version",
                            type: '`"IPv4"` | `"IPv6"`',
                            description: {
                                en: "IP protocol version",
                                fr: "Version du protocole IP",
                            },
                        },
                        {
                            name: "type",
                            type: "`string`",
                            description: {
                                en: "Address type: `public`, `private`, `loopback`, `link-local`, `multicast`, or `broadcast`",
                                fr: "Type d'adresse : `public`, `private`, `loopback`, `link-local`, `multicast` ou `broadcast`",
                            },
                        },
                        {
                            name: "class",
                            type: "`string`",
                            description: {
                                en: "IPv4 address class only: `A`, `B`, `C`, `D`, or `E`",
                                fr: "Classe IPv4 uniquement : `A`, `B`, `C`, `D` ou `E`",
                            },
                        },
                        {
                            name: "range",
                            type: "`string`",
                            description: {
                                en: "CIDR range the address belongs to (IPv4 private/special ranges)",
                                fr: "Plage CIDR à laquelle appartient l'adresse (plages privées/spéciales IPv4)",
                            },
                        },
                        {
                            name: "binary",
                            type: "`string`",
                            description: {
                                en: "Binary representation of the address",
                                fr: "Représentation binaire de l'adresse",
                            },
                        },
                        {
                            name: "decimal",
                            type: "`number`",
                            description: {
                                en: "Decimal representation (IPv4 only)",
                                fr: "Représentation décimale (IPv4 uniquement)",
                            },
                        },
                        {
                            name: "reverse",
                            type: "`string`",
                            description: {
                                en: "Reverse DNS notation (`.in-addr.arpa` for IPv4, `.ip6.arpa` for IPv6)",
                                fr: "Notation DNS inversé (`.in-addr.arpa` pour IPv4, `.ip6.arpa` pour IPv6)",
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
        {
            id: "error-handling",
            level: 2,
            title: { en: "Error Handling", fr: "Gestion des erreurs" },
            aliases: ["gestion-des-erreurs"],
            blocks: [
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Invalid IP address.",
                            description: {
                                en: "The `address` parameter is not a valid IPv4 or IPv6 address",
                                fr: "Le paramètre `address` n'est pas une adresse IPv4 ou IPv6 valide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
