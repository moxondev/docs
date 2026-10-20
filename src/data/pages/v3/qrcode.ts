import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "qrcode",
    kind: "endpoint",
    title: { en: "QR Code Generation", fr: "Génération de QR Code" },
    lead: {
        en: "The `/qrcode` endpoint generates a QR Code from a URL provided as a parameter. This endpoint is useful for quickly generating an image in PNG format.",
        fr: "L'endpoint `/qrcode` génère un QR Code à partir d'une URL fournie en paramètre. Cet endpoint est pratique pour générer rapidement une image au format PNG.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/qrcode",
            try: false,
            params: [{ name: "url", type: "string", in: "query", required: true }],
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
                                en: "The URL to encode in the QR Code. Must contain the full address",
                                fr: "L'URL à encoder dans le QR Code. Doit contenir l'adresse complète",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [
                { type: "code", text: "GET /v3/qrcode?url=https://moxon.dev", role: "request" },
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
                    text: '{\n    "qr": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOaSURBVO3BQY5jBxYDwcwH3f/KnF7MgqsPCFKV7..."\n}',
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
                            "`qr`",
                            {
                                en: "Base64-encoded PNG image of the QR Code",
                                fr: "Image PNG du QR Code encodée en Base64",
                            },
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
                    text: 'curl -X GET "https://api.moxon.dev/v3/qrcode?url=https://moxon.dev"',
                    role: "curl",
                },
            ],
        },
        {
            id: "using-the-response",
            level: 2,
            title: { en: "Using the Response", fr: "Utilisation de la réponse" },
            aliases: ["utilisation-de-la-reponse"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The response contains a base64-encoded PNG image. You can use it directly in HTML:",
                        fr: "La réponse contient une image PNG encodée en base64. Vous pouvez l'utiliser directement en HTML :",
                    },
                },
                {
                    type: "code",
                    lang: "html",
                    text: '<img src="data:image/png;base64,iVBORw0KGgo..." alt="QR Code" />',
                },
                {
                    type: "p",
                    text: {
                        en: "Or decode it and save as a file in your application.",
                        fr: "Ou la décoder et l'enregistrer en tant que fichier dans votre application.",
                    },
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
                            message: "Please provide a valid url (?url={URL})",
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
