import type { Page } from "@/types/content";

export const releases: Record<string, Page> = {
    "4.9.0": {
        version: "v4",
        id: "changelog/4.9.0",
        kind: "release",
        title: { en: "4.9.0", fr: "4.9.0" },
        updated: "2026-10-17",
        release: {
            version: "4.9.0",
            url: "https://github.com/moxondev/api/releases/tag/4.9.0",
            summary: "Credit, Avatar, Barcode.",
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
                                en: "Added endpoint **[GET /credit](ref:credit)**: generates fictitious Luhn-valid credit card numbers. Supports four brands (`visa`, `mastercard`, `amex`, `discover`) with correct IIN prefixes, a `count` parameter (1–10), and a `format` parameter (`full` or `masked`). Returns card number, formatted number, brand, expiry date, and CVV.",
                                fr: "Ajout de l'endpoint **[GET /credit](ref:credit)** : génère des numéros de cartes bancaires fictifs Luhn-valides. Supporte quatre marques (`visa`, `mastercard`, `amex`, `discover`) avec les préfixes IIN corrects, un paramètre `count` (1–10) et un paramètre `format` (`full` ou `masked`). Retourne le numéro de carte, le numéro formaté, la marque, la date d'expiration et le CVV.",
                            },
                            {
                                en: "Added endpoint **[GET /avatar](ref:avatar)**: generates deterministic avatar images from a seed string. Supports two types (`identicon` with a 5×5 mirrored grid, `pixel` with an 8×8 grid), PNG and SVG output, configurable size (50–2000 px), and a custom background color.",
                                fr: "Ajout de l'endpoint **[GET /avatar](ref:avatar)** : génère des images d'avatars déterministes à partir d'une chaîne seed. Supporte deux types (`identicon` avec une grille symétrique 5×5, `pixel` avec une grille 8×8), la sortie en PNG et SVG, une taille configurable (50–2000 px) et une couleur de fond personnalisable.",
                            },
                            {
                                en: "Added endpoint **[GET /barcode](ref:barcode)**: generates barcode images from a data string. Supports Code 128 (Set B), EAN-13, EAN-8, UPC-A, and Code 39. EAN check digits are computed automatically if omitted and validated if provided. Renders as SVG (default) or PNG.",
                                fr: "Ajout de l'endpoint **[GET /barcode](ref:barcode)** : génère des images de codes-barres à partir d'une chaîne de données. Supporte Code 128 (Set B), EAN-13, EAN-8, UPC-A et Code 39. Le chiffre de contrôle EAN est calculé automatiquement s'il est absent et validé s'il est fourni. Rendu en SVG (défaut) ou PNG.",
                            },
                            {
                                en: "**[GET /personal](ref:personal)** now uses the `/credit` module to generate card data: numbers are Luhn-valid, CVV length is consistent with the brand (4 digits for Amex), and the formatted number uses the correct spacing pattern.",
                                fr: "**[GET /personal](ref:personal)** utilise désormais le module `/credit` pour générer les données de carte : les numéros sont Luhn-valides, la longueur du CVV est cohérente avec la marque (4 chiffres pour Amex) et le numéro formaté utilise le bon espacement.",
                            },
                            {
                                en: "**[GET /cron](ref:cron)** scheduler optimized: months, days, and hours that do not match the cron expression are now skipped directly, significantly reducing computation time on restrictive expressions.",
                                fr: "**[GET /cron](ref:cron)** optimisé : les mois, jours et heures ne correspondant pas à l'expression cron sont désormais sautés directement, réduisant significativement le temps de calcul sur les expressions restrictives.",
                            },
                            {
                                en: "Added `prepare` script in `package.json`: `tsc` now runs automatically before `npm publish`.",
                                fr: "Ajout du script `prepare` dans `package.json` : `tsc` s'exécute désormais automatiquement avant `npm publish`.",
                            },
                            {
                                en: "Added `.npmignore`: `src/`, `tests/`, config files, and development assets are excluded from the published npm package.",
                                fr: "Ajout de `.npmignore` : `src/`, `tests/`, les fichiers de configuration et les ressources de développement sont exclus du paquet npm publié.",
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
                                en: "Added documentation pages for **[Credit](ref:credit)**, **[Avatar](ref:avatar)**, and **[Barcode](ref:barcode)**.",
                                fr: "Ajout des pages de documentation pour **[Credit](ref:credit)**, **[Avatar](ref:avatar)** et **[Barcode](ref:barcode)**.",
                            },
                            {
                                en: "Added all three endpoints to the **Playground** registry and sidebar.",
                                fr: "Ajout des trois endpoints dans le registre **Playground** et la sidebar.",
                            },
                            {
                                en: "Updated **[Personal](ref:personal)** documentation: `cvc` field type changed to `string`, card description updated to reflect Luhn-valid generation.",
                                fr: "Mise à jour de la documentation **[Personal](ref:personal)** : type du champ `cvc` changé en `string`, description de la carte mise à jour pour refléter la génération Luhn-valide.",
                            },
                            {
                                en: 'Added **"How it works"** explanations to **[Geo](ref:geo)** (Haversine formula, great-circle distance, bearing) and **[Statistics](ref:statistics)** (population formulas, mode ties, decimal precision).',
                                fr: 'Ajout d\'explications **"Comment ça marche"** sur **[Geo](ref:geo)** (formule de Haversine, distance orthodromique, cap) et **[Statistics](ref:statistics)** (formules populationnelles, égalités de mode, précision décimale).',
                            },
                            {
                                en: "Removed redundant use case tips from **[Token](ref:token)**, **[Avatar](ref:avatar)**, and **[Credit](ref:credit)** pages.",
                                fr: "Suppression des encadrés de cas d'utilisation redondants sur **[Token](ref:token)**, **[Avatar](ref:avatar)** et **[Credit](ref:credit)**.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "4.8.0": {
        version: "v4",
        id: "changelog/4.8.0",
        kind: "release",
        title: { en: "4.8.0", fr: "4.8.0" },
        updated: "2026-10-17",
        release: {
            version: "4.8.0",
            url: "https://github.com/moxondev/api/releases/tag/4.8.0",
            summary: "Cron, Regex, Countdown.",
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
                                en: "Added endpoint **[GET /cron](ref:cron)**: parses a 5-field cron expression (`minute hour dom month dow`) and returns a human-readable description along with the next scheduled execution timestamps. Supports IANA timezones and a `from` parameter to set the computation start date.",
                                fr: "Ajout de l'endpoint **[GET /cron](ref:cron)** : analyse une expression cron à 5 champs (`minute heure dom mois dow`) et retourne une description lisible ainsi que les prochains timestamps d'exécution. Support des fuseaux horaires IANA et d'un paramètre `from` pour définir le point de départ du calcul.",
                            },
                            {
                                en: "Added endpoint **[GET /regex](ref:regex)**: tests a regex pattern against a text string and returns all matches with their index, numbered capture groups, and named groups. Supports flags `i`, `m`, `s`, and `u` (the `g` flag is always applied).",
                                fr: "Ajout de l'endpoint **[GET /regex](ref:regex)** : teste un pattern regex contre une chaîne de texte et retourne toutes les correspondances avec leur index, leurs groupes capturants numérotés et leurs groupes nommés. Support des flags `i`, `m`, `s` et `u` (le flag `g` est toujours appliqué).",
                            },
                            {
                                en: "**[GET /time](ref:time)** now supports `type=countdown`: computes the difference between now and a target date provided via the `target` parameter.",
                                fr: "**[GET /time](ref:time)** accepte désormais `type=countdown` : calcule la différence entre maintenant et une date cible fournie via le paramètre `target`.",
                            },
                            {
                                en: "Normalized module-level constants to `UPPER_CASE` across v4 modules.",
                                fr: "Normalisation des constantes de niveau module en `UPPER_CASE` dans les modules v4.",
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
                                en: "Added documentation pages for **[Cron](ref:cron)** and **[Regex](ref:regex)**.",
                                fr: "Ajout des pages de documentation pour **[Cron](ref:cron)** et **[Regex](ref:regex)**.",
                            },
                            {
                                en: "Added both endpoints to the **Playground** registry and sidebar.",
                                fr: "Ajout des deux endpoints dans le registre **Playground** et la sidebar.",
                            },
                            {
                                en: "Updated **[Time](ref:time)** documentation with the new `countdown` mode and `target` parameter.",
                                fr: "Mise à jour de la documentation **[Time](ref:time)** avec le nouveau mode `countdown` et le paramètre `target`.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "4.7.0": {
        version: "v4",
        id: "changelog/4.7.0",
        kind: "release",
        title: { en: "4.7.0", fr: "4.7.0" },
        updated: "2026-10-17",
        release: {
            version: "4.7.0",
            url: "https://github.com/moxondev/api/releases/tag/4.7.0",
            summary: "Address, Password, Token.",
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
                                en: "Added endpoint **[GET /address](ref:address)**: generates 1–10 fictional postal addresses for `fr`, `us`, `uk`, `de`, or `es` (random if omitted). Each address includes `street`, `city`, `zip`, `state`, `country`, and `countryCode`. Zip codes are formatted per country conventions.",
                                fr: "Ajout de l'endpoint **[GET /address](ref:address)** : génère 1 à 10 adresses postales fictives pour `fr`, `us`, `uk`, `de` ou `es` (aléatoire si omis). Chaque adresse contient `street`, `city`, `zip`, `state`, `country` et `countryCode`. Les codes postaux sont formatés selon les conventions du pays.",
                            },
                            {
                                en: "Added endpoint **[GET /password](ref:password)**: generates 1–20 passwords using `crypto.randomInt`. Two modes: `random` (character-based, 8–128 chars) with configurable character sets (`uppercase`, `lowercase`, `digits`, `symbols`, `exclude`) and `passphrase` (word-based, 3–10 words, custom `separator`). Response includes `strength` (`weak` / `moderate` / `strong` / `very_strong`) and Shannon `entropy` in bits.",
                                fr: "Ajout de l'endpoint **[GET /password](ref:password)** : génère 1 à 20 mots de passe via `crypto.randomInt`. Deux modes : `random` (basé sur des caractères, 8–128 caractères) avec jeux de caractères configurables (`uppercase`, `lowercase`, `digits`, `symbols`, `exclude`) et `passphrase` (basé sur des mots, 3–10 mots, `separator` personnalisable). La réponse inclut un niveau `strength` (`weak` / `moderate` / `strong` / `very_strong`) et l'entropie de Shannon `entropy` en bits.",
                            },
                            {
                                en: "Fixed **[POST /token](ref:token)**: replaced `Math.random()` with `crypto.randomInt` for all character-based types, and fixed a truncation bug that silently shortened UUID tokens above a certain length.",
                                fr: "Correction de **[POST /token](ref:token)** : remplacement de `Math.random()` par `crypto.randomInt` pour tous les types basés sur des caractères, et correction d'un bug de troncature qui raccourcissait silencieusement les tokens UUID au-delà d'une certaine longueur.",
                            },
                            {
                                en: "**[GET /personal](ref:personal)** now delegates address generation to the `address` module, eliminating duplicated data generation logic.",
                                fr: "**[GET /personal](ref:personal)** délègue désormais la génération d'adresse au module `address`, supprimant la logique de génération de données dupliquée.",
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
                                en: "Added documentation pages for **[Address](ref:address)**, **[Agent](ref:agent)**, **[Headers](ref:headers)**, **[IP](ref:ip)** and **[Password](ref:password)**.",
                                fr: "Ajout des pages de documentation pour **[Address](ref:address)**, **[Agent](ref:agent)**, **[Headers](ref:headers)**, **[IP](ref:ip)** et **[Password](ref:password)**.",
                            },
                            {
                                en: "Added all 5 new endpoints — **[Address](ref:address)**, **[Agent](ref:agent)**, **[IP](ref:ip)**, **[Headers](ref:headers)** and **[Password](ref:password)** — to the **Playground** registry and sidebar.",
                                fr: "Ajout des 5 nouveaux endpoints — **[Address](ref:address)**, **[Agent](ref:agent)**, **[IP](ref:ip)**, **[Headers](ref:headers)** et **[Password](ref:password)** — dans le registre **Playground** et la sidebar.",
                            },
                            {
                                en: "Added descriptions for **[Address](ref:address)**, **[Agent](ref:agent)**, **[Headers](ref:headers)**, **[IP](ref:ip)** and **[Password](ref:password)** in the home features section.",
                                fr: "Ajout des descriptions pour **[Address](ref:address)**, **[Agent](ref:agent)**, **[Headers](ref:headers)**, **[IP](ref:ip)** et **[Password](ref:password)** dans la section des fonctionnalités de la page d'accueil.",
                            },
                            {
                                en: "The endpoint URL in Try panels is now a clickable link that opens in a new tab.",
                                fr: "L'URL de l'endpoint dans les panels Try est désormais un lien cliquable qui s'ouvre dans un nouvel onglet.",
                            },
                            {
                                en: "Try panels now support URL path parameters (e.g. `:country`) resolved dynamically from input values.",
                                fr: "Les panels Try supportent désormais les paramètres de chemin (ex. `:country`) résolus dynamiquement depuis les valeurs des inputs.",
                            },
                            {
                                en: "Try panel inputs now display contextual placeholder text.",
                                fr: "Les inputs des panels Try affichent désormais un placeholder contextuel.",
                            },
                            {
                                en: "The Playground now shows a direct link to the documentation page of the selected endpoint.",
                                fr: "Le Playground affiche désormais un lien direct vers la page de documentation de l'endpoint sélectionné.",
                            },
                            {
                                en: "Fixed JavaScript code snippet formatting for request bodies in Try panels.",
                                fr: "Correction du formatage des extraits de code JavaScript pour les corps de requête dans les panels Try.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "4.6.0": {
        version: "v4",
        id: "changelog/4.6.0",
        kind: "release",
        title: { en: "4.6.0", fr: "4.6.0" },
        updated: "2026-10-17",
        release: {
            version: "4.6.0",
            url: "https://github.com/moxondev/api/releases/tag/4.6.0",
            summary: { en: "Agent, IP, Headers, security.", fr: "Agent, IP, Headers, sécurité." },
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
                                en: "Added endpoint **[GET /agent](ref:agent)**: parses a User-Agent string into structured metadata — browser name/version/major, OS name/version, device type/vendor, rendering engine name/version, and a `bot` boolean for known crawlers.",
                                fr: "Ajout de l'endpoint **[GET /agent](ref:agent)** : analyse un User-Agent en métadonnées structurées — nom/version/majeure du navigateur, nom/version de l'OS, type/fabricant de l'appareil, nom/version du moteur de rendu, et un booléen `bot` pour les crawlers connus.",
                            },
                            {
                                en: "Added endpoint **[GET /ip](ref:ip)**: analyzes an IPv4 or IPv6 address and returns its version, type (`public`, `private`, `loopback`, `link-local`, `multicast`, `broadcast`), class (A–E, IPv4 only), CIDR range, binary representation, decimal value (IPv4 only), and reverse DNS notation.",
                                fr: "Ajout de l'endpoint **[GET /ip](ref:ip)** : analyse une adresse IPv4 ou IPv6 et retourne sa version, son type (`public`, `private`, `loopback`, `link-local`, `multicast`, `broadcast`), sa classe (A–E, IPv4 uniquement), sa plage CIDR, sa représentation binaire, sa valeur décimale (IPv4 uniquement) et sa notation DNS inversé.",
                            },
                            {
                                en: "Added endpoint **[GET /headers](ref:headers)**: returns the request's HTTP headers as a key-value map, with optional `filter` parameter (comma-separated header names) and automatic redaction of `authorization`, `cookie`, `set-cookie`, and `proxy-authorization`.",
                                fr: "Ajout de l'endpoint **[GET /headers](ref:headers)** : retourne les en-têtes HTTP de la requête sous forme de map clé-valeur, avec un paramètre `filter` optionnel (noms séparés par des virgules) et masquage automatique de `authorization`, `cookie`, `set-cookie` et `proxy-authorization`.",
                            },
                            {
                                en: "Added **JSDoc** documentation to all exported functions across v4 modules.",
                                fr: "Ajout de la documentation **JSDoc** sur toutes les fonctions exportées des modules v4.",
                            },
                            {
                                en: "Added automatic import sorting with **`eslint-plugin-simple-import-sort`**.",
                                fr: "Ajout du tri automatique des imports via **`eslint-plugin-simple-import-sort`**.",
                            },
                            {
                                en: "Fixed security vulnerability **[GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)** in the `uuid` dependency (updated to v14).",
                                fr: "Correction de la vulnérabilité **[GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq)** dans la dépendance `uuid` (mise à jour vers v14).",
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
                                en: "Added `session` required parameter to **[POST /chat](ref:chat)** Try panel.",
                                fr: "Ajout du paramètre requis `session` dans le panel **[POST /chat](ref:chat)**.",
                            },
                            {
                                en: "Added `true` option to `avatar` in **[GET /placeholder](ref:placeholder)** Try panel.",
                                fr: "Ajout de l'option `true` au paramètre `avatar` dans le panel **[GET /placeholder](ref:placeholder)**.",
                            },
                            {
                                en: "Added timezone dropdown options to **[GET /time](ref:time)** Try panel.",
                                fr: "Ajout des options de fuseau horaire en dropdown dans le panel **[GET /time](ref:time)**.",
                            },
                            {
                                en: "The **Send** button in Try panels is now disabled until all required parameters are filled.",
                                fr: "Le bouton **Envoyer** des panels Try est désormais désactivé tant que tous les paramètres requis ne sont pas remplis.",
                            },
                            {
                                en: "Try panels now resolve their configuration from a centralized endpoint registry instead of inline props.",
                                fr: "Les panels Try résolvent désormais leur configuration depuis un registre d'endpoints centralisé plutôt que via des props inline.",
                            },
                            {
                                en: "Fixed footer being overlapped by the **On this page** aside outline.",
                                fr: "Correction du footer recouvert par le sommaire **Sur cette page**.",
                            },
                            {
                                en: "Added rounded corners to documentation tables.",
                                fr: "Ajout d'arrondissements aux coins des tableaux de documentation.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "4.5.0": {
        version: "v4",
        id: "changelog/4.5.0",
        kind: "release",
        title: { en: "4.5.0", fr: "4.5.0" },
        updated: "2026-10-17",
        release: {
            version: "4.5.0",
            url: "https://github.com/moxondev/api/releases/tag/4.5.0",
            summary: {
                en: "Security audit, rate limiting, hardening.",
                fr: "Audit de sécurité, rate limiting, durcissement.",
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
                                en: "Fixed **SSRF vulnerability** in **[POST /hyperplanning](ref:hyperplanning)**: URL validation now enforces HTTPS, blocks private IPs (`127.0.0.1`, `192.168.x`, `10.x`, `169.254.169.254`) and localhost, with a 10-second fetch timeout.",
                                fr: "Correction d'une **vulnérabilité SSRF** dans **[POST /hyperplanning](ref:hyperplanning)** : la validation d'URL impose désormais HTTPS, bloque les IP privées (`127.0.0.1`, `192.168.x`, `10.x`, `169.254.169.254`) et localhost, avec un timeout de 10 secondes.",
                            },
                            {
                                en: "Fixed **rate limit calculation**: the per-minute counter was compared against the hourly limit, allowing up to 2,000 req/min instead of 2,000 req/h. Now cumulates all minutes of the current hour.",
                                fr: "Correction du **calcul du rate limit** : le compteur par minute était comparé à la limite horaire, permettant jusqu'à 2 000 req/min au lieu de 2 000 req/h. Le calcul cumule maintenant toutes les minutes de l'heure courante.",
                            },
                            {
                                en: "Fixed **IP spoofing** via `cf-connecting-ip` header: switched to `req.ip` (respects `trust proxy`) to prevent rate limit bypass.",
                                fr: "Correction du **spoofing d'IP** via le header `cf-connecting-ip` : passage à `req.ip` (respecte `trust proxy`) pour empêcher le contournement du rate limit.",
                            },
                            {
                                en: "Added **burst rate limiting** per plan (10-second window): Free 50, Advanced 80, Pro 120, Business 200.",
                                fr: "Ajout du **burst rate limiting** par plan (fenêtre de 10 secondes) : Free 50, Advanced 80, Pro 120, Business 200.",
                            },
                            {
                                en: "Improved **error handler**: sensitive information (paths, `ECONNREFUSED`, stack traces) is now filtered from error messages. HTTP status is preserved instead of always returning 500.",
                                fr: "Amélioration du **gestionnaire d'erreurs** : les informations sensibles (chemins, `ECONNREFUSED`, stack traces) sont filtrées des messages d'erreur. Le status HTTP est préservé au lieu de toujours renvoyer 500.",
                            },
                            {
                                en: "Secured **dynamic property access** in routes: `Object.hasOwn()` is now used for `algorithms[method]`, `encode[method]`, `textMod[method]`, `validate[type]` to prevent prototype access.",
                                fr: "Sécurisation des **accès dynamiques** dans les routes : `Object.hasOwn()` est utilisé pour `algorithms[method]`, `encode[method]`, `textMod[method]`, `validate[type]` afin d'empêcher l'accès au prototype.",
                            },
                            {
                                en: "Added **security headers**: `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY`.",
                                fr: "Ajout des **headers de sécurité** : `X-Content-Type-Options: nosniff` et `X-Frame-Options: DENY`.",
                            },
                            {
                                en: "Fixed **memory leak** in rate limiter: inactive IPs and burst tracker entries are now cleaned up every hour.",
                                fr: "Correction d'une **fuite mémoire** dans le rate limiter : les IPs inactives et les entrées du burst tracker sont nettoyées toutes les heures.",
                            },
                            {
                                en: "Added **body size limit**: `express.json()` and `express.urlencoded()` are now limited to 10kb (returns `413 Payload Too Large`).",
                                fr: "Ajout d'une **limite de taille du body** : `express.json()` et `express.urlencoded()` sont limités à 10 ko (retourne `413 Payload Too Large`).",
                            },
                            {
                                en: "Centralized **plan configuration** (`plans.ts`): hourly and burst limits per tier, overridable via environment variables.",
                                fr: "Centralisation de la **configuration des plans** (`plans.ts`) : limites horaires et burst par tier, configurables via variables d'environnement.",
                            },
                            {
                                en: "Added 9 new tests (total 305): 4 SSRF unit tests and 5 security integration tests.",
                                fr: "Ajout de 9 nouveaux tests (total 305) : 4 tests unitaires SSRF et 5 tests d'intégration sécurité.",
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
                                en: "Added **burst rate limits** to [Authentication](ref:authentication) and [Pricing](ref:pricing) pages.",
                                fr: "Ajout des **limites de burst** sur les pages [Authentification](ref:authentication) et [Tarification](ref:pricing).",
                            },
                            {
                                en: "Updated **[POST /hash](ref:hash)** Try panel with 11 new algorithms (sha224, sha512-224, sha512-256, sha3-224, sha3-256, sha3-384, sha3-512, blake2s256, ripemd160, shake128, shake256).",
                                fr: "Mise à jour du panel **[POST /hash](ref:hash)** avec 11 nouveaux algorithmes (sha224, sha512-224, sha512-256, sha3-224, sha3-256, sha3-384, sha3-512, blake2s256, ripemd160, shake128, shake256).",
                            },
                            {
                                en: "Updated **[GET /qrcode](ref:qrcode)** Try panel with `format` and `correction` dropdown options.",
                                fr: "Mise à jour du panel **[GET /qrcode](ref:qrcode)** avec les options `format` et `correction` en dropdown.",
                            },
                            {
                                en: "Updated **[GET /placeholder](ref:placeholder)** Try panel with new `avatar` and `lines` parameters.",
                                fr: "Mise à jour du panel **[GET /placeholder](ref:placeholder)** avec les nouveaux paramètres `avatar` et `lines`.",
                            },
                            {
                                en: "Restructured **responsive CSS** to mobile-first with ascending breakpoints. Terminal is now only visible at 1280px+.",
                                fr: "Restructuration du **CSS responsive** en mobile-first avec breakpoints croissants. Le terminal n'est désormais visible qu'à partir de 1280px.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "4.4.0": {
        version: "v4",
        id: "changelog/4.4.0",
        kind: "release",
        title: { en: "4.4.0", fr: "4.4.0" },
        updated: "2026-10-17",
        release: {
            version: "4.4.0",
            url: "https://github.com/moxondev/api/releases/tag/4.4.0",
            summary: "QR Code, Captcha, Color, Convert, Hash, Placeholder.",
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
                                en: "Improved **[GET /qrcode](ref:qrcode)**: PNG output by default, new options (`size`, `margin`, `correction`, `dark`, `light`, `icon`, `iconSize`, `iconPadding`, `iconRadius`, `format`), icon overlay support with HTTPS validation and 2MB size limit.",
                                fr: "Amélioration de **[GET /qrcode](ref:qrcode)** : sortie PNG par défaut, nouvelles options (`size`, `margin`, `correction`, `dark`, `light`, `icon`, `iconSize`, `iconPadding`, `iconRadius`, `format`), support d'icône superposée avec validation HTTPS et limite de 2 Mo.",
                            },
                            {
                                en: "Improved **[GET /captcha](ref:captcha)**: new options (`length`, `width`, `height`, `noise`, `bg`, `color`), auto-generates random text when none is provided, `X-Captcha-Text` response header for server-side verification.",
                                fr: "Amélioration de **[GET /captcha](ref:captcha)** : nouvelles options (`length`, `width`, `height`, `noise`, `bg`, `color`), génération automatique de texte aléatoire, header `X-Captcha-Text` pour la vérification côté serveur.",
                            },
                            {
                                en: "Improved **[GET /color](ref:color)**: accepts optional `?hex=` input to convert a specific color instead of generating a random one.",
                                fr: "Amélioration de **[GET /color](ref:color)** : accepte un paramètre optionnel `?hex=` pour convertir une couleur spécifique au lieu d'en générer une aléatoire.",
                            },
                            {
                                en: "Expanded **[GET /convert](ref:convert)**: new unit categories — length (km, mi, m, ft, cm, in, yd), weight (kg, lb, oz, g, ton), data (b, kb, mb, gb, tb), speed (km/h, mph, m/s, knots). Absolute zero validation now only applies to temperature units.",
                                fr: "Extension de **[GET /convert](ref:convert)** : nouvelles catégories d'unités — longueur (km, mi, m, ft, cm, in, yd), poids (kg, lb, oz, g, ton), données (b, kb, mb, gb, tb), vitesse (km/h, mph, m/s, knots). La validation du zéro absolu ne s'applique plus qu'aux unités de température.",
                            },
                            {
                                en: "Improved **[POST /hash](ref:hash)**: new `encoding` option (`hex` or `base64`), throws on unsupported method instead of returning error object, text validation on empty input.",
                                fr: "Amélioration de **[POST /hash](ref:hash)** : nouvelle option `encoding` (`hex` ou `base64`), erreur levée sur méthode non supportée au lieu de retourner un objet erreur, validation du texte vide.",
                            },
                            {
                                en: "Improved **[GET /placeholder](ref:placeholder)**: skeleton `lineH` and `gap` now scale proportionally to available height.",
                                fr: "Amélioration de **[GET /placeholder](ref:placeholder)** : `lineH` et `gap` du squelette s'adaptent proportionnellement à la hauteur disponible.",
                            },
                            {
                                en: "Extracted shared color and helper utilities into dedicated modules (`colors.ts`, `helpers.ts`).",
                                fr: "Extraction des utilitaires couleur et helpers partagés dans des modules dédiés (`colors.ts`, `helpers.ts`).",
                            },
                            {
                                en: "Added `since(version, min)` helper for version branching in routes.",
                                fr: "Ajout du helper `since(version, min)` pour le branchement de version dans les routes.",
                            },
                            {
                                en: "Added JSDoc to all utility functions.",
                                fr: "Ajout de JSDoc à toutes les fonctions utilitaires.",
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
                                en: "Updated documentation for [QR Code](ref:qrcode), [Captcha](ref:captcha), [Color](ref:color), [Convert](ref:convert) and [Hash](ref:hash).",
                                fr: "Mise à jour de la documentation pour [QR Code](ref:qrcode), [Captcha](ref:captcha), [Color](ref:color), [Convert](ref:convert) et [Hash](ref:hash).",
                            },
                            {
                                en: "Added **[POST /chat](ref:chat)** main page with full documentation, merged redundant send sub-page.",
                                fr: "Ajout de la page principale **[POST /chat](ref:chat)** avec documentation complète, fusion de la sous-page send redondante.",
                            },
                            {
                                en: 'Renamed Convert from "Temperature Conversion" to "Unit Conversion".',
                                fr: "Renommage de Convert de « Conversion de température » à « Conversion d'unités ».",
                            },
                            {
                                en: "Added new parameters to **Playground** registry for all updated endpoints.",
                                fr: "Ajout des nouveaux paramètres au registre du **Playground** pour tous les endpoints mis à jour.",
                            },
                            {
                                en: "Added **Method** badges to all related endpoint links across Chat and Tic-Tac-Toe pages.",
                                fr: "Ajout de badges **Method** sur tous les liens d'endpoints associés dans les pages Chat et Tic-Tac-Toe.",
                            },
                            {
                                en: "**Try** panel now displays image responses (PNG, SVG) instead of raw binary data.",
                                fr: "Le panneau **Try** affiche désormais les réponses image (PNG, SVG) au lieu des données binaires brutes.",
                            },
                            {
                                en: "Sidebar automatically scrolls to the active link on navigation.",
                                fr: "La sidebar scroll automatiquement vers le lien actif lors de la navigation.",
                            },
                            {
                                en: "Centralized language constants in **i18n** module, removed hardcoded language checks.",
                                fr: "Centralisation des constantes de langue dans le module **i18n**, suppression des vérifications de langue hardcodées.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "4.3.0": {
        version: "v4",
        id: "changelog/4.3.0",
        kind: "release",
        title: { en: "4.3.0", fr: "4.3.0" },
        updated: "2026-10-17",
        release: {
            version: "4.3.0",
            url: "https://github.com/moxondev/api/releases/tag/4.3.0",
            summary: "Geo, Palette, Placeholder, REST.",
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
                                en: "Added endpoint **[GET /geo](ref:geo)** to calculate distance and bearing between two GPS coordinates (Haversine).",
                                fr: "Ajout de l'endpoint **[GET /geo](ref:geo)** pour calculer la distance et le cap entre deux coordonnées GPS (Haversine).",
                            },
                            {
                                en: "Added endpoint **[GET /palette](ref:palette)** to generate harmonious color palettes from a HEX color.",
                                fr: "Ajout de l'endpoint **[GET /palette](ref:palette)** pour générer des palettes de couleurs harmonieuses à partir d'une couleur HEX.",
                            },
                            {
                                en: "Added endpoint **[GET /placeholder](ref:placeholder)** to generate SVG placeholders (image or animated skeleton).",
                                fr: "Ajout de l'endpoint **[GET /placeholder](ref:placeholder)** pour générer des placeholders SVG (image ou squelette animé).",
                            },
                            {
                                en: "Added REST methods: **[PATCH](ref:tic-tac-toe/play)** and **[DELETE](ref:tic-tac-toe/forfeit)** on Tic-Tac-Toe, **[DELETE](ref:chat/clear)** on Chat.",
                                fr: "Ajout de méthodes REST : **[PATCH](ref:tic-tac-toe/play)** et **[DELETE](ref:tic-tac-toe/forfeit)** sur Tic-Tac-Toe, **[DELETE](ref:chat/clear)** sur Chat.",
                            },
                            {
                                en: "Added `forfeit` action to Tic-Tac-Toe and `clear` action to Chat.",
                                fr: "Ajout de l'action `forfeit` au Tic-Tac-Toe et de l'action `clear` au Chat.",
                            },
                            {
                                en: "CORS: added `PATCH`, `DELETE`, `OPTIONS` to allowed methods.",
                                fr: "CORS : ajout de `PATCH`, `DELETE`, `OPTIONS` dans les méthodes autorisées.",
                            },
                            {
                                en: "Added `supportsRest()` helper and new route files for PATCH/DELETE.",
                                fr: "Ajout du helper `supportsRest()` et nouveaux fichiers de routes pour PATCH/DELETE.",
                            },
                            {
                                en: "Added unit tests for geo and palette + integration tests for the 3 new endpoints.",
                                fr: "Ajout de tests unitaires pour geo et palette + tests d'intégration pour les 3 nouveaux endpoints.",
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
                                en: "Added documentation pages for [Geo](ref:geo), [Palette](ref:palette) and [Placeholder](ref:placeholder).",
                                fr: "Ajout des pages de documentation pour [Geo](ref:geo), [Palette](ref:palette) et [Placeholder](ref:placeholder).",
                            },
                            {
                                en: "Split **Chat** and **Tic-Tac-Toe** into dedicated sub-pages per HTTP method.",
                                fr: "Séparation de **Chat** et **Tic-Tac-Toe** en sous-pages dédiées par méthode HTTP.",
                            },
                            {
                                en: "Added new endpoints to **Playground** registry and **Features** cards.",
                                fr: "Ajout des nouveaux endpoints au registre du **Playground** et aux cartes **Features**.",
                            },
                            {
                                en: "Restructured **i18n** system: flat keys replaced with typed nested keys (`nav.home`, `features.geo`, etc.).",
                                fr: "Restructuration du système **i18n** : clés plates remplacées par des clés imbriquées typées (`nav.home`, `features.geo`, etc.).",
                            },
                            {
                                en: "Added `auto-send` and `no-version` props to the **Try** component.",
                                fr: "Ajout des props `auto-send` et `no-version` au composant **Try**.",
                            },
                            {
                                en: "Added **PATCH** and **DELETE** method support to **Try**, **Examples** and **Panel** components.",
                                fr: "Ajout du support des méthodes **PATCH** et **DELETE** aux composants **Try**, **Examples** et **Panel**.",
                            },
                            {
                                en: "Added `sm` variant to **Method** badge for inline use in links.",
                                fr: "Ajout de la variante `sm` au badge **Method** pour utilisation inline dans les liens.",
                            },
                            {
                                en: "Replaced hardcoded API examples with interactive **Try** component on homepage and Getting Started.",
                                fr: "Remplacement des exemples API hardcodés par le composant interactif **Try** sur la page d'accueil et la page Commencer.",
                            },
                            {
                                en: "Added return descriptions to parameterless endpoints.",
                                fr: "Ajout des descriptions de retour aux endpoints sans paramètres.",
                            },
                            {
                                en: "Improved **Tic-Tac-Toe List** page with info callout.",
                                fr: "Amélioration de la page **Tic-Tac-Toe List** avec un callout info.",
                            },
                            {
                                en: "Fixed **Endpoint** link CSS specificity over VitePress defaults.",
                                fr: "Correction de la spécificité CSS du lien **Endpoint** sur les styles VitePress.",
                            },
                            {
                                en: "Added **ESLint** `simple-import-sort` plugin and auto-fixed all imports.",
                                fr: "Ajout du plugin **ESLint** `simple-import-sort` et auto-fix de tous les imports.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "4.2.0": {
        version: "v4",
        id: "changelog/4.2.0",
        kind: "release",
        title: { en: "4.2.0", fr: "4.2.0" },
        updated: "2026-10-17",
        release: {
            version: "4.2.0",
            url: "https://github.com/moxondev/api/releases/tag/4.2.0",
            summary: "Encode, Text, Validate.",
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
                                en: "Added endpoint **[GET /encode](ref:encode)** to encode and decode text (Base64, URL, Morse, ROT-13, Caesar, binary).",
                                fr: "Ajout de l'endpoint **[GET /encode](ref:encode)** pour encoder et décoder du texte (Base64, URL, Morse, ROT-13, César, binaire).",
                            },
                            {
                                en: "Added endpoint **[GET /text](ref:text)** with 4 methods: slug, text statistics, Lorem Ipsum, number to words (FR/EN).",
                                fr: "Ajout de l'endpoint **[GET /text](ref:text)** avec 4 méthodes : slug, statistiques texte, Lorem Ipsum, nombre en lettres (FR/EN).",
                            },
                            {
                                en: "Added endpoint **[GET /validate](ref:validate)** to validate data formats (Luhn, IBAN, email).",
                                fr: "Ajout de l'endpoint **[GET /validate](ref:validate)** pour valider des formats de données (Luhn, IBAN, email).",
                            },
                            {
                                en: "Added unit tests for encode, text and validate.",
                                fr: "Ajout de tests unitaires pour encode, text et validate.",
                            },
                            {
                                en: "Added HTTP integration tests for the 3 new endpoints.",
                                fr: "Ajout de tests d'intégration HTTP pour les 3 nouveaux endpoints.",
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
                                en: "Added documentation pages for [Encode](ref:encode), [Text](ref:text) and [Validate](ref:validate).",
                                fr: "Ajout des pages de documentation pour [Encode](ref:encode), [Text](ref:text) et [Validate](ref:validate).",
                            },
                            {
                                en: "Added **Changelog** with version sub-pages.",
                                fr: "Ajout du **Changelog** avec sous-pages par version.",
                            },
                            {
                                en: "Added new endpoints to **Playground** registry.",
                                fr: "Ajout des nouveaux endpoints au registre du **Playground**.",
                            },
                            {
                                en: "Added **Features** component with random endpoint cards on the [homepage](ref:/).",
                                fr: "Ajout du composant **Features** avec des cartes d'endpoints aléatoires sur la [page d'accueil](ref:/).",
                            },
                            {
                                en: "Replaced hardcoded JSON response blocks with complete **Response Fields** tables across all endpoints.",
                                fr: "Remplacement des blocs JSON de réponse par des tableaux **Champs de réponse** complets sur tous les endpoints.",
                            },
                            {
                                en: "Added limits, constraints, and detailed error cases to all endpoint pages.",
                                fr: "Ajout des limites, contraintes et cas d'erreur détaillés sur toutes les pages d'endpoints.",
                            },
                            {
                                en: "Added `::: info` and `::: tip` callouts for endpoint context (Levenshtein, Token, Username).",
                                fr: "Ajout de callouts `::: info` et `::: tip` pour le contexte des endpoints (Levenshtein, Token, Username).",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "4.1.0": {
        version: "v4",
        id: "changelog/4.1.0",
        kind: "release",
        title: { en: "4.1.0", fr: "4.1.0" },
        updated: "2026-10-17",
        release: {
            version: "4.1.0",
            url: "https://github.com/moxondev/api/releases/tag/4.1.0",
            summary: "Dice, Statistics, Roman.",
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
                                en: "Added endpoint **[GET /dice](ref:dice)** to roll dice using RPG notation (`2d6+3`).",
                                fr: "Ajout de l'endpoint **[GET /dice](ref:dice)** pour lancer des dés en notation RPG (`2d6+3`).",
                            },
                            {
                                en: "Added endpoint **[GET /statistics](ref:statistics)** for descriptive statistics (mean, median, standard deviation...).",
                                fr: "Ajout de l'endpoint **[GET /statistics](ref:statistics)** pour les statistiques descriptives (moyenne, médiane, écart-type...).",
                            },
                            {
                                en: "Added **roman** method to **[/algorithms](ref:algorithms)** for bidirectional Roman numeral / number conversion.",
                                fr: "Ajout de la méthode **roman** à l'endpoint **[/algorithms](ref:algorithms)** pour la conversion bidirectionnelle chiffres romains / nombres.",
                            },
                            {
                                en: "Dynamic version reading from `package.json` via `APP_VERSION`.",
                                fr: "Lecture dynamique de la version depuis `package.json` via `APP_VERSION`.",
                            },
                            {
                                en: "Added full test suite: 19 unit test files + HTTP integration tests on all endpoints.",
                                fr: "Ajout d'une suite de tests complète : 19 fichiers unitaires + tests d'intégration HTTP.",
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
                                en: "Added documentation pages for [Dice](ref:dice) and [Statistics](ref:statistics).",
                                fr: "Ajout des pages de documentation pour [Dice](ref:dice) et [Statistics](ref:statistics).",
                            },
                            {
                                en: "Added `roman` method to [Algorithms](ref:algorithms) documentation.",
                                fr: "Ajout de la méthode `roman` dans la documentation d'[Algorithms](ref:algorithms).",
                            },
                            {
                                en: "Added custom **Footer** component with changelog, GitHub and issue links.",
                                fr: "Ajout du composant **Footer** avec liens changelog, GitHub et issues.",
                            },
                            {
                                en: "Consolidated badge and card colors with **CSS variables**.",
                                fr: "Consolidation des couleurs de badges et cards avec des **variables CSS**.",
                            },
                            {
                                en: "Improved **Panel** and **Playground** layout (flex ordering, wrap, gap).",
                                fr: "Amélioration du layout des composants **Panel** et **Playground** (flex ordering, wrap, gap).",
                            },
                            {
                                en: "Reorganized **responsive media queries** (Mobile / Tablet / Desktop / Wide).",
                                fr: "Réorganisation des **media queries** responsive (Mobile / Tablet / Desktop / Wide).",
                            },
                            {
                                en: "Hidden **Terminal** on mobile (< 768px).",
                                fr: "Masquage du **Terminal** sur mobile (< 768px).",
                            },
                            {
                                en: "Fixed **table display** and **API header** wrapping.",
                                fr: "Correction de l'affichage des **tableaux** et du **header API** (flex-wrap).",
                            },
                            {
                                en: "Reordered **CSS imports** for better cascade.",
                                fr: "Réorganisation de l'ordre des **imports CSS** pour une meilleure cascade.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    "4.0.0": {
        version: "v4",
        id: "changelog/4.0.0",
        kind: "release",
        title: { en: "4.0.0", fr: "4.0.0" },
        updated: "2026-10-17",
        release: {
            version: "4.0.0",
            url: "https://github.com/moxondev/api/releases/tag/4.0.0",
            summary: { en: "Full TypeScript rewrite.", fr: "Réécriture TypeScript complète." },
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
                                en: "Full migration to **TypeScript** with strict typing.",
                                fr: "Migration complète en **TypeScript** avec typage strict.",
                            },
                            {
                                en: "Project restructured into separate modules (`middleware/`, `routes/`, `config/`, `storage/`, `types/`, `utils/`).",
                                fr: "Restructuration du projet en modules séparés (`middleware/`, `routes/`, `config/`, `storage/`, `types/`, `utils/`).",
                            },
                            {
                                en: "Added **[/health](https://api.moxon.dev/health)** endpoint with technical stats (uptime, memory, Node.js version).",
                                fr: "Ajout de l'endpoint **[/health](https://api.moxon.dev/health)** avec des statistiques techniques (uptime, mémoire, version Node.js).",
                            },
                            {
                                en: "Standardized all error responses with a unified helper.",
                                fr: "Standardisation de toutes les réponses d'erreur avec un helper unifié.",
                            },
                            {
                                en: "Added `documentation` field in all error responses.",
                                fr: "Ajout du champ `documentation` dans toutes les réponses d'erreur.",
                            },
                            {
                                en: "**Node.js >= 22.0.0** required.",
                                fr: "**Node.js >= 22.0.0** requis.",
                            },
                        ],
                    },
                ],
            },
            {
                id: "enriched-responses",
                level: 3,
                title: { en: "Enriched Responses", fr: "Réponses enrichies" },
                aliases: ["reponses-enrichies"],
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "**Username** now returns `number`, `adjective`, `animal`, and `job` fields alongside `username`.",
                                fr: "**Username** retourne maintenant `number`, `adjective`, `animal` et `job` en plus de `username`.",
                            },
                            {
                                en: "**Personal** response restructured with `vehicle` (array), `social_profiles` (object), `emergency_contacts` (array of objects), `subscriptions` and `pets` (arrays).",
                                fr: "**Personal** restructuré avec `vehicle` (array), `social_profiles` (objet), `emergency_contacts` (array d'objets), `subscriptions` et `pets` (arrays).",
                            },
                            {
                                en: "**Domain** now returns `ip_address` and `dns_servers` as arrays (multiple values).",
                                fr: "**Domain** retourne maintenant `ip_address` et `dns_servers` sous forme de tableaux.",
                            },
                        ],
                    },
                ],
            },
            {
                id: "endpoint-updates",
                level: 3,
                title: { en: "Endpoint Updates", fr: "Mises à jour d'endpoints" },
                aliases: ["mises-a-jour-d-endpoints"],
                blocks: [
                    {
                        type: "list",
                        items: [
                            {
                                en: "**Convert** — Temperature conversion only: Celsius, Fahrenheit, and Kelvin.",
                                fr: "**Convert** — Conversion de température uniquement : Celsius, Fahrenheit et Kelvin.",
                            },
                            {
                                en: "**Time** — 17 format options, `live`/`random` type, 5 timezone presets.",
                                fr: "**Time** — 17 options de format, type `live`/`random`, 5 fuseaux horaires.",
                            },
                            {
                                en: "**Token** — Default type is now `alphanum`, length range 12–4096.",
                                fr: "**Token** — Type par défaut `alphanum`, plage de longueur 12–4096.",
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
                                en: "Full documentation site built with **VitePress**.",
                                fr: "Site de documentation complet construit avec **VitePress**.",
                            },
                            {
                                en: "Added components **Playground**, **Panel** and **Try** for testing endpoints directly from the documentation.",
                                fr: "Ajout des composants **Playground**, **Panel** et **Try** pour tester les endpoints directement depuis la documentation.",
                            },
                            {
                                en: "Added **Examples** component with multi-language code snippets via **useCodeSnippets** composable.",
                                fr: "Ajout du composant **Examples** avec snippets multi-langages via le composable **useCodeSnippets**.",
                            },
                            {
                                en: "Added **Banner** component and migration banners on legacy version index pages.",
                                fr: "Ajout du composant **Banner** et des bannières de migration sur les pages d'index des anciennes versions.",
                            },
                            {
                                en: "Added **useVersion** composable for version-aware path management.",
                                fr: "Ajout du composable **useVersion** pour la gestion des chemins selon la version courante.",
                            },
                            {
                                en: "Added endpoint metadata registry.",
                                fr: "Ajout d'un registre de métadonnées pour les endpoints.",
                            },
                            {
                                en: "Reorganized CSS styles into **base**, **components** and **layout** structure.",
                                fr: "Réorganisation des styles CSS en structure **base**, **components** et **layout**.",
                            },
                            {
                                en: "Reorganized **i18n**, **icons** and **redirect** utilities into subdirectories.",
                                fr: "Réorganisation des utilitaires **i18n**, **icons** et **redirect** dans des sous-dossiers.",
                            },
                            {
                                en: "Dynamic version regex generated from **KNOWN_VERSIONS**.",
                                fr: "Génération dynamique de la regex des versions à partir de **KNOWN_VERSIONS**.",
                            },
                            {
                                en: "Updated **Version switcher** and **Layout** with v4 i18n improvements.",
                                fr: "Mise à jour du **sélecteur de version** et du **Layout** avec améliorations i18n pour la v4.",
                            },
                            {
                                en: "Updated **homepage** to promote v4 as current version.",
                                fr: "Mise à jour de la **page d'accueil** pour promouvoir la v4 comme version courante.",
                            },
                            {
                                en: "Removed version prefix from endpoint paths in v1, v2 and v3.",
                                fr: "Suppression du préfixe de version dans les chemins d'endpoints des v1, v2 et v3.",
                            },
                            {
                                en: "Fixed **memory leak** in Terminal component via alive flag.",
                                fr: "Correction d'une **fuite mémoire** dans le composant Terminal via un flag alive.",
                            },
                            {
                                en: "Restored missing **French accents** on homepage and legacy index pages.",
                                fr: "Restauration des **accents français** manquants sur la page d'accueil et les anciens index.",
                            },
                            {
                                en: "Added **VERSIONING.md** guide for future API versions.",
                                fr: "Ajout du guide **VERSIONING.md** pour les futures versions de l'API.",
                            },
                            {
                                en: "Added **Prettier** and **ESLint v9** (flat config) with Vue and TypeScript support.",
                                fr: "Ajout des configurations **Prettier** et **ESLint v9** (flat config) avec support Vue et TypeScript.",
                            },
                        ],
                    },
                ],
            },
        ],
    },
};
