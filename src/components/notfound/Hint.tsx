import { CornerDownRightIcon, UnlinkIcon } from "lucide-react";

import type { Say } from "@/components/notfound/say";

export interface HintProps {
    say: Say;
    path: string;
    suggestion: string | null;
}

/**
 * The two quiet lines under the search field of the 404: the address that was asked for and, only
 * when a page of the same version has a near identifier, a "Did you mean" question as a link. The
 * question is hidden when nothing is close: a bad guess is worse than none.
 *
 * @param say - Translator of the notfound messages in the language of the address
 * @param path - The wrong address as it stands in the bar
 * @param suggestion - Path of the page the address most likely meant, null when none is close
 */
export function Hint({ say, path, suggestion }: HintProps) {
    return (
        <ul className="mt-3.5 grid justify-items-center gap-0.5 text-[15px] text-muted">
            <li className="flex min-h-7.5 flex-wrap items-center justify-center gap-x-2">
                <UnlinkIcon aria-hidden="true" className="size-4 shrink-0" />
                <span>{say("asked")}</span>
                <code className="rounded-row bg-chip px-1.75 py-0.5 font-mono text-sm break-all text-ink">
                    {path}
                </code>
            </li>
            {suggestion ? (
                <li className="flex min-h-7.5 flex-wrap items-center justify-center gap-x-2">
                    <CornerDownRightIcon aria-hidden="true" className="size-4 shrink-0" />
                    <span>
                        {say.rich("mean", {
                            path: suggestion,
                            link: (chunks) => (
                                <a
                                    href={suggestion}
                                    className="prose-link inline-flex min-h-11 items-center font-mono text-sm home:min-h-8.5"
                                >
                                    {chunks}
                                </a>
                            ),
                        })}
                    </span>
                </li>
            ) : null}
        </ul>
    );
}
