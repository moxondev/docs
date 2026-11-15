import type { Page } from "@/types/content";

export const releases: Record<string, Page> = {
    "6.3.0": {
        version: "v6",
        id: "changelog/6.3.0",
        kind: "release",
        title: { en: "6.3.0", fr: "6.3.0" },
        updated: "2026-11-15",
        release: {
            version: "6.3.0",
            url: "https://github.com/moxondev/api/releases/tag/6.3.0",
            summary: {
                en: "New `/badge` endpoint: a standalone SVG badge, in `v6`.",
                fr: "Nouvel endpoint `/badge` : un badge SVG autonome, en `v6`.",
            },
        },
        sections: [
            { id: "", blocks: [] },
            {
                id: "api",
                level: 2,
                title: { en: "API", fr: "API" },
                blocks: [],
            },
            {
                id: "endpoints",
                level: 3,
                title: { en: "Endpoints", fr: "Endpoints" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "New **[GET /badge](ref:badge)** in `v6`: it draws a standalone SVG badge, a pill that works in a plain `<img>`. Only `label` is required. `start` and `end` give a gradient, `ink` the color of the text and of the icons and `border` an outline. `icon` and `trail` take the name of one of `106` bundled icons (`105` from Lucide, plus `discord`). `message` adds a second part, in the manner of shields.io, with its own `messageStart`, `messageEnd` and `messageInk`. `size` goes from `xs` to `lg` (`16` to `28` px), `radius`, `angle` and `lift` shape the badge, and `font` and `weight` set the text.",
                                fr: "Nouveau **[GET /badge](ref:badge)** en `v6` : il dessine un badge SVG autonome, une pilule qui fonctionne dans un simple `<img>`. Seul `label` est obligatoire. `start` et `end` donnent un dégradé, `ink` la couleur du texte et des icônes et `border` un contour. `icon` et `trail` prennent le nom de l'une des `106` icônes embarquées (`105` de Lucide, plus `discord`). `message` ajoute une seconde partie, à la manière de shields.io, avec ses propres `messageStart`, `messageEnd` et `messageInk`. `size` va de `xs` à `lg` (`16` à `28` px), `radius`, `angle` et `lift` donnent sa forme au badge, et `font` et `weight` règlent le texte.",
                            },
                            {
                                en: "The texts are bounded and checked: `label` and `message` hold `64` characters at most and refuse control, zero-width and bidirectional formatting characters, and `lift`, `radius` and `angle` take a plain decimal with at most two decimals. Any invalid value is refused with a `400` and a message that names it. The image is sent with `Cache-Control: public, max-age=86400` and `Content-Security-Policy: default-src 'none'`.",
                                fr: "Les textes sont bornés et contrôlés : `label` et `message` font `64` caractères au plus et refusent les caractères de contrôle, de largeur nulle et de formatage bidirectionnel, et `lift`, `radius` et `angle` prennent un décimal simple avec au plus deux décimales. Toute valeur invalide est refusée avec un `400` et un message qui la nomme. L'image est envoyée avec `Cache-Control: public, max-age=86400` et `Content-Security-Policy: default-src 'none'`.",
                            },
                            {
                                en: "Nothing else changes: `v4` and `v5` do not have `/badge` and answer `404` with `Endpoint not available in v4.` or `Endpoint not available in v5.`, and no other endpoint is touched.",
                                fr: "Rien d'autre ne change : la `v4` et la `v5` n'ont pas `/badge` et répondent `404` avec `Endpoint not available in v4.` ou `Endpoint not available in v5.`, et aucun autre endpoint n'est touché.",
                            },
                        ],
                    },
                ],
            },
            {
                id: "package",
                level: 3,
                title: { en: "Package", fr: "Paquet" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "New **`badge`** export, available from `@moxon/api/v6` and from the package root, which resolves to it: it takes the options of the query string, with `lift`, `radius` and `angle` as numbers, and returns `{ contentType, body }`, `body` being the SVG. It throws an `Error` with the message of the HTTP `400`. `@moxon/api/v4` and `@moxon/api/v5` do not export it.",
                                fr: "Nouvel export **`badge`**, disponible depuis `@moxon/api/v6` et depuis la racine du paquet, qui y mène : il prend les options de la chaîne de requête, avec `lift`, `radius` et `angle` sous forme de nombres, et renvoie `{ contentType, body }`, `body` étant le SVG. Il lève une `Error` avec le message du `400` HTTP. `@moxon/api/v4` et `@moxon/api/v5` ne l'exportent pas.",
                            },
                            {
                                en: "The icons come from Lucide, whose ISC licence and the MIT licence of the portions derived from Feather are kept in the source code.",
                                fr: "Les icônes viennent de Lucide, dont la licence ISC et la licence MIT des portions dérivées de Feather sont conservées dans le code source.",
                            },
                        ],
                    },
                ],
            },
            {
                id: "documentation",
                level: 2,
                title: { en: "Documentation", fr: "Documentation" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "The new **[Badge](ref:badge)** page documents the parameters in three tables (text and icons, colors, shape and font), the bundled icons by family, the two-part badge, the response and its headers, the use from Node.js and every error message, with a Try panel that shows the badge it draws.",
                                fr: "La nouvelle page **[Badge](ref:badge)** documente les paramètres en trois tableaux (texte et icônes, couleurs, forme et police), les icônes embarquées par famille, le badge en deux parties, la réponse et ses en-têtes, l'usage depuis Node.js et chaque message d'erreur, avec un panneau Try qui montre le badge dessiné.",
                            },
                            {
                                en: "The catalogue now lists `50` endpoints, `8` of them in Images.",
                                fr: "Le catalogue compte désormais `50` endpoints, dont `8` dans Images.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "6.2.0": {
        version: "v6",
        id: "changelog/6.2.0",
        kind: "release",
        title: { en: "6.2.0", fr: "6.2.0" },
        updated: "2026-11-14",
        release: {
            version: "6.2.0",
            url: "https://github.com/moxondev/api/releases/tag/6.2.0",
            summary: {
                en: "Security release: abusive inputs are bounded on every version, `/cron` dates fixed in some timezones.",
                fr: "Version de sécurité : les entrées abusives sont bornées sur toutes les versions, dates de `/cron` corrigées dans certains fuseaux.",
            },
        },
        sections: [
            { id: "", blocks: [] },
            {
                id: "api",
                level: 2,
                title: { en: "API", fr: "API" },
                blocks: [],
            },
            {
                id: "security",
                level: 3,
                title: { en: "Security", fr: "Sécurité" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "This is a **security release**: the issues found by an audit of the whole API are fixed, endpoint by endpoint. No endpoint is added or removed. A legitimate request gets exactly the same response as before; only abusive inputs are now refused, with the usual `400` error, or bounded. Two changes are visible: **[/cron](ref:cron)** on `v5` and `v6`, whose dates were wrong in some timezones (missing or repeated dates east of UTC, and a schedule at local midnight skipped right after a daylight-saving change) and are now correct, and **[/chat](ref:chat)**, which now keeps only the last `200` messages of a room.",
                                fr: "C'est une **version de sécurité** : les problèmes relevés par un audit de toute l'API sont corrigés, endpoint par endpoint. Aucun endpoint n'est ajouté ni retiré. Une requête légitime obtient exactement la même réponse qu'avant ; seules les entrées abusives sont désormais refusées, avec l'erreur `400` habituelle, ou bornées. Deux changements sont visibles : **[/cron](ref:cron)** en `v5` et `v6`, dont les dates étaient fausses dans certains fuseaux (dates manquantes ou répétées à l'est de UTC, et minuit local sauté juste après un changement d'heure) et sont maintenant correctes, et **[/chat](ref:chat)**, qui ne garde plus que les `200` derniers messages d'un salon.",
                            },
                            {
                                en: "Exceptionally, **`v4` and `v5` receive these fixes too**, although they are otherwise frozen: the same limits and refusals apply to every version that has the endpoint, and `v6` follows `v5`. Each item below says which versions it concerns, and the page of each endpoint gives the exact limits and error messages.",
                                fr: "Exceptionnellement, **`v4` et `v5` reçoivent aussi ces correctifs**, alors qu'elles sont figées par ailleurs : les mêmes limites et les mêmes refus s'appliquent à chaque version qui possède l'endpoint, et `v6` suit `v5`. Chaque point ci-dessous précise les versions concernées, et la page de chaque endpoint donne les limites et les messages d'erreur exacts.",
                            },
                        ],
                    },
                ],
            },
            {
                id: "endpoints",
                level: 3,
                title: { en: "Endpoints", fr: "Endpoints" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "**[/captcha](ref:captcha)** (`v4`, `v5` and `v6`): the `text` parameter is capped at `32` characters. On `v5` and `v6`, the signed token of a challenge can no longer be forged or exchanged for a token of another kind: a **[/pow](ref:pow)** token no longer verifies as a captcha token, nor the reverse. A token is burnt after `5` wrong answers and then answers `used`. **[POST /captcha](ref:captcha/verify)** also accepts an optional `minLength`: a right answer to a captcha generated shorter than that is refused with the reason `weak`. Without `minLength`, nothing changes.",
                                fr: "**[/captcha](ref:captcha)** (`v4`, `v5` et `v6`) : le paramètre `text` est limité à `32` caractères. En `v5` et `v6`, le jeton signé d'un challenge ne peut plus être forgé ni échangé contre un jeton d'un autre type : un jeton **[/pow](ref:pow)** n'est plus accepté comme jeton de captcha, ni l'inverse. Un jeton est brûlé après `5` mauvaises réponses et répond ensuite `used`. **[POST /captcha](ref:captcha/verify)** accepte aussi un `minLength` facultatif : une bonne réponse à un captcha généré plus court est refusée avec le motif `weak`. Sans `minLength`, rien ne change.",
                            },
                            {
                                en: "**[/barcode](ref:barcode)** (`v4`, `v5` and `v6`): the `data` of the variable-length formats, `code128` and `code39`, is capped at `128` characters (`Data cannot exceed 128 characters`). The fixed-length formats `ean13`, `ean8` and `upca` are not concerned.",
                                fr: "**[/barcode](ref:barcode)** (`v4`, `v5` et `v6`) : les `data` des formats à longueur variable, `code128` et `code39`, sont limitées à `128` caractères (`Data cannot exceed 128 characters`). Les formats à longueur fixe `ean13`, `ean8` et `upca` ne sont pas concernés.",
                            },
                            {
                                en: "**[/regex](ref:regex)** (`v4`, `v5` and `v6`): the evaluation of a pattern is interrupted after `25` ms and answers `400` with `Pattern took too long to evaluate`, so a catastrophic pattern can no longer block the server. A `pattern` or `text` key repeated in the query is refused like a missing one. A pattern that finishes in time returns the same matches as before.",
                                fr: "**[/regex](ref:regex)** (`v4`, `v5` et `v6`) : l'évaluation d'un motif est interrompue après `25` ms et répond `400` avec `Pattern took too long to evaluate` : un motif catastrophique ne peut plus bloquer le serveur. Une clé `pattern` ou `text` répétée dans la requête est refusée comme une clé absente. Un motif qui se termine à temps renvoie les mêmes correspondances qu'avant.",
                            },
                            {
                                en: "**[/cron](ref:cron)**: on `v5` and `v6`, dates were missing or repeated in timezones east of UTC, and a schedule at local midnight could be skipped right after a daylight-saving change; the results are now correct. `v4` keeps its previous results. On all three versions, a cron expression that can never match, such as `0 0 31 2 *`, ends at once with an empty list instead of running until its limit, and a search is bounded in time (`250` ms on `v5` and `v6`, `1` s on `v4`): the dates found until then are returned.",
                                fr: "**[/cron](ref:cron)** : en `v5` et `v6`, des dates manquaient ou se répétaient dans les fuseaux à l'est de UTC, et un horaire à minuit local pouvait être sauté juste après un changement d'heure ; les résultats sont maintenant corrects. La `v4` garde ses résultats précédents. Sur les trois versions, une expression cron qui ne peut jamais aboutir, comme `0 0 31 2 *`, se termine aussitôt avec une liste vide au lieu de tourner jusqu'à sa limite, et une recherche est bornée dans le temps (`250` ms en `v5` et `v6`, `1` s en `v4`) : les dates trouvées jusque-là sont renvoyées.",
                            },
                            {
                                en: "**[/chat](ref:chat)** and **[/tic-tac-toe](ref:tic-tac-toe)** (`v4`, `v5` and `v6`): their inputs are bounded, a username to `100` characters (`1000` for the `fetch` action of `/chat`, which is keyed by the reader's IP address), a message to `1000` and a session, game or private chat identifier to `256` (`Message cannot exceed 1000 characters`). Names such as `__proto__` or `constructor` are now ordinary values. `/chat` keeps the last `200` messages of the public room and of each private chat, allows at most `1000` private chats at a time (`Too many active private chats`), and replaces a client `timestamp` that cannot be stored as sent, an object or a text over `128` characters, with the server date.",
                                fr: "**[/chat](ref:chat)** et **[/tic-tac-toe](ref:tic-tac-toe)** (`v4`, `v5` et `v6`) : leurs entrées sont bornées, un nom d'utilisateur à `100` caractères (`1000` pour l'action `fetch` de `/chat`, qui est indexée par l'adresse IP du lecteur), un message à `1000` et un identifiant de session, de partie ou de chat privé à `256` (`Message cannot exceed 1000 characters`). Les noms comme `__proto__` ou `constructor` sont désormais des valeurs ordinaires. `/chat` garde les `200` derniers messages du salon public et de chaque chat privé, n'autorise que `1000` chats privés à la fois (`Too many active private chats`), et remplace par la date du serveur un `timestamp` du client qui ne peut pas être stocké tel quel, un objet ou un texte de plus de `128` caractères.",
                            },
                            {
                                en: "**[/qrcode](ref:qrcode)** (the `icon` parameter) and **[/hyperplanning](ref:hyperplanning)** (`v4`, `v5` and `v6`) fetch remote files through a guarded fetch: internal addresses are refused after name resolution and on every redirect, and redirects are capped at `10`. A calendar stops at `1` MB and `5000` events, an icon at `2` MB and `16` megapixels (`Icon must be under 16 megapixels`).",
                                fr: "**[/qrcode](ref:qrcode)** (le paramètre `icon`) et **[/hyperplanning](ref:hyperplanning)** (`v4`, `v5` et `v6`) récupèrent les fichiers distants via un fetch protégé : les adresses internes sont refusées après résolution du nom et à chaque redirection, et les redirections sont plafonnées à `10`. Un calendrier s'arrête à `1` Mo et `5000` événements, une icône à `2` Mo et `16` mégapixels (`Icon must be under 16 megapixels`).",
                            },
                            {
                                en: "**[POST /asymmetric](ref:asymmetric)** (`v5` and `v6`): RSA key pairs are now generated off the main thread, two at a time, so a large key no longer freezes the server for the other requests. The response is the same.",
                                fr: "**[POST /asymmetric](ref:asymmetric)** (`v5` et `v6`) : les paires de clés RSA sont désormais générées hors du thread principal, deux à la fois, si bien qu'une grande clé ne fige plus le serveur pour les autres requêtes. La réponse est la même.",
                            },
                        ],
                    },
                ],
            },
            {
                id: "server",
                level: 3,
                title: { en: "Server", fr: "Serveur" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "The rate limiter counts against the instance-wide limit only the requests it admits, so a client being refused can no longer use up the budget of the others. An IPv6 client is counted by its `/64` block, an IPv4-mapped IPv6 address by its IPv4 form, and each `/48` network is capped at four times the hourly quota of one client (`Too many requests from your network.`, `429`). A forwarded address that is not an IP address counts as the connecting peer.",
                                fr: "Le rate limiter ne compte dans la limite globale de l'instance que les requêtes qu'il admet : un client refusé ne peut plus épuiser le budget des autres. Un client IPv6 est compté par son bloc `/64`, une adresse IPv6 mappée en IPv4 par sa forme IPv4, et chaque réseau `/48` est plafonné à quatre fois le quota horaire d'un client (`Too many requests from your network.`, `429`). Une adresse transmise qui n'est pas une adresse IP compte comme celle du pair connecté.",
                            },
                            {
                                en: "The security headers are now sent first, so every response carries them, and request bodies, still capped at `10` kB, are parsed after the rate limiter, so malformed bodies are counted too.",
                                fr: "Les en-têtes de sécurité partent désormais en premier, si bien que toute réponse les porte, et les corps de requête, toujours plafonnés à `10` ko, sont lus après le limiteur, si bien que les corps mal formés sont comptés eux aussi.",
                            },
                            {
                                en: "When `TRUSTED_PROXIES` is unset, the server keeps assuming exactly one reverse proxy and now logs a warning at startup. That default is right behind a single proxy such as nginx or Caddy; exposed directly, callers can forge the `X-Forwarded-For` header and pick their own address, and behind several hops every caller is counted as the nearest proxy. The README explains when to set the variable.",
                                fr: "Quand `TRUSTED_PROXIES` n'est pas défini, le serveur continue de supposer exactement un reverse proxy et journalise désormais un avertissement au démarrage. Ce défaut est juste derrière un seul proxy comme nginx ou Caddy ; exposé directement, un appelant peut forger l'en-tête `X-Forwarded-For` et choisir son adresse, et derrière plusieurs sauts, tous les appelants sont comptés comme le proxy le plus proche. Le README explique quand définir la variable.",
                            },
                        ],
                    },
                ],
            },
            {
                id: "package",
                level: 3,
                title: { en: "Package", fr: "Paquet" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "New **`asymmetricAsync`** export, available from `@moxon/api`, `@moxon/api/v5` and `@moxon/api/v6`: it takes the same arguments and returns the same result as `asymmetric`, as a promise, and generates RSA key pairs on the thread pool, at most two at a time. `POST /asymmetric` uses it.",
                                fr: "Nouvel export **`asymmetricAsync`**, disponible depuis `@moxon/api`, `@moxon/api/v5` et `@moxon/api/v6` : il prend les mêmes arguments et renvoie le même résultat que `asymmetric`, sous forme de promesse, et génère les paires de clés RSA sur le pool de threads, deux au plus à la fois. `POST /asymmetric` l'utilise.",
                            },
                            {
                                en: "The experimental **[Manifest](ref:manifest)** export is not touched by this release: it still lists only `hash`, and describing the other endpoints as contracts is planned for a later release.",
                                fr: "L'export expérimental **[Manifest](ref:manifest)** n'est pas modifié par cette version : seul `hash` y figure toujours, et la description des autres endpoints sous forme de contrats est prévue pour une version ultérieure.",
                            },
                            {
                                en: "Dependencies are updated: `body-parser` goes to `2.4.0`, with the `qs` (`6.16.1`) and `iconv-lite` (`0.7.3`) it uses. These versions are pinned in the repository's `package-lock.json`: they protect clones and deployments done with `npm ci`.",
                                fr: "Des dépendances sont mises à jour : `body-parser` passe en `2.4.0`, avec les `qs` (`6.16.1`) et `iconv-lite` (`0.7.3`) qu'il utilise. Ces versions sont fixées dans le `package-lock.json` du dépôt : elles protègent les clones et les déploiements faits avec `npm ci`.",
                            },
                        ],
                    },
                ],
            },
            {
                id: "documentation",
                level: 2,
                title: { en: "Documentation", fr: "Documentation" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "The page of each endpoint touched by the release states its new limits: the parameters, the exact error messages and a note on what is bounded. **[POST /captcha](ref:captcha/verify)** documents its new `minLength` parameter. Exceptionally, the pages of `v4` and `v5` are updated too, for these limits and refusals only.",
                                fr: "La page de chaque endpoint touché par la version donne ses nouvelles limites : les paramètres, les messages d'erreur exacts et une note sur ce qui est borné. **[POST /captcha](ref:captcha/verify)** documente son nouveau paramètre `minLength`. Exceptionnellement, les pages de `v4` et de `v5` sont mises à jour aussi, pour ces limites et ces refus seulement.",
                            },
                            {
                                en: "The **[Authentication](ref:authentication#rate-limits)** page explains how requests are counted, per `/64` block and per `/48` network for IPv6, and the list of `429` errors of the **[home](ref:index#rate-limiting)** includes `Too many requests from your network.`.",
                                fr: "La page **[Authentification](ref:authentication#rate-limits)** explique comment les requêtes sont comptées, par bloc `/64` et par réseau `/48` pour l'IPv6, et la liste des erreurs `429` de l'**[accueil](ref:index#rate-limiting)** reprend `Too many requests from your network.`.",
                            },
                            {
                                en: "The **[Instance](ref:instance)** page lists `TRUSTED_PROXIES` and `GLOBAL_LIMIT` among the settings of an instance you run, with a warning on matching the proxy chain.",
                                fr: "La page **[Instance](ref:instance)** liste `TRUSTED_PROXIES` et `GLOBAL_LIMIT` parmi les réglages d'une instance que vous faites tourner, avec un avertissement sur l'alignement de la chaîne de proxys.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "6.1.0": {
        version: "v6",
        id: "changelog/6.1.0",
        kind: "release",
        title: { en: "6.1.0", fr: "6.1.0" },
        updated: "2026-10-18",
        release: {
            version: "6.1.0",
            url: "https://github.com/moxondev/api/tree/6.1.0",
            summary: {
                en: "New `@moxon/api` name, experimental `manifest` export, security fixes.",
                fr: "Nouveau nom `@moxon/api`, export `manifest` expérimental, correctifs de sécurité.",
            },
        },
        sections: [
            { id: "", blocks: [] },
            {
                id: "api",
                level: 2,
                title: { en: "API", fr: "API" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "The `@20syldev/api` package becomes **`@moxon/api`**, under the `@moxon` npm organization, and the repository now lives at `moxondev/api`. The old package no longer evolves; 6.1.0 is the first stable release published under the new name. The `/v6` HTTP API is unchanged: to migrate, run `npm uninstall @20syldev/api && npm install @moxon/api`, then rename your imports — the sub-paths are identical. The details are in the **[migration guide](ref:changelog#migrating-from-20syldev-api)**.",
                                fr: "Le paquet `@20syldev/api` devient **`@moxon/api`**, sous l'organisation npm `@moxon`, et le dépôt vit désormais sur `moxondev/api`. L'ancien paquet n'évolue plus ; la 6.1.0 est la première version stable publiée sous le nouveau nom. L'API HTTP `/v6` est inchangée : pour migrer, il suffit de lancer `npm uninstall @20syldev/api && npm install @moxon/api`, puis de renommer vos imports — les sous-chemins sont identiques. Le détail se trouve dans le **[guide de migration](ref:changelog#migrating-from-20syldev-api)**.",
                            },
                            {
                                en: "New **`@moxon/api/manifest`** export, *experimental*: it exposes `manifest`, a typed `ManifestEntry[]` array that describes the endpoints as data — name, method, path, category, the first version that serves it (`since`), parameters and a request example — without the function that runs them. It is meant for tools that document or call the API. Only `hash` is listed for now, and its shape may still change in a minor version. See the **[Manifest](ref:manifest)** page.",
                                fr: "Nouvel export **`@moxon/api/manifest`**, *expérimental* : il expose `manifest`, un tableau typé `ManifestEntry[]` qui décrit les endpoints sous forme de données — nom, méthode, chemin, catégorie, première version qui le sert (`since`), paramètres et exemple de requête — sans la fonction qui les exécute. Il s'adresse aux outils qui documentent ou appellent l'API. Seul `hash` y figure pour l'instant, et sa forme peut encore évoluer dans une version mineure. Voir la page **[Manifest](ref:manifest)**.",
                            },
                            {
                                en: "**[POST /hash](ref:hash)** is the first endpoint declared as a contract: the same declaration builds its HTTP route and its manifest entry, so the two can no longer drift apart. Its behaviour does not change: same parameters, same errors, same results from `v4` to `v6`.",
                                fr: "L'endpoint **[POST /hash](ref:hash)** est le premier à être déclaré comme un contrat : la même déclaration construit sa route HTTP et son entrée du manifest, si bien que les deux ne peuvent plus diverger. Son comportement ne change pas : mêmes paramètres, mêmes erreurs, mêmes résultats de `v4` à `v6`.",
                            },
                            {
                                en: "`/favicon.ico` is no longer served by the API: the file also leaves the package, which gets about 250 kB lighter.",
                                fr: "`/favicon.ico` n'est plus servi par l'API : le fichier quitte aussi le paquet, qui s'allège d'environ 250 ko.",
                            },
                            {
                                en: "Dependencies are updated for security fixes: `proxy-addr`, used by Express (a **critical** IP spoofing flaw through an IPv4-mapped IPv6 trust subnet), and `brace-expansion`, present only in the development tooling. These versions are pinned in the repository's `package-lock.json`: they protect clones and deployments done with `npm ci`.",
                                fr: "Des dépendances sont mises à jour pour des correctifs de sécurité : `proxy-addr`, utilisé par Express (faille **critique** d'usurpation d'adresse IP via un sous-réseau de confiance IPv6 mappé en IPv4), et `brace-expansion`, présent uniquement dans l'outillage de développement. Ces versions sont fixées dans le `package-lock.json` du dépôt : elles protègent les clones et les déploiements faits avec `npm ci`.",
                            },
                        ],
                    },
                ],
            },
            {
                id: "documentation",
                level: 2,
                title: { en: "Documentation", fr: "Documentation" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "The documentation is now hosted on **moxon.dev**.",
                                fr: "La documentation est désormais hébergée sur **moxon.dev**.",
                            },
                            {
                                en: "New documentation site, rebuilt with Next.js: a catalog of 49 endpoints in 7 categories, a keyboard search palette with the `post:` and `get:` filters, a dark theme and a layout made for phones.",
                                fr: "Nouveau site de documentation, reconstruit avec Next.js : catalogue de 49 endpoints en 7 catégories, palette de recherche au clavier avec les filtres `post:` et `get:`, thème sombre et affichage adapté au téléphone.",
                            },
                            {
                                en: "Page addresses change: `/v6/hash` in English and `/fr/v6/hash` in French. The old addresses (`/v6/fr/hash`, `/v6/en/hash`) redirect automatically to the new ones.",
                                fr: "Les adresses des pages changent : `/v6/hash` en anglais et `/fr/v6/hash` en français. Les anciennes adresses (`/v6/fr/hash`, `/v6/en/hash`) redirigent automatiquement vers les nouvelles.",
                            },
                            {
                                en: "Heading anchors are now the same in both languages (`#response-fields`); the old French fragments are redirected.",
                                fr: "Les ancres des titres sont désormais identiques dans les deux langues (`#response-fields`) ; les anciens fragments français sont redirigés.",
                            },
                            {
                                en: "The home page example no longer calls the API on every visit.",
                                fr: "L'exemple de la page d'accueil n'appelle plus l'API à chaque visite.",
                            },
                            {
                                en: "The home page no longer shows the version cards: the version picker of the header replaces them.",
                                fr: "La page d'accueil n'affiche plus les cartes de version : le sélecteur de version de l'en-tête les remplace.",
                            },
                            {
                                en: "Added the **[Manifest](ref:manifest)** page, which presents the experimental `@moxon/api/manifest` export.",
                                fr: "Ajout de la page **[Manifest](ref:manifest)**, qui présente l'export expérimental `@moxon/api/manifest`.",
                            },
                            {
                                en: "Added an installation section to the **[Getting Started](ref:index)** page, with `npm install @moxon/api` and the package entry points.",
                                fr: "Ajout d'une section d'installation sur la page **[Commencer](ref:index)**, avec `npm install @moxon/api` et les points d'entrée du paquet.",
                            },
                            {
                                en: "Added a migration guide from `@20syldev/api` to the **[Changelog](ref:changelog)** page: the commands, the import renaming table and the note on `v1`–`v3`.",
                                fr: "Ajout d'un guide de migration depuis `@20syldev/api` sur la page **[Changelog](ref:changelog)** : les commandes, la table de renommage des imports et la note sur `v1`–`v3`.",
                            },
                            {
                                en: "Corrected the Tic-Tac-Toe documentation: `POST /tic-tac-toe` has answered `404` in v6 since 6.0.0, yet it was still presented as the game's main endpoint. The page, the sidebar and the Playground now rely on the `/tic-tac-toe/play`, `/tic-tac-toe/forfeit`, `/tic-tac-toe/fetch` and `/tic-tac-toe/list` routes. The migration table of the **[Changelog](ref:changelog)** page now also lists the move of `POST /tic-tac-toe` to `POST /tic-tac-toe/play`.",
                                fr: "Correction de la documentation du Tic-Tac-Toe : `POST /tic-tac-toe` répond `404` en v6 depuis la 6.0.0, mais figurait encore comme endpoint principal du jeu. La page, la sidebar et le Playground s'appuient désormais sur les routes `/tic-tac-toe/play`, `/tic-tac-toe/forfeit`, `/tic-tac-toe/fetch` et `/tic-tac-toe/list`. Le tableau de migration de la page **[Changelog](ref:changelog)** liste aussi le passage de `POST /tic-tac-toe` à `POST /tic-tac-toe/play`.",
                            },
                            {
                                en: "Clarified on the **[Infos](ref:infos)** page what the `endpoints` field counts: the distinct paths of the requested version, so `GET /chat` and `POST /chat` count as one.",
                                fr: "Précision sur la page **[Infos](ref:infos)** de ce que compte le champ `endpoints` : les chemins distincts de la version demandée, si bien que `GET /chat` et `POST /chat` ne comptent que pour un.",
                            },
                            {
                                en: "Added the `encoding` field to the response fields of **[POST /hash](ref:hash)**.",
                                fr: "Ajout du champ `encoding` aux champs de réponse de **[POST /hash](ref:hash)**.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "6.0.0": {
        version: "v6",
        id: "changelog/6.0.0",
        kind: "release",
        title: { en: "6.0.0", fr: "6.0.0" },
        updated: "2026-10-17",
        release: {
            version: "6.0.0",
            url: "https://github.com/moxondev/api/releases/tag/6.0.0",
            summary: {
                en: "Identifiers out of URLs, v1–v3 retired, rate limit headers.",
                fr: "Identifiants hors des URL, retrait de v1–v3, en-têtes de limite.",
            },
        },
        sections: [
            { id: "", blocks: [] },
            {
                id: "api",
                level: 2,
                title: { en: "API", fr: "API" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "**[GET /captcha](ref:captcha)** now answers in `challenge` mode **by default**: the image comes with a signed token instead of the answer in clear, and its rendering is hardened against automated reading. The historical generator stays available through `?mode=image`, for anyone who needs to read the answer server-side.",
                                fr: "L'endpoint **[GET /captcha](ref:captcha)** répond désormais en mode `challenge` **par défaut** : l'image arrive avec un jeton signé plutôt qu'avec la réponse en clair, et son rendu est durci contre la lecture automatique. Le générateur historique reste disponible via `?mode=image`, pour qui a besoin de récupérer la réponse côté serveur.",
                            },
                            {
                                en: "Versions **`v1`, `v2` and `v3`** are retired, along with all the untyped JavaScript they shared. The API now serves only `v4`, `v5` and `v6` — install `@20syldev/api@5.9.0` if you still need an older one.",
                                fr: "Les versions **`v1`, `v2` et `v3`** sont retirées, avec tout le JavaScript non typé qu'elles partageaient. L'API ne sert plus que `v4`, `v5` et `v6` — installez `@20syldev/api@5.9.0` pour qui en a encore besoin.",
                            },
                            {
                                en: "**[POST /levenshtein](ref:levenshtein)** moves from `GET` to `POST`: the two strings being compared no longer travel in the URL, and therefore no longer through browser history or the logs of any intermediary.",
                                fr: "L'endpoint **[POST /levenshtein](ref:levenshtein)** passe en `POST` : les deux textes comparés ne transitent plus par l'URL, donc plus par l'historique de navigation ni les journaux d'un intermédiaire.",
                            },
                            {
                                en: "Sensitive identifiers leave the URL: `DELETE /chat/:token` becomes **[POST /chat/clear](ref:chat/clear)**, and `PATCH`/`DELETE /tic-tac-toe/:game` become **[POST /tic-tac-toe/play](ref:tic-tac-toe/play)** and **[POST /tic-tac-toe/forfeit](ref:tic-tac-toe/forfeit)**. The `PATCH` and `DELETE` methods disappear from the API entirely.",
                                fr: "Les identifiants sensibles sortent des URL : `DELETE /chat/:token` devient **[POST /chat/clear](ref:chat/clear)**, et `PATCH`/`DELETE /tic-tac-toe/:game` deviennent **[POST /tic-tac-toe/play](ref:tic-tac-toe/play)** et **[POST /tic-tac-toe/forfeit](ref:tic-tac-toe/forfeit)**. Les méthodes `PATCH` et `DELETE` disparaissent de l'API.",
                            },
                            {
                                en: "Error responses now return `status` as a **number** rather than a string.",
                                fr: "Les réponses d'erreur renvoient `status` en **nombre** plutôt qu'en chaîne de caractères.",
                            },
                            {
                                en: "Every response now carries the `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers, and a `Retry-After` accompanies a `429` refusal — a client can finally pace itself instead of discovering its limit by hitting it.",
                                fr: "Toute réponse porte désormais les en-têtes `X-RateLimit-Limit`, `X-RateLimit-Remaining` et `X-RateLimit-Reset`, et un `Retry-After` accompagne les refus `429` — un client peut enfin s'auto-réguler au lieu de découvrir sa limite en la dépassant.",
                            },
                            {
                                en: "**[POST /hyperplanning](ref:hyperplanning)** is **deprecated**: it keeps working on every version, but `v6` no longer lists it among its available endpoints. It will be removed for good in `7.0.0`.",
                                fr: "L'endpoint **[POST /hyperplanning](ref:hyperplanning)** est **déprécié** : il continue de fonctionner sur toutes les versions, mais `v6` ne le liste plus parmi ses endpoints disponibles. Il sera retiré pour de bon en `7.0.0`.",
                            },
                        ],
                    },
                ],
            },
            {
                id: "documentation",
                level: 2,
                title: { en: "Documentation", fr: "Documentation" },
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "Added the **v6** documentation, in English and French, with its own sidebar, version switcher entry and changelog.",
                                fr: "Ajout de la documentation **v6**, en français et en anglais, avec sa propre sidebar, son entrée dans le sélecteur de version et son changelog.",
                            },
                            {
                                en: "Rewrote the pages of the four endpoints whose method or path changed, each carrying a callout explaining what moved and why.",
                                fr: "Réécriture des pages des quatre endpoints dont la méthode ou le chemin change, chacune portant un encart expliquant ce qui bouge et pourquoi.",
                            },
                            {
                                en: "Documented the new rate limit headers on the **[Authentication](ref:authentication)** page, and flagged the `status` type change on **[Getting Started](ref:index)**.",
                                fr: "Documentation des nouveaux en-têtes de limite sur la page **[Authentification](ref:authentication)**, et signalement du changement de type de `status` sur **[Commencer](ref:index)**.",
                            },
                            {
                                en: "Sidebar and Playground no longer offer `PATCH` or `DELETE` anywhere in v6, and the endpoint registry now describes per-version differences so v4 and v5 keep showing their own methods.",
                                fr: "La sidebar et le Playground ne proposent plus aucun `PATCH` ni `DELETE` en v6, et le registre d'endpoints décrit désormais les différences par version pour que v4 et v5 conservent leurs propres méthodes.",
                            },
                            {
                                en: "Pages for `v1`, `v2` and `v3` now carry a banner stating the API no longer serves them.",
                                fr: "Les pages de `v1`, `v2` et `v3` portent maintenant un bandeau indiquant que l'API ne les sert plus.",
                            },
                            {
                                en: "Moved the paid plans to Patreon and updated their prices.",
                                fr: "Passage des offres payantes sur Patreon et mise à jour de leurs tarifs.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
