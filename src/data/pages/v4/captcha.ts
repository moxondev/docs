import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "captcha",
    kind: "endpoint",
    title: { en: "Captcha Generation", fr: "Génération de Captcha" },
    lead: {
        en: "The `/captcha` endpoint generates a CAPTCHA image. You can provide your own text or let the API generate a random one automatically.",
        fr: "L'endpoint `/captcha` génère une image CAPTCHA. Vous pouvez fournir votre propre texte ou laisser l'API en générer un aléatoirement.",
    },
    updated: "2026-04-21",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/captcha",
            try: true,
            params: [
                {
                    name: "text",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "abc123",
                },
                { name: "length", type: "number", in: "query", required: false, placeholder: "6" },
                { name: "width", type: "number", in: "query", required: false, placeholder: "360" },
                {
                    name: "height",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "120",
                },
                {
                    name: "noise",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["low", "medium", "high"],
                },
                {
                    name: "bg",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#ffffff",
                },
                {
                    name: "color",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#000000",
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
                            name: "text",
                            required: false,
                            description: {
                                en: "The captcha text. If omitted, a random string is generated",
                                fr: "Le texte du captcha. Si omis, une chaîne aléatoire est générée",
                            },
                        },
                        {
                            name: "length",
                            required: false,
                            description: {
                                en: "Length of the auto-generated text (default 6)",
                                fr: "Longueur du texte auto-généré (défaut 6)",
                            },
                        },
                        {
                            name: "width",
                            required: false,
                            description: {
                                en: "Image width in pixels (default 300)",
                                fr: "Largeur de l'image en pixels (défaut 300)",
                            },
                        },
                        {
                            name: "height",
                            required: false,
                            description: {
                                en: "Image height in pixels (default 150)",
                                fr: "Hauteur de l'image en pixels (défaut 150)",
                            },
                        },
                        {
                            name: "noise",
                            required: false,
                            description: {
                                en: "Number of noise lines (default 5)",
                                fr: "Nombre de lignes de bruit (défaut 5)",
                            },
                        },
                        {
                            name: "bg",
                            required: false,
                            description: {
                                en: "Background color in hexadecimal (e.g. `ffffff`)",
                                fr: "Couleur de fond en hexadécimal (ex. `ffffff`)",
                            },
                        },
                        {
                            name: "color",
                            required: false,
                            description: {
                                en: "Text color in hexadecimal (e.g. `000000`)",
                                fr: "Couleur du texte en hexadécimal (ex. `000000`)",
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
                        en: "The endpoint returns a PNG image of the generated captcha.",
                        fr: "L'endpoint retourne une image PNG du captcha généré.",
                    },
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Good to know", fr: "À savoir" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "The response includes an `X-Captcha-Text` header containing the captcha answer, useful for server-side verification. When no `text` is provided, the auto-generated string avoids ambiguous characters (e.g. `0`/`O`, `1`/`l`).",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "La réponse inclut un header `X-Captcha-Text` contenant la réponse du captcha, utile pour la vérification côté serveur. Lorsqu'aucun `text` n'est fourni, la chaîne auto-générée évite les caractères ambigus (ex. `0`/`O`, `1`/`l`).",
                            },
                        ],
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
                    query: { length: "8", width: "400", noise: "high", bg: "f0f0f0" },
                },
                {
                    type: "callout",
                    kind: "tip",
                    title: { en: "Example", fr: "Exemple" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "[See an example with auto-generated text](https://api.moxon.dev/v4/captcha?length=8&noise=high)",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "[Voir un exemple avec texte auto-généré](https://api.moxon.dev/v4/captcha?length=8&noise=high)",
                            },
                        ],
                    },
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
                            message: "length must be a number",
                            description: {
                                en: "The `length` parameter is not a number",
                                fr: "Le paramètre `length` n'est pas un nombre",
                            },
                            status: 400,
                        },
                        {
                            message: "length must be between 1 and 20",
                            description: {
                                en: "The `length` is out of range",
                                fr: "La `length` est hors limites",
                            },
                            status: 400,
                        },
                        {
                            message: "width must be a number",
                            description: {
                                en: "The `width` parameter is not a number",
                                fr: "Le paramètre `width` n'est pas un nombre",
                            },
                            status: 400,
                        },
                        {
                            message: "width must be between 100 and 800",
                            description: {
                                en: "The `width` is out of range",
                                fr: "La `width` est hors limites",
                            },
                            status: 400,
                        },
                        {
                            message: "height must be a number",
                            description: {
                                en: "The `height` parameter is not a number",
                                fr: "Le paramètre `height` n'est pas un nombre",
                            },
                            status: 400,
                        },
                        {
                            message: "height must be between 50 and 400",
                            description: {
                                en: "The `height` is out of range",
                                fr: "La `height` est hors limites",
                            },
                            status: 400,
                        },
                        {
                            message: "noise must be one of: low, medium, high",
                            description: {
                                en: "Invalid `noise` value",
                                fr: "Valeur de `noise` invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid color (use hex like ff6600)",
                            description: {
                                en: "A `bg` or `color` parameter is malformed",
                                fr: "Un paramètre `bg` ou `color` est mal formaté",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
