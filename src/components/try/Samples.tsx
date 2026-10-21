import { LazySnippet } from "@/components/try/LazySnippet";
import type { SamplesProps } from "@/types/try";

/**
 * The "Code examples" block of an endpoint page, on every viewport: the language tabs and the
 * copy button over the documented request. It is a Snippet, so the language chosen here is the
 * one the Try panel opens with, on this page and the next. The code area loads after hydration.
 *
 * @param request - Request of the examples block, prepared on the server by exampleRequest
 */
export function Samples({ request }: SamplesProps) {
    return <LazySnippet request={request} variant="block" />;
}
