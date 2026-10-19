import { useTranslations } from "next-intl";
import { Fragment } from "react";

import { Copy } from "@/components/doc/Copy";
import { highlight, TOKEN_CLASSES } from "@/lib/highlight";
import { pick } from "@/lib/inline";
import { cn } from "@/lib/utils";
import type { Block, Lang } from "@/types/content";

export interface CodeProps {
    block: Extract<Block, { type: "code" }>;
    lang: Lang;
}

/**
 * Code block of the documentation: code tokenized on the server (no script and no highlighter in
 * the client), a copy button, and a caption on the request, response and cURL blocks of the
 * retired versions. The panel takes the focus so that the keyboard can scroll it.
 *
 * @param block - Code block: its text (one per language when it differs), language and role
 * @param lang - Language of the page, which picks the text
 */
export function Code({ block, lang }: CodeProps) {
    const t = useTranslations("endpoint");
    const text = pick(block.text, lang);
    const lines = highlight(text, block.lang);

    return (
        <figure className="scroll-dark relative overflow-hidden rounded-table bg-code-bg text-code-text">
            {block.role ? (
                <figcaption className="flex h-10.5 items-center justify-between border-b border-code-line pr-2 pl-4 text-xs font-medium tracking-[0.08em] text-code-dim uppercase">
                    {t(`code.${block.role}`)}
                    <Copy text={text} />
                </figcaption>
            ) : (
                <Copy text={text} className="absolute top-2 right-2 bg-code-bg" />
            )}
            <pre
                tabIndex={0}
                className={cn(
                    "overflow-x-auto px-4 py-3.5 font-mono text-[13.5px]/[1.7] whitespace-pre",
                    !block.role && "mr-11",
                )}
            >
                <code>
                    {lines.map((line, index) => (
                        <Fragment key={index}>
                            {line.map((token, at) =>
                                token.kind ? (
                                    <span key={at} className={TOKEN_CLASSES[token.kind]}>
                                        {token.text}
                                    </span>
                                ) : (
                                    token.text
                                ),
                            )}
                            {index < lines.length - 1 ? "\n" : null}
                        </Fragment>
                    ))}
                </code>
            </pre>
        </figure>
    );
}
