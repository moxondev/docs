import { splitMarks } from "@/components/search/marks";

export interface MarkedProps {
    text: string;
    words: readonly string[];
}

/**
 * Prints a line of a result with the typed words in bold: a heavier weight and the ink colour,
 * never another colour. The weight of the bold is set by the line that holds it.
 *
 * @param text - Line of a result row, split where a typed word starts a word of it
 * @param words - Folded words of the query, from queryWords
 */
export function Marked({ text, words }: MarkedProps) {
    return (
        <>
            {splitMarks(text, words).map((piece, at) =>
                piece.hit ? (
                    <b key={at} className="text-ink">
                        {piece.text}
                    </b>
                ) : (
                    piece.text
                ),
            )}
        </>
    );
}
