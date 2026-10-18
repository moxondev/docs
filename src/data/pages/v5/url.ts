import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "url",
    kind: "endpoint",
    title: { en: "URL Parsing", fr: "Analyse d'URL" },
    lead: {
        en: "The `/url` endpoint parses a URL into its structural components: scheme, host, port, path, query parameters, and fragment. Duplicate query parameters are grouped into an array.",
        fr: "L'endpoint `/url` décompose une URL en ses composants structurels : schéma, hôte, port, chemin, paramètres de requête et fragment. Les paramètres de requête dupliqués sont regroupés dans un tableau.",
    },
    updated: "2026-09-07",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/url",
            try: true,
            params: [
                {
                    name: "url",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "https://example.com/path?a=1",
                },
            ],
        },
    ],
    sections: [
        { id: "", blocks: [{ type: "endpoint", op: "default" }] },
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
                            name: "url",
                            required: true,
                            description: {
                                en: "Absolute URL to parse, including its scheme (e.g. `https://example.com/path?a=1`)",
                                fr: "URL absolue à analyser, incluant son schéma (ex. `https://example.com/path?a=1`)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "default-ports",
            level: 2,
            title: { en: "Default Ports", fr: "Ports par défaut" },
            aliases: ["ports-par-defaut"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "When the URL omits the port, the scheme's default port is returned:",
                        fr: "Lorsque l'URL omet le port, le port par défaut du schéma est retourné :",
                    },
                },
                {
                    type: "table",
                    head: { en: ["Scheme", "Port"], fr: ["Schéma", "Port"] },
                    rows: [
                        ["`ftp`", "21"],
                        ["`http`", "80"],
                        ["`https`", "443"],
                        ["`ws`", "80"],
                        ["`wss`", "443"],
                    ],
                    kind: "definition",
                },
                {
                    type: "p",
                    text: {
                        en: "Any other scheme returns `null`.",
                        fr: "Tout autre schéma retourne `null`.",
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
                            name: "url",
                            type: "`string`",
                            description: {
                                en: "The original input URL",
                                fr: "L'URL d'entrée originale",
                            },
                        },
                        {
                            name: "scheme",
                            type: "`string`",
                            description: {
                                en: "URL scheme without the trailing colon (e.g. `https`)",
                                fr: "Schéma de l'URL sans le `:` final (ex. `https`)",
                            },
                        },
                        {
                            name: "host",
                            type: "`string`",
                            description: { en: "Hostname", fr: "Nom d'hôte" },
                        },
                        {
                            name: "port",
                            type: "`number|null`",
                            description: {
                                en: "Port number — the scheme's default port when the URL omits it, `null` if the scheme has no known default",
                                fr: "Numéro de port — le port par défaut du schéma si l'URL ne le précise pas, `null` si le schéma n'a pas de port par défaut connu",
                            },
                        },
                        {
                            name: "path",
                            type: "`string`",
                            description: { en: "Path component", fr: "Composant chemin" },
                        },
                        {
                            name: "params",
                            type: "`object`",
                            description: {
                                en: "Query parameters — duplicate keys are grouped into an array",
                                fr: "Paramètres de requête — les clés dupliquées sont regroupées en tableau",
                            },
                        },
                        {
                            name: "fragment",
                            type: "`string`",
                            description: {
                                en: "Fragment identifier without the leading `#`",
                                fr: "Identifiant de fragment sans le `#` initial",
                            },
                        },
                        {
                            name: "valid",
                            type: "`boolean`",
                            description: {
                                en: "Always `true` for a successfully parsed URL",
                                fr: "Toujours `true` pour une URL analysée avec succès",
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
                {
                    type: "examples",
                    op: "default",
                    query: { url: "https://example.com/path?tag=js&tag=ts#section" },
                },
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
                    type: "p",
                    text: {
                        en: "If parameters are missing or invalid, the API will return an error:",
                        fr: "Si les paramètres sont manquants ou invalides, l'API retournera une erreur :",
                    },
                },
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Please provide a URL (?url={URL})",
                            description: {
                                en: "The `url` parameter is missing",
                                fr: "Le paramètre `url` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "URL cannot exceed 2048 characters",
                            description: {
                                en: "The `url` exceeds the maximum length",
                                fr: "L'`url` dépasse la longueur maximale",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid URL",
                            description: {
                                en: "The `url` value cannot be parsed as a URL",
                                fr: "La valeur `url` ne peut pas être analysée comme une URL",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
