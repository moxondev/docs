# moxon docs

Documentation of the moxon API, published at [moxon.dev](https://moxon.dev): the six versions of the API (v1 to v6), in English and in French, with a live Try panel on every endpoint that can be called. The pages are typed TypeScript data rendered by a small fixed set of components, and the whole site is a Next.js static export served by GitHub Pages.

## Features

- Six documented versions, each page in both languages: 250 pages per language, the latest version (v6) with a catalogue of 49 endpoints in 7 categories. v1 to v3 are kept for reference and are no longer served by the API.
- Try panel beside each endpoint (a bar and a sheet on a phone): fill in the parameters, send the request to the API and read the answer; the Playground picks any endpoint of a version.
- Code samples in cURL, JavaScript, Python and PHP, generated from the same data as the Try panel, with the chosen language remembered.
- Search palette (`Ctrl K` or `/`), built in the browser on first open from one small index per version and language: pages, sections, parameters, response fields and errors, with `get:` and `post:` filters and a preview.
- Status of a page, shown in the sidebar, the title, the search results, the home catalogue and the changelog: experimental, beta or deprecated.
- Copy a page as Markdown, edit link to the page module on GitHub, previous and next page, table of contents with the current section.
- English and French chosen from the browser language and remembered; light, dark and system theme (next-themes) chosen from a menu, no flash on load.
- Every URL of the previous VitePress site still answers: redirect files for the old paths, prebuilt redirect pages for the short forms (`/latest`, `/changelog`, `/hash`, `/6.1.0`, each also under `/fr`) and a smart redirect on the 404 page for the rest.
- Sitemap with language alternates, JSON-LD, canonical URLs and Open Graph cards.
- Keyboard shortcuts for the language (`Alt L`), the version (`Alt V`), the theme (`Alt T`, which goes through light, dark and system), the search and the request.

## Stack

Next.js 16 (App Router, static export), React 19, strict TypeScript, Tailwind CSS v4, shadcn/ui (new-york, Radix primitives via `radix-ui`), next-intl, next-themes, cmdk, vaul, MiniSearch, lucide-react

## Scripts

| Script           | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `npm run dev`    | Dev server on `127.0.0.1:4815` (runs `gen` first)                                      |
| `npm run gen`    | Regenerate the page registry, the navigation index, the search indexes and the exports |
| `npm run build`  | Production build: `gen`, static export to `out/`, then the redirect pages              |
| `npm run start`  | Serve `out/` on port 4816 with `npx serve` (fetched on first use, not a dependency)    |
| `npm run weight` | First-load JavaScript guard over `out/` (after a build)                                |
| `npm run lint`   | ESLint                                                                                 |
| `npm run test`   | Node test runner through tsx, over the `__tests__/` folders of `src/` and `scripts/`   |
| `npm run check`  | Content checks, messages, charter, `tsc --noEmit`, ESLint, Prettier (check) and tests  |
| `npm run format` | Prettier + ESLint (write)                                                              |

Scripts that are run directly with `npx tsx`:

| Command                                       | Description                                                                |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `tsx scripts/pages.ts [--check]`              | Write, or verify, the generated modules and run the content checks         |
| `tsx scripts/links.ts --routes`               | Every legacy URL maps to a page and every route is present                 |
| `tsx scripts/links.ts --out`                  | Every link, anchor and search result of the export resolves, after a build |
| `tsx scripts/newversion.ts v7 v6 [--dry-run]` | Create the page modules of a new version from the previous one             |

## Structure

```
guides/                   Data model, versioning and release guides
messages/                 UI messages, one JSON file per namespace in messages/en and messages/fr
public/                   Icons, manifest, robots.txt, font licences; search/ and md/ are generated
scripts/                  Generators and checks: pages, public, redirects, links, messages, charter, weight, newversion
__tests__/                Tests sit in a `__tests__/` folder beside the code they cover (`src/lib/__tests__/`, `scripts/__tests__/`)
src/app/(site)/           Root layout and routes of the English site, served at /
src/app/(fr)/fr/          Root layout and routes of the French site, served at /fr/
src/app/fonts/            Geist, Geist Mono and Bricolage Grotesque (latin and latin-ext subsets)
src/app/globals.css       The only stylesheet: Tailwind, design tokens, fonts, animations
src/components/chrome/    Header, phone top bar, menus, version and language controls, banner, footer
src/components/doc/       Page blocks: route bar, tables, code, callouts, sidebar, table of contents, status
src/components/home/      Home page: hero, catalogue, further reading
src/components/search/    Search palette, loaded on first open
src/components/seo/       JSON-LD
src/components/try/       Try panel, phone bar and sheet, Playground, code samples, response viewer
src/components/ui/        Generated shadcn/ui components
src/data/                 Catalogue, versions, plans, links, site constants, home, shortcuts, theme
src/data/pages/vN/        The content: one TypeScript module per page, v1 to v6
src/hooks/                Preferences, shortcuts, search, request, sheet, palette and address state
src/i18n/                 next-intl routing and request configuration
src/lib/                  Routes, redirects, inline grammar, navigation, search, snippets, metadata, Markdown
src/types/                Content model, navigation and search types
```

Three modules are generated and never edited by hand: `src/data/pages/registry.ts` (lazy import of each page), `src/data/nav.ts` (title, kind, methods and status of each page, plus the release) and `src/data/kinds.ts` (the kind of each page, the small index the client bundles). `npm run gen` writes them and `npm run check` fails when they are stale.

## Notes

### Routing

The site is a static export, so there is no middleware and no `[locale]` segment. Two root layouts do the job: `src/app/(site)/` serves English without a prefix and `src/app/(fr)/fr/` serves French under a static `fr` folder, both rendering the same `Shell`. Documentation pages are `[version]/[[...slug]]` under each of them, with `dynamicParams = false`: a page that is not in the registry is a 404. With `trailingSlash`, a page is `/v6/hash/` in English and `/fr/v6/hash/` in French; the home pages are `/` and `/fr/`.

A page id is the path after the version (`hash`, `captcha/verify`, `changelog/6.1.0`, and `index` for the version home). The first segment of a page id may not be `en`, `fr` or a version id such as `v6`: the redirects and the `ref:` links would read it as a language or a version, and `scripts/pages.ts --check` refuses it (`encode` is fine, only a whole segment counts). Release pages have a dotted last segment, which `next dev` redirects to the slashless form while the export serves a folder, so route helpers ignore the trailing slash.

### Old URLs and the 404

The VitePress site served `/vN/en/<page>` and `/vN/fr/<page>`. After `next build`, `scripts/redirects.ts` writes two small redirect files per legacy page into `out/` (the folder form and its `.html` twin, because GitHub Pages serves `/foo` from `foo.html` before `foo/`), with the canonical URL, a zero-second refresh and a script that also remaps the old French fragments. The list of legacy URLs is a fixed input (`src/lib/oldUrls.json`), never derived from the registry, so a page that disappears is caught. The short forms of the latest version are prebuilt the same way, so a visitor never sees the 404 page on them: `/latest`, `/latest/<id>`, the bare page ids (`/hash`, `/changelog`, `/changelog/6.1.0`), `/changelog/latest`, and the release numbers of every published changelog (`/6.1.0`, `/changelog/5.6.0`), each also under `/fr`. The list is enumerated from the data (the pages of `LATEST`, the release pages of the versions with a changelog), never typed, and every target is what `getSmartRedirect` answers for the address in each language, so a prebuilt page cannot disagree with the 404 script. An address without a language prefix carries both targets and a small inline script that picks one with the rule of `getUserLang` (the choice saved by the language menu, else the browser language, else English); `/fr/...` goes straight to French; without script the refresh and the link lead to English. An address that a real route of the export owns (a page id such as `search` or `md`) is not written: the real route wins and the build logs it. Everything else unknown lands on `404.html`, where `lib/redirect.ts` applies the long tail (an unknown release number, `/v5/hash.html`, a missing page under `/latest`) in the language of the visitor and shows the 404 page when nothing matches.

`npm run start` serves `out/` with `serve`, which does not reproduce how GitHub Pages treats `.html` twins and dotted folders: check redirect behaviour on a Pages-like server or after deploy.

### Adding a language

The content model is bilingual by construction (`Loc<T>` holds `en` and `fr`), so a third language is a project, not a switch. In order:

1. `src/i18n/routing.ts`: add the code to `locales` and to `LOCALE_TAGS`.
2. `messages/xx/`: one file per namespace, with the same keys as `messages/en/` (`scripts/messages.ts` checks the parity).
3. A sibling route group `src/app/(xx)/xx/` with its own root layout (`lang="xx"`), its home, its `[version]` layout and its `[[...slug]]` page, copied from `(fr)`.
4. `src/types/content.ts`: add the code to `Lang` and `Loc`, then give every `Loc` leaf of the data (every page, `catalogue.ts`, `plans.ts`) a value in the new language; `tsc` lists what is missing.
5. The places that name both languages: `src/lib/routes.ts`, `src/lib/redirect.ts`, `src/lib/sitemap.ts`, `src/lib/metadata.ts`, `src/lib/format.ts`, `src/lib/inline.ts` (the test that tells a `Loc` from a plain value), `src/app/global-not-found.tsx`, the language switch (a menu with one row per locale, `src/components/chrome/Language.tsx` and `LanguageMenu.tsx`) and the scripts `pages.ts`, `public.ts`, `redirects.ts`, `links.ts` and `messages.ts`.

### Data workflow

Pages are edited as data, never as Markdown. The content model is described in [`guides/DATA.md`](./guides/DATA.md). The loop is: edit a module under `src/data/pages/vN/`, run `npm run gen`, then `npm run check`. Adding an endpoint, editing a page, marking a status, creating a version and publishing are in [`guides/RELEASE.md`](./guides/RELEASE.md) and [`guides/VERSIONING.md`](./guides/VERSIONING.md). The UI text lives in `messages/` only, never in `src/data/`.

`scripts/pages.ts --check`, part of `npm run check`, fails on: a stale generated module, an empty title or a half-translated leaf, a prose leaf written once for both languages that is not listed in `scripts/identical.json`, a broken `ref:` link or section id, a page that no sidebar group reaches, a catalogue entry missing from a version it belongs to, and the listed counts of the latest version.

### Status of a page

A page can carry `status: "experimental" | "beta" | "deprecated"` (`Page.status`). Add the field to the page module of the version concerned, run `npm run gen`, and the status appears everywhere without further work: the word on a marker in the page title and in the changelog lines that link to the page, and a round pictogram in the sidebar, the header crumb, the search results and the catalogue cards. Today `manifest` is experimental and `hyperplanning` is deprecated. A deprecated endpoint that leaves the listings also gets `deprecated` and `unlisted` on its entry in `src/data/catalogue.ts`; the page keeps answering. See `guides/RELEASE.md`.

### First-load weight

The JavaScript a page downloads before it is usable is a budget, not an accident: at most 250 kB gzip for the script tags and 258 kB with the chunks a page preloads. `npm run weight` measures every page of `out/` after a build and exits 1 on any page over either alarm. What keeps the pages under it: the palette, MiniSearch and their messages load on first open; the code samples load after hydration; the client islands import small derived modules (`kinds.ts`, `query.ts`) instead of the whole navigation index. Check it before a release and after adding a dependency.

### Traps

- Never edit `registry.ts`, `nav.ts` or `kinds.ts`. After changing `version` in `package.json`, run `npm run gen`: the release shown everywhere is written into `nav.ts` and `--check` fails when it differs.
- `Page.updated` is a plain date in the module, shown as the last update of the page and used as `lastmod` in the sitemap. Nothing bumps it for you: change it in the same commit as the edit.
- `public/search/` and `public/md/` are generated and git-ignored; `dev` and `build` write them.
- A nested `NextIntlClientProvider` replaces the messages of the outer one. The namespaces of each client tree are listed in `src/i18n/routing.ts` and `scripts/messages.ts` fails when a client component reads one that its tree does not provide, an error that would otherwise only show in the browser.
- Next refuses a second `next dev` in the same project; do not set `distDir`, `next dev` would rewrite `tsconfig.json` and `next-env.d.ts` and leave stale type files that break `tsc`.
- A static export cannot send HTTP headers or redirects: everything that behaves like one (old URLs, short forms, language choice on `/`) is a file or a script in the page.
- Dates are formatted with an explicit UTC zone, so the machine that builds cannot change a day.

## Why Next

The site used to be VitePress: 502 Markdown files, over a thousand Vue component tags inside them, a custom theme with scoped styles and a registry of endpoints that duplicated the pages. What Next.js, Tailwind and typed data bring:

- Style and theme maintenance. Scoped styles scattered CSS across the components and piled up overrides; now the style is Tailwind classes on the markup and the theme is one set of semantic tokens in `src/app/globals.css`, so dark mode is a token swap.
- One language. Content, components and scripts are typed TypeScript; there is no template language and no Markdown at runtime, and a content mistake (a broken link, a missing translation, a stale navigation entry) fails `npm run check` instead of reaching a reader.
- The ecosystem. shadcn/ui and Radix, cmdk for the palette and Vaul for the phone sheet are the reference on the React side, and the search and the Try panel are ordinary React instead of Vue plus workarounds.
- The same stack and conventions as the author's other projects, so tooling and habits carry over.

The cost was real. A documentation site is not a good case for a framework: 500 pages in two languages had to be converted without losing a word, which is why half of the migration was a verifier, and a React runtime weighs more than the text it displays (about 245 kB of JavaScript for a documentation page, hence the guard above). Had the site been small, stable and rarely touched, the migration would not have paid for itself.

What a static export cannot do, and how the site lives with it:

- No server, so no redirect or header of its own: old URLs and short forms are generated files, language detection on `/` is an inline script in the browser (no `Accept-Language`), and every unknown URL gets the one `404.html` with a real 404 status even when the client then redirects.
- No incremental rendering: a content change is a rebuild and a deploy of the whole site (about a minute for 505 pages).
- No runtime route handlers: the Try panel calls the API straight from the browser, so the API has to allow the origin, and no request can be proxied or kept secret.
- No cookies and no per-visitor rendering: theme and language come from `localStorage`, and a boot script sets them before the first paint.
- No image optimization and no custom cache or security headers; GitHub Pages decides.
- `dynamicParams = false`: only the pages of the registry exist.

## Design

The design of moxon docs is its own: ink and yellow (`#fde68a`), Geist, Geist Mono and Bricolage Grotesque, defined as tokens in `src/app/globals.css`. It replaces the reference graphic identity of the coding charter that the rest of this repository follows (file naming, comments, one stylesheet, no decorative Unicode, Tailwind and shadcn/ui, next-themes).

## License

BSD 3-Clause, see [`LICENSE`](./LICENSE). The fonts are under the SIL Open Font License 1.1, see [`public/fonts/LICENSE.txt`](./public/fonts/LICENSE.txt).
