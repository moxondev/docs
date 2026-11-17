import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface DetailsProps {
    title: ReactNode;
    children: ReactNode;
}

/**
 * Collapsible block of the documentation (the details container): a native details element, so
 * it needs no script, with a chevron that turns when it opens and the title as its summary.
 *
 * @param title - Summary line, as inline nodes
 * @param children - The blocks shown when it is open
 */
export function Details({ title, children }: DetailsProps) {
    return (
        <details className="group/details rounded-box border border-line bg-soft">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                <ChevronRightIcon
                    aria-hidden="true"
                    className="size-4 text-faint transition-transform group-open/details:rotate-90"
                />
                {title}
            </summary>
            <div className="flex flex-col gap-3 border-t border-line-soft px-4 py-3">
                {children}
            </div>
        </details>
    );
}
