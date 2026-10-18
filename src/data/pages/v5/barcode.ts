import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "barcode",
    kind: "endpoint",
    title: { en: "Barcode Generation", fr: "Génération de codes-barres" },
    lead: {
        en: "The `/barcode` endpoint generates barcode images from a data string. It supports several standard barcode formats and renders the result as SVG or PNG.",
        fr: "L'endpoint `/barcode` génère des images de codes-barres à partir d'une chaîne de données. Il supporte plusieurs formats standards et retourne le résultat en SVG ou PNG.",
    },
    updated: "2026-07-26",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/barcode",
            try: true,
            params: [
                {
                    name: "data",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "Hello123",
                },
                {
                    name: "type",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["code128", "ean13", "ean8", "upca", "code39"],
                },
                {
                    name: "format",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["svg", "png"],
                },
                { name: "width", type: "number", in: "query", required: false, placeholder: "2" },
                {
                    name: "height",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "100",
                },
                {
                    name: "color",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#000000",
                },
                {
                    name: "bg",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#ffffff",
                },
            ],
        },
    ],
    sections: [
        {
            id: "",
            blocks: [
                { type: "endpoint", op: "default" },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Format details", fr: "Détails des formats" },
                    body: {
                        en: [
                            {
                                type: "list",
                                items: [
                                    "**Code 128**: Encodes any printable ASCII character (codes 32–126).",
                                    "**EAN-13 / EAN-8 / UPC-A**: Numeric only. The check digit is computed automatically if omitted, or validated if provided.",
                                    "**Code 39**: Alphanumeric (`A-Z`, `0-9`, space, `- . $ / + %`). Input is auto-uppercased; start/stop characters are added automatically.",
                                ],
                            },
                        ],
                        fr: [
                            {
                                type: "list",
                                items: [
                                    "**Code 128** : Encode tout caractère ASCII imprimable (codes 32–126).",
                                    "**EAN-13 / EAN-8 / UPC-A** : Numérique uniquement. Le chiffre de contrôle est calculé automatiquement s'il est absent, ou validé s'il est fourni.",
                                    "**Code 39** : Alphanumérique (`A-Z`, `0-9`, espace, `- . $ / + %`). La saisie est automatiquement mise en majuscules ; les caractères de début/fin sont ajoutés automatiquement.",
                                ],
                            },
                        ],
                    },
                },
            ],
        },
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
                            name: "data",
                            required: true,
                            default: "",
                            description: {
                                en: "Data string to encode in the barcode",
                                fr: "Chaîne de données à encoder dans le code-barres",
                            },
                        },
                        {
                            name: "type",
                            required: false,
                            default: "`code128`",
                            description: {
                                en: "Barcode format: `code128`, `ean13`, `ean8`, `upca`, `code39`",
                                fr: "Format du code-barres : `code128`, `ean13`, `ean8`, `upca`, `code39`",
                            },
                        },
                        {
                            name: "format",
                            required: false,
                            default: "`svg`",
                            description: {
                                en: "Output format: `svg` or `png`",
                                fr: "Format de sortie : `svg` ou `png`",
                            },
                        },
                        {
                            name: "width",
                            required: false,
                            default: "`2`",
                            description: {
                                en: "Bar unit width in pixels (1–5)",
                                fr: "Largeur unitaire des barres en pixels (1–5)",
                            },
                        },
                        {
                            name: "height",
                            required: false,
                            default: "`100`",
                            description: {
                                en: "Bar height in pixels (50–300)",
                                fr: "Hauteur des barres en pixels (50–300)",
                            },
                        },
                        {
                            name: "color",
                            required: false,
                            default: "`#000000`",
                            description: {
                                en: "Bar color in hexadecimal (e.g. `000000`)",
                                fr: "Couleur des barres en hexadécimal (ex. `000000`)",
                            },
                        },
                        {
                            name: "bg",
                            required: false,
                            default: "`#ffffff`",
                            description: {
                                en: "Background color in hexadecimal (e.g. `ffffff`)",
                                fr: "Couleur de fond en hexadécimal (ex. `ffffff`)",
                            },
                        },
                    ],
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
                    type: "p",
                    text: {
                        en: "By default (`format=svg`), the endpoint returns an **inline SVG image** (`Content-Type: image/svg+xml`), usable in an `<img>` tag:",
                        fr: "Par défaut (`format=svg`), l'endpoint retourne une **image SVG inline** (`Content-Type: image/svg+xml`), utilisable dans une balise `<img>` :",
                    },
                },
                {
                    type: "code",
                    lang: "html",
                    text: {
                        en: '<img src="https://api.moxon.dev/v5/barcode?data=Hello123" alt="Barcode" />',
                        fr: '<img src="https://api.moxon.dev/v5/barcode?data=Hello123" alt="Code-barres" />',
                    },
                },
                {
                    type: "p",
                    text: {
                        en: "With `format=png`, the response is a raw PNG buffer (`Content-Type: image/png`):",
                        fr: "Avec `format=png`, la réponse est un buffer PNG brut (`Content-Type: image/png`) :",
                    },
                },
                {
                    type: "code",
                    lang: "html",
                    text: {
                        en: '<img src="https://api.moxon.dev/v5/barcode?data=Hello123&format=png" alt="Barcode" />',
                        fr: '<img src="https://api.moxon.dev/v5/barcode?data=Hello123&format=png" alt="Code-barres" />',
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
                { type: "examples", op: "default", query: { data: "Hello123", type: "code128" } },
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
                    type: "errors",
                    rows: [
                        {
                            message: "Please provide data to encode (?data={string})",
                            description: {
                                en: "The `data` parameter is missing",
                                fr: "Le paramètre `data` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Type must be one of: code128, ean13, ean8, upca, code39",
                            description: {
                                en: "The `type` value is not valid",
                                fr: "La valeur de `type` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Format must be one of: svg, png",
                            description: {
                                en: "The `format` value is not valid",
                                fr: "La valeur de `format` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Width must be between 1 and 5",
                            description: {
                                en: "The `width` parameter is out of the allowed range",
                                fr: "Le paramètre `width` est hors de la plage autorisée",
                            },
                            status: 400,
                        },
                        {
                            message: "Height must be between 50 and 300",
                            description: {
                                en: "The `height` parameter is out of the allowed range",
                                fr: "Le paramètre `height` est hors de la plage autorisée",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide valid dimensions (&width={px}&height={px})",
                            description: {
                                en: "The `width` or `height` parameter is not a valid number",
                                fr: "Le paramètre `width` ou `height` n'est pas un nombre valide",
                            },
                            status: 400,
                        },
                        {
                            message: 'Code 128 only supports ASCII 32-126 (invalid char: "{ch}")',
                            description: {
                                en: "A character in `data` is outside the Code 128 supported range",
                                fr: "Un caractère dans `data` est hors de la plage Code 128 supportée",
                            },
                            status: 400,
                        },
                        {
                            message: "EAN-13 requires 12 or 13 digits",
                            description: {
                                en: "The `data` string does not have the correct number of digits",
                                fr: "La chaîne `data` n'a pas le bon nombre de chiffres",
                            },
                            status: 400,
                        },
                        {
                            message:
                                "Invalid EAN-13 check digit (expected {expected}, got {actual})",
                            description: {
                                en: "The provided EAN-13 check digit does not match the computed value",
                                fr: "Le chiffre de contrôle EAN-13 fourni ne correspond pas à la valeur calculée",
                            },
                            status: 400,
                        },
                        {
                            message: "EAN-8 requires 7 or 8 digits",
                            description: {
                                en: "The `data` string does not have the correct number of digits",
                                fr: "La chaîne `data` n'a pas le bon nombre de chiffres",
                            },
                            status: 400,
                        },
                        {
                            message:
                                "Invalid EAN-8 check digit (expected {expected}, got {actual})",
                            description: {
                                en: "The provided EAN-8 check digit does not match the computed value",
                                fr: "Le chiffre de contrôle EAN-8 fourni ne correspond pas à la valeur calculée",
                            },
                            status: 400,
                        },
                        {
                            message: "UPC-A requires 11 or 12 digits",
                            description: {
                                en: "The `data` string does not have the correct number of digits",
                                fr: "La chaîne `data` n'a pas le bon nombre de chiffres",
                            },
                            status: 400,
                        },
                        {
                            message:
                                'Code 39 invalid character: "{ch}". Allowed: A-Z, 0-9, space, - . $ / + %',
                            description: {
                                en: "A character in `data` is not allowed in Code 39",
                                fr: "Un caractère dans `data` n'est pas autorisé en Code 39",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid color (use hex like ff6600)",
                            description: {
                                en: "A `color` or `bg` value is not a valid hexadecimal color",
                                fr: "Une valeur `color` ou `bg` n'est pas une couleur hexadécimale valide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
