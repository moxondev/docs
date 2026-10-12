# Adding New Endpoints — Checklist

When a new API version adds endpoints, follow this exact order for commits and modifications.

## 1. Endpoint documentation pages (one commit per endpoint)

**Commit:** `MAJOR: docs: Add <name> endpoint documentation`
**Files:** `src/v5/en/<name>.md` + `src/v5/fr/<name>.md`

Each page follows this structure:

```md
# Title (EN) / Titre (FR)

Description of the endpoint.

<Endpoint method="get" path="/<name>" baseUrl="https://api.moxon.dev" />

## Parameters / Paramètres

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| `param`   | Yes/Oui  | ...         |

## Response Fields / Champs de réponse

| Field   | Type     | Description |
| ------- | -------- | ----------- |
| `field` | `string` | ...         |

## Code Examples / Exemples de code

<Examples method="get" path="/<name>" :params="{ key: 'value' }" />

## Try It / Essayer

<Try name="<Name>" />

## Error Handling / Gestion des erreurs

| Error Message | Description |
| ------------- | ----------- |
| `...`         | ...         |
```

Optional blocks:

- `::: info How it works?` / `::: info Comment ça marche ?` — for endpoints with non-obvious algorithms
- `::: tip` — only when genuinely useful, avoid obvious use cases

## 2. Other documentation changes

**Commit:** `MEDIUM: docs: ...` or `MINOR: docs: ...`
**Examples:** update existing endpoint pages (field type changes, new parameters), add info blocks

## 3. Endpoints registry (Playground)

**Commit:** `MAJOR: data: Add <names> endpoints`
**File:** `src/.vitepress/theme/data/endpoints.ts`

Add an `EndpointDef` entry (alphabetical order within group) with:

- `name`: display name (must match Features.vue key)
- `path`: API path
- `method`: `'get' | 'post' | 'patch' | 'delete'`
- `group`: `'Endpoints'` (or `'Chat'`, `'Tic-Tac-Toe'`)
- `params`: array of `EndpointParam` with `name`, `required`, optional `placeholder`, `options`, `default`
- `doc?`: only needed if path differs from doc page (e.g. `/chat/:token` → `doc: '/chat/clear'`)

## 4. Features component

**Commit:** `MINOR: components: Add <names> keys to Features`
**File:** `src/.vitepress/theme/components/Features.vue`

Add key mapping: `'<Name>': 'features.<name>'` (alphabetical order)

## 5. Internationalization

**Commit:** `MEDIUM: i18n: Add <names> descriptions`
**Files:**

- `src/.vitepress/theme/i18n/types.ts` — add key in `features` (alphabetical)
- `src/.vitepress/theme/i18n/en.ts` — add English description (~1 sentence)
- `src/.vitepress/theme/i18n/fr.ts` — add French description

## 6. Changelog

**Commit:** `MAJOR: docs: Add <version> changelog`
**Files:** `src/v5/en/changelog/<version>.md` + `src/v5/fr/changelog/<version>.md`

## 7. Sidebar

**Commit:** `MEDIUM: sidebar: Add <names> and <version> changelog entries`
**File:** `src/.vitepress/sidebar/v5.ts`

Add entries in both `/v5/en/` and `/v5/fr/` sections:

- Endpoint entries: alphabetical order, with `badge: 'GET'` (or POST, etc.)
- Changelog entry: at the top of the changelog items list

## 8. Version bump

**Commit:** `BUILD: Bump package version to <version>`
**File:** `package.json`

## 9. README

**Commit:** `DOC: Update version to <version>`
**File:** `README.md`

## 10. GitHub Release

After push + tag, edit the release notes. Follow the style of the previous release (same tone, same level of detail, same link format). Always check `gh release view <previous-tag>` first.

```bash
gh release edit <tag> --notes "$(cat <<'EOF'
# Version X.X.X - Mois Année

- French narrative bullets from the user's perspective, with **[endpoint links](https://moxon.dev/v5/<name>)**.
- Each bullet ends with a period.
EOF
)"
```

---

## Commit Style

- Format: `SEVERITY: scope: Description`
- Severities: `MAJOR` | `MEDIUM` | `MINOR` | `BUILD` | `DOC`
- Scopes: `docs`, `components`, `data`, `i18n`, `sidebar`, `styles`, `composables`
- One scope per commit, no co-author, no "refactor" wording
- One endpoint doc page = one commit
- Infrastructure changes (data, components, i18n) can group multiple endpoints per commit
