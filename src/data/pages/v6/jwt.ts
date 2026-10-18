import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "jwt",
    kind: "endpoint",
    title: { en: "JWT", fr: "JWT" },
    lead: {
        en: "The `/jwt` endpoint decodes a JSON Web Token without verifying the signature. Expiration is detected via the `exp` claim.",
        fr: "L'endpoint `/jwt` décode un JSON Web Token sans vérifier la signature. L'expiration est détectée via le claim `exp`.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/jwt",
            try: true,
            params: [
                {
                    name: "token",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "eyJ...",
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
                            description: { en: "JWT token to decode", fr: "JWT à décoder" },
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
                            name: "header",
                            type: "`object`",
                            description: {
                                en: "Decoded JWT header (algorithm, type, etc.)",
                                fr: "Header JWT décodé (algorithme, type, etc.)",
                            },
                        },
                        {
                            name: "payload",
                            type: "`object`",
                            description: {
                                en: "Decoded JWT payload (claims)",
                                fr: "Payload JWT décodé (claims)",
                            },
                        },
                        {
                            name: "signature",
                            type: "`string`",
                            description: {
                                en: "Raw signature string (not verified)",
                                fr: "Signature brute (non vérifiée)",
                            },
                        },
                        {
                            name: "expired",
                            type: "`boolean`",
                            description: {
                                en: "`true` if `exp` is in the past — absent if no `exp` claim",
                                fr: "`true` si `exp` est dépassé — absent si aucun claim `exp`",
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
                { type: "examples", op: "default", body: { token: "eyJ..." } },
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
                                en: "The `token` parameter is missing",
                                fr: "Le paramètre `token` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Token cannot exceed 8192 characters",
                            description: {
                                en: "The token exceeds the maximum length",
                                fr: "Le token dépasse la longueur maximale",
                            },
                            status: 400,
                        },
                        {
                            message: 'Invalid JWT format. Expected 3 parts separated by "."',
                            description: {
                                en: "The token does not have 3 dot-separated parts",
                                fr: "Le token n'a pas 3 parties séparées par des `.`",
                            },
                            status: 400,
                        },
                        {
                            message:
                                "Invalid JWT header: not a valid base64url-encoded JSON object",
                            description: {
                                en: "The header part is not valid base64url JSON, or decodes to something other than an object (e.g. an array or string)",
                                fr: "Le header n'est pas un JSON base64url valide, ou ne décode pas vers un objet (ex. un tableau ou une chaîne)",
                            },
                            status: 400,
                        },
                        {
                            message:
                                "Invalid JWT payload: not a valid base64url-encoded JSON object",
                            description: {
                                en: "The payload part is not valid base64url JSON, or decodes to something other than an object",
                                fr: "Le payload n'est pas un JSON base64url valide, ou ne décode pas vers un objet",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
