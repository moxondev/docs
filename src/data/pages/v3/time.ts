import type { Page } from "@/types/content";

export const page: Page = {
    version: "v3",
    id: "time",
    kind: "endpoint",
    title: { en: "Time Information", fr: "Informations sur le temps" },
    lead: {
        en: "The `/time` endpoint allows you to retrieve time information based on various parameters. You can get the current time or a random time between a specified range, in different formats and time zones.",
        fr: "L'endpoint `/time` permet de récupérer des informations sur le temps en fonction de différents paramètres. Vous pouvez obtenir l'heure actuelle ou une heure aléatoire entre une plage spécifiée, dans différents formats et fuseaux horaires.",
    },
    updated: "2026-04-08",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/time",
            try: false,
            params: [
                { name: "type", type: "string", in: "query", required: false },
                { name: "start", type: "string", in: "query", required: false },
                { name: "end", type: "string", in: "query", required: false },
                { name: "format", type: "string", in: "query", required: false },
                { name: "timezone", type: "string", in: "query", required: false },
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
                                en: "`live` (default) for current time, `random` for random time",
                                fr: "`live` (par défaut) pour le temps actuel, `random` pour un temps aléatoire",
                            },
                        },
                        {
                            name: "start",
                            required: false,
                            description: {
                                en: "Start date for random range (format: `YYYY-MM-DD`)",
                                fr: "Date de début pour la plage aléatoire (format : `YYYY-MM-DD`)",
                            },
                        },
                        {
                            name: "end",
                            required: false,
                            description: {
                                en: "End date for random range (format: `YYYY-MM-DD`)",
                                fr: "Date de fin pour la plage aléatoire (format : `YYYY-MM-DD`)",
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
                        ["`timestamp`", { en: "Unix timestamp", fr: "Timestamp Unix" }],
                        ["`locale`", { en: "Local format", fr: "Format local" }],
                        [
                            "`date`",
                            {
                                en: "Date in `MM/DD/YYYY` format",
                                fr: "Date au format `MM/DD/YYYY`",
                            },
                        ],
                        [
                            "`time`",
                            { en: "Time in `HH:MM:SS` format", fr: "Heure au format `HH:MM:SS`" },
                        ],
                        ["`year`", { en: "Year only", fr: "Année uniquement" }],
                        ["`month`", { en: "Month only", fr: "Mois uniquement" }],
                        ["`day`", { en: "Day only", fr: "Jour uniquement" }],
                        ["`hour`", { en: "Hour only", fr: "Heure uniquement" }],
                        ["`minute`", { en: "Minutes only", fr: "Minutes uniquement" }],
                        ["`second`", { en: "Seconds only", fr: "Secondes uniquement" }],
                        ["`ms`", { en: "Milliseconds only", fr: "Millisecondes uniquement" }],
                        [
                            "`dayOfWeek`",
                            { en: "Day of the week (0-6)", fr: "Jour de la semaine (0-6)" },
                        ],
                        [
                            "`dayOfYear`",
                            {
                                en: "Day of the year (1-365/366)",
                                fr: "Jour de l'année (1-365/366)",
                            },
                        ],
                        ["`weekNumber`", { en: "Week number", fr: "Numéro de semaine" }],
                        ["`timezone`", { en: "Time zone name", fr: "Nom du fuseau horaire" }],
                        ["`timezoneOffset`", { en: "Time zone offset", fr: "Décalage horaire" }],
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
            id: "request-examples",
            level: 2,
            title: { en: "Request Examples", fr: "Exemples de requête" },
            aliases: ["exemples-de-requete"],
            blocks: [],
        },
        {
            id: "current-time-all-formats",
            level: 3,
            title: { en: "Current Time (All Formats)", fr: "Temps actuel (tous les formats)" },
            aliases: ["temps-actuel-tous-les-formats"],
            blocks: [
                { type: "code", text: "GET /v3/time" },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "iso": "2000-01-01T12:00:00.000Z",\n    "utc": "Sat, 01 Jan 2000 12:00:00 GMT",\n    "timestamp": 946724400,\n    "locale": "1/1/2000, 12:00:00 PM Coordinated Universal Time",\n    "date": "3/3/2000",\n    "time": "12:00:00 PM",\n    "year": 2000,\n    "month": 1,\n    "day": 1,\n    "hour": 12,\n    "minute": 0,\n    "second": 0,\n    "ms": 0,\n    "dayOfWeek": 6,\n    "dayOfYear": 1,\n    "weekNumber": 1,\n    "timezone": "UTC",\n    "timezoneOffset": 0\n}',
                },
            ],
        },
        {
            id: "random-time-with-specific-format",
            level: 3,
            title: {
                en: "Random Time with Specific Format",
                fr: "Temps aléatoire avec format spécifique",
            },
            aliases: ["temps-aleatoire-avec-format-specifique"],
            blocks: [
                {
                    type: "code",
                    lang: "bash",
                    text: {
                        en: 'curl -X GET "https://api.moxon.dev/v3/time?type=random&format=locale&timezone=America/New_York"',
                        fr: 'curl -X GET "https://api.moxon.dev/v3/time?type=random&format=locale&timezone=Europe/Paris"',
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: {
                        en: '{\n    "date": "7/28/2024, 5:06:52 AM Eastern Standard Time"\n}',
                        fr: '{\n    "date": "7/28/2024, 2:06:52 PM GMT+01:00"\n}',
                    },
                },
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
