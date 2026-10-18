import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "validate",
    kind: "endpoint",
    title: { en: "Validate", fr: "Validation" },
    lead: {
        en: "The `/validate` endpoint validates various data formats.",
        fr: "L'endpoint `/validate` valide différents formats de données.",
    },
    updated: "2026-05-25",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/validate",
            try: true,
            params: [
                {
                    name: "type",
                    type: "enum",
                    in: "query",
                    required: true,
                    options: ["luhn", "iban", "email"],
                },
                {
                    name: "value",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "test@example.com",
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
                            name: "type",
                            required: true,
                            description: {
                                en: "Validation type: `luhn`, `iban`, `email`",
                                fr: "Type de validation : `luhn`, `iban`, `email`",
                            },
                        },
                        {
                            name: "value",
                            required: true,
                            description: {
                                en: "Value to validate",
                                fr: "Valeur à valider (luhn : 12–19 chiffres, iban : 15–34 caractères)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "validation-types",
            level: 2,
            title: { en: "Validation Types", fr: "Types de validation" },
            aliases: ["types-de-validation"],
            blocks: [
                {
                    type: "split",
                    en: [
                        {
                            type: "table",
                            head: ["Type", "Description", "Limits"],
                            rows: [
                                ["`luhn`", "Luhn algorithm (credit card numbers)", "12–19 digits"],
                                ["`iban`", "International Bank Account Number", "15–34 characters"],
                                ["`email`", "Email address format", ""],
                            ],
                            kind: "matrix",
                        },
                    ],
                    fr: [
                        {
                            type: "table",
                            head: ["Type", "Description"],
                            rows: [
                                ["`luhn`", "Algorithme de Luhn (numéros de carte)"],
                                ["`iban`", "Numéro de compte bancaire international"],
                                ["`email`", "Format d'adresse email"],
                            ],
                            kind: "definition",
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
                                en: "Whether the value is valid",
                                fr: "Si la valeur est valide",
                            },
                        },
                        {
                            name: "value",
                            type: "`string`",
                            description: { en: "The validated value", fr: "La valeur validée" },
                        },
                        {
                            name: "country",
                            type: "`string`",
                            description: {
                                en: "Country code (IBAN only)",
                                fr: "Code pays (IBAN uniquement)",
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
                {
                    type: "examples",
                    op: "default",
                    query: { type: "email", value: "user@example.com" },
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
                            message: "Please provide a valid type (?type={luhn|iban|email})",
                            description: {
                                en: "The `type` parameter is missing or invalid",
                                fr: "Le paramètre `type` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "A value is required",
                            description: {
                                en: "The `value` parameter is missing",
                                fr: "Le paramètre `value` est manquant",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
