import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "password",
    kind: "endpoint",
    title: { en: "Password Generation", fr: "Génération de mots de passe" },
    lead: {
        en: "The `/password` endpoint generates one or more passwords using cryptographically secure randomness (`crypto.randomInt`). Supports two modes: `random` (character-based) and `passphrase` (word-based). Each response includes the generated passwords along with their strength rating and entropy score.",
        fr: "L'endpoint `/password` génère un ou plusieurs mots de passe à l'aide d'une randomisation cryptographiquement sécurisée (`crypto.randomInt`). Deux modes sont disponibles : `random` (basé sur des caractères) et `passphrase` (basé sur des mots). Chaque réponse inclut les mots de passe générés ainsi que leur niveau de force et leur score d'entropie.",
    },
    updated: "2026-05-11",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/password",
            try: true,
            params: [
                {
                    name: "type",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["random", "passphrase"],
                },
                { name: "length", type: "number", in: "query", required: false, placeholder: "16" },
                {
                    name: "uppercase",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["true", "false"],
                },
                {
                    name: "lowercase",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["true", "false"],
                },
                {
                    name: "digits",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["true", "false"],
                },
                {
                    name: "symbols",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["true", "false"],
                },
                {
                    name: "exclude",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "0Ol1",
                },
                { name: "count", type: "number", in: "query", required: false, placeholder: "1" },
                {
                    name: "separator",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "-",
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
                    kind: "tip",
                    title: { en: "Use Cases", fr: "Cas d'utilisation" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Generate secure passwords for users during account creation, produce passphrases for easier memorization, test password strength UI, or seed test fixtures with realistic credentials.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Générez des mots de passe sécurisés lors de la création de comptes, produisez des passphrases pour une mémorisation facilitée, testez une interface de force de mot de passe, ou alimentez des fixtures de test avec de vrais identifiants réalistes.",
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
                            name: "type",
                            required: false,
                            default: "`random`",
                            description: {
                                en: "Generation mode: `random` (character-based) or `passphrase` (word-based).",
                                fr: "Mode de génération : `random` (caractères) ou `passphrase` (mots).",
                            },
                        },
                        {
                            name: "length",
                            required: false,
                            default: "`16`",
                            description: {
                                en: "Character count for `random` mode (8–128), or word count for `passphrase` mode (3–10).",
                                fr: "Nombre de caractères pour le mode `random` (8–128), ou de mots pour `passphrase` (3–10).",
                            },
                        },
                        {
                            name: "uppercase",
                            required: false,
                            default: "`true`",
                            description: {
                                en: "Include uppercase letters (`A–Z`). Set to `false` to disable.",
                                fr: "Inclure les majuscules (`A–Z`). Mettre à `false` pour désactiver.",
                            },
                        },
                        {
                            name: "lowercase",
                            required: false,
                            default: "`true`",
                            description: {
                                en: "Include lowercase letters (`a–z`). Set to `false` to disable.",
                                fr: "Inclure les minuscules (`a–z`). Mettre à `false` pour désactiver.",
                            },
                        },
                        {
                            name: "digits",
                            required: false,
                            default: "`true`",
                            description: {
                                en: "Include digits (`0–9`). Set to `false` to disable.",
                                fr: "Inclure les chiffres (`0–9`). Mettre à `false` pour désactiver.",
                            },
                        },
                        {
                            name: "symbols",
                            required: false,
                            default: "`false`",
                            description: {
                                en: "Include symbols (`!@#$%^&*()-_=+[]{}|;:,.<>?`). Set to `true` to enable.",
                                fr: "Inclure les symboles (`!@#$%^&*()-_=+[]{}|;:,.<>?`). Mettre à `true` pour activer.",
                            },
                        },
                        {
                            name: "exclude",
                            required: false,
                            default: '`""`',
                            description: {
                                en: "Characters to remove from the charset (e.g. `exclude=0Ol1`).",
                                fr: "Caractères à exclure du jeu de caractères (ex. `exclude=0Ol1`).",
                            },
                        },
                        {
                            name: "count",
                            required: false,
                            default: "`1`",
                            description: {
                                en: "Number of passwords to generate (1–20).",
                                fr: "Nombre de mots de passe à générer (1–20).",
                            },
                        },
                        {
                            name: "separator",
                            required: false,
                            default: "`-`",
                            description: {
                                en: "Word separator for `passphrase` mode.",
                                fr: "Séparateur de mots pour le mode `passphrase`.",
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
                            name: "passwords",
                            type: "`string[]`",
                            description: {
                                en: "List of generated passwords or passphrases",
                                fr: "Liste des mots de passe ou passphrases générés",
                            },
                        },
                        {
                            name: "type",
                            type: "`string`",
                            description: {
                                en: "Generation mode used: `random` or `passphrase`",
                                fr: "Mode de génération utilisé : `random` ou `passphrase`",
                            },
                        },
                        {
                            name: "length",
                            type: "`number`",
                            description: {
                                en: "Character count (random) or word count (passphrase)",
                                fr: "Nombre de caractères (random) ou de mots (passphrase)",
                            },
                        },
                        {
                            name: "strength",
                            type: "`string`",
                            description: {
                                en: "Strength rating: `weak`, `moderate`, `strong`, or `very_strong`",
                                fr: "Niveau de force : `weak`, `moderate`, `strong` ou `very_strong`",
                            },
                        },
                        {
                            name: "entropy",
                            type: "`number`",
                            description: {
                                en: "Shannon entropy in bits (rounded to 1 decimal place)",
                                fr: "Entropie de Shannon en bits (arrondie à 1 décimale)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "strength-thresholds",
            level: 2,
            title: { en: "Strength Thresholds", fr: "Niveaux de force" },
            aliases: ["niveaux-de-force"],
            blocks: [
                {
                    type: "table",
                    head: { en: ["Strength", "Entropy range"], fr: ["Niveau", "Plage d'entropie"] },
                    rows: [
                        ["`weak`", "< 40 bits"],
                        ["`moderate`", { en: "40 – 59.9", fr: "40 – 59,9" }],
                        ["`strong`", { en: "60 – 79.9", fr: "60 – 79,9" }],
                        ["`very_strong`", "≥ 80 bits"],
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
                { type: "examples", op: "default" },
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
                            message: 'Type must be "random" or "passphrase"',
                            description: {
                                en: "The `type` parameter is not a supported value",
                                fr: "Le paramètre `type` n'est pas une valeur supportée",
                            },
                            status: 400,
                        },
                        {
                            message: "Length must be between 8 and 128",
                            description: {
                                en: "The `length` parameter is out of range for `random` mode",
                                fr: "Le paramètre `length` est hors de la plage autorisée pour le mode `random`",
                            },
                            status: 400,
                        },
                        {
                            message: "At least one character set must be enabled",
                            description: {
                                en: "All character sets are disabled or `exclude` removed all characters",
                                fr: "Tous les jeux de caractères sont désactivés ou `exclude` a supprimé tous les caractères",
                            },
                            status: 400,
                        },
                        {
                            message: "Count must be between 1 and 20",
                            description: {
                                en: "The `count` parameter is out of the allowed range",
                                fr: "Le paramètre `count` est hors de la plage autorisée",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
