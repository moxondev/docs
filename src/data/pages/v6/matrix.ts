import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "matrix",
    kind: "endpoint",
    title: { en: "Matrix", fr: "Matrix" },
    lead: {
        en: "The `/matrix` endpoint performs mathematical operations on matrices. It supports arithmetic, scalar multiplication, transposition, and linear algebra operations on up to 20×20 matrices.",
        fr: "L'endpoint `/matrix` effectue des opérations mathématiques sur des matrices. Il supporte l'arithmétique, la multiplication scalaire, la transposition et les opérations d'algèbre linéaire sur des matrices allant jusqu'à 20×20.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/matrix",
            try: true,
            params: [
                {
                    name: "operation",
                    type: "enum",
                    in: "body",
                    required: true,
                    options: [
                        "add",
                        "subtract",
                        "multiply",
                        "scalar",
                        "transpose",
                        "determinant",
                        "inverse",
                        "identity",
                    ],
                },
                {
                    name: "matrix",
                    type: "json",
                    in: "body",
                    required: true,
                    placeholder: "[[1,2],[3,4]]",
                },
                {
                    name: "matrix2",
                    type: "json",
                    in: "body",
                    required: "conditional",
                    placeholder: "[[5,6],[7,8]]",
                },
                {
                    name: "scalar",
                    type: "number",
                    in: "body",
                    required: "conditional",
                    placeholder: "3",
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
                                text: "Determinant is computed via Gaussian elimination with partial pivoting. Matrix inverse uses Gauss-Jordan elimination on an augmented matrix. All inputs are validated: values must be finite numbers, rows must have uniform length, and the matrix must not exceed 20×20.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Le déterminant est calculé par élimination gaussienne avec pivot partiel. L'inverse utilise l'élimination de Gauss-Jordan sur une matrice augmentée. Toutes les entrées sont validées : les valeurs doivent être des nombres finis, les lignes doivent avoir une longueur uniforme, et la matrice ne doit pas dépasser 20×20.",
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
                    type: "p",
                    text: {
                        en: "The request body must be JSON:",
                        fr: "Le corps de la requête doit être en JSON :",
                    },
                },
                {
                    type: "params",
                    rows: [
                        {
                            name: "operation",
                            required: true,
                            description: {
                                en: "The operation to perform (see available operations)",
                                fr: "L'opération à effectuer (voir les opérations disponibles)",
                            },
                        },
                        {
                            name: "matrix",
                            required: true,
                            description: {
                                en: "The input matrix (2D array of numbers)",
                                fr: "La matrice d'entrée (tableau 2D de nombres)",
                            },
                        },
                        {
                            name: "matrix2",
                            required: "conditional",
                            description: {
                                en: "Second matrix — required for `add`, `subtract`, `multiply`",
                                fr: "Deuxième matrice — requise pour `add`, `subtract`, `multiply`",
                            },
                        },
                        {
                            name: "scalar",
                            required: "conditional",
                            description: {
                                en: "Scalar value — required for `scalar`, used by `identity`",
                                fr: "Valeur scalaire — requise pour `scalar`, utilisée par `identity`",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "available-operations",
            level: 2,
            title: { en: "Available Operations", fr: "Opérations disponibles" },
            aliases: ["operations-disponibles"],
            blocks: [
                {
                    type: "table",
                    head: {
                        en: ["Operation", "Description", "Requires"],
                        fr: ["Opération", "Description", "Nécessite"],
                    },
                    rows: [
                        [
                            "`add`",
                            { en: "Element-wise addition", fr: "Addition élément par élément" },
                            "`matrix2`",
                        ],
                        [
                            "`subtract`",
                            {
                                en: "Element-wise subtraction",
                                fr: "Soustraction élément par élément",
                            },
                            "`matrix2`",
                        ],
                        [
                            "`multiply`",
                            { en: "Matrix multiplication", fr: "Multiplication matricielle" },
                            "`matrix2`",
                        ],
                        [
                            "`scalar`",
                            {
                                en: "Multiply all elements by a scalar",
                                fr: "Multiplier tous les éléments par un scalaire",
                            },
                            "`scalar`",
                        ],
                        [
                            "`transpose`",
                            {
                                en: "Transpose rows and columns",
                                fr: "Transposer lignes et colonnes",
                            },
                            "—",
                        ],
                        [
                            "`determinant`",
                            {
                                en: "Compute the determinant (square matrices only)",
                                fr: "Calculer le déterminant (matrices carrées uniquement)",
                            },
                            "—",
                        ],
                        [
                            "`inverse`",
                            {
                                en: "Compute the inverse (square, non-singular matrices)",
                                fr: "Calculer l'inverse (matrices carrées non singulières)",
                            },
                            "—",
                        ],
                        [
                            "`identity`",
                            {
                                en: "Generate an identity matrix of size `scalar`×`scalar`",
                                fr: "Générer une matrice identité de taille `scalar`×`scalar`",
                            },
                            "`scalar`",
                        ],
                    ],
                    kind: "matrix",
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
                    type: "p",
                    text: {
                        en: "The response format depends on the operation:",
                        fr: "Le format de réponse dépend de l'opération :",
                    },
                },
                {
                    type: "table",
                    head: {
                        en: ["Operation", "`result` type"],
                        fr: ["Opération", "Type de `result`"],
                    },
                    rows: [
                        [
                            "`add`, `subtract`, `multiply`, `scalar`, `transpose`, `inverse`, `identity`",
                            "`number[][]`",
                        ],
                        ["`determinant`", "`number`"],
                    ],
                    kind: "definition",
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
                    body: {
                        operation: "determinant",
                        matrix: [
                            [1, 2],
                            [3, 4],
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
                            message: "Please provide a valid operation",
                            description: {
                                en: "The `operation` parameter is missing or invalid. Valid values: `add`, `subtract`, `multiply`, `scalar`, `transpose`, `determinant`, `inverse`, `identity`",
                                fr: "Le paramètre `operation` est manquant ou invalide. Valeurs valides : `add`, `subtract`, `multiply`, `scalar`, `transpose`, `determinant`, `inverse`, `identity`",
                            },
                            status: 400,
                        },
                        {
                            message: "Matrix must be a non-empty 2D array",
                            description: {
                                en: "The matrix is missing or malformed",
                                fr: "La matrice est manquante ou malformée",
                            },
                            status: 400,
                        },
                        {
                            message: "All rows must have the same length",
                            description: {
                                en: "The matrix rows are not uniform",
                                fr: "Les lignes de la matrice ne sont pas uniformes",
                            },
                            status: 400,
                        },
                        {
                            message: "Matrix values must be finite numbers",
                            description: {
                                en: "The matrix contains non-numeric values",
                                fr: "La matrice contient des valeurs non numériques",
                            },
                            status: 400,
                        },
                        {
                            message: "Matrix exceeds maximum size of 20×20",
                            description: {
                                en: "The matrix is larger than 20×20",
                                fr: "La matrice dépasse 20×20",
                            },
                            status: 400,
                        },
                        {
                            message: "Both matrices must have the same dimensions",
                            description: {
                                en: "Dimension mismatch for add/subtract",
                                fr: "Dimensions incompatibles pour add/subtract",
                            },
                            status: 400,
                        },
                        {
                            message: "Matrix dimensions incompatible for multiplication",
                            description: {
                                en: "Column count of A ≠ row count of B",
                                fr: "Nombre de colonnes de A ≠ nombre de lignes de B",
                            },
                            status: 400,
                        },
                        {
                            message: "Matrix must be square",
                            description: {
                                en: "Operation requires a square matrix",
                                fr: "L'opération nécessite une matrice carrée",
                            },
                            status: 400,
                        },
                        {
                            message: "Matrix is singular and cannot be inverted",
                            description: {
                                en: "The matrix has no inverse",
                                fr: "La matrice n'est pas inversible",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
