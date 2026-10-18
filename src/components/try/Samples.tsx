"use client";

import { useTranslations } from "next-intl";

import { generateSnippet, SNIPPET_LANGS } from "@/lib/snippets";
import type { SamplesProps } from "@/types/try";

/**
 * Placeholder of the "Code examples" block: the dark code area with its four language labels
 * and the cURL snippet of the documented request, without tabs or copy.
 *
 * @param request - Request of the examples block, prepared on the server by exampleRequest
 */
export function Samples({ request }: SamplesProps) {
    const t = useTranslations("snippet");

    return (
        <div
            data-stub="samples"
            className="scroll-dark overflow-hidden rounded-table bg-code-bg text-code-text"
        >
            <div className="flex h-10.5 items-center gap-0.5 border-b border-code-line px-2">
                {SNIPPET_LANGS.map((lang) => (
                    <span
                        key={lang}
                        className="rounded-row px-2.25 py-1 text-xs text-code-punct first:bg-code-tab first:text-code-sel"
                    >
                        {t(`languages.${lang}`)}
                    </span>
                ))}
            </div>
            <pre
                tabIndex={0}
                className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.7]"
            >
                {generateSnippet("curl", request)}
            </pre>
        </div>
    );
}
