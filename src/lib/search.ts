import MiniSearch, { type Options, type SearchOptions } from "minisearch";

import { CATEGORIES } from "@/data/catalogue";
import { LATEST, VERSIONS } from "@/data/versions";
import { pageAnchors } from "@/lib/anchors";
import { type IconName, pick, plain } from "@/lib/inline";
import { catalogueEntry, familyMethods, isListed, pageOrder, releasePages } from "@/lib/nav";
import { apiPath } from "@/lib/request";
import { hasPage, href, parsePath } from "@/lib/routes";
import type {
    Block,
    Inline,
    Lang,
    Lx,
    Method,
    Operation,
    Page,
    ParamSpec,
    Version,
} from "@/types/content";
import type { Nav } from "@/types/nav";
import type {
    SearchDoc,
    SearchGroup,
    SearchGroupId,
    SearchKind,
    SearchQuery,
} from "@/types/search";

export interface SearchContext {
    nav: Nav;
    icons?: Record<IconName, string>;
}

export interface SearchIndex {
    docs: SearchDoc[];
    byKey: Map<string, SearchDoc>;
    mini: MiniSearch<SearchDoc>;
}

export interface SearchCounts {
    endpoints: number;
    params: number;
    errors: number;
    pages: number;
}

interface Builder {
    page: Page;
    lang: Lang;
    ctx: SearchContext;
    u: string;
    docs: SearchDoc[];
}

// Longest prose excerpt of a section or a page, indexed with a low boost
export const EXCERPT_MAX = 1200;

// Longest description line (d) of a result row; the palette cuts it again with an ellipsis
export const LINE_MAX = 160;

// Rows shown per group of the palette; the count of the field reports every match
export const GROUP_LIMIT = 8;

// Storage key of the recent results of the palette and how many it keeps
export const RECENT_KEY = "moxon-recent";
export const RECENT_MAX = 5;

// Pages suggested on an empty query
export const SUGGESTED: readonly string[] = ["hash", "uuid", "qrcode", "playground"];

// Palette group of each kind of row: response fields join the parameters, sections the pages
export const GROUP_OF: Readonly<Record<SearchKind, SearchGroupId>> = {
    endpoint: "endpoints",
    param: "params",
    field: "params",
    error: "errors",
    section: "pages",
    page: "pages",
};

export const GROUP_ORDER: readonly SearchGroupId[] = ["endpoints", "params", "errors", "pages"];

// Score factor of each kind, so that the endpoint "Hash" ranks before the response field "hash"
const KIND_BOOST: Readonly<Record<SearchKind, number>> = {
    endpoint: 2,
    page: 1.5,
    section: 1.2,
    param: 1.1,
    field: 1,
    error: 1,
};

// Score factor of a row whose name is the whole query
const EXACT_BOOST = 3;

// Fuzzy candidates of MiniSearch ranked for the "Did you mean" suggestion
const SUGGESTION_CANDIDATES = 12;

// Methods accepted by the prefix filter ("post:", "get:"...)
const METHODS: readonly Method[] = ["get", "post", "put", "patch", "delete"];

// Suffix of the type in the p key of a parameter row: required, conditional (optional has none)
const REQUIRED_MARK = "!";
const CONDITIONAL_MARK = "~";

// Ellipsis closing a description line that was cut (built from its code point: ASCII source)
const ELLIPSIS = String.fromCodePoint(0x2026);

// Boosts, prefix matching and AND combination of the MiniSearch queries
const SEARCH_DEFAULTS: SearchOptions = {
    boost: { t: 3, r: 2, x: 0.5 },
    prefix: true,
    combineWith: "AND",
};

/**
 * Gives the name of the index file of a version and language.
 *
 * @param version - First part of the file name ("v6")
 * @param lang - Second part of the file name ("fr")
 * @returns For example "v6fr.json", under public/search in the repository and /search/ online
 */
export function indexFile(version: Version, lang: Lang): string {
    return `${version}${lang}.json`;
}

