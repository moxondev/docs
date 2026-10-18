export type ShortcutId =
    "lang" | "version" | "theme" | "search" | "searchSlash" | "send" | "playground" | "close";

export type ShortcutScope = "global" | "try" | "search";

export interface Shortcut {
    id: ShortcutId;
    key: string;
    code?: string;
    alt?: boolean;
    mod?: boolean;
    scope: ShortcutScope;
    passive?: boolean;
}

// Alt shortcuts match the physical key (code): on macOS, Option+L types another character
export const SHORTCUTS: Shortcut[] = [
    { id: "lang", key: "l", code: "KeyL", alt: true, scope: "global" },
    { id: "version", key: "v", code: "KeyV", alt: true, scope: "global" },
    { id: "theme", key: "t", code: "KeyT", alt: true, scope: "global" },
    { id: "search", key: "k", mod: true, scope: "global" },
    { id: "searchSlash", key: "/", scope: "global" },
    { id: "send", key: "Enter", mod: true, scope: "try", passive: true },
    { id: "playground", key: "Enter", mod: true, scope: "search", passive: true },
    { id: "close", key: "Escape", scope: "global", passive: true },
];
