# Versioning guide

How to add a new API version to the documentation.

A documentation version is the API version: `https://api.moxon.dev/v6/hash` is documented at `/v6/hash/` (English) and `/fr/v6/hash/` (French). Each version is its own folder of page modules, `src/data/pages/vN/`, and versions are not folded into one another: the v5 pages must not change when v6 is edited, so a new version starts as a copy and then diverges. Whatever a version has in common with the previous one stays duplicated on purpose.

## Steps to add a new version (e.g. v7)

### 1. Copy the content

```bash
npx tsx scripts/newversion.ts v7 v6 --dry-run
npx tsx scripts/newversion.ts v7 v6
```

`newversion.ts <new> [<from>]` copies every page module of `src/data/pages/v6` to `src/data/pages/v7` and rewrites the links to the new version:

- a path segment `/v6` becomes `/v7` (the API URLs of the examples, the `/v6/...` labels of related links, the old-style paths in text);
- an explicit `ref:v6/...` target becomes `ref:v7/...`;
- the `version: "v6"` field of each page becomes `version: "v7"`.

Prose that merely says "v6" is left alone, and so is a link to another version (`ref:v5/index`). The script never overwrites: if `src/data/pages/v7` exists it stops without writing anything, and each file is created with an exclusive flag. `--dry-run` prints the plan (modules, number of rewritten links) and writes nothing. It also carries the entries of `scripts/identical.json` of `v6` over to `v7` (the reviewed prose that is written once for both languages), because `npm run check` would refuse the copy without them. Finally it prints the manual steps below, with the version names filled in. `<from>` defaults to the version just before `<new>`.

### 2. Declare the version

The script cannot edit code that names the versions one by one. The compiler tells you what is missing: adding `"v7"` to the `Version` type makes `tsc` fail on every place that must follow.

- `src/types/content.ts`: add `"v7"` to `Version`.
- `src/lib/routes.ts` (`KNOWN`), `src/lib/inline.ts` (`VERSIONS`) and `scripts/pages.ts` (`ALL_VERSIONS`): add `v7`.
- `src/data/versions.ts`: add the entry first, with `status: "latest"` and the release of the major, and demote the others: v6 becomes `previous`, and each older one takes the status that matches what the API still serves (`served` says whether the live API answers, `playground` whether the search palette offers the Playground, `changelog` whether the version has release notes, which the `/6.0.0` short form needs).
- `package.json`: raise `version` to `7.0.0`, then run `npm run gen`: the release is written into `src/data/nav.ts` and shown by the header, and `npm run check` fails while the two differ.

### 3. Rework the copied pages

The copy is a starting point, not the documentation of v7.

- The release notes: `changelog.ts` and `releases.ts` still describe the releases of v6. Replace them by the first release of the new major (id `changelog/7.0.0`, its GitHub URL, its summary and its sections) and update the migration guide and the "What changed" table of the overview.
- The version home (`index.ts`): the base URL is rewritten by the script, but the "Other Versions" list must now point at v6 (`ref:v6/index`) and the older ones, and the introduction must say what v7 is.
- Each endpoint that changed: parameters, fields, errors, a callout saying what moved and why, and the `updated` date. Each page you do not touch keeps its old `updated`, which is the truth.
- `src/data/catalogue.ts`: a new endpoint gets `since: "v7"`, a retired one `deprecated` and `unlisted`, and the entries keep working for the versions that already have them. A catalogue endpoint must have its page in every published version from its `since` on, so the copy keeps every page; `npm run check` fails otherwise. An entry that was `unlisted: ["v6"]` (`hyperplanning`) is listed again by the copy: add `v7` to its `unlisted` versions, or drop its page from the new folder, or the counts check fails.
- `LATEST_COUNTS` in `scripts/pages.ts`: the number of listed endpoints per category of the latest version, 49 in total for v6. Update it when the listing changes, or the content check fails with `counts`. The totals that `src/components/home/__tests__/model.test.ts` and `home.test.ts` pin (49 listed endpoints, `[9, 8, 7, 10, 6, 6, 3]` per category) follow it and are updated in the same commit.

### 4. Check

```bash
npm run format
npm run gen
npm run check
npm run build
npm run weight
npx tsx scripts/links.ts --out
```

The tests need no edit for the bump itself: the suites about the latest version (smart redirect rows, routes, metadata titles, version picker, home catalogue, sitemap, search scope) read `LATEST` and `VERSIONS` from `src/data/versions.ts`, and the ones that name `v6` are about frozen v6 data or about the legacy URLs. The registry, the navigation index, the search indexes, the sitemap, the version picker and the language switch pick the new version up from the data. `scripts/links.ts --routes` still reports the legacy URLs of v1 to v6: that list is fixed and a new version adds nothing to it.

## What happens automatically

- Banner: the full banner of a version home and the slim line of its other pages follow the version `status`. When `LATEST` moves, `previous` shows the migration banner, `legacy` the legacy one and `retired` the "no longer served" one; the latest version has none.
- Version picker, header label and Playground: read from `src/data/versions.ts`. The label of the latest version is the full release (`v7.0.0`), the others show their major.
- Short forms: `/latest`, `/latest/hash`, the bare page ids and `/changelog/latest` always go to `LATEST`; `/6.0.0` goes to the changelog of the major that holds that release. The postbuild step writes a redirect page for each of them (and for each under `/fr`), enumerated from the pages of `LATEST` and the release pages of the published versions, so nothing is edited by hand; only what has no page (an unknown release, a missing page under `/latest`) is left to the 404 page.
- Search: one index per version and language is built at `npm run gen` and loaded when the palette opens on that version.
- Sitemap, canonical URLs and language alternates: derived from the registry.

## Retiring a version

When the API stops serving a version, set `status: "retired"`, `served: false` and `playground: false` in `src/data/versions.ts`, as v1 to v3 have. Its pages stay published and keep their URLs, and the banner of a retired version says so on every page. The text of that banner (`messages/en/banner.json` and `messages/fr/banner.json`, key `retired`) names the release that stopped serving the version and the package version to install to keep using it: reword it for the version you retire before it ships.
