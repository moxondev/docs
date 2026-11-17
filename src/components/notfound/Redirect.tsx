export interface RedirectProps {
    label: string;
    target?: string;
}

// Id of the main landmark, the one of Shell (CONTENT_ID), which a client component cannot import
const MAIN = "content";

/**
 * Body shown while the browser follows a redirect, with the same words as the generated redirect
 * files of the legacy URLs: a polite status line and, when the target is known, a link to it that
 * works without JavaScript. The 404 page renders it in place of its text while it redirects.
 *
 * @param label - Sentence to print, already in the language of the visitor
 * @param target - Site path the visitor is sent to; the sentence becomes a link to it when given
 */
export function Redirect({ label, target }: RedirectProps) {
    return (
        <main id={MAIN} tabIndex={-1} className="mx-auto max-w-205 px-6 pt-16 pb-18">
            <p role="status" className="text-base/[1.65] text-text">
                {target ? (
                    <a href={target} className="prose-link">
                        {label}
                    </a>
                ) : (
                    label
                )}
            </p>
        </main>
    );
}
