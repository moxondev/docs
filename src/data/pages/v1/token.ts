import type { Page } from "@/types/content";

export const page: Page = {
    version: "v1",
    id: "token",
    kind: "endpoint",
    title: { en: "Token Generation", fr: "Génération de tokens" },
    lead: {
        en: "The `/token` endpoint generates secure strings called *tokens*. This endpoint is particularly useful for creating random identifiers for various applications.",
        fr: "L'endpoint `/token` permet de générer des chaînes sécurisées appelées *tokens*. Cet endpoint est particulièrement utile pour créer des identifiants aléatoires pour diverses applications.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/token",
            try: false,
            params: [
                { name: "len", type: "number", in: "body", required: false },
                { name: "type", type: "string", in: "body", required: false },
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
                                en: "Token type (see options below). Default: `alpha`",
                                fr: "Type de token (voir les options ci-dessous). Par défaut : `alpha`",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-types",
            level: 2,
            title: { en: "Available Types", fr: "Types disponibles" },
            aliases: ["types-disponibles"],
            blocks: [
                {
                    type: "table",
                    head: ["Type", "Description"],
                    rows: [
                        [
                            "`alpha`",
                            {
                                en: "Letters only (lowercase and uppercase)",
                                fr: "Lettres uniquement (minuscules et majuscules)",
                            },
                        ],
                        ["`alphanum`", { en: "Letters and numbers", fr: "Lettres et chiffres" }],
                        ["`base64`", { en: "Base64 encoding", fr: "Encodage Base64" }],
                        ["`hex`", { en: "Hexadecimal digits", fr: "Chiffres hexadécimaux" }],
                        ["`num`", { en: "Numbers only", fr: "Nombres uniquement" }],
                        [
                            "`punct`",
                            { en: "Punctuation characters", fr: "Caractères de ponctuation" },
                        ],
                        [
                            "`urlsafe`",
                            { en: "URL-safe characters", fr: "Caractères sûrs pour les URLs" },
                        ],
                        [
                            "`uuid`",
                            {
                                en: "Universally Unique Identifier (UUID)",
                                fr: "Identifiant universel unique (UUID)",
                            },
                        ],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [
                {
                    type: "code",
                    text: "POST /v1/token\nContent-Type: application/x-www-form-urlencoded\n\nlen=24&type=alphanum",
                    role: "request",
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
                    type: "code",
                    lang: "json",
                    text: '{\n    "token": "6tMdlDV90x4Sm52dRS7MuGyn"\n}',
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
                    text: 'curl -X POST -d "len=24&type=alphanum" "https://api.moxon.dev/v1/token"',
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
                        en: "If the `len` value is out of bounds or the `type` is invalid, a 12-character alphanumeric token will be generated.",
                        fr: "Si la valeur de `len` est hors limites, ou que le `type` est invalide, un token de 12 caractères alphanumériques sera généré.",
                    },
                },
            ],
        },
    ],
};
