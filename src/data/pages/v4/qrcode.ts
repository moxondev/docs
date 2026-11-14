import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "qrcode",
    kind: "endpoint",
    title: { en: "QR Code Generation", fr: "Génération de QR Code" },
    lead: {
        en: "The `/qrcode` endpoint generates a QR Code from a URL provided as a parameter. This endpoint is useful for quickly generating an image in PNG format.",
        fr: "L'endpoint `/qrcode` génère un QR Code à partir d'une URL fournie en paramètre. Cet endpoint est pratique pour générer rapidement une image au format PNG.",
    },
    updated: "2026-11-14",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/qrcode",
            try: true,
            params: [
                {
                    name: "url",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "https://example.com",
                },
                {
                    name: "format",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["png", "base64"],
                },
                { name: "size", type: "number", in: "query", required: false, placeholder: "300" },
                { name: "margin", type: "number", in: "query", required: false, placeholder: "2" },
                {
                    name: "correction",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["L", "M", "Q", "H"],
                },
                {
                    name: "dark",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#000000",
                },
                {
                    name: "light",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#ffffff",
                },
                {
                    name: "icon",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "https://example.com/icon.png",
                },
                {
                    name: "iconSize",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "50",
                },
                {
                    name: "iconPadding",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "4",
                },
                {
                    name: "iconRadius",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "8",
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
                            name: "url",
                            required: true,
                            description: {
                                en: "The URL to encode in the QR Code. Must contain the full address",
                                fr: "L'URL à encoder dans le QR Code. Doit contenir l'adresse complète",
                            },
                        },
                        {
                            name: "format",
                            required: false,
                            description: {
                                en: "Response format: `png` (default, direct image) or `base64` (JSON data URL)",
                                fr: "Format de réponse : `png` (défaut, image directe) ou `base64` (data URL en JSON)",
                            },
                        },
                        {
                            name: "size",
                            required: false,
                            description: {
                                en: "Image size in pixels (50-2000, default 200)",
                                fr: "Taille de l'image en pixels (50-2000, défaut 200)",
                            },
                        },
                        {
                            name: "margin",
                            required: false,
                            description: {
                                en: "Quiet zone in modules (0-10, default 4)",
                                fr: "Zone de silence en modules (0-10, défaut 4)",
                            },
                        },
                        {
                            name: "correction",
                            required: false,
                            description: {
                                en: "Error correction level: `L`, `M`, `Q` or `H` (default `M`)",
                                fr: "Niveau de correction d'erreur : `L`, `M`, `Q` ou `H` (défaut `M`)",
                            },
                        },
                        {
                            name: "dark",
                            required: false,
                            description: {
                                en: "Module color in hexadecimal (e.g. `000000`)",
                                fr: "Couleur des modules en hexadécimal (ex. `000000`)",
                            },
                        },
                        {
                            name: "light",
                            required: false,
                            description: {
                                en: "Background color in hexadecimal (e.g. `ffffff`)",
                                fr: "Couleur de fond en hexadécimal (ex. `ffffff`)",
                            },
                        },
                        {
                            name: "icon",
                            required: false,
                            description: {
                                en: "HTTPS URL of a public image to overlay at the center of the QR Code (2MB and 16 megapixels at most)",
                                fr: "URL HTTPS d'une image publique à superposer au centre du QR Code (2 Mo et 16 mégapixels au maximum)",
                            },
                        },
                        {
                            name: "iconSize",
                            required: false,
                            description: {
                                en: "Icon size in pixels (default 20% of `size`, max 40% of `size`)",
                                fr: "Taille de l'icône en pixels (défaut 20% de `size`, max 40% de `size`)",
                            },
                        },
                        {
                            name: "iconPadding",
                            required: false,
                            description: {
                                en: "White padding around the icon in pixels (default 5, 0-50)",
                                fr: "Padding blanc autour de l'icône en pixels (défaut 5, 0-50)",
                            },
                        },
                        {
                            name: "iconRadius",
                            required: false,
                            description: {
                                en: "Border radius of the icon background in pixels (default 0, max = perfect circle)",
                                fr: "Arrondi des coins du fond de l'icône en pixels (défaut 0, max = cercle parfait)",
                            },
                        },
                    ],
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Good to know", fr: "À savoir" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "When an `icon` is provided, the error correction level is automatically set to `H` to ensure readability. The icon URL must use HTTPS, with a 5s timeout and a 2MB size limit.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Lorsqu'un `icon` est fourni, le niveau de correction est automatiquement forcé à `H` pour garantir la lisibilité. L'URL de l'icône doit utiliser HTTPS, avec un timeout de 5s et une limite de 2 Mo.",
                            },
                        ],
                    },
                },
                {
                    type: "callout",
                    kind: "info",
                    title: {
                        en: "Limits on the icon download",
                        fr: "Limites du téléchargement de l'icône",
                    },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Since 6.2.0, the icon is downloaded through a protected fetch. A request with a regular icon gets exactly the same response as before; only abusive inputs are refused with the usual `400` error:",
                            },
                            {
                                type: "list",
                                items: [
                                    "The icon address, and every redirect it goes through, must use HTTPS and point to a public host: private, loopback and other internal addresses are refused.",
                                    "At most 10 redirects are followed.",
                                    "The whole download, redirects included, must finish within 5 seconds.",
                                    "The icon must not exceed 2MB once decompressed.",
                                    "A PNG, JPEG, GIF or BMP icon over 16 megapixels is refused, whatever its file size (the frames of a GIF add up).",
                                ],
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Depuis la 6.2.0, l'icône est téléchargée par une récupération protégée. Une requête avec une icône ordinaire reçoit exactement la même réponse qu'avant ; seules les entrées abusives sont refusées avec l'erreur `400` habituelle :",
                            },
                            {
                                type: "list",
                                items: [
                                    "L'adresse de l'icône, et chaque redirection qu'elle traverse, doit utiliser HTTPS et pointer vers un hôte public : les adresses privées, de bouclage et autres adresses internes sont refusées.",
                                    "Au plus 10 redirections sont suivies.",
                                    "Le téléchargement entier, redirections comprises, doit se terminer en 5 secondes.",
                                    "L'icône ne doit pas dépasser 2 Mo une fois décompressée.",
                                    "Une icône PNG, JPEG, GIF ou BMP de plus de 16 mégapixels est refusée, quel que soit le poids du fichier (les images d'un GIF s'additionnent).",
                                ],
                            },
                        ],
                    },
                },
                {
                    type: "callout",
                    kind: "tip",
                    title: { en: "Keep the icon small", fr: "Garder l'icône petite" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "A large `iconSize` combined with generous `iconPadding` covers more QR Code modules, making it harder to scan. Keep the icon + padding area well below 40% of the total `size` for reliable results.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Un `iconSize` élevé combiné à un `iconPadding` généreux recouvre davantage de modules du QR Code, le rendant difficile à scanner. Gardez la zone icône + padding bien en dessous de 40% de la `size` totale pour un résultat fiable.",
                            },
                        ],
                    },
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
                        en: "By default (`format=png`), the endpoint returns a **direct PNG image** (`Content-Type: image/png`), usable in an `<img>` tag:",
                        fr: "Par défaut (`format=png`), l'endpoint retourne une **image PNG directe** (`Content-Type: image/png`), utilisable dans une balise `<img>` :",
                    },
                },
                {
                    type: "code",
                    lang: "html",
                    text: '<img src="https://api.moxon.dev/v4/qrcode?url=https://moxon.dev" alt="QR Code" />',
                },
                {
                    type: "p",
                    text: {
                        en: "With `format=base64`, the response is a JSON object:",
                        fr: "Avec `format=base64`, la réponse est un objet JSON :",
                    },
                },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "result",
                            type: "`string`",
                            description: {
                                en: "Base64 PNG data URI of the QR Code",
                                fr: "URI data base64 de l'image PNG du QR Code",
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
                    query: {
                        url: "https://moxon.dev",
                        size: "300",
                        margin: "2",
                        dark: "1a1a2e",
                        light: "eaeaea",
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
                            message: "Please provide a valid URL",
                            description: {
                                en: "The `url` parameter is missing or invalid",
                                fr: "Le paramètre `url` est manquant ou invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "format must be one of: png, base64",
                            description: {
                                en: "Invalid `format` value",
                                fr: "Valeur de `format` invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "size must be a number",
                            description: {
                                en: "The `size` parameter is not a number",
                                fr: "Le paramètre `size` n'est pas un nombre",
                            },
                            status: 400,
                        },
                        {
                            message: "size must be between 50 and 2000",
                            description: {
                                en: "The `size` is out of range",
                                fr: "La `size` est hors limites",
                            },
                            status: 400,
                        },
                        {
                            message: "margin must be a number",
                            description: {
                                en: "The `margin` parameter is not a number",
                                fr: "Le paramètre `margin` n'est pas un nombre",
                            },
                            status: 400,
                        },
                        {
                            message: "margin must be between 0 and 10",
                            description: {
                                en: "The `margin` is out of range",
                                fr: "La `margin` est hors limites",
                            },
                            status: 400,
                        },
                        {
                            message: "correction must be one of: L, M, Q, H",
                            description: {
                                en: "Invalid error correction level",
                                fr: "Niveau de correction invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid color (use hex like ff6600)",
                            description: {
                                en: "A `dark` or `light` color is malformed",
                                fr: "Une couleur `dark` ou `light` est mal formatée",
                            },
                            status: 400,
                        },
                        {
                            message: "Icon URL must use HTTPS",
                            description: {
                                en: "The `icon` URL, or one of its redirects, does not use HTTPS",
                                fr: "L'URL de l'`icon`, ou l'une de ses redirections, n'utilise pas HTTPS",
                            },
                            status: 400,
                        },
                        {
                            message: "Failed to fetch icon: HTTP {status}",
                            description: {
                                en: "The icon URL returned a non-OK response",
                                fr: "L'URL de l'icône a retourné une erreur",
                            },
                            status: 400,
                        },
                        {
                            message: "Icon URL must point to an image",
                            description: {
                                en: "The icon content-type is not an image",
                                fr: "Le content-type de l'icône n'est pas une image",
                            },
                            status: 400,
                        },
                        {
                            message: "Icon must be under 2MB",
                            description: {
                                en: "The icon exceeds the 2MB size limit",
                                fr: "L'icône dépasse la limite de 2 Mo",
                            },
                            status: 400,
                        },
                        {
                            message: "iconSize must be a number",
                            description: {
                                en: "The `iconSize` parameter is not a number",
                                fr: "Le paramètre `iconSize` n'est pas un nombre",
                            },
                            status: 400,
                        },
                        {
                            message: "iconSize must be between 10 and {max}",
                            description: {
                                en: "The `iconSize` is out of range (max = 40% of size)",
                                fr: "La `iconSize` est hors limites (max = 40% de size)",
                            },
                            status: 400,
                        },
                        {
                            message: "iconPadding must be a number",
                            description: {
                                en: "The `iconPadding` parameter is not a number",
                                fr: "Le paramètre `iconPadding` n'est pas un nombre",
                            },
                            status: 400,
                        },
                        {
                            message: "iconPadding must be between 0 and 50",
                            description: {
                                en: "The `iconPadding` is out of range",
                                fr: "La `iconPadding` est hors limites",
                            },
                            status: 400,
                        },
                        {
                            message: "iconRadius must be a number",
                            description: {
                                en: "The `iconRadius` parameter is not a number",
                                fr: "Le paramètre `iconRadius` n'est pas un nombre",
                            },
                            status: 400,
                        },
                        {
                            message: "iconRadius must be between 0 and {max}",
                            description: {
                                en: "The `iconRadius` is out of range",
                                fr: "Le `iconRadius` est hors limites",
                            },
                            status: 400,
                        },
                        {
                            message: "Icon URL must point to a public host",
                            description: {
                                en: "The `icon` URL, or one of its redirects, points to a private or internal address",
                                fr: "L'URL de l'`icon`, ou l'une de ses redirections, pointe vers une adresse privée ou interne",
                            },
                            status: 400,
                        },
                        {
                            message: "Icon must be under 16 megapixels",
                            description: {
                                en: "The icon is a PNG, JPEG, GIF or BMP image of more than 16 megapixels",
                                fr: "L'icône est une image PNG, JPEG, GIF ou BMP de plus de 16 mégapixels",
                            },
                            status: 400,
                        },
                        {
                            message: "Icon must be a valid image",
                            description: {
                                en: "The header of a PNG, JPEG, GIF or BMP icon cannot be read",
                                fr: "L'en-tête d'une icône PNG, JPEG, GIF ou BMP est illisible",
                            },
                            status: 400,
                        },
                        {
                            message: "fetch failed",
                            description: {
                                en: "The icon could not be downloaded: network error, host that does not resolve, or more than 10 redirects",
                                fr: "L'icône n'a pas pu être téléchargée : erreur réseau, hôte introuvable ou plus de 10 redirections",
                            },
                            status: 400,
                        },
                        {
                            message: "The operation was aborted due to timeout",
                            description: {
                                en: "The icon download took more than 5 seconds, redirects included",
                                fr: "Le téléchargement de l'icône a pris plus de 5 secondes, redirections comprises",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
