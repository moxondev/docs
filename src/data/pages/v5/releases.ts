import type { Page } from "@/types/content";

export const releases: Record<string, Page> = {
    "5.9.0": {
        version: "v5",
        id: "changelog/5.9.0",
        kind: "release",
        title: { en: "5.9.0", fr: "5.9.0" },
        updated: "2026-10-17",
        release: {
            version: "5.9.0",
            url: "https://github.com/moxondev/api/releases/tag/5.9.0",
            summary: {
                en: "Proof of work & captcha challenge.",
                fr: "Preuve de travail & captcha challenge.",
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
                                en: "Added endpoint **[GET /pow](ref:pow)**: a proof of work replacing the captcha — the server issues a `salt` and a difficulty, the client looks for a `nonce` whose `sha256` fingerprint starts with that many zeros, then posts it back for verification. At the default difficulty of `4`, solving takes under a second in a browser and stays imperceptible to a person, but becomes ruinous for a bot repeating it thousands of times. It is the only anti-bot protection a vision model cannot shortcut, and the documentation now recommends preferring it over the visual captcha.",
                                fr: "Ajout de l'endpoint **[GET /pow](ref:pow)** : une preuve de travail en remplacement du captcha — le serveur émet un `salt` et une difficulté, le client cherche un `nonce` dont l'empreinte `sha256` commence par autant de zéros, puis le renvoie pour vérification. À la difficulté par défaut de `4`, la résolution prend moins d'une seconde dans un navigateur et reste imperceptible pour une personne, mais devient ruineuse pour un robot qui la répète des milliers de fois. C'est la seule protection anti-bot qu'un modèle de vision ne sait pas contourner, et la documentation recommande désormais de la préférer au captcha visuel.",
                            },
                            {
                                en: '**[GET /captcha](ref:captcha)** gains a `challenge` mode: the image comes with a signed token in the `X-Captcha-Token` header, and the answer is no longer delivered in clear. It exists only inside the token\'s signature — impossible to extract, even by intercepting the response. A `POST /captcha` carrying `token` and `answer` then returns `{ "valid": true }`.',
                                fr: "**[GET /captcha](ref:captcha)** gagne un mode `challenge` : l'image arrive accompagnée d'un jeton signé dans l'en-tête `X-Captcha-Token`, et la réponse n'est plus livrée en clair. Elle n'existe que dans la signature du jeton — impossible à extraire, même en interceptant la réponse. Un `POST /captcha` portant `token` et `answer` renvoie ensuite `{ \"valid\": true }`.",
                            },
                            {
                                en: "The rendering of that `challenge` mode is hardened against automated reading: glyphs overlap so they cannot be segmented, ride a sine baseline, mix font families, and are crossed by strokes drawn in the text's own colors, which no filter can remove. The default mode does not change by a single pixel.",
                                fr: "Le rendu de ce mode `challenge` est durci contre la lecture automatique : les glyphes se chevauchent pour empêcher leur découpage, suivent une ligne de base sinusoïdale, mélangent plusieurs polices, et sont traversés par des traits de la même couleur que le texte, qu'aucun filtre ne peut donc retirer. Le mode par défaut, lui, ne change pas d'un pixel.",
                            },
                            {
                                en: "Captcha and proof-of-work tokens are single-use and expire after `5` minutes: a replayed token answers `used`, an expired one `expired`, a forged one or one from another instance `wrong`.",
                                fr: "Les jetons de captcha et de preuve de travail sont à usage unique et expirent au bout de `5` minutes : un jeton rejoué répond `used`, un jeton périmé `expired`, un jeton falsifié ou issu d'une autre instance `wrong`.",
                            },
                            {
                                en: "The `CHALLENGE_SECRET` variable signs those tokens. Until it is set, each process invents its own key: tokens stop being valid after a restart and are rejected by neighbouring instances — to be defined for any deployment running more than one process.",
                                fr: "La variable `CHALLENGE_SECRET` signe ces jetons. Tant qu'elle n'est pas définie, chaque processus s'invente sa propre clé : les jetons cessent d'être valides après un redémarrage et sont rejetés par les instances voisines — à définir pour tout déploiement qui fait tourner plus d'un processus.",
                            },
                            {
                                en: "The `X-Captcha-Text` and `X-Captcha-Token` headers are now exposed to browser JavaScript; until now they stayed invisible from a web page, for lack of a CORS declaration.",
                                fr: "Les en-têtes `X-Captcha-Text` et `X-Captcha-Token` sont désormais exposés au JavaScript des navigateurs ; ils restaient jusqu'ici invisibles depuis une page web, faute de déclaration CORS.",
                            },
                            {
                                en: "Logs now distinguish severity levels: a server error is recorded as `error`, a client refusal as `warn`, and the rest as `info`.",
                                fr: "Les journaux distinguent maintenant les niveaux de gravité : une erreur serveur est enregistrée en `error`, un refus client en `warn`, et le reste en `info`.",
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
                                en: "Added the documentation pages for **[Pow](ref:pow)**, covering the challenge and a browser solving example, and **[Pow verification](ref:pow/verify)** for checking a solved challenge.",
                                fr: "Ajout des pages de documentation pour **[Pow](ref:pow)** — le défi et un exemple de résolution dans le navigateur — et **[Vérification Pow](ref:pow/verify)** pour contrôler un défi résolu.",
                            },
                            {
                                en: "Rewrote **[Captcha](ref:captcha)** for the two modes, with a callout recommending **[Pow](ref:pow)** for anti-bot protection, and added **[Captcha verification](ref:captcha/verify)** for the `POST` route.",
                                fr: "Réécriture de **[Captcha](ref:captcha)** pour les deux modes, avec un encadré recommandant **[Pow](ref:pow)** pour la protection anti-bot, et ajout de **[Vérification Captcha](ref:captcha/verify)** pour la route `POST`.",
                            },
                            {
                                en: "Both endpoints now expose one page per HTTP method, grouped in the sidebar like Chat and Tic-Tac-Toe.",
                                fr: "Les deux endpoints exposent désormais une page par méthode HTTP, regroupées dans le sidebar comme Chat et Tic-Tac-Toe.",
                            },
                            {
                                en: "Corrected stale values on the Captcha page inherited from v4: the `width` default is 60 × the text length rather than `300`, `height` is `120` rather than `150`, `noise` is a level (`low`, `medium`, `high`) rather than a number of lines, and the `Noise must be one of…` error starts with a capital letter.",
                                fr: "Correction de valeurs périmées héritées de la v4 sur la page Captcha : la largeur par défaut vaut 60 × la longueur du texte et non `300`, la hauteur `120` et non `150`, `noise` est un niveau (`low`, `medium`, `high`) et non un nombre de lignes, et l'erreur `Noise must be one of…` commence par une majuscule.",
                            },
                            {
                                en: "Added the endpoint to the sidebar, the Playground registry and the homepage feature cards.",
                                fr: "Ajout de l'endpoint dans le sidebar, le registre Playground et les cartes de la page d'accueil.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "5.8.0": {
        version: "v5",
        id: "changelog/5.8.0",
        kind: "release",
        title: { en: "5.8.0", fr: "5.8.0" },
        updated: "2026-10-17",
        release: {
            version: "5.8.0",
            url: "https://github.com/moxondev/api/releases/tag/5.8.0",
            summary: "Base, UUID, Semver, Read & Diff.",
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
                                en: "Added endpoint **[GET /base](ref:base)**: converts a number between two numeric bases from `2` to `36` — `?value=255&from=10&to=16` returns `ff` — with `10` and `16` as defaults. Very large numbers keep their exact precision, far beyond what a JavaScript integer can represent.",
                                fr: "Ajout de l'endpoint **[GET /base](ref:base)** : conversion d'un nombre entre deux bases numériques de `2` à `36` — `?value=255&from=10&to=16` renvoie `ff` — avec `10` et `16` comme valeurs par défaut. Les très grands nombres conservent leur précision exacte, bien au-delà de ce qu'un entier JavaScript sait représenter.",
                            },
                            {
                                en: "Added endpoint **[GET /uuid](ref:uuid)**: generates RFC 4122 UUID v4 values, up to `50` at once with `count`, or parses an existing identifier (`?uuid={uuid}`) to extract its version and variant. A malformed UUID answers `valid: false` instead of an error, which makes the endpoint usable as a validator.",
                                fr: "Ajout de l'endpoint **[GET /uuid](ref:uuid)** : génère un UUID v4 conforme à la RFC 4122, jusqu'à `50` d'un coup avec `count`, ou analyse un identifiant existant (`?uuid={uuid}`) pour en extraire sa version et son variant. Un UUID mal formé répond `valid: false` au lieu d'une erreur, ce qui permet de s'en servir comme validateur.",
                            },
                            {
                                en: "Added endpoint **[GET /semver](ref:semver)**: parses a semantic version — `1.2.3-beta.1+build.42` yields its `major`, `minor`, `patch`, `prerelease` and `build` — bumps it (`action=bump&part=minor` gives `1.3.0`) or compares two versions (`action=compare&other=1.3.0`). Comparison follows the specification down to prerelease identifiers: `1.0.0-alpha` precedes `1.0.0-beta`, which precedes `1.0.0`.",
                                fr: "Ajout de l'endpoint **[GET /semver](ref:semver)** : décompose une version sémantique — `1.2.3-beta.1+build.42` livre ses `major`, `minor`, `patch`, `prerelease` et `build` —, l'incrémente (`action=bump&part=minor` donne `1.3.0`) ou compare deux versions (`action=compare&other=1.3.0`). La comparaison respecte la spécification jusqu'aux identifiants de préversion : `1.0.0-alpha` précède `1.0.0-beta`, qui précède `1.0.0`.",
                            },
                            {
                                en: "Added endpoint **[POST /read](ref:read)**: computes Flesch readability scores for a text, with word, sentence and syllable counts plus an estimated reading time. French is supported through `lang=fr`, which applies the Kandel & Moles adaptation; English remains the default.",
                                fr: "Ajout de l'endpoint **[POST /read](ref:read)** : calcule les scores de lisibilité Flesch d'un texte, avec le détail des mots, phrases et syllabes ainsi qu'un temps de lecture estimé. Le français est pris en charge par `lang=fr`, qui applique l'adaptation Kandel & Moles ; l'anglais reste la langue par défaut.",
                            },
                            {
                                en: "Added endpoint **[POST /diff](ref:diff)**: compares two texts and returns the sequence of equal, added and removed segments, line by line or word by word (`mode=word`), along with the count of additions and deletions.",
                                fr: "Ajout de l'endpoint **[POST /diff](ref:diff)** : compare deux textes et renvoie la suite des segments identiques, ajoutés et supprimés, ligne par ligne ou mot par mot (`mode=word`), accompagnée du décompte des ajouts et des suppressions.",
                            },
                            {
                                en: "`/logs` is now closed by default: without `LOGS_TOKEN` it answers like an unknown path instead of leaving the instance traffic readable by anyone who guesses the URL. It only opens once the token is configured, still through the `X-Logs-Token` header.",
                                fr: "L'endpoint `/logs` est désormais fermé par défaut : sans `LOGS_TOKEN`, il répond comme un chemin inconnu au lieu de laisser le trafic de l'instance accessible à qui devine l'URL. Il ne s'ouvre qu'une fois le jeton configuré, toujours via l'en-tête `X-Logs-Token`.",
                            },
                            {
                                en: "Limits protect the new endpoints: `100` characters for a value to convert, `256` for a version, `10,000` characters and `2000` segments for a diff, `50,000` characters for an analyzed text.",
                                fr: "Des limites protègent les nouveaux endpoints : `100` caractères pour une valeur à convertir, `256` pour une version, `10 000` caractères et `2000` segments pour un diff, `50 000` caractères pour un texte analysé.",
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
                                en: "Added documentation pages for **[Base](ref:base)**, **[UUID](ref:uuid)**, **[Semver](ref:semver)**, **[Read](ref:read)** and **[Diff](ref:diff)**.",
                                fr: "Ajout des pages de documentation pour **[Base](ref:base)**, **[UUID](ref:uuid)**, **[Semver](ref:semver)**, **[Read](ref:read)** et **[Diff](ref:diff)**.",
                            },
                            {
                                en: "Added the five endpoints to the sidebar, the Playground registry and the homepage feature cards.",
                                fr: "Ajout des cinq endpoints dans le sidebar, le registre Playground et les cartes de la page d'accueil.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "5.7.0": {
        version: "v5",
        id: "changelog/5.7.0",
        kind: "release",
        title: { en: "5.7.0", fr: "5.7.0" },
        updated: "2026-10-17",
        release: {
            version: "5.7.0",
            url: "https://github.com/moxondev/api/releases/tag/5.7.0",
            summary: {
                en: "npm package & instance configuration.",
                fr: "Paquet npm & configuration d'instance.",
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
                                en: "The `@20syldev/api` package now imports directly: `import { evaluate } from '@20syldev/api'` targets the latest version, `@20syldev/api/server` starts the full API with every version mounted, and TypeScript declarations ship with it. The `/v1` and `/v2` subpaths pointed at non-existent files — fixed.",
                                fr: "Le paquet `@20syldev/api` s'importe désormais directement : `import { evaluate } from '@20syldev/api'` cible la dernière version, `@20syldev/api/server` démarre l'API complète avec toutes ses versions montées, et les déclarations TypeScript sont livrées avec. Les sous-chemins `/v1` et `/v2` pointaient vers des fichiers inexistants — c'est corrigé.",
                            },
                            {
                                en: "**[GET /url](ref:url)** returns the scheme's default port when the URL omits it: `443` for `https` and `wss`, `80` for `http` and `ws`, `21` for `ftp`. `null` is now reserved for schemes with no known default.",
                                fr: "**[GET /url](ref:url)** renvoie le port par défaut du schéma quand l'URL n'en précise aucun : `443` pour `https` et `wss`, `80` pour `http` et `ws`, `21` pour `ftp`. `null` reste réservé aux schémas sans port connu.",
                            },
                            {
                                en: "Instance metadata becomes configurable — `DOCS_URL`, `REPO_URL`, `INSTANCE_CREATED` — and each field disappears from **[GET /infos](ref:infos)** until it is set, so a self-hosted instance no longer advertises someone else's documentation or repository.",
                                fr: "Les métadonnées d'instance deviennent configurables — `DOCS_URL`, `REPO_URL`, `INSTANCE_CREATED` — et chaque champ disparaît de **[GET /infos](ref:infos)** tant qu'il n'est pas renseigné : une instance auto-hébergée n'affiche plus la documentation ni le dépôt de quelqu'un d'autre.",
                            },
                            {
                                en: "`/logs` can be gated behind a token, expected in the `X-Logs-Token` header and defined by `LOGS_TOKEN`. Without that variable it stays open, as before.",
                                fr: "L'endpoint `/logs` peut être fermé par un jeton, attendu dans l'en-tête `X-Logs-Token` et défini par `LOGS_TOKEN`. Sans cette variable il reste ouvert, comme avant.",
                            },
                            {
                                en: "Request logs no longer keep parameter values: `?text=secret` is recorded as `?text`. Private chat and game tokens carried in the path are masked too.",
                                fr: "Les journaux ne conservent plus les valeurs passées en paramètre : `?text=secret` est tracé en `?text`. Les jetons de conversation privée et de partie portés dans le chemin sont également masqués.",
                            },
                            {
                                en: "`TRUSTED_PROXIES` describes the trusted hops behind a CDN or platform router, as CIDR blocks or via the `loopback`, `linklocal` and `uniquelocal` shorthands.",
                                fr: "`TRUSTED_PROXIES` décrit les sauts de confiance derrière un CDN ou un routeur de plateforme, en blocs CIDR ou via les raccourcis `loopback`, `linklocal` et `uniquelocal`.",
                            },
                            {
                                en: "Error responses no longer carry the `documentation` link they used to include — the body is now `message`, `error` and `status` only.",
                                fr: "Les réponses d'erreur ne portent plus le lien `documentation` qu'elles incluaient — le corps se limite désormais à `message`, `error` et `status`.",
                            },
                            {
                                en: "**Node 22.12** becomes the minimum, which allows the package to be used in both ESM and CommonJS.",
                                fr: "**Node 22.12** devient le minimum requis, ce qui permet d'utiliser le paquet aussi bien en ESM qu'en CommonJS.",
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
                                en: "Removed the `documentation` field from every error example on the [Getting Started](ref:index) page, matching the lighter error body.",
                                fr: "Suppression du champ `documentation` de tous les exemples d'erreur de la page [Commencer](ref:index), conformément au corps d'erreur allégé.",
                            },
                            {
                                en: "Documented the per-scheme default ports on **[URL](ref:url)** and corrected the `port` field, which no longer returns `null` whenever the URL omits it.",
                                fr: "Documentation des ports par défaut par schéma sur **[URL](ref:url)** et correction du champ `port`, qui ne retourne plus `null` dès que l'URL l'omet.",
                            },
                            {
                                en: "Marked the `documentation`, `github` and `creation` fields on **[Infos](ref:infos)** as instance-dependent, since a self-hosted instance omits them unless configured.",
                                fr: "Mention du caractère dépendant de l'instance des champs `documentation`, `github` et `creation` sur **[Infos](ref:infos)**, une instance auto-hébergée les omettant si elle n'est pas configurée.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "5.6.0": {
        version: "v5",
        id: "changelog/5.6.0",
        kind: "release",
        title: { en: "5.6.0", fr: "5.6.0" },
        updated: "2026-10-17",
        release: {
            version: "5.6.0",
            url: "https://github.com/moxondev/api/releases/tag/5.6.0",
            summary: "URL & CSV.",
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
                                en: 'Added endpoint **[GET /url](ref:url)**: parses a URL into its structural components — scheme, host, port, path, query parameters, and fragment. Duplicate query parameters are grouped into an array (`?tag=js&tag=ts` {icon:arrow-right} `["js", "ts"]`).',
                                fr: 'Ajout de l\'endpoint **[GET /url](ref:url)** : décompose une URL en ses composants structurels — schéma, hôte, port, chemin, paramètres de requête et fragment. Les paramètres de requête dupliqués sont regroupés en tableau (`?tag=js&tag=ts` {icon:arrow-right} `["js", "ts"]`).',
                            },
                            {
                                en: "Added endpoint **[POST /csv](ref:csv)**: bidirectional conversion between CSV and JSON — `parse` turns CSV into an array of objects, `format` does the reverse — with a custom `delimiter` and optional `headers`.",
                                fr: "Ajout de l'endpoint **[POST /csv](ref:csv)** : conversion bidirectionnelle entre CSV et JSON — `parse` transforme un CSV en tableau d'objets, `format` fait l'inverse — avec un `delimiter` personnalisé et des `headers` optionnels.",
                            },
                            {
                                en: 'The CSV parser handles quoted fields, including escaped quotes (`""`) and newlines inside a field.',
                                fr: "Le parseur CSV gère les champs entre guillemets, y compris les guillemets échappés (`\"\"`) et les sauts de ligne à l'intérieur d'un champ.",
                            },
                            {
                                en: "Limits protect both endpoints: `2048` characters for a URL, `50,000` characters and `1000` rows for a CSV.",
                                fr: "Des limites protègent les deux endpoints : `2048` caractères pour une URL, `50 000` caractères et `1000` lignes pour un CSV.",
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
                                en: "Added documentation pages for **[URL](ref:url)** and **[CSV](ref:csv)**.",
                                fr: "Ajout des pages de documentation pour **[URL](ref:url)** et **[CSV](ref:csv)**.",
                            },
                            {
                                en: "Added both endpoints to the sidebar and Playground registry, and sorted the Playground registry alphabetically.",
                                fr: "Ajout des deux endpoints dans le sidebar et le registre Playground, et tri alphabétique complet du registre Playground.",
                            },
                            {
                                en: "Fixed a bug where JS and Python code examples broke on values containing newlines, quotes, or backslashes (e.g. the CSV `parse` example) — special characters are now properly escaped.",
                                fr: "Correction d'un bug où les exemples de code JS et Python cassaient sur des valeurs contenant des sauts de ligne, guillemets ou antislashs (ex. l'exemple `parse` de CSV) — les caractères spéciaux sont désormais correctement échappés.",
                            },
                            {
                                en: "Shortened the **Address** and **Matrix** feature card descriptions so they fit within 3 lines.",
                                fr: "Raccourcissement des descriptions des cartes **Address** et **Matrix** pour tenir sur 3 lignes.",
                            },
                            {
                                en: 'Fixed a stale "previous stable version" claim on the v2 getting started page — that status belongs to v4 now.',
                                fr: "Correction d'une mention obsolète « version stable précédente » sur la page de démarrage de la v2 — ce statut appartient désormais à la v4.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "5.5.0": {
        version: "v5",
        id: "changelog/5.5.0",
        kind: "release",
        title: { en: "5.5.0", fr: "5.5.0" },
        updated: "2026-10-17",
        release: {
            version: "5.5.0",
            url: "https://github.com/moxondev/api/releases/tag/5.5.0",
            summary: {
                en: "Auth endpoint & all-methods `/latest`.",
                fr: "Endpoint Auth & `/latest` toutes méthodes.",
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
                                en: "Added endpoint **[GET /auth](ref:authentication#checking-your-plan)**: checks a Bearer token and returns its `tier` and `limits` (`hourly`, `burst`). Without a token, returns the `default` tier; an invalid token returns a `401`.",
                                fr: "Ajout de l'endpoint **[GET /auth](ref:authentication#checking-your-plan)** : vérifie un token Bearer et retourne son `tier` et ses `limits` (`hourly`, `burst`). Sans token, retourne le tier `default` ; un token invalide retourne un `401`.",
                            },
                            {
                                en: "The `/latest` redirect now works for all HTTP methods: a `307` preserves the method and body, so `POST /latest/...`, `PATCH`, and `DELETE` requests now correctly redirect to the current version — previously only `GET` worked.",
                                fr: "La redirection `/latest` fonctionne désormais avec toutes les méthodes HTTP : un `307` préserve la méthode et le corps, donc les requêtes `POST /latest/...`, `PATCH` et `DELETE` sont maintenant correctement redirigées vers la version courante — auparavant, seul `GET` fonctionnait.",
                            },
                            {
                                en: "The `@20syldev/api` npm package is now generic: the personal `/website` endpoint moved out of the core into an optional plugin system, excluded from the npm package.",
                                fr: "Le paquet npm `@20syldev/api` est désormais générique : l'endpoint personnel `/website` est sorti du cœur vers un système de plugins optionnels, exclu du paquet npm.",
                            },
                            {
                                en: "Internal robustness: fixed a non-deterministic time-based test and a formatting pass.",
                                fr: "Robustesse interne : correction d'un test temporel non déterministe et passe de formatage.",
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
                                en: "Documented **[GET /auth](ref:authentication#checking-your-plan)** on the Authentication page: usage, response fields, and the `default` tier behavior when no token is provided.",
                                fr: "Documentation de **[GET /auth](ref:authentication#checking-your-plan)** sur la page Authentification : utilisation, champs de réponse, et comportement du tier `default` sans token.",
                            },
                            {
                                en: "Noted that `/latest` now preserves the method and body for non-`GET` requests in the migration guide.",
                                fr: "Ajout d'une note sur la préservation de la méthode et du corps par `/latest` pour les requêtes non-`GET` dans le guide de migration.",
                            },
                            {
                                en: "Fixed stale `/v4/` cross-links between the Authentication and Pricing pages — both should have pointed to `/v5/`.",
                                fr: "Correction des liens `/v4/` obsolètes entre les pages Authentification et Tarification — les deux auraient dû pointer vers `/v5/`.",
                            },
                            {
                                en: 'Consolidated the duplicated auth header/error examples from the Pricing page onto Authentication, and moved its "No Token" callout there.',
                                fr: "Regroupement des exemples dupliqués (header d'auth, erreur) de la page Tarification sur Authentification, et déplacement de sa note « Aucun token ».",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "5.4.0": {
        version: "v5",
        id: "changelog/5.4.0",
        kind: "release",
        title: { en: "5.4.0", fr: "5.4.0" },
        updated: "2026-10-17",
        release: {
            version: "5.4.0",
            url: "https://github.com/moxondev/api/releases/tag/5.4.0",
            summary: { en: "Stability and hardening.", fr: "Stabilité et durcissement." },
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
                                en: "Fixed **[/address](ref:address)** (street word order for `us`, `uk`, and `de` addresses, e.g. `42 Main Street`) and **[/text](ref:text)** (now correctly writes `soixante et onze` for French 71).",
                                fr: "Correction de **[/address](ref:address)** (ordre des mots de rue pour les adresses `us`, `uk` et `de`, ex. `42 Main Street`) et de **[/text](ref:text)** (écrit désormais correctement `soixante et onze` pour 71 en français).",
                            },
                            {
                                en: "Hardened crypto modules: **[/otp](ref:otp)** fixes a counter-zero underflow and switches to a timing-safe comparison, **[/symmetric](ref:symmetric)** adds an integrity MAC to CBC mode, and **[/asymmetric](ref:asymmetric)** derives its size limit from the actual key modulus instead of the client-supplied value.",
                                fr: "Fiabilisation des modules cryptographiques : **[/otp](ref:otp)** corrige l'underflow du compteur à zéro et passe à une comparaison à temps constant, **[/symmetric](ref:symmetric)** ajoute un MAC d'intégrité en mode CBC, et **[/asymmetric](ref:asymmetric)** calcule sa limite de taille à partir du module réel de la clé plutôt que de la valeur fournie par le client.",
                            },
                            {
                                en: 'Fixed compute and rendering modules: **[/evaluate](ref:evaluate)** (unary minus precedence, malformed numbers), **[/matrix](ref:matrix)** (false "singular matrix" from determinant rounding), **[/algorithms](ref:algorithms)** (integer validation for `isprime` and `factorial`), and **[/chart](ref:chart)** (all-zero, single-slice, and single-label data).',
                                fr: "Corrections des modules de calcul et de rendu : **[/evaluate](ref:evaluate)** (priorité de l'unaire `-` et nombres malformés), **[/matrix](ref:matrix)** (fausse matrice singulière due à l'arrondi du déterminant), **[/algorithms](ref:algorithms)** (validation des entiers pour `isprime` et `factorial`) et **[/chart](ref:chart)** (données nulles, à tranche unique ou à label unique).",
                            },
                            {
                                en: "Fixed **[/barcode](ref:barcode)** (inverted rendering, EAN-8 check digit), **[/jwt](ref:jwt)** (rejects non-object `header`/`payload`), **[/case](ref:case)** (rejects separator-only input), **[/chat](ref:chat)** (session eviction, private room pruning), and **[/tic-tac-toe](ref:tic-tac-toe)** (player registration, casing, cleanup timers).",
                                fr: "Corrections de **[/barcode](ref:barcode)** (rendu inversé et chiffre de contrôle EAN-8), **[/jwt](ref:jwt)** (rejet des `header`/`payload` non-objets), **[/case](ref:case)** (rejet des entrées composées uniquement de séparateurs), **[/chat](ref:chat)** (éviction de session et purge des salons privés) et **[/tic-tac-toe](ref:tic-tac-toe)** (inscription des joueurs, casse et minuteurs de nettoyage).",
                            },
                            {
                                en: "Hardened GET routes against array-valued query parameters, NaN inputs, and missing modules; the error handler is now registered after routes, and unknown endpoints return a structured **JSON 404** instead of an HTML page.",
                                fr: "Durcissement des routes `GET` face aux paramètres en tableau, aux valeurs `NaN` et aux modules absents ; le gestionnaire d'erreurs est désormais enregistré après les routes, et les endpoints inconnus retournent un **404 en JSON** structuré au lieu d'une page HTML.",
                            },
                            {
                                en: "Fixed a rate-limiting off-by-one and evict stale users; the **`/latest`** redirect now preserves the full path and query string.",
                                fr: "Correction d'un off-by-one dans le contrôle de débit et éviction des utilisateurs inactifs ; la redirection **`/latest`** conserve désormais le chemin complet et les paramètres de requête.",
                            },
                            {
                                en: "Added a large batch of unit and integration tests covering these fixes.",
                                fr: "Ajout d'une large batterie de tests unitaires et d'intégration couvrant ces correctifs.",
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
                                en: "Documented the country-dependent street word order on **[Address](ref:address)**.",
                                fr: "Documentation de l'ordre des mots de rue selon le pays sur **[Address](ref:address)**.",
                            },
                            {
                                en: "Added the new `count`/`size`/`width`+`height` NaN-guard errors to **[Address](ref:address)**, **[Avatar](ref:avatar)**, **[Barcode](ref:barcode)**, and **[Cron](ref:cron)**.",
                                fr: "Ajout des nouvelles erreurs de garde `NaN` (`count`/`size`/`width`+`height`) sur **[Address](ref:address)**, **[Avatar](ref:avatar)**, **[Barcode](ref:barcode)** et **[Cron](ref:cron)**.",
                            },
                            {
                                en: "Added the new `factorial`/`isprime` validation errors to **[Algorithms](ref:algorithms)**.",
                                fr: "Ajout des nouvelles erreurs de validation `factorial`/`isprime` sur **[Algorithms](ref:algorithms)**.",
                            },
                            {
                                en: "Clarified that **[Asymmetric](ref:asymmetric)**'s `modulusLength` only applies to `keygen`, and broadened the invalid key format description.",
                                fr: "Clarification que `modulusLength` sur **[Asymmetric](ref:asymmetric)** ne s'applique qu'à `keygen`, et élargissement de la description de l'erreur de clé invalide.",
                            },
                            {
                                en: "Updated **[JWT](ref:jwt)** error messages for the new non-object header/payload rejection.",
                                fr: "Mise à jour des messages d'erreur de **[JWT](ref:jwt)** pour le rejet des `header`/`payload` non-objets.",
                            },
                            {
                                en: "Added the new separator-only input error to **[Case](ref:case)**.",
                                fr: "Ajout de la nouvelle erreur d'entrée composée uniquement de séparateurs sur **[Case](ref:case)**.",
                            },
                            {
                                en: "Documented unary minus precedence and the new malformed-number error on **[Evaluate](ref:evaluate)**.",
                                fr: "Documentation de la priorité de l'unaire `-` et de la nouvelle erreur de nombre malformé sur **[Evaluate](ref:evaluate)**.",
                            },
                            {
                                en: "Updated **[Symmetric](ref:symmetric)**'s blob format for the CBC integrity MAC, with a breaking-change note for pre-5.4.0 CBC blobs.",
                                fr: "Mise à jour du format de blob de **[Symmetric](ref:symmetric)** pour le MAC d'intégrité CBC, avec une note de changement cassant pour les blobs CBC antérieurs à la 5.4.0.",
                            },
                            {
                                en: "Added a JSON 404 example to the [Getting Started](ref:index) error handling section, and a nested-path/query example for `/latest` to the changelog migration guide.",
                                fr: "Ajout d'un exemple de 404 JSON dans la section de gestion des erreurs de [Commencer](ref:index), et d'un exemple de chemin imbriqué/query string pour `/latest` dans le guide de migration du changelog.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "5.3.0": {
        version: "v5",
        id: "changelog/5.3.0",
        kind: "release",
        title: { en: "5.3.0", fr: "5.3.0" },
        updated: "2026-10-17",
        release: {
            version: "5.3.0",
            url: "https://github.com/moxondev/api/releases/tag/5.3.0",
            summary: "Case & JWT.",
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
                                en: "Added endpoint **[GET /case](ref:case)**: converts text between 9 case formats using universal tokenization that handles camelCase splitting, `_`, `-`, `.`, and spaces. Supported targets: `camel`, `pascal`, `snake`, `kebab`, `constant`, `title`, `sentence`, `upper`, and `lower`. Returns the original text, the target format, and the converted result.",
                                fr: "Ajout de l'endpoint **[GET /case](ref:case)** : convertit un texte entre 9 formats de casse avec une tokenisation universelle gérant le split camelCase, `_`, `-`, `.` et les espaces. Formats disponibles : `camel`, `pascal`, `snake`, `kebab`, `constant`, `title`, `sentence`, `upper` et `lower`. Retourne le texte original, le format cible et le résultat converti.",
                            },
                            {
                                en: "Added endpoint **[POST /jwt](ref:jwt)**: decodes a JSON Web Token without verifying the signature. Returns the decoded header and payload as objects, the raw signature string, and an `expired` boolean derived from the `exp` claim when present.",
                                fr: "Ajout de l'endpoint **[POST /jwt](ref:jwt)** : décode un JSON Web Token sans vérifier la signature. Retourne le header et le payload décodés sous forme d'objets, la signature brute, et un booléen `expired` dérivé du claim `exp` lorsqu'il est présent.",
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
                                en: "Added documentation pages for **[Case](ref:case)** and **[JWT](ref:jwt)**: covers parameters, available targets/formats, response fields, code examples, and error handling.",
                                fr: "Ajout des pages de documentation pour **[Case](ref:case)** et **[JWT](ref:jwt)** : paramètres, formats disponibles, champs de réponse, exemples de code et gestion des erreurs.",
                            },
                            {
                                en: "Added both endpoints to the sidebar and Playground registry.",
                                fr: "Ajout des deux endpoints dans le sidebar et le registre Playground.",
                            },
                            {
                                en: "Removed v4 changelog files duplicated under `src/v5/` — they already exist in `src/v4/`.",
                                fr: "Suppression des fichiers changelog v4 dupliqués sous `src/v5/` — ils existent déjà dans `src/v4/`.",
                            },
                            {
                                en: "Fixed curl snippet JSON indentation in Playground code examples.",
                                fr: "Correction de l'indentation JSON dans les snippets curl du Playground.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "5.2.0": {
        version: "v5",
        id: "changelog/5.2.0",
        kind: "release",
        title: { en: "5.2.0", fr: "5.2.0" },
        updated: "2026-10-17",
        release: {
            version: "5.2.0",
            url: "https://github.com/moxondev/api/releases/tag/5.2.0",
            summary: "Asymmetric.",
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
                                en: "Added endpoint **[POST /asymmetric](ref:asymmetric)**: generates RSA key pairs and performs asymmetric encryption and decryption without external dependencies. Supports two OAEP algorithms: `rsa-oaep-sha256` (default) and `rsa-oaep-sha1`. Three actions are available: `keygen` generates a PEM-encoded public/private key pair (2048 or 4096 bits), `encrypt` encrypts plaintext with the public key and returns a base64-encoded ciphertext, and `decrypt` recovers the original plaintext from the private key. Maximum plaintext size depends on the key size and algorithm due to OAEP padding overhead.",
                                fr: "Ajout de l'endpoint **[POST /asymmetric](ref:asymmetric)** : génère des paires de clés RSA et effectue le chiffrement et déchiffrement asymétrique sans dépendance externe. Supporte deux algorithmes OAEP : `rsa-oaep-sha256` (défaut) et `rsa-oaep-sha1`. Trois actions sont disponibles : `keygen` génère une paire de clés publique/privée encodées en PEM (2048 ou 4096 bits), `encrypt` chiffre un texte avec la clé publique et retourne le résultat en base64, et `decrypt` retrouve le texte original à partir de la clé privée. La taille maximale du texte dépend de la taille de la clé et de l'algorithme en raison du padding OAEP.",
                            },
                            {
                                en: "Removed the endpoints table from the README in favor of a direct link to the documentation.",
                                fr: "Suppression du tableau des endpoints du README au profit d'un lien direct vers la documentation.",
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
                                en: "Added documentation page for **[Asymmetric](ref:asymmetric)**: covers the three actions (`keygen`, `encrypt`, `decrypt`), conditional parameters (`text`, `publicKey`, `privateKey`), a plaintext size limit table with the OAEP formula for each key/algorithm combination, and split response field sections for `keygen` vs `encrypt`/`decrypt`.",
                                fr: "Ajout de la page de documentation pour **[Asymmetric](ref:asymmetric)** : couvre les trois actions (`keygen`, `encrypt`, `decrypt`), les paramètres conditionnels (`text`, `publicKey`, `privateKey`), un tableau des limites de taille avec la formule OAEP pour chaque combinaison de clé et d'algorithme, et des sections de champs de réponse séparées pour `keygen` et `encrypt`/`decrypt`.",
                            },
                            {
                                en: "Added the endpoint to the sidebar and Playground registry.",
                                fr: "Ajout de l'endpoint dans le sidebar et le registre Playground.",
                            },
                            {
                                en: "Playground now filters endpoints based on the active version's sidebar, hiding routes unavailable in that version.",
                                fr: "Le Playground filtre désormais les endpoints selon le sidebar de la version active, masquant les routes non disponibles.",
                            },
                            {
                                en: "Extracted a shared `VERSION_PATH` regex from `redirect.ts`, reused across `Version.vue` and `Playground.vue`.",
                                fr: "Extraction d'une regex `VERSION_PATH` partagée dans `redirect.ts`, réutilisée dans `Version.vue` et `Playground.vue`.",
                            },
                            {
                                en: "Home nav link color now uses a `.home` class instead of hardcoded `[href]` attribute selectors.",
                                fr: "La couleur du lien home dans la navbar utilise maintenant une classe `.home` au lieu de sélecteurs d'attribut `[href]` codés en dur.",
                            },
                            {
                                en: "Removed redundant `collapsed: false` from all `Endpoints` sidebar groups (default behavior).",
                                fr: "Suppression du `collapsed: false` redondant sur tous les groupes `Endpoints` du sidebar (comportement par défaut).",
                            },
                            {
                                en: "Fixed column alignment in the OTP actions table.",
                                fr: "Correction de l'alignement des colonnes du tableau des actions OTP.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "5.1.0": {
        version: "v5",
        id: "changelog/5.1.0",
        kind: "release",
        title: { en: "5.1.0", fr: "5.1.0" },
        updated: "2026-10-17",
        release: {
            version: "5.1.0",
            url: "https://github.com/moxondev/api/releases/tag/5.1.0",
            summary: "Symmetric, OTP.",
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
                                en: "Added endpoint **[POST /symmetric](ref:symmetric)**: encrypts and decrypts text using AES symmetric encryption. Supports `aes-256-gcm` (default), `aes-256-cbc`, and `aes-128-gcm` algorithms. Key derivation uses `scryptSync` with a random 16-byte salt. The encrypted output is a self-contained base64 blob carrying the salt, IV, authentication tag (GCM), and ciphertext.",
                                fr: "Ajout de l'endpoint **[POST /symmetric](ref:symmetric)** : chiffre et déchiffre du texte par chiffrement symétrique AES. Supporte les algorithmes `aes-256-gcm` (défaut), `aes-256-cbc` et `aes-128-gcm`. La dérivation de clé utilise `scryptSync` avec un sel aléatoire de 16 octets. Le résultat chiffré est un blob base64 autonome contenant le sel, l'IV, le tag d'authentification (GCM) et le texte chiffré.",
                            },
                            {
                                en: "Added endpoint **[POST /otp](ref:otp)**: generates and verifies one-time passwords following RFC 4226 (HOTP) and RFC 6238 (TOTP). Compatible with Google Authenticator and Aegis. Supports `sha1`, `sha256`, and `sha512` algorithms, 6 or 8 digit codes, and 15/30/60 second periods. Pass a `counter` for deterministic HOTP mode; omit it for time-based TOTP. Verification applies a ±1 period tolerance window and returns a `drift` field.",
                                fr: "Ajout de l'endpoint **[POST /otp](ref:otp)** : génère et vérifie des mots de passe à usage unique selon les RFC 4226 (HOTP) et RFC 6238 (TOTP). Compatible Google Authenticator et Aegis. Supporte les algorithmes `sha1`, `sha256` et `sha512`, des codes à 6 ou 8 chiffres, et des périodes de 15/30/60 secondes. Passer un `counter` active le mode HOTP déterministe ; sans `counter`, le mode TOTP basé sur le temps est utilisé. La vérification applique une fenêtre de tolérance de ±1 période et retourne un champ `drift`.",
                            },
                            {
                                en: "Fixed version checks in DELETE and PATCH route handlers that were incorrectly rejecting v5 and later versions.",
                                fr: "Correction des vérifications de version dans les handlers de routes DELETE et PATCH qui rejetaient incorrectement les versions v5 et supérieures.",
                            },
                            {
                                en: "Corrected alphabetical ordering in `versions.ts`, `post.ts`, and `get.ts`.",
                                fr: "Correction de l'ordre alphabétique dans `versions.ts`, `post.ts` et `get.ts`.",
                            },
                            {
                                en: "Added section separator comments in `chart.ts`; added blank lines between private functions in `chart.ts`.",
                                fr: "Ajout de commentaires séparateurs de sections dans `chart.ts` ; ajout de lignes vides entre les fonctions privées dans `chart.ts`.",
                            },
                            {
                                en: "Reformatted `validateBarLine` and `validatePieDonut` for readability (one check per line, grouped by concern).",
                                fr: "Reformatage de `validateBarLine` et `validatePieDonut` pour la lisibilité (un check par ligne, groupés par thème).",
                            },
                            {
                                en: "Standardized error message casing: all messages now start with an uppercase letter (v4 and v5).",
                                fr: "Uniformisation de la casse des messages d'erreur : tous commencent désormais par une majuscule (v4 et v5).",
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
                                en: "Added documentation pages for **[Symmetric](ref:symmetric)** and **[OTP](ref:otp)**.",
                                fr: "Ajout des pages de documentation pour **[Symmetric](ref:symmetric)** et **[OTP](ref:otp)**.",
                            },
                            {
                                en: "Added both endpoints to the sidebar and Playground registry.",
                                fr: "Ajout des deux endpoints dans le sidebar et le registre Playground.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "5.0.0": {
        version: "v5",
        id: "changelog/5.0.0",
        kind: "release",
        title: { en: "5.0.0", fr: "5.0.0" },
        updated: "2026-10-17",
        release: {
            version: "5.0.0",
            url: "https://github.com/moxondev/api/releases/tag/5.0.0",
            summary: "Evaluate, Matrix, Chart.",
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
                                en: "Added endpoint **[GET /evaluate](ref:evaluate)**: safely evaluates mathematical expressions using a Pratt parser (no `eval()`). Supports operators `+` `-` `*` `/` `%` `^`, unary negation, constants `pi` and `e`, and 14 built-in functions (`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sqrt`, `abs`, `floor`, `ceil`, `round`, `log`, `log2`, `log10`). An optional `precision` parameter (0–15) controls decimal places. Expression length is capped at 500 characters and recursion depth at 100.",
                                fr: "Ajout de l'endpoint **[GET /evaluate](ref:evaluate)** : évalue des expressions mathématiques de manière sécurisée via un parseur Pratt (sans `eval()`). Supporte les opérateurs `+` `-` `*` `/` `%` `^`, la négation unaire, les constantes `pi` et `e`, ainsi que 14 fonctions intégrées (`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sqrt`, `abs`, `floor`, `ceil`, `round`, `log`, `log2`, `log10`). Un paramètre `precision` optionnel (0–15) contrôle les décimales. La longueur est limitée à 500 caractères et la profondeur de récursion à 100.",
                            },
                            {
                                en: "Added endpoint **[POST /matrix](ref:matrix)**: performs 8 matrix operations on up to 20×20 matrices: `add`, `subtract`, `multiply`, `scalar`, `transpose`, `determinant`, `inverse`, and `identity`. Determinant uses Gaussian elimination with partial pivoting; inverse uses Gauss-Jordan elimination.",
                                fr: "Ajout de l'endpoint **[POST /matrix](ref:matrix)** : effectue 8 opérations matricielles sur des matrices jusqu'à 20×20 : `add`, `subtract`, `multiply`, `scalar`, `transpose`, `determinant`, `inverse` et `identity`. Le déterminant utilise l'élimination gaussienne avec pivot partiel ; l'inverse utilise Gauss-Jordan.",
                            },
                            {
                                en: 'Added endpoint **[POST /chart](ref:chart)**: generates SVG charts (bar, line, pie, donut) from data arrays. Supports custom colors, title, background, legend, and optional fixed dimensions. Set `mode` to `"data"` to receive the raw chart data as JSON instead of SVG. Maximum 20 labels and 5 datasets.',
                                fr: 'Ajout de l\'endpoint **[POST /chart](ref:chart)** : génère des graphiques SVG (barres, lignes, camembert, donut) à partir de tableaux de données. Supporte couleurs personnalisées, titre, fond, légende et dimensions fixes optionnelles. Définir `mode` à `"data"` retourne les données brutes en JSON plutôt que le SVG. Maximum 20 labels et 5 datasets.',
                            },
                            {
                                en: "Documentation URL in 404 error responses now always points to the latest version instead of the requested version.",
                                fr: "L'URL de documentation dans les erreurs 404 pointe désormais toujours vers la dernière version au lieu de la version demandée.",
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
                                en: "Added documentation pages for **[Evaluate](ref:evaluate)**, **[Matrix](ref:matrix)**, and **[Chart](ref:chart)**.",
                                fr: "Ajout des pages de documentation pour **[Evaluate](ref:evaluate)**, **[Matrix](ref:matrix)** et **[Chart](ref:chart)**.",
                            },
                            {
                                en: "Added all three endpoints to the **Playground** registry and sidebar.",
                                fr: "Ajout des trois endpoints dans le registre **Playground** et le sidebar.",
                            },
                            {
                                en: "POST code snippets (curl, JS, Python) now use JSON bodies instead of form-encoded data.",
                                fr: "Les extraits de code POST (curl, JS, Python) utilisent désormais du JSON à la place de données form-encodées.",
                            },
                            {
                                en: "**Panel** component now correctly parses `json`-typed params (chart `data`, matrix `matrix`) before sending, and converts `boolean`-typed params from string.",
                                fr: "Le composant **Panel** parse désormais correctement les paramètres typés `json` (chart `data`, matrix `matrix`) avant envoi, et convertit les paramètres typés `boolean` depuis la chaîne.",
                            },
                            {
                                en: "Updated **Terminal** homepage demo: added chart and matrix examples, all requests now use v5 URLs and JSON bodies.",
                                fr: "Mise à jour du **Terminal** en page d'accueil : ajout des exemples chart et matrix, toutes les requêtes utilisent désormais les URLs v5 et le format JSON.",
                            },
                            {
                                en: "Updated sidebar cross-links: v5 changelog links to previous v4 versions; v4 changelog links to v5.",
                                fr: "Mise à jour des liens croisés dans le sidebar : le changelog v5 renvoie vers les versions v4 précédentes ; le changelog v4 renvoie vers v5.",
                            },
                            {
                                en: "Updated homepage to promote v5 as the current version.",
                                fr: "Mise à jour de la page d'accueil pour promouvoir v5 comme version actuelle.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
