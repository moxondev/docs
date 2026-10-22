# Content model

The documentation is data. Every page of every version is one TypeScript module under `src/data/pages/vN/`, typed by `src/types/content.ts`, which carries no comments by the coding rules: this guide is where the model is explained. There is no Markdown and no MDX at runtime; a fixed set of components draws the blocks described below.

## What is authored and what is generated

| Fact                                                                     | Authored in                                |
| ------------------------------------------------------------------------ | ------------------------------------------ |
| Which pages exist in a version, their text, tables and sections          | the modules of `src/data/pages/vN/`        |
| Method, path, parameters and Try availability of an endpoint             | `Page.operations` of its module            |
| Category, name, tagline and summary of an endpoint, deprecation, listing | `src/data/catalogue.ts`                    |
| Version status, release and features                                     | `src/data/versions.ts`                     |
| Pricing and rate limits                                                  | `src/data/plans.ts`                        |
| External URLs and site constants                                         | `src/data/links.ts` and `src/data/site.ts` |
| Home page demo and cards                                                 | `src/data/home.ts`                         |
| Keyboard shortcuts                                                       | `src/data/shortcuts.ts`                    |
| UI text, in both languages                                               | `messages/<locale>/<namespace>.json`       |

Everything else is derived: the registry (`src/data/pages/registry.ts`), the navigation index (`src/data/nav.ts`), the kinds index (`src/data/kinds.ts`), the sidebar, the pager, the breadcrumb, the version and language targets, the search indexes, the sitemap, the redirect files and the Markdown exports. The three generated modules are written by `npm run gen` and checked for freshness by `npm run check`; never edit them.

## A page module

A module exports one `page` of type `Page`, except `releases.ts`, which exports a `releases` record of release pages keyed by release number.

```ts
import type { Page } from "@/types/content";

export const page: Page = {
    version: "v6",
    id: "hash",
    kind: "endpoint",
    title: { en: "Hash", fr: "Hash" },
    lead: { en: "The `/hash` endpoint ...", fr: "L'endpoint `/hash` ..." },
    updated: "2026-10-17",
    operations: [{ id: "default", method: "post", path: "/hash", try: true, params: [] }],
    sections: [{ id: "", blocks: [{ type: "endpoint", op: "default" }] }],
};
```

The file is named after the page id, each segment in camelCase: `hash.ts`, `captcha/verify.ts`, `ticTacToe/fetch.ts` for `tic-tac-toe/fetch` (the id keeps the slug, the file name follows the file-naming rule). A page with sub-pages is a file and a folder of the same name (`chat.ts`, `chat/clear.ts`). All the release pages of a version live in one module, `releases.ts`, because a dotted name such as `6.1.0.ts` would break the file-name rule.

| Field        | Meaning                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `version`    | The version of the folder; checked against it                                                                                            |
| `id`         | The path after the version: `hash`, `captcha/verify`, `changelog`, `changelog/6.1.0`; the version home is `index`                        |
| `kind`       | `index`, `endpoint`, `article`, `pricing`, `playground`, `changelog` or `release`; it picks the layout                                   |
| `status`     | Optional: `experimental`, `beta` or `deprecated`, see below                                                                              |
| `title`      | The `h1`, one string per language, inline grammar allowed (a code span for an endpoint such as `/chat`)                                  |
| `lead`       | The first paragraph, written once: it is the meta description (160 characters) and the search excerpt, and it is not repeated in a block |
| `banner`     | `true` on a version home: the full migration or retirement banner (the other pages of an old version get the slim one)                   |
| `updated`    | `YYYY-MM-DD`, shown as the last update, used as `lastmod` in the sitemap; bump it when you edit the page                                 |
| `operations` | The HTTP operations of an endpoint (and of a home that embeds a Try), see below                                                          |
| `release`    | On a release page: the release number, its GitHub URL and a one-sentence summary                                                         |
| `sections`   | The body, see below                                                                                                                      |