/**
 * Gives the URL the browser fetches the index of a version and language from.
 *
 * @param version - Version part of the file name under /search/
 * @param lang - Language part of the file name under /search/
 * @returns A site path such as "/search/v6fr.json"
 */
export function indexUrl(version: Version, lang: Lang): string {
    return `/search/${indexFile(version, lang)}`;
}

/**
 * Gives the scope of the palette on a page: the language of the path and the version being
 * viewed, the latest one on the homes and the 404 page.
 *
 * @param pathname - Path of the current page
 * @returns The language and version whose index to search
 */
export function searchScope(pathname: string): { lang: Lang; version: Version } {
    const { lang, version } = parsePath(pathname);
    return { lang, version: version ?? LATEST };
}

/**
 * Gives the identity of a search document: its page path plus its fragment, unique in one index
 * file (MiniSearch id, cmdk value, recent list entry).
 *
 * @param doc - Document whose u and h are read
 * @returns "u#h", with an empty fragment for page and endpoint documents
 */
export function docKey(doc: SearchDoc): string {
    return `${doc.u}#${doc.h ?? ""}`;
}

/**
 * Gives the href that opens a search result.
 *
 * @param doc - Document whose u and h are read
 * @returns The page path, followed by "#h" for a section or a row
 */
export function docHref(doc: SearchDoc): string {
    return doc.h ? `${doc.u}#${doc.h}` : doc.u;
}

/**
 * Normalizes one indexed or searched term: lower case and diacritics removed, so "securite"
 * finds "Securite" with or without its accents.
 *
 * @param term - Term from the tokenizer of MiniSearch
 * @returns The folded term, or null for an empty one (MiniSearch then skips it)
 */
export function foldTerm(term: string): string | null {
    const folded = term
        .normalize("NFD")
        .replace(/\p{M}+/gu, "")
        .toLowerCase();
    return folded || null;
}

/**
 * Reads one searchable field of a document for MiniSearch; the virtual id field is the key.
 *
 * @param doc - Document read; its key stands for the virtual id field
 * @param field - "id" or one of the searched keys (t, r, d, x)
 * @returns The text of the field, empty when the document has none
 */
function extractField(doc: SearchDoc, field: string): string {
    if (field === "id") return docKey(doc);
    const value = (doc as unknown as Record<string, unknown>)[field];
    return typeof value === "string" ? value : "";
}

// MiniSearch configuration shared by the tests and the browser hook
export const SEARCH_OPTIONS: Options<SearchDoc> = {
    idField: "id",
    fields: ["t", "r", "d", "x"],
    storeFields: [],
    extractField,
    processTerm: foldTerm,
    searchOptions: SEARCH_DEFAULTS,
};

/**
 * Collapses white space and cuts a text at a word boundary.
 *
 * @param text - Text to clean and cut; any white space run counts as one space
 * @param max - Longest result, in characters
 * @param mark - Appended when the text was cut (the ellipsis for displayed lines)
 * @returns The text, unchanged apart from the spaces when it already fits
 */
function clip(text: string, max: number, mark = ""): string {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max - mark.length);
    const space = cut.lastIndexOf(" ");
    return `${(space > max / 2 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, "")}${mark}`;
}

/**
 * Reads the plain text of an inline leaf in the language of the builder, the arrow icon as the
 * word of the language.
 *
 * @param b - Builder state: language and icon words
 * @param lx - Inline leaf, written once or per language
 * @returns The plain text of the leaf in the language of the builder
 */
function text(b: Builder, lx: Lx<Inline>): string {
    return plain(pick(lx, b.lang), b.ctx.icons);
}

/**
 * Collects the plain text of the prose blocks of a list, plus the cells of the generic tables;
 * fences and the parameter, field and error rows are left out, those rows have their own
 * documents.
 *
 * @param b - Builder state: language and icon words
 * @param blocks - Blocks of a section, a split branch or a details body
 * @returns One string per text leaf, in document order
 */
