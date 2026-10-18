import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "chart",
    kind: "endpoint",
    title: { en: "Chart", fr: "Chart" },
    lead: {
        en: "The `/chart` endpoint generates charts from data. It supports bar, line, pie, and donut chart types, and returns either an SVG image or raw JSON data.",
        fr: "L'endpoint `/chart` génère des graphiques à partir de données. Il supporte les types bar, line, pie et donut, et retourne soit une image SVG, soit des données JSON brutes.",
    },
    updated: "2026-05-25",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/chart",
            try: true,
            params: [
                {
                    name: "type",
                    type: "enum",
                    in: "body",
                    required: true,
                    options: ["bar", "line", "pie", "donut"],
                },
                {
                    name: "data",
                    type: "json",
                    in: "body",
                    required: true,
                    placeholder:
                        '{"labels":["Jan","Feb","Mar"],"datasets":[{"label":"Sales","values":[120,200,150]}]}',
                },
                {
                    name: "title",
                    type: "string",
                    in: "body",
                    required: false,
                    placeholder: "My Chart",
                },
                { name: "width", type: "number", in: "body", required: false, placeholder: "600" },
                { name: "height", type: "number", in: "body", required: false, placeholder: "400" },
                {
                    name: "colors",
                    type: "string",
                    in: "body",
                    required: false,
                    placeholder: "#5c7cfa,#f03e3e,#37b24d",
                },
                { name: "bg", type: "string", in: "body", required: false, placeholder: "#ffffff" },
                {
                    name: "legend",
                    type: "boolean",
                    in: "body",
                    required: false,
                    options: ["true", "false"],
                },
                {
                    name: "mode",
                    type: "enum",
                    in: "body",
                    required: false,
                    options: ["svg", "data"],
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
                    type: "p",
                    text: {
                        en: "The request body must be JSON:",
                        fr: "Le corps de la requête doit être en JSON :",
                    },
                },
                {
                    type: "params",
                    rows: [
                        {
                            name: "type",
                            required: true,
                            description: {
                                en: "Chart type: `bar`, `line`, `pie`, or `donut`",
                                fr: "Type de graphique : `bar`, `line`, `pie` ou `donut`",
                            },
                        },
                        {
                            name: "data",
                            required: true,
                            description: {
                                en: "Chart data object (see structure below)",
                                fr: "Objet de données (voir structure ci-dessous)",
                            },
                        },
                        {
                            name: "title",
                            required: false,
                            description: {
                                en: "Chart title displayed above the chart",
                                fr: "Titre du graphique affiché en haut",
                            },
                        },
                        {
                            name: "width",
                            required: false,
                            description: {
                                en: "SVG width in pixels (responsive if omitted)",
                                fr: "Largeur SVG en pixels (responsive si omis)",
                            },
                        },
                        {
                            name: "height",
                            required: false,
                            description: {
                                en: "SVG height in pixels (responsive if omitted)",
                                fr: "Hauteur SVG en pixels (responsive si omis)",
                            },
                        },
                        {
                            name: "colors",
                            required: false,
                            description: {
                                en: "Array of hex colors for datasets (defaults to a built-in palette)",
                                fr: "Tableau de couleurs hexadécimales pour les datasets (palette par défaut sinon)",
                            },
                        },
                        {
                            name: "bg",
                            required: false,
                            description: {
                                en: "Background fill color (hex, transparent if omitted)",
                                fr: "Couleur de fond (hex, transparent si omis)",
                            },
                        },
                        {
                            name: "legend",
                            required: false,
                            description: {
                                en: "Show legend: `true` (default) or `false`",
                                fr: "Afficher la légende : `true` (défaut) ou `false`",
                            },
                        },
                        {
                            name: "mode",
                            required: false,
                            description: {
                                en: 'Response format: `"svg"` (default, returns SVG) or `"data"` (returns JSON)',
                                fr: 'Format de réponse : `"svg"` (défaut, retourne SVG) ou `"data"` (retourne JSON)',
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "data-format",
            level: 2,
            title: { en: "Data Format", fr: "Format des données" },
            aliases: ["format-des-donnees"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "`data` must be a **JSON object** (not a string) in the request body. The structure depends on the chart type.",
                        fr: "`data` doit être un **objet JSON** (pas une chaîne) dans le corps de la requête. La structure dépend du type de graphique.",
                    },
                },
                {
                    type: "label",
                    text: { en: "Bar and line charts:", fr: "Graphiques bar et line :" },
                },
                {
                    type: "code",
                    lang: "json",
                    text: {
                        en: '{\n    "labels": ["Jan", "Feb", "Mar"],\n    "datasets": [\n        { "label": "Sales", "values": [120, 200, 150] },\n        { "label": "Costs", "values": [80, 95, 110] }\n    ]\n}',
                        fr: '{\n    "labels": ["Jan", "Fév", "Mar"],\n    "datasets": [\n        { "label": "Ventes", "values": [120, 200, 150] },\n        { "label": "Coûts", "values": [80, 95, 110] }\n    ]\n}',
                    },
                },
                {
                    type: "label",
                    text: { en: "Pie and donut charts:", fr: "Graphiques pie et donut :" },
                },
                {
                    type: "code",
                    lang: "json",
                    text: {
                        en: '{\n    "labels": ["Jan", "Feb", "Mar"],\n    "values": [120, 200, 150]\n}',
                        fr: '{\n    "labels": ["Jan", "Fév", "Mar"],\n    "values": [120, 200, 150]\n}',
                    },
                },
                {
                    type: "list",
                    items: [
                        {
                            en: "`labels`: array of strings — max **20** labels",
                            fr: "`labels` : tableau de chaînes — max **20** labels",
                        },
                        {
                            en: "`datasets` (bar/line): array of dataset objects — max **5** datasets, each with a `label` and a `values` array matching the length of `labels`",
                            fr: "`datasets` (bar/line) : tableau d'objets — max **5** datasets, chacun avec un `label` et un tableau `values` de même longueur que `labels`",
                        },
                        {
                            en: "`values` (pie/donut): single array of non-negative numbers matching the length of `labels`",
                            fr: "`values` (pie/donut) : tableau unique de nombres non négatifs de même longueur que `labels`",
                        },
                    ],
                },
                {
                    type: "quote",
                    text: {
                        en: "The `data` field must be a JSON object, not a JSON string. Send the request with `Content-Type: application/json`.",
                        fr: "Le champ `data` doit être un objet JSON, pas une chaîne. Envoyer la requête avec `Content-Type: application/json`.",
                    },
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
                    type: "list",
                    items: [
                        {
                            en: 'When `mode` is `"svg"` (default): returns `Content-Type: image/svg+xml` with the SVG body',
                            fr: 'Quand `mode` est `"svg"` (défaut) : retourne `Content-Type: image/svg+xml` avec le corps SVG',
                        },
                        {
                            en: 'When `mode` is `"data"`: returns a JSON object with the chart data',
                            fr: 'Quand `mode` est `"data"` : retourne un objet JSON avec les données du graphique',
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
                    body: {
                        en: {
                            type: "bar",
                            data: {
                                labels: ["Jan", "Feb", "Mar"],
                                datasets: [{ label: "Sales", values: [120, 200, 150] }],
                            },
                            title: "Monthly Sales",
                        },
                        fr: {
                            type: "bar",
                            data: {
                                labels: ["Jan", "Fév", "Mar"],
                                datasets: [{ label: "Ventes", values: [120, 200, 150] }],
                            },
                            title: "Ventes mensuelles",
                        },
                    },
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
                            message: "Please provide a valid chart type (?type=bar|line|pie|donut)",
                            description: {
                                en: "The `type` parameter is missing or invalid",
                                fr: "Le paramètre `type` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "data must contain a labels array",
                            description: {
                                en: "The `data.labels` field is missing",
                                fr: "Le champ `data.labels` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "data must contain a datasets array",
                            description: {
                                en: "The `data.datasets` field is missing",
                                fr: "Le champ `data.datasets` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Too many labels (max 20)",
                            description: {
                                en: "The labels array exceeds 20 entries",
                                fr: "Le tableau labels dépasse 20 entrées",
                            },
                            status: 400,
                        },
                        {
                            message: "Too many datasets (max 5)",
                            description: {
                                en: "The datasets array exceeds 5 entries",
                                fr: "Le tableau datasets dépasse 5 entrées",
                            },
                            status: 400,
                        },
                        {
                            message: "Each dataset must have the same number of values as labels",
                            description: {
                                en: "Dataset length mismatch",
                                fr: "Incompatibilité de longueur des datasets",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