The layout follows the kind and the operations. An `endpoint` with a Try operation is three columns (sidebar, content, Try panel; below 1280 px the panel moves under the introduction, on a phone a bar and a sheet replace it). `index`, `article`, `pricing`, `changelog`, `release` and the endpoints of versions without a live API are a sidebar and a prose column. `playground` is full width. The sidebar group of a page comes from its id: introduction (`index`, `authentication`, `pricing`), tools (`playground`, `changelog`, `manifest`), and the catalogue for every page that has an entry in `catalogue.ts`, in the category of that entry.

## Two languages in one file

Every text exists in English and in French, side by side, so a page cannot be translated half-way without a check noticing.

- `Loc<T>` is `{ en: T, fr: T }`.
- `Lx<T>` is a `T` written once when it is the same in both languages, or a `Loc<T>` when it is not. Names, paths, numbers, code and anything identical stay a plain value. Prose that really is identical (a heading such as "Note", a word such as "Kelvin") has to be allowed: `scripts/pages.ts --check` fails on a prose leaf written once for both languages unless it is listed under the page in `scripts/identical.json` (`"v3/convert": ["Kelvin"]`). A leaf that has words and is not translated is almost always a mistake, which is the point of the guard.
- A `Loc` leaf that is empty in one language only is an error. A section that exists in one language only sets `only: "en"` or `only: "fr"`; its title is then written for that language and the section is skipped in the other.
- A block of type `split` holds one list of blocks per language (`{ type: "split", en: [...], fr: [...] }`) for the rare passage whose structure differs between the languages; its branches are single-language by design.

## Inline grammar

Every text field and table cell is an inline string, parsed by `src/lib/inline.ts`.