function prose(b: Builder, blocks: readonly Block[]): string[] {
    const out: string[] = [];
    for (const block of blocks) {
        switch (block.type) {
            case "p":
            case "label":
            case "quote":
                out.push(text(b, block.text));
                break;
            case "list":
                out.push(...block.items.map((item) => text(b, item)));
                break;
            case "callout":
                out.push(text(b, block.title));
                for (const part of pick(block.body, b.lang)) {
                    const leaves = part.type === "p" ? [part.text] : part.items;
                    out.push(...leaves.map((leaf) => plain(leaf, b.ctx.icons)));
                }
                break;
            case "details":
                out.push(text(b, block.title), ...prose(b, block.body));
                break;
            case "values":
                out.push(text(b, block.title));
                for (const group of block.groups) out.push(text(b, group.label), ...group.items);
                break;
            case "table":
                out.push(...pick(block.head, b.lang).map((cell) => plain(cell, b.ctx.icons)));
                for (const row of block.rows) out.push(...row.map((cell) => text(b, cell)));
                break;
            case "split":
                out.push(...prose(b, block[b.lang]));
                break;
        }
    }
    return out;
}

/**
 * Lists the item sets of the values blocks of a page (such as the algorithms of Hash), to count
 * the values of a parameter as the page shows them.
 *
 * @param blocks - Blocks to walk, split branches and details bodies included
 * @returns One array of items per values block
 */
function valueSets(blocks: readonly Block[]): string[][] {
    return blocks.flatMap((block) => {
        if (block.type === "values") return [block.groups.flatMap((group) => group.items)];
        if (block.type === "split") return [...valueSets(block.en), ...valueSets(block.fr)];
        if (block.type === "details") return valueSets(block.body);
        return [];
    });
}

/**
 * Counts the values of a parameter for its result row: the values block of the page that lists
 * every option when there is one, else the options of the parameter.
 *
 * @param spec - Parameter of the operation, whose options are read
 * @param sets - Item sets of the values blocks of the page
 * @returns The count, or undefined when the parameter has no options
 */
function optionCount(spec: ParamSpec | undefined, sets: readonly string[][]): number | undefined {
    const options = spec?.options;
    if (!options?.length) return undefined;
    const covering = sets.find((set) => options.every((option) => set.includes(option)));
    return covering ? Math.max(covering.length, options.length) : options.length;
}

/**
 * Writes the p key of a parameter row: its type, then "!" when required or "~" when
 * conditional, so the palette preview shows the type and the tag without loading the page.
 *
 * @param spec - Parameter of the operation; its type defaults to string when it is unknown
 * @param required - Required flag of the documentation table, which wins over the operation
 * @returns For example "enum!", "string" or "number~"
 */
function paramType(spec: ParamSpec | undefined, required: boolean | "conditional"): string {
    const mark =
        required === true ? REQUIRED_MARK : required === "conditional" ? CONDITIONAL_MARK : "";
    return `${spec?.type ?? "string"}${mark}`;
}

/**
 * Lists the distinct methods of the operations of a page, in operation order.
 *
 * @param ops - Operations of the page
 * @returns The methods, empty when the page has no operation
 */
function ownMethods(ops: readonly Operation[]): Method[] {
    return [...new Set(ops.map((op) => op.method))];
}

/**
 * Builds the documents of the rows of the parameter, field and error tables of a block list,
 * each with the derived row anchor of lib/anchors and the route and method of its operation
 * (the nearest preceding endpoint, examples or Try block on pages with two operations).
 *
 * @param b - Builder state: page, language, documents
 * @param blocks - Blocks of a section, a split branch or a details body
 * @param rows - Row anchors of the page, per table block
 * @param sets - Item sets of the values blocks of the page
 * @param state - Operation id seen last, carried across sections
 */
