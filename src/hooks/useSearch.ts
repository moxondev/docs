import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { usePreference } from "@/hooks/usePreference";
import { createStore, type Store } from "@/hooks/useStore";
import {
    countKinds,
    createIndex,
    docHref,
    docKey,
    groupDocs,
    indexUrl,
    parseQuery,
    RECENT_KEY,
    RECENT_MAX,
    type SearchCounts,
    searchDocs,
    type SearchIndex,
    suggestedDocs,
    suggestQuery,
} from "@/lib/search";
import type { Lang, Version } from "@/types/content";
import type { SearchDoc, SearchGroup, SearchQuery } from "@/types/search";

export type IndexStatus = "idle" | "loading" | "ready" | "error";

export interface IndexState {
    status: IndexStatus;
    index: SearchIndex | null;
}

export interface SearchSuggestion {
    text: string;
    total: number;
    counts: SearchCounts;
}

export interface SearchSettings {
    version: Version;
    lang: Lang;
    active: boolean;
    seed?: string;
    autoSelect?: boolean;
}

export interface SearchView {
    status: IndexStatus;
    index: SearchIndex | null;
    query: string;
    setQuery: (value: string) => void;
    parsed: SearchQuery;
    groups: SearchGroup[];
    rows: SearchDoc[];
    total: number;
    counts: SearchCounts;
    suggestion: SearchSuggestion | null;
    selected: SearchDoc | null;
    select: (doc: SearchDoc | null) => void;
    move: (delta: number) => void;
    open: (doc: SearchDoc) => string;
    retry: () => void;
}

export type Fetcher = (url: string) => Promise<Pick<Response, "ok" | "status" | "json">>;

interface Choice {
    query: string;
    key: string | null;
}

// State of an index before its first load, also the snapshot of the server render
export const INDEX_IDLE: IndexState = { status: "idle", index: null };

// Longest wait for an idle period before the index is built anyway, in milliseconds
const IDLE_TIMEOUT = 500;

// One store per index file, shared by every palette of the tab and kept across navigations
const STORES = new Map<string, Store<IndexState>>();

/**
 * Gives the store of the index of a version and language, created on first use.
 *
 * @param version - With lang, the key of the store: one store per index file
 * @param lang - With version, the key of the store: one store per index file
 * @returns The store, a module-level singleton per index file
 */
export function indexStore(version: Version, lang: Lang): Store<IndexState> {
    const key = indexUrl(version, lang);
    let store = STORES.get(key);
    if (!store) {
        store = createStore<IndexState>(INDEX_IDLE);
        STORES.set(key, store);
    }
    return store;
}

/**
 * Runs work in an idle period of the main thread (within IDLE_TIMEOUT), so that building the
 * MiniSearch index never delays the opening of the palette.
 *
 * @param work - Synchronous function; its result or exception settles the returned promise
 * @returns A promise of what work returns, rejected when work throws
 */
function whenIdle<T>(work: () => T): Promise<T> {
    return new Promise((resolve, reject) => {
        const run = () => {
            try {
                resolve(work());
            } catch (error) {
                reject(error);
            }
        };
        if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
            window.requestIdleCallback(run, { timeout: IDLE_TIMEOUT });
        } else setTimeout(run, 0);
    });
}

/**
 * Loads the index file of a version and language once, then builds the MiniSearch index in an
 * idle period. The state goes from idle to loading only after a microtask, so calling it from an
 * effect never re-renders synchronously.
 *
 * @param version - Version whose index to load
 * @param lang - Language whose index to load
 * @param fetcher - fetch, or a stand-in in the tests
 */
export async function loadIndex(
    version: Version,
    lang: Lang,
    fetcher: Fetcher = (url) => fetch(url),
): Promise<void> {
    const store = indexStore(version, lang);
    if (store.get().status === "loading" || store.get().status === "ready") return;
    await Promise.resolve();
    if (store.get().status === "loading" || store.get().status === "ready") return;
    store.set({ status: "loading", index: null });
    try {
        const response = await fetcher(indexUrl(version, lang));
        if (!response.ok) throw new Error(`search index answered ${response.status}`);
        const docs = (await response.json()) as SearchDoc[];
        const index = await whenIdle(() => createIndex(docs));
        store.set({ status: "ready", index });
    } catch {
        store.set({ status: "error", index: null });
    }
}

/**
 * Reads the recent results saved under moxon-recent.
 *
 * @param stored - Raw stored value: a JSON array of document keys, newest first
 * @returns The keys; empty when nothing or something unreadable is stored
 */
export function readRecent(stored: string | null): string[] {
    if (!stored) return [];
    try {
        const value: unknown = JSON.parse(stored);
        return Array.isArray(value)
            ? value.filter((key): key is string => typeof key === "string").slice(0, RECENT_MAX)
            : [];
    } catch {
        return [];
    }
}

/**
 * Puts a result first in the recent list, without a duplicate and at most RECENT_MAX long.
 *
 * @param recent - Keys saved so far, newest first
 * @param key - Key of the result just opened
 * @returns The new list, ready for JSON.stringify
 */
export function pushRecent(recent: readonly string[], key: string): string[] {
    return [key, ...recent.filter((other) => other !== key)].slice(0, RECENT_MAX);
}

/**
 * Builds the groups of the empty palette: the recent results that the index still has, then the
 * suggestions that are not already recent.
 *
 * @param index - Index of the version and language shown
 * @param recent - Keys of the recent results, newest first
 * @param lang - With version, builds the page paths of the suggestions
 * @param version - With lang, builds the page paths of the suggestions
 * @returns The non-empty groups "recent" and "suggestions"
 */