| Written                                | Result                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `` `code` ``                           | A code span                                                                                                   |
| `**strong**`, `*em*`                   | Strong and emphasis (stars only, an underscore is plain text)                                                 |
| `[text](https://...)`                  | An external link (opened in a new tab unless it targets moxon.dev) or `mailto:`                               |
| `[text](ref:hash)`                     | An internal link to a page of the same version and language                                                   |
| `[text](ref:v5/hash)`                  | The same with an explicit version                                                                             |
| `[text](ref:index)`                    | The home of the version; `ref:/` is the site home                                                             |
| `[text](ref:hash#id)`                  | A link to a section id of the target page                                                                     |
| `[text](#id)`                          | A link to a section of the same page                                                                          |
| `{icon:arrow-right}`                   | The arrow icon with an accessible word; the only token today, add names to `ICON_TEXT` in `src/lib/inline.ts` |
| `\*`, `\[`, `\]`, `` \` ``, `\\`, `\{` | A literal character                                                                                           |

Links never carry a language or a trailing slash: the router adds the `/fr/` prefix and the final slash, so one `ref:` serves both languages. `scripts/pages.ts --check` resolves every `ref:` target and every section id and fails on a broken one. A literal path such as `/v6/hash` written in text (a code span, an API URL) is plain text; the new-version script rewrites it, see [VERSIONING.md](./VERSIONING.md).

## Sections and anchors

`sections[0]` is the untitled preamble (`id: ""`, no `level`). The others have an `id`, a `level` (`2` or `3`) and a `title`; the table of contents lists both levels.

- The `id` is the anchor in both languages (`#response-fields`) and is the English slug of the heading as the previous site produced it. Choose it once and keep it: external links point at it.
- `aliases` lists other ids that still lead to the section, the French slugs of the previous site (`parametres` for `parameters`). The redirect files of the old URLs use them to rewrite a fragment; they are not extra anchors on the new page.
- The rows of the parameter, field and error tables get their own anchors, derived from the content and never typed: `p-<name>`, `f-<name>` and `e-<n>`, prefixed by the operation id on pages that have two operations (`post-p-text`). The search palette links to them, which is why a parameter should keep its name.
- The Try panel is `#try`. The ids `try-it` and `essayer` of the previous site's Try headings are kept as aliases of it.

## Blocks

A section holds blocks, drawn in order.

| Block           | Fields and use                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p`             | `text`: a paragraph                                                                                                                                                                         |
| `label`         | `text`: a short bold line above what follows                                                                                                                                                |
| `list`          | `items`; `ordered: true` for a numbered list                                                                                                                                                |
| `quote`, `rule` | A quotation, a horizontal rule                                                                                                                                                              |
| `callout`       | `kind` (`info`, `tip`, `warning`, `danger`), `title`, `body` (a list of parts, paragraphs `{ type: "p", text }` and lists `{ type: "list", items }`, written once or one list per language) |
| `details`       | `title` and `body`: a collapsible group of blocks                                                                                                                                           |
| `values`        | `title` and `groups` of `label` and `items`: the families of values of a parameter (the hash methods), with a filter                                                                        |
| `code`          | `text` (one per language when it differs), `lang` (`json`, `bash`, `html`, `js`, `diff`, `http`, `text`), `role` (`request`, `response`, `curl` on retired versions)                        |
| `table`         | `head` and `rows` of inline cells; `kind` (`definition`, `matrix`, `list`) records the shape of the source table and does not change how it is drawn                                        |
| `params`        | The parameters table: rows of `name`, `required` (`true`, `false` or `"conditional"`), `default` and `description`; `columns: "default-after-description"` for the older column order       |
| `fields`        | The response fields table: rows of `name`, `type` (inline, usually a code span) and `description`                                                                                           |
| `errors`        | The errors table: rows of `message` (the exact text the API returns), `description` and the HTTP `status`; `short: true` for a two-column table                                             |
| `endpoint`      | `op`: the route bar (method chip, host, versioned path, copy) of an operation                                                                                                               |
| `examples`      | `op`, and optionally `path` (a literal path for a family page), `query` and `body`: the cURL, JavaScript, Python and PHP samples of a request                                               |
| `try`           | `op`: the Try panel of an operation; it is drawn in the right column, not inline. `autoSend: true` keeps it inline and sends it on load (Getting Started)                                   |
| `related`       | `items` of `label`, `to` and `description`; an empty `label` shows the title of the target page, `to` is a `ref:` target without the prefix (`hash`, `v5/hash`, `hash#algorithms`)          |
| `plans`         | The pricing grid, from `src/data/plans.ts`                                                                                                                                                  |
| `playground`    | The Playground, from the `operations` of the version's pages                                                                                                                                |
| `split`         | One list of blocks per language                                                                                                                                                             |

## Operations and Try

`Page.operations` is the single source of the facts of an endpoint: the route bar, the Try panel, the phone bar and sheet, the code samples, the Playground picker, the sidebar and search method chips and the catalogue marks all read it.

An `Operation` has an `id` (`default`, or distinct names such as `get` and `post` when a page documents two methods on one path), a `method`, an unversioned `path` (`/hash`; a placeholder is `:name`, as in `/chat/:token`), `try` and `params`. `try: false` documents the operation without a panel and keeps it out of the Playground, for an endpoint the live API no longer answers (`hyperplanning` in v6) or a family page. The blocks `endpoint`, `examples` and `try` point at an operation by its `id`; on a page with one operation `default` is enough.

A `ParamSpec` describes one input: `name`, `type` (`string`, `number`, `boolean`, `enum`, `json`), where it goes (`in`: `query` for a GET, `body` for the others, `path` for a placeholder), `required` (`true`, `false`, `"conditional"`), and optionally `default`, `options` (an enum), `featured` (the options offered as one-click chips), `placeholder` and `value` (a preset). The same object builds the form, the request and the code samples, so the sample shown is the request sent. The `params` block is the documentation of the same parameters in prose and does not drive the form: keep both in step.

The live URL of a request is the API base, the version and the path: `https://api.moxon.dev` + `/v6` + `/hash`. Documentation versions and API versions are the same number.

## Status

`Page.status` is `"experimental"`, `"beta"` or `"deprecated"`, absent for a stable page. It is copied into the navigation index by `npm run gen`, and the components read it from there: the word on a marker in the page title and in a changelog line that links to the page, a round pictogram (flask, sprout, archive box) in the sidebar, the header crumb, the search results and the home cards. Each status has its own tokens in `globals.css` and its words in `messages/<locale>/common.json`. Only the page of the version concerned carries it: marking `manifest` in v6 does nothing to another version.

## Releases and changelog

The `changelog` page of a version is the overview (migration guide, version table). Each release is a `Page` of kind `release` in `releases.ts`, keyed by its number (`"6.1.0"`), with the id `changelog/6.1.0`, `release: { version, url, summary }` and sections of lists. The release pages of a version are found from the record, so nothing else has to register them: `npm run gen` finds them.

## Catalogue, versions, plans, home

`src/data/catalogue.ts` has the seven categories (`CATEGORIES`: id, home anchor, title, summary) and one `EndpointMeta` per endpoint: `slug` (the page id), display `name`, `category`, `tagline` (the catalogue line), `summary` (one sentence, used as meta description and in search when a page has no lead), `since` (the first version that has it), and optionally `deprecated` (the version where it is deprecated) and `unlisted` (versions whose catalogue and sidebar hide it, while the page still answers and is searched). The check requires the endpoint's page in every published version from `since` on, and none before. The number of endpoints on the home is counted from this list, never typed.

`src/data/versions.ts` has one `VersionDef` per version, newest first: `status` (`latest`, `previous`, `legacy`, `retired`: the banner and the version picker follow it), `release` (the last release of the major), and the flags `served` (the live API answers; false removes the Try panel and the Playground entry), `playground` and `changelog`. `LATEST` is the first entry and is used by the home, the 404 page, the short-form redirects and the search default.

`src/data/plans.ts` is the pricing grid: name, price, limits per hour, day, week and month, burst per 10 seconds and the button. The authentication tables of the pages keep the same figures as text, and `plans` is what the `plans` block draws. `src/data/links.ts` is the finite list of external URLs the site may print; the link check allows no other. `src/data/home.ts` holds the static example of the home (a real answer of the API, so the home makes no live call) and the "go further" cards, whose texts are in `messages/<locale>/home.json`.

## Aliases and redirects

Four mechanisms keep old addresses alive, and none of them is a Next.js route.

- Legacy URLs (`/v6/en/hash`, `/v6/fr/hash.html`): `scripts/redirects.ts` writes redirect files into `out/` after the build, from the fixed list `src/lib/oldUrls.json`. A fragment of the old French slugs is remapped through the `aliases` of the section.
- Short forms of the latest version (`/latest`, `/latest/hash`, `/hash`, `/changelog`, `/changelog/latest`, `/6.1.0`, `/changelog/6.1.0`, each also under `/fr`): `scripts/redirects.ts` writes a redirect page per address, in the folder form and the `.html` twin. The addresses are enumerated from the data (`aliasAddresses` in `src/lib/redirect.ts`: the pages of `LATEST`, the release pages of the published versions with a changelog), so a new page or release needs nothing. The targets are what `getSmartRedirect` answers, in English and in French; an address without a prefix carries both and picks one in the browser with the rule of `getUserLang`, an `/fr/...` address carries French only. An address that a real route of the export owns (a page id named `search`, `md`, `404`...) is not written and is listed in the build output.
- The long tail (an unknown release number, a missing page under `/latest`, `/v5/hash.html`): `src/lib/redirect.ts`, run by the 404 page in the browser, in the language of the visitor.
- Section ids: the `aliases` field, above.

A page that existed on the previous site cannot simply be removed from a version: its legacy URL would have no target and `npm run build` fails in the redirect step. Keep the page and mark it `deprecated` until the version that drops it is retired.

## What the checks guarantee

`npm run check` runs `scripts/pages.ts --check` over the whole data: both languages present, dates well formed, parents of sub-pages present, a version home in every version, every page reachable from a sidebar group, catalogue and pages in step, links and section ids resolving, shared prose allowed, listed counts of the latest version, generated modules fresh. A failure names the page, the rule and the leaf, for example `v6/hash untranslated written once for both languages: ...`.