function rowDocs(
    b: Builder,
    blocks: readonly Block[],
    rows: Map<Block, string[]>,
    sets: readonly string[][],
    state: { op?: string },
): void {
    const ops = b.page.operations ?? [];
    for (const block of blocks) {
        const op = ops.find((candidate) => candidate.id === state.op) ?? ops[0];
        const base = (): Pick<SearchDoc, "u" | "r" | "m"> =>
            op ? { u: b.u, r: apiPath(b.page.version, op), m: [op.method] } : { u: b.u };
        const ids = rows.get(block) ?? [];
        switch (block.type) {
            case "endpoint":
            case "examples":
            case "try":
                state.op = block.op;
                break;
            case "params":
                block.rows.forEach((row, i) => {
                    const spec = op?.params.find((param) => param.name === row.name);
                    const doc: SearchDoc = { k: "param", t: row.name, h: ids[i], ...base() };
                    const d = clip(text(b, row.description), LINE_MAX, ELLIPSIS);
                    if (d) doc.d = d;
                    const n = optionCount(spec, sets);
                    if (n !== undefined) doc.n = n;
                    doc.p = paramType(spec, row.required);
                    b.docs.push(doc);
                });
                break;
            case "fields":
                block.rows.forEach((row, i) => {
                    const doc: SearchDoc = { k: "field", t: row.name, h: ids[i], ...base() };
                    const d = clip(text(b, row.description), LINE_MAX, ELLIPSIS);
                    if (d) doc.d = d;
                    const type = text(b, row.type);
                    if (type) doc.p = type;
                    b.docs.push(doc);
                });
                break;
            case "errors":
                block.rows.forEach((row, i) => {
                    const doc: SearchDoc = { k: "error", t: row.message, h: ids[i], ...base() };
                    const d = clip(text(b, row.description), LINE_MAX, ELLIPSIS);
                    if (d) doc.d = d;
                    if (row.status !== undefined) doc.n = row.status;
                    b.docs.push(doc);
                });
                break;
            case "split":
                rowDocs(b, block[b.lang], rows, sets, state);
                break;
            case "details":
                rowDocs(b, block.body, rows, sets, state);
                break;
        }
    }
}

/**
 * Builds the search documents of one page in one language: the page itself (an endpoint document
 * for endpoint pages and catalogue entries, a page document otherwise), one per titled section,
 * and one per parameter, response field and error row.
 *
 * @param page - Page whose sections, operations and tables are read
 * @param lang - Language of the documents; split branches and one-language sections follow it
 * @param ctx - Navigation index (family methods) and the words of the icons
 * @returns The documents, the page first, then the sections and rows in document order
 */
export function pageDocs(page: Page, lang: Lang, ctx: SearchContext): SearchDoc[] {
    const b: Builder = { page, lang, ctx, u: href(lang, page.version, page.id), docs: [] };
    const entry = catalogueEntry(page.id);
    const family = entry?.slug === page.id ? entry : undefined;
    const ops = page.operations ?? [];
    const sections = page.sections.filter((section) => !section.only || section.only === lang);
    const preamble = sections.filter((section) => !section.level);

    const main: SearchDoc = {
        k: family || page.kind === "endpoint" ? "endpoint" : "page",
        t: family ? family.name : text(b, page.title),
        u: b.u,
    };
    if (page.status) main.s = page.status;
    if (main.k === "endpoint") {
        main.r = ops[0] ? apiPath(page.version, ops[0]) : `/${page.version}/${page.id}`;
        const methods = family ? familyMethods(ctx.nav, page.version, page.id) : ownMethods(ops);
        if (methods.length) main.m = methods;
    }
    const lead = page.lead === undefined ? "" : text(b, page.lead);
    const line = family
        ? family.summary[lang]
        : lead || (page.release ? text(b, page.release.summary) : "");
    if (line) main.d = clip(line, LINE_MAX, ELLIPSIS);
    const category = CATEGORIES.find((candidate) => candidate.id === family?.category);
    const catalogueWords =
        family && category ? [text(b, page.title), family.tagline[lang], category.title[lang]] : [];
    const excerpt = clip(
        [...catalogueWords, lead, ...preamble.flatMap((section) => prose(b, section.blocks))].join(
            " ",
        ),
        EXCERPT_MAX,
    );
    if (excerpt) main.x = excerpt;
    b.docs.push(main);

    const anchors = pageAnchors(page, lang);
    const sets = valueSets(sections.flatMap((section) => section.blocks));
    const state: { op?: string } = {};
    for (const section of sections) {
        if (section.level && section.title) {
            const doc: SearchDoc = {
                k: "section",
                t: text(b, section.title),
                u: b.u,
                h: section.id,
            };
            const x = clip(prose(b, section.blocks).join(" "), EXCERPT_MAX);
            if (x) doc.x = x;
            b.docs.push(doc);
        }
        rowDocs(b, section.blocks, anchors.rows, sets, state);
    }
    return b.docs;
}

