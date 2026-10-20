export type Lang = "en" | "fr";
export type Version = "v1" | "v2" | "v3" | "v4" | "v5" | "v6";
export type Method = "get" | "post" | "put" | "patch" | "delete";
export type JsonValue =
    string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface Loc<T> {
    en: T;
    fr: T;
}

export type Lx<T> = T | Loc<T>;

export type Inline = string;

export type CalloutKind = "info" | "tip" | "warning" | "danger";
export type CodeLang = "json" | "bash" | "html" | "js" | "diff" | "http" | "text";
export type PageKind =
    "index" | "endpoint" | "article" | "pricing" | "playground" | "changelog" | "release";

export type PageStatus = "experimental" | "beta" | "deprecated";

export interface Page {
    version: Version;
    id: string;
    kind: PageKind;
    status?: PageStatus;
    title: Loc<Inline>;
    lead?: Lx<Inline>;
    banner?: true;
    updated?: string;
    operations?: Operation[];
    release?: Release;
    sections: Section[];
}

export interface Release {
    version: string;
    url: string;
    summary: Lx<Inline>;
}

export interface Section {
    id: string;
    level?: 2 | 3;
    title?: Loc<Inline>;
    aliases?: string[];
    only?: Lang;
    blocks: Block[];
}

export interface Operation {
    id: string;
    method: Method;
    path: string;
    try: boolean;
    params: ParamSpec[];
}

export interface ParamSpec {
    name: string;
    type: "string" | "number" | "boolean" | "enum" | "json";
    in: "query" | "body" | "path";
    required: boolean | "conditional";
    default?: string;
    options?: string[];
    featured?: string[];
    placeholder?: string;
    value?: string;
}

export type Block =
    | { type: "p"; text: Lx<Inline> }
    | { type: "label"; text: Lx<Inline> }
    | { type: "list"; ordered?: true; items: Lx<Inline>[] }
    | { type: "quote"; text: Lx<Inline> }
    | { type: "rule" }
    | { type: "callout"; kind: CalloutKind; title: Lx<Inline>; body: Lx<CalloutPart[]> }
    | { type: "details"; title: Lx<Inline>; body: Block[] }
    | { type: "values"; title: Lx<Inline>; groups: { label: Lx<Inline>; items: string[] }[] }
    | { type: "code"; lang?: CodeLang; text: Lx<string>; role?: "request" | "response" | "curl" }
    | {
          type: "table";
          head: Lx<Inline[]>;
          rows: Lx<Inline>[][];
          kind?: "definition" | "matrix" | "list";
      }
    | ParamsTable
    | FieldsTable
    | ErrorsTable
    | { type: "endpoint"; op: string }
    | { type: "examples"; op: string; path?: string; query?: Sample; body?: Sample }
    | { type: "try"; op: string; autoSend?: true }
    | { type: "related"; items: RelatedItem[] }
    | { type: "plans" }
    | { type: "playground" }
    | { type: "split"; en: Block[]; fr: Block[] };

export type CalloutPart = { type: "p"; text: Inline } | { type: "list"; items: Inline[] };
export type Sample = Lx<Record<string, JsonValue>>;

export interface ParamsTable {
    type: "params";
    columns?: "default-after-description";
    rows: {
        name: string;
        required: boolean | "conditional";
        default?: Lx<Inline>;
        description: Lx<Inline>;
    }[];
}

export interface FieldsTable {
    type: "fields";
    rows: { name: string; type: Lx<Inline>; description: Lx<Inline> }[];
}

export interface ErrorsTable {
    type: "errors";
    short?: true;
    rows: { message: string; description: Lx<Inline>; status?: number }[];
}

export interface RelatedItem {
    label: string;
    to: string;
    description: Lx<Inline>;
}
