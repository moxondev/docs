import type { Loc, Method, PageKind, PageStatus, Version } from "@/types/content";

export interface NavPage {
    title: Loc<string>;
    kind: PageKind;
    status?: PageStatus;
    methods: Method[];
    updated?: string;
    summary?: Loc<string>;
}

export type Nav = Record<Version, Record<string, NavPage>>;

export interface SlimMeta {
    name: string;
    category?: string;
    back?: string;
    status?: PageStatus;
    methods: Method[];
}
