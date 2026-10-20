import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "avatar",
    kind: "endpoint",
    title: { en: "Avatar Generation", fr: "Génération d'avatars" },
    lead: {
        en: "The `/avatar` endpoint generates deterministic avatar images from a seed string. The same seed always produces the same image, making it useful for consistent user representations.",
        fr: "L'endpoint `/avatar` génère des images d'avatars déterministes à partir d'une chaîne seed. Le même seed produit toujours la même image, ce qui permet des représentations d'utilisateurs cohérentes.",
    },
    updated: "2026-05-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/avatar",
            try: true,
            params: [
                {
                    name: "seed",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "moxon",
                },
                {
                    name: "type",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["identicon", "pixel"],
                },
                {
                    name: "format",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["png", "svg"],
                },
                { name: "size", type: "number", in: "query", required: false, placeholder: "200" },
                {
                    name: "bg",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "#f0f0f0",
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
                            name: "seed",
                            required: false,
                            default: { en: "random UUID", fr: "UUID aléatoire" },
                            description: {
                                en: "Seed string for deterministic generation — same seed, same image",
                                fr: "Chaîne seed pour la génération déterministe — même seed, même image",
                            },
                        },
                        {
                            name: "type",
                            required: false,
                            default: "`identicon`",
                            description: {
                                en: "Avatar type: `identicon` (5×5 symmetric grid) or `pixel` (8×8 grid)",
                                fr: "Type d'avatar : `identicon` (grille symétrique 5×5) ou `pixel` (grille 8×8)",
                            },
                        },
                        {
                            name: "format",
                            required: false,
                            default: "`png`",
                            description: {
                                en: "Output format: `png` or `svg`",
                                fr: "Format de sortie : `png` ou `svg`",
                            },
                        },
                        {
                            name: "size",
                            required: false,
                            default: "`200`",
                            description: {
                                en: "Image size in pixels (50–2000)",
                                fr: "Taille de l'image en pixels (50–2000)",
                            },
                        },
                        {
                            name: "bg",
                            required: false,
                            default: "`#f0f0f0`",
                            description: {
                                en: "Background color in hexadecimal (e.g. `f0f0f0`)",
                                fr: "Couleur de fond en hexadécimal (ex. `f0f0f0`)",
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
                        en: "By default (`format=png`), the endpoint returns a **direct PNG image** (`Content-Type: image/png`), usable in an `<img>` tag:",
                        fr: "Par défaut (`format=png`), l'endpoint retourne une **image PNG directe** (`Content-Type: image/png`), utilisable dans une balise `<img>` :",
                    },
                },
                {
                    type: "code",
                    lang: "html",
                    text: '<img src="https://api.moxon.dev/v4/avatar?seed=alice" alt="Avatar" />',
                },
                {
                    type: "p",
                    text: {
                        en: "With `format=svg`, the response is an inline SVG (`Content-Type: image/svg+xml`):",
                        fr: "Avec `format=svg`, la réponse est un SVG inline (`Content-Type: image/svg+xml`) :",
                    },
                },
                {
                    type: "code",
                    lang: "html",
                    text: '<img src="https://api.moxon.dev/v4/avatar?seed=alice&format=svg" alt="Avatar" />',
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
                    query: { seed: "moxon", type: "identicon", size: "200" },
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
                    type: "errors",
                    rows: [
                        {
                            message: "Size must be between 50 and 2000",
                            description: {
                                en: "The `size` parameter is out of the allowed range",
                                fr: "Le paramètre `size` est hors de la plage autorisée",
                            },
                            status: 400,
                        },
                        {
                            message: "Type must be one of: identicon, pixel",
                            description: {
                                en: "The `type` value is not valid",
                                fr: "La valeur de `type` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Format must be one of: png, svg",
                            description: {
                                en: "The `format` value is not valid",
                                fr: "La valeur de `format` n'est pas valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid color (use hex like ff6600)",
                            description: {
                                en: "The `bg` color is not a valid hexadecimal value",
                                fr: "La couleur `bg` n'est pas une valeur hexadécimale valide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
