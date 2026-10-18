import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "manifest",
    kind: "article",
    title: { en: "Manifest (experimental)", fr: "Manifest (expérimental)" },
    lead: {
        en: "The **`@moxon/api/manifest`** subpath of the [npm package](ref:index#using-the-npm-package) describes the HTTP endpoints as data: method, path, category, parameters and a request example. It is meant for tools that document or call the API, such as a documentation sidebar, parameter lists or a playground.",
        fr: "Le sous-chemin **`@moxon/api/manifest`** du [paquet npm](ref:index#using-the-npm-package) décrit les endpoints HTTP sous forme de données : méthode, chemin, catégorie, paramètres et exemple de requête. Il s'adresse aux outils qui documentent ou appellent l'API, comme une barre latérale de documentation, des listes de paramètres ou un playground.",
    },
    updated: "2026-10-17",
    sections: [
        {
            id: "",
            blocks: [
                {
                    type: "callout",
                    kind: "warning",
                    title: { en: "Experimental", fr: "Expérimental" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "The manifest is experimental: its shape may still change in a minor version. For now it only lists the endpoints already declared as contracts (`hash` for now), so it must not be mistaken for the complete list of the API.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Le manifest est expérimental : sa forme peut encore changer dans une version mineure. Il ne liste pour l'instant que les endpoints déjà déclarés comme contrats (`hash` pour l'instant) et ne doit donc pas être pris pour la liste complète de l'API.",
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: "import",
            level: 2,
            title: { en: "Import", fr: "Import" },
            blocks: [
                {
                    type: "code",
                    lang: "js",
                    text: "import { manifest } from '@moxon/api/manifest';",
                },
                {
                    type: "p",
                    text: {
                        en: "`manifest` is an array of `ManifestEntry`, one per declared endpoint. Like the library imports, it works from ESM and from CommonJS (Node.js 22.12 or newer).",
                        fr: "`manifest` est un tableau de `ManifestEntry`, un par endpoint déclaré. Comme les imports de la bibliothèque, il fonctionne en ESM comme en CommonJS (Node.js 22.12 ou plus récent).",
                    },
                },
            ],
        },
        {
            id: "entry-fields",
            level: 2,
            title: { en: "Entry Fields", fr: "Champs d'une entrée" },
            aliases: ["champs-d-une-entree"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Each entry describes one endpoint, without its run function (`run`): the manifest only holds data.",
                        fr: "Chaque entrée décrit un endpoint, sans sa fonction d'exécution (`run`) : le manifest ne contient que des données.",
                    },
                },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "name",
                            type: "`string`",
                            description: {
                                en: "Endpoint identifier (for example `hash`)",
                                fr: "Identifiant de l'endpoint (par exemple `hash`)",
                            },
                        },
                        {
                            name: "method",
                            type: "`'get' | 'post'`",
                            description: {
                                en: "HTTP method, in lowercase",
                                fr: "Méthode HTTP, en minuscules",
                            },
                        },
                        {
                            name: "path",
                            type: "`string`",
                            description: {
                                en: "Path without the version prefix (for example `/hash`)",
                                fr: "Chemin sans préfixe de version (par exemple `/hash`)",
                            },
                        },
                        {
                            name: "category",
                            type: "`'security' | 'text' | 'images' | 'compute' | 'fakeData' | 'network' | 'realtime'`",
                            description: {
                                en: "Documentation category",
                                fr: "Catégorie de documentation",
                            },
                        },
                        {
                            name: "since",
                            type: "`number`",
                            description: {
                                en: "First API version serving the endpoint (for example `5`) — absent if all serve it",
                                fr: "Première version de l'API qui sert l'endpoint (par exemple `5`) — absent si toutes le servent",
                            },
                        },
                        {
                            name: "params",
                            type: "`Record<string, Param>`",
                            description: {
                                en: "Endpoint parameters, keyed by name",
                                fr: "Paramètres de l'endpoint, indexés par leur nom",
                            },
                        },
                        {
                            name: "example",
                            type: "`Record<string, string>`",
                            description: {
                                en: "Sample input, whose values are strings",
                                fr: "Exemple d'entrée, dont les valeurs sont des chaînes de caractères",
                            },
                        },
                    ],
                },
                {
                    type: "p",
                    text: {
                        en: "Each parameter in `params` is a `Param` object, all of whose fields are optional:",
                        fr: "Chaque paramètre de `params` est un objet `Param`, dont tous les champs sont optionnels :",
                    },
                },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "required",
                            type: "`boolean`",
                            description: {
                                en: "The parameter is mandatory",
                                fr: "Le paramètre est obligatoire",
                            },
                        },
                        {
                            name: "missing",
                            type: "`string`",
                            description: {
                                en: "Exact `400` error message returned when this required parameter is absent",
                                fr: "Message exact de l'erreur `400` renvoyée quand ce paramètre obligatoire est absent",
                            },
                        },
                        {
                            name: "options",
                            type: "`readonly string[]`",
                            description: { en: "Accepted values", fr: "Valeurs acceptées" },
                        },
                        {
                            name: "default",
                            type: "`string`",
                            description: {
                                en: "Value used when the parameter is omitted",
                                fr: "Valeur utilisée quand le paramètre est omis",
                            },
                        },
                    ],
                },
                {
                    type: "p",
                    text: {
                        en: "The `Category` and `Param` types are not exported by name: in TypeScript, reach them through `ManifestEntry['category']` and `ManifestEntry['params'][string]`.",
                        fr: "Les types `Category` et `Param` ne sont pas exportés sous leur nom : en TypeScript, on y accède par `ManifestEntry['category']` et `ManifestEntry['params'][string]`.",
                    },
                },
            ],
        },
        {
            id: "current-content",
            level: 2,
            title: { en: "Current Content", fr: "Contenu actuel" },
            aliases: ["contenu-actuel"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Only the [POST /hash](ref:hash) endpoint is declared for now. Here is the entry as the package exports it:",
                        fr: "Seul l'endpoint [POST /hash](ref:hash) est déclaré pour l'instant. Voici l'entrée telle que l'exporte le paquet :",
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: '[\n    {\n        "name": "hash",\n        "method": "post",\n        "path": "/hash",\n        "category": "security",\n        "params": {\n            "text": { "required": true, "missing": "Please provide a text (?text={text})" },\n            "method": { "required": true, "missing": "Please provide a valid hash algorithm (&method={algorithm})" },\n            "encoding": { "options": ["hex", "base64"], "default": "hex" }\n        },\n        "example": { "text": "hello", "method": "sha256" }\n    }\n]',
                },
                {
                    type: "p",
                    text: {
                        en: "This entry has no `since` field: the endpoint is served by every version, from v4 to v6.",
                        fr: "Cette entrée n'a pas de champ `since` : l'endpoint est servi par toutes les versions, de la v4 à la v6.",
                    },
                },
                {
                    type: "p",
                    text: {
                        en: "Declaring an endpoint as a contract does not change its behavior: the HTTP routes and the manifest are built from the same declaration, so they cannot drift apart, and `/hash` answers exactly the same from v4 to v6. The other endpoints are still hand-written and will join the manifest one by one.",
                        fr: "Déclarer un endpoint comme contrat n'en change pas le comportement : les routes HTTP et le manifest sont construits à partir de la même déclaration, donc ils ne peuvent pas diverger, et `/hash` répond exactement de la même façon de la v4 à la v6. Les autres endpoints sont encore écrits à la main et rejoindront le manifest un par un.",
                    },
                },
            ],
        },
        {
            id: "usage-examples",
            level: 2,
            title: { en: "Usage Examples", fr: "Exemples d'utilisation" },
            aliases: ["exemples-d-utilisation"],
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Find the `hash` entry and read its information:",
                        fr: "Retrouver l'entrée de `hash` et lire ses informations :",
                    },
                },
                {
                    type: "code",
                    lang: "js",
                    text: "import { manifest } from '@moxon/api/manifest';\n\nconst hash = manifest.find((entry) => entry.name === 'hash');\nconsole.log(hash.method, hash.path); // 'post' '/hash'\nconsole.log(Object.keys(hash.params)); // ['text', 'method', 'encoding']\nconsole.log(hash.example); // { text: 'hello', method: 'sha256' }",
                },
                {
                    type: "p",
                    text: {
                        en: "Call the API from an entry. The parameters of a `post` endpoint go in the JSON body; for a `get` endpoint, they would go in the query string.",
                        fr: "Appeler l'API à partir d'une entrée. Les paramètres d'un endpoint `post` partent dans le corps JSON ; pour un endpoint `get`, ils iraient dans la chaîne de requête.",
                    },
                },
                {
                    type: "code",
                    lang: "js",
                    text: "import { manifest } from '@moxon/api/manifest';\n\nconst entry = manifest.find((item) => item.name === 'hash');\n\nconst response = await fetch(`https://api.moxon.dev/v6${entry.path}`, {\n    method: entry.method.toUpperCase(),\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(entry.example),\n});\n\nconsole.log(await response.json());\n// {\n//     method: 'sha256',\n//     hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',\n//     encoding: 'hex'\n// }",
                },
            ],
        },
        {
            id: "see-also",
            level: 2,
            title: { en: "See Also", fr: "Voir aussi" },
            aliases: ["voir-aussi"],
            blocks: [
                {
                    type: "list",
                    items: [
                        {
                            en: "[POST /hash](ref:hash) - The endpoint currently described by the manifest",
                            fr: "[POST /hash](ref:hash) - L'endpoint actuellement décrit par le manifest",
                        },
                        {
                            en: "[Using the npm package](ref:index#using-the-npm-package) - Installation and available imports",
                            fr: "[Utiliser le paquet npm](ref:index#using-the-npm-package) - Installation et imports disponibles",
                        },
                    ],
                },
            ],
        },
    ],
};
