import { LATEST } from "@/data/versions";
import { href, INDEX, type PageIndex, parsePath, segments } from "@/lib/routes";

// Longest edit distance a suggestion may be from the address, however long the page id
const MAX_DISTANCE = 3;

/**
 * Measures how far two words are by the optimal string alignment distance: the number of
 * insertions, deletions, substitutions and swaps of two neighbouring letters that turn one into
 * the other, so that a swapped pair of letters ("hahs") costs one, like a missing one ("hsh").
 *
 * @param a - First word
 * @param b - Second word
 * @returns The distance, 0 for equal words
 */
export function editDistance(a: string, b: string): number {
    const rows: number[][] = [];
    for (let i = 0; i <= a.length; i++) {
        rows.push([i]);
    }
    for (let j = 1; j <= b.length; j++) {
        rows[0][j] = j;
    }
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            let best = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                best = Math.min(best, rows[i - 2][j - 2] + 1);
            }
            rows[i][j] = best;
        }
    }
    return rows[a.length][b.length];
}

/**
 * Picks the page id that a mistyped one most likely meant: the nearest by edit distance, the
 * first of the list on a tie, and nothing when even the nearest is too far. The allowed distance
 * grows with the word, so that a short typo finds its page but an unrelated word finds nothing.
 *
 * @param ids - Candidate page ids, in the order that breaks ties
 * @param wanted - The id from the address, compared in lower case
 * @returns The nearest id, or null when none is close enough
 */
export function closestId(ids: Iterable<string>, wanted: string): string | null {
    const word = wanted.toLowerCase();
    const allowed = Math.min(MAX_DISTANCE, Math.max(1, Math.floor(word.length / 3)));
    let found: string | null = null;
    let best = allowed + 1;
    for (const id of ids) {
        if (Math.abs(id.length - word.length) > allowed) continue;
        const distance = editDistance(word, id);
        if (distance < best) {
            best = distance;
            found = id;
        }
    }
    return found;
}

/**
 * Suggests the page a wrong address most likely meant: the nearest page id of the version in the
 * address, or of the latest version for a bare address. The smart redirect sends any unknown page
 * of a version to its home first, so in practice only bare addresses reach this question.
 *
 * @param nav - Navigation index (or the kinds index), the pages that exist per version
 * @param pathname - Wrong address, such as "/fr/hsh" or "/fr/v6/hsh"
 * @returns The path of the suggested page in the language of the address, such as "/fr/v6/hash/";
 *     null for a version home or when no page is near
 */
export function suggestPath(nav: PageIndex, pathname: string): string | null {
    const { lang, version = LATEST, slug = bareSlug(pathname) } = parsePath(pathname);
    if (slug === "" || slug === INDEX) return null;
    const ids = Object.keys(nav[version])
        .filter((id) => id !== INDEX)
        .sort();
    const id = closestId(ids, withoutSuffix(decode(slug)));
    return id === null ? null : href(lang, version, id);
}

/**
 * Decodes the percent escapes of a path part, leaving it as typed when they are malformed.
 *
 * @param value - Part of an address
 * @returns The decoded text, or the value itself when it is not valid percent encoding
 */
function decode(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

/**
 * Drops the .html suffix of a legacy address and the spaces around the word, so that
 * "/hsh.html" and "/hash%20" are read as the words "hsh" and "hash".
 *
 * @param word - Decoded part of an address
 * @returns The word without its suffix and its surrounding spaces
 */
function withoutSuffix(word: string): string {
    return word.replace(/\.html$/i, "").trim();
}

/**
 * Reads the page id of an address that holds no version: everything after the language prefix.
 *
 * @param pathname - Address without a version, such as "/fr/hsh/"
 * @returns The segments after the optional "fr" joined with a slash, empty for the home
 */
function bareSlug(pathname: string): string {
    const parts = segments(pathname);
    return (parts[0] === "fr" ? parts.slice(1) : parts).join("/");
}

/**
 * Reads the search term hidden in a wrong address: its last segment, decoded, which is what the
 * visitor most likely wanted to find ("hsh" for "/fr/v6/hsh/"), without a .html suffix and
 * trimmed, so that the field and the palette never start from blanks.
 *
 * @param pathname - Wrong address
 * @returns The last path segment, an empty string when the address has none
 */
export function searchTerm(pathname: string): string {
    return withoutSuffix(decode(segments(pathname).at(-1) ?? ""));
}