/**
 * Builds the search index of one version in one language: the documents of every page, the
 * pages in the reading order of the navigation, then the release pages newest first and the
 * remaining pages by id, so that a query without text (a filter alone) lists them in that order.
 *
 * @param pages - Every page of the version, loaded through the registry
 * @param lang - Picks the language of every title, excerpt and path of the documents
 * @param ctx - Navigation index (order, family methods) and the words of the icons
 * @returns The documents of the index file public/search/<version><lang>.json
 */
export function buildDocs(pages: readonly Page[], lang: Lang, ctx: SearchContext): SearchDoc[] {
    const version = pages[0]?.version;
    const order = version
        ? [...pageOrder(ctx.nav, version), ...releasePages(ctx.nav, version)]
        : [];
    const rank = (page: Page) => {
        const at = order.indexOf(page.id);
        return at === -1 ? order.length : at;
    };
    const sorted = [...pages].sort(
        (a, b) => rank(a) - rank(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
    );
    return sorted.flatMap((page) => pageDocs(page, lang, ctx));
}

/**
 * Builds the MiniSearch index of a list of documents (in the browser, from the index file).
 *
 * @param docs - Documents of one version and language
 * @returns The documents, a key to document map and the full-text index
 */
export function createIndex(docs: readonly SearchDoc[]): SearchIndex {
    const mini = new MiniSearch<SearchDoc>(SEARCH_OPTIONS);
    mini.addAll(docs);
    return { docs: [...docs], byKey: new Map(docs.map((doc) => [docKey(doc), doc])), mini };
}

/**
 * Normalizes a route typed in the search field: lower case, without the version prefix and the
 * trailing slash ("/v6/UUID/" and "/uuid" both give "/uuid").
 *
 * @param route - Token that starts with "/"
 * @returns The route as the documents hold it after their version
 */
function normalizeRoute(route: string): string {
    const lower = route.toLowerCase().replace(/\/+$/, "");
    return lower.replace(/^\/v[1-6](?=\/|$)/, "") || "/";
}

/**
 * Reads the search field: a method prefix ("post:"), a route ("/uuid"), an HTTP status ("400")
 * and the rest as full text.
 *
 * @param input - Text of the search field
 * @returns The parsed query; text is empty when only filters were typed
 */
export function parseQuery(input: string): SearchQuery {
    let rest = input.trim();
    const query: SearchQuery = { text: "" };
    const prefix = /^([a-z]+):\s*/i.exec(rest);
    const method = prefix?.[1].toLowerCase();
    if (prefix && METHODS.includes(method as Method)) {
        query.method = method as Method;
        rest = rest.slice(prefix[0].length);
    }
    const words: string[] = [];
    for (const token of rest.split(/\s+/).filter(Boolean)) {
        if (query.route === undefined && token.length > 1 && token.startsWith("/")) {
            query.route = normalizeRoute(token);
        } else if (query.status === undefined && /^[1-5]\d\d$/.test(token)) {
            query.status = Number(token);
        } else words.push(token);
    }
    query.text = words.join(" ");
    return query;
}

/**
 * Tells whether a document passes the filters of a query: method, route prefix and status.
 *
 * @param doc - Document of the index
 * @param query - Parsed query
 * @returns True when every filter of the query accepts the document
 */
export function matchesFilters(doc: SearchDoc, query: SearchQuery): boolean {
    if (query.method && !doc.m?.includes(query.method)) return false;
    if (query.route !== undefined) {
        const route = doc.r ? normalizeRoute(doc.r) : undefined;
        if (route === undefined || !route.startsWith(query.route)) return false;
    }
    if (query.status !== undefined && (doc.k !== "error" || doc.n !== query.status)) return false;
    return true;
}

/**
 * Folds a whole text the way the index folds its terms, words joined by one space.
 *
 * @param text - Text typed in the search field
 * @returns The words lower-cased and stripped of diacritics, joined by one space
 */
function foldText(text: string): string {
    return text
        .split(/[\s\p{P}]+/u)
        .map((word) => foldTerm(word) ?? "")
        .filter(Boolean)
        .join(" ");
}

/**
 * Runs a query on an index: full-text search ranked with the kind and exact-name boosts, then the
 * filters. A query made of filters only lists the documents that pass them, endpoints first.
 *
 * @param index - Index of one version and language
 * @param query - Parsed query
 * @returns Matching documents, best first; empty for an empty query
 */
export function searchDocs(index: SearchIndex, query: SearchQuery): SearchDoc[] {
    if (query.text) {
        const whole = foldText(query.text);
        const boostDocument = (id: string) => {
            const doc = index.byKey.get(id);
            if (!doc) return 1;
            return KIND_BOOST[doc.k] * (foldText(doc.t) === whole ? EXACT_BOOST : 1);
        };
        return index.mini
            .search(query.text, { boostDocument })
            .map((hit) => index.byKey.get(String(hit.id)))
            .filter((doc): doc is SearchDoc => doc !== undefined && matchesFilters(doc, query));
    }
    if (!query.method && query.route === undefined && query.status === undefined) return [];
    const kept = index.docs.filter((doc) => matchesFilters(doc, query));
    return [
        ...kept.filter((doc) => doc.k === "endpoint"),
        ...kept.filter((doc) => doc.k !== "endpoint"),
    ];
}

/**
 * Groups ranked results for the palette in the order Endpoints, Parameters, Errors, Pages,
 * keeping the rank order inside each group.
 *
 * @param docs - Ranked results
 * @param limit - Rows kept per group
 * @returns The non-empty groups
 */
export function groupDocs(docs: readonly SearchDoc[], limit = GROUP_LIMIT): SearchGroup[] {
    const groups = new Map<SearchGroupId, SearchDoc[]>();
    for (const doc of docs) {
        const id = GROUP_OF[doc.k];
        const list = groups.get(id) ?? [];
        if (list.length < limit) list.push(doc);
        groups.set(id, list);
    }
    return GROUP_ORDER.flatMap((id) => {
        const list = groups.get(id);
        return list?.length ? [{ id, docs: list }] : [];
    });
}

/**
 * Counts results per palette group, for "6 results: 2 endpoints, 2 parameters...".
 *
 * @param docs - Results of a query
 * @returns The number of documents in each group
 */
export function countKinds(docs: readonly SearchDoc[]): SearchCounts {
    const counts: SearchCounts = { endpoints: 0, params: 0, errors: 0, pages: 0 };
    for (const doc of docs) {
        const group = GROUP_OF[doc.k];
        if (group !== "recent" && group !== "suggestions") counts[group] += 1;
    }
    return counts;
}

/**
 * Gives the allowed edit distance of a word in the "Did you mean" search: one up to three letters,
 * two from four letters, so that a swap of two letters ("hsah") is found.
 *
 * @param term - Word of the query
 * @returns The maximum edit distance
 */
function suggestionDistance(term: string): number {
    return term.length <= 3 ? 1 : 2;
}

/**
 * Measures how far two words are when a swap of two neighbour letters counts as one edit
 * (optimal string alignment), the typing error that the suggestion ranks first.
 *
 * @param a - Folded word typed
 * @param b - Folded candidate word
 * @returns The number of insertions, deletions, substitutions and swaps
 */
export function typoDistance(a: string, b: string): number {
    const d = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (__, j) => (i === 0 ? j : j === 0 ? i : 0)),
    );
    for (let i = 1; i <= a.length; i += 1) {
        for (let j = 1; j <= b.length; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
            }
        }
    }
    return d[a.length][b.length];
}

