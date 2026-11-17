export interface Piece {
    text: string;
    hit: boolean;
}

/**
 * Folds one character the way the search index folds its terms: diacritics removed, lower case.
 *
 * @param char - One UTF-16 unit or one code point of a text
 * @returns The folded characters, empty for a lone combining mark
 */
function foldChar(char: string): string {
    return char
        .normalize("NFD")
        .replace(/\p{M}+/gu, "")
        .toLowerCase();
}

/**
 * Cuts the words of the typed text, folded, the way the index tokenizes them.
 *
 * @param text - Text part of the parsed query
 * @returns The folded words, none empty
 */
export function queryWords(text: string): string[] {
    return text
        .split(/[\s\p{P}]+/u)
        .map((word) => [...word].map(foldChar).join(""))
        .filter(Boolean);
}

/**
 * Splits a result line into the pieces to print plain and the pieces to print bold: every place
 * where a typed word starts a word of the line, ignoring case and accents (the index searches by
 * prefix). Matches are never coloured, only heavier.
 *
 * @param text - Line of a result row, scanned for the places where a typed word starts a word
 * @param words - Folded words of the query, from queryWords
 * @returns The consecutive pieces, which put back to back give the text again
 */
export function splitMarks(text: string, words: readonly string[]): Piece[] {
    if (words.length === 0 || text === "") return [{ text, hit: false }];

    let flat = "";
    const origin: number[] = [];
    for (let i = 0; i < text.length; i += 1) {
        for (const char of foldChar(text[i])) {
            flat += char;
            origin.push(i);
        }
    }

    const hits = new Array<boolean>(text.length).fill(false);
    for (const word of words) {
        let from = flat.indexOf(word);
        while (from !== -1) {
            const startsWord = from === 0 || !/[\p{L}\p{N}]/u.test(flat[from - 1]);
            if (startsWord) {
                for (let i = from; i < from + word.length; i += 1) hits[origin[i]] = true;
            }
            from = flat.indexOf(word, from + 1);
        }
    }

    const pieces: Piece[] = [];
    for (let i = 0; i < text.length; i += 1) {
        const last = pieces[pieces.length - 1];
        if (last && last.hit === hits[i]) last.text += text[i];
        else pieces.push({ text: text[i], hit: hits[i] });
    }
    return pieces;
}
