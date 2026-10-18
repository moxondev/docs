import type { Page } from "@/types/content";

export const page: Page = {
    version: "v5",
    id: "evaluate",
    kind: "endpoint",
    title: { en: "Evaluate", fr: "Evaluate" },
    lead: {
        en: "The `/evaluate` endpoint safely evaluates a mathematical expression and returns its result. It uses a Pratt parser — no `eval()` is ever called.",
        fr: "L'endpoint `/evaluate` évalue une expression mathématique de manière sécurisée et retourne son résultat. Il utilise un parseur Pratt — aucun `eval()` n'est jamais appelé.",
    },
    updated: "2026-07-26",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/evaluate",
            try: true,
            params: [
                {
                    name: "expr",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "2*(3+4)^2",
                },
                {
                    name: "precision",
                    type: "number",
                    in: "query",
                    required: false,
                    placeholder: "2",
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
                    title: { en: "How it works?", fr: "Comment ça marche ?" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Expressions are tokenized then parsed recursively using binding powers (Pratt parsing). The result is computed directly from the AST — no `eval()`, no `Function()`. Two constants are available: `pi` (≈ 3.14159…) and `e` (≈ 2.71828…). Recursion depth is capped at 100 and expression length at 500 characters.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Les expressions sont tokenisées puis parsées récursivement via des binding powers (Pratt parsing). Le résultat est calculé directement depuis l'AST — pas d'`eval()`, pas de `Function()`. Deux constantes sont disponibles : `pi` (≈ 3.14159…) et `e` (≈ 2.71828…). La profondeur de récursion est limitée à 100 et la longueur de l'expression à 500 caractères.",
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
                            name: "expr",
                            required: true,
                            description: {
                                en: "The mathematical expression to evaluate (max 500 characters)",
                                fr: "L'expression mathématique à évaluer (max 500 caractères)",
                            },
                        },
                        {
                            name: "precision",
                            required: false,
                            description: {
                                en: "Number of decimal places in the result (0–15)",
                                fr: "Nombre de décimales dans le résultat (0–15)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "supported-operators",
            level: 2,
            title: { en: "Supported Operators", fr: "Opérateurs supportés" },
            aliases: ["operateurs-supportes"],
            blocks: [
                {
                    type: "table",
                    head: { en: ["Operator", "Description"], fr: ["Opérateur", "Description"] },
                    rows: [
                        ["`+`", "Addition"],
                        [
                            "`-`",
                            {
                                en: "Subtraction / unary negation",
                                fr: "Soustraction / négation unaire",
                            },
                        ],
                        ["`*`", "Multiplication"],
                        ["`/`", "Division"],
                        ["`%`", "Modulo"],
                        ["`^`", "Exponentiation"],
                    ],
                    kind: "definition",
                },
                {
                    type: "p",
                    text: {
                        en: "Unary `-` binds looser than `^`, matching standard math convention: `-2^2` evaluates to `-4` (i.e. `-(2^2)`), not `4`.",
                        fr: "La négation unaire `-` a une priorité plus faible que `^`, conformément à la convention mathématique standard : `-2^2` donne `-4` (soit `-(2^2)`), et non `4`.",
                    },
                },
            ],
        },
        {
            id: "available-functions",
            level: 2,
            title: { en: "Available Functions", fr: "Fonctions disponibles" },
            aliases: ["fonctions-disponibles"],
            blocks: [
                {
                    type: "p",
                    text: "`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sqrt`, `abs`, `floor`, `ceil`, `round`, `log`, `log2`, `log10`",
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
                            name: "expr",
                            type: "`string`",
                            description: {
                                en: "The original expression",
                                fr: "L'expression originale",
                            },
                        },
                        {
                            name: "result",
                            type: "`number`",
                            description: { en: "The evaluated result", fr: "Le résultat évalué" },
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
                { type: "examples", op: "default", query: { expr: "2*(3+4)^2", precision: "2" } },
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
                            message: "Please provide a math expression (?expr={expression})",
                            description: {
                                en: "The `expr` parameter is missing",
                                fr: "Le paramètre `expr` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Expression is too long (max 500 characters)",
                            description: {
                                en: "The expression exceeds 500 characters",
                                fr: "L'expression dépasse 500 caractères",
                            },
                            status: 400,
                        },
                        {
                            message: "Maximum expression depth exceeded",
                            description: {
                                en: "Nesting depth exceeds 100 levels",
                                fr: "La profondeur d'imbrication dépasse 100 niveaux",
                            },
                            status: 400,
                        },
                        {
                            message: "Division by zero",
                            description: {
                                en: "The expression attempts to divide by zero",
                                fr: "L'expression tente une division par zéro",
                            },
                            status: 400,
                        },
                        {
                            message: "Unknown identifier: {name}",
                            description: {
                                en: "An unknown constant or function name was used",
                                fr: "Une constante ou fonction inconnue a été utilisée",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid number: {num}",
                            description: {
                                en: "A number literal has more than one decimal point (e.g. `1.2.3`)",
                                fr: "Un nombre contient plus d'un point décimal (ex. `1.2.3`)",
                            },
                            status: 400,
                        },
                        {
                            message: "precision must be between 0 and 15",
                            description: {
                                en: "The `precision` value is out of range",
                                fr: "La valeur de `precision` est hors limites",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
