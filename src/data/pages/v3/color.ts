import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "color",
    kind: "endpoint",
    title: { en: "Color Generation", fr: "Génération de couleur" },
    lead: {
        en: "The `/color` endpoint generates a random color in multiple formats. This endpoint does not require any options.",
        fr: "L'endpoint `/color` génère une couleur aléatoire en plusieurs formats. Cet endpoint ne nécessite aucune option.",
    },
    updated: "2026-04-08",
    operations: [{ id: "default", method: "get", path: "/color", try: false, params: [] }],
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
                        en: "This endpoint does not require any parameters.",
                        fr: "Cet endpoint ne nécessite aucun paramètre.",
                    },
                },
            ],
        },
        {
            id: "request-example",
            level: 2,
            title: { en: "Request Example", fr: "Exemple de requête" },
            aliases: ["exemple-de-requete"],
            blocks: [{ type: "code", text: "GET /v3/color", role: "request" }],
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
                    text: '{\n    "hex": "#517fff",\n    "rgb": "rgb(81, 127, 255)",\n    "hsl": "hsl(224, 100%, 66%)",\n    "hsv": "hsv(224, 68.2%, 100%)",\n    "hwb": "hwb(224, 32%, 0%)",\n    "cmyk": "cmyk(68.24%, 50.2%, 0%, 0%)"\n}',
                    role: "response",
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
                    type: "table",
                    head: { en: ["Field", "Description"], fr: ["Champ", "Description"] },
                    rows: [
                        ["`hex`", { en: "Hexadecimal color code", fr: "Code couleur hexadécimal" }],
                        ["`rgb`", { en: "RGB color format", fr: "Format couleur RGB" }],
                        [
                            "`hsl`",
                            {
                                en: "HSL color format (Hue, Saturation, Lightness)",
                                fr: "Format couleur HSL (Teinte, Saturation, Luminosité)",
                            },
                        ],
                        [
                            "`hsv`",
                            {
                                en: "HSV color format (Hue, Saturation, Value)",
                                fr: "Format couleur HSV (Teinte, Saturation, Valeur)",
                            },
                        ],
                        [
                            "`hwb`",
                            {
                                en: "HWB color format (Hue, Whiteness, Blackness)",
                                fr: "Format couleur HWB (Teinte, Blancheur, Noirceur)",
                            },
                        ],
                        [
                            "`cmyk`",
                            {
                                en: "CMYK color format (Cyan, Magenta, Yellow, Key/Black)",
                                fr: "Format couleur CMYK (Cyan, Magenta, Jaune, Noir)",
                            },
                        ],
                    ],
                    kind: "definition",
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
                    text: 'curl -X GET "https://api.moxon.dev/v3/color"',
                    role: "curl",
                },
            ],
        },
    ],
};
