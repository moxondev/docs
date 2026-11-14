import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "cron",
    kind: "endpoint",
    title: { en: "Cron Expression Parser", fr: "Parseur d'expressions cron" },
    lead: {
        en: "The `/cron` endpoint parses a 5-field cron expression and returns a human-readable description along with the next scheduled execution timestamps.",
        fr: "L'endpoint `/cron` analyse une expression cron à 5 champs et retourne une description lisible ainsi que les prochains timestamps d'exécution planifiés.",
    },
    updated: "2026-11-14",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/cron",
            try: true,
            params: [
                {
                    name: "expr",
                    type: "string",
                    in: "query",
                    required: true,
                    placeholder: "0 9 * * 1-5",
                },
                { name: "count", type: "number", in: "query", required: false, placeholder: "5" },
                {
                    name: "from",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "2025-01-01T00:00:00Z",
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
                                text: "Preview upcoming job runs before scheduling a task, display a human-readable description of a cron expression in a UI, debug cron timing issues across time zones, or validate that an expression fires at the expected intervals.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Prévisualisez les prochaines exécutions avant de planifier une tâche, affichez une description lisible d'une expression cron dans une interface, déboguez les problèmes de timing cron selon les fuseaux horaires, ou validez qu'une expression se déclenche aux intervalles attendus.",
                            },
                        ],
                    },
                },
                {
                    type: "callout",
                    kind: "info",
                    title: { en: "Bounded search", fr: "Recherche bornée" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Since 6.2.0, the search for the next dates is bounded. A schedule that can never fire, such as `0 0 31 2 *` (a day that none of the allowed months has), a time that a daylight saving change always skips, or a schedule whose next date is more than about 400 years away, now returns an empty `next` array at once, with a `200` status. A search that runs for more than 250 ms stops there and returns the dates found so far, possibly fewer than `count`, without an error.",
                            },
                            {
                                type: "p",
                                text: "Two results change. First, in timezones east of UTC, such as `Europe/Paris` or `Asia/Tokyo`, a schedule restricted to some months could skip the matching month and return no date, or fewer dates than `count`, after a long computation. For example `0 12 1 6 *` with `count=2`, `from=2026-01-01T00:00:00Z` and `timezone=Europe/Paris` now returns `2026-06-01T10:00:00.000Z` and `2027-06-01T10:00:00.000Z`. Second, in every timezone with a daylight saving change, including `America/New_York`, a schedule that fires between 00:00 and 00:59 could miss the first occurrence after the spring-forward day. For example `0 0 * * 1` with `from=2026-03-27T00:00:00Z` and `timezone=Europe/Paris` now returns `2026-03-29T22:00:00.000Z` (Monday 30 March, 00:00 local) first. Apart from these two fixes, a legitimate request gets the same response as before.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Depuis la 6.2.0, la recherche des prochaines dates est bornée. Une expression qui ne peut jamais se déclencher, comme `0 0 31 2 *` (un jour qu'aucun des mois autorisés ne compte), une heure que le passage à l'heure d'été saute toujours, ou une expression dont la prochaine date est à plus de 400 ans environ, retourne désormais aussitôt un tableau `next` vide, avec le statut `200`. Une recherche qui dépasse 250 ms s'arrête et retourne les dates trouvées jusque-là, éventuellement moins que `count`, sans erreur.",
                            },
                            {
                                type: "p",
                                text: "Deux résultats changent. D'abord, dans les fuseaux horaires à l'est de UTC, comme `Europe/Paris` ou `Asia/Tokyo`, une expression limitée à certains mois pouvait sauter le mois voulu et ne retourner aucune date, ou moins de dates que `count`, après un long calcul. Par exemple `0 12 1 6 *` avec `count=2`, `from=2026-01-01T00:00:00Z` et `timezone=Europe/Paris` retourne désormais `2026-06-01T10:00:00.000Z` et `2027-06-01T10:00:00.000Z`. Ensuite, dans tous les fuseaux avec changement d'heure, y compris `America/New_York`, une expression qui se déclenche entre 00:00 et 00:59 pouvait manquer la première occurrence qui suit le jour du passage à l'heure d'été. Par exemple `0 0 * * 1` avec `from=2026-03-27T00:00:00Z` et `timezone=Europe/Paris` retourne désormais d'abord `2026-03-29T22:00:00.000Z` (lundi 30 mars, 00:00 locale). Hors ces deux corrections, une requête légitime reçoit la même réponse qu'avant.",
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
                            default: "",
                            description: {
                                en: "5-field cron expression (`minute hour dom month dow`). Example: `*/5 * * * *`.",
                                fr: "Expression cron à 5 champs (`minute heure dom mois dow`). Exemple : `*/5 * * * *`.",
                            },
                        },
                        {
                            name: "count",
                            required: false,
                            default: "`5`",
                            description: {
                                en: "Number of upcoming execution timestamps to return (1–20). Fewer are returned when the schedule has no more dates or when the search exceeds 250 ms.",
                                fr: "Nombre de prochains timestamps d'exécution à retourner (1–20). Moins sont retournés lorsque l'expression n'a plus de dates ou que la recherche dépasse 250 ms.",
                            },
                        },
                        {
                            name: "from",
                            required: false,
                            default: { en: "now", fr: "maintenant" },
                            description: {
                                en: "Start date for computing next runs (ISO 8601). Defaults to the current time.",
                                fr: "Date de départ pour le calcul des prochaines exécutions (ISO 8601). Défaut : maintenant.",
                            },
                        },
                        {
                            name: "timezone",
                            required: false,
                            default: "`UTC`",
                            description: {
                                en: "IANA timezone for computing and formatting timestamps (e.g. `Europe/Paris`).",
                                fr: "Fuseau horaire IANA pour le calcul et le formatage des timestamps (ex. `Europe/Paris`).",
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
                            name: "expression",
                            type: "`string`",
                            description: {
                                en: "The cron expression as provided",
                                fr: "L'expression cron telle que fournie",
                            },
                        },
                        {
                            name: "description",
                            type: "`string`",
                            description: {
                                en: "Human-readable description (e.g. `Every 5 minutes`, `At 09:00 daily`)",
                                fr: "Description lisible (ex. `Every 5 minutes`, `At 09:00 daily`)",
                            },
                        },
                        {
                            name: "timezone",
                            type: "`string`",
                            description: {
                                en: "Timezone used for computation",
                                fr: "Fuseau horaire utilisé pour le calcul",
                            },
                        },
                        {
                            name: "next",
                            type: "`string[]`",
                            description: {
                                en: "Array of next execution timestamps in ISO 8601 format",
                                fr: "Tableau des prochains timestamps d'exécution au format ISO 8601",
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
                { type: "examples", op: "default", query: { expr: "0 9 * * 1-5" } },
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
                            message: "Please provide a cron expression (?expr=...)",
                            description: {
                                en: "The `expr` parameter is missing",
                                fr: "Le paramètre `expr` est manquant",
                            },
                            status: 400,
                        },
                        {
                            message: "Invalid cron expression",
                            description: {
                                en: "The expression does not match the 5-field cron format",
                                fr: "L'expression ne correspond pas au format cron à 5 champs",
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
                        {
                            message: "Please provide a valid count (&count={n})",
                            description: {
                                en: "The `count` parameter is not a valid number",
                                fr: "Le paramètre `count` n'est pas un nombre valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid ISO 8601 date (?from=...)",
                            description: {
                                en: "The `from` parameter is not a valid ISO 8601 date",
                                fr: "Le paramètre `from` n'est pas une date ISO 8601 valide",
                            },
                            status: 400,
                        },
                        {
                            message: "Please provide a valid timezone (?timezone=...)",
                            description: {
                                en: "The `timezone` parameter is not a valid IANA timezone",
                                fr: "Le paramètre `timezone` n'est pas un fuseau horaire IANA valide",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
