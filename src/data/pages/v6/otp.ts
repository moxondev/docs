import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "otp",
    kind: "endpoint",
    title: { en: "OTP", fr: "OTP" },
    lead: {
        en: "The `/otp` endpoint generates and verifies one-time passwords (TOTP/HOTP), compatible with Google Authenticator and Aegis.",
        fr: "L'endpoint `/otp` génère et vérifie des mots de passe à usage unique (TOTP/HOTP), compatibles avec Google Authenticator et Aegis.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/otp",
            try: true,
            params: [
                {
                    name: "action",
                    type: "enum",
                    in: "body",
                    required: true,
                    options: ["secret", "generate", "verify"],
                },
                {
                    name: "secret",
                    type: "string",
                    in: "body",
                    required: "conditional",
                    placeholder: "JBSWY3DPEHPK3PXP",
                },
                {
                    name: "code",
                    type: "string",
                    in: "body",
                    required: "conditional",
                    placeholder: "123456",
                },
                {
                    name: "label",
                    type: "string",
                    in: "body",
                    required: false,
                    placeholder: "alice",
                },
                {
                    name: "issuer",
                    type: "string",
                    in: "body",
                    required: false,
                    placeholder: "Demo",
                },
                {
                    name: "algorithm",
                    type: "enum",
                    in: "body",
                    required: false,
                    options: ["sha1", "sha256", "sha512"],
                },
                { name: "digits", type: "enum", in: "body", required: false, options: ["6", "8"] },
                {
                    name: "period",
                    type: "enum",
                    in: "body",
                    required: false,
                    options: ["15", "30", "60"],
                },
                { name: "counter", type: "number", in: "body", required: false, placeholder: "0" },
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
                            name: "action",
                            required: true,
                            description: {
                                en: "Action to perform: `secret`, `generate`, or `verify`",
                                fr: "Action à effectuer : `secret`, `generate` ou `verify`",
                            },
                        },
                        {
                            name: "secret",
                            required: "conditional",
                            description: {
                                en: "Base32 secret key (required for `generate` and `verify`)",
                                fr: "Clé secrète base32 (requise pour `generate` et `verify`)",
                            },
                        },
                        {
                            name: "code",
                            required: "conditional",
                            description: {
                                en: "OTP code to verify (required for `verify`)",
                                fr: "Code OTP à vérifier (requis pour `verify`)",
                            },
                        },
                        {
                            name: "label",
                            required: false,
                            description: {
                                en: "Account label for the `otpauth://` URI (used with `secret` action)",
                                fr: "Libellé du compte pour l'URI `otpauth://` (utilisé avec l'action `secret`)",
                            },
                        },
                        {
                            name: "issuer",
                            required: false,
                            description: {
                                en: "Issuer name for the `otpauth://` URI (used with `secret` action)",
                                fr: "Nom de l'émetteur pour l'URI `otpauth://` (utilisé avec l'action `secret`)",
                            },
                        },
                        {
                            name: "algorithm",
                            required: false,
                            description: {
                                en: "HMAC algorithm: `sha1` (default), `sha256`, or `sha512`",
                                fr: "Algorithme HMAC : `sha1` (défaut), `sha256` ou `sha512`",
                            },
                        },
                        {
                            name: "digits",
                            required: false,
                            description: {
                                en: "Code length: `6` (default) or `8`",
                                fr: "Longueur du code : `6` (défaut) ou `8`",
                            },
                        },
                        {
                            name: "period",
                            required: false,
                            description: {
                                en: "TOTP period in seconds: `15`, `30` (default), or `60`",
                                fr: "Période TOTP en secondes : `15`, `30` (défaut) ou `60`",
                            },
                        },
                        {
                            name: "counter",
                            required: false,
                            description: {
                                en: "HOTP counter (integer). If provided, HOTP mode is used instead of TOTP",
                                fr: "Compteur HOTP (entier). Si fourni, le mode HOTP est utilisé à la place du TOTP",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-actions",
            level: 2,
            title: { en: "Available Actions", fr: "Actions disponibles" },
            aliases: ["actions-disponibles"],
            blocks: [
                {
                    type: "table",
                    head: ["Action", "Description"],
                    rows: [
                        [
                            "`secret`",
                            {
                                en: "Generates a new random base32 secret and returns an `otpauth://` URI ready for QR code scanning",
                                fr: "Génère un nouveau secret base32 aléatoire et retourne un URI `otpauth://` prêt à être scanné en QR code",
                            },
                        ],
                        [
                            "`generate`",
                            {
                                en: "Generates the current OTP code. Without `counter`: TOTP (time-based). With `counter`: HOTP (deterministic)",
                                fr: "Génère le code OTP courant. Sans `counter` : mode TOTP (basé sur le temps). Avec `counter` : mode HOTP (déterministe)",
                            },
                        ],
                        [
                            "`verify`",
                            {
                                en: "Verifies a code with a ±1 period tolerance window. Returns `valid` and a `drift` offset (0, +1, or -1)",
                                fr: "Vérifie un code avec une fenêtre de tolérance de ±1 période. Retourne `valid` et un décalage `drift` (0, +1 ou -1)",
                            },
                        ],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "rfc-compliance",
            level: 2,
            title: { en: "RFC Compliance", fr: "Conformité RFC" },
            aliases: ["conformite-rfc"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Implements **RFC 4226** (HOTP) and **RFC 6238** (TOTP). Compatible with Google Authenticator and Aegis.",
                        fr: "Implémente la **RFC 4226** (HOTP) et la **RFC 6238** (TOTP). Compatible avec Google Authenticator et Aegis.",
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
                {
                    type: "examples",
                    op: "default",
                    body: { action: "secret", label: "alice", issuer: "Demo" },
                },
            ],
        },
        {
            id: "response-fields",
            level: 2,
            title: { en: "Response Fields", fr: "Champs de réponse" },
            aliases: ["champs-de-reponse"],
            blocks: [
                { type: "label", text: { en: "`secret` action:", fr: "Action `secret` :" } },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "secret",
                            type: "`string`",
                            description: {
                                en: "Base32-encoded secret key",
                                fr: "Clé secrète encodée en base32",
                            },
                        },
                        {
                            name: "uri",
                            type: "`string`",
                            description: {
                                en: "`otpauth://` URI for QR code generation",
                                fr: "URI `otpauth://` pour la génération de QR code",
                            },
                        },
                    ],
                },
                { type: "label", text: { en: "`generate` action:", fr: "Action `generate` :" } },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "code",
                            type: "`string`",
                            description: { en: "Generated OTP code", fr: "Code OTP généré" },
                        },
                        {
                            name: "type",
                            type: "`string`",
                            description: { en: "`totp` or `hotp`", fr: "`totp` ou `hotp`" },
                        },
                    ],
                },
                { type: "label", text: { en: "`verify` action:", fr: "Action `verify` :" } },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "valid",
                            type: "`boolean`",
                            description: {
                                en: "Whether the code is valid",
                                fr: "Indique si le code est valide",
                            },
                        },
                        {
                            name: "drift",
                            type: "`number`",
                            description: {
                                en: "Time drift detected (0, +1, or -1)",
                                fr: "Décalage temporel détecté (0, +1 ou -1)",
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
                        en: "If parameters are missing or invalid, the API will return an error:",
                        fr: "Si les paramètres sont manquants ou invalides, l'API retournera une erreur :",
                    },
                },
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Action is required",
                            description: {
                                en: "The `action` parameter is missing",
                                fr: "Le paramètre `action` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Action must be one of: secret, generate, verify",
                            description: {
                                en: "The `action` value is not valid",
                                fr: "La valeur de `action` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Secret is required",
                            description: {
                                en: "The `secret` parameter is missing",
                                fr: "Le paramètre `secret` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Code is required",
                            description: {
                                en: "The `code` parameter is missing for `verify`",
                                fr: "Le paramètre `code` est manquant pour `verify`",
                            },
                            status: 400,
                        },
                        {
                            message: "Digits must be 6 or 8",
                            description: {
                                en: "The `digits` value is not valid",
                                fr: "La valeur de `digits` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Period must be one of: 15, 30, 60",
                            description: {
                                en: "The `period` value is not valid",
                                fr: "La valeur de `period` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Algorithm must be one of: sha1, sha256, sha512",
                            description: {
                                en: "The `algorithm` value is not supported",
                                fr: "L'`algorithm` n'est pas supporté",
                            },
                            status: 400,
                        },
                        {
                            message: "Counter must be a non-negative integer",
                            description: {
                                en: "The `counter` value is invalid",
                                fr: "La valeur de `counter` est invalide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
