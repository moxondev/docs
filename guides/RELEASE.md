# Release guide

How to change the documentation and how to publish it: adding an endpoint, editing a page, marking a status, and shipping a release. The content model is in [DATA.md](./DATA.md) and the creation of a new API version is in [VERSIONING.md](./VERSIONING.md).

## Adding an endpoint

When a new API version or release adds endpoints, follow this order for the commits and the modifications. The sidebar, the pager, the search index, the Playground picker, the sitemap and the Markdown export are derived from the data, so there is no sidebar, registry or translation file to edit by hand any more.

### 1. The documentation page (one commit per endpoint)

**Commit:** `MAJOR: data: Add <name> endpoint documentation`
**Files:** `src/data/pages/v6/<name>.ts` (camelCase file name, so `tic-tac-toe` is `ticTacToe.ts`), in every version folder that has the endpoint, then the three regenerated modules (below).

Copy a page of the same shape (`hash.ts` for a POST with a body, `uuid.ts` or `color.ts` for a GET) and change it. A page follows this structure, English and French side by side:

- `operations`: the method, the path (`/<name>`), `try: true` and the `params` that build the form;
- the preamble with `{ type: "endpoint", op: "default" }`;
- `parameters` (`params` block), `code-examples` (`examples` block, with a realistic query or body), `response-fields` (`fields` block followed by `{ type: "try", op: "default" }`), `error-handling` (`errors` block with the exact messages and statuses the API returns), and `related` when other endpoints belong with it;
- optional blocks: a `callout` of kind `info` for an endpoint with a non-obvious algorithm, and `tip` only when it is genuinely useful (avoid obvious use cases).

Set `updated` to today's date. Then:

```bash
npm run gen
npm run check
```

`npm run gen` rewrites `src/data/pages/registry.ts`, `src/data/nav.ts` and `src/data/kinds.ts`; commit them with the page, so that every commit passes the check. `npm run dev` shows the page and its Try panel at `http://127.0.0.1:4815/v6/<name>/`.

### 2. The catalogue entry

**Commit:** `MAJOR: data: Add <names> endpoints`
**File:** `src/data/catalogue.ts`

Add an `EndpointMeta` in its category, in alphabetical order: `slug` (the page id), `name` (display name), `category`, `tagline` (the catalogue line, short, both languages), `summary` (one sentence, both languages: the search and meta description), and `since` (the first version that has it). The page of an endpoint with a sub-path such as `/chat/clear` is `chat/clear.ts` next to `chat.ts`, and only the parent has an entry.

The home counts its endpoints from this file. `scripts/pages.ts` asserts the listed total of each category of the latest version (`LATEST_COUNTS`, 49 in 7 categories for v6): when a category gains or loses an endpoint, update that list in the same commit or the check fails with `counts`.

### 3. Other documentation changes

**Commit:** `MEDIUM: data: ...` or `MINOR: data: ...`
**Examples:** a field type changes, a parameter is added, an info block is added to an existing page, a `related` link is added to a sibling.

### 4. Changelog

**Commit:** `MAJOR: data: Add <version> changelog`
**File:** `src/data/pages/v6/releases.ts`

Add the release to the record, keyed by its number: id `changelog/<version>`, `release: { version, url, summary }`, and the sections of lists in both languages. Link the new endpoints with `[POST /name](ref:name)`. The overview page `changelog.ts` is edited only when the migration guide changes.

## Editing a page

1. Edit the module in `src/data/pages/vN/`, both languages in the same commit.
2. Set `updated` to today (`YYYY-MM-DD`). The date shown as the last update and the `lastmod` of the sitemap come from this field only, it is written once from the history of the repository when the page was converted and nothing keeps it current, so a page edited without touching `updated` keeps announcing an old date. Nothing warns about it today.
3. `npm run gen` (needed when the title, the kind, the status or the operations of a page change, harmless otherwise), then `npm run check`.
4. Commit with `MEDIUM: data: ...` or `MINOR: data: ...`.

Do not edit older versions to follow the new one: v5 documents v5. Fix a mistake in the version that contains it.

## Marking a status

A page is experimental, beta or deprecated through `status`, in the module of the version concerned:

```ts
export const page: Page = {
    version: "v6",
    id: "manifest",
    kind: "article",
    status: "experimental",
```

1. Add the field after `kind` (or remove it when the feature becomes stable), set `updated`, run `npm run gen` and `npm run check`. The marker and the pictogram appear in the sidebar, the title, the search, the home cards and the changelog lines that link to the page.
2. For a deprecation, also put `deprecated: "v6"` on its entry in `src/data/catalogue.ts` (the version where it is deprecated), and `unlisted: ["v6"]` if it leaves the catalogue and the sidebar while its page keeps answering (then adjust `LATEST_COUNTS`). Say what replaces it in a `callout` on the page.
3. Mention the status in the release notes of the page: the changelog line that links it carries the marker.

**Commit:** `MINOR: data: Mark <name> as <status>`

## Publishing a release

A push on `master` deploys the site, a release is a separate and manual gesture: pushing does not oblige to release.

1. **Bump the version.** `package.json` `version` (`BUILD: Bump package version to <version>`), then `npm run gen`: the release is written into `src/data/nav.ts` (`MINOR: data: Regenerate the navigation index for <version>`), and `npm run check` fails while the two differ. In `src/data/versions.ts` the `release` of the latest version follows by itself; the one of an older major is typed.
2. **Verify locally**, as the workflow will:

    ```bash
    npm ci
    npm run check
    npm run build
    ```

    and what only a human runs after a build:

    ```bash
    npm run weight
    npx tsx scripts/links.ts --routes
    npx tsx scripts/links.ts --out
    ```

    `weight` fails when a page loads more than 250 kB of gzipped JavaScript (258 kB with its preloaded chunks), `--routes` proves every legacy URL still maps to a page, `--out` that no link, anchor or search result of the export is broken. `npm run start` serves `out/` on port 4816, but `serve` does not reproduce GitHub Pages for `.html` twins and dotted folders: trust the redirect checks above, not the preview.

3. **Push to `master`.** The push triggers `.github/workflows/deploy.yml`: `npm ci`, `npm run check`, `npm run build`, upload of `out/`, deploy to GitHub Pages. The custom domain moxon.dev is a setting of the repository (Pages), not a `CNAME` file, so nothing in the repository carries it. Watch the run under Actions; a failed check or build deploys nothing.
4. **Tag.** Tags are the bare version, without `v`:

    ```bash
    git tag <version>
    git push origin <version>
    ```

5. **GitHub release.** After the push and the tag, write the release notes. Follow the style of the previous release (same tone, same level of detail, same link format) and check `gh release view <previous-tag>` first. The title field stays empty.

    ```bash
    gh release create <tag> --title "" --notes "$(cat <<'EOF'
    # Version X.X.X - Mois Année

    - French narrative bullets from the user's perspective, with **[endpoint links](https://moxon.dev/v6/<name>/)**.
    - Each bullet ends with a period.
    EOF
    )"
    ```

    The header is `# Version X.X.X - Mois Année` (month in French, capitalized). The bullets tell what a reader of the documentation or a user of the API gains, not the list of commits. Use `gh release edit <tag> --notes ...` to fix a release that already exists.

### The first deploy of the Next.js site

`master` still holds the VitePress site, and the first deploy of this branch ships three things at once: the rename, the 6.1.0 documentation and the new site. The old site stays in the git history (the last commit of `master` before the merge), so no tag is needed to find it again.

To roll back, revert the merge commit on `master` and let the workflow run again (or re-run an earlier successful deploy from Actions). Crawlers are allowed for the first time with the new `robots.txt`, and the old URLs keep answering through the redirect files.

## Commit style

- Format: `SEVERITY: scope: Description`, subject line only, no body.
- Severities: `MAJOR` | `MEDIUM` | `MINOR` | `BUILD` | `DOC`. `BUILD` and `DOC` have no scope.
- Scopes: `app`, `components`, `data`, `hooks`, `i18n`, `lib`, `public`, `scripts`. One scope per commit.
- No co-author, no "refactor" wording.
- One endpoint documentation page is one commit. Changes to shared code (data, components, messages) may group several endpoints in one commit.
