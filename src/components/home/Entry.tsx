import Link from "next/link";

import { Method } from "@/components/doc/Method";
import { Status } from "@/components/doc/Status";
import type { HomeEntry } from "@/components/home/query";

export interface EntryProps {
    entry: HomeEntry;
}

/**
 * One endpoint of the home catalogue: the name, its method chips, the pictogram of its status when
 * it has one, the route on the right and the short description under them. A row of the grid with
 * a hover ground on a desktop, a flat row between two hairlines on a phone.
 *
 * @param entry - Endpoint to show: name, route, methods, description, link and status
 */
export function Entry({ entry }: EntryProps) {
    return (
        <Link
            href={entry.href}
            prefetch={false}
            className="flex flex-col gap-0.5 py-3 pb-3.25 text-ink home:gap-0.75 home:rounded-field home:px-3 home:pt-2.5 home:pb-2.75 home:hover:bg-search"
        >
            <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="text-[16.5px] font-medium home:text-[16px]">{entry.name}</span>
                <Method methods={entry.methods} variant="tag" />
                {entry.status ? <Status status={entry.status} /> : null}
                <code className="ml-auto font-mono text-xs text-faint">{entry.route}</code>
            </span>
            <span className="text-[14.5px]/[1.5] text-muted home:text-[14px]/[1.5]">
                {entry.tagline}
            </span>
        </Link>
    );
}
