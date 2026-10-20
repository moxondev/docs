import type { Page } from "@/types/content";

export const page: Page = {
    version: "v1",
    id: "captcha",
    kind: "endpoint",
    title: { en: "Captcha Generation", fr: "Génération de Captcha" },
    lead: {
        en: "The `/captcha` endpoint generates an image from a text provided as a parameter. This endpoint can be useful for testing a user with the generated captcha by storing the text in memory.",
        fr: "L'endpoint `/captcha` génère une image à partir d'un texte entré en paramètre. Cet endpoint peut être utile pour tester un utilisateur sur le captcha généré en sauvegardant le texte en mémoire.",
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
                                fr: "Le texte du captcha à générer. Doit contenir au minimum un caractère",
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
            blocks: [{ type: "code", text: "GET /v1/captcha?text=test1234?ABCD", role: "request" }],
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
                    text: 'curl -X GET "https://api.moxon.dev/v1/captcha?text=test1234?ABCD" --output captcha.png',
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
                                text: "[See an example of the generated captcha](https://api.moxon.dev/v1/captcha?text=test1234?ABCD)",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "[Voir un exemple de captcha généré](https://api.moxon.dev/v1/captcha?text=test1234?ABCD)",
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
                        en: "If the value of `text` is empty, an error will be returned.",
                        fr: "Si la valeur de `text` est vide, une erreur sera renvoyée.",
                    },
                },
            ],
        },
    ],
};
