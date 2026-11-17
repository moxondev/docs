import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "manifest",
    kind: "article",
    status: "experimental",
    title: { en: "Manifest", fr: "Manifest" },
    lead: {
        en: "The **`@moxon/api/manifest`** subpath of the [npm package](ref:index#using-the-npm-package) describes 41 HTTP endpoints as data: method, path, category, versions served, parameters and a request example. It is meant for tools that document or call the API, such as a documentation sidebar, parameter lists or a playground.",
        fr: "Le sous-chemin **`@moxon/api/manifest`** du [paquet npm](ref:index#using-the-npm-package) décrit 41 endpoints HTTP sous forme de données : méthode, chemin, catégorie, versions servies, paramètres et exemple de requête. Il s'adresse aux outils qui documentent ou appellent l'API, comme une barre latérale de documentation, des listes de paramètres ou un playground.",
    },
    updated: "2026-11-17",
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
                                text: "The manifest is experimental: its shape may still change in a minor version. It lists the 41 endpoints that answer plain JSON and keep no state, so it must not be mistaken for the complete list of the API: the endpoints that answer an image, keep a state or describe the API itself are not declared yet (see [Current Content](#current-content)).",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Le manifest est expérimental : sa forme peut encore changer dans une version mineure. Il liste les 41 endpoints qui répondent en JSON simple et ne gardent aucun état, et ne doit donc pas être pris pour la liste complète de l'API : les endpoints qui répondent par une image, gardent un état ou décrivent l'API elle-même ne sont pas encore déclarés (voir [Contenu actuel](#current-content)).",
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
                        en: "`manifest` is an array of `ManifestEntry`, one per declared endpoint and method. Like the library imports, it works from ESM and from CommonJS (Node.js 22.12 or newer).",
                        fr: "`manifest` est un tableau de `ManifestEntry`, un par endpoint et par méthode déclarés. Comme les imports de la bibliothèque, il fonctionne en ESM comme en CommonJS (Node.js 22.12 ou plus récent).",
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
                                en: "Endpoint identifier (for example `hash`). Two entries may share it, see [Current Content](#current-content)",
                                fr: "Identifiant de l'endpoint (par exemple `hash`). Deux entrées peuvent le partager, voir [Contenu actuel](#current-content)",
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
                                en: "Documentation category. No declared endpoint belongs to `realtime` yet",
                                fr: "Catégorie de documentation. Aucun endpoint déclaré n'appartient encore à `realtime`",
                            },
                        },
                        {
                            name: "since",
                            type: "`number`",
                            description: {
                                en: "First API version serving the endpoint (for example `5`) — absent if it is not bounded",
                                fr: "Première version de l'API qui sert l'endpoint (par exemple `5`) — absent s'il n'est pas borné",
                            },
                        },
                        {
                            name: "until",
                            type: "`number`",
                            description: {
                                en: "Last API version serving the endpoint (for example `5`) — absent if it is not bounded",
                                fr: "Dernière version de l'API qui sert l'endpoint (par exemple `5`) — absent s'il n'est pas borné",
                            },
                        },
                        {
                            name: "params",
                            type: "`Record<string, Param>`",
                            description: {
                                en: "Endpoint parameters, keyed by name (empty for `domain`, `personal` and `username`)",
                                fr: "Paramètres de l'endpoint, indexés par leur nom (vide pour `domain`, `personal` et `username`)",
                            },
                        },
                        {
                            name: "example",
                            type: "`Record<string, unknown>`",
                            description: {
                                en: "Sample input, keyed by parameter name: the values are strings, except for a few `post` endpoints (`matrix`, `token`)",
                                fr: "Exemple d'entrée, indexé par nom de paramètre : les valeurs sont des chaînes, sauf pour quelques endpoints `post` (`matrix`, `token`)",
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
                            type: "`boolean | 'defined'`",
                            description: {
                                en: "A request without the parameter is refused before the endpoint runs. With `true`, an empty value (an empty string, `0` or `false`) counts as missing too; with `'defined'`, only an absent or `null` value does, so `0` stays valid (the coordinates of `geo`)",
                                fr: "Une requête sans le paramètre est refusée avant l'exécution de l'endpoint. Avec `true`, une valeur vide (chaîne vide, `0` ou `false`) compte aussi comme absente ; avec `'defined'`, seule une valeur absente ou `null` est refusée, si bien que `0` reste valide (les coordonnées de `geo`)",
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
                            name: "type",
                            type: "`'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'`",
                            description: {
                                en: "Type of the value",
                                fr: "Type de la valeur",
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
                                en: "Value used when the parameter is omitted, always written as a string, even for a number or a boolean (`'16'`, `'true'`)",
                                fr: "Valeur utilisée quand le paramètre est omis, toujours écrite sous forme de chaîne, même pour un nombre ou un booléen (`'16'`, `'true'`)",
                            },
                        },
                    ],
                },
                {
                    type: "callout",
                    kind: "info",
                    title: {
                        en: "A parameter that is not marked can still be mandatory",
                        fr: "Un paramètre non marqué peut quand même être obligatoire",
                    },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "`required` is set only when a request without the parameter is refused before the endpoint runs. The other checks stay with the endpoint, so the manifest under-declares the mandatory parameters. For example, `str1` and `str2` of `levenshtein` carry no `required`, yet the endpoint answers `400` when one of them is missing. Do not rely on the manifest alone to validate a request: the error table of the endpoint page is the reference.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "`required` n'est posé que lorsqu'une requête sans le paramètre est refusée avant l'exécution de l'endpoint. Les autres vérifications restent dans l'endpoint : le manifest sous-déclare donc les paramètres obligatoires. Par exemple, `str1` et `str2` de `levenshtein` n'ont pas de `required`, mais l'endpoint répond `400` quand l'un des deux manque. Ne vous fiez pas au manifest seul pour valider une requête : le tableau d'erreurs de la page de l'endpoint fait référence.",
                            },
                        ],
                    },
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
                        en: "The manifest has **42 entries** for **41 endpoints**: `levenshtein` appears twice, as a `get` served until v5 and as a `post` served from v6. The other endpoints appear once, by category:",
                        fr: "Le manifest compte **42 entrées** pour **41 endpoints** : `levenshtein` y figure deux fois, en `get` servi jusqu'à la v5 et en `post` servi depuis la v6. Les autres endpoints y figurent une seule fois, par catégorie :",
                    },
                },
                {
                    type: "table",
                    head: {
                        en: ["Category", "Endpoints"],
                        fr: ["Catégorie", "Endpoints"],
                    },
                    rows: [
                        [
                            { en: "Security (`security`)", fr: "Sécurité (`security`)" },
                            "`asymmetric`, `hash`, `jwt`, `otp`, `password`, `pow`, `symmetric`, `token`",
                        ],
                        [
                            { en: "Text (`text`)", fr: "Texte (`text`)" },
                            "`base`, `case`, `diff`, `encode`, `levenshtein`, `read`, `regex`, `text`",
                        ],
                        [
                            { en: "Images (`images`)", fr: "Images (`images`)" },
                            "`color`, `palette`",
                        ],
                        [
                            {
                                en: "Math and formats (`compute`)",
                                fr: "Calcul et formats (`compute`)",
                            },
                            "`algorithms`, `convert`, `cron`, `csv`, `evaluate`, `matrix`, `semver`, `statistics`, `time`, `validate`",
                        ],
                        [
                            { en: "Fake data (`fakeData`)", fr: "Données fictives (`fakeData`)" },
                            "`address`, `credit`, `dice`, `personal`, `username`, `uuid`",
                        ],
                        [
                            { en: "Network (`network`)", fr: "Réseau (`network`)" },
                            "`agent`, `domain`, `geo`, `headers`, `hyperplanning`, `ip`, `url`",
                        ],
                    ],
                    kind: "definition",
                },
                {
                    type: "p",
                    text: {
                        en: "`pow` is the proof-of-work challenge: it is declared, but the verification of a solution is not. The endpoints that are still not declared are the ones that answer an image (`avatar`, `badge`, `barcode`, `captcha`, `chart`, `placeholder`, `qrcode`), the ones that keep a state (`chat`, `tic-tac-toe`, the verification of the captcha and of the proof of work) and the ones that describe the API itself (`infos`). They are still hand-written and are not declared yet.",
                        fr: "`pow` est le défi de preuve de travail : il est déclaré, mais pas la vérification d'une solution. Les endpoints qui ne sont toujours pas déclarés sont ceux qui répondent par une image (`avatar`, `badge`, `barcode`, `captcha`, `chart`, `placeholder`, `qrcode`), ceux qui gardent un état (`chat`, `tic-tac-toe`, la vérification du captcha et de la preuve de travail) et ceux qui décrivent l'API elle-même (`infos`). Ils sont encore écrits à la main et ne sont pas encore déclarés.",
                    },
                },
                {
                    type: "p",
                    text: {
                        en: "Here is the [POST /hash](ref:hash) entry as the package exports it:",
                        fr: "Voici l'entrée de [POST /hash](ref:hash) telle que l'exporte le paquet :",
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: '{\n    "name": "hash",\n    "method": "post",\n    "path": "/hash",\n    "category": "security",\n    "params": {\n        "text": { "required": true, "type": "string", "missing": "Please provide a text (?text={text})" },\n        "method": { "required": true, "type": "string", "missing": "Please provide a valid hash algorithm (&method={algorithm})" },\n        "encoding": { "type": "string", "options": ["hex", "base64"], "default": "hex" }\n    },\n    "example": { "text": "hello", "method": "sha256" }\n}',
                },
                {
                    type: "p",
                    text: {
                        en: "This entry has neither `since` nor `until`: the endpoint is served by every version, from v4 to v6. The two entries of [Levenshtein](ref:levenshtein) show the bounds: the `get` flavour has `until: 5` and the `post` flavour has `since: 6`, so a given version serves exactly one of them. Their parameters carry no `required`, see the note above.",
                        fr: "Cette entrée n'a ni `since` ni `until` : l'endpoint est servi par toutes les versions, de la v4 à la v6. Les deux entrées de [Levenshtein](ref:levenshtein) montrent les bornes : la variante `get` porte `until: 5` et la variante `post` porte `since: 6`, si bien qu'une version donnée sert exactement l'une des deux. Leurs paramètres n'ont pas de `required`, voir la note plus haut.",
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    text: '[\n    {\n        "name": "levenshtein",\n        "method": "post",\n        "path": "/levenshtein",\n        "category": "text",\n        "since": 6,\n        "params": { "str1": { "type": "string" }, "str2": { "type": "string" } },\n        "example": { "str1": "kitten", "str2": "sitting" }\n    },\n    {\n        "name": "levenshtein",\n        "method": "get",\n        "path": "/levenshtein",\n        "category": "text",\n        "until": 5,\n        "params": { "str1": { "type": "string" }, "str2": { "type": "string" } },\n        "example": { "str1": "kitten", "str2": "sitting" }\n    }\n]',
                },
                {
                    type: "p",
                    text: {
                        en: "Declaring an endpoint as a contract does not change its behavior: the HTTP routes and the manifest are built from the same declaration, so they cannot drift apart, and the declared endpoints answer exactly as before.",
                        fr: "Déclarer un endpoint comme contrat n'en change pas le comportement : les routes HTTP et le manifest sont construits à partir de la même déclaration, donc ils ne peuvent pas diverger, et les endpoints déclarés répondent exactement comme avant.",
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
                    text: "import { manifest } from '@moxon/api/manifest';\n\nconst hash = manifest.find((entry) => entry.name === 'hash');\nconsole.log(hash.method, hash.path); // 'post' '/hash'\nconsole.log(Object.keys(hash.params)); // ['text', 'method', 'encoding']\nconsole.log(hash.params.encoding); // { type: 'string', options: ['hex', 'base64'], default: 'hex' }\nconsole.log(hash.example); // { text: 'hello', method: 'sha256' }",
                },
                {
                    type: "p",
                    text: {
                        en: "List the endpoints a given version serves. `levenshtein` has two entries, so a search by name alone is not enough: filter by version, or by method.",
                        fr: "Lister les endpoints que sert une version donnée. `levenshtein` ayant deux entrées, une recherche par le seul nom ne suffit pas : filtrez par version, ou par méthode.",
                    },
                },
                {
                    type: "code",
                    lang: "js",
                    text: "import { manifest } from '@moxon/api/manifest';\n\nconst servedBy = (version) =>\n    manifest.filter(\n        (entry) =>\n            (!entry.since || entry.since <= version) && (!entry.until || entry.until >= version),\n    );\n\nconsole.log(servedBy(4).length); // 26\nconsole.log(servedBy(6).length); // 41\nconsole.log(servedBy(5).find((entry) => entry.name === 'levenshtein').method); // 'get'\nconsole.log(servedBy(6).find((entry) => entry.name === 'levenshtein').method); // 'post'",
                },
                {
                    type: "p",
                    text: {
                        en: "List the parameters whose absence is refused before the endpoint runs, with the exact error message:",
                        fr: "Lister les paramètres dont l'absence est refusée avant l'exécution de l'endpoint, avec le message d'erreur exact :",
                    },
                },
                {
                    type: "code",
                    lang: "js",
                    text: "import { manifest } from '@moxon/api/manifest';\n\nconst hash = manifest.find((entry) => entry.name === 'hash');\n\nfor (const [name, param] of Object.entries(hash.params)) {\n    if (param.required) console.log(name, '->', param.missing);\n}\n// text -> Please provide a text (?text={text})\n// method -> Please provide a valid hash algorithm (&method={algorithm})",
                },
                {
                    type: "p",
                    text: {
                        en: "Call the API from an entry. The parameters of a `post` endpoint go in the JSON body; those of a `get` endpoint go in the query string.",
                        fr: "Appeler l'API à partir d'une entrée. Les paramètres d'un endpoint `post` partent dans le corps JSON ; ceux d'un endpoint `get` partent dans la chaîne de requête.",
                    },
                },
                {
                    type: "code",
                    lang: "js",
                    text: "import { manifest } from '@moxon/api/manifest';\n\nasync function call(entry) {\n    const url = new URL(`https://api.moxon.dev/v6${entry.path}`);\n\n    if (entry.method === 'get') {\n        url.search = new URLSearchParams(entry.example).toString();\n        return fetch(url);\n    }\n\n    return fetch(url, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(entry.example),\n    });\n}\n\nconst hash = manifest.find((entry) => entry.name === 'hash');\nconst response = await call(hash);\n\nconsole.log(await response.json());\n// {\n//     method: 'sha256',\n//     hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',\n//     encoding: 'hex'\n// }",
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
                            en: "[POST /hash](ref:hash) - The endpoint used as an example on this page",
                            fr: "[POST /hash](ref:hash) - L'endpoint pris en exemple sur cette page",
                        },
                        {
                            en: "[POST /levenshtein](ref:levenshtein) - The endpoint that appears twice in the manifest",
                            fr: "[POST /levenshtein](ref:levenshtein) - L'endpoint qui figure deux fois dans le manifest",
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
