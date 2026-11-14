import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "hyperplanning",
    kind: "endpoint",
    title: { en: "Hyperplanning", fr: "Hyperplanning" },
    lead: {
        en: "The `/hyperplanning` endpoint allows you to display a Hyperplanning schedule information in JSON format from an ICS (calendar) file.",
        fr: "L'endpoint `/hyperplanning` permet d'afficher les informations d'un emploi du temps Hyperplanning au format JSON à partir d'un fichier ICS (calendrier).",
    },
    updated: "2026-11-14",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/hyperplanning",
            try: true,
            params: [
                {
                    name: "url",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "https://example.com/planning.ics",
                },
                {
                    name: "detail",
                    type: "enum",
                    in: "body",
                    required: false,
                    options: ["full", "list"],
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
                                en: "The HTTPS URL of the ICS file to use and display (1MB and 5000 events at most). Must be URL-encoded before being sent",
                                fr: "L'URL HTTPS du fichier ICS à utiliser et afficher (1 Mo et 5000 événements au maximum). Doit être encodée en URL avant l'envoi",
                            },
                        },
                        {
                            name: "detail",
                            required: false,
                            description: {
                                en: "Level of detail for events (`full` or `list`)",
                                fr: "Niveau de détail pour les événements (`full` ou `list`)",
                            },
                        },
                    ],
                },
                {
                    type: "callout",
                    kind: "info",
                    title: {
                        en: "Limits on the calendar download",
                        fr: "Limites du téléchargement du calendrier",
                    },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Since 6.2.0, the ICS file is downloaded through a protected fetch. A request with a regular calendar gets exactly the same response as before; only abusive inputs are refused with the usual `400` error:",
                            },
                            {
                                type: "list",
                                items: [
                                    "The `url`, and every redirect it goes through, must use HTTPS and point to a public host: private, loopback and other internal addresses are refused.",
                                    "At most 10 redirects are followed.",
                                    "The whole download, redirects included, must finish within 10 seconds.",
                                    "The file must not exceed 1MB once decompressed.",
                                    "The file must hold at most 5000 events, past events included.",
                                ],
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Depuis la 6.2.0, le fichier ICS est téléchargé par une récupération protégée. Une requête avec un calendrier ordinaire reçoit exactement la même réponse qu'avant ; seules les entrées abusives sont refusées avec l'erreur `400` habituelle :",
                            },
                            {
                                type: "list",
                                items: [
                                    "L'`url`, et chaque redirection qu'elle traverse, doit utiliser HTTPS et pointer vers un hôte public : les adresses privées, de bouclage et autres adresses internes sont refusées.",
                                    "Au plus 10 redirections sont suivies.",
                                    "Le téléchargement entier, redirections comprises, doit se terminer en 10 secondes.",
                                    "Le fichier ne doit pas dépasser 1 Mo une fois décompressé.",
                                    "Le fichier doit contenir au plus 5000 événements, événements passés compris.",
                                ],
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: "detail-options",
            level: 2,
            title: { en: "Detail Options", fr: "Options de détail" },
            aliases: ["options-de-detail"],
            blocks: [
                {
                    type: "table",
                    head: ["Option", "Description"],
                    rows: [
                        [
                            "`full`",
                            {
                                en: "Displays a complete summary with subject, teacher, classes, date, etc.",
                                fr: "Affiche un résumé complet avec matière, enseignant, classes, date, etc.",
                            },
                        ],
                        [
                            "`list`",
                            {
                                en: "Displays all data in a list",
                                fr: "Affiche toutes les données sous forme de liste",
                            },
                        ],
                    ],
                    kind: "definition",
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
                    body: { url: "https%3A%2F%2Fexample.com%2Ffile.ics", detail: "full" },
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
                    type: "p",
                    text: {
                        en: "The response format depends on the `detail` parameter:",
                        fr: "Les champs retournés dépendent de l'option `detail` choisie.",
                    },
                },
            ],
        },
        {
            id: "detail-full",
            level: 3,
            title: { en: "`detail=full`", fr: "Mode `full`" },
            aliases: ["mode-full"],
            blocks: [
                {
                    type: "split",
                    en: [
                        {
                            type: "fields",
                            rows: [
                                {
                                    name: "summary",
                                    type: "`string[]`",
                                    description: "Array of summary elements",
                                },
                                { name: "subject", type: "`string`", description: "Subject name" },
                                { name: "teacher", type: "`string`", description: "Teacher name" },
                                {
                                    name: "classes",
                                    type: "`string[]`",
                                    description: "Array of class names",
                                },
                                { name: "type", type: "`string`", description: "Event type" },
                                {
                                    name: "start",
                                    type: "`string`",
                                    description: "Event start time (ISO 8601)",
                                },
                                {
                                    name: "end",
                                    type: "`string`",
                                    description: "Event end time (ISO 8601)",
                                },
                            ],
                        },
                    ],
                    fr: [
                        {
                            type: "fields",
                            rows: [
                                {
                                    name: "summary",
                                    type: "`string[]`",
                                    description: "Tableau des éléments du résumé",
                                },
                                {
                                    name: "subject",
                                    type: "`string`",
                                    description: "Nom de la matière",
                                },
                                {
                                    name: "teacher",
                                    type: "`string`",
                                    description: "Nom de l'enseignant",
                                },
                                {
                                    name: "classes",
                                    type: "`string[]`",
                                    description: "Tableau des noms de classes",
                                },
                                {
                                    name: "start",
                                    type: "`string`",
                                    description: "Heure de début de l'événement (ISO 8601)",
                                },
                                {
                                    name: "end",
                                    type: "`string`",
                                    description: "Heure de fin de l'événement (ISO 8601)",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "detail-list",
            level: 3,
            title: { en: "`detail=list`", fr: "Mode `list`" },
            aliases: ["mode-list"],
            blocks: [
                {
                    type: "split",
                    en: [
                        {
                            type: "fields",
                            rows: [
                                {
                                    name: "summary",
                                    type: "`string[]`",
                                    description: "Array of summary elements",
                                },
                                {
                                    name: "start",
                                    type: "`string`",
                                    description: "Event start time (ISO 8601)",
                                },
                                {
                                    name: "end",
                                    type: "`string`",
                                    description: "Event end time (ISO 8601)",
                                },
                            ],
                        },
                    ],
                    fr: [
                        {
                            type: "p",
                            text: "Retourne un tableau de toutes les données brutes de chaque événement.",
                        },
                    ],
                },
            ],
        },
        {
            id: "default-no-detail-parameter",
            level: 3,
            title: { en: "Default (no `detail` parameter)", fr: "Mode par défaut (sans `detail`)" },
            aliases: ["mode-par-defaut-sans-detail"],
            blocks: [
                {
                    type: "split",
                    en: [
                        {
                            type: "fields",
                            rows: [
                                { name: "summary", type: "`string`", description: "Event summary" },
                                {
                                    name: "start",
                                    type: "`string`",
                                    description: "Event start time (ISO 8601)",
                                },
                                {
                                    name: "end",
                                    type: "`string`",
                                    description: "Event end time (ISO 8601)",
                                },
                            ],
                        },
                    ],
                    fr: [
                        {
                            type: "p",
                            text: "Retourne un tableau d'objets résumé avec les champs `summary`, `start` et `end`.",
                        },
                    ],
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
                            message: "Please provide a valid ICS file URL (?url={URL})",
                            description: {
                                en: "The `url` parameter is missing or invalid",
                                fr: "Le paramètre `url` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid URL.",
                            description: {
                                en: "The `url` parameter cannot be read as an address",
                                fr: "Le paramètre `url` n'est pas une adresse lisible",
                            },
                            status: 400,
                        },
                        {
                            message: "Only HTTPS URLs are allowed.",
                            description: {
                                en: "The `url`, or one of its redirects, does not use HTTPS",
                                fr: "L'`url`, ou l'une de ses redirections, n'utilise pas HTTPS",
                            },
                            status: 400,
                        },
                        {
                            message: "Access to private/internal hosts is not allowed.",
                            description: {
                                en: "The `url`, or one of its redirects, points to a private or internal address",
                                fr: "L'`url`, ou l'une de ses redirections, pointe vers une adresse privée ou interne",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid ICS file format.",
                            description: {
                                en: "The final response is not successful or is not served as `text/calendar`",
                                fr: "La réponse finale n'est pas un succès ou n'est pas servie en `text/calendar`",
                            },
                            status: 400,
                        },
                        {
                            message: "ICS file must be under 1MB.",
                            description: {
                                en: "The file exceeds the 1MB size limit",
                                fr: "Le fichier dépasse la limite de 1 Mo",
                            },
                            status: 400,
                        },
                        {
                            message: "ICS file must have at most 5000 events.",
                            description: {
                                en: "The file holds more than 5000 events",
                                fr: "Le fichier contient plus de 5000 événements",
                            },
                            status: 400,
                        },
                        {
                            message: "fetch failed",
                            description: {
                                en: "The file could not be downloaded: network error, host that does not resolve, or more than 10 redirects",
                                fr: "Le fichier n'a pas pu être téléchargé : erreur réseau, hôte introuvable ou plus de 10 redirections",
                            },
                            status: 400,
                        },
                        {
                            message: "The operation was aborted due to timeout",
                            description: {
                                en: "The download took more than 10 seconds, redirects included",
                                fr: "Le téléchargement a pris plus de 10 secondes, redirections comprises",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
