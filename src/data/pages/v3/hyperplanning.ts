import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "hyperplanning",
    kind: "endpoint",
    title: { en: "Hyperplanning", fr: "Hyperplanning" },
    lead: {
        en: "The `/hyperplanning` endpoint allows you to display a Hyperplanning schedule information in JSON format from an ICS (calendar) file.",
        fr: "L'endpoint `/hyperplanning` permet d'afficher les informations d'un emploi du temps Hyperplanning au format JSON à partir d'un fichier ICS (calendrier).",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/hyperplanning",
            try: false,
            params: [
                { name: "url", type: "string", in: "body", required: true },
                { name: "detail", type: "string", in: "body", required: false },
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
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X POST -d "url=https%3A%2F%2Fexample.com%2Ffile.ics&detail=full" "https://api.moxon.dev/v3/hyperplanning"',
                    role: "request",
                },
            ],
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
                    text: '[\n    {\n        "summary": ["Mathematics", "DOE", "Class", "1", "Class", "2"],\n        "subject": "Mathematics",\n        "teacher": "DOE",\n        "classes": ["Class 1", "Class 2"],\n        "start": "2000-03-01T12:00:00.000",\n        "end": "2000-03-01T14:00:00.000"\n    }\n]',
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
                        [
                            "`summary`",
                            {
                                en: "Array of summary elements",
                                fr: "Tableau des éléments du résumé",
                            },
                        ],
                        ["`subject`", { en: "Subject name", fr: "Nom de la matière" }],
                        ["`teacher`", { en: "Teacher name", fr: "Nom de l'enseignant" }],
                        [
                            "`classes`",
                            { en: "Array of class names", fr: "Tableau des noms de classes" },
                        ],
                        [
                            "`start`",
                            {
                                en: "Event start time (ISO 8601)",
                                fr: "Heure de début de l'événement (ISO 8601)",
                            },
                        ],
                        [
                            "`end`",
                            {
                                en: "Event end time (ISO 8601)",
                                fr: "Heure de fin de l'événement (ISO 8601)",
                            },
                        ],
                    ],
                    kind: "definition",
                },
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
