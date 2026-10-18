import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "encode",
    kind: "endpoint",
    title: { en: "Encode", fr: "Encodage" },
    lead: {
        en: "The `/encode` endpoint encodes or decodes text in various formats.",
        fr: "L'endpoint `/encode` encode ou décode du texte dans différents formats.",
    },
    updated: "2026-05-25",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/encode",
            try: true,
            params: [
                {
                    name: "method",
                    type: "enum",
                    in: "query",
                    required: true,
                    options: [
                        "base64encode",
                        "base64decode",
                        "urlencode",
                        "urldecode",
                        "morse",
                        "unmorse",
                        "rot13",
                        "caesar",
                        "binary",
                        "unbinary",
                    ],
                },
                {
                    name: "text",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "Hello World",
                },
                { name: "shift", type: "number", in: "query", required: false, placeholder: "3" },
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
                            name: "method",
                            required: true,
                            description: {
                                en: "Encoding method (see available methods below)",
                                fr: "Méthode d'encodage (voir les méthodes ci-dessous)",
                            },
                        },
                        {
                            name: "text",
                            required: true,
                            description: {
                                en: "Text to encode or decode",
                                fr: "Texte à encoder ou décoder",
                            },
                        },
                        {
                            name: "shift",
                            required: false,
                            description: {
                                en: "Shift value for Caesar cipher (default: 13)",
                                fr: "Décalage pour le chiffre de César (défaut : 13)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-methods",
            level: 2,
            title: { en: "Available Methods", fr: "Méthodes disponibles" },
            aliases: ["methodes-disponibles"],
            blocks: [
                {
                    type: "table",
                    head: { en: ["Method", "Description"], fr: ["Méthode", "Description"] },
                    rows: [
                        ["`base64encode`", { en: "Encode to Base64", fr: "Encoder en Base64" }],
                        ["`base64decode`", { en: "Decode from Base64", fr: "Décoder du Base64" }],
                        ["`urlencode`", { en: "URL encode", fr: "Encoder pour URL" }],
                        ["`urldecode`", { en: "URL decode", fr: "Décoder une URL" }],
                        [
                            "`morse`",
                            {
                                en: "Text {icon:arrow-right} Morse code",
                                fr: "Texte {icon:arrow-right} Code Morse",
                            },
                        ],
                        [
                            "`unmorse`",
                            {
                                en: "Morse code {icon:arrow-right} Text",
                                fr: "Code Morse {icon:arrow-right} Texte",
                            },
                        ],
                        ["`rot13`", { en: "ROT-13 cipher", fr: "Chiffre ROT-13" }],
                        [
                            "`caesar`",
                            {
                                en: "Caesar cipher (requires `shift`)",
                                fr: "Chiffre de César (nécessite `shift`)",
                            },
                        ],
                        [
                            "`binary`",
                            {
                                en: "Text {icon:arrow-right} 8-bit binary",
                                fr: "Texte {icon:arrow-right} binaire 8 bits",
                            },
                        ],
                        [
                            "`unbinary`",
                            {
                                en: "Binary {icon:arrow-right} Text",
                                fr: "Binaire {icon:arrow-right} Texte",
                            },
                        ],
                    ],
                    kind: "definition",
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
                            name: "method",
                            type: "`string`",
                            description: {
                                en: "The encoding method used",
                                fr: "La méthode d'encodage utilisée",
                            },
                        },
                        {
                            name: "result",
                            type: "`string`",
                            description: {
                                en: "The encoded or decoded output",
                                fr: "Le résultat encodé ou décodé",
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
                    query: { method: "base64encode", text: "hello" },
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
                    type: "split",
                    en: [
                        {
                            type: "errors",
                            rows: [
                                {
                                    message: "A value is required",
                                    description: "The `text` parameter is missing",
                                    status: 400,
                                },
                                {
                                    message:
                                        "Please provide a valid method (?method={base64encode|base64decode|morse|…})",
                                    description: "The `method` parameter is missing or invalid",
                                    status: 400,
                                },
                                {
                                    message: "Invalid Base64 input",
                                    description:
                                        "The text is not valid Base64 (for `base64decode`)",
                                    status: 400,
                                },
                                {
                                    message: "Invalid Morse code",
                                    description: "The text is not valid Morse code (for `unmorse`)",
                                    status: 400,
                                },
                                {
                                    message: "Invalid binary input",
                                    description: "The text is not valid binary (for `unbinary`)",
                                    status: 400,
                                },
                                {
                                    message: "Please provide a valid shift value",
                                    description:
                                        "The `shift` value is missing or invalid (for `caesar`)",
                                    status: 400,
                                },
                            ],
                        },
                    ],
                    fr: [
                        {
                            type: "errors",
                            rows: [
                                {
                                    message: "A value is required",
                                    description: "Le paramètre `text` est manquant",
                                    status: 400,
                                },
                                {
                                    message:
                                        "Please provide a valid method (?method={base64encode|base64decode|morse|…})",
                                    description: "Le paramètre `method` est manquant ou invalide",
                                    status: 400,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
