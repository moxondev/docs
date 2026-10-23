import { useTranslations } from "next-intl";

import { LazySnippet } from "@/components/try/LazySnippet";
import { Tokens } from "@/components/try/Tokens";
import { HOME_DEMO } from "@/data/home";
import { SITE } from "@/data/site";
import { highlight } from "@/lib/highlight";
import { STATUS_TEXT } from "@/lib/request";

/**
 * Static example of the hero: the quiet code card of the Try panel with the documented sha256
 * request in every code language, then the recorded answer. Nothing is sent.
 */
export function Demo() {
    const t = useTranslations("home");
    const response = useTranslations("response");
    const { version, method, path, body, status, response: answer } = HOME_DEMO;
    const request = { method, url: `${SITE.api}/${version}${path}`, body };
    const lines = highlight(JSON.stringify(answer, null, 2), "json");

    return (
        <figure className="m-0 min-w-0">
            <div className="code-quiet overflow-hidden rounded-table border border-code-edge bg-search text-code-text shadow-demo home:rounded-panel">
                <LazySnippet request={request} variant="quiet" className="min-h-54.75" />
                <div className="border-t border-code-line">
                    <span className="block px-4 pt-2.5 text-[13px] font-medium text-muted">
                        {response("title")}
                    </span>
                    <span className="block px-4 pt-1.5 text-[14px] font-semibold text-ink">
                        {`${status} ${STATUS_TEXT[status]}`}
                    </span>
                    <pre
                        tabIndex={0}
                        className="overflow-x-auto px-4 pt-3.5 pb-4.5 font-mono text-[13.5px]/[1.7]"
                    >
                        <Tokens lines={lines} wrap />
                    </pre>
                </div>
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
