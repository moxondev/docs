import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "pow/verify",
    kind: "endpoint",
    title: { en: "Proof of Work Verification", fr: "Vérification de preuve de travail" },
    lead: {
        en: "The `/pow` endpoint verifies a solved proof-of-work challenge: send back the token issued with the challenge, along with the nonce you found.",
        fr: "L'endpoint `/pow` vérifie un défi de preuve de travail résolu : renvoyez le jeton émis avec le défi, accompagné du nonce trouvé.",
    },
    updated: "2026-09-08",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/pow",
            try: true,
            params: [
                {
                    name: "token",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "eyJ...",
                },
                { name: "nonce", type: "number", in: "body", required: true, placeholder: "48123" },
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
                                en: "Token issued by the challenge",
                                fr: "Jeton émis par le défi",
                            },
                        },
                        {
                            name: "nonce",
                            required: true,
                            description: {
                                en: "Nonce found by the client",
                                fr: "Nonce trouvé par le client",
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
                                en: "`true` if the proof is accepted",
                                fr: "`true` si la preuve est acceptée",
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
                                en: "The nonce does not produce a digest with enough leading zeros",
                                fr: "Le nonce ne produit pas une empreinte avec assez de zéros initiaux",
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
                            {
                                en: "The token is malformed or not a proof-of-work token",
                                fr: "Le jeton est malformé ou n'est pas un jeton de preuve de travail",
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
                { type: "examples", op: "default", body: { token: "eyJ...", nonce: "48123" } },
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
                            message: "Please provide a nonce (&nonce={nonce})",
                            description: {
                                en: "The `nonce` is missing",
                                fr: "Le `nonce` est manquant",
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
                            label: "/v5/pow",
                            to: "pow",
                            description: {
                                en: "Request a challenge to solve",
                                fr: "Demander un défi à résoudre",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
