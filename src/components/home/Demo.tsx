import { useTranslations } from "next-intl";

import { LazySnippet } from "@/components/try/LazySnippet";
import { Tokens } from "@/components/try/Tokens";
import { HOME_DEMO } from "@/data/home";
import { SITE } from "@/data/site";
import { highlight } from "@/lib/highlight";
import { STATUS_TEXT } from "@/lib/request";

/**
 * Static example of the hero: the dark card of the code samples with the documented sha256
 * request in every code language, then the recorded answer of the API. Nothing is sent, so the
 * home makes no request; the code area keeps its height while its chunk loads.
 */
export function Demo() {
    const t = useTranslations("home");
    const response = useTranslations("response");
    const { version, method, path, body, status, response: answer } = HOME_DEMO;
    const request = { method, url: `${SITE.api}/${version}${path}`, body };
    const lines = highlight(JSON.stringify(answer, null, 2), "json");

    return (
        <figure className="m-0 min-w-0">
            <div className="overflow-hidden rounded-table border border-code-edge bg-code-bg text-code-text shadow-demo home:rounded-panel">
                <LazySnippet request={request} variant="panel" className="min-h-54.75" />
                <div className="flex items-center gap-2.5 border-y border-code-line bg-code-bar px-4 py-2.5 text-xs text-code-dim">
                    <span className="font-medium tracking-[0.08em] uppercase">
                        {response("title")}
                    </span>
                    <span className="inline-flex items-center gap-1.75 font-mono text-ok">
                        <span aria-hidden="true" className="size-1.75 rounded-full bg-ok-dot" />
                        {`${status} ${STATUS_TEXT[status]}`}
                    </span>
                </div>
                <pre
                    tabIndex={0}
                    className="scroll-dark overflow-x-auto px-4 pt-3 pb-4.5 font-mono text-[13.5px]/[1.7]"
                >
                    <Tokens lines={lines} wrap />
                </pre>
            </div>
            <figcaption className="mt-3 text-[14px] text-muted">
                {t.rich("demo", {
                    code: (chunks) => (
                        <code className="rounded-tag bg-chip px-1.5 py-px font-mono text-[13.5px] text-text">
                            {chunks}
                        </code>
                    ),
                })}
            </figcaption>
        </figure>
    );
}
