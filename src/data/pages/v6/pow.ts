import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "pow",
    kind: "endpoint",
    title: { en: "Proof of Work", fr: "Preuve de travail" },
    lead: {
        en: "The `/pow` endpoint issues a proof-of-work challenge, an anti-bot protection meant to replace the visual captcha. The server hands out a `salt` and a difficulty; the client looks for a `nonce` whose `sha256` fingerprint starts with that many hexadecimal zeros, then posts it back for verification.",
        fr: "L'endpoint `/pow` émet un défi de preuve de travail, une protection anti-bot destinée à remplacer le captcha visuel. Le serveur fournit un `salt` et une difficulté ; le client cherche un `nonce` dont l'empreinte `sha256` commence par autant de zéros hexadécimaux, puis le renvoie pour vérification.",
    },
    updated: "2026-10-17",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/pow",
            try: true,
            params: [
                {
                    name: "difficulty",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "1-6",
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
                    kind: "info",
                    title: { en: "How it works?", fr: "Comment ça marche ?" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "At the default difficulty of `4`, solving takes about 65,000 hashes on average (16⁴) — under a second in a browser and imperceptible to a person, but ruinous for a bot repeating it thousands of times. Unlike a visual captcha, no vision model can shortcut it: the only way through is to spend the computation.",
                            },
                            {
                                type: "p",
                                text: "The expected answer never travels to the client. The token carries the `salt` and difficulty in clear, but its signature is computed server-side with a secret, so it cannot be forged or read back.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "À la difficulté par défaut de `4`, la résolution demande en moyenne environ 65 000 hachages (16⁴) — moins d'une seconde dans un navigateur, imperceptible pour une personne, mais ruineuse pour un robot qui la répète des milliers de fois. Contrairement à un captcha visuel, aucun modèle de vision ne peut la contourner : le seul moyen de passer est de dépenser le calcul.",
                            },
                            {
                                type: "p",
                                text: "La réponse attendue ne voyage jamais jusqu'au client. Le jeton transporte le `salt` et la difficulté en clair, mais sa signature est calculée côté serveur avec un secret : elle ne peut être ni forgée, ni relue.",
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
                            name: "difficulty",
                            required: false,
                            description: {
                                en: "Leading hexadecimal zeros required, an integer from 1 to 6. Default: `4`",
                                fr: "Nombre de zéros hexadécimaux exigés, entier de 1 à 6. Par défaut : `4`",
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
                            name: "algorithm",
                            type: "`string`",
                            description: {
                                en: "Hash algorithm used, always `sha256`",
                                fr: "Algorithme de hachage utilisé, toujours `sha256`",
                            },
                        },
                        {
                            name: "salt",
                            type: "`string`",
                            description: {
                                en: "Random salt to prefix the nonce with",
                                fr: "Sel aléatoire à préfixer au nonce",
                            },
                        },
                        {
                            name: "difficulty",
                            type: "`number`",
                            description: {
                                en: "Number of leading hexadecimal zeros the digest must start with",
                                fr: "Nombre de zéros hexadécimaux initiaux exigés dans l'empreinte",
                            },
                        },
                        {
                            name: "expires",
                            type: "`number`",
                            description: {
                                en: "Expiry timestamp of the token, in milliseconds",
                                fr: "Horodatage d'expiration du jeton, en millisecondes",
                            },
                        },
                        {
                            name: "token",
                            type: "`string`",
                            description: {
                                en: "Signed token to send back for verification",
                                fr: "Jeton signé à renvoyer pour la vérification",
                            },
                        },
                        {
                            name: "instructions",
                            type: "`string`",
                            description: {
                                en: "Human-readable description of the work to perform",
                                fr: "Description lisible du travail à effectuer",
                            },
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
                { type: "examples", op: "default", query: { difficulty: "4" } },
                {
                    type: "p",
                    text: {
                        en: "Solving the challenge is a loop, so it cannot be expressed as a single request. Increment a counter until the digest matches the required prefix:",
                        fr: "Résoudre le défi est une boucle, donc inexprimable en une seule requête. Incrémentez un compteur jusqu'à ce que l'empreinte corresponde au préfixe exigé :",
                    },
                },
                {
                    type: "code",
                    lang: "js",
                    text: "const { salt, difficulty, token } = await (await fetch('https://api.moxon.dev/v6/pow')).json();\nconst target = '0'.repeat(difficulty);\n\nlet nonce = 0;\nwhile (true) {\n    const bytes = new TextEncoder().encode(salt + nonce);\n    const hash = await crypto.subtle.digest('SHA-256', bytes);\n    const hex = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');\n    if (hex.startsWith(target)) break;\n    nonce++;\n}",
                },
                {
                    type: "p",
                    text: {
                        en: "Then send `token` and `nonce` to [/v6/pow](ref:pow/verify) to have the proof checked.",
                        fr: "Envoyez ensuite `token` et `nonce` à [/v6/pow](ref:pow/verify) pour faire vérifier la preuve.",
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
                            message: "Difficulty must be a number",
                            description: {
                                en: "The `difficulty` parameter is not a number",
                                fr: "Le paramètre `difficulty` n'est pas un nombre",
                            },
                            status: 400,
                        },
                        {
                            message: "Difficulty must be between 1 and 6",
                            description: {
                                en: "The `difficulty` is out of the allowed range",
                                fr: "La `difficulty` est hors de la plage autorisée",
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
                            label: "/v6/pow",
                            to: "pow/verify",
                            description: {
                                en: "Verify a solved challenge",
                                fr: "Vérifier un défi résolu",
                            },
                        },
                        {
                            label: "/v6/captcha",
                            to: "captcha",
                            description: {
                                en: "Visual captcha, the alternative this replaces",
                                fr: "Captcha visuel, l'alternative qu'il remplace",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
