import type { Page } from "@/types/content";

export const page: Page = {
    version: "v4",
    id: "geo",
    kind: "endpoint",
    title: { en: "Geo", fr: "Géolocalisation" },
    lead: {
        en: "The `/geo` endpoint calculates the distance and bearing between two GPS coordinates using the Haversine formula.",
        fr: "L'endpoint `/geo` calcule la distance et le cap entre deux coordonnées GPS en utilisant la formule de Haversine.",
    },
    updated: "2026-05-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/geo",
            try: true,
            params: [
                {
                    name: "lat1",
                    type: "number",
                    in: "query",
                    required: true,
                    placeholder: "48.8566",
                },
                {
                    name: "lon1",
                    type: "number",
                    in: "query",
                    required: true,
                    placeholder: "2.3522",
                },
                {
                    name: "lat2",
                    type: "number",
                    in: "query",
                    required: true,
                    placeholder: "40.7128",
                },
                {
                    name: "lon2",
                    type: "number",
                    in: "query",
                    required: true,
                    placeholder: "-74.0060",
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
                                text: "The Haversine formula computes the great-circle distance between two points on a sphere — the shortest path over the Earth's surface, ignoring elevation. Bearing is the initial compass heading from point A to point B, expressed in degrees (0° = North) and as a cardinal direction.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "La formule de Haversine calcule la distance orthodromique entre deux points sur une sphère — le trajet le plus court à la surface de la Terre, sans tenir compte du relief. Le cap est la direction initiale de la boussole du point A vers le point B, exprimée en degrés (0° = Nord) et en direction cardinale.",
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
                            name: "lat1",
                            required: true,
                            description: {
                                en: "Latitude of point A (-90/+90)",
                                fr: "Latitude du point A (-90/+90)",
                            },
                        },
                        {
                            name: "lon1",
                            required: true,
                            description: {
                                en: "Longitude of point A (-180/+180)",
                                fr: "Longitude du point A (-180/+180)",
                            },
                        },
                        {
                            name: "lat2",
                            required: true,
                            description: {
                                en: "Latitude of point B (-90/+90)",
                                fr: "Latitude du point B (-90/+90)",
                            },
                        },
                        {
                            name: "lon2",
                            required: true,
                            description: {
                                en: "Longitude of point B (-180/+180)",
                                fr: "Longitude du point B (-180/+180)",
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
                            name: "distance.km",
                            type: "`number`",
                            description: {
                                en: "Distance in kilometers",
                                fr: "Distance en kilomètres",
                            },
                        },
                        {
                            name: "distance.miles",
                            type: "`number`",
                            description: { en: "Distance in miles", fr: "Distance en miles" },
                        },
                        {
                            name: "distance.nauticalMiles",
                            type: "`number`",
                            description: {
                                en: "Distance in nautical miles",
                                fr: "Distance en milles nautiques",
                            },
                        },
                        {
                            name: "bearing.degrees",
                            type: "`number`",
                            description: {
                                en: "Bearing in degrees (0–360)",
                                fr: "Cap en degrés (0–360)",
                            },
                        },
                        {
                            name: "bearing.cardinal",
                            type: "`string`",
                            description: {
                                en: "Cardinal direction (N, NNE, NE, ENE, E, etc.)",
                                fr: "Direction cardinale (N, NNE, NE, ENE, E, etc.)",
                            },
                        },
                        {
                            name: "from.lat",
                            type: "`number`",
                            description: {
                                en: "Parsed latitude of point A",
                                fr: "Latitude analysée du point A",
                            },
                        },
                        {
                            name: "from.lon",
                            type: "`number`",
                            description: {
                                en: "Parsed longitude of point A",
                                fr: "Longitude analysée du point A",
                            },
                        },
                        {
                            name: "to.lat",
                            type: "`number`",
                            description: {
                                en: "Parsed latitude of point B",
                                fr: "Latitude analysée du point B",
                            },
                        },
                        {
                            name: "to.lon",
                            type: "`number`",
                            description: {
                                en: "Parsed longitude of point B",
                                fr: "Longitude analysée du point B",
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
                    query: { lat1: "48.8566", lon1: "2.3522", lat2: "43.2965", lon2: "5.3698" },
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
                            message: "lat1 must be a number",
                            description: {
                                en: "A coordinate is not a valid number",
                                fr: "Une coordonnée n'est pas un nombre valide",
                            },
                            status: 400,
                        },
                        {
                            message: "lat1 must be between -90 and 90",
                            description: {
                                en: "Latitude is out of range",
                                fr: "La latitude est hors limites",
                            },
                            status: 400,
                        },
                        {
                            message: "lon1 must be between -180 and 180",
                            description: {
                                en: "Longitude is out of range",
                                fr: "La longitude est hors limites",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