/**
 * Proposes another query when a text query finds nothing ("Did you mean"). The fuzzy candidates
 * of MiniSearch whose results pass the filters are ranked by typo distance to the typed words,
 * then by the number of endpoints and of results they find.
 *
 * @param index - Index of one version and language
 * @param query - Parsed query that found nothing
 * @returns The suggested words (folded, as indexed), or null when there is none
 */
export function suggestQuery(index: SearchIndex, query: SearchQuery): string | null {
    if (!query.text) return null;
    const typed = foldText(query.text);
    const words = typed.split(" ");
    const scored = index.mini
        .autoSuggest(query.text, { prefix: false, fuzzy: suggestionDistance })
        .slice(0, SUGGESTION_CANDIDATES)
        .filter((candidate) => candidate.suggestion !== typed)
        .map((candidate) => {
            const hits = searchDocs(index, { ...query, text: candidate.suggestion });
            const terms = candidate.suggestion.split(" ");
            const distance = words.reduce(
                (sum, word, i) => sum + typoDistance(word, terms[i] ?? ""),
                Math.abs(terms.length - words.length),
            );
            const endpoints = hits.filter((doc) => doc.k === "endpoint").length;
            return { suggestion: candidate.suggestion, distance, endpoints, total: hits.length };
        })
        .filter((candidate) => candidate.total > 0)
        .sort((a, b) => a.distance - b.distance || b.endpoints - a.endpoints || b.total - a.total);
    return scored[0]?.suggestion ?? null;
}

