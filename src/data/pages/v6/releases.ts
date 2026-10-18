import type { Page } from "@/types/content";

export const releases: Record<string, Page> = {
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
