import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "regex",
    kind: "endpoint",
    title: { en: "Regex Tester", fr: "Testeur de regex" },
    lead: {
        en: "The `/regex` endpoint tests a regular expression pattern against a text string and returns structured match results including capture groups and named groups.",
        fr: "L'endpoint `/regex` teste un pattern d'expression régulière contre une chaîne de texte et retourne les correspondances structurées avec leurs groupes capturants et groupes nommés.",
    },
    updated: "2026-11-14",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/regex",
            try: true,
            params: [
                {
                    name: "pattern",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "\\d+",
                },
                {
                    name: "text",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "Order 42 and item 7",
                },
                { name: "flags", type: "string", in: "query", required: false, placeholder: "i" },
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
                    kind: "tip",
                    title: { en: "Use Cases", fr: "Cas d'utilisation" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Validate regex patterns during development, extract structured data from raw text, debug complex capture groups, or build regex-powered search previews without running server-side code.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Validez des patterns regex lors du développement, extrayez des données structurées depuis du texte brut, déboguez des groupes capturants complexes, ou construisez des aperçus de recherche basés sur des regex sans exécuter de code côté serveur.",
                            },
                        ],
                    },
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Bounded evaluation", fr: "Évaluation bornée" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Since 6.2.0, a pattern that runs for more than 25 ms (compilation and matching included) is interrupted and refused with a `400` error, which stops patterns that backtrack catastrophically, such as nested quantifiers on a long text. A `pattern` or `text` parameter given more than once is refused like a missing one. The other limits are unchanged. A legitimate request gets the same response as before.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Depuis la 6.2.0, un pattern dont l'exécution dépasse 25 ms (compilation et recherche comprises) est interrompu et refusé avec une erreur `400`, ce qui arrête les patterns à retour arrière catastrophique, comme les quantificateurs imbriqués sur un long texte. Un paramètre `pattern` ou `text` fourni plusieurs fois est refusé comme un paramètre manquant. Les autres limites sont inchangées. Une requête légitime reçoit la même réponse qu'avant.",
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
                            name: "pattern",
                            required: true,
                            description: {
                                en: "The regular expression pattern to test (max 200 characters). Its evaluation is interrupted after 25 ms. Give the parameter once only.",
                                fr: "Le pattern d'expression régulière à tester (max 200 caractères). Son exécution est interrompue après 25 ms. Ne fournissez le paramètre qu'une seule fois.",
                            },
                        },
                        {
                            name: "text",
                            required: true,
                            description: {
                                en: "The text to test the pattern against (max 1000 characters). Give the parameter once only.",
                                fr: "Le texte à tester contre le pattern (max 1000 caractères). Ne fournissez le paramètre qu'une seule fois.",
                            },
                        },
                        {
                            name: "flags",
                            required: false,
                            description: {
                                en: "Regex flags to apply. Accepted: `i`, `m`, `s`, `u`. The `g` flag is always applied.",
                                fr: "Flags regex à appliquer. Acceptés : `i`, `m`, `s`, `u`. Le flag `g` est toujours appliqué.",
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
                            name: "valid",
                            type: "`boolean`",
                            description: {
                                en: "`true` if the pattern is a valid regex",
                                fr: "`true` si le pattern est une regex valide",
                            },
                        },
                        {
                            name: "pattern",
                            type: "`string`",
                            description: {
                                en: "The pattern as provided",
                                fr: "Le pattern tel que fourni",
                            },
                        },
                        {
                            name: "flags",
                            type: "`string`",
                            description: {
                                en: "The effective flags used (always includes `g`)",
                                fr: "Les flags effectifs utilisés (inclut toujours `g`)",
                            },
                        },
                        {
                            name: "count",
                            type: "`number`",
                            description: {
                                en: "Total number of matches found",
                                fr: "Nombre total de correspondances trouvées",
                            },
                        },
                        {
                            name: "matches",
                            type: "`object[]`",
                            description: {
                                en: "Array of match objects",
                                fr: "Tableau des objets de correspondance",
                            },
                        },
                        {
                            name: "matches[].match",
                            type: "`string`",
                            description: {
                                en: "The full matched string",
                                fr: "La chaîne complète correspondante",
                            },
                        },
                        {
                            name: "matches[].index",
                            type: "`number`",
                            description: {
                                en: "Start index of the match in the text",
                                fr: "Index de début de la correspondance dans le texte",
                            },
                        },
                        {
                            name: "matches[].groups",
                            type: "`string[]`",
                            description: {
                                en: "Array of numbered capture group values (empty string if unmatched)",
                                fr: "Tableau des valeurs de groupes capturants numérotés (chaîne vide si non capturé)",
                            },
                        },
                        {
                            name: "matches[].namedGroups",
                            type: "`object`",
                            description: {
                                en: "Key-value map of named capture groups (`(?<name>...)`)",
                                fr: "Map clé-valeur des groupes capturants nommés (`(?<nom>...)`)",
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
                        en: { pattern: "\\d+", text: "Order 42 and item 7" },
                        fr: { pattern: "\\d+", text: "Commande 42 et article 7" },
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
                    type: "errors",
                    rows: [
                        {
                            message: "Please provide a pattern (?pattern={regex})",
                            description: {
                                en: "The `pattern` parameter is missing or given more than once",
                                fr: "Le paramètre `pattern` est manquant ou fourni plusieurs fois",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a text (&text={string})",
                            description: {
                                en: "The `text` parameter is missing or given more than once",
                                fr: "Le paramètre `text` est manquant ou fourni plusieurs fois",
                            },
                            status: 400,
                        },
                        {
                            message: "Pattern must be under 200 characters",
                            description: {
                                en: "The `pattern` exceeds the maximum length",
                                fr: "Le `pattern` dépasse la longueur maximale",
                            },
                            status: 400,
                        },
                        {
                            message: "Text must be under 1000 characters",
                            description: {
                                en: "The `text` exceeds the maximum length",
                                fr: "Le `text` dépasse la longueur maximale",
                            },
                            status: 400,
                        },
                        {
                            message: "Pattern took too long to evaluate",
                            description: {
                                en: "The pattern ran for more than 25 ms and was interrupted (since 6.2.0)",
                                fr: "L'exécution du pattern a dépassé 25 ms et a été interrompue (depuis la 6.2.0)",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
