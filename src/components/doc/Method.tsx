import { cn } from "@/lib/utils";
import type { Method as HttpMethod } from "@/types/content";

export interface MethodProps {
    methods: readonly HttpMethod[];
    variant?: "mark" | "chip" | "tag";
    className?: string;
}

// Text colour of each HTTP method: blue for GET, green for the methods that carry a body
const TONES: Record<HttpMethod, string> = {
    get: "text-get",
    post: "text-post",
    put: "text-post",
    patch: "text-post",
    delete: "text-post",
};

// Text and ground of each HTTP method on a filled chip, the small tag size included
const CHIP_TONES: Record<HttpMethod, string> = {
    get: "bg-get-bg text-get",
    post: "bg-post-bg text-post",
    put: "bg-post-bg text-post",
    patch: "bg-post-bg text-post",
    delete: "bg-post-bg text-post",
};

/**
 * Method mark of an endpoint: a filled chip in the Route bar, or a small tinted chip in the
 * sidebar, the related lists, the search results and the cards of the catalogue. The word says
 * the method, the colour only helps; several methods sit side by side, in the order given.
 *
 * @param methods - Methods to show, in order; none draws nothing
 * @param variant - "chip" for the filled chip of the URL bar, "tag" for the small tinted chip of
 *   the lists, "mark" for the quiet text (the default)
 * @param className - Extra classes for the wrapper, for its width or alignment in a row
 */
export function Method({ methods, variant = "mark", className }: MethodProps) {
    if (methods.length === 0) return null;

    return (
        <span className={cn("inline-flex shrink-0 items-center gap-1.5", className)}>
            {methods.map((method) => (
                <span
                    key={method}
                    className={cn(
                        "font-mono uppercase",
                        variant === "chip" &&
                            cn("rounded-row px-2 py-1 text-xs/4 font-semibold", CHIP_TONES[method]),
                        variant === "tag" &&
                            cn(
                                "rounded-chip px-1.25 py-0.5 text-[11px]/3.25 font-semibold",
                                CHIP_TONES[method],
                            ),
                        variant === "mark" && cn("text-[11px]/4 font-semibold", TONES[method]),
                    )}
                >
                    {method}
                </span>
            ))}
        </span>
    );
}
