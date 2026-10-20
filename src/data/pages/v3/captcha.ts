import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "captcha",
    kind: "endpoint",
    title: { en: "Captcha Generation", fr: "Génération de Captcha" },
    lead: {
        en: "The `/captcha` endpoint generates an image from a text provided as a parameter. This endpoint can be useful for testing a user with the generated captcha by storing the text in memory.",
        fr: "L'endpoint `/captcha` génère une image à partir d'un texte fourni en paramètre. Cet endpoint peut être utile pour tester un utilisateur avec le captcha généré en stockant le texte en mémoire.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/captcha",
            try: false,
            params: [{ name: "text", type: "string", in: "query", required: true }],
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
                            name: "text",
                            required: true,
                            description: {
                                en: "The captcha text to generate. Must contain at least one character",
                                fr: "Le texte du captcha à générer. Doit contenir au moins un caractère",
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
            blocks: [{ type: "code", text: "GET /v3/captcha?text=test1234?ABCD", role: "request" }],
        },
        {
            id: "response",
            level: 2,
            title: { en: "Response", fr: "Réponse" },
            aliases: ["reponse"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "The endpoint returns a PNG image of the generated captcha.",
                        fr: "L'endpoint retourne une image PNG du captcha généré.",
                    },
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
                    text: 'curl -X GET "https://api.moxon.dev/v3/captcha?text=test1234?ABCD" --output captcha.png',
                    role: "curl",
                },
                {
                    type: "callout",
                    kind: "tip",
                    title: { en: "Example", fr: "Exemple" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "[See an example of the generated captcha](https://api.moxon.dev/v3/captcha?text=test1234?ABCD)",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "[Voir un exemple du captcha généré](https://api.moxon.dev/v3/captcha?text=test1234?ABCD)",
                            },
                        ],
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
                            message: "Please provide a valid argument (?text={text})",
                            description: {
                                en: "The `text` parameter is missing or invalid",
                                fr: "Le paramètre `text` est manquant ou invalide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
