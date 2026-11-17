import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "instance",
    kind: "article",
    title: { en: "Instance", fr: "Instance" },
    lead: {
        en: "`/health` and `/logs` report on the state of an instance of the API rather than offering a utility. They sit at the root, outside any version.",
        fr: "`/health` et `/logs` renseignent sur l'état d'une instance de l'API au lieu d'offrir un utilitaire. Ils sont à la racine, hors de toute version.",
    },
    updated: "2026-11-17",
    operations: [
        { id: "health", method: "get", path: "/health", root: true, try: true, params: [] },
        { id: "logs", method: "get", path: "/logs", root: true, try: false, params: [] },
    ],
    sections: [
        {
            id: "",
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Both routes are called without a version: `https://api.moxon.dev/health`, not `/v6/health`. They count towards the [rate limits](ref:authentication#rate-limits) like any other request. `GET /` lists them with the other root routes, `/logs` only once it is configured.",
                        fr: "Les deux routes s'appellent sans version : `https://api.moxon.dev/health`, et non `/v6/health`. Elles comptent dans les [limites de requêtes](ref:authentication#rate-limits) comme toute autre requête. `GET /` les liste avec les autres routes de la racine, `/logs` seulement une fois configuré.",
                    },
                },
            ],
        },
        {
            id: "health",
            level: 2,
            title: { en: "Health", fr: "État de santé" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "`GET /health` answers with the state of the instance: its version, how long it has been running and how much memory it uses. It needs no token, which makes it the route to point a monitoring probe at. The Try below sends it to `api.moxon.dev` when the page opens, so its answer is the live one.",
                        fr: "`GET /health` répond avec l'état de l'instance : sa version, depuis combien de temps elle tourne et la mémoire qu'elle utilise. Elle ne demande aucun jeton, ce qui en fait la route à donner à une sonde de supervision. Le Try ci-dessous l'envoie à `api.moxon.dev` à l'ouverture de la page : sa réponse est donc celle du moment.",
                    },
                },
                { type: "endpoint", op: "health" },
                { type: "try", op: "health", autoSend: true },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "status",
                            type: "`string`",
                            description: {
                                en: "Always `ok`: an instance that answers is up",
                                fr: "Toujours `ok` : une instance qui répond est en marche",
                            },
                        },
                        {
                            name: "uptime",
                            type: "`number`",
                            description: {
                                en: "Seconds since the instance started",
                                fr: "Secondes écoulées depuis le démarrage de l'instance",
                            },
                        },
                        {
                            name: "version",
                            type: "`string`",
                            description: {
                                en: "Release of the API the instance runs",
                                fr: "Version de l'API que l'instance fait tourner",
                            },
                        },
                        {
                            name: "node",
                            type: "`string`",
                            description: {
                                en: "Version of Node.js",
                                fr: "Version de Node.js",
                            },
                        },
                        {
                            name: "memory.rss",
                            type: "`string`",
                            description: {
                                en: "Memory held by the process, in MB with one decimal",
                                fr: "Mémoire occupée par le processus, en Mo avec une décimale",
                            },
                        },
                        {
                            name: "memory.heap_used",
                            type: "`string`",
                            description: {
                                en: "Part of the JavaScript heap in use, in MB",
                                fr: "Part du tas JavaScript utilisée, en Mo",
                            },
                        },
                        {
                            name: "memory.heap_total",
                            type: "`string`",
                            description: {
                                en: "Size of the JavaScript heap, in MB",
                                fr: "Taille du tas JavaScript, en Mo",
                            },
                        },
                        {
                            name: "connections",
                            type: "`number`",
                            description: {
                                en: "Clients the rate limiter tracks in the current hour: an IPv4 address, or a `/64` block for an IPv6 client",
                                fr: "Clients que la limite de requêtes suit dans l'heure en cours : une adresse IPv4, ou un bloc `/64` pour un client IPv6",
                            },
                        },
                        {
                            name: "logs",
                            type: "`number`",
                            description: {
                                en: "Entries held in the request log, up to 1,000",
                                fr: "Entrées gardées dans le journal des requêtes, 1 000 au plus",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "logs",
            level: 2,
            title: { en: "Logs", fr: "Journal des requêtes" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "`GET /logs` returns the last 1,000 requests the instance answered, oldest first. It carries the traffic of every caller, so it is closed by default: it opens only once `LOGS_TOKEN` is set, and then asks for that value in the `X-Logs-Token` header.",
                        fr: "`GET /logs` renvoie les 1 000 dernières requêtes auxquelles l'instance a répondu, de la plus ancienne à la plus récente. Il porte le trafic de tous les clients, il est donc fermé par défaut : il ne s'ouvre qu'une fois `LOGS_TOKEN` défini, et demande alors cette valeur dans l'en-tête `X-Logs-Token`.",
                    },
                },
                { type: "endpoint", op: "logs" },
                {
                    type: "code",
                    lang: "bash",
                    text: {
                        en: 'curl -H "X-Logs-Token: YOUR_LOGS_TOKEN" https://api.moxon.dev/logs',
                        fr: 'curl -H "X-Logs-Token: VOTRE_JETON_DE_LOGS" https://api.moxon.dev/logs',
                    },
                },
                {
                    type: "code",
                    lang: "json",
                    role: "response",
                    text: '[\n    {\n        "timestamp": 1792779323895,\n        "level": "info",\n        "method": "POST",\n        "url": "/v6/hash",\n        "status": 200,\n        "duration": "0ms",\n        "platform": "Android"\n    },\n    {\n        "timestamp": 1792781601223,\n        "level": "info",\n        "method": "GET",\n        "url": "/health",\n        "status": 200,\n        "duration": "5ms"\n    },\n    {\n        "timestamp": 1792781714358,\n        "level": "warn",\n        "method": "GET",\n        "url": "/statistics?values",\n        "status": 404,\n        "duration": "0ms"\n    }\n]',
                },
                {
                    type: "fields",
                    rows: [
                        {
                            name: "timestamp",
                            type: "`number`",
                            description: {
                                en: "When the request was logged, in milliseconds since 1970",
                                fr: "Moment où la requête a été journalisée, en millisecondes depuis 1970",
                            },
                        },
                        {
                            name: "level",
                            type: "`string`",
                            description: {
                                en: "`info` below 400, `warn` from 400 to 499, `error` from 500",
                                fr: "`info` sous 400, `warn` de 400 à 499, `error` à partir de 500",
                            },
                        },
                        {
                            name: "method",
                            type: "`string`",
                            description: {
                                en: "HTTP method of the request",
                                fr: "Méthode HTTP de la requête",
                            },
                        },
                        {
                            name: "url",
                            type: "`string`",
                            description: {
                                en: "Path of the request, with the names of its query parameters but not their values",
                                fr: "Chemin de la requête, avec le nom de ses paramètres de requête mais pas leur valeur",
                            },
                        },
                        {
                            name: "status",
                            type: "`number`",
                            description: {
                                en: "HTTP status of the answer, a `304` recorded as `200`",
                                fr: "Statut HTTP de la réponse, un `304` noté `200`",
                            },
                        },
                        {
                            name: "duration",
                            type: "`string`",
                            description: {
                                en: "Time taken to answer, such as `12ms`",
                                fr: "Temps de réponse, par exemple `12ms`",
                            },
                        },
                        {
                            name: "platform",
                            type: "`string`",
                            description: {
                                en: "Operating system of the client, present only when the browser sends `Sec-CH-UA-Platform`",
                                fr: "Système du client, présent seulement quand le navigateur envoie `Sec-CH-UA-Platform`",
                            },
                        },
                    ],
                },
            ],
        },
        {
            id: "what-is-not-recorded",
            level: 3,
            title: { en: "What Is Not Recorded", fr: "Ce qui n'est pas enregistré" },
            blocks: [
                {
                    type: "list",
                    items: [
                        {
                            en: "The values of the query parameters: `?text=secret` is recorded as `?text`.",
                            fr: "La valeur des paramètres de requête : `?text=secret` est noté `?text`.",
                        },
                        {
                            en: "The private tokens of the chat and tic-tac-toe paths, replaced by `[redacted]`.",
                            fr: "Les jetons privés des chemins de chat et de tic-tac-toe, remplacés par `[redacted]`.",
                        },
                        {
                            en: "The bodies of the requests and of the answers.",
                            fr: "Le corps des requêtes et des réponses.",
                        },
                        {
                            en: "The `HEAD` requests, and the calls to `/logs` itself.",
                            fr: "Les requêtes `HEAD`, et les appels à `/logs` lui-même.",
                        },
                    ],
                },
                {
                    type: "p",
                    text: {
                        en: "The log lives in the memory of the process: it starts empty when the instance restarts.",
                        fr: "Le journal vit dans la mémoire du processus : il repart vide quand l'instance redémarre.",
                    },
                },
            ],
        },
        {
            id: "error-handling",
            level: 3,
            title: { en: "Error Handling", fr: "Gestion des erreurs" },
            blocks: [
                {
                    type: "errors",
                    rows: [
                        {
                            message: "Endpoint '/logs' does not exist.",
                            description: {
                                en: "`LOGS_TOKEN` is not set on the instance: the route answers like an unknown path",
                                fr: "`LOGS_TOKEN` n'est pas défini sur l'instance : la route répond comme un chemin inconnu",
                            },
                            status: 404,
                        },
                        {
                            message: "Invalid token.",
                            description: {
                                en: "The `X-Logs-Token` header is missing or differs from `LOGS_TOKEN`",
                                fr: "L'en-tête `X-Logs-Token` est absent ou différent de `LOGS_TOKEN`",
                            },
                            status: 401,
                        },
                    ],
                },
            ],
        },
        {
            id: "configuration",
            level: 2,
            title: { en: "Configuration", fr: "Configuration" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "An instance you run yourself reads its settings from environment variables. Three of them matter here:",
                        fr: "Une instance que vous faites tourner vous-même lit ses réglages dans des variables d'environnement. Trois d'entre elles comptent ici :",
                    },
                },
                {
                    type: "table",
                    head: {
                        en: ["Variable", "Default", "Effect"],
                        fr: ["Variable", "Par défaut", "Effet"],
                    },
                    rows: [
                        [
                            "`LOGS_TOKEN`",
                            { en: "none", fr: "aucune" },
                            {
                                en: "Value expected in the `X-Logs-Token` header; while it is unset, `/logs` answers `404`",
                                fr: "Valeur attendue dans l'en-tête `X-Logs-Token` ; tant qu'elle n'est pas définie, `/logs` répond `404`",
                            },
                        ],
                        [
                            "`TRUSTED_PROXIES`",
                            { en: "one hop", fr: "un saut" },
                            {
                                en: "CIDR blocks or `loopback` / `linklocal` / `uniquelocal`, space or comma separated; unset, exactly one reverse proxy is assumed and a warning is logged",
                                fr: "Blocs CIDR ou `loopback` / `linklocal` / `uniquelocal`, séparés par des espaces ou des virgules ; tant qu'elle n'est pas définie, un seul reverse proxy est supposé et un avertissement est journalisé",
                            },
                        ],
                        [
                            "`GLOBAL_LIMIT`",
                            "50000",
                            {
                                en: "Requests per hour accepted across the whole instance; only the requests the per-client limits let through use this budget",
                                fr: "Requêtes par heure acceptées sur toute l'instance ; seules les requêtes que laissent passer les limites par client utilisent ce budget",
                            },
                        ],
                    ],
                    kind: "definition",
                },
                {
                    type: "callout",
                    kind: "warning",
                    title: { en: "Match the proxy chain", fr: "Alignez la chaîne de proxys" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "The one-hop default reads the client address from the last `X-Forwarded-For` entry, which is right behind a single reverse proxy such as nginx or Caddy. Exposed directly, callers can forge that header and pick their own address; behind several hops, every caller is counted as the nearest proxy. Set `TRUSTED_PROXIES` to match the actual chain. A forwarded address that is not an IP address counts as the connecting peer.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Le réglage par défaut, un seul saut, lit l'adresse du client dans la dernière entrée de `X-Forwarded-For`, ce qui est juste derrière un unique reverse proxy comme nginx ou Caddy. Exposée directement, l'API laisse les appelants forger cet en-tête et choisir leur adresse ; derrière plusieurs sauts, tous les appelants sont comptés comme le proxy le plus proche. Définissez `TRUSTED_PROXIES` pour qu'elle corresponde à la chaîne réelle. Une adresse transmise qui n'est pas une adresse IP compte comme le pair connecté.",
                            },
                        ],
                    },
                },
                {
                    type: "callout",
                    kind: "warning",
                    title: { en: "Keep the token secret", fr: "Gardez le jeton secret" },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Whoever holds `LOGS_TOKEN` reads which endpoints every client calls, how often and from which system. Use a long random value, and send it only over HTTPS.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Qui détient `LOGS_TOKEN` voit quels endpoints chaque client appelle, à quelle fréquence et depuis quel système. Choisissez une valeur longue et aléatoire, et ne l'envoyez qu'en HTTPS.",
                            },
                        ],
                    },
                },
            ],
        },
        {
            id: "docker",
            level: 2,
            title: { en: "Docker", fr: "Docker" },
            blocks: [
                {
                    type: "p",
                    text: {
                        en: "Since 6.4.0, a public image of the API is published to the GitHub Container Registry as `ghcr.io/moxondev/api`, for `linux/amd64` and `linux/arm64`. It listens on port `3000` and reads the same environment variables as the Node server, such as those of [Configuration](#configuration): pass them with `-e`, or in a file with `--env-file`.",
                        fr: "Depuis la 6.4.0, une image publique de l'API est publiée sur le GitHub Container Registry sous le nom `ghcr.io/moxondev/api`, pour `linux/amd64` et `linux/arm64`. Elle écoute sur le port `3000` et lit les mêmes variables d'environnement que le serveur Node, comme celles de la section [Configuration](#configuration) : passez-les avec `-e`, ou dans un fichier avec `--env-file`.",
                    },
                },
                {
                    type: "code",
                    lang: "bash",
                    text: "docker run -d --name moxon -p 3000:3000 ghcr.io/moxondev/api:latest",
                },
                {
                    type: "table",
                    head: {
                        en: ["Tag", "What it points to"],
                        fr: ["Tag", "Ce vers quoi il pointe"],
                    },
                    rows: [
                        [
                            "`6.4.0`, `6.4`, `6`",
                            {
                                en: "A release: the exact version, its minor line, its major line",
                                fr: "Une version : la version exacte, sa ligne mineure, sa ligne majeure",
                            },
                        ],
                        [
                            "`latest`",
                            {
                                en: "The most recent stable release",
                                fr: "La dernière version stable",
                            },
                        ],
                    ],
                    kind: "definition",
                },
                {
                    type: "label",
                    text: { en: "On a locked-down host", fr: "Sur un hôte verrouillé" },
                },
                {
                    type: "p",
                    text: {
                        en: "The image runs as the unprivileged `node` user and writes nothing to disk, so it also starts with a read-only filesystem. Put the settings in a file, here `moxon.env`, and replace the placeholder with the output of `openssl rand -hex 32`:",
                        fr: "L'image tourne avec l'utilisateur non privilégié `node` et n'écrit rien sur le disque : elle démarre donc aussi avec un système de fichiers en lecture seule. Mettez les réglages dans un fichier, ici `moxon.env`, et remplacez l'espace réservé par le résultat de `openssl rand -hex 32` :",
                    },
                },
                {
                    type: "code",
                    lang: "bash",
                    text: "docker run -d --name moxon -p 3000:3000 --read-only --tmpfs /tmp \\\n    --env-file moxon.env ghcr.io/moxondev/api:latest",
                },
                {
                    type: "code",
                    lang: "text",
                    text: "CHALLENGE_SECRET=<openssl rand -hex 32>\nTRUSTED_PROXIES=uniquelocal",
                },
                {
                    type: "p",
                    text: {
                        en: "The image checks itself: `docker ps` reports it `healthy` once `GET /` answers. `tini` is its entrypoint, so `docker stop` ends the server at once instead of waiting to kill it. To build the image from a clone of the repository, run `docker build -t moxon-api .`.",
                        fr: "L'image se surveille elle-même : `docker ps` l'indique `healthy` dès que `GET /` répond. `tini` en est le point d'entrée, donc `docker stop` arrête le serveur aussitôt, sans attendre d'être tué de force. Pour construire l'image depuis un clone du dépôt, lancez `docker build -t moxon-api .`.",
                    },
                },
                {
                    type: "callout",
                    kind: "warning",
                    title: {
                        en: "Set TRUSTED_PROXIES behind Docker",
                        fr: "Définissez TRUSTED_PROXIES derrière Docker",
                    },
                    body: {
                        en: [
                            {
                                type: "p",
                                text: "Behind a reverse proxy or a Docker network, the address the server sees is the proxy's or the network's, not the caller's. Set `TRUSTED_PROXIES` to that proxy, as described above, otherwise the rate limits count the proxy instead of the callers.",
                            },
                        ],
                        fr: [
                            {
                                type: "p",
                                text: "Derrière un reverse proxy ou un réseau Docker, l'adresse que voit le serveur est celle du proxy ou du réseau, pas celle de l'appelant. Définissez `TRUSTED_PROXIES` sur ce proxy, comme décrit plus haut, sans quoi les limites de requêtes comptent le proxy au lieu des appelants.",
                            },
                        ],
                    },
                },
            ],
        },
    ],
};
