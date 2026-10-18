import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "placeholder",
    kind: "endpoint",
    title: { en: "Placeholder", fr: "Placeholder" },
    lead: {
        en: "The `/placeholder` endpoint generates SVG placeholders: simple images or animated skeleton loaders.",
        fr: "L'endpoint `/placeholder` génère des placeholders SVG : images simples ou squelettes de chargement animés.",
    },
    updated: "2026-04-21",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/placeholder",
            try: true,
            params: [
                {
                    name: "type",
                    type: "enum",
                    in: "query",
                    required: true,
                    options: ["image", "skeleton"],
                },
                { name: "width", type: "number", in: "query", required: false, placeholder: "400" },
                {
                    name: "height",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "300",
                },
                {
                    name: "bg",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#cccccc",
                },
                {
                    name: "color",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#666666",
                },
                {
                    name: "text",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "400×300",
                },
                { name: "rows", type: "number", in: "query", required: false, placeholder: "3" },
                {
                    name: "avatar",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["true", "circle", "rounded", "square"],
                },
                { name: "lines", type: "number", in: "query", required: false, placeholder: "4" },
                {
                    name: "animate",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["shimmer", "pulse", "none"],
                },
                { name: "speed", type: "number", in: "query", required: false, placeholder: "1.5" },
                { name: "radius", type: "number", in: "query", required: false, placeholder: "8" },
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
                    columns: "default-after-description",
                    rows: [
                        {
                            name: "type",
                            required: true,
                            default: "—",
                            description: {
                                en: "`image` or `skeleton`",
                                fr: "`image` ou `skeleton`",
                            },
                        },
                        {
                            name: "width",
                            required: false,
                            default: "800",
                            description: {
                                en: "Width in pixels (1–4000)",
                                fr: "Largeur en pixels (1–4000)",
                            },
                        },
                        {
                            name: "height",
                            required: false,
                            default: "600",
                            description: {
                                en: "Height in pixels (1–4000)",
                                fr: "Hauteur en pixels (1–4000)",
                            },
                        },
                        {
                            name: "bg",
                            required: false,
                            default: "`#cccccc` / `#e5e5e5`",
                            description: {
                                en: "Background color (hex)",
                                fr: "Couleur de fond (hex)",
                            },
                        },
                        {
                            name: "color",
                            required: false,
                            default: "`#333333` / `#f5f5f5`",
                            description: {
                                en: "Text / highlight color (hex)",
                                fr: "Couleur texte / highlight (hex)",
                            },
                        },
                        {
                            name: "text",
                            required: false,
                            default: "`800×600`",
                            description: {
                                en: "Displayed text (`image` only)",
                                fr: "Texte affiché (`image` uniquement)",
                            },
                        },
                        {
                            name: "rows",
                            required: false,
                            default: "3",
                            description: {
                                en: "Number of lines (`skeleton` only, 0–20)",
                                fr: "Nombre de lignes (`skeleton` uniquement, 0–20)",
                            },
                        },
                        {
                            name: "avatar",
                            required: false,
                            default: "—",
                            description: {
                                en: "Avatar shape: `circle`, `rounded`, `square` or `true`",
                                fr: "Forme d'avatar : `circle`, `rounded`, `square` ou `true`",
                            },
                        },
                        {
                            name: "lines",
                            required: false,
                            default: "2",
                            description: {
                                en: "Text lines next to avatar (`skeleton` only)",
                                fr: "Lignes de texte à côté de l'avatar (`skeleton`)",
                            },
                        },
                        {
                            name: "animate",
                            required: false,
                            default: "`shimmer`",
                            description: {
                                en: "Animation: `shimmer`, `pulse`, `none`",
                                fr: "Animation : `shimmer`, `pulse`, `none`",
                            },
                        },
                        {
                            name: "speed",
                            required: false,
                            default: "1.5",
                            description: {
                                en: "Animation speed (0.1–10)",
                                fr: "Vitesse d'animation (0.1–10)",
                            },
                        },
                        {
                            name: "radius",
                            required: false,
                            default: "4",
                            description: {
                                en: "Border radius of blocks (0–50)",
                                fr: "Border radius des blocs (0–50)",
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
                                text: "The `bg` and `color` defaults differ between types: `image` uses `#cccccc`/`#333333`, `skeleton` uses `#e5e5e5`/`#f5f5f5`.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Les valeurs par défaut de `bg` et `color` diffèrent selon le type : `image` utilise `#cccccc`/`#333333`, `skeleton` utilise `#e5e5e5`/`#f5f5f5`.",
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
                        en: "The response is an `image/svg+xml` file for both types.",
                        fr: "La réponse est un fichier `image/svg+xml` pour les deux types.",
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
                    query: { type: "image", width: "400", height: "300", text: "Hello" },
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
                            message: "Type must be one of: image, skeleton",
                            description: {
                                en: "The `type` parameter is invalid",
                                fr: "Le paramètre `type` est invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "width must be a number",
                            description: {
                                en: "Width is not a valid number",
                                fr: "La largeur n'est pas un nombre valide",
                            },
                            status: 400,
                        },
                        {
                            message: "width must be between 1 and 4000",
                            description: {
                                en: "Width is out of range",
                                fr: "La largeur est hors limites",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid color (use hex like #ff6600)",
                            description: {
                                en: "A color parameter is malformed",
                                fr: "Un paramètre couleur est mal formaté",
                            },
                            status: 400,
                        },
                        {
                            message: "avatar must be one of: circle, rounded, square",
                            description: {
                                en: "Invalid avatar shape",
                                fr: "Forme d'avatar invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "animate must be one of: shimmer, pulse, none",
                            description: {
                                en: "Invalid animation mode",
                                fr: "Mode d'animation invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "speed must be between 0.1 and 10",
                            description: {
                                en: "Speed is out of range",
                                fr: "La vitesse est hors limites",
                            },
                            status: 400,
                        },
                        {
                            message: "radius must be between 0 and 50",
                            description: {
                                en: "Radius is out of range",
                                fr: "Le radius est hors limites",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