/**
 * Lists the suggestions of the empty palette that the index has, as page documents.
 *
 * @param index - Index of one version and language
 * @param lang - Language of the index, for the page paths
 * @param version - Version of the index
 * @returns The documents found, in suggestion order
 */
export function suggestedDocs(index: SearchIndex, lang: Lang, version: Version): SearchDoc[] {
    return SUGGESTED.flatMap((slug) => {
        const doc = index.byKey.get(`${href(lang, version, slug)}#`);
        return doc ? [doc] : [];
    });
}

/**
 * Lists the parameter rows of the page of a result, for the preview ("First parameter",
 * "+ 2 more parameters: method, encoding").
 *
 * @param index - Index of one version and language
 * @param doc - Any result of a page
 * @returns The parameter documents of that page, in document order
 */
export function pageParams(index: SearchIndex, doc: SearchDoc): SearchDoc[] {
    return index.docs.filter((other) => other.k === "param" && other.u === doc.u);
}

/**
 * Gives the Playground URL that opens a result in the Playground (Ctrl or Cmd+Enter in the
 * palette): "?endpoint=<page id>" for an endpoint page with an operation. The picker lists the
 * catalogue of the version, so an unlisted entry and a page that only embeds a Try give none.
 *
 * @param doc - Result whose page path is read
 * @param nav - Navigation index, the kinds and methods of the pages per version
 * @returns The URL, or null when the result cannot be tried
 */
export function playgroundHref(doc: SearchDoc, nav: Nav): string | null {
    const { lang, version, slug } = parsePath(doc.u);
    if (!version || !slug) return null;
    const def = VERSIONS.find((candidate) => candidate.id === version);
    if (!def?.playground || !hasPage(nav, version, "playground")) return null;
    if (!hasPage(nav, version, slug)) return null;
    const page = nav[version][slug];
    if (page.kind !== "endpoint" || page.methods.length === 0) return null;
    const entry = catalogueEntry(slug);
    if (entry && !isListed(entry, version)) return null;
    return `${href(lang, version, "playground")}?endpoint=${slug}`;
}