export function emptyGroups(
    index: SearchIndex,
    recent: readonly string[],
    lang: Lang,
    version: Version,
): SearchGroup[] {
    const recents = recent.flatMap((key) => {
        const doc = index.byKey.get(key);
        return doc ? [doc] : [];
    });
    const seen = new Set(recents.map(docKey));
    const suggestions = suggestedDocs(index, lang, version).filter((doc) => !seen.has(docKey(doc)));
    const groups: SearchGroup[] = [];
    if (recents.length) groups.push({ id: "recent", docs: recents });
    if (suggestions.length) groups.push({ id: "suggestions", docs: suggestions });
    return groups;
}

/**
 * Picks the selected row: the one chosen for the current query when it is still listed, else
 * the first row on desktop and none on a phone.
 *
 * @param rows - Rows shown, in display order
 * @param choice - Row chosen by hover, arrows or tap, with the query it was chosen for
 * @param query - Current text of the search field
 * @param autoSelect - Whether the first row is selected by default (desktop)
 * @returns The key of the selected row, or null
 */
export function selectedKey(
    rows: readonly SearchDoc[],
    choice: Choice | null,
    query: string,
    autoSelect: boolean,
): string | null {
    if (choice && choice.query === query) {
        if (choice.key === null || rows.some((doc) => docKey(doc) === choice.key)) {
            return choice.key;
        }
    }
    return autoSelect && rows[0] ? docKey(rows[0]) : null;
}

/**
 * Moves a selection through the rows with wrap-around (arrow keys); from no selection, down
 * selects the first row and up the last.
 *
 * @param rows - Rows shown, in display order
 * @param current - Key of the selected row, or null
 * @param delta - Rows to move, 1 for down and -1 for up
 * @returns The key of the new selection, or null when there is no row
 */
export function movedKey(
    rows: readonly SearchDoc[],
    current: string | null,
    delta: number,
): string | null {
    if (rows.length === 0) return null;
    const at = current === null ? -1 : rows.findIndex((doc) => docKey(doc) === current);
    const start = at === -1 ? (delta > 0 ? -1 : 0) : at;
    const next = (((start + delta) % rows.length) + rows.length) % rows.length;
    return docKey(rows[next]);
}

/**
 * Gives the snapshot of the server render: no index is ever loaded there.
 *
 * @returns The idle state
 */
function serverState(): IndexState {
    return INDEX_IDLE;
}

/**
 * Gives the search state of the palette: it loads the index of the version being viewed when the
 * palette opens, ranks and groups the results, keeps the recent ones and owns the selection. The
 * palette keys it on the session of usePalette, so each opening starts from the seed.
 *
 * @param settings - version and lang of the index, active (the palette is open: load now), seed
 * (initial query) and autoSelect (desktop: select the first row on each query change)
 * @returns The state and the actions of the search
 */
export function useSearch(settings: SearchSettings): SearchView {
    const { version, lang, active, seed = "", autoSelect = true } = settings;
    const store = indexStore(version, lang);
    const state = useSyncExternalStore(store.subscribe, store.get, serverState);
    const [query, setQuery] = useState(seed);
    const [choice, setChoice] = useState<Choice | null>(null);
    const [stored, setStored] = usePreference(RECENT_KEY);

    useEffect(() => {
        if (active) void loadIndex(version, lang);
    }, [active, version, lang]);

    const parsed = useMemo(() => parseQuery(query), [query]);
    const empty =
        !parsed.text && !parsed.method && parsed.route === undefined && parsed.status === undefined;
    const results = useMemo(
        () => (state.index ? searchDocs(state.index, parsed) : []),
        [state.index, parsed],
    );
    const recent = useMemo(() => readRecent(stored), [stored]);
    const groups = useMemo(() => {
        if (!state.index) return [];
        return empty ? emptyGroups(state.index, recent, lang, version) : groupDocs(results);
    }, [state.index, empty, recent, lang, version, results]);
    const rows = useMemo(() => groups.flatMap((group) => group.docs), [groups]);
    const suggestion = useMemo(() => {
        if (!state.index || empty || results.length > 0) return null;
        const text = suggestQuery(state.index, parsed);
        if (!text) return null;
        const found = searchDocs(state.index, { ...parsed, text });
        return { text, total: found.length, counts: countKinds(found) };
    }, [state.index, empty, results, parsed]);

    const key = selectedKey(rows, choice, query, autoSelect);
    const selected = rows.find((doc) => docKey(doc) === key) ?? null;

    const select = useCallback(
        (doc: SearchDoc | null) => setChoice({ query, key: doc ? docKey(doc) : null }),
        [query],
    );
    const move = useCallback(
        (delta: number) => setChoice({ query, key: movedKey(rows, key, delta) }),
        [query, rows, key],
    );
    const open = useCallback(
        (doc: SearchDoc) => {
            setStored(JSON.stringify(pushRecent(recent, docKey(doc))));
            return docHref(doc);
        },
        [recent, setStored],
    );
    const retry = useCallback(() => {
        if (store.get().status !== "error") return;
        store.set(INDEX_IDLE);
        void loadIndex(version, lang);
    }, [store, version, lang]);

    return {
        status: state.status,
        index: state.index,
        query,
        setQuery,
        parsed,
        groups,
        rows,
        total: results.length,
        counts: countKinds(results),
        suggestion,
        selected,
        select,
        move,
        open,
        retry,
    };
}
