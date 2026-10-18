import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "color",
    kind: "endpoint",
    title: { en: "Color Generation", fr: "Génération de couleur" },
    lead: {
        en: "The `/color` endpoint generates a color in multiple formats. You can provide a HEX color to convert, or omit it to get a random color.",
        fr: "L'endpoint `/color` génère une couleur en plusieurs formats. Vous pouvez fournir une couleur HEX à convertir, ou l'omettre pour obtenir une couleur aléatoire.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/color",
            try: true,
            params: [
                {
                    name: "hex",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#ff6600",
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
                            name: "hex",
                            required: false,
                            description: {
                                en: "A HEX color to convert (e.g. `ff6600`). Random if omitted",
                                fr: "Une couleur HEX à convertir (ex. `ff6600`). Aléatoire si omis",
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
                            name: "hex",
                            type: "`string`",
                            description: {
                                en: "Hexadecimal color code",
                                fr: "Code couleur hexadécimal",
                            },
                        },
                        {
                            name: "rgb",
                            type: "`string`",
                            description: { en: "RGB color format", fr: "Format couleur RGB" },
                        },
                        {
                            name: "hsl",
                            type: "`string`",
                            description: {
                                en: "HSL color format (Hue, Saturation, Lightness)",
                                fr: "Format couleur HSL (Teinte, Saturation, Luminosité)",
                            },
                        },
                        {
                            name: "hsv",
                            type: "`string`",
                            description: {
                                en: "HSV color format (Hue, Saturation, Value)",
                                fr: "Format couleur HSV (Teinte, Saturation, Valeur)",
                            },
                        },
                        {
                            name: "hwb",
                            type: "`string`",
                            description: {
                                en: "HWB color format (Hue, Whiteness, Blackness)",
                                fr: "Format couleur HWB (Teinte, Blancheur, Noirceur)",
                            },
                        },
                        {
                            name: "cmyk",
                            type: "`string`",
                            description: {
                                en: "CMYK color format (Cyan, Magenta, Yellow, Key/Black)",
                                fr: "Format couleur CMYK (Cyan, Magenta, Jaune, Noir)",
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
                { type: "examples", op: "default", query: { hex: "1a1a2e" } },
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
                            message: "Invalid HEX color (use #RRGGBB)",
                            description: {
                                en: "The `hex` parameter is not valid hex",
                                fr: "Le paramètre `hex` n'est pas un hex valide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
