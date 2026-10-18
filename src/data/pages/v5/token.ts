import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "token",
    kind: "endpoint",
    title: { en: "Token Generation", fr: "Génération de tokens" },
    lead: {
        en: "The `/token` endpoint generates secure strings called *tokens*. This endpoint is particularly useful for creating random identifiers for various applications.",
        fr: "L'endpoint `/token` permet de générer des chaînes sécurisées appelées *tokens*. Cet endpoint est particulièrement utile pour créer des identifiants aléatoires pour diverses applications.",
    },
    updated: "2026-05-25",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/token",
            try: true,
            params: [
                {
                    name: "len",
                    type: "number",
                    in: "body",
                    required: false,
                    default: "24",
                    placeholder: "24",
                },
                {
                    name: "type",
                    type: "enum",
                    in: "body",
                    required: false,
                    options: [
                        "alpha",
                        "alphanum",
                        "base64",
                        "hex",
                        "num",
                        "punct",
                        "urlsafe",
                        "uuid",
                    ],
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
                    type: "params",
                    rows: [
                        {
                            name: "len",
                            required: false,
                            description: {
                                en: "Token length (12-4096). Default: 24",
                                fr: "Longueur du token (12-4096). Par défaut : 24",
                            },
                        },
                        {
                            name: "type",
                            required: false,
                            description: {
                                en: "Token type (see options below). Default: `alphanum`",
                                fr: "Type de token (voir les options ci-dessous). Par défaut : `alphanum`",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "token-types",
            level: 2,
            title: { en: "Token Types", fr: "Types de tokens" },
            aliases: ["types-de-tokens"],
            blocks: [
                {
                    type: "table",
                    head: {
                        en: ["Type", "Description", "Example"],
                        fr: ["Type", "Description", "Exemple"],
                    },
                    rows: [
                        [
                            "`alpha`",
                            { en: "Letters only (a-z, A-Z)", fr: "Lettres uniquement (a-z, A-Z)" },
                            "`AbCdEfGhIjKl`",
                        ],
                        [
                            "`alphanum`",
                            { en: "Letters and numbers", fr: "Lettres et chiffres" },
                            "`6tMdlDV90x4S`",
                        ],
                        [
                            "`base64`",
                            { en: "Base64 encoding", fr: "Encodage Base64" },
                            "`dGVzdDEyMzQ=`",
                        ],
                        [
                            "`hex`",
                            { en: "Hexadecimal digits", fr: "Chiffres hexadécimaux" },
                            "`a1b2c3d4e5f6`",
                        ],
                        [
                            "`num`",
                            { en: "Numbers only", fr: "Nombres uniquement" },
                            "`123456789012`",
                        ],
                        [
                            "`punct`",
                            { en: "Punctuation characters", fr: "Caractères de ponctuation" },
                            "`!@#$%^&*()_+`",
                        ],
                        [
                            "`urlsafe`",
                            { en: "URL-safe characters", fr: "Caractères sûrs pour les URLs" },
                            "`abc-123_XYZ`",
                        ],
                        [
                            "`uuid`",
                            { en: "UUID format", fr: "Format UUID" },
                            "`550e8400-e29b-41d4-a716-446655440000`",
                        ],
                    ],
                    kind: "matrix",
                },
            ],
        },
        {
            id: "code-examples",
            level: 2,
            title: { en: "Code Examples", fr: "Exemples de code" },
            aliases: ["exemples-de-code"],
            blocks: [{ type: "examples", op: "default", body: { len: "24", type: "alphanum" } }],
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
                            name: "token",
                            type: "`string`",
                            description: {
                                en: "The generated secure token",
                                fr: "Le token sécurisé généré",
                            },
                        },
                    ],
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
                        en: "If parameters are invalid, the API will return an error:",
                        fr: "Si les paramètres sont invalides, l'API retournera une erreur :",
                    },
                },
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Invalid number.",
                            description: {
                                en: "The `len` parameter is not a valid number",
                                fr: "Le paramètre `len` n'est pas un nombre valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Length cannot exceed 4096.",
                            description: {
                                en: "The `len` parameter is greater than 4096",
                                fr: "Le paramètre `len` est supérieur à 4096",
                            },
                            status: 400,
                        },
                        {
                            message: "Length cannot be less than 12.",
                            description: {
                                en: "The `len` parameter is less than 12",
                                fr: "Le paramètre `len` est inférieur à 12",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
