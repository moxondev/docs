import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "hyperplanning",
    kind: "endpoint",
    title: { en: "Hyperplanning", fr: "Hyperplanning" },
    lead: {
        en: "The `/hyperplanning` endpoint allows you to display a Hyperplanning schedule information in JSON format from an ICS (calendar) file.",
        fr: "L'endpoint `/hyperplanning` permet d'afficher les informations d'un emploi du temps Hyperplanning au format JSON à partir d'un fichier ICS (calendrier).",
    },
    updated: "2026-09-13",
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
        {
            id: "",
            blocks: [
                { type: "endpoint", op: "default" },
                {
                    type: "callout",
                    kind: "warning",
                    title: { en: "Deprecated in 6.0.0", fr: "Déprécié en 6.0.0" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "This endpoint is deprecated. It still answers here and on v6, but v6 no longer lists it among its available endpoints, and it will be removed for good in 7.0.0. Plan your migration now — see the [6.0.0 changelog](ref:v6/changelog/6.0.0).",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Cet endpoint est déprécié. Il répond encore ici et en v6, mais la v6 ne le liste plus parmi ses endpoints disponibles, et il sera retiré définitivement en 7.0.0. Prévoyez votre migration dès maintenant — voir le [changelog 6.0.0](ref:v6/changelog/6.0.0).",
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
                            name: "url",
                            required: true,
                            description: {
                                en: "The URL of the ICS file to use and display. Must be URL-encoded before being sent",
                                fr: "L'URL du fichier ICS à utiliser et afficher. Doit être encodée en URL avant l'envoi",
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
                    ],
                },
            ],
        },
    ],
};
