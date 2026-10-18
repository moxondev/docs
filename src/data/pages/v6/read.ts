import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "read",
    kind: "endpoint",
    title: { en: "Readability Analysis", fr: "Analyse de lisibilité" },
    lead: {
        en: "The `/read` endpoint analyzes a text and returns its word, sentence and syllable counts, its Flesch readability scores and an estimated reading time.",
        fr: "L'endpoint `/read` analyse un texte et retourne son nombre de mots, de phrases et de syllabes, ses scores de lisibilité Flesch et un temps de lecture estimé.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "post",
            path: "/read",
            try: true,
            params: [
                {
                    name: "text",
                    type: "string",
                    in: "body",
                    required: true,
                    placeholder: "The cat sat on the mat. It was happy.",
                },
                { name: "lang", type: "enum", in: "body", required: false, options: ["en", "fr"] },
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
                                text: "English uses the original Flesch coefficients, which also give a Flesch-Kincaid grade level. French uses the Kandel & Moles adaptation, which has no grade-level counterpart, so `fleschKincaidGrade` is `null`.",
                            },
                            {
                                type: "p",
                                text: "Syllables are estimated with a per-language heuristic: groups of vowels, minus the silent trailing `e` (`e` or `es` in French), with a minimum of one syllable per word. Sentences are split on `.`, `!`, `?` and `…`, and a text without any of them counts as a single sentence. Reading time is based on 200 words per minute.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "L'anglais utilise les coefficients Flesch d'origine, qui fournissent aussi un niveau scolaire Flesch-Kincaid. Le français utilise l'adaptation de Kandel & Moles, qui n'a pas d'équivalent de niveau scolaire : `fleschKincaidGrade` vaut donc `null`.",
                            },
                            {
                                type: "p",
                                text: "Les syllabes sont estimées par une heuristique propre à chaque langue : groupes de voyelles, moins le `e` final muet (`e` ou `es` en français), avec un minimum d'une syllabe par mot. Les phrases sont découpées sur `.`, `!`, `?` et `…`, et un texte sans aucun de ces signes compte pour une seule phrase. Le temps de lecture est basé sur 200 mots par minute.",
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
                            name: "text",
                            required: true,
                            description: {
                                en: "Text to analyze, 50000 characters maximum",
                                fr: "Texte à analyser, 50000 caractères maximum",
                            },
                        },
                        {
                            name: "lang",
                            required: false,
                            description: {
                                en: "Language of the text: `en` or `fr`. Default: `en`",
                                fr: "Langue du texte : `en` ou `fr`. Par défaut : `en`",
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
                            name: "lang",
                            type: "`string`",
                            description: {
                                en: "Language used for the analysis",
                                fr: "Langue utilisée pour l'analyse",
                            },
                        },
                        {
                            name: "words",
                            type: "`number`",
                            description: {
                                en: "Number of words — tokens containing at least one letter or digit",
                                fr: "Nombre de mots — les tokens contenant au moins une lettre ou un chiffre",
                            },
                        },
                        {
                            name: "sentences",
                            type: "`number`",
                            description: {
                                en: "Number of sentences, always at least `1`",
                                fr: "Nombre de phrases, toujours au minimum `1`",
                            },
                        },
                        {
                            name: "syllables",
                            type: "`number`",
                            description: {
                                en: "Estimated total number of syllables",
                                fr: "Nombre total estimé de syllabes",
                            },
                        },
                        {
                            name: "fleschReadingEase",
                            type: "`number`",
                            description: {
                                en: "Flesch reading ease, rounded to 2 decimals — the higher, the easier to read",
                                fr: "Score de lisibilité Flesch, arrondi à 2 décimales — plus il est élevé, plus le texte est facile",
                            },
                        },
                        {
                            name: "fleschKincaidGrade",
                            type: "`number|null`",
                            description: {
                                en: "Flesch-Kincaid grade level, rounded to 2 decimals — `null` when `lang` is `fr`",
                                fr: "Niveau scolaire Flesch-Kincaid, arrondi à 2 décimales — `null` si `lang` vaut `fr`",
                            },
                        },
                        {
                            name: "readingTime",
                            type: "`string`",
                            description: {
                                en: "Estimated reading time, in seconds below a minute (e.g. `45s`, `3min`)",
                                fr: "Temps de lecture estimé, en secondes en dessous d'une minute (ex. `45s`, `3min`)",
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
                    body: { text: "The cat sat on the mat. It was happy.", lang: "en" },
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
                            message: "Please provide a text",
                            description: {
                                en: "The `text` parameter is missing, empty, or contains no word",
                                fr: "Le paramètre `text` est manquant, vide, ou ne contient aucun mot",
                            },
                            status: 400,
                        },
                        {
                            message: "Text must be 50000 characters or fewer",
                            description: {
                                en: "The `text` exceeds the maximum length",
                                fr: "Le `text` dépasse la longueur maximale",
                            },
                            status: 400,
                        },
                        {
                            message: "Language must be one of: en, fr",
                            description: {
                                en: "The `lang` value is neither `en` nor `fr`",
                                fr: "La valeur de `lang` n'est ni `en` ni `fr`",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
