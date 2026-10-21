import { Fragment } from "react";

import { hangingIndent } from "@/components/try/util";
import { type Token, TOKEN_CLASSES } from "@/lib/highlight";
import { cn } from "@/lib/utils";

export interface TokensProps {
    lines: Token[][];
    wrap?: boolean;
}

export interface LineProps {
    tokens: Token[];
    wrap: boolean;
}

/**
 * Joins the texts of a line back into the string it was highlighted from.
 *
 * @param tokens - Highlighter tokens of a single line, without its newline
 * @returns The line as it was before highlighting, without its newline
 */
function lineText(tokens: Token[]): string {
    return tokens.map((token) => token.text).join("");
}

/**
 * Drops the indentation of the first token of a line, which a wrapped line draws with a text
 * indent instead (collapsed spaces would not survive normal white space).
 *
 * @param tokens - Highlighter tokens of a single line, the first one possibly starting with blanks
 * @returns The tokens without leading blanks and without an empty first token
 */
function trimLead(tokens: Token[]): Token[] {
    const [first, ...rest] = tokens;
    if (!first) return tokens;
    const text = first.text.trimStart();
    return text ? [{ ...first, text }, ...rest] : rest;
}

/**
 * One highlighted line of a code panel. A long JSON string wraps with a hanging indent under its
 * first character, so a hash or a token stays readable on a narrow screen instead of scrolling.
 *
 * @param tokens - Tokens of the line, adjacent kinds already merged
 * @param wrap - True for a JSON answer, whose long string lines wrap
 */
function Line({ tokens, wrap }: LineProps) {
    const hang = wrap ? hangingIndent(lineText(tokens)) : null;
    const shown = hang ? trimLead(tokens) : tokens;

    return (
        <span
            className={cn("block min-h-[1lh]", hang && "break-all whitespace-normal")}
            style={
                hang
                    ? { paddingLeft: `${hang.hang}ch`, textIndent: `${hang.lead - hang.hang}ch` }
                    : undefined
            }
        >
            {shown.map((token, index) => (
                <Fragment key={index}>
                    {token.kind ? (
                        <span className={TOKEN_CLASSES[token.kind]}>{token.text}</span>
                    ) : (
                        token.text
                    )}
                </Fragment>
            ))}
        </span>
    );
}

/**
 * Highlighted lines of a code panel (the snippets and the JSON answer), colored by the
 * token classes of lib/highlight. Render it inside a pre.
 *
 * @param lines - Output of highlight(), one token array per line
 * @param wrap - True to wrap the long string lines of a JSON answer with a hanging indent
 */
export function Tokens({ lines, wrap = false }: TokensProps) {
    return (
        <code className="block">
            {lines.map((tokens, index) => (
                <Line key={index} tokens={tokens} wrap={wrap} />
            ))}
        </code>
    );
}
