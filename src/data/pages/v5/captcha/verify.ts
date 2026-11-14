import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "captcha/verify",
    kind: "endpoint",
    title: { en: "Captcha Verification", fr: "Vérification de captcha" },
    lead: {
        en: "The `/captcha` endpoint verifies an answer submitted for a challenge-mode captcha: send back the token from the `X-Captcha-Token` header, along with the text the user typed.",
        fr: "L'endpoint `/captcha` vérifie une réponse soumise pour un captcha en mode challenge : renvoyez le jeton issu de l'en-tête `X-Captcha-Token`, accompagné du texte saisi par l'utilisateur.",
    },
    updated: "2026-11-14",
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
                {
                    name: "minLength",
                    type: "number",
                    in: "body",
                    required: false,
                    placeholder: "6",
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
                        {
                            name: "minLength",
                            required: false,
                            description: {
                                en: "Shortest captcha accepted, an integer of 1 or more (a number or a numeric string). A right answer to a captcha generated with a smaller `length` is refused with the reason `weak`. Without it, any right answer is valid",
                                fr: "Longueur minimale du captcha accepté, un entier supérieur ou égal à 1 (un nombre ou une chaîne numérique). Une bonne réponse à un captcha généré avec une `length` plus petite est refusée avec le motif `weak`. Sans ce paramètre, toute bonne réponse est valide",
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
                                en: "The answer does not match the image. Five wrong answers burn the token",
                                fr: "La réponse ne correspond pas à l'image. Cinq mauvaises réponses invalident le jeton",
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
                                en: "The token was already redeemed — each one works exactly once — or burnt by five wrong answers",
                                fr: "Le jeton a déjà été consommé — chacun ne sert qu'une seule fois — ou invalidé par cinq mauvaises réponses",
                            },
                        ],
                        [
                            "`invalid`",
                            {
                                en: "The token is malformed or not a captcha token (a `/pow` token is refused)",
                                fr: "Le jeton est malformé ou n'est pas un jeton de captcha (un jeton de `/pow` est refusé)",
                            },
                        ],
                        [
                            "`weak`",
                            {
                                en: "The answer is right but the captcha is shorter than the `minLength` sent. The token is consumed",
                                fr: "La réponse est juste, mais le captcha est plus court que la `minLength` envoyée. Le jeton est consommé",
                            },
                        ],
                    ],
                    kind: "definition",
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Bounded in 6.2.0", fr: "Bornes de la 6.2.0" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "A legitimate request gets exactly the same response as before. Only abusive inputs are now refused or bounded:",
                            },
                            {
                                type: "list",
                                items: [
                                    "A token is accepted only if `/captcha` issued it: a token from `/pow` is refused with the reason `invalid`.",
                                    "Five wrong answers burn the token. The fifth still answers `wrong`, the following attempts answer `used`, even with the right answer. Up to four typos followed by the right answer still verify.",
                                    "`minLength` is optional and new: it changes nothing when omitted.",
                                ],
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Une requête légitime reçoit exactement la même réponse qu'avant. Seules les entrées abusives sont désormais refusées ou bornées :",
                            },
                            {
                                type: "list",
                                items: [
                                    "Un jeton n'est accepté que s'il a été émis par `/captcha` : un jeton de `/pow` est refusé avec le motif `invalid`.",
                                    "Cinq mauvaises réponses invalident le jeton. La cinquième répond encore `wrong`, les essais suivants répondent `used`, même avec la bonne réponse. Jusqu'à quatre fautes de frappe suivies de la bonne réponse sont toujours validées.",
                                    "`minLength` est optionnel et nouveau : il ne change rien lorsqu'il est omis.",
                                ],
                            },
                        ],
                    },
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
                        {
                            message: "Please provide a valid minimum length (&minLength={number})",
                            description: {
                                en: "The `minLength` is not an integer of 1 or more",
                                fr: "La `minLength` n'est pas un entier supérieur ou égal à 1",
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
                            label: "/v5/captcha",
                            to: "captcha",
                            description: {
                                en: "Generate a captcha in challenge mode",
                                fr: "Générer un captcha en mode challenge",
                            },
                        },
                        {
                            label: "/v5/pow",
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
