import type { Method } from "@/types/content";

export type SearchKind = "endpoint" | "param" | "field" | "error" | "section" | "page";

export interface SearchDoc {
    k: SearchKind;
    t: string;
    u: string;
    h?: string;
    r?: string;
    m?: Method[];
    d?: string;
    n?: number;
    p?: string;
    x?: string;
}

export interface SearchQuery {
    text: string;
    method?: Method;
    route?: string;
    status?: number;
}

export type SearchGroupId = "endpoints" | "params" | "errors" | "pages" | "recent" | "suggestions";

export interface SearchGroup {
    id: SearchGroupId;
    docs: SearchDoc[];
}
