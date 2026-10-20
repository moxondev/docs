import type { Page } from "@/types/content";

export const page: Page = {
    version: "v2",
    id: "qrcode",
    kind: "endpoint",
    title: { en: "QR Code Generation", fr: "Génération de QR Codes" },
    lead: {
        en: "The `/qrcode` endpoint generates a QR Code from a URL provided as a parameter. This endpoint is useful for quickly generating an image in PNG format.",
        fr: "L'endpoint `/qrcode` génère un QR Code à partir d'une URL entrée en paramètre. Cet endpoint est pratique pour générer rapidement une image au format PNG.",
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
                                en: "The URL of the QR Code to generate. Must contain the full address",
                                fr: "L'URL du QR Code à générer. Doit contenir l'adresse complète",
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
                { type: "code", text: "GET /v2/qrcode?url=https://moxon.dev", role: "request" },
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
            id: "curl",
            level: 2,
            title: { en: "cURL", fr: "cURL" },
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: 'curl -X GET "https://api.moxon.dev/v2/qrcode?url=https://moxon.dev"',
                    role: "curl",
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
                        en: "If the value of `url` is empty, an error will be returned.",
                        fr: "Si la valeur de `url` est vide, une erreur sera renvoyée.",
                    },
                },
            ],
        },
    ],
};
