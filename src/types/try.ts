import type { CategoryId } from "@/data/catalogue";
import type { PreparedRequest } from "@/lib/request";
import type { Operation, Version } from "@/types/content";

export type TryVariant = "panel" | "inline" | "bench";

export interface TryProps {
    version: Version;
    op: Operation;
    variant?: TryVariant;
    autoSend?: boolean;
    docsHref?: string;
}

export interface BenchProps {
    version: Version;
    op: Operation;
    docsHref: string;
}

export interface BenchBodyProps {
    version: Version;
    op: Operation;
    docsHref: string;
}

export interface BarProps {
    op: Operation;
}

export interface SheetProps {
    version: Version;
    op: Operation;
    name: string;
}

export interface SamplesProps {
    request: PreparedRequest;
}

export interface PlaygroundEntry {
    slug: string;
    name: string;
    category?: CategoryId;
    op: Operation;
}

export interface PlaygroundProps {
    version: Version;
    entries: PlaygroundEntry[];
}
