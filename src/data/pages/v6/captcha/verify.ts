import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "captcha/verify",
    kind: "endpoint",
    title: { en: "Captcha Verification", fr: "Vérification de captcha" },
    lead: {
        en: "The `/captcha` endpoint verifies an answer submitted for a challenge-mode captcha: send back the token from the `X-Captcha-Token` header, along with the text the user typed.",
        fr: "L'endpoint `/captcha` vérifie une réponse soumise pour un captcha en mode challenge : renvoyez le jeton issu de l'en-tête `X-Captcha-Token`, accompagné du texte saisi par l'utilisateur.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/captcha",
            try: true,
            params: [
                {
                    name: "token",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "eyJ...",
                },
                {
                    name: "answer",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "a4Kf2p",
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
                            name: "token",
                            required: true,
                            description: {
                                en: "Token from the `X-Captcha-Token` header",
                                fr: "Jeton issu de l'en-tête `X-Captcha-Token`",
                            },
                        },
                        {
                            name: "answer",
                            required: true,
                            description: {
                                en: "Text typed by the user. Case-insensitive, trimmed",
                                fr: "Texte saisi par l'utilisateur. Insensible à la casse, espaces ignorés",
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
                            name: "valid",
                            type: "`boolean`",
                            description: {
                                en: "`true` if the answer matches",
                                fr: "`true` si la réponse correspond",
                            },
                        },
                        {
                            name: "reason",
                            type: "`string`",
                            description: {
                                en: "Why it was rejected — absent when `valid` is `true`",
                                fr: "Motif du rejet — absent lorsque `valid` vaut `true`",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "rejection-reasons",
            level: 2,
            title: { en: "Rejection Reasons", fr: "Motifs de rejet" },
            aliases: ["motifs-de-rejet"],
            blocks: [
                {
                    type: "table",
                    head: { en: ["Reason", "Meaning"], fr: ["Motif", "Signification"] },
                    rows: [
                        [
                            "`wrong`",
                            {
                                en: "The answer does not match the image",
                                fr: "La réponse ne correspond pas à l'image",
                            },
                        ],
                        [
                            "`expired`",
                            {
                                en: "The token is older than 5 minutes",
                                fr: "Le jeton a plus de 5 minutes",
                            },
                        ],
                        [
                            "`used`",
                            {
                                en: "The token was already redeemed — each one works exactly once",
                                fr: "Le jeton a déjà été consommé — chacun ne sert qu'une seule fois",
                            },
                        ],
                        [
                            "`invalid`",
                            { en: "The token is malformed", fr: "Le jeton est malformé" },
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
                { type: "examples", op: "default", body: { token: "eyJ...", answer: "a4Kf2p" } },
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
                            message: "Please provide a token (?token={token})",
                            description: {
                                en: "The `token` is missing",
                                fr: "Le `token` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide an answer (&answer={answer})",
                            description: {
                                en: "The `answer` is missing",
                                fr: "La `answer` est manquante",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
        {
            id: "related-endpoints",
            level: 2,
            title: { en: "Related Endpoints", fr: "Endpoints associés" },
            aliases: ["endpoints-associes"],
            blocks: [
                {
                    type: "related",
                    items: [
                        {
                            label: "/v6/captcha",
                            to: "captcha",
                            description: {
                                en: "Generate a captcha in challenge mode",
                                fr: "Générer un captcha en mode challenge",
                            },
                        },
                        {
                            label: "/v6/pow",
                            to: "pow",
                            description: {
                                en: "Proof of work, the recommended alternative",
                                fr: "Preuve de travail, l'alternative recommandée",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
