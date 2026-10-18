import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "agent",
    kind: "endpoint",
    title: { en: "User-Agent Parser", fr: "Analyse de User-Agent" },
    lead: {
        en: "The `/agent` endpoint parses a User-Agent string and returns structured information about the browser, operating system, device, rendering engine, and whether the client is a bot. If no UA is provided, the request's own `User-Agent` header is used.",
        fr: "L'endpoint `/agent` analyse un User-Agent et retourne des informations structurées sur le navigateur, le système d'exploitation, l'appareil, le moteur de rendu et si le client est un bot. Si aucun UA n'est fourni, le header `User-Agent` de la requête est utilisé.",
    },
    updated: "2026-09-12",
    operations: [
        {
            id: "default",
            method: "get",
            path: "/agent",
            try: true,
            params: [
                {
                    name: "ua",
                    type: "string",
                    in: "query",
                    required: false,
                    placeholder: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
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
                                text: "Detect the browser and OS of your visitors, identify bots and crawlers, serve device-specific content (mobile vs desktop), or log structured client metadata from raw User-Agent strings.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Détectez le navigateur et le système de vos visiteurs, identifiez les bots et crawlers, servez du contenu adapté à l'appareil (mobile vs bureau), ou journalisez les métadonnées client structurées à partir de User-Agent bruts.",
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
                            name: "ua",
                            required: false,
                            description: {
                                en: "Raw User-Agent string to parse. Defaults to the request's `User-Agent` header.",
                                fr: "Chaîne User-Agent brute à analyser. Utilise le header `User-Agent` de la requête si omis.",
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
                            name: "raw",
                            type: "`string`",
                            description: {
                                en: "The original User-Agent string",
                                fr: "La chaîne User-Agent d'origine",
                            },
                        },
                        {
                            name: "browser.name",
                            type: "`string`",
                            description: {
                                en: "Detected browser name (e.g. `Chrome`, `Firefox`, `Safari`)",
                                fr: "Navigateur détecté (ex. `Chrome`, `Firefox`, `Safari`)",
                            },
                        },
                        {
                            name: "browser.version",
                            type: "`string`",
                            description: {
                                en: "Full browser version",
                                fr: "Version complète du navigateur",
                            },
                        },
                        {
                            name: "browser.major",
                            type: "`string`",
                            description: {
                                en: "Major version number only",
                                fr: "Numéro de version majeure uniquement",
                            },
                        },
                        {
                            name: "os.name",
                            type: "`string`",
                            description: {
                                en: "Operating system name (e.g. `macOS`, `Windows 10/11`, `iOS`)",
                                fr: "Nom du système d'exploitation (ex. `macOS`, `Windows 10/11`, `iOS`)",
                            },
                        },
                        {
                            name: "os.version",
                            type: "`string`",
                            description: {
                                en: "OS version string",
                                fr: "Version du système d'exploitation",
                            },
                        },
                        {
                            name: "device.type",
                            type: "`string`",
                            description: {
                                en: "Device category: `desktop`, `mobile`, or `tablet`",
                                fr: "Catégorie d'appareil : `desktop`, `mobile` ou `tablet`",
                            },
                        },
                        {
                            name: "device.vendor",
                            type: "`string`",
                            description: {
                                en: "Device manufacturer (e.g. `Apple`, `Samsung`, `Google`)",
                                fr: "Fabricant de l'appareil (ex. `Apple`, `Samsung`, `Google`)",
                            },
                        },
                        {
                            name: "engine.name",
                            type: "`string`",
                            description: {
                                en: "Rendering engine (e.g. `Blink`, `Gecko`, `WebKit`)",
                                fr: "Moteur de rendu (ex. `Blink`, `Gecko`, `WebKit`)",
                            },
                        },
                        {
                            name: "engine.version",
                            type: "`string`",
                            description: { en: "Engine version", fr: "Version du moteur" },
                        },
                        {
                            name: "bot",
                            type: "`boolean`",
                            description: {
                                en: "`true` if the UA matches a known bot or crawler pattern",
                                fr: "`true` si le UA correspond à un bot ou crawler connu",
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
                            message: "A User-Agent string is required.",
                            description: {
                                en: "The `ua` parameter is empty and no `User-Agent` header was sent",
                                fr: "Le paramètre `ua` est vide et aucun header `User-Agent` n'a été envoyé",
                            },
                            status: 400,
                        },
                    ],
                },
            ],
        },
    ],
};
