import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "time",
    kind: "endpoint",
    title: { en: "Time Information", fr: "Informations sur le temps" },
    lead: {
        en: "The `/time` endpoint allows you to retrieve time information based on various parameters. You can get the current time or a random time between a specified range, in different formats and time zones.",
        fr: "L'endpoint `/time` permet de récupérer des informations sur le temps en fonction de différents paramètres. Vous pouvez obtenir l'heure actuelle ou une heure aléatoire entre une plage spécifiée, dans différents formats et fuseaux horaires.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/time",
            try: true,
            params: [
                {
                    name: "type",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: ["live", "random", "countdown"],
                },
                {
                    name: "start",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "2025-01-01",
                },
                {
                    name: "end",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "2025-12-31",
                },
                {
                    name: "target",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "2026-01-01",
                },
                {
                    name: "format",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: [
                        "iso",
                        "utc",
                        "timestamp",
                        "locale",
                        "date",
                        "time",
                        "year",
                        "month",
                        "day",
                        "hour",
                        "minute",
                        "second",
                        "ms",
                        "dayOfWeek",
                        "dayOfYear",
                        "weekNumber",
                        "timezone",
                    ],
                },
                {
                    name: "timezone",
                    type: "enum",
                    in: "query",
                    required: false,
                    options: [
                        "UTC",
                        "Europe/Paris",
                        "America/New_York",
                        "Asia/Tokyo",
                        "Australia/Sydney",
                    ],
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
                            name: "type",
                            required: false,
                            description: {
                                en: "`live` (default) for current time, `random` for a random time, `countdown` for time until a target",
                                fr: "`live` (par défaut) pour le temps actuel, `random` pour un temps aléatoire, `countdown` vers une cible",
                            },
                        },
                        {
                            name: "start",
                            required: false,
                            description: {
                                en: "Start date for `random` range (format: `YYYY-MM-DD`)",
                                fr: "Date de début pour la plage `random` (format : `YYYY-MM-DD`)",
                            },
                        },
                        {
                            name: "end",
                            required: false,
                            description: {
                                en: "End date for `random` range (format: `YYYY-MM-DD`)",
                                fr: "Date de fin pour la plage `random` (format : `YYYY-MM-DD`)",
                            },
                        },
                        {
                            name: "target",
                            required: false,
                            description: {
                                en: "Target date for `countdown` mode (format: `YYYY-MM-DD` or ISO 8601)",
                                fr: "Date cible pour le mode `countdown` (format : `YYYY-MM-DD` ou ISO 8601)",
                            },
                        },
                        {
                            name: "format",
                            required: false,
                            description: {
                                en: "Response format (see options below)",
                                fr: "Format de la réponse (voir les options ci-dessous)",
                            },
                        },
                        {
                            name: "timezone",
                            required: false,
                            description: {
                                en: "Time zone to use (see options below)",
                                fr: "Fuseau horaire à utiliser (voir les options ci-dessous)",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "format-options",
            level: 2,
            title: { en: "Format Options", fr: "Options de format" },
            aliases: ["options-de-format"],
            blocks: [
                {
                    type: "table",
                    head: ["Format", "Description"],
                    rows: [
                        [
                            "`iso`",
                            { en: "ISO 8601 format (default)", fr: "Format ISO 8601 (par défaut)" },
                        ],
                        [
                            { en: "`utc`", fr: "`timestamp`" },
                            { en: "UTC format", fr: "Timestamp Unix" },
                        ],
                        [
                            { en: "`timestamp`", fr: "`locale`" },
                            { en: "Unix timestamp", fr: "Format local" },
                        ],
                        [
                            { en: "`locale`", fr: "`date`" },
                            { en: "Local format", fr: "Date au format `MM/DD/YYYY`" },
                        ],
                        [
                            { en: "`date`", fr: "`time`" },
                            { en: "Date in `MM/DD/YYYY` format", fr: "Heure au format `HH:MM:SS`" },
                        ],
                        [
                            { en: "`time`", fr: "`year`" },
                            { en: "Time in `HH:MM:SS` format", fr: "Année uniquement" },
                        ],
                        [
                            { en: "`year`", fr: "`month`" },
                            { en: "Year only", fr: "Mois uniquement" },
                        ],
                        [
                            { en: "`month`", fr: "`day`" },
                            { en: "Month only", fr: "Jour uniquement" },
                        ],
                        [
                            { en: "`day`", fr: "`hour`" },
                            { en: "Day only", fr: "Heure uniquement" },
                        ],
                        [
                            { en: "`hour`", fr: "`minute`" },
                            { en: "Hour only", fr: "Minutes uniquement" },
                        ],
                        [
                            { en: "`minute`", fr: "`second`" },
                            { en: "Minutes only", fr: "Secondes uniquement" },
                        ],
                        [
                            { en: "`second`", fr: "`ms`" },
                            { en: "Seconds only", fr: "Millisecondes uniquement" },
                        ],
                        [
                            { en: "`ms`", fr: "`dayOfWeek`" },
                            { en: "Milliseconds only", fr: "Jour de la semaine (0-6)" },
                        ],
                        [
                            { en: "`dayOfWeek`", fr: "`dayOfYear`" },
                            { en: "Day of the week (0-6)", fr: "Jour de l'année (1-365/366)" },
                        ],
                        [
                            { en: "`dayOfYear`", fr: "`weekNumber`" },
                            { en: "Day of the year (1-365/366)", fr: "Numéro de semaine" },
                        ],
                        [
                            { en: "`weekNumber`", fr: "`timezone`" },
                            { en: "Week number", fr: "Nom du fuseau horaire" },
                        ],
                        [
                            { en: "`timezone`", fr: "`timezoneOffset`" },
                            { en: "Time zone name", fr: "Décalage horaire" },
                        ],
                    ],
                    kind: "definition",
                },
            ],
        },
        {
            id: "timezone-options",
            level: 2,
            title: { en: "Timezone Options", fr: "Options de fuseau horaire" },
            aliases: ["options-de-fuseau-horaire"],
            blocks: [
                {
                    type: "table",
                    head: {
                        en: ["Timezone", "Description"],
                        fr: ["Fuseau horaire", "Description"],
                    },
                    rows: [
                        [
                            "`UTC`",
                            {
                                en: "Coordinated Universal Time (default)",
                                fr: "Temps universel coordonné (par défaut)",
                            },
                        ],
                        [
                            "`Europe/Paris`",
                            { en: "Paris time zone", fr: "Fuseau horaire de Paris" },
                        ],
                        [
                            "`America/New_York`",
                            { en: "New York time zone", fr: "Fuseau horaire de New York" },
                        ],
                        ["`Asia/Tokyo`", { en: "Tokyo time zone", fr: "Fuseau horaire de Tokyo" }],
                        [
                            "`Australia/Sydney`",
                            { en: "Sydney time zone", fr: "Fuseau horaire de Sydney" },
                        ],
                    ],
                    kind: "definition",
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
                            name: "iso",
                            type: "`string`",
                            description: {
                                en: "Date in ISO 8601 format",
                                fr: "Date au format ISO 8601",
                            },
                        },
                        {
                            name: "utc",
                            type: "`string`",
                            description: {
                                en: "Date in UTC string format",
                                fr: "Date au format UTC",
                            },
                        },
                        {
                            name: "timestamp",
                            type: "`number`",
                            description: { en: "Unix timestamp", fr: "Timestamp Unix" },
                        },
                        {
                            name: "locale",
                            type: "`string`",
                            description: {
                                en: "Localized date and time string",
                                fr: "Date et heure au format local",
                            },
                        },
                        {
                            name: "date",
                            type: "`string`",
                            description: {
                                en: "Date in MM/DD/YYYY format",
                                fr: "Date au format MM/DD/YYYY",
                            },
                        },
                        {
                            name: "time",
                            type: "`string`",
                            description: {
                                en: "Time in HH:MM:SS format",
                                fr: "Heure au format HH:MM:SS",
                            },
                        },
                        {
                            name: "year",
                            type: "`number`",
                            description: { en: "Year", fr: "Année" },
                        },
                        {
                            name: "month",
                            type: "`number`",
                            description: { en: "Month (1-12)", fr: "Mois (1-12)" },
                        },
                        {
                            name: "day",
                            type: "`number`",
                            description: { en: "Day of the month", fr: "Jour du mois" },
                        },
                        {
                            name: "hour",
                            type: "`number`",
                            description: { en: "Hour (0-23)", fr: "Heure (0-23)" },
                        },
                        { name: "minute", type: "`number`", description: "Minutes" },
                        {
                            name: "second",
                            type: "`number`",
                            description: { en: "Seconds", fr: "Secondes" },
                        },
                        {
                            name: "ms",
                            type: "`number`",
                            description: { en: "Milliseconds", fr: "Millisecondes" },
                        },
                        {
                            name: "dayOfWeek",
                            type: "`number`",
                            description: {
                                en: "Day of the week (0-6)",
                                fr: "Jour de la semaine (0-6)",
                            },
                        },
                        {
                            name: "dayOfYear",
                            type: "`number`",
                            description: {
                                en: "Day of the year (1-365/366)",
                                fr: "Jour de l'année (1-365/366)",
                            },
                        },
                        {
                            name: "weekNumber",
                            type: "`number`",
                            description: { en: "Week number of the year", fr: "Numéro de semaine" },
                        },
                        {
                            name: "timezone",
                            type: "`string`",
                            description: { en: "Time zone name", fr: "Nom du fuseau horaire" },
                        },
                        {
                            name: "timezoneOffset",
                            type: "`number`",
                            description: {
                                en: "UTC offset of the time zone",
                                fr: "Décalage horaire en minutes",
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
                        en: { type: "random", format: "locale", timezone: "America/New_York" },
                        fr: { type: "random", format: "locale", timezone: "Europe/Paris" },
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
                        en: "If parameters are invalid, the API will return an error:",
                        fr: "Si les paramètres sont invalides, l'API retournera une erreur :",
                    },
                },
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Please provide a valid type (?type={type})",
                            description: {
                                en: "The `type` parameter is invalid",
                                fr: "Le paramètre `type` est invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid start date (?start={YYYY-MM-DD})",
                            description: {
                                en: "The `start` parameter is invalid",
                                fr: "Le paramètre `start` est invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid end date (?end={YYYY-MM-DD})",
                            description: {
                                en: "The `end` parameter is invalid",
                                fr: "Le paramètre `end` est invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid target date (?target=...)",
                            description: {
                                en: "The `target` parameter is invalid",
                                fr: "Le paramètre `target` est invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid format (?format={format})",
                            description: {
                                en: "The `format` parameter is invalid",
                                fr: "Le paramètre `format` est invalide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid timezone (?timezone={timezone})",
                            description: {
                                en: "The `timezone` parameter is invalid",
                                fr: "Le paramètre `timezone` est invalide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
