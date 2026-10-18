import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "captcha",
    kind: "endpoint",
    title: { en: "Captcha Generation", fr: "Génération de captcha" },
    lead: {
        en: "The `/captcha` endpoint generates a CAPTCHA image. It offers two modes: `challenge`, the default, which keeps the answer server-side so it can be verified later, and `image`, which returns the answer alongside the picture.",
        fr: "L'endpoint `/captcha` génère une image CAPTCHA. Il propose deux modes : `challenge`, celui par défaut, qui garde la réponse côté serveur pour la vérifier ensuite, et `image`, qui retourne la réponse en même temps que l'image.",
    },
    updated: "2026-09-13",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/captcha",
            try: true,
            params: [
                {
                    name: "mode",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["image", "challenge"],
                },
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
        {
            id: "",
            blocks: [
                { type: "endpoint", op: "default" },
                {
                    type: "callout",
                    kind: "warning",
                    title: { en: "Changed in 6.0.0", fr: "Changement en 6.0.0" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "`challenge` is now the **default** mode: the image comes with a signed token in `X-Captcha-Token` instead of the answer in clear. Code that read `X-Captcha-Text` without passing `mode` will no longer find it — pass `?mode=image` to keep the previous behaviour.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "`challenge` est désormais le mode **par défaut** : l'image arrive avec un jeton signé dans `X-Captcha-Token` plutôt qu'avec la réponse en clair. Un code qui lisait `X-Captcha-Text` sans préciser `mode` ne la trouvera plus — passez `?mode=image` pour retrouver le comportement précédent.",
                            },
                        ],
                    },
                },
                {
                    type: "callout",
                    kind: "tip",
                    title: { en: "Prefer proof of work", fr: "Préférez la preuve de travail" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "A visual captcha no longer stops a determined bot: vision models read them well, often better than people do. For anti-bot protection, prefer **[/pow](ref:pow)**, which cannot be shortcut by a model — the only way through is to spend the computation.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Un captcha visuel n'arrête plus un robot déterminé : les modèles de vision les lisent bien, souvent mieux que les humains. Pour une protection anti-bot, préférez **[/pow](ref:pow)**, qu'aucun modèle ne peut contourner — le seul moyen de passer est de dépenser le calcul.",
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
                            name: "mode",
                            required: false,
                            description: {
                                en: "`challenge` (default) or `image`",
                                fr: "`challenge` (défaut) ou `image`",
                            },
                        },
                        {
                            name: "text",
                            required: false,
                            description: {
                                en: "The captcha text. If omitted, a random string is generated. Rejected in `challenge` mode",
                                fr: "Le texte du captcha. Si omis, une chaîne aléatoire est générée. Refusé en mode `challenge`",
                            },
                        },
                        {
                            name: "length",
                            required: false,
                            description: {
                                en: "Length of the auto-generated text, 1 to 20. Default: `6`",
                                fr: "Longueur du texte auto-généré, de 1 à 20. Par défaut : `6`",
                            },
                        },
                        {
                            name: "width",
                            required: false,
                            description: {
                                en: "Image width in pixels, 100 to 800. Default: 60 × the text length",
                                fr: "Largeur de l'image en pixels, de 100 à 800. Par défaut : 60 × la longueur du texte",
                            },
                        },
                        {
                            name: "height",
                            required: false,
                            description: {
                                en: "Image height in pixels, 50 to 400. Default: `120`",
                                fr: "Hauteur de l'image en pixels, de 50 à 400. Par défaut : `120`",
                            },
                        },
                        {
                            name: "noise",
                            required: false,
                            description: {
                                en: "Noise level: `low`, `medium` (default) or `high`",
                                fr: "Niveau de bruit : `low`, `medium` (défaut) ou `high`",
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
            id: "available-modes",
            level: 2,
            title: { en: "Available Modes", fr: "Modes disponibles" },
            aliases: ["modes-disponibles"],
            blocks: [
                {
                    type: "table",
                    head: { en: ["Mode", "Response"], fr: ["Mode", "Réponse"] },
                    rows: [
                        [
                            { en: "`challenge`", fr: "`image`" },
                            {
                                en: "PNG image, with a signed token in the `X-Captcha-Token` header — the answer is never sent",
                                fr: "Image PNG, avec la réponse dans l'en-tête `X-Captcha-Text`",
                            },
                        ],
                        [
                            { en: "`image`", fr: "`challenge`" },
                            {
                                en: "PNG image, with the answer in the `X-Captcha-Text` header",
                                fr: "Image PNG, avec un jeton signé dans l'en-tête `X-Captcha-Token` — la réponse n'est jamais transmise",
                            },
                        ],
                    ],
                    kind: "definition",
                },
                {
                    type: "p",
                    text: {
                        en: "Both modes return a PNG image (`Content-Type: image/png`), usable in an `<img>` tag.",
                        fr: "Les deux modes retournent une image PNG (`Content-Type: image/png`), utilisable dans une balise `<img>`.",
                    },
                },
                {
                    type: "p",
                    text: {
                        en: "In `challenge` mode the answer never leaves the server: it exists only inside the token's signature, so intercepting the response does not reveal it. The rendering is also hardened against automated reading — glyphs overlap so they cannot be segmented, ride a sine baseline, mix font families, and are crossed by strokes drawn in the text's own colors, which no filter can subtract. Send the token and the user's answer to [/v6/captcha](ref:captcha/verify) to check it.",
                        fr: "En mode `challenge`, la réponse ne quitte jamais le serveur : elle n'existe que dans la signature du jeton, donc intercepter la réponse ne la révèle pas. Le rendu est également durci contre la lecture automatique — les glyphes se chevauchent pour empêcher leur découpage, suivent une ligne de base sinusoïdale, mélangent plusieurs polices, et sont traversés par des traits de la couleur même du texte, qu'aucun filtre ne peut retirer. Envoyez le jeton et la réponse de l'utilisateur à [/v6/captcha](ref:captcha/verify) pour la vérifier.",
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
                                text: "Both headers are exposed to browser JavaScript through CORS, so a web page can read them from the response.",
                            },
                            {
                                type: "p",
                                text: "The auto-generated string avoids ambiguous characters (e.g. `0`/`O`, `1`/`l`).",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Les deux en-têtes sont exposés au JavaScript des navigateurs via CORS, donc une page web peut les lire dans la réponse.",
                            },
                            {
                                type: "p",
                                text: "La chaîne auto-générée évite les caractères ambigus (ex. `0`/`O`, `1`/`l`).",
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
                                text: "[See an example with auto-generated text](https://api.moxon.dev/v6/captcha?length=8&noise=high)",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "[Voir un exemple avec un texte auto-généré](https://api.moxon.dev/v6/captcha?length=8&noise=high)",
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
                            message: "Mode must be one of: image, challenge",
                            description: {
                                en: "The `mode` value is not valid",
                                fr: "La valeur de `mode` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "A custom text cannot be used in challenge mode",
                            description: {
                                en: "`text` was provided together with `mode=challenge`",
                                fr: "`text` a été fourni avec `mode=challenge`",
                            },
                            status: 400,
                        },
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
                                fr: "La `length` est hors de la plage autorisée",
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
                                fr: "La `width` est hors de la plage autorisée",
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
                                fr: "La `height` est hors de la plage autorisée",
                            },
                            status: 400,
                        },
                        {
                            message: "Noise must be one of: low, medium, high",
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
                                fr: "Un paramètre `bg` ou `color` est malformé",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
        {
            id: "related-endpoints",
            level: 2,
            title: { en: "Related Endpoints", fr: "Endpoints associés" },
            aliases: ["endpoints-associes"],
            blocks: [
                {
                    type: "related",
                    items: [
                        {
                            label: "/v6/captcha",
                            to: "captcha/verify",
                            description: {
                                en: "Verify a challenge answer",
                                fr: "Vérifier la réponse à un challenge",
                            },
                        },
                        {
                            label: "/v6/pow",
                            to: "pow",
                            description: {
                                en: "Proof of work, the recommended alternative",
                                fr: "Preuve de travail, l'alternative recommandée",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};
