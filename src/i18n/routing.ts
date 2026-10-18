import type { AbstractIntlMessages } from "next-intl";
import { defineRouting } from "next-intl/routing";

/**
 * A static export has no middleware: the route groups (site) and (fr) make English live at / and
 * French at /fr/, so the prefix setting only documents that, and no locale cookie is ever set.
 */
export const routing = defineRouting({
    locales: ["en", "fr"],
    defaultLocale: "en",
    localePrefix: "as-needed",
    localeCookie: false,
});

export type AppLocale = (typeof routing.locales)[number];

// Storage key of the chosen language, kept from the former site so saved choices carry over
export const LOCALE_KEY = "lang";

// Region tag of each locale, for Intl formatters; og:locale writes it with an underscore
export const LOCALE_TAGS: Record<AppLocale, string> = { en: "en-US", fr: "fr-FR" };

// One JSON file per namespace under messages/<locale>/, merged by request.ts in this order
export const MESSAGE_FILES = [
    "common",
    "aria",
    "meta",
    "header",
    "menu",
    "sidebar",
    "crumbs",
    "endpoint",
    "try",
    "snippet",
    "response",
    "search",
    "home",
    "catalogue",
    "footer",
    "banner",
    "notfound",
    "pricing",
    "changelog",
    "playground",
    "shortcuts",
] as const;

export type Namespace = (typeof MESSAGE_FILES)[number];

export type Messages = Record<Namespace, AbstractIntlMessages>;

export type ClientTree = "root" | "page" | "try" | "playground" | "search" | "home";

/**
 * Namespaces handed to the NextIntlClientProvider of each client tree. A nested provider replaces
 * the messages of the outer one instead of merging them, so each list repeats the namespaces of its
 * parent tree; scripts/messages.ts checks that, and maps each source folder to its tree.
 */
export const CLIENT_NAMESPACES = {
    root: ["common", "aria", "header", "menu", "footer", "banner"],
    page: ["common", "aria", "header", "menu", "footer", "banner", "endpoint", "sidebar", "crumbs"],
    try: [
        "common",
        "aria",
        "header",
        "menu",
        "footer",
        "banner",
        "endpoint",
        "sidebar",
        "crumbs",
        "try",
        "snippet",
        "response",
    ],
    playground: [
        "common",
        "aria",
        "header",
        "menu",
        "footer",
        "banner",
        "endpoint",
        "sidebar",
        "crumbs",
        "try",
        "snippet",
        "response",
        "playground",
    ],
    search: ["common", "aria", "header", "menu", "footer", "banner", "search"],
    home: [
        "common",
        "aria",
        "header",
        "menu",
        "footer",
        "banner",
        "home",
        "catalogue",
        "snippet",
        "response",
    ],
} as const satisfies Record<ClientTree, readonly Namespace[]>;

/**
 * Tree whose provider encloses the provider of each tree: the Shell holds the root one, the
 * documentation pages the page one, the Try island, the Playground block, the home and the
 * palette their own.
 */
export const CLIENT_PARENT: Record<ClientTree, ClientTree | null> = {
    root: null,
    page: "root",
    try: "page",
    playground: "try",
    search: "root",
    home: "root",
};

/**
 * Address of the home page of a locale: the default one lives at the root, the others under
 * their prefix.
 *
 * @param locale - Locale of the wanted home page, one of routing.locales
 * @returns The path, always with a leading and a trailing slash
 */
export function localePath(locale: AppLocale): string {
    return locale === routing.defaultLocale ? "/" : `/${locale}/`;
}

/**
 * Keeps only the namespaces of one client tree, so that a provider ships the messages its client
 * components read and nothing else.
 *
 * @param messages - Every message of a locale, as loaded by request.ts (getMessages)
 * @param tree - Client tree whose NextIntlClientProvider receives the result
 * @returns The namespaces of CLIENT_NAMESPACES for that tree; a namespace absent from the input
 *   is left out
 */
export function clientMessages(
    messages: AbstractIntlMessages,
    tree: ClientTree,
): AbstractIntlMessages {
    const picked: AbstractIntlMessages = {};
    for (const namespace of CLIENT_NAMESPACES[tree]) {
        const value = messages[namespace];
        if (value !== undefined) picked[namespace] = value;
    }
    return picked;
}
