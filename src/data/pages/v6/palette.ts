import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "palette",
    kind: "endpoint",
    title: { en: "Palette", fr: "Palette" },
    lead: {
        en: "The `/palette` endpoint generates a harmonious color palette from a base HEX color.",
        fr: "L'endpoint `/palette` génère une palette de couleurs harmonieuse à partir d'une couleur HEX.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/palette",
            try: true,
            params: [
                {
                    name: "color",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "#ff6600",
                },
                {
                    name: "type",
                    type: "enum",
                    in: "query",
                    required: true,
                    options: [
                        "complementary",
                        "triadic",
                        "analogous",
                        "tetradic",
                        "split-complementary",
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
                            name: "color",
                            required: true,
                            description: {
                                en: "Base color in HEX format (`#RRGGBB`)",
                                fr: "Couleur de base en HEX (`#RRGGBB`)",
                            },
                        },
                        {
                            name: "type",
                            required: true,
                            description: {
                                en: "Palette type (see below)",
                                fr: "Type de palette (voir ci-dessous)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "palette-types",
            level: 2,
            title: { en: "Palette Types", fr: "Types de palette" },
            aliases: ["types-de-palette"],
            blocks: [
                {
                    type: "table",
                    head: { en: ["Type", "Colors Generated"], fr: ["Type", "Couleurs générées"] },
                    rows: [
                        [
                            "`complementary`",
                            { en: "2 colors (opposite)", fr: "2 couleurs (opposées)" },
                        ],
                        ["`triadic`", { en: "3 colors (120°)", fr: "3 couleurs (120°)" }],
                        [
                            "`analogous`",
                            { en: "5 colors (-60° to +60°)", fr: "5 couleurs (-60° à +60°)" },
                        ],
                        ["`tetradic`", { en: "4 colors (90°)", fr: "4 couleurs (90°)" }],
                        ["`split-complementary`", { en: "3 colors", fr: "3 couleurs" }],
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
                            name: "base.hex",
                            type: "`string`",
                            description: { en: "Base color in HEX", fr: "Couleur de base en HEX" },
                        },
                        {
                            name: "base.rgb",
                            type: "`string`",
                            description: { en: "Base color in RGB", fr: "Couleur de base en RGB" },
                        },
                        {
                            name: "base.hsl",
                            type: "`string`",
                            description: { en: "Base color in HSL", fr: "Couleur de base en HSL" },
                        },
                        {
                            name: "type",
                            type: "`string`",
                            description: { en: "Palette type used", fr: "Type de palette utilisé" },
                        },
                        {
                            name: "colors",
                            type: "`array`",
                            description: { en: "Generated colors", fr: "Couleurs générées" },
                        },
                        {
                            name: "colors[].hex",
                            type: "`string`",
                            description: { en: "Color in HEX format", fr: "Couleur en format HEX" },
                        },
                        {
                            name: "colors[].rgb",
                            type: "`string`",
                            description: { en: "Color in RGB format", fr: "Couleur en format RGB" },
                        },
                        {
                            name: "colors[].hsl",
                            type: "`string`",
                            description: { en: "Color in HSL format", fr: "Couleur en format HSL" },
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
                { type: "examples", op: "default", query: { color: "#ff6600", type: "triadic" } },
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
                            message: "A base color is required",
                            description: {
                                en: "The `color` parameter is missing",
                                fr: "Le paramètre `color` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "A palette type is required",
                            description: {
                                en: "The `type` parameter is missing",
                                fr: "Le paramètre `type` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid HEX color (use #RRGGBB)",
                            description: {
                                en: "The color format is invalid",
                                fr: "Le format de couleur est invalide",
                            },
                            status: 400,
                        },
                        {
                            message:
                                "Type must be one of: complementary, triadic, analogous, tetradic, split-complementary",
                            description: {
                                en: "Invalid palette type",
                                fr: "Type de palette invalide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
